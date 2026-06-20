using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using ProSport.Application.Services;
using ProSport.Domain.Entities;
using Xunit;

namespace ProSport.Tests;

public class BookingServiceTests
{
    private readonly Mock<IBookingRepository> _bookingRepoMock;
    private readonly Mock<ICourtRepository> _courtRepoMock;
    private readonly Mock<IEscrowRepository> _escrowRepoMock;
    private readonly Mock<IEmailService> _emailServiceMock;
    private readonly Mock<ILogger<BookingService>> _loggerMock;
    private readonly BookingService _bookingService;

    public BookingServiceTests()
    {
        _bookingRepoMock = new Mock<IBookingRepository>();
        _courtRepoMock = new Mock<ICourtRepository>();
        _escrowRepoMock = new Mock<IEscrowRepository>();
        _emailServiceMock = new Mock<IEmailService>();
        _loggerMock = new Mock<ILogger<BookingService>>();

        _bookingService = new BookingService(
            _bookingRepoMock.Object,
            _courtRepoMock.Object,
            _escrowRepoMock.Object,
            _emailServiceMock.Object,
            _loggerMock.Object);
    }

    [Fact]
    public async Task CreateBookingAsync_ValidatesPastDate()
    {
        // Arrange
        var userId = 1;
        var dto = new CreateBookingDto
        {
            UserId = userId,
            Details = new List<CreateBookingDetailDto>
            {
                new CreateBookingDetailDto
                {
                    CourtId = 1,
                    BookingDate = DateTime.UtcNow.AddDays(-1).Date, // Past date
                    StartTime = new TimeSpan(10, 0, 0),
                    EndTime = new TimeSpan(11, 0, 0)
                }
            }
        };

        // Act
        var result = await _bookingService.CreateBookingAsync(dto);

        // Assert
        result.StatusCode.Should().Be(400);
        result.Message.Should().Contain("quá khứ");
    }

    [Fact]
    public async Task CreateBookingAsync_DelegatesToCreateWithTransactionAsync()
    {
        // Arrange
        var userId = 1;
        var courtId = 1;
        var vnTimeZone = TimeZoneInfo.FindSystemTimeZoneById(OperatingSystem.IsWindows() ? "SE Asia Standard Time" : "Asia/Ho_Chi_Minh");
        var tomorrow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, vnTimeZone).AddDays(1).Date;
        
        var dto = new CreateBookingDto
        {
            UserId = userId,
            Details = new List<CreateBookingDetailDto>
            {
                new CreateBookingDetailDto
                {
                    CourtId = courtId,
                    BookingDate = tomorrow,
                    StartTime = new TimeSpan(10, 0, 0),
                    EndTime = new TimeSpan(12, 0, 0) // 2 hours
                }
            }
        };

        var court = new Court 
        { 
            CourtId = courtId, 
            Status = "Available",
            PricingRules = new List<PricingRule>
            {
                new PricingRule { StartTime = new TimeSpan(0,0,0), EndTime = new TimeSpan(23,59,59), PricePerHour = 100000m }
            }
        };

        _courtRepoMock.Setup(x => x.GetByIdAsync(courtId)).ReturnsAsync(court);
        
        var expectedBooking = new Booking { BookingId = 10, TotalAmount = 200000m, Status = "Pending" };
        _bookingRepoMock.Setup(x => x.CreateWithTransactionAsync(It.IsAny<Booking>())).ReturnsAsync(expectedBooking);

        // Act
        var result = await _bookingService.CreateBookingAsync(dto);

        // Assert
        result.StatusCode.Should().Be(201);
        _bookingRepoMock.Verify(x => x.CreateWithTransactionAsync(It.Is<Booking>(b => b.TotalAmount == 200000m && b.BookingDetails.Count == 1)), Times.Once);
        // Overlap checking is now done inside CreateWithTransactionAsync, so GetAvailableCourtsAsync shouldn't be called
        _courtRepoMock.Verify(x => x.GetAvailableCourtsAsync(It.IsAny<DateTime>(), It.IsAny<TimeSpan>(), It.IsAny<TimeSpan>()), Times.Never);
    }
}
