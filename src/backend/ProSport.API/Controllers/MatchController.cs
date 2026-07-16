using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using System.Security.Claims;

namespace ProSport.API.Controllers;

[Route("api/matches")]
[ApiController]
public class MatchController : ControllerBase
{
    private readonly IMatchService _matchService;

    public MatchController(IMatchService matchService)
    {
        _matchService = matchService;
    }

    private int? TryGetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            return null;
        return userId;
    }

    [HttpGet("open")]
    public async Task<IActionResult> GetAvailableMatches()
    {
        var response = await _matchService.GetAvailableMatchesAsync();
        return StatusCode(response.StatusCode, response);
    }

    [Authorize]
    [HttpGet("my-history")]
    public async Task<IActionResult> GetMyMatchHistory()
    {
        var userId = TryGetUserId();
        if (userId == null)
            return Unauthorized(new ApiResponseDto<object>(401, "Unauthorized"));

        var response = await _matchService.GetMyMatchHistoryAsync(userId.Value);
        return StatusCode(response.StatusCode, response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetMatchById(int id)
    {
        var response = await _matchService.GetMatchByIdAsync(id);
        return StatusCode(response.StatusCode, response);
    }

    [Authorize(Roles = "Customer")]
    [HttpPost]
    public async Task<IActionResult> CreateMatch([FromBody] CreateMatchDto dto)
    {
        var userId = TryGetUserId();
        if (userId == null)
            return Unauthorized(new ApiResponseDto<object>(401, "Unauthorized"));

        var response = await _matchService.CreateMatchAsync(userId.Value, dto);
        return StatusCode(response.StatusCode, response);
    }

    [Authorize(Roles = "Customer")]
    [HttpPost("{id}/join")]
    public async Task<IActionResult> JoinMatch(int id)
    {
        var userId = TryGetUserId();
        if (userId == null)
            return Unauthorized(new ApiResponseDto<object>(401, "Unauthorized"));

        var response = await _matchService.JoinMatchAsync(id, userId.Value);
        return StatusCode(response.StatusCode, response);
    }

    [Authorize]
    [HttpGet("{id}/participants")]
    public async Task<IActionResult> GetParticipants(int id, [FromQuery] string status = "Pending")
    {
        var hostId = TryGetUserId();
        if (hostId == null)
            return Unauthorized(new ApiResponseDto<object>(401, "Unauthorized"));

        var response = await _matchService.GetParticipantsByMatchAsync(id, hostId.Value, status);
        return StatusCode(response.StatusCode, response);
    }

    [Authorize]
    [HttpGet("{id}/members")]
    public async Task<IActionResult> GetMatchMembers(int id)
    {
        var userId = TryGetUserId();
        if (userId == null)
            return Unauthorized(new ApiResponseDto<object>(401, "Unauthorized"));

        var response = await _matchService.GetMatchMembersAsync(id, userId.Value);
        return StatusCode(response.StatusCode, response);
    }

    [Authorize]
    [HttpPut("{id}/participants/{participantId}/approve")]
    public async Task<IActionResult> ApproveJoiner(int id, int participantId)
    {
        var hostId = TryGetUserId();
        if (hostId == null)
            return Unauthorized(new ApiResponseDto<object>(401, "Unauthorized"));

        var response = await _matchService.ApproveJoinerAsync(id, hostId.Value, participantId);
        return StatusCode(response.StatusCode, response);
    }

    [Authorize]
    [HttpPut("{id}/participants/{participantId}/reject")]
    public async Task<IActionResult> RejectJoiner(int id, int participantId)
    {
        var hostId = TryGetUserId();
        if (hostId == null)
            return Unauthorized(new ApiResponseDto<object>(401, "Unauthorized"));

        var response = await _matchService.RejectJoinerAsync(id, hostId.Value, participantId);
        return StatusCode(response.StatusCode, response);
    }

    [Authorize]
    [HttpPost("{id}/leave")]
    public async Task<IActionResult> LeaveMatch(int id)
    {
        var userId = TryGetUserId();
        if (userId == null)
            return Unauthorized(new ApiResponseDto<object>(401, "Unauthorized"));

        var response = await _matchService.LeaveMatchAsync(id, userId.Value);
        return StatusCode(response.StatusCode, response);
    }

    [Authorize]
    [HttpPut("{id}/complete")]
    public async Task<IActionResult> CompleteMatch(int id)
    {
        var hostId = TryGetUserId();
        if (hostId == null)
            return Unauthorized(new ApiResponseDto<object>(401, "Unauthorized"));

        var response = await _matchService.CompleteMatchAsync(id, hostId.Value);
        return StatusCode(response.StatusCode, response);
    }

    [Authorize]
    [HttpPut("{id}/cancel")]
    public async Task<IActionResult> CancelMatch(int id)
    {
        var hostId = TryGetUserId();
        if (hostId == null)
            return Unauthorized(new ApiResponseDto<object>(401, "Unauthorized"));

        var response = await _matchService.CancelMatchAsync(id, hostId.Value);
        return StatusCode(response.StatusCode, response);
    }
}
