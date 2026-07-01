using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProSport.Application.DTOs.Owner;
using ProSport.Application.Interfaces;
using ProSport.Domain.Constants;

namespace ProSport.API.Controllers.Owner;

[Route("api/owner/vouchers")]
[ApiController]
[Authorize(Roles = Roles.CourtOwner + "," + Roles.Admin)]
public class OwnerVoucherController : OwnerControllerBase
{
    private readonly IOwnerAccessService _ownerAccessService;
    private readonly IOwnerVoucherService _voucherService;

    public OwnerVoucherController(
        ICurrentUserContext currentUser,
        IOwnerAccessService ownerAccessService,
        IOwnerVoucherService voucherService) : base(currentUser)
    {
        _ownerAccessService = ownerAccessService;
        _voucherService = voucherService;
    }

    [HttpGet]
    public async Task<IActionResult> GetVouchers([FromQuery] int complexId)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();
        try
        {
            await _ownerAccessService.RequireOwnerOrAdminAccessAsync(userId.Value, complexId, IsAdmin);
            var response = await _voucherService.GetVouchersAsync(complexId);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex) { return FromOwnerException(ex); }
    }

    [HttpPost]
    public async Task<IActionResult> CreateVoucher([FromQuery] int complexId, [FromBody] CreateOwnerVoucherDto dto)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();
        try
        {
            await _ownerAccessService.RequireOwnerOrAdminAccessAsync(userId.Value, complexId, IsAdmin);
            var response = await _voucherService.CreateVoucherAsync(userId.Value, complexId, dto);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex) { return FromOwnerException(ex); }
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateVoucher(int id, [FromQuery] int complexId, [FromBody] UpdateOwnerVoucherDto dto)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();
        try
        {
            await _ownerAccessService.RequireOwnerOrAdminAccessAsync(userId.Value, complexId, IsAdmin);
            var response = await _voucherService.UpdateVoucherAsync(userId.Value, id, complexId, dto);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex) { return FromOwnerException(ex); }
    }

    [HttpPatch("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromQuery] int complexId, [FromBody] UpdateVoucherStatusDto dto)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();
        try
        {
            await _ownerAccessService.RequireOwnerOrAdminAccessAsync(userId.Value, complexId, IsAdmin);
            var response = await _voucherService.UpdateVoucherStatusAsync(userId.Value, id, complexId, dto);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex) { return FromOwnerException(ex); }
    }
}
