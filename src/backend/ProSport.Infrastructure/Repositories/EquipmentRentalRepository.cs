using Microsoft.EntityFrameworkCore;
using ProSport.Application.Interfaces;
using ProSport.Domain.Entities;
using ProSport.Infrastructure.Data;

namespace ProSport.Infrastructure.Repositories;

public class EquipmentRentalRepository : IEquipmentRentalRepository
{
    private readonly ProSportDbContext _context;

    public EquipmentRentalRepository(ProSportDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<BookingDetailEquipment>> GetAllAsync(string? rentalStatus = null)
    {
        var query = _context.BookingDetailEquipments
            .AsNoTracking()
            .AsSplitQuery()
            .Include(r => r.Equipment)
            .Include(r => r.User)
            .Include(r => r.Booking)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(rentalStatus))
            query = query.Where(r => r.RentalStatus == rentalStatus);

        return await query
            .OrderByDescending(r => r.RentedAt)
            .ToListAsync();
    }

    public async Task<BookingDetailEquipment?> GetByIdAsync(int detailId)
    {
        return await _context.BookingDetailEquipments
            .Include(r => r.Equipment)
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.DetailId == detailId);
    }

    public async Task<BookingDetailEquipment> CreateAsync(BookingDetailEquipment rental)
    {
        _context.BookingDetailEquipments.Add(rental);
        await _context.SaveChangesAsync();
        return (await GetByIdAsync(rental.DetailId))!;
    }

    public async Task<BookingDetailEquipment> CreateWithStockDecrementAsync(BookingDetailEquipment rental, Equipment equipment)
    {
        await using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            _context.Equipments.Update(equipment);
            _context.BookingDetailEquipments.Add(rental);
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
            return (await GetByIdAsync(rental.DetailId))!;
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task UpdateAsync(BookingDetailEquipment rental)
    {
        _context.BookingDetailEquipments.Update(rental);
        await _context.SaveChangesAsync();
    }
}
