using ProSport.Domain.Entities;

namespace ProSport.Application.Interfaces;

public interface ICartRepository
{
    Task<CartItem> AddItemAsync(int userId, int equipmentId, int quantity, 
        decimal unitPrice, string? serialNumber = null, int? bookingId = null);
    Task<List<CartItem>> GetUserCartAsync(int userId);
    Task UpdateItemQuantityAsync(int cartItemId, int newQuantity);
    Task DeleteItemAsync(int cartItemId);
    Task ClearCartAsync(int userId);
    Task<CartItem?> GetCartItemAsync(int cartItemId);
}
