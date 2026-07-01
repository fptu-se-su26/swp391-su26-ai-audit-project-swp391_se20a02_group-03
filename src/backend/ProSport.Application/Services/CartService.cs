using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using ProSport.Domain.Entities;

namespace ProSport.Application.Services;

public class CartService : ICartService
{
    private readonly ICartRepository _cartRepository;
    private readonly IEquipmentRepository _equipmentRepository;
    private readonly IBookingRepository _bookingRepository;

    public CartService(
        ICartRepository cartRepository,
        IEquipmentRepository equipmentRepository,
        IBookingRepository bookingRepository)
    {
        _cartRepository = cartRepository;
        _equipmentRepository = equipmentRepository;
        _bookingRepository = bookingRepository;
    }

    public async Task<CartItemDto> AddToCartAsync(int userId, int equipmentId, int quantity, int? bookingId = null)
    {
        var equipment = await _equipmentRepository.GetByIdAsync(equipmentId);
        if (equipment == null)
            throw new Exception("Equipment not found");

        if (equipment.StockQuantity < quantity)
            throw new Exception($"Chỉ có {equipment.StockQuantity} {equipment.EquipmentName} sẵn sàng");

        var unitPrice = equipment.RetailPrice;

        var cartItem = await _cartRepository.AddItemAsync(userId, equipmentId, quantity, unitPrice, null, bookingId);
        
        return new CartItemDto
        {
            CartItemId = cartItem.CartItemId,
            EquipmentId = cartItem.EquipmentId,
            EquipmentName = equipment.EquipmentName,
            Quantity = cartItem.Quantity,
            UnitPrice = cartItem.UnitPrice,
            BookingId = cartItem.BookingId,
            ImageUrl = equipment.ImageUrl
        };
    }

    public async Task<CartSummaryDto> GetCartAsync(int userId)
    {
        var items = await _cartRepository.GetUserCartAsync(userId);
        
        var cartDtos = items.Select(ci => new CartItemDto
        {
            CartItemId = ci.CartItemId,
            EquipmentId = ci.EquipmentId,
            EquipmentName = ci.Equipment.EquipmentName,
            Quantity = ci.Quantity,
            UnitPrice = ci.UnitPrice,
            BookingId = ci.BookingId,
            ImageUrl = ci.Equipment.ImageUrl
        }).ToList();

        var totalPrice = cartDtos.Sum(ci => ci.TotalPrice);

        return new CartSummaryDto
        {
            TotalItems = items.Count,
            Items = cartDtos,
            TotalPrice = totalPrice
        };
    }

    public async Task UpdateQuantityAsync(int userId, int cartItemId, int newQuantity)
    {
        if (newQuantity <= 0)
            throw new Exception("Quantity must be > 0");

        var cartItem = await _cartRepository.GetCartItemAsync(cartItemId);
        if (cartItem == null || cartItem.UserId != userId)
            throw new Exception("Cart item not found");

        if (cartItem.Equipment.StockQuantity < newQuantity)
            throw new Exception($"Chỉ còn {cartItem.Equipment.StockQuantity} {cartItem.Equipment.EquipmentName} sẵn sàng");

        await _cartRepository.UpdateItemQuantityAsync(cartItemId, newQuantity);
    }

    public async Task RemoveFromCartAsync(int userId, int cartItemId)
    {
        var cartItem = await _cartRepository.GetCartItemAsync(cartItemId);
        if (cartItem == null || cartItem.UserId != userId)
            throw new Exception("Cart item not found");

        await _cartRepository.DeleteItemAsync(cartItemId);
    }

    public async Task ClearCartAsync(int userId)
    {
        await _cartRepository.ClearCartAsync(userId);
    }

    public async Task<bool> CheckoutAsync(int userId, int? bookingId = null)
    {
        if (bookingId.HasValue)
        {
            var booking = await _bookingRepository.GetByIdAsync(bookingId.Value);
            if (booking == null)
                throw new InvalidOperationException("Không tìm thấy booking.");
            if (booking.UserId != userId)
                throw new UnauthorizedAccessException("Bạn không có quyền checkout cho booking này.");
        }

        await _cartRepository.CheckoutCartAtomicAsync(userId, bookingId);
        return true;
    }
}
