namespace ProSport.Application.DTOs;

public class EquipmentDto
{
    public int EquipmentId { get; set; }
    public int EquipmentCategoryId { get; set; }
    public string CategoryName { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public string Status { get; set; } = null!;
    public string? ImageUrl { get; set; }
}
