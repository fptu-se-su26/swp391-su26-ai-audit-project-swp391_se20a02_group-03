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
            .Include(e => e.Units)
            .Where(e => !e.IsDeleted)
            .ToListAsync();
    }

    public async Task<Equipment?> GetByIdAsync(int id)
    {
        return await _context.Equipments
            .Include(e => e.Units)
            .FirstOrDefaultAsync(e => e.EquipmentId == id && !e.IsDeleted);
    }

    public async Task<IEnumerable<EquipmentRental>> GetUserRentalsAsync(int userId)
    {
        return await _context.EquipmentRentals
            .Include(r => r.Equipment)
            .Include(r => r.Booking)
            .Include(r => r.EquipmentUnit)
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
            .Include(r => r.EquipmentUnit)
            .FirstOrDefaultAsync(r => r.DetailId == rentalId);
    }

    public async Task UpdateRentalAsync(EquipmentRental rental)
    {
        _context.EquipmentRentals.Update(rental);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<EquipmentUnit>> GetAvailableUnitsForEquipmentAsync(int equipmentId)
    {
        return await _context.EquipmentUnits
            .Where(u => u.EquipmentId == equipmentId && u.Status == "Available" && !u.IsDeleted)
            .ToListAsync();
    }

    public async Task UpdateEquipmentUnitStatusAsync(int unitId, string newStatus)
    {
        var unit = await _context.EquipmentUnits.FindAsync(unitId);
        if (unit != null)
        {
            unit.Status = newStatus;
            _context.EquipmentUnits.Update(unit);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<EquipmentUnit?> GetEquipmentUnitBySerialAsync(string serial)
    {
        return await _context.EquipmentUnits
            .FirstOrDefaultAsync(u => u.SerialNumber == serial && !u.IsDeleted);
    }

    public async Task<EquipmentUnit?> GetEquipmentUnitByIdAsync(int unitId)
    {
        return await _context.EquipmentUnits.FindAsync(unitId);
    }

    public async Task UpdateEquipmentUnitAsync(EquipmentUnit unit)
    {
        _context.EquipmentUnits.Update(unit);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<EquipmentUnit>> GetAllUnitsAsync()
    {
        return await _context.EquipmentUnits
            .Where(u => !u.IsDeleted)
            .ToListAsync();
    }

    public async Task<IEnumerable<EquipmentRental>> GetAllRentalsAsync()
    {
        return await _context.EquipmentRentals
            .Include(r => r.Equipment)
            .ToListAsync();
    }
}
