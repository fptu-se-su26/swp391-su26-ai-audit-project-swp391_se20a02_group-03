namespace ProSport.Domain.Entities;

public class ComplexMaintenanceWindow : BaseEntity
{
    public int ComplexMaintenanceWindowId { get; set; }
    public int ComplexId { get; set; }
    public int? CourtId { get; set; }
    public DateTime StartAt { get; set; }
    public DateTime EndAt { get; set; }
    public string? Reason { get; set; }

    public Complex Complex { get; set; } = null!;
    public Court? Court { get; set; }
}
