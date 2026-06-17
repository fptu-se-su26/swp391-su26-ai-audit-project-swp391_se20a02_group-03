namespace ProSport.Application.Interfaces;

using ProSport.Application.DTOs;
using ProSport.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IInventoryRepository
{
    Task<InventoryTransaction> AddTransactionAsync(InventoryTransaction transaction);
    Task<(IEnumerable<InventoryTransaction> Items, int TotalCount)> GetPagedTransactionsAsync(int equipmentId, InventoryQueryParameters parameters);
    Task ExecuteStockTransactionAsync(InventoryTransaction transaction, int quantityDelta);
}
