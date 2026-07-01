using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using ProSport.Application.DTOs;
using ProSport.Application.DTOs.Owner;
using ProSport.Application.Exceptions;
using ProSport.Application.Interfaces;
using ProSport.Application.Services;
using ProSport.Domain.Constants;
using ProSport.Domain.Entities;

namespace ProSport.Tests;

public class OwnerOperationsTests
{
    [Fact]
    public void CourtStatuses_Maintenance_IsNotBookable()
    {
        Assert.False(CourtStatuses.IsBookable(CourtStatuses.Maintenance));
        Assert.False(CourtStatuses.IsBookable(CourtStatuses.Inactive));
        Assert.True(CourtStatuses.IsBookable(CourtStatuses.Active));
    }

    [Fact]
    public async Task CreatePricingRuleAsync_Returns409_WhenRulesOverlap()
    {
        var courtRepo = new Mock<ICourtRepository>();
        courtRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(new Court { CourtId = 1, ComplexId = 1, Status = CourtStatuses.Active });
        courtRepo.Setup(r => r.GetPricingRulesByCourtIdAsync(1)).ReturnsAsync(new List<PricingRule>
        {
            new() { PricingRuleId = 1, StartTime = new TimeSpan(8, 0, 0), EndTime = new TimeSpan(12, 0, 0), DayOfWeek = 1, Status = "Active" }
        });

        var svc = new CourtService(courtRepo.Object, Mock.Of<IComplexScheduleService>(), Mock.Of<ILogger<CourtService>>());
        var result = await svc.CreatePricingRuleAsync(1, new CreatePricingRuleDto
        {
            StartTime = new TimeSpan(10, 0, 0),
            EndTime = new TimeSpan(11, 0, 0),
            DayOfWeek = 1,
            PricePerHour = 150000
        });

        result.StatusCode.Should().Be(409);
    }

    [Fact]
    public async Task RequireComplexAccess_Throws_WhenOwnerAccessesOtherComplex()
    {
        var complexRepo = new Mock<IComplexOwnerRepository>();
        complexRepo.Setup(r => r.IsUserOwnerOfComplexAsync(1, 99)).ReturnsAsync(false);
        var svc = new OwnerAccessService(complexRepo.Object, Mock.Of<IComplexRepository>(), Mock.Of<IUserRepository>(), Mock.Of<ICourtRepository>(), Mock.Of<IBookingRepository>(), Mock.Of<IRentalSessionRepository>());
        await Assert.ThrowsAsync<OwnerAccessDeniedException>(() => svc.RequireComplexAccessAsync(1, 99));
    }

    [Fact]
    public async Task RequireBookingAccess_Throws403_WhenBookingInOtherComplex()
    {
        var complexRepo = new Mock<IComplexOwnerRepository>();
        complexRepo.Setup(r => r.GetByUserIdAsync(1)).ReturnsAsync(new List<ComplexOwner>
        {
            new() { ComplexId = 1, Status = "Active" }
        });

        var bookingRepo = new Mock<IBookingRepository>();
        bookingRepo.Setup(r => r.GetByIdAsync(10)).ReturnsAsync(new Booking
        {
            BookingId = 10,
            BookingDetails = new List<BookingDetail> { new() { CourtId = 5 } }
        });

        var courtRepo = new Mock<ICourtRepository>();
        courtRepo.Setup(r => r.GetByIdAsync(5)).ReturnsAsync(new Court { CourtId = 5, ComplexId = 2 });

        var svc = new OwnerAccessService(complexRepo.Object, Mock.Of<IComplexRepository>(), Mock.Of<IUserRepository>(), courtRepo.Object, bookingRepo.Object, Mock.Of<IRentalSessionRepository>());
        await Assert.ThrowsAsync<OwnerAccessDeniedException>(() => svc.RequireBookingAccessAsync(1, 10, false));
    }

    [Fact]
    public async Task OwnerStaffService_RejectsAdminRoleAssignment()
    {
        var userRepo = new Mock<IUserRepository>();
        userRepo.Setup(r => r.GetByEmailAsync("admin@test.com")).ReturnsAsync(new User { UserId = 1, Role = Roles.Admin, Email = "admin@test.com" });
        var svc = new OwnerStaffService(Mock.Of<IStaffAssignmentRepository>(), userRepo.Object);
        var result = await svc.AssignStaffAsync(2, new CreateStaffAssignmentDto { Email = "admin@test.com", ComplexId = 1 });
        Assert.Equal(403, result.StatusCode);
    }

