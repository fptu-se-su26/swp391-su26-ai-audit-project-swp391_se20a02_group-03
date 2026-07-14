using ProSport.Domain.Entities;

namespace ProSport.Application.Interfaces;

/// <summary>
/// Cổng thanh toán online PayOS cho đơn hàng shop. Chưa cấu hình ChecksumKey → mock
/// (trả checkoutUrl giả, webhook chấp nhận ở chế độ mock) để demo không cần tài khoản.
/// </summary>
public interface IPayOsService
{
    bool IsMockMode { get; }

    /// <summary>Tạo link thanh toán PayOS cho đơn (orderCode = OrderId).</summary>
    Task<PayOsLinkResult> CreatePaymentLinkAsync(Order order);

    /// <summary>Xác thực chữ ký webhook PayOS (HMAC-SHA256 checksumKey trên data).</summary>
    bool VerifyWebhookSignature(string rawDataJson, string signature);
}

public record PayOsLinkResult(bool Success, string? CheckoutUrl, string? PaymentLinkId, string? Error);
