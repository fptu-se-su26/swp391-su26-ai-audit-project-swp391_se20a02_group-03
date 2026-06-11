using Microsoft.EntityFrameworkCore;
using ProSport.Application.Interfaces;
using ProSport.Domain.Entities;
using ProSport.Infrastructure.Data;

namespace ProSport.Infrastructure.Repositories;

public class EscrowRepository : IEscrowRepository
{
    private readonly ProSportDbContext _context;

    public EscrowRepository(ProSportDbContext context)
    {
        _context = context;
    }

    public async Task<EscrowWallet?> GetByUserIdAsync(int userId)
    {
        return await _context.EscrowWallets
            .Include(w => w.Transactions)
            .FirstOrDefaultAsync(w => w.UserId == userId && !w.IsDeleted);
    }

    public async Task<EscrowWallet> CreateAsync(EscrowWallet wallet)
    {
        _context.EscrowWallets.Add(wallet);
        await _context.SaveChangesAsync();
        return wallet;
    }

    public async Task UpdateAsync(EscrowWallet wallet)
    {
        _context.EscrowWallets.Update(wallet);
        await _context.SaveChangesAsync();
    }

    public async Task<Transaction> AddTransactionAsync(Transaction transaction)
    {
        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();
        return transaction;
    }
}
