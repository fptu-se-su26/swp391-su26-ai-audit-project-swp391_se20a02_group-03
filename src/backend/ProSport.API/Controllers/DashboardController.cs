using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProSport.Application.Interfaces;

namespace ProSport.API.Controllers;

// Số liệu tổng quan cho Admin Dashboard.
[Route("api/dashboard")]
[ApiController]
[Authorize(Roles = "Admin")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var response = await _dashboardService.GetStatsAsync();
        return StatusCode(response.StatusCode, response);
    }
}
