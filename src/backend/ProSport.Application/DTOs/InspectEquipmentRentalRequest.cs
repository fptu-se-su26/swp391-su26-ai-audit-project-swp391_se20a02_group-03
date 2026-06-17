namespace ProSport.Application.DTOs;

public class InspectEquipmentRentalRequest
{
    public string Condition { get; set; } = null!; // Good, Damaged, Lost
    public string? DamageNote { get; set; }
    public decimal? DamageFee { get; set; }
}
