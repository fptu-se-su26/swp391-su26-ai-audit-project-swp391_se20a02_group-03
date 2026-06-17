namespace ProSport.Domain.Entities;

public class Equipment : BaseEntity
{
    public int EquipmentId { get; set; }
    public int EquipmentCategoryId { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public decimal Price { get; set; } 
    public int StockQuantity { get; set; }
    public string Status { get; set; } = "Available"; // Available, Out of Stock, Discontinued
    public string? ImageUrl { get; set; }

    // Navigation properties
    public EquipmentCategory EquipmentCategory { get; set; } = null!;
    public ICollection<InventoryTransaction> InventoryTransactions { get; set; } = new List<InventoryTransaction>();
    public ICollection<EquipmentRental> Rentals { get; set; } = new List<EquipmentRental>();
}
