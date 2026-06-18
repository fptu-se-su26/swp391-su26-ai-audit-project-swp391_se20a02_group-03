namespace ProSport.Domain.Entities;

public class Equipment : BaseEntity
{
    public int EquipmentId { get; set; }
    public int EquipmentCategoryId { get; set; }
    public string Name { get; set; } = null!;
    public string EquipmentName { get; set; } = null!;
    public string Category { get; set; } = "Racket"; // Racket, Footwear, Apparel, Ball / Birdie, Accessories, Protection
    public string SportType { get; set; } = null!; // Badminton, Pickleball
    public decimal RetailPrice { get; set; } // Giá bán lẻ
    public decimal RentalPrice { get; set; } // Giá thuê (Computed: 5% RetailPrice)
    public int RentalStock { get; set; } // Số lượng trong kho cho thuê
    public int SalesStock { get; set; } // Số lượng trong kho bán
    public string? Description { get; set; }
    public decimal Price { get; set; } 
    public int StockQuantity { get; set; }
    public string Status { get; set; } = "Available"; // Available, Out of Stock, Discontinued
    public string? ImageUrl { get; set; }

    // Navigation properties
    public EquipmentCategory EquipmentCategory { get; set; } = null!;
    public ICollection<InventoryTransaction> InventoryTransactions { get; set; } = new List<InventoryTransaction>();
    public ICollection<EquipmentRental> Rentals { get; set; } = new List<EquipmentRental>();
    public ICollection<EquipmentUnit> Units { get; set; } = new List<EquipmentUnit>();
}
