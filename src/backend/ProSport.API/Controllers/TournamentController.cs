using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using ProSport.Domain.Constants;

namespace ProSport.API.Controllers;

[Route("api/tournaments")]
[ApiController]
public class TournamentController : ControllerBase
{
    private readonly ITournamentService _tournaments;

    public TournamentController(ITournamentService tournaments) => _tournaments = tournaments;

    [HttpGet("complex/{complexId}")]
    public async Task<IActionResult> ListByComplex(int complexId)
    {
        var response = await _tournaments.GetByComplexAsync(complexId);
        return StatusCode(response.StatusCode, response);
    }

    [Authorize]
    [HttpPost("complex/{complexId}")]
    public async Task<IActionResult> Create(int complexId, [FromBody] CreateTournamentDto dto)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized(new ApiResponseDto<object>(401, "Unauthorized"));

        var response = await _tournaments.CreateAsync(userId, complexId, dto, User.IsInRole(Roles.Admin));
        return StatusCode(response.StatusCode, response);
    }

    [Authorize]
    [HttpPost("{tournamentId}/register")]
    public async Task<IActionResult> Register(int tournamentId, [FromBody] RegisterTournamentDto dto)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized(new ApiResponseDto<object>(401, "Unauthorized"));

        var response = await _tournaments.RegisterAsync(userId, tournamentId, dto);
        return StatusCode(response.StatusCode, response);
    }

    [Authorize]
    [HttpPost("{tournamentId}/close")]
    public async Task<IActionResult> Close(int tournamentId)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized(new ApiResponseDto<object>(401, "Unauthorized"));

        var response = await _tournaments.CloseRegistrationAsync(userId, tournamentId, User.IsInRole(Roles.Admin));
        return StatusCode(response.StatusCode, response);
    }

    [Authorize]
    [HttpPost("{tournamentId}/complete")]
    public async Task<IActionResult> Complete(int tournamentId)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized(new ApiResponseDto<object>(401, "Unauthorized"));

        var response = await _tournaments.CompleteAsync(userId, tournamentId, User.IsInRole(Roles.Admin));
        return StatusCode(response.StatusCode, response);
    }

    [Authorize]
    [HttpPost("{tournamentId}/cancel")]
    public async Task<IActionResult> Cancel(int tournamentId)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized(new ApiResponseDto<object>(401, "Unauthorized"));

        var response = await _tournaments.CancelAsync(userId, tournamentId, User.IsInRole(Roles.Admin));
        return StatusCode(response.StatusCode, response);
    }

    [Authorize]
    [HttpPost("{tournamentId}/withdraw")]
    public async Task<IActionResult> Withdraw(int tournamentId)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized(new ApiResponseDto<object>(401, "Unauthorized"));

        var response = await _tournaments.WithdrawAsync(userId, tournamentId);
        return StatusCode(response.StatusCode, response);
    }

    private bool TryGetUserId(out int userId)
    {
        userId = 0;
        var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        return !string.IsNullOrEmpty(claim) && int.TryParse(claim, out userId);
    }
}
