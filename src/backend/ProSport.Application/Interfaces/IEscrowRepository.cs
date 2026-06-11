using ProSport.Domain.Entities;

namespace ProSport.Application.Interfaces;

public interface IEscrowRepository
{
    Task<EscrowWallet?> GetByUserIdAsync(int userId);
    Task<EscrowWallet> CreateAsync(EscrowWallet wallet);
    Task UpdateAsync(EscrowWallet wallet);
    Task<Transaction> AddTransactionAsync(Transaction transaction);
}
