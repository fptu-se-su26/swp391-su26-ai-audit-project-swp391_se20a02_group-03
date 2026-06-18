namespace ProSport.Domain.Entities;

public class EquipmentRental
{
    public int DetailId { get; set; }
    public int? BookingId { get; set; }
    public int UserId { get; set; }
    public int EquipmentId { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal Subtotal { get; set; }
    public decimal DepositAmount { get; set; }
    public string DepositStatus { get; set; } = "Held";
    public string RentalStatus { get; set; } = "Rented";
    public string? ReturnCondition { get; set; }
    public string? DamageNote { get; set; }
    public decimal? DamageFee { get; set; }
    public decimal? DepositRefundAmount { get; set; }
    public decimal? AdditionalCharge { get; set; }
    public DateTime RentedAt { get; set; } = DateTime.UtcNow;

    public Equipment Equipment { get; set; } = null!;
    public Booking? Booking { get; set; }
}
