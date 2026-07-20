using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using ProSport.Domain.Constants;
using ProSport.Domain.Entities;
using ProSport.Infrastructure.Data;
using ProSport.Infrastructure.Repositories;
using ProSport.Infrastructure.Services;
using DomainMatch = ProSport.Domain.Entities.Match;

namespace ProSport.Tests;

public class PlayerFeaturesServiceTests
{
    private static EloRatingService CreateEloService(ProSportDbContext db, Mock<IMatchRepository> matchRepo, Mock<INotificationService>? notifications = null)
    {
        notifications ??= new Mock<INotificationService>();
        notifications.Setup(n => n.SendToUserAsync(It.IsAny<int>(), It.IsAny<RealtimeNotificationDto>()))
            .Returns(Task.CompletedTask);
        return new EloRatingService(db, matchRepo.Object, notifications.Object, NullLogger<EloRatingService>.Instance);
    }

    private static ProSportDbContext CreateDb(string name)
    {
        var options = new DbContextOptionsBuilder<ProSportDbContext>()
            .UseInMemoryDatabase(name)
            .ConfigureWarnings(w => w.Ignore(InMemoryEventId.TransactionIgnoredWarning))
            .Options;
        return new ProSportDbContext(options);
    }

    [Fact]
    public async Task EloRating_RejectsNonParticipant()
    {
        await using var db = CreateDb(nameof(EloRating_RejectsNonParticipant));
        var matchRepo = new Mock<IMatchRepository>();
        matchRepo.Setup(r => r.GetMatchByIdAsync(1)).ReturnsAsync(new DomainMatch
        {
            MatchId = 1,
            HostId = 10,
            Participants = new List<MatchParticipant>
            {
                new() { UserId = 10, Status = MatchParticipantStatus.Approved }
            }
        });

        var svc = CreateEloService(db, matchRepo);
        var result = await svc.SubmitMatchResultAsync(99, new SubmitMatchResultDto
        {
            MatchId = 1,
            WinnerUserId = 10,
            LoserUserId = 11
        });

        result.StatusCode.Should().Be(403);
    }

    [Fact]
    public async Task EloRating_RejectsDuplicateResult()
    {
        await using var db = CreateDb(nameof(EloRating_RejectsDuplicateResult));
        db.MatchResults.Add(new MatchResult { MatchId = 1, Status = "Confirmed", ReportedByUserId = 10 });
        await db.SaveChangesAsync();

        var matchRepo = new Mock<IMatchRepository>();
        matchRepo.Setup(r => r.GetMatchByIdAsync(1)).ReturnsAsync(new DomainMatch
        {
            MatchId = 1,
            HostId = 10,
            Participants = new List<MatchParticipant>()
        });

        var svc = CreateEloService(db, matchRepo);
        var result = await svc.SubmitMatchResultAsync(10, new SubmitMatchResultDto
        {
            MatchId = 1,
            WinnerUserId = 10,
            LoserUserId = 11
        });

        result.StatusCode.Should().Be(409);
    }

    [Fact]
    public async Task EloRating_UsesCourtSportType_AfterOpponentConfirms()
    {
        await using var db = CreateDb(nameof(EloRating_UsesCourtSportType_AfterOpponentConfirms));
        var matchRepo = new Mock<IMatchRepository>();
        var match = new DomainMatch
        {
            MatchId = 1,
            HostId = 10,
            Court = new Court { CourtType = new CourtType { Name = "Pickleball" } },
            Participants = new List<MatchParticipant>
            {
                new() { UserId = 11, Status = MatchParticipantStatus.Approved }
            }
        };
        matchRepo.Setup(r => r.GetMatchByIdAsync(1)).ReturnsAsync(match);
        matchRepo.Setup(r => r.UpdateMatchAsync(It.IsAny<DomainMatch>())).Returns(Task.CompletedTask);

        var svc = CreateEloService(db, matchRepo);
        var submit = await svc.SubmitMatchResultAsync(10, new SubmitMatchResultDto
        {
            MatchId = 1,
            WinnerUserId = 10,
            LoserUserId = 11
        });

        submit.StatusCode.Should().Be(200);
        (await db.UserSkillRatings.CountAsync()).Should().Be(0);

        var confirm = await svc.ConfirmMatchResultAsync(11, 1);
        confirm.StatusCode.Should().Be(200);

        var confirmed = await db.MatchResults.FirstAsync();
        confirmed.ConfirmedByUserId.Should().Be(11);
        confirmed.ConfirmedAt.Should().NotBeNull();

        var rating = await db.UserSkillRatings.FirstAsync(r => r.UserId == 10);
        rating.SportType.Should().Be("Pickleball");
    }

