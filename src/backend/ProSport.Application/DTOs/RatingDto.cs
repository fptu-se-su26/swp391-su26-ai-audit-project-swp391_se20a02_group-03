using System.ComponentModel.DataAnnotations;

namespace ProSport.Application.DTOs;

// TK-035: Dữ liệu khách hàng gửi lên khi chấm điểm 1 người chơi sau trận đấu.
public class CreateRatingDto
{
    [Required]
    public int RatedUserId { get; set; }

    [Required]
    public int MatchId { get; set; }

    [Range(1, 5, ErrorMessage = "Điểm đánh giá phải từ 1 đến 5 sao.")]
    public int Score { get; set; }

    [MaxLength(1000)]
    public string? Comment { get; set; }
}

public class RatingDto
{
    public int PlayerRatingId { get; set; }
    public int RaterId { get; set; }
    public int RatedUserId { get; set; }
    public int MatchId { get; set; }
    public int Score { get; set; }
    public string? Comment { get; set; }
    public DateTime CreatedAt { get; set; }
}

// TK-035: Điểm tín nhiệm (Trust Score) tổng hợp của 1 người chơi.
public class TrustScoreDto
{
    public int UserId { get; set; }
    public double TrustScore { get; set; }
    public int TotalRatings { get; set; }
}

// Bảng xếp hạng người chơi theo Trust Score.
public class LeaderboardEntryDto
{
    public int Rank { get; set; }
    public int UserId { get; set; }
    public string FullName { get; set; } = null!;
    public string? AvatarUrl { get; set; }
    public double TrustScore { get; set; }
    public int TotalRatings { get; set; }
    public int MatchCount { get; set; }
    public int Points { get; set; }
}
