using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProSport.Application.DTOs;
using ProSport.Application.DTOs.Owner;
using ProSport.Application.Interfaces;
using ProSport.Domain.Constants;

namespace ProSport.API.Controllers.Owner;

[Route("api/owner/courts")]
[ApiController]
[Authorize(Roles = Roles.CourtOwner + "," + Roles.Admin)]
public class OwnerCourtController : OwnerControllerBase
{
    private readonly IOwnerAccessService _ownerAccessService;
    private readonly ICourtService _courtService;
    private readonly IOwnerCourtService _ownerCourtService;

    public OwnerCourtController(
        ICurrentUserContext currentUser,
        IOwnerAccessService ownerAccessService,
        ICourtService courtService,
        IOwnerCourtService ownerCourtService) : base(currentUser)
    {
        _ownerAccessService = ownerAccessService;
        _courtService = courtService;
        _ownerCourtService = ownerCourtService;
    }

    [HttpGet]
    public async Task<IActionResult> GetCourts([FromQuery] int complexId, [FromQuery] CourtQueryParameters parameters)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();

        try
        {
            await _ownerAccessService.RequireOwnerOrAdminAccessAsync(userId.Value, complexId, IsAdmin);
            parameters.ComplexId = complexId;
            var response = await _courtService.GetAllCourtsAsync(parameters);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex) { return FromOwnerException(ex); }
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetCourt(int id)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();

        try
        {
            await _ownerAccessService.RequireCourtAccessAsync(userId.Value, id, IsAdmin);
            var response = await _courtService.GetCourtByIdAsync(id);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex) { return FromOwnerException(ex); }
    }

    [HttpPost]
    public async Task<IActionResult> CreateCourt([FromBody] OwnerCourtCreateDto dto)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();

        try
        {
            await _ownerAccessService.RequireOwnerOrAdminAccessAsync(userId.Value, dto.ComplexId, IsAdmin);
            var response = await _ownerCourtService.CreateCourtAsync(userId.Value, dto);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex) { return FromOwnerException(ex); }
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateCourt(int id, [FromBody] OwnerCourtUpdateDto dto)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();

        try
        {
            await _ownerAccessService.RequireCourtAccessAsync(userId.Value, id, IsAdmin);
            var response = await _ownerCourtService.UpdateCourtAsync(userId.Value, id, dto);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex) { return FromOwnerException(ex); }
    }

    [HttpPatch("{id:int}/status")]
    public async Task<IActionResult> UpdateCourtStatus(int id, [FromBody] OwnerCourtStatusDto dto)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();

        try
        {
            await _ownerAccessService.RequireCourtAccessAsync(userId.Value, id, IsAdmin);
            var response = await _ownerCourtService.UpdateCourtStatusAsync(userId.Value, id, dto.Status);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex) { return FromOwnerException(ex); }
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteCourt(int id)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();

        try
        {
            await _ownerAccessService.RequireCourtAccessAsync(userId.Value, id, IsAdmin);
            var response = await _courtService.DeleteCourtAsync(id);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex) { return FromOwnerException(ex); }
    }
}
