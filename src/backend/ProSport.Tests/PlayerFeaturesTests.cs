using FluentAssertions;
using ProSport.Application.Services;
using ProSport.Domain.Entities;
using Xunit;

namespace ProSport.Tests;

public class PlayerFeaturesTests
{
    [Fact]
    public void BookingPriceCalculator_UsesFallbackWhenNoRules()
    {
        var court = new Court { PricingRules = new List<PricingRule>() };
        var price = BookingPriceCalculator.Calculate(court, DateTime.UtcNow.Date, TimeSpan.FromHours(10), TimeSpan.FromHours(12));
        price.Should().Be(200000m);
    }

    [Fact]
    public void BookingPriceCalculator_AppliesMembershipDiscount()
    {
        var court = new Court { PricingRules = new List<PricingRule>() };
        var price = BookingPriceCalculator.Calculate(
            court,
            DateTime.UtcNow.Date,
            TimeSpan.FromHours(10),
            TimeSpan.FromHours(12),
            membershipDiscountPercent: 10m);
        price.Should().Be(180000m);
    }

    [Fact]
    public void EloRating_WinnerGainsRating()
    {
        const int k = 32;
        var winnerElo = 1200;
        var loserElo = 1200;
        var expectedWinner = 1.0 / (1.0 + Math.Pow(10, (loserElo - winnerElo) / 400.0));
        var delta = (int)Math.Round(k * (1 - expectedWinner));
        delta.Should().BeGreaterThan(0);
    }
}
