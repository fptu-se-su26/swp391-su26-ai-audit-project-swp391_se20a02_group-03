namespace ProSport.Domain.Constants;

/// <summary>
/// Trạng thái vòng đời của Tournament (cột Tournament.Status).
/// Open -> Closed -> Completed, hoặc Open/Closed -> Cancelled.
/// Tập trung magic-string như BookingStatus/MatchStatus để tránh typo và lệch giá trị.
/// </summary>
public static class TournamentStatus
{
    public const string Open = "Open";
    public const string Closed = "Closed";
    public const string Completed = "Completed";
    public const string Cancelled = "Cancelled";
}
