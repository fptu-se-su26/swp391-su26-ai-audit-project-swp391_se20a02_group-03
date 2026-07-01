using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProSport.Application.Interfaces;
using ProSport.Domain.Constants;

namespace ProSport.API.Controllers.Owner;

[Route("api/owner/reports")]
[ApiController]
[Authorize(Roles = Roles.CourtOwner + "," + Roles.Admin)]
public class OwnerReportController : OwnerControllerBase
{
    private readonly IOwnerAccessService _ownerAccessService;
    private readonly IOwnerReportService _reportService;

    public OwnerReportController(
        ICurrentUserContext currentUser,
        IOwnerAccessService ownerAccessService,
        IOwnerReportService reportService) : base(currentUser)
    {
        _ownerAccessService = ownerAccessService;
        _reportService = reportService;
    }

    [HttpGet("revenue")]
    public async Task<IActionResult> GetRevenue([FromQuery] int complexId, [FromQuery] DateTime? from, [FromQuery] DateTime? to)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();
        try
        {
            await _ownerAccessService.RequireOwnerOrAdminAccessAsync(userId.Value, complexId, IsAdmin);
            var response = await _reportService.GetRevenueAsync(complexId, from, to);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex) { return FromOwnerException(ex); }
    }

    [HttpGet("occupancy")]
    public async Task<IActionResult> GetOccupancy([FromQuery] int complexId, [FromQuery] DateTime? from, [FromQuery] DateTime? to)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();
        try
        {
            await _ownerAccessService.RequireOwnerOrAdminAccessAsync(userId.Value, complexId, IsAdmin);
            var response = await _reportService.GetOccupancyAsync(complexId, from, to);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex) { return FromOwnerException(ex); }
    }

    [HttpGet("inventory")]
    public async Task<IActionResult> GetInventoryReport([FromQuery] int complexId)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();
        try
        {
            await _ownerAccessService.RequireOwnerOrAdminAccessAsync(userId.Value, complexId, IsAdmin);
            var response = await _reportService.GetInventoryReportAsync(complexId);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex) { return FromOwnerException(ex); }
    }

    [HttpGet("export")]
    public async Task<IActionResult> ExportReport([FromQuery] int complexId, [FromQuery] DateTime? from, [FromQuery] DateTime? to)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();
        try
        {
            await _ownerAccessService.RequireOwnerOrAdminAccessAsync(userId.Value, complexId, IsAdmin);
            var response = await _reportService.ExportReportAsync(complexId, from, to);
            if (response.StatusCode != 200 || response.Data == null)
                return StatusCode(response.StatusCode, response);
            return File(response.Data, "text/csv", $"owner-report-{complexId}.csv");
        }
        catch (Exception ex) { return FromOwnerException(ex); }
    }
}
