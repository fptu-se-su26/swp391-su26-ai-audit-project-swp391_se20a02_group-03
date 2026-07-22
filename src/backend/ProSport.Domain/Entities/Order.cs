using System.ComponentModel.DataAnnotations.Schema;

namespace ProSport.Domain.Entities;

/// <summary>
/// Đơn hàng của cửa hàng bán online (thiết bị). Tách biệt hoàn toàn với Booking đặt sân.
/// Phase 1: tạo đơn từ giỏ hàng + thanh toán ví Escrow. Các field vận chuyển (GHN) và
/// thanh toán online (PayOS/COD) dùng ở các phase sau.
/// </summary>
public class Order : BaseEntity
{
    public int OrderId { get; set; }
    public int UserId { get; set; }

    /// <summary>Pending / Paid / Processing / Shipped / Delivered / Cancelled</summary>
    public string Status { get; set; } = "Pending";

    /// <summary>Wallet / PayOS / COD</summary>
    public string PaymentMethod { get; set; } = "Wallet";

    /// <summary>Pending / Paid / Refunded / Cancelled</summary>
    public string PaymentStatus { get; set; } = "Pending";

    [Column(TypeName = "decimal(18,2)")] public decimal Subtotal { get; set; }
    [Column(TypeName = "decimal(18,2)")] public decimal ShippingFee { get; set; }
    [Column(TypeName = "decimal(18,2)")] public decimal TotalAmount { get; set; }

    // ── Địa chỉ giao hàng (chuẩn GHN: mã Tỉnh/Quận + mã Phường) ─────────────
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

    // ── Vận chuyển (Phase 2: GHN) ──────────────────────────────────────────
    public string? ShippingProvider { get; set; }
    public string? TrackingCode { get; set; }
    /// <summary>Pending / Created / Delivering / Delivered / Cancelled</summary>
    public string ShippingStatus { get; set; } = "Pending";

    // ── Thanh toán online (Phase 3: PayOS) ─────────────────────────────────
    public string? PaymentReference { get; set; }

    public User User { get; set; } = null!;
    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}
