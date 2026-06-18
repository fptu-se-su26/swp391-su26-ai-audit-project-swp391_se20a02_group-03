namespace ProSport.Application.DTOs;

public class EquipmentDto
{
    public int EquipmentId { get; set; }
    public string Name { get; set; } = null!;
    public string Category { get; set; } = null!;
    public string Type { get; set; } = null!;
    public decimal RetailPrice { get; set; }
    public decimal RentalPrice { get; set; }
    public int RentalStock { get; set; }
    public int SalesStock { get; set; }
    public string? ImageUrl { get; set; }
    public string? Description { get; set; }
    public decimal DepositAmountPerUnit => Math.Round(RetailPrice * 0.20m, 0);

    // Compatibility properties for frontend
    public int TotalQuantity => RentalStock;
    public int AvailableQuantity => RentalStock;
}
