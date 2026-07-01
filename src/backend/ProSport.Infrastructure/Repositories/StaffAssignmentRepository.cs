using Microsoft.EntityFrameworkCore;
using ProSport.Application.Interfaces;
using ProSport.Domain.Entities;
using ProSport.Infrastructure.Data;

namespace ProSport.Infrastructure.Repositories;

public class StaffAssignmentRepository : IStaffAssignmentRepository
{
    private readonly ProSportDbContext _context;

    public StaffAssignmentRepository(ProSportDbContext context)
    {
        _context = context;
    }

    public async Task<List<StaffAssignment>> GetByComplexIdAsync(int complexId)
    {
        return await _context.StaffAssignments
            .Include(s => s.StaffUser)
            .Where(s => s.ComplexId == complexId && !s.IsDeleted)
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync();
    }

    public async Task<StaffAssignment?> GetByIdAsync(int id)
    {
        return await _context.StaffAssignments
            .Include(s => s.StaffUser)
            .FirstOrDefaultAsync(s => s.StaffAssignmentId == id && !s.IsDeleted);
    }

    public async Task<StaffAssignment?> GetByStaffAndComplexAsync(int staffUserId, int complexId)
    {
        return await _context.StaffAssignments
            .FirstOrDefaultAsync(s => s.StaffUserId == staffUserId && s.ComplexId == complexId && !s.IsDeleted);
    }

    public async Task<StaffAssignment> CreateAsync(StaffAssignment assignment)
    {
        _context.StaffAssignments.Add(assignment);
        await _context.SaveChangesAsync();
        return assignment;
    }

    public async Task UpdateAsync(StaffAssignment assignment)
    {
        _context.StaffAssignments.Update(assignment);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(StaffAssignment assignment)
    {
        assignment.IsDeleted = true;
        assignment.UpdatedAt = DateTime.UtcNow;
        await UpdateAsync(assignment);
    }

    public async Task<int> CountByStaffUserIdAsync(int staffUserId)
    {
        return await _context.StaffAssignments
            .CountAsync(s => s.StaffUserId == staffUserId && !s.IsDeleted);
    }
}
