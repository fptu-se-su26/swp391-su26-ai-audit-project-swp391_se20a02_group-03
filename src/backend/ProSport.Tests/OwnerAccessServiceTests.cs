using Moq;
using ProSport.Application.Exceptions;
using ProSport.Application.Interfaces;
using ProSport.Application.Services;
using ProSport.Domain.Constants;
using ProSport.Domain.Entities;

namespace ProSport.Tests;

public class OwnerAccessServiceTests
{
    private readonly Mock<IComplexOwnerRepository> _complexOwnerRepo = new();
    private readonly Mock<IComplexRepository> _complexRepo = new();
    private readonly Mock<IUserRepository> _userRepo = new();
    private readonly Mock<ICourtRepository> _courtRepo = new();
    private readonly Mock<IBookingRepository> _bookingRepo = new();

    private OwnerAccessService CreateService() =>
        new(_complexOwnerRepo.Object, _complexRepo.Object, _userRepo.Object, _courtRepo.Object, _bookingRepo.Object);

    [Fact]
    public async Task HasAccessToComplex_ReturnsTrue_WhenOwnerLinked()
    {
        _complexOwnerRepo.Setup(r => r.IsUserOwnerOfComplexAsync(1, 10)).ReturnsAsync(true);
        var svc = CreateService();
        Assert.True(await svc.HasAccessToComplexAsync(1, 10));
    }

    [Fact]
    public async Task CanManageComplex_ReturnsFalse_WhenNotLinked()
    {
        _complexOwnerRepo.Setup(r => r.IsUserOwnerOfComplexAsync(1, 99)).ReturnsAsync(false);
        var svc = CreateService();
        Assert.False(await svc.CanManageComplexAsync(1, 99));
    }

    [Fact]
    public async Task RequireComplexAccess_Throws_WhenOwnerA_AccessesComplexB()
    {
        _complexOwnerRepo.Setup(r => r.IsUserOwnerOfComplexAsync(1, 99)).ReturnsAsync(false);
        var svc = CreateService();
        await Assert.ThrowsAsync<OwnerAccessDeniedException>(() => svc.RequireComplexAccessAsync(1, 99));
    }

    [Fact]
    public async Task RequireCourtAccess_ThrowsNotFound_WhenCourtOtherComplex()
    {
        _complexOwnerRepo.Setup(r => r.GetByUserIdAsync(1)).ReturnsAsync(new List<ComplexOwner>
        {
            new() { ComplexId = 1, Status = "Active", Complex = new Complex { ComplexId = 1, Name = "A" } }
        });
        _complexOwnerRepo.Setup(r => r.IsUserOwnerOfComplexAsync(1, 2)).ReturnsAsync(false);
        _courtRepo.Setup(r => r.GetByIdAsync(5)).ReturnsAsync(new Court { CourtId = 5, ComplexId = 2, Name = "X" });

        var svc = CreateService();
        await Assert.ThrowsAsync<OwnerResourceNotFoundException>(() => svc.RequireCourtAccessAsync(1, 5, false));
    }

    [Fact]
    public async Task RequireComplexAccess_SkipsCheck_ForAdmin()
    {
        var svc = CreateService();
        await svc.RequireComplexAccessAsync(1, 999, isAdmin: true);
        _complexOwnerRepo.Verify(r => r.IsUserOwnerOfComplexAsync(It.IsAny<int>(), It.IsAny<int>()), Times.Never);
    }

    [Fact]
    public async Task RequireOwnerRole_Throws_ForCustomer()
    {
        _userRepo.Setup(r => r.GetByIdAsync(5)).ReturnsAsync(new User { UserId = 5, Role = Roles.Customer });
        var svc = CreateService();
        await Assert.ThrowsAsync<OwnerAccessDeniedException>(() => svc.RequireOwnerRoleAsync(5));
    }

    [Fact]
    public async Task RequireOwnerRole_Succeeds_ForCourtOwner()
    {
        _userRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(new User { UserId = 1, Role = Roles.CourtOwner });
        var svc = CreateService();
        await svc.RequireOwnerRoleAsync(1);
    }

    [Fact]
    public async Task GetManagedComplexIds_ReturnsOnlyAssignedComplexes()
    {
        _complexOwnerRepo.Setup(r => r.GetByUserIdAsync(1)).ReturnsAsync(new List<ComplexOwner>
        {
            new() { ComplexId = 1, Status = "Active" },
            new() { ComplexId = 3, Status = "Active" },
        });
        var svc = CreateService();
        var ids = await svc.GetManagedComplexIdsAsync(1);
        Assert.Equal(new[] { 1, 3 }, ids);
    }
}
