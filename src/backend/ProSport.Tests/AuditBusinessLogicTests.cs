using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using ProSport.Application.DTOs;
using ProSport.Application.DTOs.Owner;
using ProSport.Application.Interfaces;
using ProSport.Application.Services;
using ProSport.Domain.Constants;
using ProSport.Domain.Entities;
using ProSport.Infrastructure.Data;
using ProSport.Infrastructure.Repositories;
using ProSport.Infrastructure.Services;

namespace ProSport.Tests;

public class AuditBusinessLogicTests
{
    private static ProSportDbContext CreateDb(string name)
    {
        var options = new DbContextOptionsBuilder<ProSportDbContext>()
            .UseInMemoryDatabase(name)
            .ConfigureWarnings(w => w.Ignore(InMemoryEventId.TransactionIgnoredWarning))
            .Options;
        return new ProSportDbContext(options);
    }

    private static CartRepository CreateCartRepository(ProSportDbContext db) =>
        new(db, new EscrowRepository(db));

    private static void SeedWallet(ProSportDbContext db, int userId, decimal balance)
    {
        db.EscrowWallets.Add(new EscrowWallet
        {
            UserId = userId,
            Balance = balance,
            LockedBalance = 0,
            RowVersion = new byte[8]
        });
    }

    [Fact]
    public async Task ReturnEquipment_GoodCondition_SetsAdditionalChargeToZero()
    {
        var rentalRepo = new Mock<IEquipmentRentalRepository>();
        var equipmentRepo = new Mock<IEquipmentRepository>();

        var rental = new BookingDetailEquipment
        {
            DetailId = 1,
            EquipmentId = 10,
            Quantity = 2,
            UnitPrice = 50000,
            DepositAmount = 100000,
            RentalStatus = "Rented"
        };

        rentalRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(rental);
        rentalRepo.Setup(r => r.UpdateAsync(It.IsAny<BookingDetailEquipment>()))
            .Callback<BookingDetailEquipment>(r => { })
            .Returns(Task.CompletedTask);

        equipmentRepo.Setup(e => e.GetByIdAsync(10)).ReturnsAsync(new Equipment
        {
            EquipmentId = 10,
            StockQuantity = 0,
            Status = "Out of Stock"
        });
        equipmentRepo.Setup(e => e.UpdateAsync(It.IsAny<Equipment>())).Returns(Task.CompletedTask);

        rentalRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(() => rental);

        var svc = new EquipmentRentalService(
            rentalRepo.Object,
            equipmentRepo.Object,
            Mock.Of<IBookingRepository>(),
            Mock.Of<IUserRepository>(),
            NullLogger<EquipmentRentalService>.Instance);

        var result = await svc.ReturnEquipmentAsync(1, new ReturnEquipmentRequest { ReturnCondition = "Good" }, 99);

        result.StatusCode.Should().Be(200);
        rental.AdditionalCharge.Should().Be(0);
        rental.DepositRefundAmount.Should().Be(100000);
    }

    [Fact]
    public async Task RecurringBooking_Biweekly_SkipsOffWeekOccurrences()
    {
        await using var db = CreateDb(nameof(RecurringBooking_Biweekly_SkipsOffWeekOccurrences));

        var monday = DateTime.UtcNow.Date;
        while (monday.DayOfWeek != DayOfWeek.Monday)
            monday = monday.AddDays(1);

        var user = new User
        {
            UserId = 1,
            FullName = "User",
            Email = "u@test.vn",
            PasswordHash = "x",
            Role = Roles.Customer,
            EKycStatus = "Verified"
        };
        var court = new Court
        {
            CourtId = 1,
            ComplexId = 1,
            Name = "Court A",
            Status = CourtStatuses.Active,
            CourtTypeId = 1
        };
        db.Users.Add(user);
        db.Courts.Add(court);
        await db.SaveChangesAsync();

        var courtRepo = new Mock<ICourtRepository>();
        courtRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(court);

        var bookingRepo = new Mock<IBookingRepository>();
        bookingRepo.Setup(r => r.IsCourtSlotAvailableAsync(It.IsAny<int>(), It.IsAny<DateTime>(), It.IsAny<TimeSpan>(), It.IsAny<TimeSpan>()))
            .ReturnsAsync(true);
        bookingRepo.Setup(r => r.CreateWithTransactionAsync(It.IsAny<Booking>()))
            .ReturnsAsync((Booking b) =>
            {
                b.BookingId = db.Bookings.Count() + 1;
                db.Bookings.Add(b);
                db.SaveChanges();
                return b;
            });

        var svc = new RecurringBookingService(
            db,
            bookingRepo.Object,
            courtRepo.Object,
            Mock.Of<IMembershipService>(),
            NullLogger<RecurringBookingService>.Instance);

        var create = await svc.CreateRuleAsync(1, new CreateRecurringRuleDto
        {
            CourtId = 1,
            DayOfWeek = DayOfWeek.Monday,
            StartTime = new TimeSpan(10, 0, 0),
            EndTime = new TimeSpan(11, 0, 0),
            ValidFrom = monday,
            ValidTo = monday.AddDays(20),
            Frequency = "Biweekly",
            GenerateWeeksAhead = 4
        });

        create.StatusCode.Should().Be(201);

        var bookingDates = await db.BookingDetails
            .Select(d => d.BookingDate.Date)
            .OrderBy(d => d)
            .ToListAsync();

        bookingDates.Should().NotBeEmpty();
        foreach (var date in bookingDates)
        {
            var daysSinceAnchor = (date - monday).Days;
            (daysSinceAnchor % 14).Should().Be(0);
        }
    }

