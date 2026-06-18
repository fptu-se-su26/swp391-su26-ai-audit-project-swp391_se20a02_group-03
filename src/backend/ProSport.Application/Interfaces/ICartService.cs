using ProSport.Application.DTOs;

namespace ProSport.Application.Interfaces;

public interface ICartService
{
    Task<CartItemDto> AddToCartAsync(int userId, int equipmentId, int quantity, int? bookingId = null);
    Task<CartSummaryDto> GetCartAsync(int userId);
    Task UpdateQuantityAsync(int userId, int cartItemId, int newQuantity);
    Task RemoveFromCartAsync(int userId, int cartItemId);
    Task ClearCartAsync(int userId);
    Task<bool> CheckoutAsync(int userId, int? bookingId = null);
}
