using Microsoft.EntityFrameworkCore;
using ProSport.Application.DTOs;
using ProSport.Application.DTOs.Owner;
using ProSport.Application.Interfaces;
using ProSport.Application.Services;
using ProSport.Infrastructure.Data;

namespace ProSport.Infrastructure.Services;

public class OwnerDashboardService : IOwnerDashboardService
{
    private static readonly TimeSpan ScheduleDayStart = new(6, 0, 0);
    private static readonly TimeSpan ScheduleDayEnd = new(22, 0, 0);
    private const int SlotsPerDay = 16; // 06:00–22:00, mỗi slot 1h

    private readonly ProSportDbContext _db;

    public OwnerDashboardService(ProSportDbContext db)
    {
        _db = db;
    }

    public async Task<ApiResponseDto<OwnerDashboardDto>> GetDashboardAsync(int complexId, DateTime? from, DateTime? to)
    {
        var vnToday = VnTimeHelper.VnToday();
        var fromDate = from?.Date ?? vnToday.AddDays(-6);
        var toDate = to?.Date ?? vnToday;
        if (fromDate > toDate) (fromDate, toDate) = (toDate, fromDate);

        var fromUtc = VnTimeHelper.ToUtcStartOfVnDay(fromDate);
        var toUtc = VnTimeHelper.ToUtcEndOfVnDay(toDate);

        var courtIds = await _db.Courts
            .Where(c => c.ComplexId == complexId && !c.IsDeleted)
            .Select(c => c.CourtId)
            .ToListAsync();

        var totalCourts = courtIds.Count;

        var bookingDetailsQuery = _db.BookingDetails
            .Include(d => d.Booking).ThenInclude(b => b!.User)
            .Include(d => d.Court)
            .Where(d => courtIds.Contains(d.CourtId)
                && d.Booking.CreatedAt >= fromUtc
                && d.Booking.CreatedAt <= toUtc
                && !d.Booking.IsDeleted);

        var validBookings = await bookingDetailsQuery
            .Where(d => !OwnerDashboardMetrics.ExcludedBookingStatuses.Contains(d.Booking.Status))
            .Select(d => new
            {
                d.BookingId,
                d.Booking.Status,
                d.Booking.PaymentStatus,
                d.Booking.TotalAmount,
                d.Booking.CreatedAt,
                d.BookingDate,
                d.StartTime,
                d.EndTime,
                d.CourtId,
                CourtName = d.Court.Name,
                CustomerName = d.Booking.User.FullName
            })
            .ToListAsync();

        var paidBookingIds = validBookings
            .Where(b => b.PaymentStatus == "Paid")
            .Select(b => b.BookingId)
            .Distinct()
            .ToHashSet();

        var bookingRevenue = await _db.Bookings
            .Where(b => paidBookingIds.Contains(b.BookingId))
            .SumAsync(b => (decimal?)b.TotalAmount) ?? 0m;

        var rentalRevenue = await _db.BookingDetailEquipments
            .Where(r => r.RentalStatus == "Returned" || r.RentalStatus == "Rented")
            .SumAsync(r => (decimal?)(r.UnitPrice * r.Quantity + (r.AdditionalCharge ?? 0))) ?? 0m;

        var surchargeRevenue = await _db.BookingDetailEquipments
            .Where(r => (r.DamageFee ?? 0) > 0 || (r.AdditionalCharge ?? 0) > 0)
            .SumAsync(r => (decimal?)((r.DamageFee ?? 0) + (r.AdditionalCharge ?? 0))) ?? 0m;

        var refundAmount = await _db.Bookings
            .Where(b => paidBookingIds.Contains(b.BookingId) && b.PaymentStatus == "Refunded")
            .SumAsync(b => (decimal?)b.TotalAmount) ?? 0m;

        var bookingCount = validBookings.Select(b => b.BookingId).Distinct().Count();
        var pendingCount = await _db.Bookings
            .Where(b => !b.IsDeleted && (b.Status == "Pending" || b.PaymentStatus == "Pending"))
            .Where(b => b.BookingDetails.Any(d => courtIds.Contains(d.CourtId)))
            .CountAsync();

        var activeRentals = await _db.BookingDetailEquipments
            .CountAsync(r => r.RentalStatus == "Rented");

        var damagedAssets = await _db.BookingDetailEquipments
            .CountAsync(r => r.ReturnCondition == "Damaged" || (r.DamageFee ?? 0) > 0);

        var lowStock = await _db.Equipments.CountAsync(e => e.StockQuantity <= 5 && !e.IsDeleted);

        var occupiedCourtDays = validBookings
            .Where(b => OwnerDashboardMetrics.CountsTowardOccupancy(b.Status))
            .Select(b => new { b.CourtId, b.BookingDate.Date })
            .Distinct()
            .Count();

        var totalCourtDays = totalCourts * Math.Max(1, (toDate - fromDate).Days + 1);
        var occupancyRate = totalCourtDays == 0 ? 0m : Math.Round((decimal)occupiedCourtDays / totalCourtDays * 100m, 1);

        var revenueByDate = new List<OwnerRevenuePointDto>();
        for (var day = fromDate; day <= toDate; day = day.AddDays(1))
        {
            var dayStart = VnTimeHelper.ToUtcStartOfVnDay(day);
            var dayEnd = VnTimeHelper.ToUtcEndOfVnDay(day);
            var amount = await _db.Bookings
                .Where(b => b.PaymentStatus == "Paid"
                    && b.CreatedAt >= dayStart && b.CreatedAt <= dayEnd
                    && !OwnerDashboardMetrics.ExcludedBookingStatuses.Contains(b.Status)
                    && b.BookingDetails.Any(d => courtIds.Contains(d.CourtId)))
                .SumAsync(b => (decimal?)b.TotalAmount) ?? 0m;
            revenueByDate.Add(new OwnerRevenuePointDto { Label = day.ToString("dd/MM"), Amount = amount });
        }

        var occupancyByCourt = new List<OwnerOccupancyByCourtDto>();
        foreach (var courtId in courtIds)
        {
            var courtName = await _db.Courts.Where(c => c.CourtId == courtId).Select(c => c.Name).FirstOrDefaultAsync() ?? "";
            var booked = validBookings.Count(b => b.CourtId == courtId && OwnerDashboardMetrics.CountsTowardOccupancy(b.Status));
            var rate = SlotsPerDay == 0 ? 0m : Math.Round((decimal)booked / SlotsPerDay * 100m, 1);
            occupancyByCourt.Add(new OwnerOccupancyByCourtDto
            {
                CourtId = courtId,
                CourtName = courtName,
                BookedSlots = booked,
                TotalSlots = SlotsPerDay,
                OccupancyRate = Math.Min(rate, 100m)
            });
        }

        var upcomingRows = await _db.BookingDetails
            .Include(d => d.Booking).ThenInclude(b => b!.User)
            .Include(d => d.Court)
            .Where(d => courtIds.Contains(d.CourtId)
                && d.BookingDate.Date >= vnToday
                && !OwnerDashboardMetrics.ExcludedBookingStatuses.Contains(d.Booking.Status))
            .OrderBy(d => d.BookingDate).ThenBy(d => d.StartTime)
            .Take(10)
            .ToListAsync();

        var upcoming = upcomingRows.Select(d => new OwnerUpcomingBookingDto
        {
            BookingId = d.BookingId,
            CustomerName = d.Booking.User.FullName,
            CourtName = d.Court.Name,
            BookingDate = d.BookingDate,
            StartTime = d.StartTime.ToString(@"HH\:mm"),
            EndTime = d.EndTime.ToString(@"HH\:mm"),
            Status = d.Booking.Status,
            TotalAmount = d.Booking.TotalAmount
        }).ToList();

        var dto = new OwnerDashboardDto
        {
            TotalRevenue = bookingRevenue + rentalRevenue + surchargeRevenue - refundAmount,
            BookingRevenue = bookingRevenue,
            RentalRevenue = rentalRevenue,
            ProductRevenue = 0,
            SurchargeRevenue = surchargeRevenue,
            RefundAmount = refundAmount,
            BookingCount = bookingCount,
            PendingBookingCount = pendingCount,
            OccupancyRate = occupancyRate,
            ActiveRentalCount = activeRentals,
            DamagedAssetCount = damagedAssets,
            LowStockCount = lowStock,
            UpcomingBookings = upcoming,
            RevenueByDate = revenueByDate,
            OccupancyByCourt = occupancyByCourt
        };

        return new ApiResponseDto<OwnerDashboardDto>(200, "Lấy dashboard chủ sân thành công.", dto);
    }