    [Fact]
    public async Task EloRating_SubmitLeavesPendingWithoutEloChange()
    {
        await using var db = CreateDb(nameof(EloRating_SubmitLeavesPendingWithoutEloChange));
        var matchRepo = new Mock<IMatchRepository>();
        matchRepo.Setup(r => r.GetMatchByIdAsync(1)).ReturnsAsync(new DomainMatch
        {
            MatchId = 1,
            HostId = 10,
            Participants = new List<MatchParticipant>
            {
                new() { UserId = 11, Status = MatchParticipantStatus.Approved }
            }
        });

        var notifications = new Mock<INotificationService>();
        var svc = CreateEloService(db, matchRepo, notifications);
        var result = await svc.SubmitMatchResultAsync(10, new SubmitMatchResultDto
        {
            MatchId = 1,
            WinnerUserId = 10,
            LoserUserId = 11
        });

        result.StatusCode.Should().Be(200);
        var stored = await db.MatchResults.FirstAsync();
        stored.Status.Should().Be(MatchResultStatus.Pending);
        (await db.UserSkillRatings.CountAsync()).Should().Be(0);
        notifications.Verify(n => n.SendToUserAsync(11, It.IsAny<RealtimeNotificationDto>()), Times.Once);
    }

    [Fact]
    public async Task EloRating_ConfirmRequiresOpponent()
    {
        await using var db = CreateDb(nameof(EloRating_ConfirmRequiresOpponent));
        db.MatchResults.Add(new MatchResult
        {
            MatchId = 1,
            WinnerUserId = 10,
            LoserUserId = 11,
            ReportedByUserId = 10,
            Status = MatchResultStatus.Pending
        });
        await db.SaveChangesAsync();

        var matchRepo = new Mock<IMatchRepository>();
        matchRepo.Setup(r => r.GetMatchByIdAsync(1)).ReturnsAsync(new DomainMatch
        {
            MatchId = 1,
            HostId = 10,
            Participants = new List<MatchParticipant>
            {
                new() { UserId = 11, Status = MatchParticipantStatus.Approved }
            }
        });

        var svc = CreateEloService(db, matchRepo);
        var selfConfirm = await svc.ConfirmMatchResultAsync(10, 1);
        selfConfirm.StatusCode.Should().Be(403);
    }

    [Fact]
    public async Task EloRating_DisputeMarksResultWithoutEloChange()
    {
        await using var db = CreateDb(nameof(EloRating_DisputeMarksResultWithoutEloChange));
        db.MatchResults.Add(new MatchResult
        {
            MatchId = 1,
            WinnerUserId = 10,
            LoserUserId = 11,
            ReportedByUserId = 10,
            Status = MatchResultStatus.Pending
        });
        await db.SaveChangesAsync();

        var matchRepo = new Mock<IMatchRepository>();
        matchRepo.Setup(r => r.GetMatchByIdAsync(1)).ReturnsAsync(new DomainMatch
        {
            MatchId = 1,
            HostId = 10,
            Participants = new List<MatchParticipant>
            {
                new() { UserId = 11, Status = MatchParticipantStatus.Approved }
            }
        });

        var svc = CreateEloService(db, matchRepo);
        var result = await svc.DisputeMatchResultAsync(11, 1, "Score không khớp");

        result.StatusCode.Should().Be(200);
        var stored = await db.MatchResults.FirstAsync();
        stored.Status.Should().Be(MatchResultStatus.Disputed);
        stored.DisputeReason.Should().Be("Score không khớp");
        stored.DisputedAt.Should().NotBeNull();
        (await db.UserSkillRatings.CountAsync()).Should().Be(0);
    }

