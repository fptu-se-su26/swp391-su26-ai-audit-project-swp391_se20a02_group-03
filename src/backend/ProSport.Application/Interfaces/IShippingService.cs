using ProSport.Application.DTOs;
using ProSport.Domain.Entities;

namespace ProSport.Application.Interfaces;

/// <summary>
/// Cổng giao vận bên thứ ba (GHN). Khi chưa cấu hình token → chạy chế độ mock
/// (dữ liệu địa chỉ + phí + mã vận đơn giả) để demo; có token thật thì gọi API GHN.
/// </summary>
public interface IShippingService
{
    bool IsMockMode { get; }

    Task<List<ProvinceDto>> GetProvincesAsync();
    Task<List<DistrictDto>> GetDistrictsAsync(int provinceId);
    Task<List<WardDto>> GetWardsAsync(int districtId);

    Task<decimal> CalculateFeeAsync(int toDistrictId, string toWardCode, int weightGrams = 1000);
    Task<ShipmentResult> CreateShipmentAsync(Order order, int weightGrams = 1000);
}
