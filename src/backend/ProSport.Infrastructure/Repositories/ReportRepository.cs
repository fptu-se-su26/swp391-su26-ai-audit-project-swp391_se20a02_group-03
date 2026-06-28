using Microsoft.EntityFrameworkCore;
using ProSport.Application.Interfaces;
using ProSport.Domain.Entities;
using ProSport.Infrastructure.Data;

namespace ProSport.Infrastructure.Repositories;

public class ReportRepository : IReportRepository
{
    private readonly ProSportDbContext _context;

    public ReportRepository(ProSportDbContext context)
    {
        _context = context;
    }

    public async Task<List<Report>> GetAllAsync(string? status = null)
    {
        var query = _context.Reports.AsQueryable();
        if (!string.IsNullOrWhiteSpace(status))
            query = query.Where(r => r.Status == status);
        return await query.OrderByDescending(r => r.ReportId).ToListAsync();
    }

    public async Task<List<Report>> GetByReporterAsync(int reporterId)
    {
        return await _context.Reports
            .Where(r => r.ReporterId == reporterId)
            .OrderByDescending(r => r.ReportId)
            .ToListAsync();
    }

    public async Task<Report?> GetByIdAsync(int id)
    {
        return await _context.Reports.FirstOrDefaultAsync(r => r.ReportId == id);
    }

    public async Task<bool> ExistsAsync(int reporterId, int reportedUserId, int matchId)
    {
        return await _context.Reports
            .AnyAsync(r => r.ReporterId == reporterId && r.ReportedUserId == reportedUserId && r.MatchId == matchId);
    }

    public async Task<Report> AddAsync(Report report)
    {
        _context.Reports.Add(report);
        await _context.SaveChangesAsync();
        return report;
    }

    public async Task<Report> UpdateAsync(Report report)
    {
        _context.Reports.Update(report);
        await _context.SaveChangesAsync();
        return report;
    }
}