    [Fact]
    public async Task TournamentRegister_ChargesEntryFeeFromEscrow()
    {
        await using var db = CreateDb(nameof(TournamentRegister_ChargesEntryFeeFromEscrow));
        db.Users.Add(new User
        {
            UserId = 50,
            FullName = "Captain",
            Email = "cap@test.vn",
            PasswordHash = "x",
            Role = Roles.Customer,
            EKycStatus = "Verified"
        });
        db.EscrowWallets.Add(new EscrowWallet { UserId = 50, Balance = 600000, RowVersion = new byte[8] });
        db.Tournaments.Add(new Tournament
        {
            TournamentId = 1,
            ComplexId = 1,
            Name = "Paid Cup",
            StartDate = DateTime.UtcNow.AddDays(7),
            EndDate = DateTime.UtcNow.AddDays(8),
            EntryFee = 500000,
            MaxTeams = 8,
            RegisteredTeams = 0,
            Status = "Open"
        });
        await db.SaveChangesAsync();

        var svc = new TournamentService(db, Mock.Of<IOwnerAccessService>(), new EscrowRepository(db));
        var result = await svc.RegisterAsync(50, 1, new RegisterTournamentDto { TeamName = "Team X" });

        result.StatusCode.Should().Be(200);
        var wallet = await db.EscrowWallets.FirstAsync(w => w.UserId == 50);
        wallet.Balance.Should().Be(100000);
        var txn = await db.Transactions.FirstAsync();
        txn.Amount.Should().Be(500000);
        txn.ReferenceId.Should().Be("Tournament_1_Captain_50");
        var reg = await db.TournamentRegistrations.FirstAsync();
        reg.EntryFeePaid.Should().BeTrue();
        reg.PaymentTransactionId.Should().Be(txn.TransactionId);
    }

    [Fact]
    public async Task TournamentRegister_RejectsInsufficientBalance()
    {
        await using var db = CreateDb(nameof(TournamentRegister_RejectsInsufficientBalance));
        db.EscrowWallets.Add(new EscrowWallet { UserId = 51, Balance = 100000, RowVersion = new byte[8] });
        db.Tournaments.Add(new Tournament
        {
            TournamentId = 2,
            ComplexId = 1,
            Name = "Paid Cup",
            StartDate = DateTime.UtcNow.AddDays(7),
            EndDate = DateTime.UtcNow.AddDays(8),
            EntryFee = 500000,
            MaxTeams = 8,
            RegisteredTeams = 0,
            Status = "Open"
        });
        await db.SaveChangesAsync();

        var svc = new TournamentService(db, Mock.Of<IOwnerAccessService>(), new EscrowRepository(db));
        var result = await svc.RegisterAsync(51, 2, new RegisterTournamentDto { TeamName = "Team Y" });

        result.StatusCode.Should().Be(400);
        result.Message.Should().Contain("đủ tiền");
        (await db.TournamentRegistrations.CountAsync()).Should().Be(0);
    }

    [Fact]
    public async Task MembershipGetActiveDiscount_ReturnsHighestActiveDiscount()
    {
        await using var db = CreateDb(nameof(MembershipGetActiveDiscount_ReturnsHighestActiveDiscount));
        db.Memberships.Add(new Membership
        {
            UserId = 4001,
            ComplexId = 1,
            Tier = "Gold",
            DiscountPercent = 15m,
            ValidFrom = DateTime.UtcNow.Date.AddDays(-1),
            ValidTo = DateTime.UtcNow.Date.AddMonths(1),
            Status = "Active"
        });
        await db.SaveChangesAsync();

        var svc = new MembershipService(db, Mock.Of<IOwnerAccessService>());
        var discount = await svc.GetActiveDiscountPercentAsync(4001, 1);
        discount.Should().Be(15m);
    }

