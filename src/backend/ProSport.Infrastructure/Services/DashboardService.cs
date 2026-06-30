using Microsoft.EntityFrameworkCore;

using ProSport.Application.DTOs;

using ProSport.Application.Interfaces;

using ProSport.Infrastructure.Data;



namespace ProSport.Infrastructure.Services;



// Tổng hợp số liệu Dashboard trực tiếp từ DbContext (dữ liệu nhỏ, tính tại chỗ).

public class DashboardService : IDashboardService

{

    private readonly ProSportDbContext _db;



    private static readonly TimeSpan ScheduleDayStart = new(6, 0, 0);

    private static readonly TimeSpan ScheduleDayEnd = new(22, 0, 0);



    public DashboardService(ProSportDbContext db)

    {

        _db = db;

    }



    public async Task<ApiResponseDto<DashboardStatsDto>> GetStatsAsync()

    {

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



        var vnToday = VnTimeHelper.VnToday();

        var trendStartUtc = VnTimeHelper.ToUtcStartOfVnDay(vnToday.AddDays(-6));

        var paidRecent = await _db.Bookings

            .Where(b => b.PaymentStatus == "Paid" && b.CreatedAt >= trendStartUtc)

            .Select(b => new { b.CreatedAt, b.TotalAmount })

            .ToListAsync();



        var revenueTrend = new List<RevenuePointDto>();

        for (int i = 0; i < 7; i++)

        {

            var day = vnToday.AddDays(-6 + i);

            var amount = paidRecent

                .Where(x => VnTimeHelper.IsSameVnDay(x.CreatedAt, day))

                .Sum(x => x.TotalAmount);

            revenueTrend.Add(new RevenuePointDto { Label = day.ToString("dd/MM"), Amount = amount });

        }



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



    public async Task<ApiResponseDto<EliteDashboardStatsDto>> GetEliteStatsAsync()

    {

        var vnToday = VnTimeHelper.VnToday();

        var dayStartUtc = VnTimeHelper.ToUtcStartOfVnDay(vnToday);

        var dayEndUtc = VnTimeHelper.ToUtcEndOfVnDay(vnToday);



        var totalCourts = await _db.Courts.CountAsync();

        var activeCourtIds = await _db.BookingDetails

            .Where(d => d.BookingDate.Date == vnToday

                && (d.Booking.Status == "Pending" || d.Booking.Status == "Confirmed" || d.Booking.Status == "Completed"))

            .Select(d => d.CourtId)

            .Distinct()

            .CountAsync();



        var todayBookings = await _db.Bookings

            .CountAsync(b => b.CreatedAt >= dayStartUtc && b.CreatedAt <= dayEndUtc);



        var todayRevenue = await _db.Bookings

            .Where(b => b.PaymentStatus == "Paid" && b.CreatedAt >= dayStartUtc && b.CreatedAt <= dayEndUtc)

            .SumAsync(b => (decimal?)b.TotalAmount) ?? 0m;



        var openDisputes = await _db.Reports

            .CountAsync(r => r.Status == "Pending" || r.Status == "Investigating");



        var activeMatches = await _db.Matches

            .CountAsync(m => m.Status == "Open" || m.Status == "Closed");



        var occupancyRate = totalCourts == 0

            ? 0m

            : Math.Round((decimal)activeCourtIds / totalCourts * 100m, 1);



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



        var dto = new EliteDashboardStatsDto

        {

            TotalCourts = totalCourts,

            ActiveCourts = activeCourtIds,

            OccupancyRate = occupancyRate,

            TodayBookings = todayBookings,

            TodayRevenue = todayRevenue,

            OpenDisputes = openDisputes,

            ActiveMatches = activeMatches,

            RecentActivity = recent.Select(b => new ActivityItemDto

            {

                Title = $"Đặt sân #{b.BookingId}",

                Description = $"{b.UserName} · {b.TotalAmount:#,##0} ₫",

                Time = b.CreatedAt,

                Type = b.Status

            }).ToList()

        };



        return new ApiResponseDto<EliteDashboardStatsDto>(200, "Lấy số liệu Elite thành công.", dto);

    }



    public async Task<ApiResponseDto<CourtScheduleDto>> GetCourtScheduleAsync(DateTime? date, string? sportFilter)

    {

        var vnToday = VnTimeHelper.VnToday();

        var targetDate = (date ?? vnToday).Date;

        var dayStart = ScheduleDayStart;

        var dayEnd = ScheduleDayEnd;

        var totalMinutes = (dayEnd - dayStart).TotalMinutes;



        var timeHeaders = new List<string>();

        for (var hour = 6; hour <= 21; hour++)

        {

            timeHeaders.Add($"{hour:00}:00");

        }



        var courtsQuery = _db.Courts

            .Include(c => c.CourtType)

            .AsQueryable();



        if (!string.IsNullOrWhiteSpace(sportFilter) && sportFilter != "all")

        {

            courtsQuery = courtsQuery.Where(c => c.CourtType.Name.Contains(sportFilter));

        }



        var courts = await courtsQuery.OrderBy(c => c.Name).ToListAsync();



        var details = await _db.BookingDetails

            .Include(d => d.Booking)

                .ThenInclude(b => b.User)

            .Include(d => d.Booking)

                .ThenInclude(b => b.CheckIn)

            .Include(d => d.Court)

            .Where(d => d.BookingDate.Date == targetDate

                && d.Booking.Status != "Cancelled")

            .ToListAsync();



        var vnNow = VnTimeHelper.VnNow();

        var rows = courts.Select(court =>

        {

            var courtDetails = details.Where(d => d.CourtId == court.CourtId).ToList();

            var slots = courtDetails.Select(d =>

            {

                var start = d.StartTime < dayStart ? dayStart : d.StartTime;

                var end = d.EndTime > dayEnd ? dayEnd : d.EndTime;

                if (end <= start)

                {

                    return null;

                }



                var startPercent = (start - dayStart).TotalMinutes / totalMinutes * 100d;

                var widthPercent = (end - start).TotalMinutes / totalMinutes * 100d;

                var isToday = targetDate == vnToday;

                var slotStart = targetDate.Add(start);

                var slotEnd = targetDate.Add(end);

                var inWindow = isToday && vnNow >= slotStart && vnNow <= slotEnd;

                var hasCheckIn = d.Booking.CheckIn != null;

                var status = inWindow && (hasCheckIn || d.Booking.Status == "Confirmed")

                    ? "in-use"

                    : "booked";



                return new ScheduleSlotDto

                {

                    Time = $"{start:HH\\:mm} - {end:HH\\:mm}",

                    Status = status,

                    Label = d.Booking.User?.FullName ?? $"Đơn #{d.BookingId}",

                    CustomerName = d.Booking.User?.FullName,

                    BookingId = d.BookingId,

                    CheckInCode = d.Booking.CheckInCode,

                    StartTime = $"{start:HH\\:mm}",

                    EndTime = $"{end:HH\\:mm}",

                    StartPercent = Math.Max(0, startPercent),

                    WidthPercent = Math.Max(2, widthPercent)

                };

            })

            .Where(s => s != null)

            .Cast<ScheduleSlotDto>()

            .ToList();



            return new CourtScheduleRowDto

            {

                CourtId = court.CourtId,

                CourtName = court.Name,

                SportType = court.CourtType?.Name ?? "Khác",

                Slots = slots

            };

        }).ToList();



        var schedule = new CourtScheduleDto

        {

            Date = targetDate,

            TimeHeaders = timeHeaders,

            Courts = rows

        };



        return new ApiResponseDto<CourtScheduleDto>(200, "Lấy lịch sân thành công.", schedule);

    }



    public async Task<ApiResponseDto<StaffOverviewDto>> GetStaffOverviewAsync()

    {

        var vnToday = VnTimeHelper.VnToday();

        var dayStartUtc = VnTimeHelper.ToUtcStartOfVnDay(vnToday);

        var dayEndUtc = VnTimeHelper.ToUtcEndOfVnDay(vnToday);



        var todayBookings = await _db.Bookings.CountAsync(b => b.CreatedAt >= dayStartUtc && b.CreatedAt <= dayEndUtc);

        var pendingReports = await _db.Reports.CountAsync(r => r.Status == "Pending" || r.Status == "Investigating");

        var openMatches = await _db.Matches.CountAsync(m => m.Status == "Open");

        var totalUsers = await _db.Users.CountAsync();



        var recentBookings = await _db.Bookings

            .OrderByDescending(b => b.CreatedAt)

            .Take(8)

            .Select(b => new ActivityItemDto

            {

                Title = $"Đặt sân #{b.BookingId}",

                Description = $"{b.User.FullName} · {b.Status}",

                Time = b.CreatedAt,

                Type = "Booking"

            })

            .ToListAsync();



        var recentReports = await _db.Reports

            .Where(r => r.Status == "Pending" || r.Status == "Investigating")

            .OrderByDescending(r => r.CreatedAt)

            .Take(5)

            .Select(r => new OpsNotificationDto

            {

                Id = r.ReportId,

                Category = "Reports",

                Title = $"Khiếu nại #{r.ReportId}",

                Body = r.Reason,

                Time = r.CreatedAt,

                IsRead = false

            })

            .ToListAsync();



        var recentMatches = await _db.Matches

            .Where(m => m.Status == "Open")

            .OrderByDescending(m => m.CreatedAt)

            .Take(5)

            .Select(m => new OpsNotificationDto

            {

                Id = m.MatchId + 100000,

                Category = "Matches",

                Title = $"Kèo mở #{m.MatchId}",

                Body = m.Notes ?? "Kèo đang chờ người tham gia",

                Time = m.CreatedAt,

                IsRead = false

            })

            .ToListAsync();



        var notifications = recentReports

            .Concat(recentMatches)

            .OrderByDescending(n => n.Time)

            .Take(10)

            .ToList();



        var dto = new StaffOverviewDto

        {

            TodayBookings = todayBookings,

            PendingReports = pendingReports,

            OpenMatches = openMatches,

            TotalUsers = totalUsers,

            RecentActivity = recentBookings,

            Notifications = notifications

        };



        return new ApiResponseDto<StaffOverviewDto>(200, "Lấy tổng quan vận hành thành công.", dto);

    }

}


