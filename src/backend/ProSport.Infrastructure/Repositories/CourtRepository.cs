using Microsoft.EntityFrameworkCore;
using ProSport.Application.Interfaces;
using ProSport.Domain.Constants;
using ProSport.Domain.Entities;
using ProSport.Infrastructure.Data;

namespace ProSport.Infrastructure.Repositories;

public class CourtRepository : ICourtRepository
{
    private readonly ProSportDbContext _context;

    public CourtRepository(ProSportDbContext context)
    {
        _context = context;
    }

    public async Task<bool> IsSlotWithinOperatingHoursAsync(int complexId, int? courtId, DateTime bookingDate, TimeSpan startTime, TimeSpan endTime)
    {
        // Ngày đóng cửa toàn tổ hợp
        if (await _context.ComplexClosures.AnyAsync(c => c.ComplexId == complexId && !c.IsDeleted && c.ClosureDate == bookingDate.Date))
            return false;

        // Giờ mở-đóng theo thứ trong tuần (nếu có cấu hình)
        var dayOfWeek = (int)bookingDate.DayOfWeek;
        var schedule = await _context.ComplexOperatingSchedules
            .FirstOrDefaultAsync(s => s.ComplexId == complexId && s.DayOfWeek == dayOfWeek && !s.IsDeleted);
        if (schedule != null && (startTime < schedule.OpenTime || endTime > schedule.CloseTime))
            return false;

        // Khung bảo trì (toàn tổ hợp hoặc riêng sân) chồng lấn slot
        var slotStart = bookingDate.Date.Add(startTime);
        var slotEnd = bookingDate.Date.Add(endTime);
        var inMaintenance = await _context.ComplexMaintenanceWindows.AnyAsync(m =>
            m.ComplexId == complexId && !m.IsDeleted
            && (m.CourtId == null || m.CourtId == courtId)
            && m.StartAt < slotEnd && m.EndAt > slotStart);

        return !inMaintenance;
    }

    public async Task<IEnumerable<Court>> GetAllAsync()
    {
        var courts = await _context.Courts
            .AsNoTracking()
            .AsSplitQuery()
            .Include(c => c.CourtType)
            .Include(c => c.PricingRules)
            .Where(c => !c.IsDeleted)
            .ToListAsync();
        await EnrichWithTypePricingRulesAsync(courts);
        return courts;
    }

    // Nav PricingRules chỉ chứa rule gắn CourtId; rule theo loại sân (CourtId null,
    // CourtTypeId khớp — cách seed mặc định) phải được gộp thêm để giá hiển thị/tính đúng.
    // Chỉ dùng cho query AsNoTracking (gán lại nav trên entity tracked sẽ làm EF hiểu nhầm là update).
    private async Task EnrichWithTypePricingRulesAsync(List<Court> courts)
    {
        if (courts.Count == 0) return;
        var typeIds = courts.Select(c => c.CourtTypeId).Distinct().ToList();
        var typeRules = await _context.PricingRules
            .AsNoTracking()
            .Where(p => p.CourtId == null && p.CourtTypeId != null && typeIds.Contains(p.CourtTypeId.Value))
            .ToListAsync();
        if (typeRules.Count == 0) return;
        foreach (var court in courts)
        {
            court.PricingRules = court.PricingRules
                .Concat(typeRules.Where(r => r.CourtTypeId == court.CourtTypeId))
                .OrderBy(r => r.IsWeekend).ThenBy(r => r.StartTime)
                .ToList();
        }
    }

    public async Task<Court?> GetByIdAsync(int courtId)
    {
        return await _context.Courts
            .Include(c => c.CourtType)
            .Include(c => c.Complex)
            .Include(c => c.PricingRules)
            .FirstOrDefaultAsync(c => c.CourtId == courtId && !c.IsDeleted);
    }

    public async Task<IEnumerable<Court>> GetAvailableCourtsAsync(DateTime date, TimeSpan startTime, TimeSpan endTime)
    {
        // Get all courts that don't have overlapping bookings
        // Bỏ qua: Cancelled bookings + Pending bookings đã hết hạn thanh toán
        return await _context.Courts
            .AsNoTracking()
            .Include(c => c.CourtType)
            .Where(c => !c.IsDeleted && c.Status == "Available")
            .Where(c => !c.BookingDetails.Any(b => 
                b.Booking.Status != "Cancelled" && // Bỏ qua các booking đã hủy
                // Bỏ qua booking Pending đã quá hạn thanh toán (ghost holds)
                !(b.Booking.Status == "Pending" && b.Booking.PaymentDeadline.HasValue && b.Booking.PaymentDeadline < DateTime.UtcNow) &&
                !b.Booking.IsDeleted &&
                b.BookingDate == date.Date && 
                ((b.StartTime <= startTime && b.EndTime > startTime) ||
                 (b.StartTime < endTime && b.EndTime >= endTime) ||
                 (b.StartTime >= startTime && b.EndTime <= endTime))))
            .ToListAsync();
    }

