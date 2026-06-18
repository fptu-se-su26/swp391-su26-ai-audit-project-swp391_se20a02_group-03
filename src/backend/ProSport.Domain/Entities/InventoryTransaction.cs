namespace ProSport.Domain.Entities;

public class InventoryTransaction : BaseEntity
{
    public int InventoryTransactionId { get; set; }
    
    public int EquipmentId { get; set; }
    public Equipment Equipment { get; set; } = null!;

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public string TransactionType { get; set; } = null!; // StockIn, StockOut
    public int Quantity { get; set; }
    public DateTime TransactionDate { get; set; } = DateTime.UtcNow;
    public string? Notes { get; set; }
}
