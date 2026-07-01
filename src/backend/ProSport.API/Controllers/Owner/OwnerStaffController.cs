using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProSport.Application.DTOs.Owner;
using ProSport.Application.Interfaces;
using ProSport.Domain.Constants;

namespace ProSport.API.Controllers.Owner;

[Route("api/owner/staff")]
[ApiController]
[Authorize(Roles = Roles.CourtOwner + "," + Roles.Admin)]
public class OwnerStaffController : OwnerControllerBase
{
    private readonly IOwnerAccessService _ownerAccessService;
    private readonly IOwnerStaffService _ownerStaffService;

    public OwnerStaffController(
        ICurrentUserContext currentUser,
        IOwnerAccessService ownerAccessService,
        IOwnerStaffService ownerStaffService) : base(currentUser)
    {
        _ownerAccessService = ownerAccessService;
        _ownerStaffService = ownerStaffService;
    }

    [HttpGet]
    public async Task<IActionResult> GetStaff([FromQuery] int complexId)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();

        try
        {
            await _ownerAccessService.RequireOwnerOrAdminAccessAsync(userId.Value, complexId, IsAdmin);
            var response = await _ownerStaffService.GetStaffAsync(complexId);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex)
        {
            return FromOwnerException(ex);
        }
    }

    [HttpPost("invitations")]
    public async Task<IActionResult> InviteStaff([FromBody] CreateStaffAssignmentDto dto)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();

        try
        {
            await _ownerAccessService.RequireOwnerOrAdminAccessAsync(userId.Value, dto.ComplexId, IsAdmin);
            var response = await _ownerStaffService.AssignStaffAsync(userId.Value, dto);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex)
        {
            return FromOwnerException(ex);
        }
    }

    [HttpPatch("{id:int}/permissions")]
    public async Task<IActionResult> UpdatePermissions(int id, [FromQuery] int complexId, [FromBody] UpdateStaffPermissionsDto dto)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();

        try
        {
            await _ownerAccessService.RequireOwnerOrAdminAccessAsync(userId.Value, complexId, IsAdmin);
            var response = await _ownerStaffService.UpdatePermissionsAsync(id, complexId, dto);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex)
        {
            return FromOwnerException(ex);
        }
    }

    [HttpPatch("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromQuery] int complexId, [FromBody] UpdateStaffStatusDto dto)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();

        try
        {
            await _ownerAccessService.RequireOwnerOrAdminAccessAsync(userId.Value, complexId, IsAdmin);
            var response = await _ownerStaffService.UpdateStatusAsync(id, complexId, dto);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex)
        {
            return FromOwnerException(ex);
        }
    }

    [HttpDelete("{id:int}/assignment")]
    public async Task<IActionResult> RemoveAssignment(int id, [FromQuery] int complexId)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();

        try
        {
            await _ownerAccessService.RequireOwnerOrAdminAccessAsync(userId.Value, complexId, IsAdmin);
            var response = await _ownerStaffService.RemoveAssignmentAsync(id, complexId);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex)
        {
            return FromOwnerException(ex);
        }
    }
}
