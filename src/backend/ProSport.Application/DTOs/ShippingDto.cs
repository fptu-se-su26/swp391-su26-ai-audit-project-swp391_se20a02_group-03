namespace ProSport.Application.DTOs;

public class ProvinceDto
{
    public int ProvinceId { get; set; }
    public string ProvinceName { get; set; } = string.Empty;
}

public class DistrictDto
{
    public int DistrictId { get; set; }
    public int ProvinceId { get; set; }
    public string DistrictName { get; set; } = string.Empty;
}

public class WardDto
{
    public string WardCode { get; set; } = string.Empty;
    public int DistrictId { get; set; }
    public string WardName { get; set; } = string.Empty;
}

public class ShippingFeeRequestDto
{
    public int DistrictId { get; set; }
    public string WardCode { get; set; } = string.Empty;
    public int WeightGrams { get; set; } = 1000;
}

public class ShippingFeeDto
{
    public decimal Fee { get; set; }
    public bool Mock { get; set; }
}

/// <summary>Kết quả tạo vận đơn ở hãng ship.</summary>
public record ShipmentResult(bool Success, string? TrackingCode, decimal Fee, string? Error);
