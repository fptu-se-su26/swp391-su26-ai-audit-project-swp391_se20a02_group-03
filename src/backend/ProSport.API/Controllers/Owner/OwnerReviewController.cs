using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProSport.Application.DTOs;
using ProSport.Application.DTOs.Owner;
using ProSport.Application.Interfaces;
using ProSport.Domain.Constants;

namespace ProSport.API.Controllers.Owner;

[Route("api/owner/reviews")]
[ApiController]
[Authorize(Roles = Roles.CourtOwner + "," + Roles.Admin)]
public class OwnerReviewController : OwnerControllerBase
{
    private readonly IOwnerAccessService _ownerAccessService;
    private readonly IOwnerReviewService _reviewService;

    public OwnerReviewController(
        ICurrentUserContext currentUser,
        IOwnerAccessService ownerAccessService,
        IOwnerReviewService reviewService) : base(currentUser)
    {
        _ownerAccessService = ownerAccessService;
        _reviewService = reviewService;
    }

    [HttpGet]
    public async Task<IActionResult> GetReviews([FromQuery] int complexId)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();
        try
        {
            await _ownerAccessService.RequireOwnerOrAdminAccessAsync(userId.Value, complexId, IsAdmin);
            var response = await _reviewService.GetReviewsAsync(complexId);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex) { return FromOwnerException(ex); }
    }

    [HttpPost("{id:int}/reply")]
    public async Task<IActionResult> Reply(int id, [FromQuery] int complexId, [FromBody] OwnerReviewReplyDto dto)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();
        try
        {
            await _ownerAccessService.RequireOwnerOrAdminAccessAsync(userId.Value, complexId, IsAdmin);
            var response = await _reviewService.ReplyToReviewAsync(userId.Value, id, complexId, dto);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex) { return FromOwnerException(ex); }
    }

    [HttpPost("{id:int}/report")]
    public async Task<IActionResult> Report(int id, [FromQuery] int complexId, [FromBody] OwnerReviewReportDto dto)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();
        try
        {
            await _ownerAccessService.RequireOwnerOrAdminAccessAsync(userId.Value, complexId, IsAdmin);
            var response = await _reviewService.ReportReviewAsync(userId.Value, id, complexId, dto);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex) { return FromOwnerException(ex); }
    }
}

[Route("api/owner/audit-logs")]
[ApiController]
[Authorize(Roles = Roles.CourtOwner + "," + Roles.Admin)]
public class OwnerAuditLogController : OwnerControllerBase
{
    private readonly IOwnerAccessService _ownerAccessService;
    private readonly IAuditLogService _auditLogService;

    public OwnerAuditLogController(
        ICurrentUserContext currentUser,
        IOwnerAccessService ownerAccessService,
        IAuditLogService auditLogService) : base(currentUser)
    {
        _ownerAccessService = ownerAccessService;
        _auditLogService = auditLogService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAuditLogs([FromQuery] AuditLogQueryDto query)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();
        try
        {
            await _ownerAccessService.RequireOwnerOrAdminAccessAsync(userId.Value, query.ComplexId, IsAdmin);
            var (items, total) = await _auditLogService.GetPagedAsync(query);
            return Ok(new ApiResponseDto<PagedResult<AuditLogDto>>(200, "Success", new PagedResult<AuditLogDto>
            {
                Items = items,
                TotalCount = total,
                CurrentPage = query.Page,
                TotalPages = (int)Math.Ceiling(total / (double)Math.Max(query.Size, 1))
            }));
        }
        catch (Exception ex) { return FromOwnerException(ex); }
    }
}