    [Fact]
    public async Task CancelBookingAsOperator_RefundsFullAmountToWallet()
    {
        var bookingRepo = new Mock<IBookingRepository>();
        var escrowRepo = new Mock<IEscrowRepository>();

        var booking = new Booking
        {
            BookingId = 42,
            UserId = 7,
            TotalAmount = 100000m,
            Status = BookingStatus.Confirmed,
            PaymentStatus = PaymentStatus.Paid
        };

        bookingRepo.Setup(r => r.GetByIdAsync(42)).ReturnsAsync(booking);
        escrowRepo.Setup(r => r.CancelBookingWithRefundAsync(
                42,
                0m,
                100000m,
                "Hủy bởi operator",
                "OperatorCancel_42"))
            .ReturnsAsync(true);

        var svc = new BookingService(
            bookingRepo.Object,
            Mock.Of<ICourtRepository>(),
            escrowRepo.Object,
            Mock.Of<IUserRepository>(),
            Mock.Of<IEmailService>(),
            NullLogger<BookingService>.Instance,
            Mock.Of<IStaffOperationGuard>(),
            Mock.Of<ICancellationPolicyService>(),
            Mock.Of<IMembershipService>(),
            Mock.Of<INotificationService>());

        var result = await svc.CancelBookingAsOperatorAsync(99, 42);

        result.StatusCode.Should().Be(200);
        escrowRepo.Verify(r => r.CancelBookingWithRefundAsync(
            42,
            0m,
            100000m,
            "Hủy bởi operator",
            "OperatorCancel_42"), Times.Once);
    }

    [Fact]
    public async Task ReturnEquipment_DamagedAtDepositAmount_DoesNotDoubleCharge()
    {
        var rental = new BookingDetailEquipment
        {
            DetailId = 2,
            EquipmentId = 10,
            Quantity = 1,
            UnitPrice = 50000,
            DepositAmount = 100000,
            RentalStatus = "Rented"
        };

        var rentalRepo = new Mock<IEquipmentRentalRepository>();
        rentalRepo.Setup(r => r.GetByIdAsync(2)).ReturnsAsync(rental);
        rentalRepo.Setup(r => r.UpdateAsync(It.IsAny<BookingDetailEquipment>())).Returns(Task.CompletedTask);

        var equipmentRepo = new Mock<IEquipmentRepository>();
        equipmentRepo.Setup(e => e.GetByIdAsync(10)).ReturnsAsync(new Equipment
        {
            EquipmentId = 10,
            StockQuantity = 0,
            Status = "Available"
        });
        equipmentRepo.Setup(e => e.UpdateAsync(It.IsAny<Equipment>())).Returns(Task.CompletedTask);

        var svc = new EquipmentRentalService(
            rentalRepo.Object,
            equipmentRepo.Object,
            Mock.Of<IBookingRepository>(),
            Mock.Of<IUserRepository>(),
            NullLogger<EquipmentRentalService>.Instance);

        var result = await svc.ReturnEquipmentAsync(2, new ReturnEquipmentRequest
        {
            ReturnCondition = "Damaged",
            DamageFee = 100000
        }, 99);

        result.StatusCode.Should().Be(200);
        rental.DepositStatus.Should().Be("Forfeited");
        rental.AdditionalCharge.Should().Be(0);
    }

