using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using System.Security.Claims;

namespace ProSport.API.Controllers;

// Quản lý voucher giảm giá (Admin/Staff phát hành, khách xem voucher đang hiệu lực).
[Route("api/vouchers")]
[ApiController]
public class VoucherController : ControllerBase
{
    private readonly IVoucherService _service;

    public VoucherController(IVoucherService service)
    {
        _service = service;
    }

    [Authorize(Roles = "Admin,Staff,EliteStaff")]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _service.GetAllAsync(onlyActive: false);
        return StatusCode(result.StatusCode, result);
    }

    [HttpGet("active")]
    public async Task<IActionResult> GetActive()
    {
        var result = await _service.GetAllAsync(onlyActive: true);
        return StatusCode(result.StatusCode, result);
    }

    [Authorize(Roles = "Admin,Staff,EliteStaff")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _service.GetByIdAsync(id);
        return StatusCode(result.StatusCode, result);
    }

    [Authorize(Roles = "Admin,Staff,EliteStaff")]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateVoucherDto dto)
    {
        int? staffId = int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var uid) ? uid : null;
        var result = await _service.CreateAsync(dto, staffId);
        return StatusCode(result.StatusCode, result);
    }

    [Authorize(Roles = "Admin,Staff,EliteStaff")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateVoucherDto dto)
    {
        var result = await _service.UpdateAsync(id, dto);
        return StatusCode(result.StatusCode, result);
    }

    [Authorize(Roles = "Admin,Staff,EliteStaff")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _service.DeleteAsync(id);
        return StatusCode(result.StatusCode, result);
    }
}
