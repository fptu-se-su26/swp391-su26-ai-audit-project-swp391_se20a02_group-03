using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProSport.Application.Interfaces;
using ProSport.Domain.Constants;

namespace ProSport.API.Controllers.Owner;

[Route("api/owner/dashboard")]
[ApiController]
[Authorize(Roles = Roles.CourtOwner + "," + Roles.Admin)]
public class OwnerDashboardController : OwnerControllerBase
{
    private readonly IOwnerAccessService _ownerAccessService;
    private readonly IOwnerDashboardService _ownerDashboardService;

    public OwnerDashboardController(
        ICurrentUserContext currentUser,
        IOwnerAccessService ownerAccessService,
        IOwnerDashboardService ownerDashboardService) : base(currentUser)
    {
        _ownerAccessService = ownerAccessService;
        _ownerDashboardService = ownerDashboardService;
    }

    [HttpGet]
    public async Task<IActionResult> GetDashboard([FromQuery] int complexId, [FromQuery] DateTime? from, [FromQuery] DateTime? to)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();

        try
        {
            await _ownerAccessService.RequireOwnerOrAdminAccessAsync(userId.Value, complexId, IsAdmin);
            var response = await _ownerDashboardService.GetDashboardAsync(complexId, from, to);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex)
        {
            return FromOwnerException(ex);
        }
    }
}