    public async Task<Court> CreateAsync(Court court)
    {
        _context.Courts.Add(court);
        await _context.SaveChangesAsync();
        return court;
    }

    public async Task UpdateAsync(Court court)
    {
        _context.Courts.Update(court);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<string>> GetBookedSlotsAsync(int courtId, DateTime date)
    {
        var bookedDetails = await _context.BookingDetails
            .AsNoTracking()
            .Where(bd => bd.CourtId == courtId && bd.BookingDate.Date == date.Date && bd.Booking.Status != "Cancelled")
            .Where(bd => !(bd.Booking.Status == "Pending" && bd.Booking.PaymentDeadline.HasValue && bd.Booking.PaymentDeadline < DateTime.UtcNow) && !bd.Booking.IsDeleted)
            .ToListAsync();

        var bookedSlots = new List<string>();
        foreach (var detail in bookedDetails)
        {
            var startHour = detail.StartTime.Hours;
            var endHour = detail.EndTime.Hours;
            for (int i = startHour; i < endHour; i++)
            {
                bookedSlots.Add($"{i:00}:00");
            }
        }
        return bookedSlots.Distinct();
    }

    public async Task<(IEnumerable<Court> Items, int TotalCount)> GetPagedCourtsAsync(ProSport.Application.DTOs.CourtQueryParameters parameters)
    {
        var query = _context.Courts
            .AsNoTracking()
            .AsSplitQuery()
            .Include(c => c.CourtType)
            .Include(c => c.PricingRules)
            .Where(c => !c.IsDeleted)
            .AsQueryable();

        if (!string.IsNullOrEmpty(parameters.SearchTerm))
        {
            query = query.Where(c => c.Name.Contains(parameters.SearchTerm));
        }
        
        if (!string.IsNullOrEmpty(parameters.Status))
        {
            var normalizedStatus = CourtStatuses.NormalizeApiStatus(parameters.Status);
            query = query.Where(c => c.Status == normalizedStatus);
        }

        if (parameters.ComplexId.HasValue)
            query = query.Where(c => c.ComplexId == parameters.ComplexId.Value);

        if (parameters.CourtTypeId.HasValue)
            query = query.Where(c => c.CourtTypeId == parameters.CourtTypeId.Value);

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderBy(c => c.CourtId)
            .Skip((parameters.PageNumber - 1) * parameters.PageSize)
            .Take(parameters.PageSize)
            .ToListAsync();

        await EnrichWithTypePricingRulesAsync(items);
        return (items, totalCount);
    }

    public async Task<bool> HasActiveBookingsAsync(int courtId)
    {
        var now = DateTime.UtcNow;
        return await _context.BookingDetails
            .Include(bd => bd.Booking)
            .AnyAsync(bd => bd.CourtId == courtId 
                         && !bd.Booking.IsDeleted
                         && bd.Booking.Status != "Cancelled"
                         && bd.BookingDate.Date >= now.Date);
    }

    public async Task<bool> ExistsCodeInComplexAsync(int complexId, string code, int? excludeCourtId)
    {
        if (string.IsNullOrWhiteSpace(code)) return false;
        return await _context.Courts.AnyAsync(c =>
            c.ComplexId == complexId
            && !c.IsDeleted
            && c.Code == code
            && (!excludeCourtId.HasValue || c.CourtId != excludeCourtId.Value));
    }

    // Pricing Rules
    public async Task<IEnumerable<PricingRule>> GetPricingRulesByCourtIdAsync(int courtId)
    {
        // Rule "hiệu lực" của một sân gồm 2 nguồn: gắn trực tiếp CourtId, HOẶC gắn theo
        // loại sân (CourtId null + CourtTypeId khớp — cách seed dữ liệu mặc định).
        // Query cũ chỉ lọc CourtId nên toàn bộ rule theo loại sân bị vô hình.
        var courtTypeId = await _context.Courts
            .AsNoTracking()
            .Where(c => c.CourtId == courtId)
            .Select(c => (int?)c.CourtTypeId)
            .FirstOrDefaultAsync();

        return await _context.PricingRules
            .AsNoTracking()
            .Where(p => p.CourtId == courtId
                     || (p.CourtId == null && p.CourtTypeId != null && p.CourtTypeId == courtTypeId))
            .OrderBy(p => p.IsWeekend).ThenBy(p => p.StartTime)
            .ToListAsync();
    }

    public async Task<PricingRule?> GetPricingRuleByIdAsync(int ruleId)
    {
        return await _context.PricingRules
            .FirstOrDefaultAsync(p => p.PricingRuleId == ruleId);
    }

    public async Task<PricingRule> AddPricingRuleAsync(PricingRule rule)
    {
        _context.PricingRules.Add(rule);
        await _context.SaveChangesAsync();
        return rule;
    }

    public async Task UpdatePricingRuleAsync(PricingRule rule)
    {
        _context.PricingRules.Update(rule);
        await _context.SaveChangesAsync();
    }

    public async Task DeletePricingRuleAsync(PricingRule rule)
    {
        _context.PricingRules.Remove(rule);
        await _context.SaveChangesAsync();
    }
}
