using ProSport.Application.DTOs;

namespace ProSport.Application.Interfaces;

public interface ITournamentService
{
    Task<ApiResponseDto<IEnumerable<TournamentDto>>> GetByComplexAsync(int complexId);
    Task<ApiResponseDto<TournamentDto>> CreateAsync(int ownerUserId, int complexId, CreateTournamentDto dto, bool isAdmin = false);
    Task<ApiResponseDto<bool>> RegisterAsync(int userId, int tournamentId, RegisterTournamentDto dto);
}
