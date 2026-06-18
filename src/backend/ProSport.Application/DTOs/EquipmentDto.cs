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
    
    // Properties from Rent/Return branch
    public string Category { get; set; } = null!;
    public string Type { get; set; } = null!;
    public decimal RetailPrice { get; set; }
    public decimal RentalPrice { get; set; }
    public int RentalStock { get; set; }
    public int SalesStock { get; set; }
    public decimal DepositAmountPerUnit => Math.Round(RetailPrice * 0.20m, 0);

    // Compatibility properties for frontend
    public int TotalQuantity => RentalStock;
    public int AvailableQuantity => RentalStock;
}
