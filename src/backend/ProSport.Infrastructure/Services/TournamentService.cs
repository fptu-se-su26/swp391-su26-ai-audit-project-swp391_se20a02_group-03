using Microsoft.EntityFrameworkCore;
using ProSport.Application.DTOs;
using ProSport.Application.Exceptions;
using ProSport.Application.Interfaces;
using ProSport.Domain.Constants;
using ProSport.Domain.Entities;
using ProSport.Infrastructure.Data;

namespace ProSport.Infrastructure.Services;

public class TournamentService : ITournamentService
{
    private readonly ProSportDbContext _db;
    private readonly IOwnerAccessService _ownerAccess;
    private readonly IEscrowRepository _escrowRepository;

    public TournamentService(ProSportDbContext db, IOwnerAccessService ownerAccess, IEscrowRepository escrowRepository)
    {
        _db = db;
        _ownerAccess = ownerAccess;
        _escrowRepository = escrowRepository;
    }

    public async Task<ApiResponseDto<IEnumerable<TournamentDto>>> GetByComplexAsync(int complexId)
    {
        var items = await _db.Tournaments.AsNoTracking()
            .Where(t => t.ComplexId == complexId && t.Status != "Cancelled")
            .OrderBy(t => t.StartDate)
            .Select(t => Map(t))
            .ToListAsync();

        return new ApiResponseDto<IEnumerable<TournamentDto>>(200, "Success", items);
    }

    public async Task<ApiResponseDto<TournamentDto>> CreateAsync(int ownerUserId, int complexId, CreateTournamentDto dto, bool isAdmin = false)
    {
        await _ownerAccess.RequireComplexAccessAsync(ownerUserId, complexId, isAdmin);

        if (dto.EndDate <= dto.StartDate)
            return new ApiResponseDto<TournamentDto>(400, "EndDate phải sau StartDate.");

        var tournament = new Tournament
        {
            ComplexId = complexId,
            Name = dto.Name.Trim(),
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            EntryFee = dto.EntryFee,
            MaxTeams = dto.MaxTeams,
            SportType = dto.SportType,
            Status = "Open"
        };

        _db.Tournaments.Add(tournament);
        await _db.SaveChangesAsync();
        return new ApiResponseDto<TournamentDto>(201, "Tạo giải đấu thành công.", Map(tournament));
    }

    public async Task<ApiResponseDto<bool>> RegisterAsync(int userId, int tournamentId, RegisterTournamentDto dto)
    {
        await using var tx = await _db.Database.BeginTransactionAsync(System.Data.IsolationLevel.Serializable);
        try
        {
            var tournament = await _db.Tournaments
                .FirstOrDefaultAsync(t => t.TournamentId == tournamentId);
            if (tournament == null) return new ApiResponseDto<bool>(404, "Tournament not found");
            if (tournament.Status != "Open") return new ApiResponseDto<bool>(400, "Giải đã đóng đăng ký.");
            if (tournament.RegisteredTeams >= tournament.MaxTeams)
                return new ApiResponseDto<bool>(400, "Đã đủ số đội.");

            var dup = await _db.TournamentRegistrations.AnyAsync(r =>
                r.TournamentId == tournamentId && r.CaptainUserId == userId && r.Status == "Registered");
            if (dup) return new ApiResponseDto<bool>(400, "Bạn đã đăng ký giải này.");

            Transaction? paymentTxn = null;
            if (tournament.EntryFee > 0)
            {
                var wallet = await _db.EscrowWallets.AsNoTracking()
                    .FirstOrDefaultAsync(w => w.UserId == userId);
                if (wallet == null || !await _escrowRepository.TryDebitWalletAsync(userId, tournament.EntryFee))
                    return new ApiResponseDto<bool>(400, "Tài khoản không đủ tiền.");

                paymentTxn = new Transaction
                {
                    EscrowWalletId = wallet.EscrowWalletId,
                    Amount = tournament.EntryFee,
                    Type = TransactionType.Payment,
                    Status = TransactionStatus.Completed,
                    ReferenceId = $"Tournament_{tournamentId}_Captain_{userId}",
                    Description = $"Phí đăng ký giải #{tournamentId} — {dto.TeamName.Trim()}"
                };
                _db.Transactions.Add(paymentTxn);
                await _db.SaveChangesAsync();
            }

            _db.TournamentRegistrations.Add(new TournamentRegistration
            {
                TournamentId = tournamentId,
                CaptainUserId = userId,
                TeamName = dto.TeamName.Trim(),
                EntryFeePaid = tournament.EntryFee <= 0 || paymentTxn != null,
                PaymentTransactionId = paymentTxn?.TransactionId
            });

            tournament.RegisteredTeams++;
            await _db.SaveChangesAsync();
            await tx.CommitAsync();
            return new ApiResponseDto<bool>(200, "Đăng ký giải thành công.", true);
        }
        catch
        {
            await tx.RollbackAsync();
            throw;
        }
    }

