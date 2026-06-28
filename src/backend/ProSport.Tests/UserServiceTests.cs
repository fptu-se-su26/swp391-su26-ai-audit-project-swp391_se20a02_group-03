using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Moq;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using ProSport.Application.Services;
using ProSport.Domain.Entities;
using Xunit;

namespace ProSport.Tests;

// TK-010: kiểm thử nghiệp vụ quản lý người dùng (khóa/mở khóa + phân trang).
public class UserServiceTests
{
    private readonly Mock<IUserRepository> _userRepoMock;
    private readonly UserService _userService;

    public UserServiceTests()
    {
        _userRepoMock = new Mock<IUserRepository>();
        _userService = new UserService(_userRepoMock.Object);
    }

    [Fact]
    public async Task SetLockStatusAsync_WhenUserNotFound_Returns404()
    {
        _userRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<int>()))
            .ReturnsAsync((User?)null);

        var result = await _userService.SetLockStatusAsync(99, true);

        result.StatusCode.Should().Be(404);
        _userRepoMock.Verify(r => r.UpdateAsync(It.IsAny<User>()), Times.Never);
    }

    [Fact]
    public async Task SetLockStatusAsync_WhenLockingAdmin_ReturnsBadRequest()
    {
        var admin = new User { UserId = 1, Role = "Admin", IsLocked = false };
        _userRepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(admin);

        var result = await _userService.SetLockStatusAsync(1, true);

        result.StatusCode.Should().Be(400);
        admin.IsLocked.Should().BeFalse();
        _userRepoMock.Verify(r => r.UpdateAsync(It.IsAny<User>()), Times.Never);
    }

    [Fact]
    public async Task SetLockStatusAsync_WhenLockingCustomer_SucceedsAndPersists()
    {
        var customer = new User { UserId = 5, Role = "Customer", IsLocked = false };
        _userRepoMock.Setup(r => r.GetByIdAsync(5)).ReturnsAsync(customer);
        _userRepoMock.Setup(r => r.UpdateAsync(It.IsAny<User>())).Returns(Task.CompletedTask);

        var result = await _userService.SetLockStatusAsync(5, true);

        result.StatusCode.Should().Be(200);
        customer.IsLocked.Should().BeTrue();
        _userRepoMock.Verify(r => r.UpdateAsync(It.Is<User>(u => u.UserId == 5 && u.IsLocked)), Times.Once);
    }

    [Fact]
    public async Task GetUsersAsync_ReturnsPagedResult_WithCorrectTotalPages()
    {
        var users = new List<User>
        {
            new User { UserId = 1, FullName = "A", Email = "a@x.vn", Role = "Customer", EKycStatus = "Verified" },
            new User { UserId = 2, FullName = "B", Email = "b@x.vn", Role = "Customer", EKycStatus = "Pending" },
        };
        _userRepoMock.Setup(r => r.GetPagedAsync(null, null, 1, 10))
            .ReturnsAsync((users, 12));

        var parameters = new AdminUserQueryParameters { Page = 1, PageSize = 10 };
        var result = await _userService.GetUsersAsync(parameters);

        result.StatusCode.Should().Be(200);
        result.Data.Should().NotBeNull();
        result.Data!.Items.Should().HaveCount(2);
        result.Data.TotalCount.Should().Be(12);
        result.Data.TotalPages.Should().Be(2); // ceil(12 / 10)
    }
}
