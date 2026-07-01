namespace ProSport.Tests;

/// <summary>
/// Runs only when PROSPORT_INTEGRATION_CONNECTION_STRING points to an isolated SQL Server test database.
/// Never defaults to local ProSportDB.
/// </summary>
public sealed class SqlServerFactAttribute : FactAttribute
{
    public SqlServerFactAttribute()
    {
        if (string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable("PROSPORT_INTEGRATION_CONNECTION_STRING")))
            Skip = "Set PROSPORT_INTEGRATION_CONNECTION_STRING to an isolated SQL Server test database (not ProSportDB dev).";
    }
}
