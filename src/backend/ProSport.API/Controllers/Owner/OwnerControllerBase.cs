using Microsoft.AspNetCore.Mvc;
using ProSport.Application.DTOs;
using ProSport.Application.Exceptions;
using ProSport.Application.Interfaces;

namespace ProSport.API.Controllers.Owner;

public abstract class OwnerControllerBase : ControllerBase
{
    protected ICurrentUserContext CurrentUser { get; }

    protected OwnerControllerBase(ICurrentUserContext currentUser)
    {
        CurrentUser = currentUser;
    }

    protected bool IsAdmin => CurrentUser.IsAdmin;

    protected int? GetUserId() => CurrentUser.UserId;

    protected IActionResult UnauthorizedResult() =>
        StatusCode(StatusCodes.Status401Unauthorized, new ApiResponseDto<object>(401, "Unauthorized"));

    protected IActionResult ToResult<T>(ApiResponseDto<T> response) =>
        StatusCode(response.StatusCode, response);

    protected IActionResult FromOwnerException(Exception ex) => ex switch
    {
        OwnerAccessDeniedException => StatusCode(403, new ApiResponseDto<object>(403, ex.Message)),
        OwnerResourceNotFoundException => StatusCode(404, new ApiResponseDto<object>(404, ex.Message)),
        UnauthorizedAccessException => StatusCode(403, new ApiResponseDto<object>(403, ex.Message)),
        _ => BadRequest(new ApiResponseDto<object>(400, ex.Message))
    };
}
