using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using System.Security.Claims;

namespace ProSport.API.Controllers;

// Khiếu nại / báo cáo người chơi. Khách gửi, Admin/Staff xử lý.
[Route("api/reports")]
[ApiController]
public class ReportController : ControllerBase
{
    private readonly IReportService _service;

    public ReportController(IReportService service)
    {
        _service = service;
    }

    private int? CurrentUserId()
        => int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var uid) ? uid : null;

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateReportDto dto)
    {
        var uid = CurrentUserId();
        if (uid is null) return Unauthorized(new ApiResponseDto<object>(401, "Unauthorized"));

        var result = await _service.CreateAsync(uid.Value, dto);
        return StatusCode(result.StatusCode, result);
    }

    [Authorize]
    [HttpGet("my-reports")]
    public async Task<IActionResult> GetMine()
    {
        var uid = CurrentUserId();
        if (uid is null) return Unauthorized(new ApiResponseDto<object>(401, "Unauthorized"));

        var result = await _service.GetMyReportsAsync(uid.Value);
        return StatusCode(result.StatusCode, result);
    }

    [Authorize(Roles = "Admin,Staff,EliteStaff")]
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? status)
    {
        var result = await _service.GetAllAsync(status);
        return StatusCode(result.StatusCode, result);
    }

    [Authorize(Roles = "Admin,Staff,EliteStaff")]
    [HttpPut("{id}/resolve")]
    public async Task<IActionResult> Resolve(int id, [FromBody] ResolveReportDto dto)
    {
        var uid = CurrentUserId();
        if (uid is null) return Unauthorized(new ApiResponseDto<object>(401, "Unauthorized"));

        var result = await _service.ResolveAsync(id, uid.Value, dto);
        return StatusCode(result.StatusCode, result);
    }
}
