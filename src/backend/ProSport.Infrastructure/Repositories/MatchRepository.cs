using Microsoft.EntityFrameworkCore;
using ProSport.Application.Interfaces;
using ProSport.Domain.Constants;
using ProSport.Domain.Entities;
using ProSport.Infrastructure.Data;

namespace ProSport.Infrastructure.Repositories;

public class MatchRepository : IMatchRepository
{
    private readonly ProSportDbContext _context;
    private readonly IEscrowRepository _escrowRepository;

    public MatchRepository(ProSportDbContext context, IEscrowRepository escrowRepository)
    {
        _context = context;
        _escrowRepository = escrowRepository;
    }

    public async Task<IEnumerable<Match>> GetMatchesByStatusAsync(string status)
    {
        return await _context.Matches
            .AsNoTracking()
            .AsSplitQuery()
            .Include(m => m.Participants)
            .Include(m => m.Host)
            .Include(m => m.Court)
                .ThenInclude(c => c.CourtType)
            .Where(m => m.Status == status)
            .OrderBy(m => m.MatchDate).ThenBy(m => m.StartTime)
            .ToListAsync();
    }

    public async Task<IEnumerable<Match>> GetMyMatchHistoryAsync(int userId)
    {
        return await _context.Matches
            .AsNoTracking()
            .AsSplitQuery()
            .Include(m => m.Participants)
            .Include(m => m.Host)
            .Include(m => m.Court)
                .ThenInclude(c => c.CourtType)
            .Where(m => m.Participants.Any(p => p.UserId == userId))
            .OrderByDescending(m => m.MatchDate).ThenByDescending(m => m.StartTime)
            .ToListAsync();
    }

    public async Task<Match?> GetMatchByIdAsync(int matchId)
    {
        return await _context.Matches
            .AsNoTracking()
            .AsSplitQuery()
            .Include(m => m.Participants)
            .Include(m => m.Host)
            .Include(m => m.Court)
                .ThenInclude(c => c.CourtType)
            .FirstOrDefaultAsync(m => m.MatchId == matchId);
    }

    public async Task<Match> CreateMatchAsync(Match match)
    {
        _context.Matches.Add(match);
        await _context.SaveChangesAsync();
        return match;
    }

    public async Task UpdateMatchAsync(Match match)
    {
        _context.Matches.Update(match);
        await _context.SaveChangesAsync();
    }

    public async Task<MatchParticipant?> GetParticipantAsync(int matchId, int userId)
    {
        return await _context.MatchParticipants
            .FirstOrDefaultAsync(p => p.MatchId == matchId && p.UserId == userId);
    }

