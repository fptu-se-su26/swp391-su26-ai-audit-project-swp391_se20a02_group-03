using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using System.Security.Claims;

namespace ProSport.API.Controllers;

[Route("api/split-payments")]
[ApiController]
[Authorize]
public class SplitPaymentController : ControllerBase
{
    private readonly ISplitPaymentService _splitPayment;

    public SplitPaymentController(ISplitPaymentService splitPayment) => _splitPayment = splitPayment;

    private bool TryGetUserId(out int userId)
    {
        userId = 0;
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return !string.IsNullOrEmpty(claim) && int.TryParse(claim, out userId);
    }

    [HttpPost("bookings")]
    public async Task<IActionResult> CreateSplitBooking([FromBody] CreateSplitBookingDto dto)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized(new ApiResponseDto<object>(401, "Unauthorized"));

        var response = await _splitPayment.CreateSplitBookingAsync(userId, dto);
        return StatusCode(response.StatusCode, response);
    }

    [HttpPost("bookings/{bookingId}/pay")]
    public async Task<IActionResult> PayShare(int bookingId)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized(new ApiResponseDto<object>(401, "Unauthorized"));

        var response = await _splitPayment.PayShareAsync(userId, bookingId);
        return StatusCode(response.StatusCode, response);
    }

    [HttpGet("bookings/{bookingId}/shares")]
    public async Task<IActionResult> GetShares(int bookingId)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized(new ApiResponseDto<object>(401, "Unauthorized"));

        var response = await _splitPayment.GetSharesAsync(bookingId, userId);
        return StatusCode(response.StatusCode, response);
    }
}
