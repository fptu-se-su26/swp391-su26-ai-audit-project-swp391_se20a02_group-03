namespace ProSport.Domain.Constants;

public static class VoucherStatus
{
    public const string Active = "Active";
    public const string Inactive = "Inactive";
    public const string Expired = "Expired";

    private static readonly HashSet<string> ValidStatuses = new(StringComparer.Ordinal)
    {
        Active,
        Inactive,
        Expired
    };

    public static bool IsValid(string? status) =>
        status != null && ValidStatuses.Contains(status);

    public static bool IsUsable(string status) =>
        string.Equals(status, Active, StringComparison.OrdinalIgnoreCase);
}
