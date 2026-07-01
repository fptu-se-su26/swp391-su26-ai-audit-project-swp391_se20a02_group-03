namespace ProSport.Domain.Constants;

public static class RentalAssetStatuses
{
    public const string Available = "AVAILABLE";
    public const string Rented = "RENTED";
    public const string Damaged = "DAMAGED";
    public const string Maintenance = "MAINTENANCE";
    public const string Lost = "LOST";
    public const string Retired = "RETIRED";

    public static readonly HashSet<string> Rentable = new(StringComparer.OrdinalIgnoreCase)
    {
        Available
    };

    public static bool CanRent(string status) =>
        Rentable.Contains(status ?? Available);

    public static bool CanTransitionTo(string from, string to) => (from, to) switch
    {
        (Available, Rented) => true,
        (Rented, Available) => true,
        (Rented, Damaged) => true,
        (Damaged, Maintenance) => true,
        (Maintenance, Available) => true,
        (_, Lost) => from is Rented or Available,
        (_, Retired) => true,
        _ => false
    };
}
