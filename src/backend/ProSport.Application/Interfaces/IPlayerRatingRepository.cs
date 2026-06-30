using ProSport.Application.DTOs;
using ProSport.Domain.Entities;

namespace ProSport.Application.Interfaces;

// TK-035: Truy xuất dữ liệu đánh giá người chơi.
public interface IPlayerRatingRepository
{
    Task<PlayerRating> AddAsync(PlayerRating rating);

    // Kiểm tra 1 người đã đánh giá 1 người khác trong cùng 1 kèo hay chưa (chống đánh giá trùng).
    Task<bool> ExistsAsync(int raterId, int ratedUserId, int matchId);

    // Trả về (điểm trung bình, tổng số lượt đánh giá) của 1 người được đánh giá.
    Task<(double Average, int Count)> GetTrustScoreAsync(int ratedUserId);

    Task<IReadOnlyList<LeaderboardEntryDto>> GetLeaderboardAsync(int limit);
}