    public async Task<ApiResponseDto<PagedResult<BookingDto>>> GetBookingsAsync(OwnerBookingQueryDto query)
    {
        var courtIds = await _db.Courts
            .Where(c => c.ComplexId == query.ComplexId && !c.IsDeleted)
            .Select(c => c.CourtId)
            .ToListAsync();

        if (query.CourtId.HasValue && !courtIds.Contains(query.CourtId.Value))
            return new ApiResponseDto<PagedResult<BookingDto>>(404, "Không tìm thấy sân.");

        var filteredCourtIds = query.CourtId.HasValue ? new List<int> { query.CourtId.Value } : courtIds;

        var q = _db.Bookings
            .Include(b => b.BookingDetails).ThenInclude(d => d.Court)
            .Include(b => b.User)
            .Where(b => !b.IsDeleted && b.BookingDetails.Any(d => filteredCourtIds.Contains(d.CourtId)));

        if (!string.IsNullOrWhiteSpace(query.Status))
            q = q.Where(b => b.Status == query.Status);

        if (query.DateFrom.HasValue)
            q = q.Where(b => b.BookingDetails.Any(d => d.BookingDate.Date >= query.DateFrom.Value.Date));

        if (query.DateTo.HasValue)
            q = q.Where(b => b.BookingDetails.Any(d => d.BookingDate.Date <= query.DateTo.Value.Date));

        if (!string.IsNullOrWhiteSpace(query.Keyword))
        {
            var kw = query.Keyword.Trim().ToLower();
            q = q.Where(b => b.User.FullName.ToLower().Contains(kw)
                || b.User.Email.ToLower().Contains(kw)
                || b.BookingId.ToString().Contains(kw));
        }

        var total = await q.CountAsync();
        var page = Math.Max(1, query.Page);
        var size = Math.Clamp(query.Size, 1, 100);

        var items = await q
            .OrderByDescending(b => b.CreatedAt)
            .Skip((page - 1) * size)
            .Take(size)
            .ToListAsync();

        var dtos = items.Select(b => new BookingDto
        {
            BookingId = b.BookingId,
            UserId = b.UserId,
            TotalAmount = b.TotalAmount,
            Status = b.Status,
            PaymentMethod = b.PaymentMethod,
            PaymentStatus = b.PaymentStatus,
            CheckInCode = b.CheckInCode,
            PaymentDeadline = b.PaymentDeadline,
            Details = b.BookingDetails.Select(d => new BookingDetailDto
            {
                CourtId = d.CourtId,
                CourtName = d.Court?.Name ?? "",
                BookingDate = d.BookingDate,
                StartTime = d.StartTime,
                EndTime = d.EndTime,
                Price = d.Price
            }).ToList()
        }).ToList();

        return new ApiResponseDto<PagedResult<BookingDto>>(200, "Success", new PagedResult<BookingDto>
        {
            Items = dtos,
            TotalCount = total,
            CurrentPage = page,
            TotalPages = (int)Math.Ceiling(total / (double)size)
        });
    }

