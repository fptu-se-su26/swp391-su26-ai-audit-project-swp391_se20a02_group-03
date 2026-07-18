using Microsoft.EntityFrameworkCore;
using ProSport.Application.DTOs;
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
            .AsNoTracking()
            .Where(t => t.EscrowWalletId == walletId)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    public async Task AddTransactionAsync(Transaction transaction)
    {
        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();
    }

    public async Task<EscrowWallet> CreditWalletAsync(int userId, decimal amount)
    {
        if (amount <= 0)
            throw new ArgumentOutOfRangeException(nameof(amount), "Credit amount must be positive.");

        var wallet = await _context.EscrowWallets.FirstOrDefaultAsync(w => w.UserId == userId);
        if (wallet == null)
        {
            wallet = new EscrowWallet { UserId = userId, Balance = amount, LockedBalance = 0 };
            _context.EscrowWallets.Add(wallet);
            await _context.SaveChangesAsync();
            return wallet;
        }

        if (_context.Database.IsRelational())
        {
            await _context.EscrowWallets
                .Where(w => w.EscrowWalletId == wallet.EscrowWalletId)
                .ExecuteUpdateAsync(s => s.SetProperty(w => w.Balance, w => w.Balance + amount));
            wallet.Balance += amount;
            _context.Entry(wallet).State = EntityState.Detached;
            return wallet;
        }

        wallet.Balance += amount;
        return wallet;
    }

    public async Task<bool> TryDebitWalletAsync(int userId, decimal amount)
    {
        if (amount <= 0) return false;

        var wallet = await _context.EscrowWallets.AsNoTracking().FirstOrDefaultAsync(w => w.UserId == userId);
        if (wallet == null || wallet.Balance < amount) return false;

        if (_context.Database.IsRelational())
        {
            var rows = await _context.EscrowWallets
                .Where(w => w.EscrowWalletId == wallet.EscrowWalletId && w.Balance >= amount)
                .ExecuteUpdateAsync(s => s.SetProperty(w => w.Balance, w => w.Balance - amount));
            return rows > 0;
        }

        var tracked = await _context.EscrowWallets.FirstOrDefaultAsync(w => w.UserId == userId);
        if (tracked == null || tracked.Balance < amount) return false;
        tracked.Balance -= amount;
        return true;
    }

    public async Task<bool> PayEquipmentPurchaseAsync(
        int userId,
        decimal totalAmount,
        int? bookingId,
        string referenceId,
        string description)
    {
        if (totalAmount <= 0)
            return true;

        var wallet = await _context.EscrowWallets.FirstOrDefaultAsync(w => w.UserId == userId);
        if (wallet == null)
            return false;

        if (!await TryDebitWalletAsync(userId, totalAmount))
            return false;

        _context.Transactions.Add(new Transaction
        {
            EscrowWalletId = wallet.EscrowWalletId,
            BookingId = bookingId,
            Amount = totalAmount,
            Type = TransactionType.Payment,
            Status = TransactionStatus.Completed,
            ReferenceId = referenceId,
            Description = description
        });

        return true;
    }

    public async Task<bool> TryLockWalletFundsAsync(int userId, decimal amount)
    {
        if (amount <= 0) return false;

        var wallet = await _context.EscrowWallets.AsNoTracking().FirstOrDefaultAsync(w => w.UserId == userId);
        if (wallet == null || wallet.Balance < amount) return false;

        if (_context.Database.IsRelational())
        {
            var rows = await _context.EscrowWallets
                .Where(w => w.EscrowWalletId == wallet.EscrowWalletId && w.Balance >= amount)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(w => w.Balance, w => w.Balance - amount)
                    .SetProperty(w => w.LockedBalance, w => w.LockedBalance + amount));
            return rows > 0;
        }

        var tracked = await _context.EscrowWallets.FirstOrDefaultAsync(w => w.UserId == userId);
        if (tracked == null || tracked.Balance < amount) return false;
        tracked.Balance -= amount;
        tracked.LockedBalance += amount;
        return true;
    }

    public async Task<bool> TryReleaseWalletFundsAsync(int userId, decimal amount)
    {
        if (amount <= 0) return false;

        var wallet = await _context.EscrowWallets.AsNoTracking().FirstOrDefaultAsync(w => w.UserId == userId);
        if (wallet == null || wallet.LockedBalance < amount) return false;

        if (_context.Database.IsRelational())
        {
            var rows = await _context.EscrowWallets
                .Where(w => w.EscrowWalletId == wallet.EscrowWalletId && w.LockedBalance >= amount)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(w => w.LockedBalance, w => w.LockedBalance - amount)
                    .SetProperty(w => w.Balance, w => w.Balance + amount));
            return rows > 0;
        }

        var tracked = await _context.EscrowWallets.FirstOrDefaultAsync(w => w.UserId == userId);
        if (tracked == null || tracked.LockedBalance < amount) return false;
        tracked.LockedBalance -= amount;
        tracked.Balance += amount;
        return true;
    }

    public async Task<bool> TryDeductLockedWalletFundsAsync(int userId, decimal amount)
    {
        if (amount <= 0) return false;

        var wallet = await _context.EscrowWallets.AsNoTracking().FirstOrDefaultAsync(w => w.UserId == userId);
        if (wallet == null || wallet.LockedBalance < amount) return false;

        if (_context.Database.IsRelational())
        {
            var rows = await _context.EscrowWallets
                .Where(w => w.EscrowWalletId == wallet.EscrowWalletId && w.LockedBalance >= amount)
                .ExecuteUpdateAsync(s => s.SetProperty(w => w.LockedBalance, w => w.LockedBalance - amount));
            return rows > 0;
        }

        var tracked = await _context.EscrowWallets.FirstOrDefaultAsync(w => w.UserId == userId);
        if (tracked == null || tracked.LockedBalance < amount) return false;
        tracked.LockedBalance -= amount;
        return true;
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

            if (wallet == null)
            {
                await dbTransaction.RollbackAsync();
                return false;
            }

            if (!await TryDebitWalletAsync(userId, amount))
            {
                await dbTransaction.RollbackAsync();
                return false;
            }

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
                || booking.Status != BookingStatus.PendingPayment
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

            var wallet = await _context.EscrowWallets.AsNoTracking().FirstOrDefaultAsync(w => w.UserId == userId);
            if (wallet == null)
            {
                await dbTransaction.RollbackAsync();
                return false;
            }

            if (!await TryDebitWalletAsync(userId, amount))
            {
                await dbTransaction.RollbackAsync();
                return false;
            }

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

            var wallet = await CreditWalletAsync(userId, amount);
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

    public async Task<VnPayPaymentConfirmOutcome> ConfirmVnPayBookingPaymentAsync(
        int bookingId, string vnpayTransactionId, decimal paidAmount)
    {
        await using var dbTransaction = await _context.Database.BeginTransactionAsync(
            System.Data.IsolationLevel.Serializable);
        try
        {
            if (await _context.Transactions.AnyAsync(t => t.ReferenceId == vnpayTransactionId))
            {
                var linkedBooking = await _context.Bookings.AsNoTracking()
                    .FirstOrDefaultAsync(b => b.BookingId == bookingId && !b.IsDeleted);
                if (linkedBooking?.PaymentStatus == PaymentStatus.Paid)
                {
                    await dbTransaction.CommitAsync();
                    return VnPayPaymentConfirmOutcome.AlreadyPaid;
                }

                await dbTransaction.RollbackAsync();
                return VnPayPaymentConfirmOutcome.DuplicateReference;
            }

            var booking = await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.BookingDetails)
                .ThenInclude(d => d.Court)
                .FirstOrDefaultAsync(b => b.BookingId == bookingId && !b.IsDeleted);

            if (booking == null)
            {
                await dbTransaction.RollbackAsync();
                return VnPayPaymentConfirmOutcome.NotFound;
            }

            if (booking.PaymentStatus == PaymentStatus.Paid)
            {
                await dbTransaction.CommitAsync();
                return VnPayPaymentConfirmOutcome.AlreadyPaid;
            }

            if (booking.PaymentDeadline.HasValue && DateTime.UtcNow > booking.PaymentDeadline.Value)
            {
                // Quá hạn thanh toán = Expired (timeout), phân biệt với Cancelled (hủy chủ động).
                booking.Status = BookingStatus.Expired;
                booking.PaymentStatus = PaymentStatus.Cancelled;
                await _context.SaveChangesAsync();
                await dbTransaction.CommitAsync();
                return VnPayPaymentConfirmOutcome.Expired;
            }

            if (Math.Abs(booking.TotalAmount - paidAmount) > 1m)
            {
                await dbTransaction.RollbackAsync();
                return VnPayPaymentConfirmOutcome.AmountMismatch;
            }

            var wallet = await _context.EscrowWallets.FirstOrDefaultAsync(w => w.UserId == booking.UserId);
            if (wallet == null)
            {
                wallet = new EscrowWallet { UserId = booking.UserId, Balance = 0, LockedBalance = 0 };
                _context.EscrowWallets.Add(wallet);
                await _context.SaveChangesAsync();
            }

            booking.PaymentStatus = PaymentStatus.Paid;
            booking.Status = BookingStatus.Confirmed;
            booking.PaymentMethod = PaymentMethod.VNPay;
            booking.CheckInCode = $"QR-{booking.BookingId}-{Guid.NewGuid().ToString()[..8]}";
            booking.UpdatedAt = DateTime.UtcNow;

            _context.Transactions.Add(new Transaction
            {
                EscrowWalletId = wallet.EscrowWalletId,
                BookingId = booking.BookingId,
                Amount = booking.TotalAmount,
                Type = TransactionType.Payment,
                Status = TransactionStatus.Completed,
                ReferenceId = vnpayTransactionId,
                Description = $"Thanh toán VNPay đặt sân mã #{booking.BookingId}"
            });

            await _context.SaveChangesAsync();
            await dbTransaction.CommitAsync();
            return VnPayPaymentConfirmOutcome.Success;
        }
        catch (DbUpdateException)
        {
            await dbTransaction.RollbackAsync();
            return VnPayPaymentConfirmOutcome.DuplicateReference;
        }
        catch
        {
            await dbTransaction.RollbackAsync();
            throw;
        }
    }

    public async Task<bool> CancelBookingWithRefundAsync(
        int bookingId,
        decimal cancellationFee,
        decimal refundAmount,
        string reason,
        string refundReferenceId)
    {
        await using var dbTransaction = await _context.Database.BeginTransactionAsync(
            System.Data.IsolationLevel.Serializable);
        try
        {
            var booking = await _context.Bookings
                .Include(b => b.PaymentShares)
                .FirstOrDefaultAsync(b => b.BookingId == bookingId && !b.IsDeleted);

            if (booking == null)
            {
                await dbTransaction.RollbackAsync();
                return false;
            }

            if (booking.Status == BookingStatus.Cancelled || booking.Status == BookingStatus.Completed)
            {
                await dbTransaction.CommitAsync();
                return true;
            }

            if (booking.PaymentStatus == PaymentStatus.Paid)
            {
                if (await _context.Transactions.AnyAsync(t => t.ReferenceId == refundReferenceId))
                {
                    booking.CancellationFee = cancellationFee;
                    booking.PaymentStatus = PaymentStatus.Refunded;
                    booking.Status = BookingStatus.Cancelled;
                    booking.UpdatedAt = DateTime.UtcNow;
                    await _context.SaveChangesAsync();
                    await dbTransaction.CommitAsync();
                    return true;
                }

                if (booking.IsSplitPayment && booking.PaymentShares.Count > 0)
                {
                    var paidShares = booking.PaymentShares
                        .Where(s => s.Status == PaymentShareStatus.Paid && !s.IsDeleted)
                        .ToList();
                    var totalPaid = paidShares.Sum(s => s.Amount);
                    if (totalPaid > 0 && refundAmount > 0)
                    {
                        foreach (var share in paidShares)
                        {
                            var shareRefund = Math.Round(refundAmount * (share.Amount / totalPaid), 2, MidpointRounding.AwayFromZero);
                            if (shareRefund <= 0)
                                continue;

                            var wallet = await CreditWalletAsync(share.UserId, shareRefund);
                            share.Status = PaymentShareStatus.Refunded;
                            _context.Transactions.Add(new Transaction
                            {
                                EscrowWalletId = wallet.EscrowWalletId,
                                BookingId = booking.BookingId,
                                Amount = shareRefund,
                                Type = TransactionType.Refund,
                                Status = TransactionStatus.Completed,
                                ReferenceId = $"{refundReferenceId}_share_{share.BookingPaymentShareId}",
                                Description = $"Hoàn {shareRefund:N0} VNĐ do hủy booking #{booking.BookingId}: {reason}"
                            });
                        }
                    }
                }
                else if (refundAmount > 0)
                {
                    var wallet = await CreditWalletAsync(booking.UserId, refundAmount);
                    _context.Transactions.Add(new Transaction
                    {
                        EscrowWalletId = wallet.EscrowWalletId,
                        BookingId = booking.BookingId,
                        Amount = refundAmount,
                        Type = TransactionType.Refund,
                        Status = TransactionStatus.Completed,
                        ReferenceId = refundReferenceId,
                        Description = $"Hoàn {refundAmount:N0} VNĐ do hủy booking #{booking.BookingId}: {reason}"
                    });
                }

                booking.PaymentStatus = PaymentStatus.Refunded;
            }

            booking.CancellationFee = cancellationFee;
            booking.Status = BookingStatus.Cancelled;
            booking.UpdatedAt = DateTime.UtcNow;
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
}