namespace ProSport.Domain.Entities;

public class Equipment : BaseEntity
{
    public int EquipmentId { get; set; }
    public int EquipmentCategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string EquipmentName { get; set; } = string.Empty;
    public string Category { get; set; } = "Racket";
    public string SportType { get; set; } = string.Empty;

    /// <summary>Giá bán lẻ (shop, giỏ hàng, báo cáo tồn kho).</summary>
    public decimal RetailPrice { get; set; }

    public string? Description { get; set; }
    public int StockQuantity { get; set; }
    public string Status { get; set; } = "Available";
    public string? ImageUrl { get; set; }

    public EquipmentCategory EquipmentCategory { get; set; } = null!;
    public ICollection<InventoryTransaction> InventoryTransactions { get; set; } = new List<InventoryTransaction>();
}
