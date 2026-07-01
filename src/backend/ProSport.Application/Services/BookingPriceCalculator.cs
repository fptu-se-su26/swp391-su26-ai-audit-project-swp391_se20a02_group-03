using ProSport.Domain.Entities;

namespace ProSport.Application.Services;

public static class BookingPriceCalculator
{
    public static decimal Calculate(
        Court court,
        DateTime bookingDate,
        TimeSpan startTime,
        TimeSpan endTime,
        decimal membershipDiscountPercent = 0)
    {
        var basePrice = CalculateBasePrice(court, bookingDate, startTime, endTime);
        return ApplyMembershipDiscount(basePrice, membershipDiscountPercent);
    }

    public static decimal ApplyMembershipDiscount(decimal amount, decimal discountPercent)
    {
        if (discountPercent <= 0)
            return amount;

        var multiplier = 1m - discountPercent / 100m;
        return Math.Round(amount * multiplier, 0, MidpointRounding.AwayFromZero);
    }

    private static decimal CalculateBasePrice(Court court, DateTime bookingDate, TimeSpan startTime, TimeSpan endTime)
    {
        var isWeekend = bookingDate.DayOfWeek is DayOfWeek.Saturday or DayOfWeek.Sunday;

        var rules = court.PricingRules?
            .Where(r => r.IsWeekend == isWeekend && !r.IsDeleted)
            .OrderBy(r => r.StartTime)
            .ToList();

        if (rules == null || rules.Count == 0)
            return (decimal)(endTime - startTime).TotalHours * 100000m;

        decimal totalPrice = 0;
        var current = startTime;

        while (current < endTime)
        {
            var rule = rules.FirstOrDefault(r => r.StartTime <= current && r.EndTime > current);
            var ratePerHour = rule?.PricePerHour ?? 100000m;
            var segmentEnd = endTime;
            if (rule != null && rule.EndTime < endTime)
                segmentEnd = rule.EndTime;

            if (segmentEnd <= current)
                break;

            var hours = (segmentEnd - current).TotalHours;
            totalPrice += (decimal)hours * ratePerHour;
            current = segmentEnd;
        }

        return totalPrice;
    }
}
