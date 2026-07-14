using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using ProSport.Domain.Entities;

namespace ProSport.Infrastructure.Services.Shipping;

/// <summary>
/// Tích hợp Giao Hàng Nhanh (GHN). Nếu chưa cấu hình <c>Ghn:Token</c> → chạy mock
/// (địa chỉ mẫu + phí theo vùng + mã vận đơn giả) để demo end-to-end mà không cần tài khoản.
/// Khi có token thật, tự động gọi API GHN (endpoints /master-data, /v2/shipping-order).
/// </summary>
public class GhnShippingService : IShippingService
{
    private readonly HttpClient _http;
    private readonly ILogger<GhnShippingService> _logger;
    private readonly string? _token;
    private readonly string? _shopId;
    private readonly int _fromDistrictId;

    public GhnShippingService(HttpClient http, IConfiguration config, ILogger<GhnShippingService> logger)
    {
        _http = http;
        _logger = logger;
        _token = config["Ghn:Token"] ?? Environment.GetEnvironmentVariable("GHN_TOKEN");
        _shopId = config["Ghn:ShopId"] ?? Environment.GetEnvironmentVariable("GHN_SHOP_ID");
        _fromDistrictId = int.TryParse(config["Ghn:FromDistrictId"], out var d) ? d : 1442;
        var baseUrl = config["Ghn:BaseUrl"] ?? "https://dev-online-gateway.ghn.vn/shiip/public-api/";
        if (!baseUrl.EndsWith('/')) baseUrl += "/";
        _http.BaseAddress ??= new Uri(baseUrl);
        if (!string.IsNullOrWhiteSpace(_token) && !_http.DefaultRequestHeaders.Contains("Token"))
            _http.DefaultRequestHeaders.Add("Token", _token);
    }

    public bool IsMockMode => string.IsNullOrWhiteSpace(_token);

    // ── Master data ─────────────────────────────────────────────────────────
    public async Task<List<ProvinceDto>> GetProvincesAsync()
    {
        if (IsMockMode) return MockData.Provinces;
        try
        {
            var res = await _http.GetFromJsonAsync<GhnListResponse<GhnProvince>>("master-data/province");
            return res?.Data?.Select(p => new ProvinceDto { ProvinceId = p.ProvinceID, ProvinceName = p.ProvinceName }).ToList()
                   ?? MockData.Provinces;
        }
        catch (Exception ex) { _logger.LogWarning(ex, "GHN province fallback to mock"); return MockData.Provinces; }
    }

    public async Task<List<DistrictDto>> GetDistrictsAsync(int provinceId)
    {
        if (IsMockMode) return MockData.Districts.Where(d => d.ProvinceId == provinceId).ToList();
        try
        {
            var res = await _http.PostAsJsonAsync("master-data/district", new { province_id = provinceId });
            var body = await res.Content.ReadFromJsonAsync<GhnListResponse<GhnDistrict>>();
            return body?.Data?.Select(d => new DistrictDto { DistrictId = d.DistrictID, ProvinceId = d.ProvinceID, DistrictName = d.DistrictName }).ToList()
                   ?? new();
        }
        catch (Exception ex) { _logger.LogWarning(ex, "GHN district fallback to mock"); return MockData.Districts.Where(d => d.ProvinceId == provinceId).ToList(); }
    }

    public async Task<List<WardDto>> GetWardsAsync(int districtId)
    {
        if (IsMockMode) return MockData.Wards.Where(w => w.DistrictId == districtId).ToList();
        try
        {
            var res = await _http.PostAsJsonAsync("master-data/ward", new { district_id = districtId });
            var body = await res.Content.ReadFromJsonAsync<GhnListResponse<GhnWard>>();
            return body?.Data?.Select(w => new WardDto { WardCode = w.WardCode, DistrictId = w.DistrictID, WardName = w.WardName }).ToList()
                   ?? new();
        }
        catch (Exception ex) { _logger.LogWarning(ex, "GHN ward fallback to mock"); return MockData.Wards.Where(w => w.DistrictId == districtId).ToList(); }
    }

