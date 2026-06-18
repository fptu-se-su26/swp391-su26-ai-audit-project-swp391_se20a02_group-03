namespace ProSport.Application.DTOs;

public class EquipmentDashboardDto
{
    public int ActiveRentals { get; set; }
    public decimal TotalRevenue { get; set; }
    public int PendingInspections { get; set; }
    public decimal TotalEquipmentValue { get; set; }
    public UnitsByStatusDto UnitsByStatus { get; set; } = new();
    public List<TopEquipmentDto> TopRentedEquipment { get; set; } = new();
}

public class UnitsByStatusDto
{
    public int Available { get; set; }
    public int Rented { get; set; }
    public int Maintenance { get; set; }
    public int Liquidated { get; set; }
}

public class TopEquipmentDto
{
    public string EquipmentName { get; set; } = null!;
    public int TotalRentals { get; set; }
    public decimal Revenue { get; set; }
}
