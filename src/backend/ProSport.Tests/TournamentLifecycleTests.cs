using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Moq;
using ProSport.Application.Exceptions;
using ProSport.Application.Interfaces;
using ProSport.Domain.Constants;
using ProSport.Domain.Entities;
using ProSport.Infrastructure.Data;
using ProSport.Infrastructure.Repositories;
using ProSport.Infrastructure.Services;

namespace ProSport.Tests;

public class TournamentLifecycleTests
{
    private static ProSportDbContext CreateDb(string name)
    {
        var options = new DbContextOptionsBuilder<ProSportDbContext>()
            .UseInMemoryDatabase(name)
            .ConfigureWarnings(w => w.Ignore(InMemoryEventId.TransactionIgnoredWarning))
            .Options;
        return new ProSportDbContext(options);
    }

    private static Mock<IOwnerAccessService> OwnerAllowing()
    {
        var m = new Mock<IOwnerAccessService>();
        m.Setup(o => o.RequireComplexAccessAsync(It.IsAny<int>(), It.IsAny<int>(), It.IsAny<bool>()))
            .Returns(Task.CompletedTask);
        return m;
    }

    private static Mock<IOwnerAccessService> OwnerDenying()
    {
        var m = new Mock<IOwnerAccessService>();
        m.Setup(o => o.RequireComplexAccessAsync(It.IsAny<int>(), It.IsAny<int>(), It.IsAny<bool>()))
            .ThrowsAsync(new OwnerAccessDeniedException());
        return m;
    }

    private static TournamentService CreateService(ProSportDbContext db, Mock<IOwnerAccessService> owner)
        => new(db, owner.Object, new EscrowRepository(db));

    private static Tournament SeedTournament(ProSportDbContext db, string status, decimal entryFee = 0)
    {
        var t = new Tournament
        {
            ComplexId = 1,
            Name = "Cup",
            StartDate = DateTime.UtcNow.AddDays(7),
            EndDate = DateTime.UtcNow.AddDays(8),
            EntryFee = entryFee,
            MaxTeams = 16,
            Status = status
        };
        db.Tournaments.Add(t);
        db.SaveChanges();
        return t;
    }

    // ---- US1: Close registration ----

    [Fact]
    public async Task Close_OpenToClosed_Succeeds()
    {
        await using var db = CreateDb(nameof(Close_OpenToClosed_Succeeds));
        var t = SeedTournament(db, TournamentStatus.Open);
        var svc = CreateService(db, OwnerAllowing());

        var res = await svc.CloseRegistrationAsync(100, t.TournamentId);

        res.StatusCode.Should().Be(200);
        (await db.Tournaments.FirstAsync()).Status.Should().Be(TournamentStatus.Closed);
    }

    [Theory]
    [InlineData(TournamentStatus.Closed)]
    [InlineData(TournamentStatus.Completed)]
    [InlineData(TournamentStatus.Cancelled)]
    public async Task Close_FromNonOpen_Rejected(string status)
    {
        await using var db = CreateDb($"{nameof(Close_FromNonOpen_Rejected)}_{status}");
        var t = SeedTournament(db, status);
        var svc = CreateService(db, OwnerAllowing());

        var res = await svc.CloseRegistrationAsync(100, t.TournamentId);

        res.StatusCode.Should().Be(400);
        (await db.Tournaments.FirstAsync()).Status.Should().Be(status);
    }

    [Fact]
    public async Task Close_NonOrganizer_Returns403()
    {
        await using var db = CreateDb(nameof(Close_NonOrganizer_Returns403));
        var t = SeedTournament(db, TournamentStatus.Open);
        var svc = CreateService(db, OwnerDenying());

        var res = await svc.CloseRegistrationAsync(999, t.TournamentId);

        res.StatusCode.Should().Be(403);
        (await db.Tournaments.FirstAsync()).Status.Should().Be(TournamentStatus.Open);
    }

    // ---- US3: Complete ----

