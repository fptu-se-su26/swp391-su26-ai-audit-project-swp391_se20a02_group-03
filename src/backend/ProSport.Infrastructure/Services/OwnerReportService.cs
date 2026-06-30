using System.Text;
using Microsoft.EntityFrameworkCore;
using ProSport.Application.DTOs;
using ProSport.Application.DTOs.Owner;
using ProSport.Application.Interfaces;
using ProSport.Application.Services;
using ProSport.Infrastructure.Data;

namespace ProSport.Infrastructure.Services;

public class OwnerReportService : IOwnerReportService
{
    private const int SlotsPerDay = 16;
    private readonly ProSportDbContext _db;

    public OwnerReportService(ProSportDbContext db) => _db = db;

    public async Task<ApiResponseDto<OwnerReportRevenueDto>> GetRevenueAsync(int complexId, DateTime? from, DateTime? to)
    {
        var vnToday = VnTimeHelper.VnToday();
        var fromDate = from?.Date ?? vnToday.AddDays(-29);
        var toDate = to?.Date ?? vnToday;
        var fromUtc = VnTimeHelper.ToUtcStartOfVnDay(fromDate);
        var toUtc = VnTimeHelper.ToUtcEndOfVnDay(toDate);

        var courtIds = await _db.Courts.Where(c => c.ComplexId == complexId && !c.IsDeleted).Select(c => c.CourtId).ToListAsync();

        var bookingRevenue = await _db.BookingDetails
            .Where(d => courtIds.Contains(d.CourtId)
                && !d.Booking.IsDeleted
                && d.Booking.PaymentStatus == "Paid"
                && d.Booking.CreatedAt >= fromUtc && d.Booking.CreatedAt <= toUtc)
            .SumAsync(d => (decimal?)d.Price) ?? 0m;

        var rentalRevenue = await _db.RentalSessions
            .Where(r => r.ComplexId == complexId && !r.IsDeleted && r.CreatedAt >= fromUtc && r.CreatedAt <= toUtc)
            .SumAsync(r => (decimal?)r.RentalFee) ?? 0m;

        var productRevenue = await _db.BookingDetailEquipments
            .Where(e => e.BookingId != null
                && e.Booking!.BookingDetails.Any(d => courtIds.Contains(d.CourtId))
                && !e.Booking.IsDeleted
                && e.RentedAt >= fromUtc && e.RentedAt <= toUtc)
            .SumAsync(e => (decimal?)(e.Quantity * e.UnitPrice + (e.DamageFee ?? 0) + (e.AdditionalCharge ?? 0))) ?? 0m;

        var surchargeRevenue = await _db.RentalSessions
            .Where(r => r.ComplexId == complexId && !r.IsDeleted && r.CreatedAt >= fromUtc && r.CreatedAt <= toUtc)
            .SumAsync(r => (decimal?)r.SurchargeTotal) ?? 0m;

        var refundAmount = await _db.Bookings
            .Where(b => !b.IsDeleted && b.PaymentStatus == "Refunded"
                && b.BookingDetails.Any(d => courtIds.Contains(d.CourtId))
                && b.UpdatedAt >= fromUtc && b.UpdatedAt <= toUtc)
            .SumAsync(b => (decimal?)b.TotalAmount) ?? 0m;

        var escrowHeld = await _db.Transactions
            .Where(t => t.Type == "EscrowLock" && t.Status == "Completed"
                && t.BookingId != null
                && t.CreatedAt >= fromUtc && t.CreatedAt <= toUtc
                && _db.BookingDetails.Any(d => d.BookingId == t.BookingId && courtIds.Contains(d.CourtId)))
            .SumAsync(t => (decimal?)t.Amount) ?? 0m;

        var net = bookingRevenue + rentalRevenue + productRevenue + surchargeRevenue - refundAmount;

        var paidBookingRows = await _db.Bookings
            .Where(b => !b.IsDeleted && b.PaymentStatus == "Paid"
                && b.BookingDetails.Any(d => courtIds.Contains(d.CourtId))
                && b.CreatedAt >= fromUtc && b.CreatedAt <= toUtc)
            .Select(b => new { b.CreatedAt, b.TotalAmount })
            .ToListAsync();

        var vnTz = VnTimeHelper.GetVnTimeZone();
        var revenueByDay = paidBookingRows
            .GroupBy(b => TimeZoneInfo.ConvertTimeFromUtc(
                b.CreatedAt.Kind == DateTimeKind.Utc ? b.CreatedAt : DateTime.SpecifyKind(b.CreatedAt, DateTimeKind.Utc),
                vnTz).Date)
            .Select(g => new RevenueByDayDto { Date = g.Key, Amount = g.Sum(x => x.TotalAmount) })
            .OrderBy(x => x.Date)
            .ToList();

        var revenueByCourt = await _db.BookingDetails
            .Where(d => courtIds.Contains(d.CourtId)
                && d.Booking.PaymentStatus == "Paid"
                && d.Booking.CreatedAt >= fromUtc && d.Booking.CreatedAt <= toUtc)
            .GroupBy(d => new { d.CourtId, d.Court.Name })
            .Select(g => new RevenueByCourtDto { CourtId = g.Key.CourtId, CourtName = g.Key.Name, Amount = g.Sum(x => x.Price) })
            .ToListAsync();

        return new ApiResponseDto<OwnerReportRevenueDto>(200, "Success", new OwnerReportRevenueDto
        {
            BookingRevenue = bookingRevenue,
            RentalRevenue = rentalRevenue,
            ProductRevenue = productRevenue,
            SurchargeRevenue = surchargeRevenue,
            RefundAmount = refundAmount,
            EscrowHeld = escrowHeld,
            NetRevenue = net,
            RevenueByDay = revenueByDay,
            RevenueByCourt = revenueByCourt
        });
    }

