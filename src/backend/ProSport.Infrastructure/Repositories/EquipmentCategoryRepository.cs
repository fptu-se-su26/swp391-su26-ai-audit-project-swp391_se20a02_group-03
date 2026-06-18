namespace ProSport.Infrastructure.Repositories;

using Microsoft.EntityFrameworkCore;
using ProSport.Application.Interfaces;
using ProSport.Domain.Entities;
using ProSport.Infrastructure.Data;
using System.Collections.Generic;
using System.Threading.Tasks;

public class EquipmentCategoryRepository : IEquipmentCategoryRepository
{
    private readonly ProSportDbContext _context;

    public EquipmentCategoryRepository(ProSportDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<EquipmentCategory>> GetAllAsync()
    {
        return await _context.EquipmentCategories.Where(c => !c.IsDeleted).ToListAsync();
    }

    public async Task<EquipmentCategory?> GetByIdAsync(int id)
    {
        return await _context.EquipmentCategories.FirstOrDefaultAsync(c => c.EquipmentCategoryId == id && !c.IsDeleted);
    }

    public async Task<EquipmentCategory> CreateAsync(EquipmentCategory category)
    {
        _context.EquipmentCategories.Add(category);
        await _context.SaveChangesAsync();
        return category;
    }

    public async Task UpdateAsync(EquipmentCategory category)
    {
        _context.EquipmentCategories.Update(category);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(EquipmentCategory category)
    {
        category.IsDeleted = true;
        _context.EquipmentCategories.Update(category);
        await _context.SaveChangesAsync();
    }
}
