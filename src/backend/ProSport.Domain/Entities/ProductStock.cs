namespace ProSport.Domain.Entities;

public class ProductStock : BaseEntity
{
    public int ProductStockId { get; set; }
    public int ComplexId { get; set; }
    public string Sku { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public int LowStockThreshold { get; set; } = 5;
    public decimal SellingPrice { get; set; }
    public string Status { get; set; } = "Active";

    public Complex Complex { get; set; } = null!;
}
