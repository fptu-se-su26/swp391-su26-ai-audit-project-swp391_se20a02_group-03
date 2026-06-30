using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProSport.Application.Interfaces;
using ProSport.Domain.Constants;

namespace ProSport.API.Controllers.Owner;

[Route("api/owner/complexes/{complexId:int}/operating-hours")]
[ApiController]
[Authorize(Roles = Roles.CourtOwner + "," + Roles.Admin)]
public class OwnerOperatingHoursController : OwnerControllerBase
{
    private readonly IOwnerAccessService _ownerAccessService;
    private readonly IComplexScheduleService _scheduleService;

    public OwnerOperatingHoursController(
        ICurrentUserContext currentUser,
        IOwnerAccessService ownerAccessService,
        IComplexScheduleService scheduleService) : base(currentUser)
    {
        _ownerAccessService = ownerAccessService;
        _scheduleService = scheduleService;
    }

    [HttpGet]
    public async Task<IActionResult> Get(int complexId)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();
        try
        {
            await _ownerAccessService.RequireOwnerOrAdminAccessAsync(userId.Value, complexId, IsAdmin);
            var response = await _scheduleService.GetOperatingHoursAsync(complexId);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex) { return FromOwnerException(ex); }
    }

    [HttpPut]
    public async Task<IActionResult> Save(int complexId, [FromBody] ProSport.Application.DTOs.Owner.SaveComplexOperatingHoursDto dto)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();
        try
        {
            await _ownerAccessService.RequireOwnerOrAdminAccessAsync(userId.Value, complexId, IsAdmin);
            var response = await _scheduleService.SaveOperatingHoursAsync(userId.Value, complexId, dto);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex) { return FromOwnerException(ex); }
    }
}
