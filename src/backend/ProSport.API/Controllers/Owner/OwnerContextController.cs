using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProSport.Application.DTOs;
using ProSport.Application.DTOs.Owner;
using ProSport.Application.Interfaces;
using ProSport.Domain.Constants;

namespace ProSport.API.Controllers.Owner;

[Route("api/owner/context")]
[ApiController]
[Authorize(Roles = Roles.CourtOwner + "," + Roles.Admin)]
public class OwnerContextController : OwnerControllerBase
{
    private readonly IOwnerAccessService _ownerAccessService;

    public OwnerContextController(
        ICurrentUserContext currentUser,
        IOwnerAccessService ownerAccessService) : base(currentUser)
    {
        _ownerAccessService = ownerAccessService;
    }

    [HttpGet]
    public async Task<IActionResult> GetContext()
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();

        try
        {
            var contextDto = await _ownerAccessService.GetOwnerContextAsync(userId.Value);
            return ToResult(new ApiResponseDto<OwnerContextDto>(200, "Lấy context thành công", contextDto));
        }
        catch (Exception ex)
        {
            return FromOwnerException(ex);
        }
    }
}