    [Fact]
    public async Task ReturnEquipment_DamagedAboveDeposit_ChargesOnlyDelta()
    {
        var rental = new BookingDetailEquipment
        {
            DetailId = 3,
            EquipmentId = 10,
            Quantity = 1,
            UnitPrice = 50000,
            DepositAmount = 100000,
            RentalStatus = "Rented"
        };

        var rentalRepo = new Mock<IEquipmentRentalRepository>();
        rentalRepo.Setup(r => r.GetByIdAsync(3)).ReturnsAsync(rental);
        rentalRepo.Setup(r => r.UpdateAsync(It.IsAny<BookingDetailEquipment>())).Returns(Task.CompletedTask);

        var equipmentRepo = new Mock<IEquipmentRepository>();
        equipmentRepo.Setup(e => e.GetByIdAsync(10)).ReturnsAsync(new Equipment
        {
            EquipmentId = 10,
            StockQuantity = 0,
            Status = "Available"
        });
        equipmentRepo.Setup(e => e.UpdateAsync(It.IsAny<Equipment>())).Returns(Task.CompletedTask);

        var svc = new EquipmentRentalService(
            rentalRepo.Object,
            equipmentRepo.Object,
            Mock.Of<IBookingRepository>(),
            Mock.Of<IUserRepository>(),
            NullLogger<EquipmentRentalService>.Instance);

        var result = await svc.ReturnEquipmentAsync(3, new ReturnEquipmentRequest
        {
            ReturnCondition = "Damaged",
            DamageFee = 150000
        }, 99);

        result.StatusCode.Should().Be(200);
        rental.AdditionalCharge.Should().Be(50000);
    }

