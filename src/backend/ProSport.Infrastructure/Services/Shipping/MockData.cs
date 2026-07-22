using ProSport.Application.DTOs;

namespace ProSport.Infrastructure.Services.Shipping;

/// <summary>
/// Dữ liệu địa chỉ mẫu cho chế độ mock (khi chưa cấu hình token GHN). Mã Tỉnh/Quận/Phường
/// mô phỏng theo GHN để FE có thể chọn dropdown và demo luồng đặt hàng.
/// </summary>
internal static class MockData
{
    public static readonly List<ProvinceDto> Provinces = new()
    {
        new() { ProvinceId = 201, ProvinceName = "Hà Nội" },
        new() { ProvinceId = 202, ProvinceName = "TP. Hồ Chí Minh" },
        new() { ProvinceId = 203, ProvinceName = "Đà Nẵng" },
    };

    public static readonly List<DistrictDto> Districts = new()
    {
        // Hà Nội
        new() { DistrictId = 1442, ProvinceId = 201, DistrictName = "Quận Cầu Giấy" },
        new() { DistrictId = 1443, ProvinceId = 201, DistrictName = "Quận Đống Đa" },
        // HCM
        new() { DistrictId = 1451, ProvinceId = 202, DistrictName = "Quận 1" },
        new() { DistrictId = 1452, ProvinceId = 202, DistrictName = "Quận 7" },
        // Đà Nẵng
        new() { DistrictId = 1461, ProvinceId = 203, DistrictName = "Quận Hải Châu" },
    };

    public static readonly List<WardDto> Wards = new()
    {
        new() { WardCode = "21012", DistrictId = 1442, WardName = "Phường Dịch Vọng" },
        new() { WardCode = "21013", DistrictId = 1442, WardName = "Phường Quan Hoa" },
        new() { WardCode = "21112", DistrictId = 1443, WardName = "Phường Láng Hạ" },
        new() { WardCode = "20101", DistrictId = 1451, WardName = "Phường Bến Nghé" },
        new() { WardCode = "20308", DistrictId = 1452, WardName = "Phường Tân Phú" },
        new() { WardCode = "20501", DistrictId = 1461, WardName = "Phường Thạch Thang" },
    };

    /// <summary>Quận nội thành TP lớn → phí ship rẻ hơn (mock).</summary>
    public static readonly HashSet<int> InnerCityDistrictIds = new() { 1442, 1443, 1451, 1452, 1461 };
}
