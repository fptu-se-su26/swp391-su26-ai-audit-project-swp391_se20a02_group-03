using Microsoft.EntityFrameworkCore;
using ProSport.Application.Interfaces;
using ProSport.Domain.Entities;
using ProSport.Infrastructure.Data;

namespace ProSport.Infrastructure.Repositories;

public class VoucherRepository : IVoucherRepository
{
    private readonly ProSportDbContext _context;

    public VoucherRepository(ProSportDbContext context)
    {
        _context = context;
    }

    public async Task<List<Voucher>> GetAllAsync(bool onlyActive = false)
    {
        var query = _context.Vouchers.AsQueryable();
        if (onlyActive)
        {
            var now = DateTime.UtcNow;
            query = query.Where(v => v.IsActive && v.StartDate <= now && v.EndDate >= now && v.UsedQuantity < v.TotalQuantity);
        }
        return await query.OrderByDescending(v => v.VoucherId).ToListAsync();
    }

    public async Task<Voucher?> GetByIdAsync(int id)
    {
        return await _context.Vouchers.FirstOrDefaultAsync(v => v.VoucherId == id);
    }

    public async Task<Voucher?> GetByCodeAsync(string code)
    {
        return await _context.Vouchers.FirstOrDefaultAsync(v => v.Code == code);
    }

    public async Task<Voucher> AddAsync(Voucher voucher)
    {
        _context.Vouchers.Add(voucher);
        await _context.SaveChangesAsync();
        return voucher;
    }

    public async Task<Voucher> UpdateAsync(Voucher voucher)
    {
        _context.Vouchers.Update(voucher);
        await _context.SaveChangesAsync();
        return voucher;
    }

    public async Task<bool> DeleteAsync(Voucher voucher)
    {
        // Soft delete được xử lý ở SaveChanges (ApplySoftDelete).
        _context.Vouchers.Remove(voucher);
        await _context.SaveChangesAsync();
        return true;
    }
}
