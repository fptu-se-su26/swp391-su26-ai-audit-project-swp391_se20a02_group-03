using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Routing;
using ProSport.API.Filters;
using ProSport.Domain.Constants;

namespace ProSport.Tests;

public class OwnerApiAuthorizationFilterTests
{
    private static AuthorizationFilterContext CreateContext(string path, ClaimsPrincipal? user)
    {
        var httpContext = new DefaultHttpContext();
        httpContext.Request.Path = path;
        if (user != null)
            httpContext.User = user;

        var actionContext = new ActionContext(httpContext, new RouteData(), new ActionDescriptor());
        return new AuthorizationFilterContext(actionContext, new List<IFilterMetadata>());
    }

    private static ClaimsPrincipal CreateUser(params string[] roles)
    {
        var claims = new List<Claim> { new(ClaimTypes.NameIdentifier, "1") };
        claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));
        return new ClaimsPrincipal(new ClaimsIdentity(claims, "Test"));
    }

    [Fact]
    public void OnAuthorization_Allows_NonOwnerPaths()
    {
        var filter = new OwnerApiAuthorizationFilter();
        var context = CreateContext("/api/bookings", CreateUser(Roles.Customer));

        filter.OnAuthorization(context);

        Assert.Null(context.Result);
    }

    [Fact]
    public void OnAuthorization_Returns401_WhenUnauthenticated()
    {
        var filter = new OwnerApiAuthorizationFilter();
        var context = CreateContext("/api/owner/context", new ClaimsPrincipal(new ClaimsIdentity()));

        filter.OnAuthorization(context);

        var result = Assert.IsType<UnauthorizedObjectResult>(context.Result);
        Assert.Equal(401, result.StatusCode);
    }

    [Fact]
    public void OnAuthorization_Returns403_ForCustomer()
    {
        var filter = new OwnerApiAuthorizationFilter();
        var context = CreateContext("/api/owner/context", CreateUser(Roles.Customer));

        filter.OnAuthorization(context);

        var result = Assert.IsType<ObjectResult>(context.Result);
        Assert.Equal(403, result.StatusCode);
    }

    [Fact]
    public void OnAuthorization_Allows_CourtOwner()
    {
        var filter = new OwnerApiAuthorizationFilter();
        var context = CreateContext("/api/owner/context", CreateUser(Roles.CourtOwner));

        filter.OnAuthorization(context);

        Assert.Null(context.Result);
    }

    [Fact]
    public void OnAuthorization_Returns403_ForStaff()
    {
        var filter = new OwnerApiAuthorizationFilter();
        var context = CreateContext("/api/owner/context", CreateUser(Roles.Staff));

        filter.OnAuthorization(context);

        var result = Assert.IsType<ObjectResult>(context.Result);
        Assert.Equal(403, result.StatusCode);
    }

    [Fact]
    public void OnAuthorization_Allows_Admin()
    {
        var filter = new OwnerApiAuthorizationFilter();
        var context = CreateContext("/api/owner/context", CreateUser(Roles.Admin));

        filter.OnAuthorization(context);

        Assert.Null(context.Result);
    }
}
