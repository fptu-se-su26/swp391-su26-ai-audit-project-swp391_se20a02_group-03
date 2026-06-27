using Microsoft.EntityFrameworkCore;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using ProSport.Infrastructure.Data;

namespace ProSport.Infrastructure.Services;

// Tổng hợp số liệu Dashboard trực tiếp từ DbContext (dữ liệu nhỏ, tính tại chỗ).
public class DashboardService : IDashboardService
{
    private readonly ProSportDbContext _db;

    public DashboardService(ProSportDbContext db)
    {
        _db = db;
    }

    public async Task<ApiResponseDto<DashboardStatsDto>> GetStatsAsync()
    {
        // Doanh thu = tổng các đơn đã thanh toán.
        var totalRevenue = await _db.Bookings
            .Where(b => b.PaymentStatus == "Paid")
            .SumAsync(b => (decimal?)b.TotalAmount) ?? 0m;

        var activeBookings = await _db.Bookings
            .CountAsync(b => b.Status == "Pending" || b.Status == "Confirmed");

        var ongoingMatches = await _db.Matches
            .CountAsync(m => m.Status == "Open" || m.Status == "Closed");

        var totalEquipment = await _db.Equipments.CountAsync();
        var totalUsers = await _db.Users.CountAsync();
        var totalCourts = await _db.Courts.CountAsync();

        // Xu hướng doanh thu 7 ngày gần nhất (theo ngày tạo đơn, chỉ đơn đã thanh toán).
        var since = DateTime.UtcNow.Date.AddDays(-6);
        var paidRecent = await _db.Bookings
            .Where(b => b.PaymentStatus == "Paid" && b.CreatedAt >= since)
            .Select(b => new { b.CreatedAt, b.TotalAmount })
            .ToListAsync();

        var revenueTrend = new List<RevenuePointDto>();
        for (int i = 0; i < 7; i++)
        {
            var day = since.AddDays(i);
            var amount = paidRecent.Where(x => x.CreatedAt.Date == day).Sum(x => x.TotalAmount);
            revenueTrend.Add(new RevenuePointDto { Label = day.ToString("dd/MM"), Amount = amount });
        }

        // Hoạt động gần đây: 6 đơn đặt sân mới nhất.
        var recent = await _db.Bookings
            .OrderByDescending(b => b.CreatedAt)
            .Take(6)
            .Select(b => new
            {
                b.BookingId,
                b.CreatedAt,
                b.Status,
                b.TotalAmount,
                UserName = b.User.FullName
            })
            .ToListAsync();

        var recentActivity = recent.Select(b => new ActivityItemDto
        {
            Title = $"Đặt sân #{b.BookingId}",
            Description = $"{b.UserName} · {b.TotalAmount:#,##0} ₫",
            Time = b.CreatedAt,
            Type = b.Status
        }).ToList();

        var dto = new DashboardStatsDto
        {
            TotalRevenue = totalRevenue,
            ActiveBookings = activeBookings,
            OngoingMatches = ongoingMatches,
            TotalEquipment = totalEquipment,
            TotalUsers = totalUsers,
            TotalCourts = totalCourts,
            RevenueTrend = revenueTrend,
            RecentActivity = recentActivity
        };

        return new ApiResponseDto<DashboardStatsDto>(200, "Lấy số liệu tổng quan thành công.", dto);
    }
}
