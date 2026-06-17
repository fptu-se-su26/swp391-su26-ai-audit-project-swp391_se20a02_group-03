using System;

namespace ProSport.Application.DTOs;

public class CreatePricingRuleDto
{
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public decimal PricePerHour { get; set; }
    public bool IsWeekend { get; set; }
    public int? DayOfWeek { get; set; }
}
