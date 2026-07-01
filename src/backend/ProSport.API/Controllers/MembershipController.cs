using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;

namespace ProSport.API.Controllers;

[Route("api/memberships")]
[ApiController]
[Authorize]
public class MembershipController : ControllerBase
{
    private readonly IMembershipService _memberships;
    private readonly ICurrentUserContext _currentUser;

    public MembershipController(IMembershipService memberships, ICurrentUserContext currentUser)
    {
        _memberships = memberships;
        _currentUser = currentUser;
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMyMemberships()
    {
        if (_currentUser.UserId is not int userId)
            return StatusCode(401, new ApiResponseDto<object>(401, "Unauthorized"));

        var response = await _memberships.GetMyMembershipsAsync(userId);
        return StatusCode(response.StatusCode, response);
    }
}