    // ── Phí ship ────────────────────────────────────────────────────────────
    public async Task<decimal> CalculateFeeAsync(int toDistrictId, string toWardCode, int weightGrams = 1000)
    {
        if (IsMockMode) return MockFee(toDistrictId, weightGrams);
        try
        {
            var payload = new
            {
                from_district_id = _fromDistrictId,
                service_type_id = 2,
                to_district_id = toDistrictId,
                to_ward_code = toWardCode,
                weight = weightGrams,
                length = 20, width = 20, height = 10
            };
            var req = new HttpRequestMessage(HttpMethod.Post, "v2/shipping-order/fee") { Content = JsonContent.Create(payload) };
            if (!string.IsNullOrWhiteSpace(_shopId)) req.Headers.Add("ShopId", _shopId);
            var res = await _http.SendAsync(req);
            var body = await res.Content.ReadFromJsonAsync<GhnFeeResponse>();
            return body?.Data?.Total ?? MockFee(toDistrictId, weightGrams);
        }
        catch (Exception ex) { _logger.LogWarning(ex, "GHN fee fallback to mock"); return MockFee(toDistrictId, weightGrams); }
    }

    // ── Tạo vận đơn ─────────────────────────────────────────────────────────
    public async Task<ShipmentResult> CreateShipmentAsync(Order order, int weightGrams = 1000)
    {
        if (IsMockMode)
        {
            var code = $"GHN-MOCK-{Guid.NewGuid().ToString("N")[..10].ToUpper()}";
            return new ShipmentResult(true, code, order.ShippingFee, null);
        }
        try
        {
            var payload = new
            {
                to_name = order.RecipientName,
                to_phone = order.RecipientPhone,
                to_address = order.AddressDetail,
                to_ward_code = order.WardCode,
                to_district_id = order.DistrictId,
                weight = weightGrams,
                service_type_id = 2,
                payment_type_id = order.PaymentMethod == "COD" ? 2 : 1,
                required_note = "CHOXEMHANGKHONGTHU",
                items = order.Items.Select(i => new { name = i.EquipmentName, quantity = i.Quantity, price = (int)i.UnitPrice }).ToArray()
            };
            var req = new HttpRequestMessage(HttpMethod.Post, "v2/shipping-order/create") { Content = JsonContent.Create(payload) };
            if (!string.IsNullOrWhiteSpace(_shopId)) req.Headers.Add("ShopId", _shopId);
            var res = await _http.SendAsync(req);
            var body = await res.Content.ReadFromJsonAsync<GhnCreateResponse>();
            if (body?.Data?.OrderCode is { Length: > 0 } trackingCode)
                return new ShipmentResult(true, trackingCode, body.Data.TotalFee, null);
            return new ShipmentResult(false, null, order.ShippingFee, "GHN không trả về mã vận đơn.");
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "GHN create shipment failed for order {OrderId}", order.OrderId);
            return new ShipmentResult(false, null, order.ShippingFee, ex.Message);
        }
    }

    // Phí mock: nội thành các TP lớn rẻ hơn, tỉnh xa cao hơn; +5k mỗi 1kg vượt.
    private static decimal MockFee(int districtId, int weightGrams)
    {
        var baseFee = MockData.InnerCityDistrictIds.Contains(districtId) ? 20000m : 35000m;
        var extraKg = Math.Max(0, (weightGrams - 1000) / 1000);
        return baseFee + extraKg * 5000m;
    }

    // ── GHN response shapes ─────────────────────────────────────────────────
    private sealed class GhnListResponse<T> { public List<T>? Data { get; set; } }
    private sealed class GhnProvince { public int ProvinceID { get; set; } public string ProvinceName { get; set; } = ""; }
    private sealed class GhnDistrict { public int DistrictID { get; set; } public int ProvinceID { get; set; } public string DistrictName { get; set; } = ""; }
    private sealed class GhnWard { public string WardCode { get; set; } = ""; public int DistrictID { get; set; } public string WardName { get; set; } = ""; }
    private sealed class GhnFeeResponse { public GhnFeeData? Data { get; set; } }
    private sealed class GhnFeeData { public decimal Total { get; set; } }
    private sealed class GhnCreateResponse { public GhnCreateData? Data { get; set; } }
    private sealed class GhnCreateData
    {
        [System.Text.Json.Serialization.JsonPropertyName("order_code")] public string OrderCode { get; set; } = "";
        [System.Text.Json.Serialization.JsonPropertyName("total_fee")] public decimal TotalFee { get; set; }
    }
}
