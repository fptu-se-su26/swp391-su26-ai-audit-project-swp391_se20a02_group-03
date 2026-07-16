namespace ProSport.Domain.Constants;

public static class CourtStatuses
{
    // "Available" is the canonical persisted value used by the schema and
    // availability queries. The API still exposes this state as "ACTIVE".
    public const string Active = "Available";
    public const string Maintenance = "Maintenance";
    public const string Inactive = "Inactive";

    public static string NormalizeApiStatus(string? status) => status?.Trim().ToUpperInvariant() switch
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

    public static string ToApiStatus(string dbStatus) => NormalizeApiStatus(dbStatus) switch
    {
        Active => "ACTIVE",
        Maintenance => "MAINTENANCE",
        Inactive => "INACTIVE",
        var normalized => normalized.ToUpperInvariant()
    };

    public static bool IsBookable(string dbStatus) =>
        string.Equals(NormalizeApiStatus(dbStatus), Active, StringComparison.OrdinalIgnoreCase);
}