    public async Task<ApiResponseDto<IEnumerable<OwnerBookingCalendarDto>>> GetCalendarBookingsAsync(OwnerBookingQueryDto query)
    {
        var courtIds = await _db.Courts
            .Where(c => c.ComplexId == query.ComplexId && !c.IsDeleted)
            .Select(c => new { c.CourtId, c.Name })
            .ToListAsync();

        var filtered = query.CourtId.HasValue
            ? courtIds.Where(c => c.CourtId == query.CourtId.Value).ToList()
            : courtIds;

        var ids = filtered.Select(c => c.CourtId).ToList();
        var from = query.DateFrom?.Date ?? DateTime.UtcNow.Date;
        var to = query.DateTo?.Date ?? from.AddDays(6);

        var details = await _db.BookingDetails
            .Include(d => d.Booking).ThenInclude(b => b!.User)
            .Include(d => d.Court)
            .Where(d => ids.Contains(d.CourtId)
                && !d.Booking.IsDeleted
                && d.BookingDate.Date >= from && d.BookingDate.Date <= to)
            .OrderBy(d => d.BookingDate).ThenBy(d => d.StartTime)
            .ToListAsync();

        if (!string.IsNullOrWhiteSpace(query.Status))
            details = details.Where(d => d.Booking.Status == query.Status).ToList();

        var result = details.Select(d => new OwnerBookingCalendarDto
        {
            BookingId = d.BookingId,
            CourtId = d.CourtId,
            CourtName = d.Court?.Name ?? "",
            CustomerName = d.Booking.User?.FullName ?? "",
            BookingDate = d.BookingDate,
            StartTime = d.StartTime.ToString(@"HH\:mm"),
            EndTime = d.EndTime.ToString(@"HH\:mm"),
            Status = d.Booking.Status,
            PaymentStatus = d.Booking.PaymentStatus,
            TotalAmount = d.Booking.TotalAmount
        });

        return new ApiResponseDto<IEnumerable<OwnerBookingCalendarDto>>(200, "Success", result);
    }
}
