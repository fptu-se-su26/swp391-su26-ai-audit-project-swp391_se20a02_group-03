namespace ProSport.Application.DTOs;

public class StockTransactionDto
{
    public int EquipmentId { get; set; }
    public int Quantity { get; set; }
    public string? Notes { get; set; }
}
