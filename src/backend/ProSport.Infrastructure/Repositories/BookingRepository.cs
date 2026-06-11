using Microsoft.EntityFrameworkCore;
using ProSport.Application.Interfaces;
using ProSport.Domain.Entities;
using ProSport.Infrastructure.Data;

namespace ProSport.Infrastructure.Repositories;

public class BookingRepository : IBookingRepository
{
    private readonly ProSportDbContext _context;

    public BookingRepository(ProSportDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Booking>> GetAllAsync()
    {
        return await _context.Bookings
            .Include(b => b.BookingDetails)
            .Include(b => b.User)
            .Where(b => !b.IsDeleted)
            .ToListAsync();
    }

    public async Task<Booking?> GetByIdAsync(int bookingId)
    {
        return await _context.Bookings
            .Include(b => b.BookingDetails)
                .ThenInclude(bd => bd.Court)
            .Include(b => b.User)
            .FirstOrDefaultAsync(b => b.BookingId == bookingId && !b.IsDeleted);
    }

    public async Task<IEnumerable<Booking>> GetByUserIdAsync(int userId)
    {
        return await _context.Bookings
            .Include(b => b.BookingDetails)
                .ThenInclude(bd => bd.Court)
            .Where(b => b.UserId == userId && !b.IsDeleted)
            .ToListAsync();
    }

    public async Task<Booking> CreateAsync(Booking booking)
    {
        _context.Bookings.Add(booking);
        await _context.SaveChangesAsync();
        return booking;
    }

    public async Task UpdateAsync(Booking booking)
    {
        _context.Bookings.Update(booking);
        await _context.SaveChangesAsync();
    }
}
