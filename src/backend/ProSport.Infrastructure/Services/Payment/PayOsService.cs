using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using ProSport.Application.Interfaces;
using ProSport.Domain.Entities;

namespace ProSport.Infrastructure.Services.Payment;

/// <summary>
/// Tích hợp PayOS cho thanh toán đơn hàng shop (KHÔNG đụng VNPay của đặt sân/ví).
/// Thiếu ChecksumKey → mock (checkoutUrl giả + webhook chấp nhận). Có key thật → gọi API PayOS.
/// </summary>
public class PayOsService : IPayOsService
{
    private readonly HttpClient _http;
    private readonly ILogger<PayOsService> _logger;
    private readonly string? _clientId;
    private readonly string? _apiKey;
    private readonly string? _checksumKey;
    private readonly string _returnUrl;
    private readonly string _cancelUrl;

    public PayOsService(HttpClient http, IConfiguration config, ILogger<PayOsService> logger)
    {
        _http = http;
        _logger = logger;
        _clientId = config["PayOS:ClientId"] ?? Environment.GetEnvironmentVariable("PAYOS_CLIENT_ID");
        _apiKey = config["PayOS:ApiKey"] ?? Environment.GetEnvironmentVariable("PAYOS_API_KEY");
        _checksumKey = config["PayOS:ChecksumKey"] ?? Environment.GetEnvironmentVariable("PAYOS_CHECKSUM_KEY");
        _returnUrl = config["PayOS:ReturnUrl"] ?? "http://localhost:5173/shop/orders";
        _cancelUrl = config["PayOS:CancelUrl"] ?? "http://localhost:5173/shop/cart";
        var baseUrl = config["PayOS:BaseUrl"] ?? "https://api-merchant.payos.vn/";
        if (!baseUrl.EndsWith('/')) baseUrl += "/";
        _http.BaseAddress ??= new Uri(baseUrl);
    }

    public bool IsMockMode => string.IsNullOrWhiteSpace(_checksumKey) || string.IsNullOrWhiteSpace(_clientId);

    public async Task<PayOsLinkResult> CreatePaymentLinkAsync(Order order)
    {
        var amount = (int)order.TotalAmount;
        var description = $"Don hang #{order.OrderId}";

        if (IsMockMode)
        {
            // Link mock: người test mở URL này để giả lập trang thanh toán PayOS.
            var mockUrl = $"{_returnUrl}?orderCode={order.OrderId}&amount={amount}&mock=1";
            return new PayOsLinkResult(true, mockUrl, $"PAYOS-MOCK-{order.OrderId}", null);
        }

        try
        {
            // Chữ ký PayOS: HMAC-SHA256(checksumKey) trên chuỗi field theo thứ tự cố định.
            var signatureData = $"amount={amount}&cancelUrl={_cancelUrl}&description={description}&orderCode={order.OrderId}&returnUrl={_returnUrl}";
            var signature = HmacHex(signatureData, _checksumKey!);

            var payload = new
            {
                orderCode = order.OrderId,
                amount,
                description,
                cancelUrl = _cancelUrl,
                returnUrl = _returnUrl,
                signature,
                items = order.Items.Select(i => new { name = i.EquipmentName, quantity = i.Quantity, price = (int)i.UnitPrice }).ToArray()
            };

            var req = new HttpRequestMessage(HttpMethod.Post, "v2/payment-requests")
            {
                Content = JsonContent.Create(payload)
            };
            req.Headers.Add("x-client-id", _clientId);
            req.Headers.Add("x-api-key", _apiKey);

            var res = await _http.SendAsync(req);
            var body = await res.Content.ReadFromJsonAsync<PayOsCreateResponse>();
            if (body?.Data?.CheckoutUrl is { Length: > 0 } url)
                return new PayOsLinkResult(true, url, body.Data.PaymentLinkId, null);

            return new PayOsLinkResult(false, null, null, body?.Desc ?? "PayOS không trả về checkoutUrl.");
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "PayOS create link failed for order {OrderId}", order.OrderId);
            return new PayOsLinkResult(false, null, null, ex.Message);
        }
    }

    public bool VerifyWebhookSignature(string rawDataJson, string signature)
    {
        // Mock: chấp nhận (demo). Thật: HMAC-SHA256 checksumKey trên data đã sắp xếp khóa.
        if (IsMockMode) return true;
        if (string.IsNullOrWhiteSpace(signature)) return false;
        var expected = HmacHex(rawDataJson, _checksumKey!);
        return CryptographicOperations.FixedTimeEquals(
            Encoding.UTF8.GetBytes(expected), Encoding.UTF8.GetBytes(signature));
    }

    private static string HmacHex(string data, string key)
    {
        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(key));
        var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(data));
        return Convert.ToHexString(hash).ToLowerInvariant();
    }

    private sealed class PayOsCreateResponse
    {
        public string? Code { get; set; }
        public string? Desc { get; set; }
        public PayOsCreateData? Data { get; set; }
    }
    private sealed class PayOsCreateData
    {
        [System.Text.Json.Serialization.JsonPropertyName("checkoutUrl")] public string CheckoutUrl { get; set; } = "";
        [System.Text.Json.Serialization.JsonPropertyName("paymentLinkId")] public string PaymentLinkId { get; set; } = "";
    }
}
