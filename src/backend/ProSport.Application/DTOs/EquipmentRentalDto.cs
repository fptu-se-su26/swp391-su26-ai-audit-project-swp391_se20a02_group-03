using System.ComponentModel.DataAnnotations;

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
    [Range(1, int.MaxValue, ErrorMessage = "Thiết bị không hợp lệ.")]
    public int EquipmentId { get; set; }

    [Range(1, 100, ErrorMessage = "Số lượng phải từ 1 đến 100.")]
    public int Quantity { get; set; } = 1;

    public int? BookingId { get; set; }

    [EmailAddress(ErrorMessage = "Email khách không đúng định dạng.")]
    public string? CustomerEmail { get; set; }

    public int? CustomerUserId { get; set; }
}

public class ReturnEquipmentRequest
{
    [Required(ErrorMessage = "Tình trạng khi trả là bắt buộc.")]
    [StringLength(30)]
    public string ReturnCondition { get; set; } = "Good";

    [StringLength(500, ErrorMessage = "Ghi chú hư hỏng tối đa 500 ký tự.")]
    public string? DamageNote { get; set; }

    [Range(0, 100_000_000, ErrorMessage = "Phí hư hỏng phải từ 0 đến 100 triệu.")]
    public decimal? DamageFee { get; set; }
}
