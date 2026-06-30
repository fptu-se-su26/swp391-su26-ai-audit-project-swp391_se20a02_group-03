using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProSport.Application.Interfaces;

namespace ProSport.API.Controllers;

// Số liệu tổng quan Dashboard (Admin + Staff Elite).
[Route("api/dashboard")]
[ApiController]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var response = await _dashboardService.GetStatsAsync();
        return StatusCode(response.StatusCode, response);
    }

    [Authorize(Roles = "Admin,Staff")]
    [HttpGet("elite-stats")]
    public async Task<IActionResult> GetEliteStats()
    {
        var response = await _dashboardService.GetEliteStatsAsync();
        return StatusCode(response.StatusCode, response);
    }

    [Authorize(Roles = "Admin,Staff")]
    [HttpGet("schedule")]
    public async Task<IActionResult> GetSchedule([FromQuery] DateTime? date, [FromQuery] string? sport)
    {
        var response = await _dashboardService.GetCourtScheduleAsync(date, sport);
        return StatusCode(response.StatusCode, response);
    }

    [Authorize(Roles = "Admin,Staff")]
    [HttpGet("staff-overview")]
    public async Task<IActionResult> GetStaffOverview()
    {
        var response = await _dashboardService.GetStaffOverviewAsync();
        return StatusCode(response.StatusCode, response);
    }
}
