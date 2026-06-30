namespace ProSport.Domain.Entities;

public class RecurringBookingRule : BaseEntity
{
    public int RecurringBookingRuleId { get; set; }
    public int UserId { get; set; }
    public int CourtId { get; set; }
    public int ComplexId { get; set; }
    public DayOfWeek DayOfWeek { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public DateTime ValidFrom { get; set; }
    public DateTime ValidTo { get; set; }
    public string Frequency { get; set; } = "Weekly";
    public string Status { get; set; } = "Active";
    public DateTime? LastGeneratedDate { get; set; }

    public User User { get; set; } = null!;
    public Court Court { get; set; } = null!;
    public Complex Complex { get; set; } = null!;
}