    public async Task<ApiResponseDto<TournamentDto>> CloseRegistrationAsync(int userId, int tournamentId, bool isAdmin = false)
    {
        var tournament = await _db.Tournaments.FirstOrDefaultAsync(t => t.TournamentId == tournamentId);
        if (tournament == null) return new ApiResponseDto<TournamentDto>(404, "Tournament not found");

        try { await _ownerAccess.RequireComplexAccessAsync(userId, tournament.ComplexId, isAdmin); }
        catch (OwnerAccessDeniedException ex) { return new ApiResponseDto<TournamentDto>(403, ex.Message); }

        if (tournament.Status != TournamentStatus.Open)
            return new ApiResponseDto<TournamentDto>(400, "Chỉ có thể đóng đăng ký khi giải đang mở (Open).");

        tournament.Status = TournamentStatus.Closed;
        await _db.SaveChangesAsync();
        return new ApiResponseDto<TournamentDto>(200, "Đã đóng đăng ký giải.", Map(tournament));
    }

    public async Task<ApiResponseDto<TournamentDto>> CompleteAsync(int userId, int tournamentId, bool isAdmin = false)
    {
        var tournament = await _db.Tournaments.FirstOrDefaultAsync(t => t.TournamentId == tournamentId);
        if (tournament == null) return new ApiResponseDto<TournamentDto>(404, "Tournament not found");

        try { await _ownerAccess.RequireComplexAccessAsync(userId, tournament.ComplexId, isAdmin); }
        catch (OwnerAccessDeniedException ex) { return new ApiResponseDto<TournamentDto>(403, ex.Message); }

        if (tournament.Status != TournamentStatus.Closed)
            return new ApiResponseDto<TournamentDto>(400, "Chỉ có thể hoàn thành khi giải đã đóng đăng ký (Closed).");

        tournament.Status = TournamentStatus.Completed;
        await _db.SaveChangesAsync();
        return new ApiResponseDto<TournamentDto>(200, "Đã hoàn thành giải.", Map(tournament));
    }

