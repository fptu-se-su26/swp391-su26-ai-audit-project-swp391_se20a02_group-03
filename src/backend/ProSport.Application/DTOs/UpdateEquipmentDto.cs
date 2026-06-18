namespace ProSport.Application.DTOs;

public class UpdateEquipmentDto
{
    public int EquipmentCategoryId { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string Status { get; set; } = null!;
    public string? ImageUrl { get; set; }
}
