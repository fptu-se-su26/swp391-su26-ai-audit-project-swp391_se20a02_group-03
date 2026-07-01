namespace ProSport.Domain.Entities;

public class MatchResult : BaseEntity
{
    public int MatchResultId { get; set; }
    public int MatchId { get; set; }
    public int? WinnerUserId { get; set; }
    public int? LoserUserId { get; set; }
    public int ReportedByUserId { get; set; }
    public string Status { get; set; } = "Pending";
    public int? TeamAScore { get; set; }
    public int? TeamBScore { get; set; }

    public int? ConfirmedByUserId { get; set; }
    public DateTime? ConfirmedAt { get; set; }
    public string? DisputeReason { get; set; }
    public DateTime? DisputedAt { get; set; }

    public Match Match { get; set; } = null!;
    public User? Winner { get; set; }
    public User ReportedBy { get; set; } = null!;
    public User? ConfirmedBy { get; set; }
}