    [Fact]
    public async Task Complete_ClosedToCompleted_Succeeds()
    {
        await using var db = CreateDb(nameof(Complete_ClosedToCompleted_Succeeds));
        var t = SeedTournament(db, TournamentStatus.Closed);
        var svc = CreateService(db, OwnerAllowing());

        var res = await svc.CompleteAsync(100, t.TournamentId);

        res.StatusCode.Should().Be(200);
        (await db.Tournaments.FirstAsync()).Status.Should().Be(TournamentStatus.Completed);
    }

    [Theory]
    [InlineData(TournamentStatus.Open)]
    [InlineData(TournamentStatus.Completed)]
    [InlineData(TournamentStatus.Cancelled)]
    public async Task Complete_FromNonClosed_Rejected(string status)
    {
        await using var db = CreateDb($"{nameof(Complete_FromNonClosed_Rejected)}_{status}");
        var t = SeedTournament(db, status);
        var svc = CreateService(db, OwnerAllowing());

        var res = await svc.CompleteAsync(100, t.TournamentId);

        res.StatusCode.Should().Be(400);
        (await db.Tournaments.FirstAsync()).Status.Should().Be(status);
    }

    // ---- US2: Cancel + refund ----

    [Theory]
    [InlineData(TournamentStatus.Open)]
    [InlineData(TournamentStatus.Closed)]
    public async Task Cancel_FromOpenOrClosed_RefundsPaidRegistration(string startStatus)
    {
        await using var db = CreateDb($"{nameof(Cancel_FromOpenOrClosed_RefundsPaidRegistration)}_{startStatus}");
        var t = SeedTournament(db, startStatus, entryFee: 100000);
        db.EscrowWallets.Add(new EscrowWallet { UserId = 2002, Balance = 0, RowVersion = new byte[8] });
        db.TournamentRegistrations.Add(new TournamentRegistration
        {
            TournamentId = t.TournamentId,
            CaptainUserId = 2002,
            TeamName = "Team A",
            Status = "Registered",
            EntryFeePaid = true
        });
        await db.SaveChangesAsync();

        var svc = CreateService(db, OwnerAllowing());
        var res = await svc.CancelAsync(100, t.TournamentId);

        res.StatusCode.Should().Be(200);
        (await db.Tournaments.FirstAsync()).Status.Should().Be(TournamentStatus.Cancelled);
        (await db.TournamentRegistrations.FirstAsync()).Status.Should().Be("Cancelled");
        (await db.EscrowWallets.FirstAsync(w => w.UserId == 2002)).Balance.Should().Be(100000);
        (await db.Transactions.CountAsync(x => x.Type == TransactionType.Refund)).Should().Be(1);
    }

    [Fact]
    public async Task Cancel_RunTwice_NoDoubleRefund()
    {
        await using var db = CreateDb(nameof(Cancel_RunTwice_NoDoubleRefund));
        var t = SeedTournament(db, TournamentStatus.Open, entryFee: 100000);
        db.EscrowWallets.Add(new EscrowWallet { UserId = 2002, Balance = 0, RowVersion = new byte[8] });
        db.TournamentRegistrations.Add(new TournamentRegistration
        {
            TournamentId = t.TournamentId,
            CaptainUserId = 2002,
            TeamName = "Team A",
            Status = "Registered",
            EntryFeePaid = true
        });
        await db.SaveChangesAsync();

        var svc = CreateService(db, OwnerAllowing());

        var first = await svc.CancelAsync(100, t.TournamentId);
        first.StatusCode.Should().Be(200);

        var second = await svc.CancelAsync(100, t.TournamentId);
        second.StatusCode.Should().Be(400); // terminal state guard blocks re-cancel

        (await db.EscrowWallets.FirstAsync(w => w.UserId == 2002)).Balance.Should().Be(100000); // not doubled
        (await db.Transactions.CountAsync(x => x.Type == TransactionType.Refund)).Should().Be(1);
    }