    [Fact]
    public async Task OwnerCourtService_RejectsDuplicateCode()
    {
        var courtRepo = new Mock<ICourtRepository>();
        courtRepo.Setup(r => r.ExistsCodeInComplexAsync(1, "C1", null)).ReturnsAsync(true);
        var svc = new OwnerCourtService(courtRepo.Object, Mock.Of<IAuditLogService>(), Mock.Of<IBookingRepository>(), Mock.Of<IBookingService>());
        var result = await svc.CreateCourtAsync(1, new OwnerCourtCreateDto { ComplexId = 1, Name = "Sân 1", Code = "C1", CourtTypeId = 1 });
        Assert.Equal(409, result.StatusCode);
    }

    [Fact]
    public async Task DeleteCourtAsync_BlocksDelete_WhenCourtHasActiveBookings()
    {
        var courtRepo = new Mock<ICourtRepository>();
        courtRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(new Court { CourtId = 1, IsDeleted = false });
        courtRepo.Setup(r => r.HasActiveBookingsAsync(1)).ReturnsAsync(true);

        var svc = new CourtService(courtRepo.Object, Mock.Of<IComplexScheduleService>(), Mock.Of<ILogger<CourtService>>());
        var result = await svc.DeleteCourtAsync(1);

        result.StatusCode.Should().Be(400);
        courtRepo.Verify(r => r.UpdateAsync(It.IsAny<Court>()), Times.Never);
    }

    [Fact]
    public async Task DeleteCourtAsync_SoftDeletes_WhenNoActiveBookings()
    {
        var court = new Court { CourtId = 1, IsDeleted = false };
        var courtRepo = new Mock<ICourtRepository>();
        courtRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(court);
        courtRepo.Setup(r => r.HasActiveBookingsAsync(1)).ReturnsAsync(false);

        var svc = new CourtService(courtRepo.Object, Mock.Of<IComplexScheduleService>(), Mock.Of<ILogger<CourtService>>());
        var result = await svc.DeleteCourtAsync(1);

        result.StatusCode.Should().Be(200);
        court.IsDeleted.Should().BeTrue();
        courtRepo.Verify(r => r.UpdateAsync(court), Times.Once);
    }

    [Fact]
    public async Task CreateWalkInBookingAsync_Returns409_WhenSlotAlreadyBooked()
    {
        var court = new Court
        {
            CourtId = 1,
            ComplexId = 1,
            Status = CourtStatuses.Active,
            PricingRules = new List<PricingRule> { new() { StartTime = TimeSpan.Zero, EndTime = new TimeSpan(23, 59, 59), PricePerHour = 100000 } }
        };

        var courtRepo = new Mock<ICourtRepository>();
        courtRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(court);

        var userRepo = new Mock<IUserRepository>();
        userRepo.Setup(r => r.GetByEmailAsync("walkin@prosport.vn")).ReturnsAsync(new User { UserId = 99, Email = "walkin@prosport.vn" });

        var bookingRepo = new Mock<IBookingRepository>();
        bookingRepo.Setup(r => r.CreateWithTransactionAsync(It.IsAny<Booking>()))
            .ThrowsAsync(new InvalidOperationException("Sân 1 đã được đặt trong khung giờ 10:00 - 11:00. Vui lòng chọn giờ khác."));

        var staffGuard = new Mock<IStaffOperationGuard>();
        staffGuard.Setup(g => g.EnsureCanCreateWalkInAsync(It.IsAny<int>(), It.IsAny<int>())).Returns(Task.CompletedTask);

        var svc = CreateBookingService(bookingRepo, courtRepo, userRepo.Object, staffGuard.Object);

        var vnTz = TimeZoneInfo.FindSystemTimeZoneById(OperatingSystem.IsWindows() ? "SE Asia Standard Time" : "Asia/Ho_Chi_Minh");
        var tomorrow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, vnTz).AddDays(1).Date;

        var result = await svc.CreateWalkInBookingAsync(new WalkInBookingDto
        {
            CustomerName = "Khách lẻ",
            Details = new List<CreateBookingDetailDto>
            {
                new() { CourtId = 1, BookingDate = tomorrow, StartTime = new TimeSpan(10, 0, 0), EndTime = new TimeSpan(11, 0, 0) }
            }
        }, staffId: 2);

