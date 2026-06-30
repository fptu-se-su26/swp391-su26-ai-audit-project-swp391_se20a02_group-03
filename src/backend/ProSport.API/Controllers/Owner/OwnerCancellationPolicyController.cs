using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using ProSport.Domain.Constants;

namespace ProSport.API.Controllers.Owner;

[Route("api/owner/complexes/{complexId}/cancellation-policy")]
[ApiController]
[Authorize(Roles = Roles.CourtOwner + "," + Roles.Admin)]
public class OwnerCancellationPolicyController : OwnerControllerBase
{
    private readonly ICancellationPolicyService _policy;
    private readonly IOwnerAccessService _ownerAccess;

    public OwnerCancellationPolicyController(
        ICurrentUserContext currentUser,
        ICancellationPolicyService policy,
        IOwnerAccessService ownerAccess) : base(currentUser)
    {
        _policy = policy;
        _ownerAccess = ownerAccess;
    }

    [HttpGet]
    public async Task<IActionResult> Get(int complexId)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();

        try
        {
            await _ownerAccess.RequireOwnerOrAdminAccessAsync(userId.Value, complexId, IsAdmin);
            var dto = await _policy.GetOrDefaultAsync(complexId);
            return Ok(new ApiResponseDto<CancellationPolicyDto>(200, "Success", dto));
        }
        catch (Exception ex) { return FromOwnerException(ex); }
    }

    [HttpPut]
    public async Task<IActionResult> Upsert(int complexId, [FromBody] CancellationPolicyDto dto)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();

        try
        {
            await _ownerAccess.RequireOwnerOrAdminAccessAsync(userId.Value, complexId, IsAdmin);
            dto.ComplexId = complexId;
            var response = await _policy.UpsertAsync(complexId, dto);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex) { return FromOwnerException(ex); }
    }
}
