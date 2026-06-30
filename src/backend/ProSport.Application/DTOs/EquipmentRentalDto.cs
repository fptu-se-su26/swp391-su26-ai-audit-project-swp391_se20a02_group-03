namespace ProSport.Application.DTOs;

public class EquipmentRentalDto
{
    public int DetailId { get; set; }
    public int? BookingId { get; set; }
    public int UserId { get; set; }
    public string? CustomerName { get; set; }
    public int EquipmentId { get; set; }
    public string EquipmentName { get; set; } = null!;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal Subtotal { get; set; }
    public decimal DepositAmount { get; set; }
    public string RentalStatus { get; set; } = null!;
    public string? ReturnCondition { get; set; }
    public string? DamageNote { get; set; }
    public DateTime RentedAt { get; set; }
}

public class StaffRentEquipmentRequest
{
    public int EquipmentId { get; set; }
    public int Quantity { get; set; } = 1;
    public int? BookingId { get; set; }
    public string? CustomerEmail { get; set; }
    public int? CustomerUserId { get; set; }
}

public class ReturnEquipmentRequest
{
    public string ReturnCondition { get; set; } = "Good";
    public string? DamageNote { get; set; }
    public decimal? DamageFee { get; set; }
}
