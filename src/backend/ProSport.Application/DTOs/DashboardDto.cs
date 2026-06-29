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

// Số liệu tổng quan cho Elite Dashboard (Staff/Admin).
public class EliteDashboardStatsDto
{
    public int TotalCourts { get; set; }
    public int ActiveCourts { get; set; }
    public decimal OccupancyRate { get; set; }
    public int TodayBookings { get; set; }
    public decimal TodayRevenue { get; set; }
    public int OpenDisputes { get; set; }
    public int ActiveMatches { get; set; }
    public List<ActivityItemDto> RecentActivity { get; set; } = new();
}

// Một khung giờ trên lịch sân.
public class ScheduleSlotDto
{
    public string Time { get; set; } = null!;
    public string Status { get; set; } = "empty"; // empty, booked, in-use
    public string? Label { get; set; }
    public string? CustomerName { get; set; }
    public int? BookingId { get; set; }
    public string? CheckInCode { get; set; }
    public string? StartTime { get; set; }
    public string? EndTime { get; set; }
    public double StartPercent { get; set; }
    public double WidthPercent { get; set; }
}

// Một hàng sân trên lịch thời gian thực.
public class CourtScheduleRowDto
{
    public int CourtId { get; set; }
    public string CourtName { get; set; } = null!;
    public string SportType { get; set; } = null!;
    public List<ScheduleSlotDto> Slots { get; set; } = new();
}

public class CourtScheduleDto
{
    public DateTime Date { get; set; }
    public List<string> TimeHeaders { get; set; } = new();
    public List<CourtScheduleRowDto> Courts { get; set; } = new();
}

// Thông báo vận hành cho Dash Inbox.
public class OpsNotificationDto
{
    public int Id { get; set; }
    public string Category { get; set; } = null!;
    public string Title { get; set; } = null!;
    public string Body { get; set; } = null!;
    public DateTime Time { get; set; }
    public bool IsRead { get; set; }
}

// Tổng quan vận hành cho Staff Dashboard / Broadcast.
public class StaffOverviewDto
{
    public int TodayBookings { get; set; }
    public int PendingReports { get; set; }
    public int OpenMatches { get; set; }
    public int TotalUsers { get; set; }
    public List<ActivityItemDto> RecentActivity { get; set; } = new();
    public List<OpsNotificationDto> Notifications { get; set; } = new();
}
