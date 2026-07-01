namespace ProSport.Domain.Constants;

public static class CourtStatuses
{
    public const string Active = "Available";
    public const string Maintenance = "Maintenance";
    public const string Inactive = "Inactive";

    public static string NormalizeApiStatus(string status) => status?.Trim().ToUpperInvariant() switch
    {
        "ACTIVE" => Active,
        "MAINTENANCE" => Maintenance,
        "INACTIVE" => Inactive,
        "AVAILABLE" => Active,
        _ when string.Equals(status, Active, StringComparison.OrdinalIgnoreCase) => Active,
        _ when string.Equals(status, Maintenance, StringComparison.OrdinalIgnoreCase) => Maintenance,
        _ when string.Equals(status, Inactive, StringComparison.OrdinalIgnoreCase) => Inactive,
        _ => status ?? Active
    };

    public static string ToApiStatus(string dbStatus) => dbStatus switch
    {
        Active => "ACTIVE",
        Maintenance => "MAINTENANCE",
        Inactive => "INACTIVE",
        _ => dbStatus.ToUpperInvariant()
    };

    public static bool IsBookable(string dbStatus) =>
        string.Equals(dbStatus, Active, StringComparison.OrdinalIgnoreCase);
}
