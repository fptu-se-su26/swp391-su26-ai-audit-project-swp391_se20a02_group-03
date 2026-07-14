using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using ProSport.Domain.Constants;
using ProSport.Domain.Entities;

namespace ProSport.Application.Services;

// TK-035: Triển khai nghiệp vụ đánh giá người chơi + Trust Score.
public class RatingService : IRatingService
{
    private readonly IPlayerRatingRepository _ratingRepository;
    private readonly IUserRepository _userRepository;
    private readonly IMatchRepository _matchRepository;

    public RatingService(
        IPlayerRatingRepository ratingRepository,
        IUserRepository userRepository,
        IMatchRepository matchRepository)
    {
        _ratingRepository = ratingRepository;
        _userRepository = userRepository;
        _matchRepository = matchRepository;
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

        // TK-035: Chỉ được đánh giá người chơi CÙNG tham gia trận đấu này — cả người
        // chấm và người bị chấm đều phải là thành viên đã được duyệt (Approved) của kèo.
        // Nếu thiếu bước này, bất kỳ ai cũng có thể spam đánh giá bất kỳ ai để thao túng Trust Score.
        var match = await _matchRepository.GetMatchByIdAsync(dto.MatchId);
        if (match is null)
        {
            return new ApiResponseDto<RatingDto>(404, "Không tìm thấy trận đấu.");
        }

        var raterParticipant = await _matchRepository.GetParticipantAsync(dto.MatchId, raterId);
        var ratedParticipant = await _matchRepository.GetParticipantAsync(dto.MatchId, dto.RatedUserId);
        static bool IsActiveMember(MatchParticipant? p) => p is not null && p.Status == MatchParticipantStatus.Approved;
        if (!IsActiveMember(raterParticipant) || !IsActiveMember(ratedParticipant))
        {
            return new ApiResponseDto<RatingDto>(403, "Bạn chỉ được đánh giá người chơi cùng tham gia trận đấu này.");
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

    public async Task<ApiResponseDto<IEnumerable<LeaderboardEntryDto>>> GetLeaderboardAsync(int limit = 20)
    {
        var safeLimit = Math.Clamp(limit, 1, 50);
        var entries = await _ratingRepository.GetLeaderboardAsync(safeLimit);
        return new ApiResponseDto<IEnumerable<LeaderboardEntryDto>>(200, "Lấy bảng xếp hạng thành công.", entries);
    }
}
