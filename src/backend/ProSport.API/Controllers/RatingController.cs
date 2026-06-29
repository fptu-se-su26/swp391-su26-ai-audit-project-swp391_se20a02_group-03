using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using System.Security.Claims;

namespace ProSport.API.Controllers;

// TK-035: API đánh giá người chơi và xem điểm tín nhiệm (Trust Score).
[Route("api/ratings")]
[ApiController]
public class RatingController : ControllerBase
{
    private readonly IRatingService _ratingService;

    public RatingController(IRatingService ratingService)
    {
        _ratingService = ratingService;
    }

    // POST: gửi đánh giá sau trận đấu (người đăng nhập là người chấm điểm).
    [Authorize]
    [HttpPost]
    public async Task<IActionResult> CreateRating([FromBody] CreateRatingDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int raterId))
        {
            return Unauthorized(new ApiResponseDto<object>(401, "Unauthorized"));
        }

        var response = await _ratingService.CreateRatingAsync(raterId, dto);
        return StatusCode(response.StatusCode, response);
    }

    // GET: xem điểm tín nhiệm của 1 người chơi (công khai).
    [HttpGet("trust-score/{userId}")]
    public async Task<IActionResult> GetTrustScore(int userId)
    {
        var response = await _ratingService.GetTrustScoreAsync(userId);
        return StatusCode(response.StatusCode, response);
    }

    // GET: bảng xếp hạng người chơi theo Trust Score (công khai).
    [HttpGet("leaderboard")]
    public async Task<IActionResult> GetLeaderboard([FromQuery] int limit = 20)
    {
        var response = await _ratingService.GetLeaderboardAsync(limit);
        return StatusCode(response.StatusCode, response);
    }
}
