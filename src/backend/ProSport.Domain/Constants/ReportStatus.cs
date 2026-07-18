namespace ProSport.Domain.Constants;

/// <summary>
/// Trạng thái xử lý Report/Complaint (cột Report.Status).
/// Pending -> Investigating -> Resolved/Rejected (hoặc Pending -> Resolved/Rejected).
/// Tập trung magic-string như BookingStatus để tránh typo và lệch giá trị.
/// </summary>
public static class ReportStatus
{
    public const string Pending = "Pending";
    public const string Investigating = "Investigating";
    public const string Resolved = "Resolved";
    public const string Rejected = "Rejected";
}
