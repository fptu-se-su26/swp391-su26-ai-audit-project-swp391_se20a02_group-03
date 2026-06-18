namespace ProSport.Infrastructure.Repositories;

using Microsoft.EntityFrameworkCore;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using ProSport.Domain.Entities;
using ProSport.Infrastructure.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class InventoryRepository : IInventoryRepository
{
    private readonly ProSportDbContext _context;

    public InventoryRepository(ProSportDbContext context)
    {
        _context = context;
    }

    public async Task<InventoryTransaction> AddTransactionAsync(InventoryTransaction transaction)
    {
        _context.InventoryTransactions.Add(transaction);
        await _context.SaveChangesAsync();
        return transaction;
    }

    public async Task<(IEnumerable<InventoryTransaction> Items, int TotalCount)> GetPagedTransactionsAsync(int equipmentId, InventoryQueryParameters parameters)
    {
        var query = _context.InventoryTransactions
            .Include(t => t.Equipment)
            .Include(t => t.User)
            .Where(t => t.EquipmentId == equipmentId && !t.IsDeleted)
            .OrderByDescending(t => t.TransactionDate);

        var totalCount = await query.CountAsync();
        var items = await query
            .Skip((parameters.PageNumber - 1) * parameters.PageSize)
            .Take(parameters.PageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task ExecuteStockTransactionAsync(InventoryTransaction transaction, int quantityDelta)
    {
        using var tx = await _context.Database.BeginTransactionAsync();
        try
        {
            var equipment = await _context.Equipments.FirstOrDefaultAsync(e => e.EquipmentId == transaction.EquipmentId);
            if (equipment == null) throw new System.Exception("Equipment not found");

            if (quantityDelta < 0 && equipment.StockQuantity < System.Math.Abs(quantityDelta))
            {
                throw new System.InvalidOperationException("Tồn kho không đủ");
            }

            equipment.StockQuantity += quantityDelta;
            _context.InventoryTransactions.Add(transaction);

            await _context.SaveChangesAsync();
            await tx.CommitAsync();
        }
        catch
        {
            await tx.RollbackAsync();
            throw;
        }
    }
}
