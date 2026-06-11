using Microsoft.EntityFrameworkCore;
using ProSport.Application.Interfaces;
using ProSport.Domain.Entities;
using ProSport.Infrastructure.Data;

namespace ProSport.Infrastructure.Repositories;

public class MatchRepository : IMatchRepository
{
    private readonly ProSportDbContext _context;

    public MatchRepository(ProSportDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Match>> GetAllAsync()
    {
        return await _context.Matches
            .Include(m => m.Host)
            .Include(m => m.Court)
            .Include(m => m.Participants)
                .ThenInclude(p => p.User)
            .Where(m => !m.IsDeleted)
            .ToListAsync();
    }

    public async Task<Match?> GetByIdAsync(int matchId)
    {
        return await _context.Matches
            .Include(m => m.Host)
            .Include(m => m.Court)
            .Include(m => m.Participants)
                .ThenInclude(p => p.User)
            .FirstOrDefaultAsync(m => m.MatchId == matchId && !m.IsDeleted);
    }

    public async Task<IEnumerable<Match>> GetByHostIdAsync(int hostId)
    {
        return await _context.Matches
            .Include(m => m.Court)
            .Include(m => m.Participants)
            .Where(m => m.HostId == hostId && !m.IsDeleted)
            .ToListAsync();
    }

    public async Task<Match> CreateAsync(Match match)
    {
        _context.Matches.Add(match);
        await _context.SaveChangesAsync();
        return match;
    }

    public async Task UpdateAsync(Match match)
    {
        _context.Matches.Update(match);
        await _context.SaveChangesAsync();
    }
}