    [Theory]
    [InlineData(TournamentStatus.Completed)]
    [InlineData(TournamentStatus.Cancelled)]
    public async Task Cancel_FromTerminal_Rejected(string status)
    {
        await using var db = CreateDb($"{nameof(Cancel_FromTerminal_Rejected)}_{status}");
        var t = SeedTournament(db, status);
        var svc = CreateService(db, OwnerAllowing());

        var res = await svc.CancelAsync(100, t.TournamentId);

        res.StatusCode.Should().Be(400);
        (await db.Tournaments.FirstAsync()).Status.Should().Be(status);
    }

    // ---- B: Player self-withdraw (Registered -> Cancelled + refund) ----

    [Fact]
    public async Task Withdraw_PaidRegistration_RefundsAndDecrements()
    {
        await using var db = CreateDb(nameof(Withdraw_PaidRegistration_RefundsAndDecrements));
        var t = SeedTournament(db, TournamentStatus.Open, entryFee: 100000);
        t.RegisteredTeams = 1;
        db.EscrowWallets.Add(new EscrowWallet { UserId = 2002, Balance = 0, RowVersion = new byte[8] });
        db.TournamentRegistrations.Add(new TournamentRegistration
        {
            TournamentId = t.TournamentId,
            CaptainUserId = 2002,
            TeamName = "Team A",
            Status = "Registered",
            EntryFeePaid = true
        });
        await db.SaveChangesAsync();

        var svc = CreateService(db, OwnerAllowing());
        var res = await svc.WithdrawAsync(2002, t.TournamentId);

        res.StatusCode.Should().Be(200);
        (await db.TournamentRegistrations.FirstAsync()).Status.Should().Be("Cancelled");
        (await db.EscrowWallets.FirstAsync(w => w.UserId == 2002)).Balance.Should().Be(100000);
        (await db.Tournaments.FirstAsync()).RegisteredTeams.Should().Be(0);
        (await db.Transactions.CountAsync(x => x.Type == TransactionType.Refund)).Should().Be(1);
    }

    [Fact]
    public async Task Withdraw_NotRegistered_Returns404()
    {
        await using var db = CreateDb(nameof(Withdraw_NotRegistered_Returns404));
        var t = SeedTournament(db, TournamentStatus.Open, entryFee: 100000);
        var svc = CreateService(db, OwnerAllowing());

        var res = await svc.WithdrawAsync(3003, t.TournamentId);

        res.StatusCode.Should().Be(404);
    }

    [Theory]
    [InlineData(TournamentStatus.Completed)]
    [InlineData(TournamentStatus.Cancelled)]
    public async Task Withdraw_FromTerminalTournament_Rejected(string status)
    {
        await using var db = CreateDb($"{nameof(Withdraw_FromTerminalTournament_Rejected)}_{status}");
        var t = SeedTournament(db, status, entryFee: 100000);
        db.TournamentRegistrations.Add(new TournamentRegistration
        {
            TournamentId = t.TournamentId,
            CaptainUserId = 2002,
            TeamName = "Team A",
            Status = "Registered",
            EntryFeePaid = true
        });
        await db.SaveChangesAsync();

        var svc = CreateService(db, OwnerAllowing());
        var res = await svc.WithdrawAsync(2002, t.TournamentId);

        res.StatusCode.Should().Be(400);
        (await db.TournamentRegistrations.FirstAsync()).Status.Should().Be("Registered");
    }

    [Fact]
    public async Task Cancel_NonOrganizer_Returns403()
    {
        await using var db = CreateDb(nameof(Cancel_NonOrganizer_Returns403));
        var t = SeedTournament(db, TournamentStatus.Open);
        var svc = CreateService(db, OwnerDenying());

        var res = await svc.CancelAsync(999, t.TournamentId);

        res.StatusCode.Should().Be(403);
        (await db.Tournaments.FirstAsync()).Status.Should().Be(TournamentStatus.Open);
    }
}
