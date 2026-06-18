using Microsoft.EntityFrameworkCore;
using ProSport.Application.Interfaces;
using ProSport.Domain.Entities;
using ProSport.Infrastructure.Data;

namespace ProSport.Infrastructure.Repositories;

public class MatchRepository : IMatchRepository
{
    private readonly ProSportDbContext _context;

    public MatchRepository(ProSportDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Match>> GetMatchesByStatusAsync(string status)
    {
        return await _context.Matches
            .Where(m => m.Status == status)
            .OrderBy(m => m.MatchDate).ThenBy(m => m.StartTime)
            .ToListAsync();
    }

    public async Task<IEnumerable<Match>> GetMyMatchHistoryAsync(int userId)
    {
        return await _context.Matches
            .Include(m => m.Participants)
            .Where(m => m.Participants.Any(p => p.UserId == userId))
            .OrderByDescending(m => m.MatchDate).ThenByDescending(m => m.StartTime)
            .ToListAsync();
    }

    public async Task<Match?> GetMatchByIdAsync(int matchId)
    {
        return await _context.Matches
            .Include(m => m.Participants)
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
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var match = await _context.Matches
                .Include(m => m.Participants)
                .FirstOrDefaultAsync(m => m.MatchId == matchId);

            if (match == null) throw new System.Exception("Kèo không tồn tại.");
            if (match.Status != "Open") throw new System.Exception("Kèo đã đóng hoặc không thể tham gia.");
            if (match.CurrentParticipants >= match.MaxParticipants) throw new System.Exception("Kèo đã đủ người.");
            if (match.Participants.Any(p => p.UserId == joinerId)) throw new System.Exception("Bạn đã tham gia hoặc đang chờ duyệt kèo này.");

            var wallet = await _context.EscrowWallets.FirstOrDefaultAsync(w => w.UserId == joinerId);
            if (wallet == null) throw new System.Exception("Ví trung gian không tồn tại.");

            if (wallet.Balance < match.EscrowAmount)
            {
                throw new System.InvalidOperationException("Số dư không đủ.");
            }

            // Cập nhật Wallet
            wallet.Balance -= match.EscrowAmount;
            wallet.LockedBalance += match.EscrowAmount;
            _context.EscrowWallets.Update(wallet);

            // Ghi log Participant
            var participant = new MatchParticipant
            {
                MatchId = matchId,
                UserId = joinerId,
                Role = "Joiner",
                Status = "Pending",
                HasPaidEscrow = true
            };
            _context.MatchParticipants.Add(participant);

            // Ghi log Transaction
            var escrowTransaction = new Transaction
            {
                EscrowWalletId = wallet.EscrowWalletId,
                MatchId = matchId,
                Amount = match.EscrowAmount,
                Type = "EscrowLock",
                Status = "Completed",
                Description = $"Khóa tiền kỹ quỹ xin tham gia kèo {matchId}"
            };
            _context.Transactions.Add(escrowTransaction);

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return participant;
        }
        catch (DbUpdateConcurrencyException)
        {
            await transaction.RollbackAsync();
            // Ném lỗi đặc thù để Service bắt và trả về 409
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
            .Include(p => p.User)
            .Where(p => p.MatchId == matchId && p.Status == status)
            .ToListAsync();
    }

    public async Task<MatchParticipant> ExecuteRejectMatchTransactionAsync(int matchId, int participantId, int hostId)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var match = await _context.Matches.FirstOrDefaultAsync(m => m.MatchId == matchId);
            if (match == null || match.HostId != hostId) throw new System.Exception("Kèo không tồn tại hoặc bạn không có quyền.");

            var participant = await _context.MatchParticipants.FirstOrDefaultAsync(p => p.MatchParticipantId == participantId && p.MatchId == matchId);
            if (participant == null || participant.Status != "Pending") throw new System.Exception("Yêu cầu tham gia không hợp lệ hoặc đã được xử lý.");

            participant.Status = "Rejected";
            _context.MatchParticipants.Update(participant);

            if (participant.HasPaidEscrow && match.EscrowAmount > 0)
            {
                var wallet = await _context.EscrowWallets.FirstOrDefaultAsync(w => w.UserId == participant.UserId);
                if (wallet == null) throw new System.Exception("Không tìm thấy ví để hoàn tiền.");

                wallet.LockedBalance -= match.EscrowAmount;
                wallet.Balance += match.EscrowAmount;
                _context.EscrowWallets.Update(wallet);

                var escrowTransaction = new Transaction
                {
                    EscrowWalletId = wallet.EscrowWalletId,
                    MatchId = matchId,
                    Amount = match.EscrowAmount,
                    Type = "EscrowRefund",
                    Status = "Completed",
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
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var match = await _context.Matches.FirstOrDefaultAsync(m => m.MatchId == matchId);
            if (match == null || match.HostId != hostId) throw new System.Exception("Kèo không tồn tại hoặc bạn không có quyền.");

            if (match.CurrentParticipants >= match.MaxParticipants) throw new System.Exception("Kèo đã đủ người.");

            var participant = await _context.MatchParticipants.FirstOrDefaultAsync(p => p.MatchParticipantId == participantId && p.MatchId == matchId);
            if (participant == null || participant.Status != "Pending") throw new System.Exception("Yêu cầu tham gia không hợp lệ hoặc đã được xử lý.");

            participant.Status = "Approved";
            _context.MatchParticipants.Update(participant);

            match.CurrentParticipants++;
            if (match.CurrentParticipants >= match.MaxParticipants)
            {
                match.Status = "Closed";
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
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var match = await _context.Matches.FirstOrDefaultAsync(m => m.MatchId == matchId);
            if (match == null || match.HostId != hostId) throw new System.Exception("Kèo không tồn tại hoặc bạn không có quyền.");
            if (match.Status != "Open" && match.Status != "Closed") throw new System.Exception("Trạng thái kèo không hợp lệ để hoàn thành.");

            match.Status = "Completed";
            _context.Matches.Update(match);

            var approvedParticipants = await _context.MatchParticipants
                .Where(p => p.MatchId == matchId && p.Status == "Approved" && p.Role == "Joiner" && p.HasPaidEscrow)
                .ToListAsync();

            if (approvedParticipants.Any() && match.EscrowAmount > 0)
            {
                var totalAmount = approvedParticipants.Count * match.EscrowAmount;
                
                // Trừ tiền bị khóa của từng Joiner
                foreach (var participant in approvedParticipants)
                {
                    var joinerWallet = await _context.EscrowWallets.FirstOrDefaultAsync(w => w.UserId == participant.UserId);
                    if (joinerWallet != null)
                    {
                        joinerWallet.LockedBalance -= match.EscrowAmount;
                        _context.EscrowWallets.Update(joinerWallet);

                        _context.Transactions.Add(new Transaction
                        {
                            EscrowWalletId = joinerWallet.EscrowWalletId,
                            MatchId = matchId,
                            Amount = match.EscrowAmount,
                            Type = "EscrowPaid",
                            Status = "Completed",
                            Description = $"Thanh toán cọc cho kèo {matchId}"
                        });
                    }
                }

                // Cộng tiền vào Balance của Host
                var hostWallet = await _context.EscrowWallets.FirstOrDefaultAsync(w => w.UserId == hostId);
                if (hostWallet == null)
                {
                    hostWallet = new EscrowWallet { UserId = hostId, Balance = 0, LockedBalance = 0 };
                    _context.EscrowWallets.Add(hostWallet);
                    await _context.SaveChangesAsync(); 
                }

                hostWallet.Balance += totalAmount;
                _context.EscrowWallets.Update(hostWallet);

                _context.Transactions.Add(new Transaction
                {
                    EscrowWalletId = hostWallet.EscrowWalletId,
                    MatchId = matchId,
                    Amount = totalAmount,
                    Type = "EscrowRelease",
                    Status = "Completed",
                    Description = $"Nhận tiền thanh toán từ các thành viên kèo {matchId}"
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
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var match = await _context.Matches.FirstOrDefaultAsync(m => m.MatchId == matchId);
            if (match == null || match.HostId != hostId) throw new System.Exception("Kèo không tồn tại hoặc bạn không có quyền.");
            if (match.Status != "Open" && match.Status != "Closed") throw new System.Exception("Trạng thái kèo không hợp lệ để hủy.");

            match.Status = "Cancelled";
            _context.Matches.Update(match);

            var participantsToRefund = await _context.MatchParticipants
                .Where(p => p.MatchId == matchId && (p.Status == "Approved" || p.Status == "Pending") && p.Role == "Joiner" && p.HasPaidEscrow)
                .ToListAsync();

            if (participantsToRefund.Any() && match.EscrowAmount > 0)
            {
                foreach (var participant in participantsToRefund)
                {
                    var joinerWallet = await _context.EscrowWallets.FirstOrDefaultAsync(w => w.UserId == participant.UserId);
                    if (joinerWallet != null)
                    {
                        joinerWallet.LockedBalance -= match.EscrowAmount;
                        joinerWallet.Balance += match.EscrowAmount;
                        _context.EscrowWallets.Update(joinerWallet);

                        _context.Transactions.Add(new Transaction
                        {
                            EscrowWalletId = joinerWallet.EscrowWalletId,
                            MatchId = matchId,
                            Amount = match.EscrowAmount,
                            Type = "EscrowRefund",
                            Status = "Completed",
                            Description = $"Hoàn tiền do Host hủy kèo {matchId}"
                        });
                    }
                    participant.Status = "Cancelled";
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
