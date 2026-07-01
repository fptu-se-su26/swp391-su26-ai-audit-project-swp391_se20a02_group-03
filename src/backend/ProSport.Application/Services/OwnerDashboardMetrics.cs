namespace ProSport.Application.Services;

/// <summary>
/// Quy tắc tính dashboard Owner — tách ra để unit test.
/// </summary>
public static class OwnerDashboardMetrics
{
    public static readonly string[] ExcludedBookingStatuses = { "Cancelled", "Expired", "PendingPayment" };

    public static readonly string[] OccupancyBookingStatuses = { "Confirmed", "Completed", "CheckedIn" };

    public static bool CountsTowardMetrics(string? status) =>
        !string.IsNullOrEmpty(status)
        && !ExcludedBookingStatuses.Contains(status, StringComparer.OrdinalIgnoreCase);

    public static bool CountsTowardOccupancy(string? status) =>
        !string.IsNullOrEmpty(status)
        && OccupancyBookingStatuses.Contains(status, StringComparer.OrdinalIgnoreCase);
}
