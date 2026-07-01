using System.ComponentModel.DataAnnotations;

namespace ProSport.Application.DTOs;

public class SplitParticipantDto
{
    public int? UserId { get; set; }
    public string? Email { get; set; }
    public decimal Amount { get; set; }
}

public class CreateSplitBookingDto
{
    [Required]
    public List<CreateBookingDetailDto> Details { get; set; } = new();

    [Required, MinLength(2)]
    public List<SplitParticipantDto> Participants { get; set; } = new();

    public int SplitDeadlineHours { get; set; } = 24;
}

public class BookingPaymentShareDto
{
    public int ShareId { get; set; }
    public int BookingId { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; } = "";
    public decimal Amount { get; set; }
    public string Status { get; set; } = "";
    public DateTime PaymentDeadline { get; set; }
    public bool IsHost { get; set; }
}

public class CreateRecurringRuleDto
{
    [Range(1, int.MaxValue)]
    public int CourtId { get; set; }
    public DayOfWeek DayOfWeek { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public DateTime ValidFrom { get; set; }
    public DateTime ValidTo { get; set; }
    public string Frequency { get; set; } = "Weekly";
    public int GenerateWeeksAhead { get; set; } = 4;
}

public class RecurringBookingRuleDto
{
    public int RuleId { get; set; }
    public int CourtId { get; set; }
    public string CourtName { get; set; } = "";
    public DayOfWeek DayOfWeek { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public DateTime ValidFrom { get; set; }
    public DateTime ValidTo { get; set; }
    public string Status { get; set; } = "";
}

public class CancellationPolicyDto
{
    public int ComplexId { get; set; }
    public int FullRefundHoursBefore { get; set; } = 48;
    public int PartialRefundHoursBefore { get; set; } = 24;
    public decimal PartialRefundPercent { get; set; } = 50m;
    public decimal PenaltyPercentAfterPartial { get; set; } = 80m;
    public bool WeatherFullRefundEnabled { get; set; } = true;
}

public class CancellationRefundPreviewDto
{
    public decimal RefundAmount { get; set; }
    public decimal PenaltyAmount { get; set; }
    public decimal RefundPercent { get; set; }
    public string Message { get; set; } = "";
}

public class UserSkillRatingDto
{
    public int UserId { get; set; }
    public string SportType { get; set; } = "";
    public int EloRating { get; set; }
    public int GamesPlayed { get; set; }
    public int Wins { get; set; }
    public int Losses { get; set; }
}

public class SubmitMatchResultDto
{
    [Range(1, int.MaxValue)]
    public int MatchId { get; set; }
    public int? WinnerUserId { get; set; }
    public int? LoserUserId { get; set; }
    public int? TeamAScore { get; set; }
    public int? TeamBScore { get; set; }
    public string? SportType { get; set; }
}

public class DisputeMatchResultDto
{
    [MaxLength(500)]
    public string? Reason { get; set; }
}

public class TournamentDto
{
    public int TournamentId { get; set; }
    public int ComplexId { get; set; }
    public string Name { get; set; } = "";
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public decimal EntryFee { get; set; }
    public int MaxTeams { get; set; }
    public int RegisteredTeams { get; set; }
    public string Status { get; set; } = "";
    public string? SportType { get; set; }
}

public class CreateTournamentDto
{
    [Required, MaxLength(200)]
    public string Name { get; set; } = "";
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public decimal EntryFee { get; set; }
    public int MaxTeams { get; set; } = 16;
    public string? SportType { get; set; }
}

public class RegisterTournamentDto
{
    [Required, MaxLength(100)]
    public string TeamName { get; set; } = "";
}

public class MembershipDto
{
    public int MembershipId { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; } = "";
    public int ComplexId { get; set; }
    public string ComplexName { get; set; } = "";
    public string Tier { get; set; } = "";
    public decimal DiscountPercent { get; set; }
    public DateTime ValidFrom { get; set; }
    public DateTime ValidTo { get; set; }
    public string Status { get; set; } = "";
}

public class CreateMembershipDto
{
    [Range(1, int.MaxValue)]
    public int UserId { get; set; }
    [MaxLength(50)]
    public string Tier { get; set; } = "Standard";
    [Range(0, 100)]
    public decimal DiscountPercent { get; set; } = 10m;
    public DateTime ValidFrom { get; set; }
    public DateTime ValidTo { get; set; }
}

public class UpdateMembershipStatusDto
{
    [Required, MaxLength(20)]
    public string Status { get; set; } = "";
}

public class RealtimeNotificationDto
{
    public string Type { get; set; } = "";
    public string Title { get; set; } = "";
    public string Message { get; set; } = "";
    public object? Data { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
