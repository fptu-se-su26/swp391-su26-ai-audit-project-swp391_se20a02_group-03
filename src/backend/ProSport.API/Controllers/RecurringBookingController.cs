using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using System.Security.Claims;

namespace ProSport.API.Controllers;

[Route("api/recurring-bookings")]
[ApiController]
[Authorize]
public class RecurringBookingController : ControllerBase
{
    private readonly IRecurringBookingService _recurring;

    public RecurringBookingController(IRecurringBookingService recurring) => _recurring = recurring;

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateRecurringRuleDto dto)
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(claim) || !int.TryParse(claim, out var userId))
            return Unauthorized(new ApiResponseDto<object>(401, "Unauthorized"));

        var response = await _recurring.CreateRuleAsync(userId, dto);
        return StatusCode(response.StatusCode, response);
    }

    [HttpGet("my-rules")]
    public async Task<IActionResult> GetMyRules()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(claim) || !int.TryParse(claim, out var userId))
            return Unauthorized(new ApiResponseDto<object>(401, "Unauthorized"));

        var response = await _recurring.GetUserRulesAsync(userId);
        return StatusCode(response.StatusCode, response);
    }

    [HttpDelete("{ruleId}")]
    public async Task<IActionResult> Cancel(int ruleId)
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(claim) || !int.TryParse(claim, out var userId))
            return Unauthorized(new ApiResponseDto<object>(401, "Unauthorized"));

        var response = await _recurring.CancelRuleAsync(userId, ruleId);
        return StatusCode(response.StatusCode, response);
    }
}