    public async Task<ApiResponseDto<OwnerReportOccupancyDto>> GetOccupancyAsync(int complexId, DateTime? from, DateTime? to)
    {
        var vnToday = VnTimeHelper.VnToday();
        var fromDate = from?.Date ?? vnToday.AddDays(-6);
        var toDate = to?.Date ?? vnToday;
        var days = Math.Max(1, (toDate - fromDate).Days + 1);

        var courts = await _db.Courts.Where(c => c.ComplexId == complexId && !c.IsDeleted).ToListAsync();
        var courtIds = courts.Select(c => c.CourtId).ToList();

        var booked = await _db.BookingDetails
            .Where(d => courtIds.Contains(d.CourtId)
                && d.BookingDate >= fromDate && d.BookingDate <= toDate
                && !OwnerDashboardMetrics.ExcludedBookingStatuses.Contains(d.Booking.Status))
            .GroupBy(d => d.CourtId)
            .Select(g => new { CourtId = g.Key, Count = g.Count() })
            .ToListAsync();

        var bookedMap = booked.ToDictionary(x => x.CourtId, x => x.Count);
        var courtOccupancy = courts.Select(c =>
        {
            var slots = bookedMap.GetValueOrDefault(c.CourtId, 0);
            var total = SlotsPerDay * days;
            return new CourtOccupancyDto
            {
                CourtId = c.CourtId,
                CourtName = c.Name,
                BookedSlots = slots,
                TotalSlots = total,
                OccupancyPercent = total > 0 ? Math.Round(100m * slots / total, 1) : 0
            };
        }).ToList();

        var totalAssets = await _db.RentalAssets.CountAsync(a => a.ComplexId == complexId && !a.IsDeleted);
        var rentedAssets = await _db.RentalAssets.CountAsync(a => a.ComplexId == complexId && a.Status == "RENTED" && !a.IsDeleted);
        var damaged = await _db.RentalAssets.CountAsync(a => a.ComplexId == complexId && a.Status == "DAMAGED" && !a.IsDeleted);

        return new ApiResponseDto<OwnerReportOccupancyDto>(200, "Success", new OwnerReportOccupancyDto
        {
            Courts = courtOccupancy,
            RentalUtilization = totalAssets > 0 ? Math.Round(100m * rentedAssets / totalAssets, 1) : 0,
            DamageRate = totalAssets > 0 ? Math.Round(100m * damaged / totalAssets, 1) : 0
        });
    }

    public async Task<ApiResponseDto<OwnerReportInventoryDto>> GetInventoryReportAsync(int complexId)
    {
        return new ApiResponseDto<OwnerReportInventoryDto>(200, "Success", new OwnerReportInventoryDto
        {
            TotalProducts = await _db.ProductStocks.CountAsync(p => p.ComplexId == complexId && !p.IsDeleted),
            LowStockCount = await _db.ProductStocks.CountAsync(p => p.ComplexId == complexId && !p.IsDeleted && p.Quantity <= p.LowStockThreshold),
            AvailableAssets = await _db.RentalAssets.CountAsync(a => a.ComplexId == complexId && a.Status == "AVAILABLE" && !a.IsDeleted),
            RentedAssets = await _db.RentalAssets.CountAsync(a => a.ComplexId == complexId && a.Status == "RENTED" && !a.IsDeleted),
            DamagedAssets = await _db.RentalAssets.CountAsync(a => a.ComplexId == complexId && a.Status == "DAMAGED" && !a.IsDeleted),
            MaintenanceAssets = await _db.RentalAssets.CountAsync(a => a.ComplexId == complexId && a.Status == "MAINTENANCE" && !a.IsDeleted)
        });
    }

    public async Task<ApiResponseDto<byte[]>> ExportReportAsync(int complexId, DateTime? from, DateTime? to)
    {
        var revenue = await GetRevenueAsync(complexId, from, to);
        var sb = new StringBuilder();
        sb.AppendLine("Metric,Amount");
        sb.AppendLine($"Booking Revenue,{revenue.Data?.BookingRevenue}");
        sb.AppendLine($"Rental Revenue,{revenue.Data?.RentalRevenue}");
        sb.AppendLine($"Product Revenue,{revenue.Data?.ProductRevenue}");
        sb.AppendLine($"Surcharge Revenue,{revenue.Data?.SurchargeRevenue}");
        sb.AppendLine($"Refund,{revenue.Data?.RefundAmount}");
        sb.AppendLine($"Net Revenue,{revenue.Data?.NetRevenue}");
        return new ApiResponseDto<byte[]>(200, "Export thành công.", Encoding.UTF8.GetBytes(sb.ToString()));
    }
}
