using Xunit;
using ProSport.Domain.Constants;

namespace ProSport.Tests;

public class CourtStatusesTests
{
    [Theory]
    [InlineData("ACTIVE", "Available")]
    [InlineData("MAINTENANCE", "Maintenance")]
    [InlineData("INACTIVE", "Inactive")]
    [InlineData("AVAILABLE", "Available")]
    [InlineData("active", "Available")]
    [InlineData(" maintenance ", "Maintenance")]
    [InlineData("Available", "Available")]
    [InlineData(null, "Available")]
    [InlineData("Unknown", "Unknown")]
    public void NormalizeApiStatus_ShouldMapCorrectly(string? input, string expected)
    {
        var result = CourtStatuses.NormalizeApiStatus(input);
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData("Active", "ACTIVE")]
    [InlineData("Maintenance", "MAINTENANCE")]
    [InlineData("Inactive", "INACTIVE")]
    [InlineData("Available", "ACTIVE")]
    public void ToApiStatus_ShouldMapCorrectly(string dbStatus, string expected)
    {
        var result = CourtStatuses.ToApiStatus(dbStatus);
        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData("Available", true)]
    [InlineData("Active", true)]
    [InlineData("ACTIVE", true)]
    [InlineData("Maintenance", false)]
    [InlineData("Inactive", false)]
    public void IsBookable_ShouldSupportCanonicalAndLegacyValues(string dbStatus, bool expected)
    {
        Assert.Equal(expected, CourtStatuses.IsBookable(dbStatus));
    }
}
