namespace ProSport.Application.Interfaces;

using ProSport.Application.DTOs;
using System.Threading.Tasks;

public interface IInventoryService
{
    Task StockInAsync(StockTransactionDto dto, int userId);
    Task StockOutAsync(StockTransactionDto dto, int userId);
    Task<PagedResult<InventoryTransactionDto>> GetTransactionHistoryAsync(int equipmentId, InventoryQueryParameters parameters);
}
