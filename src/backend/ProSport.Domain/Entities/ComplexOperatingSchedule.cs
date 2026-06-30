namespace ProSport.Domain.Entities;

public class ComplexOperatingSchedule : BaseEntity
{
    public int ComplexOperatingScheduleId { get; set; }
    public int ComplexId { get; set; }
    public int DayOfWeek { get; set; }
    public TimeSpan OpenTime { get; set; }
    public TimeSpan CloseTime { get; set; }

    public Complex Complex { get; set; } = null!;
}
