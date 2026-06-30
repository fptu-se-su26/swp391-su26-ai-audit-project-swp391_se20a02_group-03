using Microsoft.EntityFrameworkCore;
using ProSport.Application.Interfaces;
using ProSport.Infrastructure.Data;

namespace ProSport.Infrastructure.Repositories;

public class RentalSessionRepository : IRentalSessionRepository
{
    private readonly ProSportDbContext _context;

    public RentalSessionRepository(ProSportDbContext context) => _context = context;

    public async Task<int?> GetComplexIdBySessionIdAsync(int rentalSessionId)
    {
        return await _context.RentalSessions.AsNoTracking()
            .Where(r => r.RentalSessionId == rentalSessionId && !r.IsDeleted)
            .Select(r => (int?)r.ComplexId)
            .FirstOrDefaultAsync();
    }
}