    [Fact]
    public async Task SplitPaymentExpire_RefundsPaidShares()
    {
        await using var db = CreateDb(nameof(SplitPaymentExpire_RefundsPaidShares));
        var host = new User { UserId = 1001, FullName = "Host", Email = "h@test.vn", PasswordHash = "x", Role = Roles.Customer, EKycStatus = "Verified" };
        var guest = new User { UserId = 1002, FullName = "Guest", Email = "g@test.vn", PasswordHash = "x", Role = Roles.Customer, EKycStatus = "Verified" };
        db.Users.AddRange(host, guest);
        db.EscrowWallets.Add(new EscrowWallet { UserId = 1002, Balance = 0, RowVersion = new byte[8] });

        var booking = new Booking
        {
            UserId = 1001,
            TotalAmount = 200000,
            Status = BookingStatus.PendingPayment,
            PaymentStatus = PaymentStatus.Pending,
            IsSplitPayment = true,
            SplitPaymentDeadline = DateTime.UtcNow.AddHours(-1),
            PaymentShares = new List<BookingPaymentShare>
            {
                new() { UserId = 1001, Amount = 100000, Status = PaymentShareStatus.Pending, PaymentDeadline = DateTime.UtcNow.AddHours(-1) },
                new() { UserId = 1002, Amount = 100000, Status = PaymentShareStatus.Paid, PaymentDeadline = DateTime.UtcNow.AddHours(-1), PaidAt = DateTime.UtcNow.AddHours(-2) }
            }
        };
        db.Bookings.Add(booking);
        await db.SaveChangesAsync();

        var shareId = booking.PaymentShares.First(s => s.UserId == 1002).BookingPaymentShareId;
        var escrow = new EscrowRepository(db);
        var notifications = new Mock<INotificationService>();
        notifications.Setup(n => n.SendToUserAsync(It.IsAny<int>(), It.IsAny<RealtimeNotificationDto>()))
            .Returns(Task.CompletedTask);

        var svc = new SplitPaymentService(
            db,
            Mock.Of<IBookingRepository>(),
            Mock.Of<ICourtRepository>(),
            escrow,
            Mock.Of<IUserRepository>(),
            notifications.Object,
            Mock.Of<IMembershipService>(),
            NullLogger<SplitPaymentService>.Instance);

        var expired = await svc.ExpireUnpaidSharesAsync();
        expired.Should().Be(1);

        var wallet = await db.EscrowWallets.FirstAsync(w => w.UserId == 1002);
        wallet.Balance.Should().Be(100000);

        var share = await db.BookingPaymentShares.FirstAsync(s => s.BookingPaymentShareId == shareId);
        share.Status.Should().Be(PaymentShareStatus.Refunded);

        var updatedBooking = await db.Bookings.FirstAsync(b => b.BookingId == booking.BookingId);
        updatedBooking.Status.Should().Be(BookingStatus.Expired);
        updatedBooking.PaymentStatus.Should().Be(PaymentStatus.Refunded);
    }

    [Fact]
    public async Task TournamentRegister_RejectsDuplicateCaptain()
    {
        await using var db = CreateDb(nameof(TournamentRegister_RejectsDuplicateCaptain));
        db.Tournaments.Add(new Tournament
        {
            TournamentId = 1,
            ComplexId = 1,
            Name = "Test Cup",
            StartDate = DateTime.UtcNow.AddDays(7),
            EndDate = DateTime.UtcNow.AddDays(8),
            MaxTeams = 8,
            RegisteredTeams = 1,
            Status = "Open"
        });
        db.TournamentRegistrations.Add(new TournamentRegistration
        {
            TournamentId = 1,
            CaptainUserId = 5,
            TeamName = "Team A",
            Status = "Registered"
        });
        await db.SaveChangesAsync();

        var ownerAccess = new Mock<IOwnerAccessService>();
        var svc = new TournamentService(db, ownerAccess.Object, new EscrowRepository(db));
        var result = await svc.RegisterAsync(5, 1, new RegisterTournamentDto { TeamName = "Team B" });

        result.StatusCode.Should().Be(400);
    }

