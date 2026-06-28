namespace ProSport.Application.DTOs;

// Số liệu tổng quan cho Bảng điều khiển Admin.
public class DashboardStatsDto
{
    public decimal TotalRevenue { get; set; }
    public int ActiveBookings { get; set; }
    public int OngoingMatches { get; set; }
    public int TotalEquipment { get; set; }
    public int TotalUsers { get; set; }
    public int TotalCourts { get; set; }
    public List<RevenuePointDto> RevenueTrend { get; set; } = new();
    public List<ActivityItemDto> RecentActivity { get; set; } = new();
}

// Một điểm doanh thu theo ngày (cho biểu đồ 7 ngày).
public class RevenuePointDto
{
    public string Label { get; set; } = null!;
    public decimal Amount { get; set; }
}

// Một dòng hoạt động gần đây.
public class ActivityItemDto
{
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public DateTime Time { get; set; }
    public string Type { get; set; } = null!;
}
