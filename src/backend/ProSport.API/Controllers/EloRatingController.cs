using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;

namespace ProSport.API.Controllers;

[Route("api/elo")]
[ApiController]
public class EloRatingController : ControllerBase
{
    private readonly IEloRatingService _elo;

    public EloRatingController(IEloRatingService elo) => _elo = elo;

    [HttpGet("users/{userId}")]
    public async Task<IActionResult> GetRating(int userId, [FromQuery] string sportType = "Badminton")
    {
        var response = await _elo.GetUserRatingAsync(userId, sportType);
        return StatusCode(response.StatusCode, response);
    }

    [Authorize]
    [HttpPost("match-results")]
    public async Task<IActionResult> SubmitResult([FromBody] SubmitMatchResultDto dto)
    {
        var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(claim) || !int.TryParse(claim, out var userId))
            return Unauthorized(new ApiResponseDto<object>(401, "Unauthorized"));

        var response = await _elo.SubmitMatchResultAsync(userId, dto);
        return StatusCode(response.StatusCode, response);
    }

    [Authorize]
    [HttpPost("match-results/{matchId}/confirm")]
    public async Task<IActionResult> ConfirmResult(int matchId)
    {
        var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(claim) || !int.TryParse(claim, out var userId))
            return Unauthorized(new ApiResponseDto<object>(401, "Unauthorized"));

        var response = await _elo.ConfirmMatchResultAsync(userId, matchId);
        return StatusCode(response.StatusCode, response);
    }

    [Authorize]
    [HttpPost("match-results/{matchId}/dispute")]
    public async Task<IActionResult> DisputeResult(int matchId, [FromBody] DisputeMatchResultDto? dto)
    {
        var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(claim) || !int.TryParse(claim, out var userId))
            return Unauthorized(new ApiResponseDto<object>(401, "Unauthorized"));

        var response = await _elo.DisputeMatchResultAsync(userId, matchId, dto?.Reason);
        return StatusCode(response.StatusCode, response);
    }
}
