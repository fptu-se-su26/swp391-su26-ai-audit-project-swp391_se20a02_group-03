using ProSport.Application.DTOs;

namespace ProSport.Application.Interfaces;

// TK-035: Nghiệp vụ đánh giá người chơi và tính Trust Score.
public interface IRatingService
{
    Task<ApiResponseDto<RatingDto>> CreateRatingAsync(int raterId, CreateRatingDto dto);
    Task<ApiResponseDto<TrustScoreDto>> GetTrustScoreAsync(int userId);
    Task<ApiResponseDto<IEnumerable<LeaderboardEntryDto>>> GetLeaderboardAsync(int limit = 20);
}
