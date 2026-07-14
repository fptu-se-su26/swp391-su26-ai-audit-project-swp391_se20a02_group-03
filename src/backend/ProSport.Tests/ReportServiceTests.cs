using FluentAssertions;
using Moq;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using ProSport.Application.Services;
using ProSport.Domain.Constants;
using ProSport.Domain.Entities;
using Xunit;

namespace ProSport.Tests;

public class ReportServiceTests
{
    private readonly Mock<IReportRepository> _reportRepo = new();
    private readonly Mock<IUserRepository> _userRepo = new();
    private readonly Mock<IMatchRepository> _matchRepo = new();

    private ReportService CreateService() => new(_reportRepo.Object, _userRepo.Object, _matchRepo.Object);

    // Chống bịa báo cáo: người báo cáo phải cùng tham gia trận đấu với người bị báo cáo.
    [Fact]
    public async Task CreateReport_Returns403_WhenReporterNotParticipantOfMatch()
    {
        _userRepo.Setup(r => r.GetByIdAsync(2)).ReturnsAsync(new User { UserId = 2 });
        _matchRepo.Setup(r => r.GetMatchByIdAsync(10)).ReturnsAsync(new ProSport.Domain.Entities.Match { MatchId = 10 });
        _matchRepo.Setup(r => r.GetParticipantAsync(10, 1)).ReturnsAsync((MatchParticipant?)null);
        _matchRepo.Setup(r => r.GetParticipantAsync(10, 2))
            .ReturnsAsync(new MatchParticipant { UserId = 2, Status = MatchParticipantStatus.Approved });

        var result = await CreateService().CreateAsync(1, new CreateReportDto { ReportedUserId = 2, MatchId = 10, Reason = "Bùng kèo" });

        result.StatusCode.Should().Be(403);
        _reportRepo.Verify(r => r.AddAsync(It.IsAny<Report>()), Times.Never);
    }
}
