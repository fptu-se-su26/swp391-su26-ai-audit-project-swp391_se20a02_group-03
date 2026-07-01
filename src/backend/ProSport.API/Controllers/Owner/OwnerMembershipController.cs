using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using ProSport.Domain.Constants;

namespace ProSport.API.Controllers.Owner;

[Route("api/owner/memberships")]
[ApiController]
[Authorize(Roles = Roles.CourtOwner + "," + Roles.Admin)]
public class OwnerMembershipController : OwnerControllerBase
{
    private readonly IMembershipService _memberships;
    private readonly IOwnerAccessService _ownerAccess;

    public OwnerMembershipController(
        ICurrentUserContext currentUser,
        IMembershipService memberships,
        IOwnerAccessService ownerAccess) : base(currentUser)
    {
        _memberships = memberships;
        _ownerAccess = ownerAccess;
    }

    [HttpGet]
    public async Task<IActionResult> GetByComplex([FromQuery] int complexId)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();
        try
        {
            await _ownerAccess.RequireOwnerOrAdminAccessAsync(userId.Value, complexId, IsAdmin);
            return ToResult(await _memberships.GetByComplexAsync(complexId));
        }
        catch (Exception ex) { return FromOwnerException(ex); }
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromQuery] int complexId, [FromBody] CreateMembershipDto dto)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();
        try
        {
            await _ownerAccess.RequireOwnerOrAdminAccessAsync(userId.Value, complexId, IsAdmin);
            return ToResult(await _memberships.CreateAsync(userId.Value, complexId, dto, IsAdmin));
        }
        catch (Exception ex) { return FromOwnerException(ex); }
    }

    [HttpPatch("{membershipId:int}/status")]
    public async Task<IActionResult> UpdateStatus(int membershipId, [FromQuery] int complexId, [FromBody] UpdateMembershipStatusDto dto)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();
        try
        {
            return ToResult(await _memberships.UpdateStatusAsync(userId.Value, complexId, membershipId, dto.Status, IsAdmin));
        }
        catch (Exception ex) { return FromOwnerException(ex); }
    }
}
