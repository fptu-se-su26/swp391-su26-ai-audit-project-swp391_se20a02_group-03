using System;

namespace ProSport.Application.DTOs;

public class CreatePricingRuleDto
{
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public decimal PricePerHour { get; set; }
    public decimal? Multiplier { get; set; }
    public bool IsWeekend { get; set; }
    public int? DayOfWeek { get; set; }
    public DateTime? ValidFrom { get; set; }
    public DateTime? ValidTo { get; set; }
    public string RuleType { get; set; } = "BasePrice";
    public string Status { get; set; } = "Active";
}
