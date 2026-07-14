using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Moq;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
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

    private static OrderService CreateService(ProSportDbContext db, decimal shippingFee = 20000m, bool shipOk = true)
    {
        var shipping = new Mock<IShippingService>();
        shipping.Setup(s => s.CalculateFeeAsync(It.IsAny<int>(), It.IsAny<string>(), It.IsAny<int>()))
            .ReturnsAsync(shippingFee);
        shipping.Setup(s => s.CreateShipmentAsync(It.IsAny<Order>(), It.IsAny<int>()))
            .ReturnsAsync((Order o, int _) => new ShipmentResult(shipOk, shipOk ? "GHN-TEST-123" : null, o.ShippingFee, shipOk ? null : "err"));

        var payos = new Mock<IPayOsService>();
        payos.SetupGet(p => p.IsMockMode).Returns(true);
        payos.Setup(p => p.CreatePaymentLinkAsync(It.IsAny<Order>()))
            .ReturnsAsync((Order o) => new PayOsLinkResult(true, $"https://payos.mock/{o.OrderId}", $"LINK-{o.OrderId}", null));

        return new OrderService(new OrderRepository(db, new EscrowRepository(db)), shipping.Object, payos.Object);
    }

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
        result.Data.Subtotal.Should().Be(200_000);
        result.Data.ShippingFee.Should().Be(20_000);
        result.Data.TotalAmount.Should().Be(220_000);           // subtotal + phí ship
        result.Data.TrackingCode.Should().Be("GHN-TEST-123");
        result.Data.ShippingStatus.Should().Be(ShippingStatuses.Created);
        result.Data.Items.Should().HaveCount(1);
        (await db.Equipments.FirstAsync(e => e.EquipmentId == 1)).StockQuantity.Should().Be(3);
        (await db.EscrowWallets.FirstAsync(w => w.UserId == 500)).Balance.Should().Be(280_000); // 500k - 220k
        (await db.CartItems.CountAsync(c => c.UserId == 500 && !c.IsDeleted)).Should().Be(0);
        (await db.Orders.CountAsync()).Should().Be(1);
    }

    [Fact]
    public async Task Checkout_Returns400_WhenWardNotSelected()
    {
        await using var db = CreateDb(nameof(Checkout_Returns400_WhenWardNotSelected));
        var dto = ValidDto();
        dto.WardCode = "";

        var result = await CreateService(db).CheckoutFromCartAsync(1, dto);

        result.StatusCode.Should().Be(400);
        result.Message.Should().Contain("Phường");
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
    public async Task Checkout_Cod_CreatesProcessingOrder_NoWalletDebit_WithShipment()
    {
        await using var db = CreateDb(nameof(Checkout_Cod_CreatesProcessingOrder_NoWalletDebit_WithShipment));
        Seed(db, 600, 0, 5);

        var result = await CreateService(db).CheckoutFromCartAsync(600, ValidDto("COD"));

        result.StatusCode.Should().Be(201);
        result.Data!.Status.Should().Be(OrderStatuses.Processing);
        result.Data.PaymentStatus.Should().Be(PaymentStatus.Pending);
        result.Data.TrackingCode.Should().Be("GHN-TEST-123");
        (await db.EscrowWallets.FirstAsync(w => w.UserId == 600)).Balance.Should().Be(0);   // COD không trừ ví
        (await db.Equipments.FirstAsync()).StockQuantity.Should().Be(3);                     // giữ chỗ tồn kho
    }

    [Fact]
    public async Task Checkout_PayOs_ReturnsCheckoutUrl_OrderPending_NoShipmentYet()
    {
        await using var db = CreateDb(nameof(Checkout_PayOs_ReturnsCheckoutUrl_OrderPending_NoShipmentYet));
        Seed(db, 601, 0, 5);

        var result = await CreateService(db).CheckoutFromCartAsync(601, ValidDto("PayOS"));

        result.StatusCode.Should().Be(201);
        result.Data!.PaymentUrl.Should().NotBeNullOrEmpty();
        result.Data.Status.Should().Be(OrderStatuses.Pending);
        result.Data.PaymentStatus.Should().Be(PaymentStatus.Pending);
        result.Data.TrackingCode.Should().BeNull();                       // vận đơn tạo sau khi PayOS xác nhận
        (await db.Equipments.FirstAsync()).StockQuantity.Should().Be(3);  // giữ chỗ tồn kho
    }

    [Fact]
    public async Task ConfirmPayOs_MarksPaid_AndCreatesShipment()
    {
        await using var db = CreateDb(nameof(ConfirmPayOs_MarksPaid_AndCreatesShipment));
        Seed(db, 602, 0, 5);
        var svc = CreateService(db);

        var checkout = await svc.CheckoutFromCartAsync(602, ValidDto("PayOS"));
        var orderId = checkout.Data!.OrderId;

        var confirm = await svc.ConfirmPayOsPaymentAsync(orderId, checkout.Data.TotalAmount);

        confirm.StatusCode.Should().Be(200);
        var order = await db.Orders.FirstAsync(o => o.OrderId == orderId);
        order.PaymentStatus.Should().Be(PaymentStatus.Paid);
        order.Status.Should().Be(OrderStatuses.Paid);
        order.TrackingCode.Should().Be("GHN-TEST-123");
    }

    [Fact]
    public async Task ConfirmPayOs_Returns400_WhenAmountMismatch()
    {
        await using var db = CreateDb(nameof(ConfirmPayOs_Returns400_WhenAmountMismatch));
        Seed(db, 603, 0, 5);
        var svc = CreateService(db);
        var checkout = await svc.CheckoutFromCartAsync(603, ValidDto("PayOS"));

        var confirm = await svc.ConfirmPayOsPaymentAsync(checkout.Data!.OrderId, 999m);

        confirm.StatusCode.Should().Be(400);
    }
}
