namespace ProSport.Application.Services;

using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using ProSport.Domain.Entities;
using System;
using System.Linq;
using System.Threading.Tasks;

public class InventoryService : IInventoryService
{
    private readonly IInventoryRepository _inventoryRepository;

    public InventoryService(IInventoryRepository inventoryRepository)
    {
        _inventoryRepository = inventoryRepository;
    }

    public async Task StockInAsync(StockTransactionDto dto, int userId)
    {
        if (dto.Quantity <= 0)
        {
            throw new ArgumentException("Quantity must be greater than 0");
        }

        var transaction = new InventoryTransaction
        {
            EquipmentId = dto.EquipmentId,
            UserId = userId,
            TransactionType = "StockIn",
            Quantity = dto.Quantity,
            TransactionDate = DateTime.UtcNow,
            Notes = dto.Notes
        };

        await _inventoryRepository.ExecuteStockTransactionAsync(transaction, dto.Quantity);
    }

    public async Task StockOutAsync(StockTransactionDto dto, int userId)
    {
        if (dto.Quantity <= 0)
        {
            throw new ArgumentException("Quantity must be greater than 0");
        }

        var transaction = new InventoryTransaction
        {
            EquipmentId = dto.EquipmentId,
            UserId = userId,
            TransactionType = "StockOut",
            Quantity = dto.Quantity, // Keep positive in DB as per design
            TransactionDate = DateTime.UtcNow,
            Notes = dto.Notes
        };

        // Pass -Quantity for delta
        await _inventoryRepository.ExecuteStockTransactionAsync(transaction, -dto.Quantity);
    }

    public async Task<PagedResult<InventoryTransactionDto>> GetTransactionHistoryAsync(int equipmentId, InventoryQueryParameters parameters)
    {
        var (items, totalCount) = await _inventoryRepository.GetPagedTransactionsAsync(equipmentId, parameters);

        var dtoList = items.Select(t => new InventoryTransactionDto
        {
            Id = t.InventoryTransactionId,
            EquipmentId = t.EquipmentId,
            EquipmentName = t.Equipment?.Name ?? "Unknown",
            TransactionType = t.TransactionType,
            Quantity = t.Quantity,
            TransactionDate = t.TransactionDate,
            Notes = t.Notes,
            UserId = t.UserId,
            UserName = t.User?.FullName ?? "Unknown"
        }).ToList();

        return new PagedResult<InventoryTransactionDto>
        {
            Items = dtoList,
            TotalCount = totalCount,
            CurrentPage = parameters.PageNumber,
            TotalPages = (int)Math.Ceiling((double)totalCount / parameters.PageSize)
        };
    }
}
