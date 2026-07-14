using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;

namespace ProSport.API.Controllers;

// Địa chỉ hành chính (GHN) + báo giá phí ship cho trang checkout cửa hàng.
[Route("api/shipping")]
[ApiController]
[Authorize]
public class ShippingController : ControllerBase
{
    private readonly IShippingService _shipping;

    public ShippingController(IShippingService shipping)
    {
        _shipping = shipping;
    }

    [HttpGet("provinces")]
    public async Task<IActionResult> GetProvinces()
        => Ok(new ApiResponseDto<List<ProvinceDto>>(200, "Success", await _shipping.GetProvincesAsync()));

    [HttpGet("districts")]
    public async Task<IActionResult> GetDistricts([FromQuery] int provinceId)
        => Ok(new ApiResponseDto<List<DistrictDto>>(200, "Success", await _shipping.GetDistrictsAsync(provinceId)));

    [HttpGet("wards")]
    public async Task<IActionResult> GetWards([FromQuery] int districtId)
        => Ok(new ApiResponseDto<List<WardDto>>(200, "Success", await _shipping.GetWardsAsync(districtId)));

    [HttpPost("fee")]
    public async Task<IActionResult> GetFee([FromBody] ShippingFeeRequestDto dto)
    {
        var fee = await _shipping.CalculateFeeAsync(dto.DistrictId, dto.WardCode, dto.WeightGrams);
        return Ok(new ApiResponseDto<ShippingFeeDto>(200, "Success", new ShippingFeeDto { Fee = fee, Mock = _shipping.IsMockMode }));
    }
}
