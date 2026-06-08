namespace ProSport.Domain.Entities;

public class PricingRule : BaseEntity
{
    public int PricingRuleId { get; set; }
    public int CourtId { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public decimal PricePerHour { get; set; }
    public bool IsWeekend { get; set; }

    // Navigation properties
    public Court Court { get; set; } = null!;
}
