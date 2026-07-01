using Microsoft.EntityFrameworkCore;
using ProSport.Application.Interfaces;
using ProSport.Domain.Entities;
using ProSport.Infrastructure.Data;

namespace ProSport.Infrastructure.Repositories;

public class CartRepository : ICartRepository
{
    private readonly ProSportDbContext _context;
    private readonly IEscrowRepository _escrowRepository;

    public CartRepository(ProSportDbContext context, IEscrowRepository escrowRepository)
    {
        _context = context;
        _escrowRepository = escrowRepository;
    }

    public async Task<CartItem> AddItemAsync(int userId, int equipmentId, int quantity,
        decimal unitPrice, string? serialNumber = null, int? bookingId = null)
    {
        var existing = await _context.CartItems
            .FirstOrDefaultAsync(ci =>
                ci.UserId == userId &&
                ci.EquipmentId == equipmentId &&
                ci.BookingId == bookingId &&
                !ci.IsDeleted);

        if (existing != null)
        {
            existing.Quantity += quantity;
            existing.UnitPrice = unitPrice; // Update to latest price
            existing.UpdatedAt = DateTime.UtcNow;
            _context.CartItems.Update(existing);
        }
        else
        {
            var cartItem = new CartItem
            {
                UserId = userId,
                EquipmentId = equipmentId,
                Quantity = quantity,
                UnitPrice = unitPrice,
                PreferredSerialNumber = serialNumber,
                BookingId = bookingId,
                CreatedAt = DateTime.UtcNow
            };
            _context.CartItems.Add(cartItem);
            existing = cartItem;
        }

        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task<List<CartItem>> GetUserCartAsync(int userId)
    {
        return await _context.CartItems
            .Where(ci => ci.UserId == userId && !ci.IsDeleted)
            .Include(ci => ci.Equipment)
            .OrderByDescending(ci => ci.CreatedAt)
            .ToListAsync();
    }

    public async Task UpdateItemQuantityAsync(int cartItemId, int newQuantity)
    {
        var item = await _context.CartItems.FindAsync(cartItemId);
        if (item != null && newQuantity > 0)
        {
            item.Quantity = newQuantity;
            item.UpdatedAt = DateTime.UtcNow;
            _context.CartItems.Update(item);
            await _context.SaveChangesAsync();
        }
    }

    public async Task DeleteItemAsync(int cartItemId)
    {
        var item = await _context.CartItems.FindAsync(cartItemId);
        if (item != null)
        {
            item.IsDeleted = true;
            item.UpdatedAt = DateTime.UtcNow;
            _context.CartItems.Update(item);
            await _context.SaveChangesAsync();
        }
    }

    public async Task ClearCartAsync(int userId)
    {
        var items = await _context.CartItems
            .Where(ci => ci.UserId == userId && !ci.IsDeleted)
            .ToListAsync();
        
        foreach (var item in items)
        {
            item.IsDeleted = true;
            item.UpdatedAt = DateTime.UtcNow;
        }
        _context.CartItems.UpdateRange(items);
        await _context.SaveChangesAsync();
    }

    public async Task<CartItem?> GetCartItemAsync(int cartItemId)
    {
        return await _context.CartItems
            .Include(ci => ci.Equipment)
            .FirstOrDefaultAsync(ci => ci.CartItemId == cartItemId && !ci.IsDeleted);
    }

    public async Task CheckoutCartAtomicAsync(int userId, int? bookingId = null)
    {
        await using var tx = await _context.Database.BeginTransactionAsync(System.Data.IsolationLevel.Serializable);
        try
        {
            var query = _context.CartItems
                .Where(ci => ci.UserId == userId && !ci.IsDeleted);

            if (bookingId.HasValue)
                query = query.Where(ci => ci.BookingId == bookingId.Value);

            var items = await query
                .Include(ci => ci.Equipment)
                .ToListAsync();

            if (items.Count == 0)
                throw new InvalidOperationException(bookingId.HasValue
                    ? "Không có sản phẩm nào trong giỏ cho booking này."
                    : "Giỏ hàng trống");

            foreach (var item in items)
            {
                if (item.Equipment == null)
                    throw new InvalidOperationException("Thiết bị trong giỏ không tồn tại.");

                if (item.Equipment.StockQuantity < item.Quantity)
                {
                    var name = item.Equipment.EquipmentName ?? item.Equipment.Name ?? $"#{item.EquipmentId}";
                    throw new InvalidOperationException($"Chỉ còn {item.Equipment.StockQuantity} {name} sẵn sàng");
                }
            }

            var totalAmount = items.Sum(i => i.Quantity * i.UnitPrice);
            var checkoutRef = bookingId.HasValue
                ? $"CartCheckout_B{bookingId}_U{userId}_{Guid.NewGuid():N}"
                : $"CartCheckout_U{userId}_{Guid.NewGuid():N}";
            var paymentDescription = bookingId.HasValue
                ? $"Mua thiết bị gắn booking #{bookingId}"
                : "Thanh toán giỏ hàng thiết bị";

            if (!await _escrowRepository.PayEquipmentPurchaseAsync(
                    userId, totalAmount, bookingId, checkoutRef, paymentDescription))
            {
                throw new InvalidOperationException("Số dư ví không đủ để thanh toán.");
            }

            foreach (var item in items)
            {
                var quantity = item.Quantity;
                var equipmentId = item.EquipmentId;

                if (_context.Database.IsRelational())
                {
                    var rows = await _context.Equipments
                        .Where(e => e.EquipmentId == equipmentId && !e.IsDeleted && e.StockQuantity >= quantity)
                        .ExecuteUpdateAsync(s => s.SetProperty(e => e.StockQuantity, e => e.StockQuantity - quantity));

                    if (rows == 0)
                    {
                        var name = item.Equipment!.EquipmentName ?? item.Equipment.Name ?? $"#{equipmentId}";
                        throw new InvalidOperationException($"Không đủ hàng cho {name}");
                    }
                }
                else
                {
                    var equipment = await _context.Equipments.FirstAsync(e => e.EquipmentId == equipmentId);
                    if (equipment.StockQuantity < quantity)
                    {
                        var name = equipment.EquipmentName ?? equipment.Name ?? $"#{equipmentId}";
                        throw new InvalidOperationException($"Không đủ hàng cho {name}");
                    }

                    equipment.StockQuantity -= quantity;
                }

                item.IsDeleted = true;
                item.UpdatedAt = DateTime.UtcNow;
            }

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