    [Fact]
    public async Task TournamentCreate_AllowsAdminWithoutOwnerLink()
    {
        await using var db = CreateDb(nameof(TournamentCreate_AllowsAdminWithoutOwnerLink));
        var ownerAccess = new Mock<IOwnerAccessService>();
        ownerAccess.Setup(o => o.RequireComplexAccessAsync(99, 1, true)).Returns(Task.CompletedTask);

        var svc = new TournamentService(db, ownerAccess.Object, new EscrowRepository(db));
        var result = await svc.CreateAsync(99, 1, new CreateTournamentDto
        {
            Name = "Admin Cup",
            StartDate = DateTime.UtcNow.AddDays(3),
            EndDate = DateTime.UtcNow.AddDays(4),
            MaxTeams = 4
        }, isAdmin: true);

        result.StatusCode.Should().Be(201);
        ownerAccess.Verify(o => o.RequireComplexAccessAsync(99, 1, true), Times.Once);
    }

    [Fact]
    public async Task MembershipCreate_RejectsOverlappingActiveMembership()
    {
        await using var db = CreateDb(nameof(MembershipCreate_RejectsOverlappingActiveMembership));
        db.Users.Add(new User
        {
            UserId = 2001,
            FullName = "Member",
            Email = "m@test.vn",
            PasswordHash = "x",
            Role = Roles.Customer,
            EKycStatus = "Verified"
        });
        db.Memberships.Add(new Membership
        {
            UserId = 2001,
            ComplexId = 1,
            Tier = "Standard",
            DiscountPercent = 10m,
            ValidFrom = DateTime.UtcNow.Date,
            ValidTo = DateTime.UtcNow.Date.AddMonths(1),
            Status = "Active"
        });
        await db.SaveChangesAsync();

        var ownerAccess = new Mock<IOwnerAccessService>();
        ownerAccess.Setup(o => o.RequireComplexAccessAsync(5, 1, false)).Returns(Task.CompletedTask);

        var svc = new MembershipService(db, ownerAccess.Object);
        var result = await svc.CreateAsync(5, 1, new CreateMembershipDto
        {
            UserId = 2001,
            ValidFrom = DateTime.UtcNow.Date.AddDays(10),
            ValidTo = DateTime.UtcNow.Date.AddMonths(2)
        });

        result.StatusCode.Should().Be(409);
    }

    [Fact]
    public async Task MembershipGetMy_ReturnsOnlyActiveFutureMemberships()
    {
        await using var db = CreateDb(nameof(MembershipGetMy_ReturnsOnlyActiveFutureMemberships));
        db.Complexes.Add(new Complex { ComplexId = 1, Name = "C1", Status = "Active" });
        db.Users.Add(new User
        {
            UserId = 3001,
            FullName = "Player",
            Email = "p@test.vn",
            PasswordHash = "x",
            Role = Roles.Customer,
            EKycStatus = "Verified"
        });
        db.Memberships.AddRange(
            new Membership
            {
                UserId = 3001,
                ComplexId = 1,
                Tier = "Gold",
                DiscountPercent = 15m,
                ValidFrom = DateTime.UtcNow.Date.AddMonths(-2),
                ValidTo = DateTime.UtcNow.Date.AddMonths(1),
                Status = "Active"
            },
            new Membership
            {
                UserId = 3001,
                ComplexId = 1,
                Tier = "Expired",
                DiscountPercent = 10m,
                ValidFrom = DateTime.UtcNow.Date.AddMonths(-6),
                ValidTo = DateTime.UtcNow.Date.AddDays(-1),
                Status = "Active"
            });
        await db.SaveChangesAsync();

        var svc = new MembershipService(db, Mock.Of<IOwnerAccessService>());
        var result = await svc.GetMyMembershipsAsync(3001);

        result.StatusCode.Should().Be(200);
        result.Data!.Should().HaveCount(1);
        result.Data!.First().Tier.Should().Be("Gold");
    }
}
