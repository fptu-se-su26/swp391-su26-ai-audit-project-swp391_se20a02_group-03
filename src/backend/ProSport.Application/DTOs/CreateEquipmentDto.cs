namespace ProSport.Application.DTOs;

public class CreateEquipmentDto
{
    public int EquipmentCategoryId { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
}