        result.StatusCode.Should().Be(409);
    }

    [Fact]
    public async Task CreateBookingAsync_Returns409_WhenConcurrentBookingLosesRace()
    {
        var court = new Court
        {
            CourtId = 1,
            Status = CourtStatuses.Active,
            PricingRules = new List<PricingRule> { new() { StartTime = TimeSpan.Zero, EndTime = new TimeSpan(23, 59, 59), PricePerHour = 100000 } }
        };

        var courtRepo = new Mock<ICourtRepository>();
        courtRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(court);

        var bookingRepo = new Mock<IBookingRepository>();
        bookingRepo.Setup(r => r.GetByUserIdAsync(It.IsAny<int>())).ReturnsAsync(new List<Booking>());
        bookingRepo.Setup(r => r.CreateWithTransactionAsync(It.IsAny<Booking>()))
            .ThrowsAsync(new InvalidOperationException("Sân 1 đã được đặt trong khung giờ 10:00 - 12:00. Vui lòng chọn giờ khác."));

        var svc = CreateBookingService(bookingRepo, courtRepo, Mock.Of<IUserRepository>(), Mock.Of<IStaffOperationGuard>());

        var vnTz = TimeZoneInfo.FindSystemTimeZoneById(OperatingSystem.IsWindows() ? "SE Asia Standard Time" : "Asia/Ho_Chi_Minh");
        var tomorrow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, vnTz).AddDays(1).Date;

        var result = await svc.CreateBookingAsync(new CreateBookingDto
        {
            UserId = 1,
            Details = new List<CreateBookingDetailDto>
            {
                new() { CourtId = 1, BookingDate = tomorrow, StartTime = new TimeSpan(10, 0, 0), EndTime = new TimeSpan(12, 0, 0) }
            }
        });

        result.StatusCode.Should().Be(409);
    }

    [Fact]
    public async Task ProcessCheckInAsync_Returns403_WhenStaffDisabled()
    {
        var booking = new Booking
        {
            BookingId = 5,
            Status = BookingStatus.Confirmed,
            CheckInCode = "QR-5-TEST",
            BookingDetails = new List<BookingDetail>
            {
                new() { CourtId = 1, BookingDate = DateTime.UtcNow.Date, StartTime = new TimeSpan(8, 0, 0), EndTime = new TimeSpan(10, 0, 0) }
            }
        };

        var bookingRepo = new Mock<IBookingRepository>();
        bookingRepo.Setup(r => r.GetByCheckInCodeAsync("QR-5-TEST")).ReturnsAsync(booking);

        var courtRepo = new Mock<ICourtRepository>();
        courtRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(new Court { CourtId = 1, ComplexId = 1 });

        var staffGuard = new Mock<IStaffOperationGuard>();
        staffGuard.Setup(g => g.EnsureCanCheckInAsync(2, 1))
            .ThrowsAsync(new OwnerAccessDeniedException("Nhân viên không có quyền check-in."));

        var svc = CreateBookingService(bookingRepo, courtRepo, Mock.Of<IUserRepository>(), staffGuard.Object);

        var result = await svc.ProcessCheckInAsync("QR-5-TEST", staffId: 2);
        result.StatusCode.Should().Be(403);
    }

    [Fact]
    public async Task StaffOperationGuard_BlocksInactiveStaffCheckIn()
    {
        var userRepo = new Mock<IUserRepository>();
        userRepo.Setup(r => r.GetByIdAsync(2)).ReturnsAsync(new User { UserId = 2, Role = Roles.Staff });

        var staffRepo = new Mock<IStaffAssignmentRepository>();
        staffRepo.Setup(r => r.GetByStaffAndComplexAsync(2, 1)).ReturnsAsync(new StaffAssignment
        {
            StaffUserId = 2,
            ComplexId = 1,
            Status = "Inactive",
            CanCheckIn = true
        });

        var guard = new StaffOperationGuard(userRepo.Object, staffRepo.Object);
        await Assert.ThrowsAsync<OwnerAccessDeniedException>(() => guard.EnsureCanCheckInAsync(2, 1));
    }

    [Fact]
    public async Task OwnerStaffService_RevertsRoleToCustomer_WhenLastAssignmentRemoved()
    {
        var user = new User { UserId = 5, Role = Roles.Staff, Email = "staff@test.com" };
        var assignment = new StaffAssignment { StaffAssignmentId = 1, StaffUserId = 5, ComplexId = 1 };

        var staffRepo = new Mock<IStaffAssignmentRepository>();
        staffRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(assignment);
        staffRepo.Setup(r => r.DeleteAsync(assignment)).Returns(Task.CompletedTask);
        staffRepo.Setup(r => r.CountByStaffUserIdAsync(5)).ReturnsAsync(0);

        var userRepo = new Mock<IUserRepository>();
        userRepo.Setup(r => r.GetByIdAsync(5)).ReturnsAsync(user);
        userRepo.Setup(r => r.UpdateAsync(It.IsAny<User>())).Returns(Task.CompletedTask);

        var svc = new OwnerStaffService(staffRepo.Object, userRepo.Object);
        var result = await svc.RemoveAssignmentAsync(1, 1);

        result.StatusCode.Should().Be(200);
        user.Role.Should().Be(Roles.Customer);
        userRepo.Verify(r => r.UpdateAsync(user), Times.Once);
    }

    [Fact]
    public async Task CancelAndRefundSystemAsync_FullRefundsPaidBooking()
    {
        var booking = new Booking
        {
            BookingId = 10,
            UserId = 3,
            TotalAmount = 200000m,
            Status = BookingStatus.Confirmed,
            PaymentStatus = PaymentStatus.Paid
        };

        var bookingRepo = new Mock<IBookingRepository>();
        bookingRepo.Setup(r => r.GetByIdAsync(10)).ReturnsAsync(booking);
        bookingRepo.Setup(r => r.UpdateAsync(It.IsAny<Booking>())).Returns(Task.CompletedTask);

        var wallet = new EscrowWallet { EscrowWalletId = 1, UserId = 3, Balance = 0 };
        var escrowRepo = new Mock<IEscrowRepository>();
        escrowRepo.Setup(r => r.CancelBookingWithRefundAsync(
                10,
                0m,
                200000m,
                "Bảo trì sân",
                "SystemCancel_10"))
            .ReturnsAsync(true);

        var notifications = new Mock<INotificationService>();
        notifications.Setup(n => n.SendToUserAsync(It.IsAny<int>(), It.IsAny<RealtimeNotificationDto>()))
            .Returns(Task.CompletedTask);

        var svc = new BookingService(
            bookingRepo.Object,
            Mock.Of<ICourtRepository>(),
            escrowRepo.Object,
            Mock.Of<IUserRepository>(),
            Mock.Of<IEmailService>(),
            Mock.Of<ILogger<BookingService>>(),
            Mock.Of<IStaffOperationGuard>(),
            Mock.Of<ICancellationPolicyService>(),
            Mock.Of<IMembershipService>(),
            notifications.Object);

        var result = await svc.CancelAndRefundSystemAsync(10, "Bảo trì sân");

        result.StatusCode.Should().Be(200);
        escrowRepo.Verify(r => r.CancelBookingWithRefundAsync(
            10,
            0m,
            200000m,
            "Bảo trì sân",
            "SystemCancel_10"), Times.Once);
        notifications.Verify(n => n.SendToUserAsync(3, It.IsAny<RealtimeNotificationDto>()), Times.Once);
    }

    [Fact]
    public async Task OwnerCourtService_CancelsFutureBookings_WhenSetToMaintenance()
    {
        var court = new Court { CourtId = 1, ComplexId = 1, Name = "Sân A", Status = CourtStatuses.Active };
        var courtRepo = new Mock<ICourtRepository>();
        courtRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(court);
        courtRepo.Setup(r => r.UpdateAsync(It.IsAny<Court>())).Returns(Task.CompletedTask);

        var bookingRepo = new Mock<IBookingRepository>();
        bookingRepo.Setup(r => r.GetActiveFutureBookingIdsByCourtAsync(1))
            .ReturnsAsync(new List<int> { 100, 101 });

        var bookingService = new Mock<IBookingService>();
        bookingService.Setup(s => s.CancelAndRefundSystemAsync(It.IsAny<int>(), It.IsAny<string>()))
            .ReturnsAsync(new ApiResponseDto<bool>(200, "OK", true));

        var svc = new OwnerCourtService(
            courtRepo.Object,
            Mock.Of<IAuditLogService>(),
            bookingRepo.Object,
            bookingService.Object);

        var result = await svc.UpdateCourtStatusAsync(1, 1, "MAINTENANCE");

        result.StatusCode.Should().Be(200);
        court.Status.Should().Be(CourtStatuses.Maintenance);
        bookingService.Verify(s => s.CancelAndRefundSystemAsync(100, It.IsAny<string>()), Times.Once);
        bookingService.Verify(s => s.CancelAndRefundSystemAsync(101, It.IsAny<string>()), Times.Once);
    }

    private static BookingService CreateBookingService(
        Mock<IBookingRepository> bookingRepo,
        Mock<ICourtRepository> courtRepo,
        IUserRepository userRepo,
        IStaffOperationGuard staffGuard)
    {
        return new BookingService(
            bookingRepo.Object,
            courtRepo.Object,
            Mock.Of<IEscrowRepository>(),
            userRepo,
            Mock.Of<IEmailService>(),
            Mock.Of<ILogger<BookingService>>(),
            staffGuard,
            Mock.Of<ICancellationPolicyService>(),
            Mock.Of<IMembershipService>(),
            Mock.Of<INotificationService>());
    }
}
