using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using ProSport.Application.DTOs;
using ProSport.Domain.Constants;

namespace ProSport.API.Filters;

/// <summary>
/// Bổ sung kiểm tra role cho mọi API /api/owner/* — Customer và Staff nhận 403.
/// Admin và CourtOwner được phép (chi tiết tenant kiểm tra tại OwnerAccessService).
/// </summary>
public class OwnerApiAuthorizationFilter : IAuthorizationFilter
{
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var path = context.HttpContext.Request.Path.Value ?? "";
        if (!path.StartsWith("/api/owner", StringComparison.OrdinalIgnoreCase))
            return;

        var user = context.HttpContext.User;
        if (user?.Identity?.IsAuthenticated != true)
        {
            context.Result = new UnauthorizedObjectResult(new ApiResponseDto<object>(401, "Unauthorized"));
            return;
        }

        if (user.IsInRole(Roles.CourtOwner) || user.IsInRole(Roles.Admin))
            return;

        context.Result = new ObjectResult(new ApiResponseDto<object>(403, "Forbidden"))
        {
            StatusCode = StatusCodes.Status403Forbidden
        };
    }
}
