using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProSport.Application.DTOs;
using ProSport.Application.DTOs.Owner;
using ProSport.Application.Interfaces;
using ProSport.Domain.Constants;

namespace ProSport.API.Controllers.Owner;

[Route("api/owner/pricing-rules")]
[ApiController]
[Authorize(Roles = Roles.CourtOwner + "," + Roles.Admin)]
public class OwnerPricingController : OwnerControllerBase
{
    private readonly IOwnerAccessService _ownerAccessService;
    private readonly ICourtService _courtService;

    public OwnerPricingController(
        ICurrentUserContext currentUser,
        IOwnerAccessService ownerAccessService,
        ICourtService courtService) : base(currentUser)
    {
        _ownerAccessService = ownerAccessService;
        _courtService = courtService;
    }

    [HttpGet]
    public async Task<IActionResult> GetRules([FromQuery] int complexId, [FromQuery] int? courtId)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();

        try
        {
            await _ownerAccessService.RequireOwnerOrAdminAccessAsync(userId.Value, complexId, IsAdmin);
            if (!courtId.HasValue)
                return BadRequest(new ApiResponseDto<object>(400, "courtId là bắt buộc."));

            await _ownerAccessService.RequireCourtAccessAsync(userId.Value, courtId.Value, IsAdmin);
            var response = await _courtService.GetPricingRulesAsync(courtId.Value);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex) { return FromOwnerException(ex); }
    }

    [HttpPost]
    public async Task<IActionResult> CreateRule([FromQuery] int courtId, [FromBody] CreatePricingRuleDto dto)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();

        try
        {
            await _ownerAccessService.RequireCourtAccessAsync(userId.Value, courtId, IsAdmin);
            var response = await _courtService.CreatePricingRuleAsync(courtId, dto);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex) { return FromOwnerException(ex); }
    }

    [HttpPut("{ruleId:int}")]
    public async Task<IActionResult> UpdateRule(int ruleId, [FromQuery] int courtId, [FromBody] UpdatePricingRuleDto dto)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();

        try
        {
            await _ownerAccessService.RequireCourtAccessAsync(userId.Value, courtId, IsAdmin);
            var response = await _courtService.UpdatePricingRuleAsync(courtId, ruleId, dto);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex) { return FromOwnerException(ex); }
    }

    [HttpDelete("{ruleId:int}")]
    public async Task<IActionResult> DeleteRule(int ruleId, [FromQuery] int courtId)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();

        try
        {
            await _ownerAccessService.RequireCourtAccessAsync(userId.Value, courtId, IsAdmin);
            var response = await _courtService.DeletePricingRuleAsync(courtId, ruleId);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex) { return FromOwnerException(ex); }
    }
}
