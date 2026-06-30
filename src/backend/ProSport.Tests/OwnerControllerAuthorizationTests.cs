using System.Reflection;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProSport.Domain.Constants;

namespace ProSport.Tests;

public class OwnerControllerAuthorizationTests
{
    private static IEnumerable<Type> GetOwnerControllers() =>
        typeof(ProSport.API.Controllers.Owner.OwnerContextController).Assembly
            .GetTypes()
            .Where(t => t.IsClass && !t.IsAbstract && typeof(ControllerBase).IsAssignableFrom(t)
                && t.Namespace == "ProSport.API.Controllers.Owner"
                && t.IsSubclassOf(typeof(ProSport.API.Controllers.Owner.OwnerControllerBase)));

    [Fact]
    public void AllOwnerControllers_RequireCourtOwnerOrAdmin()
    {
        var ownerControllers = GetOwnerControllers().ToList();
        Assert.NotEmpty(ownerControllers);

        foreach (var controller in ownerControllers)
        {
            var authorize = controller.GetCustomAttribute<AuthorizeAttribute>(inherit: true);
            Assert.True(authorize != null, $"{controller.Name} thiếu [Authorize]");
            Assert.Contains(Roles.CourtOwner, authorize!.Roles ?? "");
            Assert.Contains(Roles.Admin, authorize.Roles ?? "");
        }
    }

    [Fact]
    public void OwnerControllers_UseApiControllerAttribute()
    {
        foreach (var controller in GetOwnerControllers())
        {
            Assert.NotNull(controller.GetCustomAttribute<ApiControllerAttribute>(inherit: true));
        }
    }
}
