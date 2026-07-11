using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;

namespace ProSport.API.Controllers;

// E-KYC: Customer nộp hồ sơ (submit/me) — Admin phê duyệt (list/approve/reject).
// UC-C02 + UC-A03: mở khóa Ví Escrow & quyền Host kèo.
[Route("api/kyc")]
[ApiController]
[Authorize]
public class KycController : ControllerBase
{
    private readonly IEkycService _service;

    public KycController(IEkycService service)
    {
        _service = service;
    }

    private int? CurrentUserId =>
        int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : null;

    // TK-004: Customer nộp hồ sơ E-KYC (ảnh upload trước qua POST /api/upload/image, folder "ekyc").
    [HttpPost("submit")]
    public async Task<IActionResult> Submit([FromBody] SubmitEkycDto dto)
    {
        if (CurrentUserId is not int userId)
            return Unauthorized(new ApiResponseDto<object>(401, "Phiên đăng nhập không hợp lệ."));

        var result = await _service.SubmitAsync(userId, dto);
        return StatusCode(result.StatusCode, result);
    }

    // TK-004: Customer xem trạng thái hồ sơ E-KYC của mình.
    [HttpGet("me")]
    public async Task<IActionResult> GetMine()
    {
        if (CurrentUserId is not int userId)
            return Unauthorized(new ApiResponseDto<object>(401, "Phiên đăng nhập không hợp lệ."));

        var result = await _service.GetMineAsync(userId);
        return StatusCode(result.StatusCode, result);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? status)
    {
        var result = await _service.GetAllAsync(status);
        return StatusCode(result.StatusCode, result);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _service.GetByIdAsync(id);
        return StatusCode(result.StatusCode, result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}/approve")]
    public async Task<IActionResult> Approve(int id)
    {
        var result = await _service.ApproveAsync(id);
        return StatusCode(result.StatusCode, result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}/reject")]
    public async Task<IActionResult> Reject(int id, [FromBody] RejectKycDto dto)
    {
        var result = await _service.RejectAsync(id, dto.Reason);
        return StatusCode(result.StatusCode, result);
    }
}
