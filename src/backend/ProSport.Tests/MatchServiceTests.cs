using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using ProSport.Application.Interfaces;
using ProSport.Application.Services;
using ProSport.Domain.Entities;
using Xunit;

namespace ProSport.Tests;

public class MatchServiceTests
{
    private readonly Mock<IMatchRepository> _matchRepoMock;
    private readonly Mock<IBookingRepository> _bookingRepoMock;
    private readonly Mock<IEscrowService> _escrowServiceMock;
    private readonly Mock<ILogger<MatchService>> _loggerMock;
    private readonly MatchService _matchService;

    public MatchServiceTests()
    {
        _matchRepoMock = new Mock<IMatchRepository>();
        _bookingRepoMock = new Mock<IBookingRepository>();
        _escrowServiceMock = new Mock<IEscrowService>();
        _loggerMock = new Mock<ILogger<MatchService>>();

        var cancelPolicyMock = new Mock<ICancellationPolicyService>();
        cancelPolicyMock.Setup(c => c.CalculateMatchLeaveReleaseAsync(It.IsAny<int>(), It.IsAny<DateTime>()))
            .ReturnsAsync((0m, "Mất 100% cọc (rút dưới 24h)."));

        var courtRepoMock = new Mock<ICourtRepository>();
        courtRepoMock.Setup(c => c.GetByIdAsync(It.IsAny<int>()))
            .ReturnsAsync(new Court { CourtId = 1, ComplexId = 1 });

        _matchService = new MatchService(
            _matchRepoMock.Object,
            _bookingRepoMock.Object,
            _escrowServiceMock.Object,
            cancelPolicyMock.Object,
            courtRepoMock.Object,
            _loggerMock.Object);
    }

    [Fact]
    public async Task LeaveMatchAsync_WhenMatchIsNull_Returns404()
    {
        // Arrange
        var matchId = 1;
        var userId = 2;
        
        _matchRepoMock.Setup(x => x.GetParticipantAsync(matchId, userId))
            .ReturnsAsync(new MatchParticipant { MatchId = matchId, UserId = userId, Role = ProSport.Domain.Constants.MatchParticipantRole.Joiner });
            
        // Setup GetMatchByIdAsync to return null (simulating data inconsistency)
        _matchRepoMock.Setup(x => x.GetMatchByIdAsync(matchId))
            .ReturnsAsync((ProSport.Domain.Entities.Match)null);

        // Act
        var result = await _matchService.LeaveMatchAsync(matchId, userId);

        // Assert
        result.StatusCode.Should().Be(404);
        result.Message.Should().Be("Kèo không tồn tại");
    }

    [Fact]
    public async Task LeaveMatchAsync_WhenLessThan12Hours_PenalizesJoiner()
    {
        // Arrange
        var matchId = 1;
        var userId = 2;
        var escrowAmount = 50000m;
        
        var participant = new MatchParticipant 
        { 
            MatchId = matchId, 
            UserId = userId, 
            Role = ProSport.Domain.Constants.MatchParticipantRole.Joiner,
            HasPaidEscrow = true,
            Status = ProSport.Domain.Constants.MatchParticipantStatus.Approved
        };

        var vnTimeZone = TimeZoneInfo.FindSystemTimeZoneById(OperatingSystem.IsWindows() ? "SE Asia Standard Time" : "Asia/Ho_Chi_Minh");
        var now = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, vnTimeZone);
        
        // Match is 6 hours from now (< 12h)
        var matchDate = now.Date;
        var startTime = now.TimeOfDay.Add(TimeSpan.FromHours(6));
        // Handle overflow if startTime > 24h
        if (startTime.TotalHours >= 24)
        {
            matchDate = matchDate.AddDays(1);
            startTime = startTime.Subtract(TimeSpan.FromHours(24));
        }

        var match = new ProSport.Domain.Entities.Match 
        { 
            MatchId = matchId, 
            EscrowAmount = escrowAmount,
            MatchDate = matchDate,
            StartTime = startTime,
            CurrentParticipants = 2
        };
        
        _matchRepoMock.Setup(x => x.GetParticipantAsync(matchId, userId))
            .ReturnsAsync(participant);
            
        _matchRepoMock.Setup(x => x.GetMatchByIdAsync(matchId))
            .ReturnsAsync(match);

        // Act
        var result = await _matchService.LeaveMatchAsync(matchId, userId);

        // Assert
        result.StatusCode.Should().Be(200);
        result.Message.Should().Contain("Mất");
        
        // Verify escrow service called DeductLockedFundsAsync
        _escrowServiceMock.Verify(x => x.DeductLockedFundsAsync(userId, escrowAmount, matchId, It.IsAny<string>()), Times.Once);
        
        // Verify HasPaidEscrow is reset
        participant.HasPaidEscrow.Should().BeFalse();
        participant.Status.Should().Be(ProSport.Domain.Constants.MatchParticipantStatus.Rejected);
        
        // Verify match participant count decreased
        _matchRepoMock.Verify(x => x.UpdateMatchAsync(It.Is<ProSport.Domain.Entities.Match>(m => m.CurrentParticipants == 1)), Times.Once);
    }
}
