using Microsoft.EntityFrameworkCore;
using ProSport.Application.Interfaces;
using ProSport.Domain.Entities;
using ProSport.Infrastructure.Data;

namespace ProSport.Infrastructure.Repositories;

public class CartRepository : ICartRepository
{
    private readonly ProSportDbContext _context;

    public CartRepository(ProSportDbContext context) => _context = context;

    public async Task<CartItem> AddItemAsync(int userId, int equipmentId, int quantity,
        decimal unitPrice, string? serialNumber = null, int? bookingId = null)
    {
        var existing = await _context.CartItems
            .FirstOrDefaultAsync(ci => ci.UserId == userId && ci.EquipmentId == equipmentId && !ci.IsDeleted);

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
}
