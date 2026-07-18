using ProSport.Application.DTOs;

namespace ProSport.Application.Interfaces;

public interface ITournamentService
{
    Task<ApiResponseDto<IEnumerable<TournamentDto>>> GetByComplexAsync(int complexId);
    Task<ApiResponseDto<TournamentDto>> CreateAsync(int ownerUserId, int complexId, CreateTournamentDto dto, bool isAdmin = false);
    Task<ApiResponseDto<bool>> RegisterAsync(int userId, int tournamentId, RegisterTournamentDto dto);

    // Tournament lifecycle transitions (organizer/admin).
    Task<ApiResponseDto<TournamentDto>> CloseRegistrationAsync(int userId, int tournamentId, bool isAdmin = false);
    Task<ApiResponseDto<TournamentDto>> CompleteAsync(int userId, int tournamentId, bool isAdmin = false);
    Task<ApiResponseDto<TournamentDto>> CancelAsync(int userId, int tournamentId, bool isAdmin = false);

    // Player self-withdraw: Registered -> Cancelled (refund entry fee if paid).
    Task<ApiResponseDto<bool>> WithdrawAsync(int userId, int tournamentId);
}
