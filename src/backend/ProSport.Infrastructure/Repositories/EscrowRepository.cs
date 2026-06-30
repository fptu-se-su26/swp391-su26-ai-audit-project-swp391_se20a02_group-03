using Microsoft.EntityFrameworkCore;
using ProSport.Application.Interfaces;
using ProSport.Domain.Constants;
using ProSport.Domain.Entities;
using ProSport.Infrastructure.Data;

namespace ProSport.Infrastructure.Repositories;

public class EscrowRepository : IEscrowRepository
{
    private readonly ProSportDbContext _context;

    public EscrowRepository(ProSportDbContext context)
    {
        _context = context;
    }

    public async Task<EscrowWallet?> GetWalletByUserIdAsync(int userId)
    {
        return await _context.EscrowWallets.FirstOrDefaultAsync(w => w.UserId == userId);
    }

    public async Task<EscrowWallet> CreateWalletAsync(EscrowWallet wallet)
    {
        _context.EscrowWallets.Add(wallet);
        await _context.SaveChangesAsync();
        return wallet;
    }

    public async Task UpdateWalletAsync(EscrowWallet wallet)
    {
        _context.EscrowWallets.Update(wallet);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<Transaction>> GetTransactionsByWalletIdAsync(int walletId)
    {
        return await _context.Transactions
            .Where(t => t.EscrowWalletId == walletId)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    public async Task AddTransactionAsync(Transaction transaction)
    {
        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();
    }



    /// <summary>
    /// Trừ tiền ví atomic trong Serializable Transaction.
    /// Tạo Transaction record trong cùng 1 DB transaction để đảm bảo consistency.
    /// </summary>
    public async Task<bool> PayFromWalletAtomicAsync(int userId, decimal amount, int bookingId)
    {
        await using var dbTransaction = await _context.Database.BeginTransactionAsync(
            System.Data.IsolationLevel.Serializable);
        try
        {
            var wallet = await _context.EscrowWallets.FirstOrDefaultAsync(w => w.UserId == userId);
            var booking = await _context.Bookings.FirstOrDefaultAsync(b =>
                b.BookingId == bookingId &&
                b.UserId == userId &&
                !b.IsDeleted);

            if (booking == null ||
                booking.Status != BookingStatus.Pending ||
                booking.PaymentStatus == PaymentStatus.Paid ||
                (booking.PaymentDeadline.HasValue && DateTime.UtcNow > booking.PaymentDeadline.Value))
            {
                await dbTransaction.RollbackAsync();
                return false;
            }

            if (wallet == null || wallet.Balance < amount)
            {
                await dbTransaction.RollbackAsync();
                return false;
            }

            wallet.Balance -= amount;

            // C5 FIX: Update booking atomically within the same transaction to prevent split-brain
            booking.PaymentMethod = PaymentMethod.Escrow;
            booking.PaymentStatus = PaymentStatus.Paid;
            booking.Status = BookingStatus.Confirmed;
            booking.CheckInCode = $"QR-{booking.BookingId}-{Guid.NewGuid().ToString()[..8]}";
            _context.Bookings.Update(booking);

            var transaction = new Transaction
            {
                EscrowWalletId = wallet.EscrowWalletId,
                BookingId = bookingId,
                Amount = amount,
                Type = TransactionType.Payment,
                Status = TransactionStatus.Completed,
                ReferenceId = $"Booking_{bookingId}",
                Description = $"Thanh toán đặt sân mã #{bookingId}"
            };

            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();
            await dbTransaction.CommitAsync();
            return true;
        }
        catch
        {
            await dbTransaction.RollbackAsync();
            return false;
        }
    }

    public async Task<bool> PaySplitShareAtomicAsync(int userId, int bookingId, int shareId, decimal amount)
    {
        await using var dbTransaction = await _context.Database.BeginTransactionAsync(
            System.Data.IsolationLevel.Serializable);
        try
        {
            var share = await _context.BookingPaymentShares
                .FirstOrDefaultAsync(s => s.BookingPaymentShareId == shareId
                    && s.BookingId == bookingId
                    && s.UserId == userId
                    && s.Status == PaymentShareStatus.Pending
                    && !s.IsDeleted);

            var booking = await _context.Bookings
                .Include(b => b.PaymentShares)
                .FirstOrDefaultAsync(b => b.BookingId == bookingId && !b.IsDeleted);

            if (share == null || booking == null || !booking.IsSplitPayment
                || booking.Status != BookingStatus.Pending
                || booking.PaymentStatus == PaymentStatus.Paid)
            {
                await dbTransaction.RollbackAsync();
                return false;
            }

            var deadline = booking.SplitPaymentDeadline ?? booking.PaymentDeadline;
            if (deadline.HasValue && DateTime.UtcNow > deadline.Value)
            {
                await dbTransaction.RollbackAsync();
                return false;
            }

            var wallet = await _context.EscrowWallets.FirstOrDefaultAsync(w => w.UserId == userId);
            if (wallet == null || wallet.Balance < amount)
            {
                await dbTransaction.RollbackAsync();
                return false;
            }

            wallet.Balance -= amount;
            share.Status = PaymentShareStatus.Paid;
            share.PaidAt = DateTime.UtcNow;

            _context.Transactions.Add(new Transaction
            {
                EscrowWalletId = wallet.EscrowWalletId,
                BookingId = bookingId,
                Amount = amount,
                Type = TransactionType.Payment,
                Status = TransactionStatus.Completed,
                ReferenceId = $"SplitShare_{shareId}",
                Description = $"Thanh toán phần chia bill #{shareId} — booking #{bookingId}"
            });

            await _context.SaveChangesAsync();

            var pendingShares = await _context.BookingPaymentShares
                .CountAsync(s => s.BookingId == bookingId && s.Status == PaymentShareStatus.Pending && !s.IsDeleted);

            if (pendingShares == 0)
            {
                booking.PaymentMethod = PaymentMethod.Escrow;
                booking.PaymentStatus = PaymentStatus.Paid;
                booking.Status = BookingStatus.Confirmed;
                booking.CheckInCode = $"QR-{booking.BookingId}-{Guid.NewGuid().ToString()[..8]}";
                await _context.SaveChangesAsync();
            }

            await dbTransaction.CommitAsync();
            return true;
        }
        catch
        {
            await dbTransaction.RollbackAsync();
            return false;
        }
    }

    public async Task<bool> RefundSplitShareAtomicAsync(int userId, int bookingId, int shareId, decimal amount)
    {
        await using var dbTransaction = await _context.Database.BeginTransactionAsync(
            System.Data.IsolationLevel.Serializable);
        try
        {
            var share = await _context.BookingPaymentShares
                .FirstOrDefaultAsync(s => s.BookingPaymentShareId == shareId
                    && s.BookingId == bookingId
                    && s.UserId == userId
                    && s.Status == PaymentShareStatus.Paid
                    && !s.IsDeleted);

            if (share == null)
            {
                await dbTransaction.RollbackAsync();
                return false;
            }

            var wallet = await _context.EscrowWallets.FirstOrDefaultAsync(w => w.UserId == userId);
            if (wallet == null)
            {
                wallet = new EscrowWallet { UserId = userId, Balance = 0 };
                _context.EscrowWallets.Add(wallet);
                await _context.SaveChangesAsync();
            }

            wallet.Balance += amount;
            share.Status = PaymentShareStatus.Refunded;

            _context.Transactions.Add(new Transaction
            {
                EscrowWalletId = wallet.EscrowWalletId,
                BookingId = bookingId,
                Amount = amount,
                Type = TransactionType.Refund,
                Status = TransactionStatus.Completed,
                ReferenceId = $"SplitShareRefund_{shareId}",
                Description = $"Hoàn tiền phần chia bill #{shareId} — booking #{bookingId}"
            });

            await _context.SaveChangesAsync();
            await dbTransaction.CommitAsync();
            return true;
        }
        catch
        {
            await dbTransaction.RollbackAsync();
            return false;
        }
    }

    public async Task ExecuteInTransactionAsync(Func<Task> action)
    {
        var strategy = _context.Database.CreateExecutionStrategy();
        await strategy.ExecuteAsync(async () =>
        {
            await using var transaction = await _context.Database.BeginTransactionAsync(System.Data.IsolationLevel.Serializable);
            try
            {
                await action();
                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        });
    }

    public async Task<T> ExecuteInTransactionAsync<T>(Func<Task<T>> action)
    {
        var strategy = _context.Database.CreateExecutionStrategy();
        return await strategy.ExecuteAsync(async () =>
        {
            await using var transaction = await _context.Database.BeginTransactionAsync(System.Data.IsolationLevel.Serializable);
            try
            {
                var result = await action();
                await transaction.CommitAsync();
                return result;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        });
    }

    public async Task<bool> TransactionExistsByReferenceIdAsync(string referenceId)
    {
        return await _context.Transactions.AnyAsync(t => t.ReferenceId == referenceId);
    }
}