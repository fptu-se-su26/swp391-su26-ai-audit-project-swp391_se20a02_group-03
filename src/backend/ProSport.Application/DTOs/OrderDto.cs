namespace ProSport.Application.DTOs;

/// <summary>Yêu cầu tạo đơn hàng shop từ giỏ hàng (checkout).</summary>
public class CreateOrderDto
{
    /// <summary>Wallet / PayOS / COD (Phase 1 chỉ hỗ trợ Wallet).</summary>
    public string PaymentMethod { get; set; } = "Wallet";

    // Địa chỉ giao hàng — bắt buộc
    public string RecipientName { get; set; } = string.Empty;
    public string RecipientPhone { get; set; } = string.Empty;
    public int ProvinceId { get; set; }
    public string ProvinceName { get; set; } = string.Empty;
    public int DistrictId { get; set; }
    public string DistrictName { get; set; } = string.Empty;
    public string WardCode { get; set; } = string.Empty;
    public string WardName { get; set; } = string.Empty;
    public string AddressDetail { get; set; } = string.Empty;
    public string? Note { get; set; }
}

public class OrderItemDto
{
    public int OrderItemId { get; set; }
    public int EquipmentId { get; set; }
    public string EquipmentName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal LineTotal { get; set; }
}

public class OrderDto
{
    public int OrderId { get; set; }
    public int UserId { get; set; }
    public string Status { get; set; } = string.Empty;
    public string PaymentMethod { get; set; } = string.Empty;
    public string PaymentStatus { get; set; } = string.Empty;
    public decimal Subtotal { get; set; }
    public decimal ShippingFee { get; set; }
    public decimal TotalAmount { get; set; }

    public string RecipientName { get; set; } = string.Empty;
    public string RecipientPhone { get; set; } = string.Empty;
    public string ProvinceName { get; set; } = string.Empty;
    public string DistrictName { get; set; } = string.Empty;
    public string WardName { get; set; } = string.Empty;
    public string AddressDetail { get; set; } = string.Empty;
    public string? Note { get; set; }

    public string? ShippingProvider { get; set; }
    public string? TrackingCode { get; set; }
    public string ShippingStatus { get; set; } = string.Empty;
    public string? PaymentReference { get; set; }

    public DateTime CreatedAt { get; set; }
    public List<OrderItemDto> Items { get; set; } = new();

    /// <summary>Chỉ có khi thanh toán PayOS: URL để khách chuyển tới trang thanh toán.</summary>
    public string? PaymentUrl { get; set; }
}
