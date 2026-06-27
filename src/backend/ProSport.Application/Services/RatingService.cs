using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using ProSport.Domain.Entities;

namespace ProSport.Application.Services;

// TK-035: Triển khai nghiệp vụ đánh giá người chơi + Trust Score.
public class RatingService : IRatingService
{
    private readonly IPlayerRatingRepository _ratingRepository;
    private readonly IUserRepository _userRepository;

    public RatingService(IPlayerRatingRepository ratingRepository, IUserRepository userRepository)
    {
        _ratingRepository = ratingRepository;
        _userRepository = userRepository;
    }

    public async Task<ApiResponseDto<RatingDto>> CreateRatingAsync(int raterId, CreateRatingDto dto)
    {
        if (dto.Score < 1 || dto.Score > 5)
        {
            return new ApiResponseDto<RatingDto>(400, "Điểm đánh giá phải từ 1 đến 5 sao.");
        }

        if (raterId == dto.RatedUserId)
        {
            return new ApiResponseDto<RatingDto>(400, "Bạn không thể tự đánh giá chính mình.");
        }

        var ratedUser = await _userRepository.GetByIdAsync(dto.RatedUserId);
        if (ratedUser is null)
        {
            return new ApiResponseDto<RatingDto>(404, "Không tìm thấy người chơi cần đánh giá.");
        }

        var alreadyRated = await _ratingRepository.ExistsAsync(raterId, dto.RatedUserId, dto.MatchId);
        if (alreadyRated)
        {
            return new ApiResponseDto<RatingDto>(409, "Bạn đã đánh giá người chơi này trong trận đấu này rồi.");
        }

        var rating = new PlayerRating
        {
            RaterId = raterId,
            RatedUserId = dto.RatedUserId,
            MatchId = dto.MatchId,
            Score = dto.Score,
            Comment = dto.Comment
        };

        await _ratingRepository.AddAsync(rating);

        var resultDto = new RatingDto
        {
            PlayerRatingId = rating.PlayerRatingId,
            RaterId = rating.RaterId,
            RatedUserId = rating.RatedUserId,
            MatchId = rating.MatchId,
            Score = rating.Score,
            Comment = rating.Comment,
            CreatedAt = rating.CreatedAt
        };

        return new ApiResponseDto<RatingDto>(201, "Đánh giá người chơi thành công.", resultDto);
    }

    public async Task<ApiResponseDto<TrustScoreDto>> GetTrustScoreAsync(int userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user is null)
        {
            return new ApiResponseDto<TrustScoreDto>(404, "Không tìm thấy người dùng.");
        }

        var (average, count) = await _ratingRepository.GetTrustScoreAsync(userId);

        var dto = new TrustScoreDto
        {
            UserId = userId,
            TrustScore = Math.Round(average, 2),
            TotalRatings = count
        };

        return new ApiResponseDto<TrustScoreDto>(200, "Lấy điểm tín nhiệm thành công.", dto);
    }
}