    [Fact]
    public async Task SplitPaymentExpire_UsesSingleTransactionPerBooking()
    {
        await using var db = CreateDb(nameof(SplitPaymentExpire_UsesSingleTransactionPerBooking));
        var host = new User { UserId = 1001, FullName = "Host", Email = "h@test.vn", PasswordHash = "x", Role = Roles.Customer, EKycStatus = "Verified" };
        var guest = new User { UserId = 1002, FullName = "Guest", Email = "g@test.vn", PasswordHash = "x", Role = Roles.Customer, EKycStatus = "Verified" };
        db.Users.AddRange(host, guest);
        db.EscrowWallets.Add(new EscrowWallet { UserId = 1002, Balance = 0, RowVersion = new byte[8] });

        var booking = new Booking
        {
            UserId = 1001,
            TotalAmount = 200000,
            Status = BookingStatus.Pending,
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

        var notifications = new Mock<INotificationService>();
        notifications.Setup(n => n.SendToUserAsync(It.IsAny<int>(), It.IsAny<RealtimeNotificationDto>()))
            .Returns(Task.CompletedTask);

        var svc = new SplitPaymentService(
            db,
            Mock.Of<IBookingRepository>(),
            Mock.Of<ICourtRepository>(),
            new EscrowRepository(db),
            Mock.Of<IUserRepository>(),
            notifications.Object,
            Mock.Of<IMembershipService>(),
            NullLogger<SplitPaymentService>.Instance);

        var expired = await svc.ExpireUnpaidSharesAsync();
        expired.Should().Be(1);

        var updated = await db.Bookings.Include(b => b.PaymentShares).FirstAsync();
        updated.Status.Should().Be(BookingStatus.Cancelled);
        updated.PaymentStatus.Should().Be(PaymentStatus.Refunded);
        updated.PaymentShares.First(s => s.UserId == 1002).Status.Should().Be(PaymentShareStatus.Refunded);
    }

    [Fact]
    public async Task OwnerVoucher_InvalidStatus_Returns400BeforeSave()
    {
        await using var db = CreateDb(nameof(OwnerVoucher_InvalidStatus_Returns400BeforeSave));
        db.Vouchers.Add(new Voucher
        {
            VoucherId = 1,
            Code = "TEST10",
            Name = "Test",
            DiscountPercent = 10,
            TotalQuantity = 10,
            StartDate = DateTime.UtcNow.Date,
            EndDate = DateTime.UtcNow.Date.AddDays(30),
            Status = VoucherStatus.Active,
            ApplicableComplexId = 1,
            CreatedAt = DateTime.UtcNow
        });
        await db.SaveChangesAsync();

        var svc = new OwnerVoucherService(db, Mock.Of<IAuditLogService>());
        var result = await svc.UpdateVoucherStatusAsync(
            1,
            1,
            1,
            new ProSport.Application.DTOs.Owner.UpdateVoucherStatusDto { Status = "Actvie" });

        result.StatusCode.Should().Be(400);
        (await db.Vouchers.FirstAsync()).Status.Should().Be(VoucherStatus.Active);
    }

    [Fact]
    public async Task SplitPayment_DuplicateParticipant_Returns400()
    {
        var svc = new SplitPaymentService(
            CreateDb(nameof(SplitPayment_DuplicateParticipant_Returns400)),
            Mock.Of<IBookingRepository>(),
            Mock.Of<ICourtRepository>(),
            Mock.Of<IEscrowRepository>(),
            Mock.Of<IUserRepository>(),
            Mock.Of<INotificationService>(),
            Mock.Of<IMembershipService>(),
            NullLogger<SplitPaymentService>.Instance);

        var result = await svc.CreateSplitBookingAsync(10, new CreateSplitBookingDto
        {
            Details = new List<CreateBookingDetailDto>
            {
                new() { CourtId = 1, BookingDate = DateTime.UtcNow.Date.AddDays(7), StartTime = TimeSpan.FromHours(8), EndTime = TimeSpan.FromHours(9) }
            },
            Participants = new List<SplitParticipantDto>
            {
                new() { UserId = 10, Amount = 50000 },
                new() { UserId = 10, Amount = 50000 }
            }
        });

        result.StatusCode.Should().Be(400);
        result.Message.Should().Contain("một phần chia bill");
    }

    [Fact]
    public async Task CartCheckout_FailsMidCart_RollsBackStockAndKeepsCartItems()
    {
        await using var db = CreateDb(nameof(CartCheckout_FailsMidCart_RollsBackStockAndKeepsCartItems));

        var user = new User { UserId = 500, FullName = "Buyer", Email = "buyer@test.vn", PasswordHash = "x", Role = Roles.Customer, EKycStatus = "Verified" };
        db.Users.Add(user);

        var okItem = new Equipment { EquipmentId = 1, EquipmentName = "Vợt A", Name = "Vợt A", RetailPrice = 100000, StockQuantity = 5, Status = "Available" };
        var badItem = new Equipment { EquipmentId = 2, EquipmentName = "Vợt B", Name = "Vợt B", RetailPrice = 200000, StockQuantity = 1, Status = "Available" };
        db.Equipments.AddRange(okItem, badItem);

        db.CartItems.AddRange(
            new CartItem { UserId = 500, EquipmentId = 1, Quantity = 2, UnitPrice = 100000 },
            new CartItem { UserId = 500, EquipmentId = 2, Quantity = 3, UnitPrice = 200000 });

        await db.SaveChangesAsync();

        var cartRepo = CreateCartRepository(db);
        var equipmentRepo = new EquipmentRepository(db);
        var svc = new CartService(cartRepo, equipmentRepo, Mock.Of<IBookingRepository>());

        var act = async () => await svc.CheckoutAsync(500);
        await act.Should().ThrowAsync<InvalidOperationException>();

        (await db.Equipments.FirstAsync(e => e.EquipmentId == 1)).StockQuantity.Should().Be(5);
        (await db.CartItems.CountAsync(c => c.UserId == 500 && !c.IsDeleted)).Should().Be(2);
    }

    [Fact]
    public async Task CartCheckout_WithBookingId_OnlyChecksOutLinkedItems()
    {
        await using var db = CreateDb(nameof(CartCheckout_WithBookingId_OnlyChecksOutLinkedItems));

        var user = new User { UserId = 600, FullName = "Buyer", Email = "b2@test.vn", PasswordHash = "x", Role = Roles.Customer, EKycStatus = "Verified" };
        db.Users.Add(user);
        db.Bookings.Add(new Booking { BookingId = 10, UserId = 600, TotalAmount = 100000, Status = BookingStatus.Confirmed, PaymentStatus = PaymentStatus.Paid });

        var eq1 = new Equipment { EquipmentId = 11, EquipmentName = "Vợt X", Name = "Vợt X", RetailPrice = 50000, StockQuantity = 10, Status = "Available" };
        var eq2 = new Equipment { EquipmentId = 12, EquipmentName = "Vợt Y", Name = "Vợt Y", RetailPrice = 80000, StockQuantity = 10, Status = "Available" };
        db.Equipments.AddRange(eq1, eq2);

        db.CartItems.AddRange(
            new CartItem { UserId = 600, EquipmentId = 11, Quantity = 1, UnitPrice = 50000, BookingId = 10 },
            new CartItem { UserId = 600, EquipmentId = 12, Quantity = 2, UnitPrice = 80000 });

        await db.SaveChangesAsync();
        SeedWallet(db, 600, 500_000);
        await db.SaveChangesAsync();

        var bookingRepo = new Mock<IBookingRepository>();
        bookingRepo.Setup(r => r.GetByIdAsync(10)).ReturnsAsync(new Booking { BookingId = 10, UserId = 600 });

        var svc = new CartService(CreateCartRepository(db), new EquipmentRepository(db), bookingRepo.Object);
        await svc.CheckoutAsync(600, bookingId: 10);

        (await db.Equipments.FirstAsync(e => e.EquipmentId == 11)).StockQuantity.Should().Be(9);
        (await db.Equipments.FirstAsync(e => e.EquipmentId == 12)).StockQuantity.Should().Be(10);
        (await db.CartItems.CountAsync(c => c.UserId == 600 && !c.IsDeleted)).Should().Be(1);
        (await db.EscrowWallets.FirstAsync(w => w.UserId == 600)).Balance.Should().Be(450_000);
        (await db.Transactions.CountAsync(t => t.BookingId == 10 && t.Amount == 50_000)).Should().Be(1);
    }

    [Fact]
    public async Task CartCheckout_WithOtherUsersBooking_ThrowsUnauthorized()
    {
        var bookingRepo = new Mock<IBookingRepository>();
        bookingRepo.Setup(r => r.GetByIdAsync(99)).ReturnsAsync(new Booking { BookingId = 99, UserId = 777 });

        var svc = new CartService(
            Mock.Of<ICartRepository>(),
            Mock.Of<IEquipmentRepository>(),
            bookingRepo.Object);

        var act = async () => await svc.CheckoutAsync(600, bookingId: 99);
        await act.Should().ThrowAsync<UnauthorizedAccessException>();
    }

    [Fact]
    public async Task AddToCart_SameEquipmentDifferentBooking_KeepsSeparateLines()
    {
        await using var db = CreateDb(nameof(AddToCart_SameEquipmentDifferentBooking_KeepsSeparateLines));

        db.Users.Add(new User { UserId = 700, FullName = "Buyer", Email = "b3@test.vn", PasswordHash = "x", Role = Roles.Customer, EKycStatus = "Verified" });
        db.Equipments.Add(new Equipment { EquipmentId = 20, EquipmentName = "Vợt Z", Name = "Vợt Z", RetailPrice = 60000, StockQuantity = 5, Status = "Available" });
        await db.SaveChangesAsync();

        var repo = CreateCartRepository(db);
        await repo.AddItemAsync(700, 20, 1, 60000, null, bookingId: 1);
        await repo.AddItemAsync(700, 20, 2, 60000, null, bookingId: 2);

        var lines = await db.CartItems.Where(c => c.UserId == 700 && !c.IsDeleted).ToListAsync();
        lines.Should().HaveCount(2);
        lines.Should().OnlyContain(c => c.EquipmentId == 20);
        lines.Select(c => c.Quantity).Should().BeEquivalentTo(new[] { 1, 2 });
    }

    [Fact]
    public async Task CartCheckout_InsufficientWallet_DoesNotReduceStock()
    {
        await using var db = CreateDb(nameof(CartCheckout_InsufficientWallet_DoesNotReduceStock));

        db.Users.Add(new User { UserId = 800, FullName = "Buyer", Email = "b4@test.vn", PasswordHash = "x", Role = Roles.Customer, EKycStatus = "Verified" });
        db.Equipments.Add(new Equipment { EquipmentId = 30, EquipmentName = "Vợt W", Name = "Vợt W", RetailPrice = 100_000, StockQuantity = 5, Status = "Available" });
        db.CartItems.Add(new CartItem { UserId = 800, EquipmentId = 30, Quantity = 1, UnitPrice = 100_000 });
        SeedWallet(db, 800, 10_000);
        await db.SaveChangesAsync();

        var svc = new CartService(CreateCartRepository(db), new EquipmentRepository(db), Mock.Of<IBookingRepository>());

        var act = async () => await svc.CheckoutAsync(800);
        await act.Should().ThrowAsync<InvalidOperationException>().WithMessage("*Số dư ví không đủ*");

        (await db.Equipments.FirstAsync(e => e.EquipmentId == 30)).StockQuantity.Should().Be(5);
        (await db.CartItems.CountAsync(c => c.UserId == 800 && !c.IsDeleted)).Should().Be(1);
        (await db.EscrowWallets.FirstAsync(w => w.UserId == 800)).Balance.Should().Be(10_000);
        (await db.Transactions.CountAsync()).Should().Be(0);
    }
}
