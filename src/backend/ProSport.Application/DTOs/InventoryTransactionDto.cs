namespace ProSport.Application.DTOs;
using System;

public class InventoryTransactionDto
{
    public int Id { get; set; }
    public int EquipmentId { get; set; }
    public string EquipmentName { get; set; } = null!;
    public string TransactionType { get; set; } = null!;
    public int Quantity { get; set; }
    public DateTime TransactionDate { get; set; }
    public string? Notes { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; } = null!;
}
