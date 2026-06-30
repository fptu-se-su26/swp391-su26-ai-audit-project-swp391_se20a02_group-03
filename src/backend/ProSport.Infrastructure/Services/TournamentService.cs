using Microsoft.EntityFrameworkCore;

using ProSport.Application.DTOs;

using ProSport.Application.Interfaces;

using ProSport.Domain.Constants;

using ProSport.Domain.Entities;

using ProSport.Infrastructure.Data;



namespace ProSport.Infrastructure.Services;



public class TournamentService : ITournamentService

{

    private readonly ProSportDbContext _db;

    private readonly IOwnerAccessService _ownerAccess;



    public TournamentService(ProSportDbContext db, IOwnerAccessService ownerAccess)

    {

        _db = db;

        _ownerAccess = ownerAccess;

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



            if (tournament.EntryFee > 0)
            {
                var wallet = await _db.EscrowWallets.FirstOrDefaultAsync(w => w.UserId == userId);
                if (wallet == null || wallet.Balance < tournament.EntryFee)
                    return new ApiResponseDto<bool>(400, "Tài khoản không đủ tiền.");

                wallet.Balance -= tournament.EntryFee;

                _db.Transactions.Add(new Transaction
                {
                    EscrowWalletId = wallet.EscrowWalletId,
                    Amount = tournament.EntryFee,
                    Type = TransactionType.Payment,
                    Status = TransactionStatus.Completed,
                    ReferenceId = $"Tournament_{tournamentId}_Captain_{userId}",
                    Description = $"Phí đăng ký giải #{tournamentId} — {dto.TeamName.Trim()}"
                });
            }



            _db.TournamentRegistrations.Add(new TournamentRegistration

            {

                TournamentId = tournamentId,

                CaptainUserId = userId,

                TeamName = dto.TeamName.Trim()

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


