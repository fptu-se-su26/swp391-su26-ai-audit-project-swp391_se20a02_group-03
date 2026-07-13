using FluentAssertions;
using Moq;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using ProSport.Application.Services;
using ProSport.Domain.Constants;
using ProSport.Domain.Entities;
using Xunit;

namespace ProSport.Tests;

public class RatingServiceTests
{
    private readonly Mock<IPlayerRatingRepository> _ratingRepo = new();
    private readonly Mock<IUserRepository> _userRepo = new();
    private readonly Mock<IMatchRepository> _matchRepo = new();

    private RatingService CreateService() => new(_ratingRepo.Object, _userRepo.Object, _matchRepo.Object);

    // TK-035: chống spam đánh giá — người chấm phải cùng tham gia trận đấu với người bị chấm.
    [Fact]
    public async Task CreateRating_Returns403_WhenRaterNotParticipantOfMatch()
    {
        _userRepo.Setup(r => r.GetByIdAsync(2)).ReturnsAsync(new User { UserId = 2, Role = "Customer" });
        _matchRepo.Setup(r => r.GetMatchByIdAsync(10)).ReturnsAsync(new ProSport.Domain.Entities.Match { MatchId = 10 });
        _matchRepo.Setup(r => r.GetParticipantAsync(10, 1)).ReturnsAsync((MatchParticipant?)null);
        _matchRepo.Setup(r => r.GetParticipantAsync(10, 2))
            .ReturnsAsync(new MatchParticipant { UserId = 2, Status = MatchParticipantStatus.Approved });

        var result = await CreateService().CreateRatingAsync(1, new CreateRatingDto { RatedUserId = 2, MatchId = 10, Score = 5 });

        result.StatusCode.Should().Be(403);
        _ratingRepo.Verify(r => r.AddAsync(It.IsAny<PlayerRating>()), Times.Never);
    }

    [Fact]
    public async Task CreateRating_Succeeds_WhenBothAreApprovedParticipants()
    {
        _userRepo.Setup(r => r.GetByIdAsync(2)).ReturnsAsync(new User { UserId = 2, Role = "Customer" });
        _matchRepo.Setup(r => r.GetMatchByIdAsync(10)).ReturnsAsync(new ProSport.Domain.Entities.Match { MatchId = 10 });
        _matchRepo.Setup(r => r.GetParticipantAsync(10, 1))
            .ReturnsAsync(new MatchParticipant { UserId = 1, Status = MatchParticipantStatus.Approved });
        _matchRepo.Setup(r => r.GetParticipantAsync(10, 2))
            .ReturnsAsync(new MatchParticipant { UserId = 2, Status = MatchParticipantStatus.Approved });
        _ratingRepo.Setup(r => r.ExistsAsync(1, 2, 10)).ReturnsAsync(false);
        _ratingRepo.Setup(r => r.AddAsync(It.IsAny<PlayerRating>())).ReturnsAsync((PlayerRating p) => p);

        var result = await CreateService().CreateRatingAsync(1, new CreateRatingDto { RatedUserId = 2, MatchId = 10, Score = 5, Comment = "gg" });

        result.StatusCode.Should().Be(201);
        _ratingRepo.Verify(r => r.AddAsync(It.IsAny<PlayerRating>()), Times.Once);
    }
}
