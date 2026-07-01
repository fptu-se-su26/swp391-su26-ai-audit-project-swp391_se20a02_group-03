using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProSport.Application.DTOs;
using ProSport.Application.DTOs.Owner;
using ProSport.Application.Interfaces;
using ProSport.Domain.Constants;

namespace ProSport.API.Controllers.Owner;

[Route("api/owner/bookings")]
[ApiController]
[Authorize(Roles = Roles.CourtOwner + "," + Roles.Admin)]
public class OwnerBookingController : OwnerControllerBase
{
    private readonly IOwnerAccessService _ownerAccessService;
    private readonly IOwnerDashboardService _ownerDashboardService;
    private readonly IBookingService _bookingService;

    public OwnerBookingController(
        ICurrentUserContext currentUser,
        IOwnerAccessService ownerAccessService,
        IOwnerDashboardService ownerDashboardService,
        IBookingService bookingService) : base(currentUser)
    {
        _ownerAccessService = ownerAccessService;
        _ownerDashboardService = ownerDashboardService;
        _bookingService = bookingService;
    }

    [HttpGet]
    public async Task<IActionResult> GetBookings([FromQuery] OwnerBookingQueryDto query)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();

        try
        {
            await _ownerAccessService.RequireOwnerOrAdminAccessAsync(userId.Value, query.ComplexId, IsAdmin);
            var response = await _ownerDashboardService.GetBookingsAsync(query);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex) { return FromOwnerException(ex); }
    }

    [HttpGet("calendar")]
    public async Task<IActionResult> GetCalendar([FromQuery] OwnerBookingQueryDto query)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();

        try
        {
            await _ownerAccessService.RequireOwnerOrAdminAccessAsync(userId.Value, query.ComplexId, IsAdmin);
            var response = await _ownerDashboardService.GetCalendarBookingsAsync(query);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex) { return FromOwnerException(ex); }
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetBooking(int id)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();

        try
        {
            await _ownerAccessService.RequireBookingAccessAsync(userId.Value, id, IsAdmin);
            var response = await _bookingService.GetBookingByIdAsync(id);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex) { return FromOwnerException(ex); }
    }

    [HttpPost("walk-in")]
    public async Task<IActionResult> CreateWalkIn([FromBody] WalkInBookingDto dto)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();

        try
        {
            if (dto.Details != null)
            {
                foreach (var detail in dto.Details)
                    await _ownerAccessService.RequireCourtAccessAsync(userId.Value, detail.CourtId, IsAdmin);
            }

            var response = await _bookingService.CreateWalkInBookingAsync(dto, userId.Value);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex) { return FromOwnerException(ex); }
    }

    [HttpPost("{id:int}/check-in")]
    public async Task<IActionResult> CheckIn(int id, [FromBody] CheckInRequestDto dto)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();

        try
        {
            await _ownerAccessService.RequireBookingAccessAsync(userId.Value, id, IsAdmin);
            var response = await _bookingService.ProcessCheckInForBookingAsync(id, userId.Value, dto.CheckInCode);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex) { return FromOwnerException(ex); }
    }

    [HttpPut("{id:int}/cancel")]
    public async Task<IActionResult> CancelBooking(int id)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();

        try
        {
            await _ownerAccessService.RequireBookingAccessAsync(userId.Value, id, IsAdmin);
            var response = await _bookingService.CancelBookingAsOperatorAsync(userId.Value, id);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex) { return FromOwnerException(ex); }
    }

    [HttpPatch("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateBookingStatusDto dto)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();

        try
        {
            await _ownerAccessService.RequireBookingAccessAsync(userId.Value, id, IsAdmin);
            var response = await _bookingService.UpdateBookingStatusAsync(id, dto.Status, userId.Value);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex) { return FromOwnerException(ex); }
    }
}
