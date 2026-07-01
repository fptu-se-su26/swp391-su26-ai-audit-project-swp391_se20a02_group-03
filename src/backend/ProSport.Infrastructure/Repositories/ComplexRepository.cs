using Microsoft.EntityFrameworkCore;
using ProSport.Application.Interfaces;
using ProSport.Domain.Entities;
using ProSport.Infrastructure.Data;

namespace ProSport.Infrastructure.Repositories;

public class ComplexRepository : IComplexRepository
{
    private readonly ProSportDbContext _context;

    public ComplexRepository(ProSportDbContext context)
    {
        _context = context;
    }

    public async Task<Complex?> GetByIdAsync(int complexId)
    {
        return await _context.Complexes
            .FirstOrDefaultAsync(c => c.ComplexId == complexId);
    }

    public async Task<List<Complex>> GetAllActiveAsync()
    {
        return await _context.Complexes
            .Where(c => c.Status == "Active")
            .ToListAsync();
    }

    public async Task<Complex> CreateAsync(Complex complex)
    {
        _context.Complexes.Add(complex);
        await _context.SaveChangesAsync();
        return complex;
    }

    public async Task UpdateAsync(Complex complex)
    {
        _context.Complexes.Update(complex);
        await _context.SaveChangesAsync();
    }
}
