using Microsoft.EntityFrameworkCore;
using ProSport.Application.Interfaces;
using ProSport.Domain.Entities;
using ProSport.Infrastructure.Data;

namespace ProSport.Infrastructure.Repositories;

public class EquipmentRepository : IEquipmentRepository
{
    private readonly ProSportDbContext _context;

    public EquipmentRepository(ProSportDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Equipment>> GetAllAsync()
    {
        return await _context.Equipments
            .Where(e => !e.IsDeleted)
            .ToListAsync();
    }

    public async Task<Equipment?> GetByIdAsync(int id)
    {
        return await _context.Equipments
            .FirstOrDefaultAsync(e => e.EquipmentId == id && !e.IsDeleted);
    }

    public async Task<IEnumerable<EquipmentRental>> GetUserRentalsAsync(int userId)
    {
        return await _context.EquipmentRentals
            .Include(r => r.Equipment)
            .Include(r => r.Booking)
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.RentedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<EquipmentRental>> GetPendingInspectionsAsync()
    {
        return await _context.EquipmentRentals
            .Include(r => r.Equipment)
            .Include(r => r.Booking)
            .Where(r => r.RentalStatus == "Returned" && r.DepositStatus == "Held")
            .OrderByDescending(r => r.RentedAt)
            .ToListAsync();
    }

    public async Task CreateRentalAsync(EquipmentRental rental)
    {
        _context.EquipmentRentals.Add(rental);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateEquipmentAsync(Equipment equipment)
    {
        _context.Equipments.Update(equipment);
        await _context.SaveChangesAsync();
    }

    public async Task<EquipmentRental?> GetRentalByIdAsync(int rentalId)
    {
        return await _context.EquipmentRentals
            .Include(r => r.Equipment)
            .Include(r => r.Booking)
            .FirstOrDefaultAsync(r => r.DetailId == rentalId);
    }

    public async Task UpdateRentalAsync(EquipmentRental rental)
    {
        _context.EquipmentRentals.Update(rental);
        await _context.SaveChangesAsync();
    }
}
