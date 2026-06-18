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
    public decimal RentalPrice { get; set; }
    public int StockQuantity { get; set; }
    public int RentalStock { get; set; }
    public int SalesStock { get; set; }
    public string Status { get; set; } = "Available";
    public string? ImageUrl { get; set; }
    public decimal DepositAmountPerUnit => Math.Round(RetailPrice * 0.20m, 0);

    // Compatibility properties for frontend
    public int TotalQuantity => RentalStock;
    public int AvailableQuantity => RentalStock;
}
