namespace ProSport.Application.DTOs;

public class EquipmentDashboardDto
{
    public decimal TotalSalesRevenue { get; set; }
    public int TotalItemsSold { get; set; }
    public int LowStockItemsCount { get; set; }
    public decimal TotalInventoryValue { get; set; }
    public List<TopEquipmentDto> TopSellingEquipment { get; set; } = new();
}

public class TopEquipmentDto
{
    public string EquipmentName { get; set; } = null!;
    public int TotalSold { get; set; }
    public decimal Revenue { get; set; }
}
