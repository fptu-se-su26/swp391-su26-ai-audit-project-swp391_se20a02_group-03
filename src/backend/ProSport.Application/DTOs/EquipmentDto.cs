using System.ComponentModel.DataAnnotations;

namespace ProSport.Application.DTOs;

public class EquipmentDto
{
    public int EquipmentId { get; set; }
    public int EquipmentCategoryId { get; set; }
    public string CategoryName { get; set; } = "Unknown";
    public string Name { get; set; } = null!;
    public string Category { get; set; } = "Racket";
    public string Type { get; set; } = "Badminton";
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public decimal RetailPrice { get; set; }
    public int StockQuantity { get; set; }
    public string Status { get; set; } = "Available";
    public string? ImageUrl { get; set; }
}

public class BuyEquipmentRequest
{
    [Range(1, int.MaxValue, ErrorMessage = "Thiết bị không hợp lệ.")]
    public int EquipmentId { get; set; }

    [Range(1, 100, ErrorMessage = "Số lượng phải từ 1 đến 100.")]
    public int Quantity { get; set; }

    public int? BookingId { get; set; }
}
