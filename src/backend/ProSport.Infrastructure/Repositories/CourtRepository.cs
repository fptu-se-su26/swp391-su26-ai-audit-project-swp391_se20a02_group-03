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
            .Include(c => c.CourtType)
            .Where(c => !c.IsDeleted)
            .ToListAsync();
    }

    public async Task<Court?> GetByIdAsync(int courtId)
    {
        return await _context.Courts
            .Include(c => c.CourtType)
            .Include(c => c.PricingRules)
            .FirstOrDefaultAsync(c => c.CourtId == courtId && !c.IsDeleted);
    }

    public async Task<IEnumerable<Court>> GetAvailableCourtsAsync(DateTime date, TimeSpan startTime, TimeSpan endTime)
    {
        // Get all courts that don't have overlapping bookings
        return await _context.Courts
            .Include(c => c.CourtType)
            .Where(c => !c.IsDeleted && c.Status == "Available")
            .Where(c => !c.BookingDetails.Any(b => 
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
}