    public async Task<ApiResponseDto<TournamentDto>> CancelAsync(int userId, int tournamentId, bool isAdmin = false)
    {
        var tournament = await _db.Tournaments
            .Include(t => t.Registrations)
            .FirstOrDefaultAsync(t => t.TournamentId == tournamentId);
        if (tournament == null) return new ApiResponseDto<TournamentDto>(404, "Tournament not found");

        try { await _ownerAccess.RequireComplexAccessAsync(userId, tournament.ComplexId, isAdmin); }
        catch (OwnerAccessDeniedException ex) { return new ApiResponseDto<TournamentDto>(403, ex.Message); }

        if (tournament.Status is TournamentStatus.Completed or TournamentStatus.Cancelled)
            return new ApiResponseDto<TournamentDto>(400, "Giải đã kết thúc hoặc đã hủy.");

        await using var tx = await _db.Database.BeginTransactionAsync();
        try
        {
            // Chỉ hoàn cho các đăng ký còn hiệu lực + đã trả phí → idempotent: chạy lại không hoàn kép.
            foreach (var reg in tournament.Registrations.Where(r => r.Status == "Registered"))
            {
                if (reg.EntryFeePaid && tournament.EntryFee > 0)
                {
                    var wallet = await _escrowRepository.CreditWalletAsync(reg.CaptainUserId, tournament.EntryFee);
                    _db.Transactions.Add(new Transaction
                    {
                        EscrowWalletId = wallet.EscrowWalletId,
                        Amount = tournament.EntryFee,
                        Type = TransactionType.Refund,
                        Status = TransactionStatus.Completed,
                        ReferenceId = $"TournamentRefund_{reg.TournamentRegistrationId}",
                        Description = $"Hoàn phí đăng ký giải #{tournament.TournamentId} — {reg.TeamName}"
                    });
                }
                reg.Status = "Cancelled";
            }

            tournament.Status = TournamentStatus.Cancelled;
            await _db.SaveChangesAsync();
            await tx.CommitAsync();
        }
        catch
        {
            await tx.RollbackAsync();
            throw;
        }

        return new ApiResponseDto<TournamentDto>(200, "Đã hủy giải và hoàn phí cho các đội đã thanh toán.", Map(tournament));
    }

    public async Task<ApiResponseDto<bool>> WithdrawAsync(int userId, int tournamentId)
    {
        await using var tx = await _db.Database.BeginTransactionAsync();
        try
        {
            var tournament = await _db.Tournaments.FirstOrDefaultAsync(t => t.TournamentId == tournamentId);
            if (tournament == null) return new ApiResponseDto<bool>(404, "Tournament not found");
            if (tournament.Status is TournamentStatus.Completed or TournamentStatus.Cancelled)
                return new ApiResponseDto<bool>(400, "Giải đã kết thúc hoặc đã hủy.");

            var reg = await _db.TournamentRegistrations.FirstOrDefaultAsync(r =>
                r.TournamentId == tournamentId && r.CaptainUserId == userId && r.Status == "Registered");
            if (reg == null) return new ApiResponseDto<bool>(404, "Bạn chưa đăng ký hoặc đã rút khỏi giải này.");

            if (reg.EntryFeePaid && tournament.EntryFee > 0)
            {
                var wallet = await _escrowRepository.CreditWalletAsync(userId, tournament.EntryFee);
                _db.Transactions.Add(new Transaction
                {
                    EscrowWalletId = wallet.EscrowWalletId,
                    Amount = tournament.EntryFee,
                    Type = TransactionType.Refund,
                    Status = TransactionStatus.Completed,
                    ReferenceId = $"TournamentWithdraw_{reg.TournamentRegistrationId}",
                    Description = $"Hoàn phí rút khỏi giải #{tournamentId} — {reg.TeamName}"
                });
            }

            reg.Status = "Cancelled";
            tournament.RegisteredTeams = Math.Max(0, tournament.RegisteredTeams - 1);
            await _db.SaveChangesAsync();
            await tx.CommitAsync();
            return new ApiResponseDto<bool>(200, "Đã rút khỏi giải và hoàn phí (nếu có).", true);
        }
        catch
        {
            await tx.RollbackAsync();
            throw;
        }
    }

    private static TournamentDto Map(Tournament t) => new()
    {
        TournamentId = t.TournamentId,
        ComplexId = t.ComplexId,
        Name = t.Name,
        StartDate = t.StartDate,
        EndDate = t.EndDate,
        EntryFee = t.EntryFee,
        MaxTeams = t.MaxTeams,
        RegisteredTeams = t.RegisteredTeams,
        Status = t.Status,
        SportType = t.SportType
    };
}
