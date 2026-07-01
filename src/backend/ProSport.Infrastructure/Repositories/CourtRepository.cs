using Microsoft.EntityFrameworkCore;
using ProSport.Application.Interfaces;
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

    public async Task<IEnumerable<Court>> GetAllAsync()
    {
        return await _context.Courts
            .AsNoTracking()
            .AsSplitQuery()
            .Include(c => c.CourtType)
            .Include(c => c.PricingRules)
            .Where(c => !c.IsDeleted)
            .ToListAsync();
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
            query = query.Where(c => c.Status == parameters.Status);
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
        return await _context.PricingRules
            .AsNoTracking()
            .Where(p => p.CourtId == courtId)
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
