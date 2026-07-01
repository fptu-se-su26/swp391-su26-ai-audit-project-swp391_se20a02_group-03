using ProSport.Application.Services;

namespace ProSport.Tests;

public class OwnerDashboardMetricsTests
{
    [Theory]
    [InlineData("Cancelled")]
    [InlineData("Expired")]
    [InlineData("PendingPayment")]
    [InlineData("cancelled")]
    public void ExcludedStatuses_DoNotCountTowardMetrics(string status)
    {
        Assert.False(OwnerDashboardMetrics.CountsTowardMetrics(status));
        Assert.False(OwnerDashboardMetrics.CountsTowardOccupancy(status));
    }

    [Theory]
    [InlineData("Confirmed")]
    [InlineData("Completed")]
    [InlineData("CheckedIn")]
    public void ValidStatuses_CountTowardMetricsAndOccupancy(string status)
    {
        Assert.True(OwnerDashboardMetrics.CountsTowardMetrics(status));
        Assert.True(OwnerDashboardMetrics.CountsTowardOccupancy(status));
    }

    [Fact]
    public void Pending_CountsTowardMetrics_ButNotOccupancy()
    {
        Assert.True(OwnerDashboardMetrics.CountsTowardMetrics("Pending"));
        Assert.False(OwnerDashboardMetrics.CountsTowardOccupancy("Pending"));
    }
}
