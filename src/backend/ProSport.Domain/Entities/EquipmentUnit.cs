namespace ProSport.Domain.Entities;

public class EquipmentUnit : BaseEntity
{
    public int EquipmentUnitId { get; set; }
    public int EquipmentId { get; set; }
    public string SerialNumber { get; set; } = null!;
    public int RentalCount { get; set; }
    public string Status { get; set; } = "Available"; // Available, Rented, Maintenance, Liquidated
    public string? Condition { get; set; }

    public Equipment Equipment { get; set; } = null!;
}
