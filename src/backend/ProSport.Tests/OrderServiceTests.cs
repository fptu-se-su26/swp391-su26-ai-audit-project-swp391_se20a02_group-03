using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using ProSport.Application.DTOs;
using ProSport.Application.Services;
using ProSport.Domain.Constants;
using ProSport.Domain.Entities;
using ProSport.Infrastructure.Data;
using ProSport.Infrastructure.Repositories;
using Xunit;

namespace ProSport.Tests;

public class OrderServiceTests
{
    private static ProSportDbContext CreateDb(string name)
    {
        var options = new DbContextOptionsBuilder<ProSportDbContext>()
            .UseInMemoryDatabase(name)
            .ConfigureWarnings(w => w.Ignore(InMemoryEventId.TransactionIgnoredWarning))
            .Options;
        return new ProSportDbContext(options);
    }

    private static OrderService CreateService(ProSportDbContext db) =>
        new(new OrderRepository(db, new EscrowRepository(db)));

    private static CreateOrderDto ValidDto(string method = "Wallet") => new()
    {
        PaymentMethod = method,
        RecipientName = "Nguyễn Văn A",
        RecipientPhone = "0901234567",
        ProvinceId = 202, ProvinceName = "Hà Nội",
        DistrictId = 1454, DistrictName = "Quận Cầu Giấy",
        WardCode = "21012", WardName = "Phường Dịch Vọng",
        AddressDetail = "123 Cầu Giấy"
    };

    private static void Seed(ProSportDbContext db, int userId, decimal balance, int stock)
    {
        db.Users.Add(new User { UserId = userId, FullName = "Buyer", Email = $"b{userId}@t.vn", PasswordHash = "x", Role = Roles.Customer, EKycStatus = "Verified" });
        db.EscrowWallets.Add(new EscrowWallet { UserId = userId, Balance = balance, RowVersion = new byte[8] });
        db.Equipments.Add(new Equipment { EquipmentId = 1, EquipmentName = "Vợt A", Name = "Vợt A", RetailPrice = 100000, StockQuantity = stock, Status = "Available" });
        db.CartItems.Add(new CartItem { UserId = userId, EquipmentId = 1, Quantity = 2, UnitPrice = 100000 });
        db.SaveChanges();
    }

    [Fact]
    public async Task Checkout_Succeeds_DebitsWallet_DecrementsStock_ClearsCart()
    {
        await using var db = CreateDb(nameof(Checkout_Succeeds_DebitsWallet_DecrementsStock_ClearsCart));
        Seed(db, 500, 500_000, 5);

        var result = await CreateService(db).CheckoutFromCartAsync(500, ValidDto());

        result.StatusCode.Should().Be(201);
        result.Data!.Status.Should().Be(OrderStatuses.Paid);
        result.Data.PaymentStatus.Should().Be(PaymentStatus.Paid);
        result.Data.TotalAmount.Should().Be(200_000);
        result.Data.Items.Should().HaveCount(1);
        (await db.Equipments.FirstAsync(e => e.EquipmentId == 1)).StockQuantity.Should().Be(3);
        (await db.EscrowWallets.FirstAsync(w => w.UserId == 500)).Balance.Should().Be(300_000);
        (await db.CartItems.CountAsync(c => c.UserId == 500 && !c.IsDeleted)).Should().Be(0);
        (await db.Orders.CountAsync()).Should().Be(1);
    }

    [Fact]
    public async Task Checkout_Returns400_AndRollsBack_WhenWalletInsufficient()
    {
        await using var db = CreateDb(nameof(Checkout_Returns400_AndRollsBack_WhenWalletInsufficient));
        Seed(db, 501, 10_000, 5);

        var result = await CreateService(db).CheckoutFromCartAsync(501, ValidDto());

        result.StatusCode.Should().Be(400);
        (await db.Equipments.FirstAsync()).StockQuantity.Should().Be(5);
        (await db.Orders.CountAsync()).Should().Be(0);
        (await db.CartItems.CountAsync(c => !c.IsDeleted)).Should().Be(1);
    }

    [Fact]
    public async Task Checkout_Returns400_WhenCartEmpty()
    {
        await using var db = CreateDb(nameof(Checkout_Returns400_WhenCartEmpty));
        db.Users.Add(new User { UserId = 502, FullName = "B", Email = "b502@t.vn", PasswordHash = "x", Role = Roles.Customer, EKycStatus = "Verified" });
        db.EscrowWallets.Add(new EscrowWallet { UserId = 502, Balance = 500_000, RowVersion = new byte[8] });
        await db.SaveChangesAsync();

        var result = await CreateService(db).CheckoutFromCartAsync(502, ValidDto());
        result.StatusCode.Should().Be(400);
    }

    [Fact]
    public async Task Checkout_Returns400_WhenPhoneInvalid()
    {
        await using var db = CreateDb(nameof(Checkout_Returns400_WhenPhoneInvalid));
        var dto = ValidDto();
        dto.RecipientPhone = "123";

        var result = await CreateService(db).CheckoutFromCartAsync(1, dto);

        result.StatusCode.Should().Be(400);
        result.Message.Should().Contain("Số điện thoại");
    }

    [Fact]
    public async Task Checkout_Returns400_WhenPayOsSelectedInPhase1()
    {
        await using var db = CreateDb(nameof(Checkout_Returns400_WhenPayOsSelectedInPhase1));

        var result = await CreateService(db).CheckoutFromCartAsync(1, ValidDto("PayOS"));

        result.StatusCode.Should().Be(400);
        result.Message.Should().Contain("Ví Escrow");
    }
}
