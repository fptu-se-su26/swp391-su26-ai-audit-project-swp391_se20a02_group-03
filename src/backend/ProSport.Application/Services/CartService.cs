using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using ProSport.Domain.Entities;

namespace ProSport.Application.Services;

public class CartService : ICartService
{
    private readonly ICartRepository _cartRepository;
    private readonly IEquipmentRepository _equipmentRepository;
    private readonly IEquipmentService _equipmentService;

    public CartService(
        ICartRepository cartRepository, 
        IEquipmentRepository equipmentRepository,
        IEquipmentService equipmentService)
    {
        _cartRepository = cartRepository;
        _equipmentRepository = equipmentRepository;
        _equipmentService = equipmentService;
    }

    public async Task<CartItemDto> AddToCartAsync(int userId, int equipmentId, int quantity, int? bookingId = null)
    {
        var equipment = await _equipmentRepository.GetByIdAsync(equipmentId);
        if (equipment == null)
            throw new Exception("Equipment not found");

        // Kiểm tra số lượng available
        var availableUnits = await _equipmentRepository.GetAvailableUnitsForEquipmentAsync(equipmentId);
        if (availableUnits.Count() < quantity)
            throw new Exception($"Chỉ có {availableUnits.Count()} {equipment.EquipmentName} sẵn sàng");

        // Tính giá: có booking thì giá thường, không có thì surcharge 30%
        var unitPrice = bookingId.HasValue ? equipment.RentalPrice : (equipment.RentalPrice * 1.3m);

        var cartItem = await _cartRepository.AddItemAsync(userId, equipmentId, quantity, unitPrice, null, bookingId);
        
        return new CartItemDto
        {
            CartItemId = cartItem.CartItemId,
            EquipmentId = cartItem.EquipmentId,
            EquipmentName = equipment.EquipmentName,
            Quantity = cartItem.Quantity,
            UnitPrice = cartItem.UnitPrice,
            PreferredSerialNumber = cartItem.PreferredSerialNumber,
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
            PreferredSerialNumber = ci.PreferredSerialNumber,
            BookingId = ci.BookingId,
            ImageUrl = ci.Equipment.ImageUrl
        }).ToList();

        var totalRentalPrice = cartDtos.Sum(ci => ci.TotalPrice);
        var totalDepositAmount = items.Sum(ci => ci.Equipment.RetailPrice * ci.Quantity * 0.2m); // 20% per item

        return new CartSummaryDto
        {
            TotalItems = items.Count,
            Items = cartDtos,
            TotalRentalPrice = totalRentalPrice,
            TotalDepositAmount = totalDepositAmount
        };
    }

    public async Task UpdateQuantityAsync(int userId, int cartItemId, int newQuantity)
    {
        if (newQuantity <= 0)
            throw new Exception("Quantity must be > 0");

        var cartItem = await _cartRepository.GetCartItemAsync(cartItemId);
        if (cartItem == null || cartItem.UserId != userId)
            throw new Exception("Cart item not found");

        var availableUnits = await _equipmentRepository.GetAvailableUnitsForEquipmentAsync(cartItem.EquipmentId);
        if (availableUnits.Count() < newQuantity)
            throw new Exception($"Chỉ còn {availableUnits.Count()} {cartItem.Equipment.EquipmentName} sẵn sàng");

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
        var items = await _cartRepository.GetUserCartAsync(userId);
        if (!items.Any())
            throw new Exception("Giỏ hàng trống");

        foreach (var item in items)
        {
            // Duyệt số lượng để tạo từng bản ghi thuê (do unit-level tracking)
            for (int i = 0; i < item.Quantity; i++)
            {
                var rentRequest = new RentEquipmentRequest
                {
                    EquipmentId = item.EquipmentId,
                    Quantity = 1,
                    BookingId = bookingId ?? item.BookingId
                };

                var result = await _equipmentService.RentAsync(userId, rentRequest);
                if (result.StatusCode != 200)
                {
                    throw new Exception($"Lỗi khi thuê {item.Equipment.EquipmentName}: {result.Message}");
                }
            }
        }

        await _cartRepository.ClearCartAsync(userId);
        return true;
    }
}
