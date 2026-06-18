using Microsoft.EntityFrameworkCore;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using ProSport.Domain.Entities;
using ProSport.Infrastructure.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProSport.Infrastructure.Repositories;

public class EquipmentRepository : IEquipmentRepository
{
    private readonly ProSportDbContext _context;

    public EquipmentRepository(ProSportDbContext context)
    {
        _context = context;
    }

    // CRUD Methods
    public async Task<(IEnumerable<Equipment> Items, int TotalCount)> GetPagedAsync(EquipmentQueryParameters parameters)
    {
 feat/API_Quan_Ly_Thietbi_Kho
 feat/API_Quan_Ly_Thietbi_Kho

 feat/DE190130_API_Tham_Gia_&_Vi_Escrow
 main
        var query = _context.Equipments
            .Include(e => e.EquipmentCategory)

        return await _context.Equipments
            .Include(e => e.Units)
 feat/API_Quan_Ly_Thietbi_Kho
 main

            main
 main
            .Where(e => !e.IsDeleted)
            .AsQueryable();

        if (parameters.CategoryId.HasValue)
        {
            query = query.Where(e => e.EquipmentCategoryId == parameters.CategoryId.Value);
        }

        if (!string.IsNullOrEmpty(parameters.SearchQuery))
        {
 feat/API_Quan_Ly_Thietbi_Kho
            query = query.Where(e => e.Name != null && e.Name.Contains(parameters.SearchQuery) || 
                                     e.EquipmentName != null && e.EquipmentName.Contains(parameters.SearchQuery));

            query = query.Where(e => (e.Name != null && e.Name.Contains(parameters.SearchQuery)) || 
                                     (e.EquipmentName != null && e.EquipmentName.Contains(parameters.SearchQuery)));
 main
        }

        if (!string.IsNullOrEmpty(parameters.Status))
        {
            query = query.Where(e => e.Status == parameters.Status);
        }

        var totalCount = await query.CountAsync();
        var items = await query
            .Skip((parameters.PageNumber - 1) * parameters.PageSize)
            .Take(parameters.PageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<Equipment?> GetByIdAsync(int id)
    {
        return await _context.Equipments
 feat/API_Quan_Ly_Thietbi_Kho
 feat/API_Quan_Ly_Thietbi_Kho
            .Include(e => e.EquipmentCategory)

            .Include(e => e.Units)
main

 feat/DE190130_API_Tham_Gia_&_Vi_Escrow
            .Include(e => e.EquipmentCategory)

            .Include(e => e.Units)
 main
 main
            .FirstOrDefaultAsync(e => e.EquipmentId == id && !e.IsDeleted);
    }

    public async Task<Equipment> CreateAsync(Equipment equipment)
    {
        _context.Equipments.Add(equipment);
        await _context.SaveChangesAsync();
        return equipment;
    }

    public async Task UpdateAsync(Equipment equipment)
    {
        _context.Equipments.Update(equipment);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Equipment equipment)
    {
        equipment.IsDeleted = true;
        _context.Equipments.Update(equipment);
        await _context.SaveChangesAsync();
    }

    // Rent/Return Methods
    public async Task<IEnumerable<Equipment>> GetAllAsync()
    {
        return await _context.Equipments
            .Where(e => !e.IsDeleted)
            .ToListAsync();
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
