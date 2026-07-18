using FluentAssertions;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
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

public class SqlServerIntegrationTests
{
    private static string ConnectionString =>
        Environment.GetEnvironmentVariable("PROSPORT_INTEGRATION_CONNECTION_STRING")
        ?? throw new InvalidOperationException("PROSPORT_INTEGRATION_CONNECTION_STRING is required for SQL Server integration tests.");

    private static ProSportDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<ProSportDbContext>()
            .UseSqlServer(ConnectionString)
            .Options;
        return new ProSportDbContext(options);
    }

    private static EloRatingService CreateEloService(ProSportDbContext db)
    {
        var notifications = new Mock<INotificationService>();
        notifications.Setup(n => n.SendToUserAsync(It.IsAny<int>(), It.IsAny<RealtimeNotificationDto>()))
            .Returns(Task.CompletedTask);

        return new EloRatingService(
            db,
            new MatchRepository(db, new EscrowRepository(db)),
            notifications.Object,
            NullLogger<EloRatingService>.Instance);
    }

    [SqlServerFact]
    public async Task Voucher_CheckConstraint_RejectsInvalidStatus()
    {
        await using var db = CreateContext();
        await using var tx = await db.Database.BeginTransactionAsync();

        var user = await db.Users.AsNoTracking().OrderBy(u => u.UserId).FirstAsync();
        var voucher = new Voucher
        {
            Code = $"IT-{Guid.NewGuid():N}"[..12].ToUpperInvariant(),
            Name = "Integration invalid status",
            DiscountPercent = 10,
            TotalQuantity = 1,
            StartDate = DateTime.UtcNow.Date,
            EndDate = DateTime.UtcNow.Date.AddDays(7),
            Status = "Actvie",
            CreatedByStaffId = user.UserId,
            CreatedAt = DateTime.UtcNow,
            IsDeleted = false
        };

        db.Vouchers.Add(voucher);
        var act = async () => await db.SaveChangesAsync();
        var ex = await act.Should().ThrowAsync<DbUpdateException>();
        ex.Which.InnerException.Should().BeOfType<SqlException>();

        await tx.RollbackAsync();
    }

    [SqlServerFact]
    public async Task Tournament_CheckConstraint_RejectsInvalidStatus()
    {
        await using var db = CreateContext();
        await using var tx = await db.Database.BeginTransactionAsync();

        var complexId = await db.Complexes.AsNoTracking()
            .OrderBy(c => c.ComplexId).Select(c => c.ComplexId).FirstAsync();

        var tournament = new Tournament
        {
            ComplexId = complexId,
            Name = "Integration invalid status",
            StartDate = DateTime.UtcNow.Date.AddDays(7),
            EndDate = DateTime.UtcNow.Date.AddDays(8),
            EntryFee = 0,
            MaxTeams = 8,
            Status = "Opened", // invalid — not in {Open, Closed, Completed, Cancelled}
            CreatedAt = DateTime.UtcNow,
            IsDeleted = false
        };

        db.Tournaments.Add(tournament);
        var act = async () => await db.SaveChangesAsync();
        var ex = await act.Should().ThrowAsync<DbUpdateException>();
        ex.Which.InnerException.Should().BeOfType<SqlException>();

        await tx.RollbackAsync();
    }

    [SqlServerFact]
    public async Task User_CheckConstraint_RejectsInvalidEKycStatus()
    {
        await using var db = CreateContext();
        await using var tx = await db.Database.BeginTransactionAsync();

        db.Users.Add(new User
        {
            FullName = "IT Invalid EKyc",
            Email = $"it-{Guid.NewGuid():N}@test.local",
            Role = Roles.Customer,
            EKycStatus = "BadStatus", // invalid — not in {Unverified, Pending, Verified, Rejected}
            CreatedAt = DateTime.UtcNow,
            IsDeleted = false
        });

        var act = async () => await db.SaveChangesAsync();
        var ex = await act.Should().ThrowAsync<DbUpdateException>();
        ex.Which.InnerException.Should().BeOfType<SqlException>();

        await tx.RollbackAsync();
    }

    [SqlServerFact]
    public async Task User_CheckConstraint_RejectsInvalidRole()
    {
        await using var db = CreateContext();
        await using var tx = await db.Database.BeginTransactionAsync();

        db.Users.Add(new User
        {
            FullName = "IT Invalid Role",
            Email = $"it-{Guid.NewGuid():N}@test.local",
            Role = "SuperUser", // invalid — not in Roles constants
            EKycStatus = EKycStatuses.Unverified,
            CreatedAt = DateTime.UtcNow,
            IsDeleted = false
        });

        var act = async () => await db.SaveChangesAsync();
        var ex = await act.Should().ThrowAsync<DbUpdateException>();
        ex.Which.InnerException.Should().BeOfType<SqlException>();

        await tx.RollbackAsync();
    }

    [SqlServerFact]
    public async Task Report_CheckConstraint_RejectsInvalidStatus()
    {
        await using var db = CreateContext();
        await using var tx = await db.Database.BeginTransactionAsync();

        var userIds = await db.Users.AsNoTracking().OrderBy(u => u.UserId)
            .Select(u => u.UserId).Take(2).ToListAsync();
        var matchId = await db.Matches.AsNoTracking().OrderBy(m => m.MatchId)
            .Select(m => m.MatchId).FirstAsync();

        db.Reports.Add(new Report
        {
            ReporterId = userIds[0],
            ReportedUserId = userIds.Count > 1 ? userIds[1] : userIds[0],
            MatchId = matchId,
            Reason = "IT invalid status",
            Status = "Investigatin", // invalid typo — not in {Pending,Investigating,Resolved,Rejected}
            CreatedAt = DateTime.UtcNow,
            IsDeleted = false
        });

        var act = async () => await db.SaveChangesAsync();
        var ex = await act.Should().ThrowAsync<DbUpdateException>();
        ex.Which.InnerException.Should().BeOfType<SqlException>();

        await tx.RollbackAsync();
    }

    [SqlServerFact]
    public async Task Equipment_CheckConstraint_RejectsInvalidStatus()
    {
        await using var db = CreateContext();
        await using var tx = await db.Database.BeginTransactionAsync();

        var catId = await db.EquipmentCategories.AsNoTracking()
            .OrderBy(c => c.EquipmentCategoryId).Select(c => c.EquipmentCategoryId).FirstAsync();

        db.Equipments.Add(new Equipment
        {
            EquipmentCategoryId = catId,
            Name = "IT invalid status",
            EquipmentName = "IT invalid status",
            RetailPrice = 100000,
            StockQuantity = 1,
            Status = "Retired", // invalid — not in {Available, Discontinued}
            CreatedAt = DateTime.UtcNow,
            IsDeleted = false
        });

        var act = async () => await db.SaveChangesAsync();
        var ex = await act.Should().ThrowAsync<DbUpdateException>();
        ex.Which.InnerException.Should().BeOfType<SqlException>();

        await tx.RollbackAsync();
    }

    [SqlServerFact]
    public async Task BookingPaymentShare_UniqueIndex_RejectsDuplicateUser()
    {
        await using var db = CreateContext();
        await using var tx = await db.Database.BeginTransactionAsync();

        var booking = await db.Bookings.AsNoTracking().OrderBy(b => b.BookingId).FirstAsync();
        var userId = await db.Users.AsNoTracking().OrderBy(u => u.UserId).Select(u => u.UserId).FirstAsync();
        var deadline = DateTime.UtcNow.AddDays(1);

        db.BookingPaymentShares.AddRange(
            new BookingPaymentShare
            {
                BookingId = booking.BookingId,
                UserId = userId,
                Amount = 50000,
                Status = PaymentShareStatus.Pending,
                PaymentDeadline = deadline,
                CreatedAt = DateTime.UtcNow
            },
            new BookingPaymentShare
            {
                BookingId = booking.BookingId,
                UserId = userId,
                Amount = 50000,
                Status = PaymentShareStatus.Pending,
                PaymentDeadline = deadline,
                CreatedAt = DateTime.UtcNow
            });

        var act = async () => await db.SaveChangesAsync();
        var ex = await act.Should().ThrowAsync<DbUpdateException>();
        ex.Which.InnerException.Should().BeOfType<SqlException>();

        await tx.RollbackAsync();
    }

    [SqlServerFact]
    public async Task OwnerVoucherService_RejectsInvalidStatusBeforeSave()
    {
        await using var db = CreateContext();
        await using var tx = await db.Database.BeginTransactionAsync();

        var complexId = await db.Complexes.AsNoTracking()
            .Where(c => !c.IsDeleted)
            .Select(c => c.ComplexId)
            .FirstAsync();
        var actorUserId = await db.Users.AsNoTracking().OrderBy(u => u.UserId).Select(u => u.UserId).FirstAsync();

        var voucher = new Voucher
        {
            Code = $"IT-{Guid.NewGuid():N}"[..12].ToUpperInvariant(),
            Name = "Integration status validation",
            DiscountPercent = 10,
            TotalQuantity = 10,
            StartDate = DateTime.UtcNow.Date,
            EndDate = DateTime.UtcNow.Date.AddDays(30),
            ApplicableComplexId = complexId,
            Status = VoucherStatus.Active,
            CreatedByStaffId = actorUserId,
            CreatedAt = DateTime.UtcNow,
            IsDeleted = false
        };
        db.Vouchers.Add(voucher);
        await db.SaveChangesAsync();

        var svc = new OwnerVoucherService(db, new NoOpAuditLogService());
        var result = await svc.UpdateVoucherStatusAsync(
            actorUserId,
            voucher.VoucherId,
            complexId,
            new ProSport.Application.DTOs.Owner.UpdateVoucherStatusDto { Status = "Actvie" });

        result.StatusCode.Should().Be(400);
        (await db.Vouchers.AsNoTracking().FirstAsync(v => v.VoucherId == voucher.VoucherId)).Status
            .Should().Be(VoucherStatus.Active);

        await tx.RollbackAsync();
    }

    [SqlServerFact]
    public async Task Elo_ConcurrentConfirm_OnlyOneSucceedsAndRatingsIncrementOnce()
    {
        const int hostUserId = 4;
        const int guestUserId = 5;

        await using var db = CreateContext();
        var court = await db.Courts.AsNoTracking()
            .Include(c => c.CourtType)
            .Where(c => !c.IsDeleted)
            .FirstAsync();
        var sportType = court.CourtType?.Name?.Trim() ?? "Badminton";

        var winnerBefore = await db.UserSkillRatings.AsNoTracking()
            .FirstOrDefaultAsync(r => r.UserId == hostUserId && r.SportType == sportType);
        var loserBefore = await db.UserSkillRatings.AsNoTracking()
            .FirstOrDefaultAsync(r => r.UserId == guestUserId && r.SportType == sportType);
        var baselineWinnerGames = winnerBefore?.GamesPlayed ?? 0;
        var baselineLoserGames = loserBefore?.GamesPlayed ?? 0;
        var baselineWinnerWins = winnerBefore?.Wins ?? 0;
        var baselineLoserLosses = loserBefore?.Losses ?? 0;
        var baselineWinnerElo = winnerBefore?.EloRating ?? 1200;
        var baselineLoserElo = loserBefore?.EloRating ?? 1200;

        if (winnerBefore == null)
        {
            db.UserSkillRatings.Add(new UserSkillRating { UserId = hostUserId, SportType = sportType, EloRating = 1200 });
        }

        if (loserBefore == null)
        {
            db.UserSkillRatings.Add(new UserSkillRating { UserId = guestUserId, SportType = sportType, EloRating = 1200 });
        }

        if (winnerBefore == null || loserBefore == null)
            await db.SaveChangesAsync();

        var match = new DomainMatch
        {
            HostId = hostUserId,
            CourtId = court.CourtId,
            MatchDate = DateTime.UtcNow.Date.AddDays(30),
            StartTime = TimeSpan.FromHours(10),
            EndTime = TimeSpan.FromHours(11),
            MaxParticipants = 2,
            CurrentParticipants = 2,
            EscrowAmount = 50000,
            Status = MatchStatus.Open,
            CreatedAt = DateTime.UtcNow,
            IsDeleted = false,
            Participants =
            {
                new MatchParticipant
                {
                    UserId = guestUserId,
                    Role = MatchParticipantRole.Joiner,
                    Status = MatchParticipantStatus.Approved,
                    CreatedAt = DateTime.UtcNow,
                    IsDeleted = false
                }
            }
        };
        db.Matches.Add(match);
        await db.SaveChangesAsync();

        db.MatchResults.Add(new MatchResult
        {
            MatchId = match.MatchId,
            WinnerUserId = hostUserId,
            LoserUserId = guestUserId,
            ReportedByUserId = hostUserId,
            Status = MatchResultStatus.Pending,
            CreatedAt = DateTime.UtcNow,
            IsDeleted = false
        });
        await db.SaveChangesAsync();

        try
        {
            async Task<ApiResponseDto<bool>> ConfirmOnceAsync()
            {
                await using var ctx = CreateContext();
                return await CreateEloService(ctx).ConfirmMatchResultAsync(guestUserId, match.MatchId);
            }

            var first = ConfirmOnceAsync();
            var second = ConfirmOnceAsync();
            var results = await Task.WhenAll(first, second);

            results.Count(r => r.StatusCode == 200).Should().Be(1);
            results.Count(r => r.StatusCode is 400 or 409).Should().Be(1);

            var resultRow = await db.MatchResults.AsNoTracking()
                .SingleAsync(r => r.MatchId == match.MatchId && !r.IsDeleted);
            resultRow.Status.Should().Be(MatchResultStatus.Confirmed);
            resultRow.ConfirmedByUserId.Should().Be(guestUserId);

            var winnerAfter = await db.UserSkillRatings.AsNoTracking()
                .SingleAsync(r => r.UserId == hostUserId && r.SportType == sportType);
            var loserAfter = await db.UserSkillRatings.AsNoTracking()
                .SingleAsync(r => r.UserId == guestUserId && r.SportType == sportType);

            winnerAfter.GamesPlayed.Should().Be(baselineWinnerGames + 1);
            loserAfter.GamesPlayed.Should().Be(baselineLoserGames + 1);
            winnerAfter.Wins.Should().Be(baselineWinnerWins + 1);
            loserAfter.Losses.Should().Be(baselineLoserLosses + 1);
        }
        finally
        {
            var ratings = await db.UserSkillRatings
                .Where(r => (r.UserId == hostUserId || r.UserId == guestUserId) && r.SportType == sportType)
                .ToListAsync();
            foreach (var rating in ratings)
            {
                if (rating.UserId == hostUserId)
                {
                    rating.GamesPlayed = baselineWinnerGames;
                    rating.Wins = baselineWinnerWins;
                    rating.EloRating = baselineWinnerElo;
                }
                else
                {
                    rating.GamesPlayed = baselineLoserGames;
                    rating.Losses = baselineLoserLosses;
                    rating.EloRating = baselineLoserElo;
                }
            }

            var storedResult = await db.MatchResults.FirstOrDefaultAsync(r => r.MatchId == match.MatchId);
            if (storedResult != null)
                db.MatchResults.Remove(storedResult);

            var participants = await db.MatchParticipants.Where(p => p.MatchId == match.MatchId).ToListAsync();
            db.MatchParticipants.RemoveRange(participants);

            var storedMatch = await db.Matches.FirstOrDefaultAsync(m => m.MatchId == match.MatchId);
            if (storedMatch != null)
                db.Matches.Remove(storedMatch);

            if (winnerBefore == null)
            {
                var createdWinner = await db.UserSkillRatings
                    .FirstOrDefaultAsync(r => r.UserId == hostUserId && r.SportType == sportType);
                if (createdWinner != null)
                    db.UserSkillRatings.Remove(createdWinner);
            }

            if (loserBefore == null)
            {
                var createdLoser = await db.UserSkillRatings
                    .FirstOrDefaultAsync(r => r.UserId == guestUserId && r.SportType == sportType);
                if (createdLoser != null)
                    db.UserSkillRatings.Remove(createdLoser);
            }

            await db.SaveChangesAsync();
        }
    }

    private sealed class NoOpAuditLogService : ProSport.Application.Interfaces.IAuditLogService
    {
        public Task LogAsync(int? actorUserId, string action, string entityType, string entityId, int? complexId = null, string? oldValues = null, string? newValues = null) =>
            Task.CompletedTask;

        public Task<(List<ProSport.Application.DTOs.Owner.AuditLogDto> Items, int Total)> GetPagedAsync(ProSport.Application.DTOs.Owner.AuditLogQueryDto query) =>
            Task.FromResult((new List<ProSport.Application.DTOs.Owner.AuditLogDto>(), 0));
    }
}
