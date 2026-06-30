using Microsoft.EntityFrameworkCore;
using ProSport.Application.Interfaces;
using ProSport.Domain.Entities;
using ProSport.Infrastructure.Data;

namespace ProSport.Infrastructure.Repositories;

public class ComplexOwnerRepository : IComplexOwnerRepository
{
    private readonly ProSportDbContext _context;

    public ComplexOwnerRepository(ProSportDbContext context)
    {
        _context = context;
    }

    public async Task<List<ComplexOwner>> GetByUserIdAsync(int userId)
    {
        return await _context.ComplexOwners
            .Include(co => co.Complex)
            .Where(co => co.UserId == userId && co.Status == "Active")
            .ToListAsync();
    }

    public async Task<ComplexOwner?> GetPrimaryByUserIdAsync(int userId)
    {
        return await _context.ComplexOwners
            .Include(co => co.Complex)
            .FirstOrDefaultAsync(co => co.UserId == userId && co.IsPrimary && co.Status == "Active");
    }

    public async Task<bool> IsUserOwnerOfComplexAsync(int userId, int complexId)
    {
        return await _context.ComplexOwners
            .AnyAsync(co => co.UserId == userId && co.ComplexId == complexId && co.Status == "Active");
    }

    public async Task<ComplexOwner> CreateAsync(ComplexOwner complexOwner)
    {
        _context.ComplexOwners.Add(complexOwner);
        await _context.SaveChangesAsync();
        return complexOwner;
    }
}
