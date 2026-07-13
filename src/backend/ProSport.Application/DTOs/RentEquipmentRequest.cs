using System.ComponentModel.DataAnnotations;

namespace ProSport.Application.DTOs;

public class RentEquipmentRequest
{
    [Range(1, int.MaxValue, ErrorMessage = "Thiết bị không hợp lệ.")]
    public int EquipmentId { get; set; }

    public int? BookingId { get; set; }

    [Range(1, 100, ErrorMessage = "Số lượng thuê phải từ 1 đến 100.")]
    public int Quantity { get; set; }

    [StringLength(50, ErrorMessage = "Số serial tối đa 50 ký tự.")]
    public string? PreferredSerialNumber { get; set; }
}
