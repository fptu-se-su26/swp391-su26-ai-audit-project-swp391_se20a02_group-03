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

    [HttpGet("open")]
    public async Task<IActionResult> GetAvailableMatches()
    {
        var response = await _matchService.GetAvailableMatchesAsync();
        return StatusCode(response.StatusCode, response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetMatchById(int id)
    {
        var response = await _matchService.GetMatchByIdAsync(id);
        return StatusCode(response.StatusCode, response);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> CreateMatch([FromBody] CreateMatchDto dto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var response = await _matchService.CreateMatchAsync(userId, dto);
        return StatusCode(response.StatusCode, response);
    }

    [Authorize(Roles = "Customer")]
    [HttpPost("{id}/join")]
    public async Task<IActionResult> JoinMatch(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var response = await _matchService.JoinMatchAsync(id, userId);
        return StatusCode(response.StatusCode, response);
    }

    [Authorize]
    [HttpGet("{id}/participants")]
    public async Task<IActionResult> GetParticipants(int id, [FromQuery] string status = "Pending")
    {
        var hostId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var response = await _matchService.GetParticipantsByMatchAsync(id, hostId, status);
        return StatusCode(response.StatusCode, response);
    }

    [Authorize]
    [HttpPut("{id}/participants/{participantId}/approve")]
    public async Task<IActionResult> ApproveJoiner(int id, int participantId)
    {
        var hostId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var response = await _matchService.ApproveJoinerAsync(id, hostId, participantId);
        return StatusCode(response.StatusCode, response);
    }

    [Authorize]
    [HttpPut("{id}/participants/{participantId}/reject")]
    public async Task<IActionResult> RejectJoiner(int id, int participantId)
    {
        var hostId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var response = await _matchService.RejectJoinerAsync(id, hostId, participantId);
        return StatusCode(response.StatusCode, response);
    }

    [Authorize]
    [HttpPost("{id}/leave")]
    public async Task<IActionResult> LeaveMatch(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var response = await _matchService.LeaveMatchAsync(id, userId);
        return StatusCode(response.StatusCode, response);
    }
    [Authorize]
    [HttpPut("{id}/complete")]
    public async Task<IActionResult> CompleteMatch(int id)
    {
        var hostId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var response = await _matchService.CompleteMatchAsync(id, hostId);
        return StatusCode(response.StatusCode, response);
    }

    [Authorize]
    [HttpPut("{id}/cancel")]
    public async Task<IActionResult> CancelMatch(int id)
    {
        var hostId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var response = await _matchService.CancelMatchAsync(id, hostId);
        return StatusCode(response.StatusCode, response);
    }
}
