namespace ProSport.Application.DTOs;

public class EquipmentRentalDto
{
    public int EquipmentRentalId { get; set; }
    public int EquipmentId { get; set; }
    public string EquipmentName { get; set; } = null!;
    public int? BookingId { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
    public decimal DepositAmount { get; set; }
    public string DepositStatus { get; set; } = null!;
    public string RentalStatus { get; set; } = null!;
    public string? ReturnCondition { get; set; }
    public string? DamageNote { get; set; }
    public decimal? DamageFee { get; set; }
    public decimal? DepositRefundAmount { get; set; }
    public decimal? AdditionalCharge { get; set; }
    public DateTime RentedAt { get; set; }
}
