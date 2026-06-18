namespace ProSport.Application.DTOs;

public class CartItemDto
{
    public int CartItemId { get; set; }
    public int EquipmentId { get; set; }
    public string EquipmentName { get; set; } = null!;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice => UnitPrice * Quantity;
    public string? PreferredSerialNumber { get; set; }
    public int? BookingId { get; set; }
    public string? ImageUrl { get; set; }
}

public class CartSummaryDto
{
    public int TotalItems { get; set; }
    public List<CartItemDto> Items { get; set; } = new();
    public decimal TotalRentalPrice { get; set; }
    public decimal TotalDepositAmount { get; set; }
    public decimal GrandTotal => TotalRentalPrice + TotalDepositAmount;
}

public class AddToCartRequest
{
    public int EquipmentId { get; set; }
    public int Quantity { get; set; }
    public int? BookingId { get; set; }
}

public class UpdateCartItemRequest
{
    public int Quantity { get; set; }
}
