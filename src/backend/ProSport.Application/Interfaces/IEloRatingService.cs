using ProSport.Application.DTOs;

namespace ProSport.Application.Interfaces;

public interface IEloRatingService
{
    Task<ApiResponseDto<UserSkillRatingDto>> GetUserRatingAsync(int userId, string sportType);
    Task<ApiResponseDto<bool>> SubmitMatchResultAsync(int reporterUserId, SubmitMatchResultDto dto);
    Task<ApiResponseDto<bool>> ConfirmMatchResultAsync(int confirmerUserId, int matchId);
    Task<ApiResponseDto<bool>> DisputeMatchResultAsync(int disputerUserId, int matchId);
}
