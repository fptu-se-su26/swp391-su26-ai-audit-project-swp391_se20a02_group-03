using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProSport.Application.DTOs.Owner;
using ProSport.Application.Interfaces;
using ProSport.Domain.Constants;

namespace ProSport.API.Controllers.Owner;

[Route("api/owner/rentals")]
[ApiController]
[Authorize(Roles = Roles.CourtOwner + "," + Roles.Admin)]
public class OwnerRentalController : OwnerControllerBase
{
    private readonly IOwnerAccessService _ownerAccessService;
    private readonly IOwnerRentalService _rentalService;

    public OwnerRentalController(
        ICurrentUserContext currentUser,
        IOwnerAccessService ownerAccessService,
        IOwnerRentalService rentalService) : base(currentUser)
    {
        _ownerAccessService = ownerAccessService;
        _rentalService = rentalService;
    }

    [HttpGet]
    public async Task<IActionResult> GetRentals([FromQuery] OwnerRentalQueryDto query)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();
        try
        {
            await _ownerAccessService.RequireOwnerOrAdminAccessAsync(userId.Value, query.ComplexId, IsAdmin);
            var response = await _rentalService.GetRentalsAsync(query);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex) { return FromOwnerException(ex); }
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetRental(int id, [FromQuery] int complexId)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();
        try
        {
            await _ownerAccessService.RequireRentalAccessAsync(userId.Value, id, IsAdmin);
            var response = await _rentalService.GetRentalByIdAsync(id, complexId);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex) { return FromOwnerException(ex); }
    }

    [HttpPost]
    public async Task<IActionResult> CreateRental([FromBody] CreateRentalSessionDto dto)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();
        try
        {
            await _ownerAccessService.RequireOwnerOrAdminAccessAsync(userId.Value, dto.ComplexId, IsAdmin);
            var response = await _rentalService.CreateRentalAsync(userId.Value, dto);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex) { return FromOwnerException(ex); }
    }

    [HttpGet("{id:int}/condition-history")]
    public async Task<IActionResult> GetConditionHistory(int id, [FromQuery] int complexId)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();
        try
        {
            await _ownerAccessService.RequireOwnerOrAdminAccessAsync(userId.Value, complexId, IsAdmin);
            var response = await _rentalService.GetConditionHistoryAsync(id, complexId);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex) { return FromOwnerException(ex); }
    }

    [HttpPost("{id:int}/condition-check")]
    public async Task<IActionResult> AddConditionCheck(int id, [FromQuery] int complexId, [FromBody] CreateConditionCheckDto dto)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();
        try
        {
            await _ownerAccessService.RequireOwnerOrAdminAccessAsync(userId.Value, complexId, IsAdmin);
            var response = await _rentalService.AddConditionCheckAsync(userId.Value, id, complexId, dto);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex) { return FromOwnerException(ex); }
    }

    [HttpPost("{id:int}/surcharge")]
    public async Task<IActionResult> AddSurcharge(int id, [FromQuery] int complexId, [FromBody] CreateRentalSurchargeDto dto)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();
        try
        {
            await _ownerAccessService.RequireOwnerOrAdminAccessAsync(userId.Value, complexId, IsAdmin);
            var response = await _rentalService.AddSurchargeAsync(userId.Value, id, complexId, dto);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex) { return FromOwnerException(ex); }
    }
}
