using FluentAssertions;
using ProSport.Domain.Constants;

namespace ProSport.Tests;

public class OwnerTask3Tests
{
    [Fact]
    public void RentalAssetStatuses_CannotRentWhenRented()
    {
        RentalAssetStatuses.CanRent(RentalAssetStatuses.Rented).Should().BeFalse();
        RentalAssetStatuses.CanRent(RentalAssetStatuses.Available).Should().BeTrue();
    }

    [Fact]
    public void RentalAssetStatuses_DamagedRequiresMaintenanceBeforeAvailable()
    {
        RentalAssetStatuses.CanTransitionTo(RentalAssetStatuses.Damaged, RentalAssetStatuses.Available).Should().BeFalse();
        RentalAssetStatuses.CanTransitionTo(RentalAssetStatuses.Damaged, RentalAssetStatuses.Maintenance).Should().BeTrue();
        RentalAssetStatuses.CanTransitionTo(RentalAssetStatuses.Maintenance, RentalAssetStatuses.Available).Should().BeTrue();
    }

    [Fact]
    public void RentalAssetStatuses_RentedToDamaged_Allowed()
    {
        RentalAssetStatuses.CanTransitionTo(RentalAssetStatuses.Rented, RentalAssetStatuses.Damaged).Should().BeTrue();
    }
}
