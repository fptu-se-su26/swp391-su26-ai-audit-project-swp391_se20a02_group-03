using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;

namespace ProSport.API.Controllers;

// Phê duyệt E-KYC (chỉ Admin). UC-A: mở khóa Ví Escrow & quyền Host kèo.
[Route("api/kyc")]
[ApiController]
[Authorize(Roles = "Admin")]
public class KycController : ControllerBase
{
    private readonly IEkycService _service;

    public KycController(IEkycService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? status)
    {
        var result = await _service.GetAllAsync(status);
        return StatusCode(result.StatusCode, result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _service.GetByIdAsync(id);
        return StatusCode(result.StatusCode, result);
    }

    [HttpPut("{id}/approve")]
    public async Task<IActionResult> Approve(int id)
    {
        var result = await _service.ApproveAsync(id);
        return StatusCode(result.StatusCode, result);
    }

    [HttpPut("{id}/reject")]
    public async Task<IActionResult> Reject(int id, [FromBody] RejectKycDto dto)
    {
        var result = await _service.RejectAsync(id, dto.Reason);
        return StatusCode(result.StatusCode, result);
    }
}
