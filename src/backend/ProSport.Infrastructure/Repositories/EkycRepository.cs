using Microsoft.EntityFrameworkCore;
using ProSport.Application.Interfaces;
using ProSport.Domain.Entities;
using ProSport.Infrastructure.Data;

namespace ProSport.Infrastructure.Repositories;

public class EkycRepository : IEkycRepository
{
    private readonly ProSportDbContext _context;

    public EkycRepository(ProSportDbContext context)
    {
        _context = context;
    }

    public async Task<List<EkycProfile>> GetAllAsync(string? status = null)
    {
        var query = _context.EkycProfiles.Include(e => e.User).AsQueryable();
        if (!string.IsNullOrWhiteSpace(status))
            query = query.Where(e => e.Status == status);
        return await query.OrderByDescending(e => e.EkycProfileId).ToListAsync();
    }

    public async Task<EkycProfile?> GetByIdAsync(int id)
    {
        return await _context.EkycProfiles
            .Include(e => e.User)
            .FirstOrDefaultAsync(e => e.EkycProfileId == id);
    }

    public async Task<EkycProfile?> GetByUserIdAsync(int userId)
    {
        return await _context.EkycProfiles
            .Include(e => e.User)
            .FirstOrDefaultAsync(e => e.UserId == userId);
    }

    public async Task<User?> GetUserByIdAsync(int userId)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
    }

    public async Task AddAsync(EkycProfile profile)
    {
        await _context.EkycProfiles.AddAsync(profile);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