    public async Task AddParticipantAsync(MatchParticipant participant)
    {
        _context.MatchParticipants.Add(participant);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateParticipantAsync(MatchParticipant participant)
    {
        _context.MatchParticipants.Update(participant);
        await _context.SaveChangesAsync();
    }

    public async Task<MatchParticipant> ExecuteJoinMatchTransactionAsync(int matchId, int joinerId)
    {
        // H-01 FIX: Use Serializable isolation to prevent race condition double-join
        await using var transaction = await _context.Database.BeginTransactionAsync(System.Data.IsolationLevel.Serializable);
        try
        {
            var match = await _context.Matches
                .Include(m => m.Participants)
                .FirstOrDefaultAsync(m => m.MatchId == matchId);

            if (match == null) throw new System.Exception("Kèo không tồn tại.");
            // C-01 FIX: Use constants instead of magic strings
            if (match.Status != MatchStatus.Open) throw new System.Exception("Kèo đã đóng hoặc không thể tham gia.");
            if (match.CurrentParticipants >= match.MaxParticipants) throw new System.Exception("Kèo đã đủ người.");
            if (match.Participants.Any(p => p.UserId == joinerId)) throw new System.Exception("Bạn đã tham gia hoặc đang chờ duyệt kèo này.");
            // Chặn host tự tham gia kèo của mình (dữ liệu cũ/seed có thể thiếu record Host trong Participants).
            if (match.HostId == joinerId) throw new System.Exception("Chủ kèo không thể tham gia kèo của chính mình.");

            // Ví tạo lazily giống EscrowService/BookingService — user chưa từng mở ví vẫn join được kèo,
            // sau đó TryLockWalletFunds sẽ báo "Số dư không đủ" nếu ví rỗng (thông báo đúng bản chất hơn).
            var wallet = await _context.EscrowWallets.FirstOrDefaultAsync(w => w.UserId == joinerId);
            if (wallet == null)
            {
                wallet = new EscrowWallet { UserId = joinerId, Balance = 0, LockedBalance = 0 };
                _context.EscrowWallets.Add(wallet);
                await _context.SaveChangesAsync();
            }

            if (!await _escrowRepository.TryLockWalletFundsAsync(joinerId, match.EscrowAmount))
            {
                throw new System.InvalidOperationException("Số dư không đủ.");
            }

            // Ghi log Participant — C-01 FIX: Use constants
            var participant = new MatchParticipant
            {
                MatchId = matchId,
                UserId = joinerId,
                Role = MatchParticipantRole.Joiner,
                Status = MatchParticipantStatus.Pending,
                HasPaidEscrow = true
            };
            _context.MatchParticipants.Add(participant);

            // Ghi log Transaction — C-01 FIX: Use constants
            var escrowTransaction = new Transaction
            {
                EscrowWalletId = wallet.EscrowWalletId,
                MatchId = matchId,
                Amount = match.EscrowAmount,
                Type = TransactionType.EscrowLock,
                Status = TransactionStatus.Completed,
                Description = $"Khóa tiền ký quỹ xin tham gia kèo {matchId}"
            };
            _context.Transactions.Add(escrowTransaction);

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return participant;
        }
        catch (DbUpdateConcurrencyException)
        {
            await transaction.RollbackAsync();
            throw new System.InvalidOperationException("Giao dịch đang được xử lý, vui lòng thử lại sau.");
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<IEnumerable<MatchParticipant>> GetParticipantsByMatchAsync(int matchId, string status)
    {
        return await _context.MatchParticipants
            .AsNoTracking()
            .Include(p => p.User)
            .Where(p => p.MatchId == matchId && p.Status == status)
            .ToListAsync();
    }

    public async Task<MatchParticipant> ExecuteRejectMatchTransactionAsync(int matchId, int participantId, int hostId)
    {
        // M-04 FIX: await using for proper async dispose
        await using var transaction = await _context.Database.BeginTransactionAsync(System.Data.IsolationLevel.Serializable);
        try
        {
            var match = await _context.Matches.FirstOrDefaultAsync(m => m.MatchId == matchId);
            if (match == null || match.HostId != hostId) throw new System.Exception("Kèo không tồn tại hoặc bạn không có quyền.");

            var participant = await _context.MatchParticipants.FirstOrDefaultAsync(p => p.MatchParticipantId == participantId && p.MatchId == matchId);
            // C-01 FIX: Use constant
            if (participant == null || participant.Status != MatchParticipantStatus.Pending) throw new System.Exception("Yêu cầu tham gia không hợp lệ hoặc đã được xử lý.");

            // C-01 FIX: Use constant
            participant.Status = MatchParticipantStatus.Rejected;
            _context.MatchParticipants.Update(participant);

            if (participant.HasPaidEscrow && match.EscrowAmount > 0)
            {
                var wallet = await _context.EscrowWallets.AsNoTracking()
                    .FirstOrDefaultAsync(w => w.UserId == participant.UserId);
                if (wallet == null) throw new System.Exception("Không tìm thấy ví để hoàn tiền.");

                if (!await _escrowRepository.TryReleaseWalletFundsAsync(participant.UserId, match.EscrowAmount))
                    throw new System.InvalidOperationException("Không thể hoàn tiền ký quỹ.");

                // C-01 FIX: Use TransactionType constants
                var escrowTransaction = new Transaction
                {
                    EscrowWalletId = wallet.EscrowWalletId,
                    MatchId = matchId,
                    Amount = match.EscrowAmount,
                    Type = TransactionType.EscrowRelease,
                    Status = TransactionStatus.Completed,
                    Description = $"Hoàn tiền ký quỹ do Host từ chối tham gia kèo {matchId}"
                };
                _context.Transactions.Add(escrowTransaction);
            }

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return participant;
        }
        catch (DbUpdateConcurrencyException)
        {
            await transaction.RollbackAsync();
            throw new System.InvalidOperationException("Giao dịch đang được xử lý, vui lòng thử lại sau.");
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<MatchParticipant> ExecuteApproveMatchTransactionAsync(int matchId, int participantId, int hostId)
    {
        // M-04 FIX: await using for proper async dispose + Serializable to prevent double-approve
        await using var transaction = await _context.Database.BeginTransactionAsync(System.Data.IsolationLevel.Serializable);
        try
        {
            var match = await _context.Matches.FirstOrDefaultAsync(m => m.MatchId == matchId);
            if (match == null || match.HostId != hostId) throw new System.Exception("Kèo không tồn tại hoặc bạn không có quyền.");

            if (match.CurrentParticipants >= match.MaxParticipants) throw new System.Exception("Kèo đã đủ người.");

            var participant = await _context.MatchParticipants.FirstOrDefaultAsync(p => p.MatchParticipantId == participantId && p.MatchId == matchId);
            // C-01 FIX: Use constant
            if (participant == null || participant.Status != MatchParticipantStatus.Pending) throw new System.Exception("Yêu cầu tham gia không hợp lệ hoặc đã được xử lý.");

            // C-01 FIX: Use constant
            participant.Status = MatchParticipantStatus.Approved;
            _context.MatchParticipants.Update(participant);

            match.CurrentParticipants++;
            if (match.CurrentParticipants >= match.MaxParticipants)
            {
                // C-01 FIX: Use constant
                match.Status = MatchStatus.Closed;
            }
            _context.Matches.Update(match);

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return participant;
        }
        catch (DbUpdateConcurrencyException)
        {
            await transaction.RollbackAsync();
            throw new System.InvalidOperationException("Giao dịch đang được xử lý, vui lòng thử lại sau.");
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<bool> ExecuteCompleteMatchTransactionAsync(int matchId, int hostId)
    {
        // M-04 FIX: await using for proper async dispose
        await using var transaction = await _context.Database.BeginTransactionAsync(System.Data.IsolationLevel.Serializable);
        try
        {
            var match = await _context.Matches.FirstOrDefaultAsync(m => m.MatchId == matchId);
            if (match == null || match.HostId != hostId) throw new System.Exception("Kèo không tồn tại hoặc bạn không có quyền.");
            // C-01 FIX: Use constants
            if (match.Status != MatchStatus.Open && match.Status != MatchStatus.Closed) throw new System.Exception("Trạng thái kèo không hợp lệ để hoàn thành.");

            // C-01 FIX: Use constant
            match.Status = MatchStatus.Completed;
            _context.Matches.Update(match);

            // C-01 FIX: Use constants in query filter
            var approvedParticipants = await _context.MatchParticipants
                .Where(p => p.MatchId == matchId
                    && p.Status == MatchParticipantStatus.Approved
                    && p.Role == MatchParticipantRole.Joiner
                    && p.HasPaidEscrow)
                .ToListAsync();

            if (approvedParticipants.Any() && match.EscrowAmount > 0)
            {
                var totalAmount = approvedParticipants.Count * match.EscrowAmount;

                // C-05 FIX: Batch load all joiner wallets to avoid N+1 query
                var joinerUserIds = approvedParticipants.Select(p => p.UserId).ToList();
                var joinerWallets = await _context.EscrowWallets
                    .Where(w => joinerUserIds.Contains(w.UserId))
                    .ToListAsync();
                var walletByUserId = joinerWallets.ToDictionary(w => w.UserId);

                // Trừ tiền bị khóa của từng Joiner
                foreach (var participant in approvedParticipants)
                {
                    if (!walletByUserId.TryGetValue(participant.UserId, out var joinerWallet)) continue;

                    if (!await _escrowRepository.TryDeductLockedWalletFundsAsync(participant.UserId, match.EscrowAmount))
                        continue;

                    // C-01 FIX: Use constants
                    _context.Transactions.Add(new Transaction
                    {
                        EscrowWalletId = joinerWallet.EscrowWalletId,
                        MatchId = matchId,
                        Amount = match.EscrowAmount,
                        Type = TransactionType.Payment,
                        Status = TransactionStatus.Completed,
                        Description = $"Thanh toán cọc cho kèo #{matchId}"
                    });
                }

                var hostWallet = await _escrowRepository.CreditWalletAsync(hostId, totalAmount);

                // C-01 FIX: Use constants
                // C7 FIX: Use EscrowWallet navigation property instead of ID so EF Core can insert it in correct order without mid-transaction flush
                _context.Transactions.Add(new Transaction
                {
                    EscrowWalletId = hostWallet.EscrowWalletId,
                    MatchId = matchId,
                    Amount = totalAmount,
                    Type = TransactionType.EscrowRelease,
                    Status = TransactionStatus.Completed,
                    Description = $"Nhận tiền thanh toán từ các thành viên kèo #{matchId}"
                });
            }

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
            return true;
        }
        catch (DbUpdateConcurrencyException)
        {
            await transaction.RollbackAsync();
            throw new System.InvalidOperationException("Giao dịch đang được xử lý, vui lòng thử lại sau.");
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<bool> ExecuteCancelMatchTransactionAsync(int matchId, int hostId)
    {
        // M-04 FIX: await using + Serializable
        await using var transaction = await _context.Database.BeginTransactionAsync(System.Data.IsolationLevel.Serializable);
        try
        {
            var match = await _context.Matches.FirstOrDefaultAsync(m => m.MatchId == matchId);
            if (match == null || match.HostId != hostId) throw new System.Exception("Kèo không tồn tại hoặc bạn không có quyền.");
            // C-01 FIX: Use constants
            if (match.Status != MatchStatus.Open && match.Status != MatchStatus.Closed) throw new System.Exception("Trạng thái kèo không hợp lệ để hủy.");

            // C-01 FIX: Use constant
            match.Status = MatchStatus.Cancelled;
            _context.Matches.Update(match);

            // C-01 FIX: Use constants in query filter; C-05 FIX: Batch load wallets to avoid N+1
            var participantsToRefund = await _context.MatchParticipants
                .Where(p => p.MatchId == matchId
                    && (p.Status == MatchParticipantStatus.Approved || p.Status == MatchParticipantStatus.Pending)
                    && p.Role == MatchParticipantRole.Joiner
                    && p.HasPaidEscrow)
                .ToListAsync();

            if (participantsToRefund.Any() && match.EscrowAmount > 0)
            {
                // C-05 FIX: Batch load wallets
                var refundUserIds = participantsToRefund.Select(p => p.UserId).ToList();
                var refundWallets = await _context.EscrowWallets
                    .Where(w => refundUserIds.Contains(w.UserId))
                    .ToListAsync();
                var refundWalletByUserId = refundWallets.ToDictionary(w => w.UserId);

                foreach (var participant in participantsToRefund)
                {
                    if (refundWalletByUserId.TryGetValue(participant.UserId, out var joinerWallet)
                        && await _escrowRepository.TryReleaseWalletFundsAsync(participant.UserId, match.EscrowAmount))
                    {
                        _context.Transactions.Add(new Transaction
                        {
                            EscrowWalletId = joinerWallet.EscrowWalletId,
                            MatchId = matchId,
                            Amount = match.EscrowAmount,
                            Type = TransactionType.EscrowRelease,
                            Status = TransactionStatus.Completed,
                            Description = $"Hoàn tiền do Host hủy kèo #{matchId}"
                        });
                    }

                    participant.Status = MatchParticipantStatus.Rejected;
                    _context.MatchParticipants.Update(participant);
                }
            }

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
            return true;
        }
        catch (DbUpdateConcurrencyException)
        {
            await transaction.RollbackAsync();
            throw new System.InvalidOperationException("Giao dịch đang được xử lý, vui lòng thử lại sau.");
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
}
