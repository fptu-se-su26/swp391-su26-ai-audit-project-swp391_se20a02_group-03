using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using ProSport.Domain.Entities;
using ProSport.Infrastructure.Data;
using ProSport.Infrastructure.Services;

namespace ProSport.Tests;

/// <summary>
/// BUG 4 — chính sách hoàn tiền từng so slot (giờ VN) với DateTime.UtcNow trần,
/// khiến khách được tính "hủy sớm hơn 7 tiếng". Các test dùng FakeTimeProvider (fixed time)
/// nên chạy ổn định trên mọi máy bất kể timezone.
/// Policy mặc định (không có policy trong DB): >=48h hoàn 100%, >=24h hoàn 50%, dưới đó hoàn 20%.
/// </summary>
public class CancellationPolicyServiceTests
{
    /// <summary>TimeProvider trả về thời điểm UTC cố định — không phụ thuộc đồng hồ thật.</summary>
    private sealed class FakeTimeProvider : TimeProvider
    {
        private readonly DateTimeOffset _utcNow;
        public FakeTimeProvider(DateTimeOffset utcNow) => _utcNow = utcNow;
        public override DateTimeOffset GetUtcNow() => _utcNow;
    }

    private static readonly TimeZoneInfo VnTz = GetVnTz();

    private static TimeZoneInfo GetVnTz()
    {
        try { return TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time"); }
        catch { return TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh"); }
    }

    private static ProSportDbContext CreateDb()
    {
        var options = new DbContextOptionsBuilder<ProSportDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        // Không gọi EnsureCreated -> không seed HasData -> policy rơi về mặc định 48/24/50/80.
        return new ProSportDbContext(options);
    }

    /// <summary>Tạo service với "bây giờ" theo giờ VN cố định.</summary>
    private static CancellationPolicyService CreateService(DateTime vnNow)
    {
        var utc = TimeZoneInfo.ConvertTimeToUtc(DateTime.SpecifyKind(vnNow, DateTimeKind.Unspecified), VnTz);
        return new CancellationPolicyService(CreateDb(), new FakeTimeProvider(new DateTimeOffset(utc, TimeSpan.Zero)));
    }

    private static Booking CreateBooking(DateTime slotVnDate, TimeSpan slotStart, decimal total = 200_000m)
    {
        return new Booking
        {
            BookingId = 1,
            UserId = 4,
            TotalAmount = total,
            BookingDetails = new List<BookingDetail>
            {
                new() { CourtId = 1, BookingDate = slotVnDate.Date, StartTime = slotStart, EndTime = slotStart.Add(TimeSpan.FromHours(1)) }
            }
        };
    }

    private static readonly DateTime BaseVnNow = new(2026, 07, 10, 10, 00, 00); // 10:00 giờ VN

    // ---------- Boundary mốc hoàn 100% (48h) ----------

    [Fact]
    public async Task Cancel_JustBefore48hBoundary_GetsFullRefund()
    {
        var svc = CreateService(BaseVnNow);
        // Slot bắt đầu sau đúng 48h + 1 phút
        var booking = CreateBooking(BaseVnNow.AddHours(48).AddMinutes(1).Date, BaseVnNow.AddHours(48).AddMinutes(1).TimeOfDay);

        var result = await svc.CalculateBookingRefundAsync(booking);

        result.RefundPercent.Should().Be(100m);
        result.RefundAmount.Should().Be(200_000m);
        result.PenaltyAmount.Should().Be(0m);
    }

    [Fact]
    public async Task Cancel_JustAfter48hBoundary_GetsPartialRefund()
    {
        var svc = CreateService(BaseVnNow);
        // Slot bắt đầu sau 48h - 1 phút -> không còn đủ điều kiện hoàn 100%
        var slot = BaseVnNow.AddHours(48).AddMinutes(-1);
        var booking = CreateBooking(slot.Date, slot.TimeOfDay);

        var result = await svc.CalculateBookingRefundAsync(booking);

        result.RefundPercent.Should().Be(50m);
        result.RefundAmount.Should().Be(100_000m);
        result.PenaltyAmount.Should().Be(100_000m);
    }

    // ---------- Boundary mốc hoàn một phần (24h) ----------

    [Fact]
    public async Task Cancel_JustBefore24hBoundary_GetsPartialRefund()
    {
        var svc = CreateService(BaseVnNow);
        var slot = BaseVnNow.AddHours(24).AddMinutes(1);
        var booking = CreateBooking(slot.Date, slot.TimeOfDay);

        var result = await svc.CalculateBookingRefundAsync(booking);

        result.RefundPercent.Should().Be(50m);
    }

    [Fact]
    public async Task Cancel_JustAfter24hBoundary_GetsLateCancelRefund()
    {
        var svc = CreateService(BaseVnNow);
        var slot = BaseVnNow.AddHours(24).AddMinutes(-1);
        var booking = CreateBooking(slot.Date, slot.TimeOfDay);

        var result = await svc.CalculateBookingRefundAsync(booking);

        result.RefundPercent.Should().Be(20m); // 100 - phạt 80
        result.RefundAmount.Should().Be(40_000m);
        result.PenaltyAmount.Should().Be(160_000m);
    }

    // ---------- Slot đã bắt đầu / quá khứ ----------

    [Fact]
    public async Task Cancel_AfterSlotStarted_GetsNoRefund()
    {
        var svc = CreateService(BaseVnNow);
        var slot = BaseVnNow.AddHours(-1); // đã bắt đầu 1 tiếng trước
        var booking = CreateBooking(slot.Date, slot.TimeOfDay);

        var result = await svc.CalculateBookingRefundAsync(booking);

        result.RefundAmount.Should().Be(0m);
        result.RefundPercent.Should().Be(0m);
    }

    [Fact]
    public async Task Cancel_PastBooking_GetsNoRefund()
    {
        var svc = CreateService(BaseVnNow);
        var slot = BaseVnNow.AddDays(-3); // booking 3 ngày trước
        var booking = CreateBooking(slot.Date, slot.TimeOfDay);

        var result = await svc.CalculateBookingRefundAsync(booking);

        result.RefundAmount.Should().Be(0m);
    }

    // ---------- Minh họa đúng lỗi lệch 7 tiếng trước đây ----------

    [Fact]
    public async Task Cancel_47hBefore_MustBePartial_NotFull_RegressionFor7hSkew()
    {
        // Slot cách "bây giờ VN" 47h -> đúng chính sách là hoàn 50%.
        // Code cũ so với UtcNow trần: 47h + 7h = 54h >= 48h -> hoàn 100% (SAI).
        var svc = CreateService(BaseVnNow);
        var slot = BaseVnNow.AddHours(47);
        var booking = CreateBooking(slot.Date, slot.TimeOfDay);

        var result = await svc.CalculateBookingRefundAsync(booking);

        result.RefundPercent.Should().Be(50m, "khoảng cách thật là 47h < 48h — bug lệch múi giờ cũ sẽ trả 100%");
    }

    // ---------- Bất biến số tiền ----------

    [Theory]
    [InlineData(72)]   // hoàn 100%
    [InlineData(30)]   // hoàn 50%
    [InlineData(2)]    // hoàn 20%
    [InlineData(-5)]   // đã bắt đầu
    public async Task Refund_NeverNegative_NeverExceedsTotal(int hoursFromNow)
    {
        var svc = CreateService(BaseVnNow);
        var slot = BaseVnNow.AddHours(hoursFromNow);
        var booking = CreateBooking(slot.Date, slot.TimeOfDay, total: 333_333m);

        var result = await svc.CalculateBookingRefundAsync(booking);

        result.RefundAmount.Should().BeGreaterThanOrEqualTo(0m);
        result.RefundAmount.Should().BeLessThanOrEqualTo(booking.TotalAmount);
        (result.RefundAmount + result.PenaltyAmount).Should().BeLessThanOrEqualTo(booking.TotalAmount);
    }

    // ---------- Weather cancel ----------

    [Fact]
    public async Task WeatherCancel_AlwaysFullRefund()
    {
        var svc = CreateService(BaseVnNow);
        var slot = BaseVnNow.AddHours(1); // sát giờ
        var booking = CreateBooking(slot.Date, slot.TimeOfDay);

        var result = await svc.CalculateBookingRefundAsync(booking, weatherCancel: true);

        result.RefundPercent.Should().Be(100m);
    }

    // ---------- CalculateMatchLeaveRelease dùng cùng hệ quy chiếu giờ VN ----------

    [Fact]
    public async Task MatchLeave_47hBefore_MustBePartial_RegressionFor7hSkew()
    {
        var svc = CreateService(BaseVnNow);
        var matchTimeVn = BaseVnNow.AddHours(47);

        var (releasePercent, _) = await svc.CalculateMatchLeaveReleaseAsync(complexId: 0, matchTimeVn);

        releasePercent.Should().Be(50m, "47h < 48h — code cũ so UtcNow sẽ trả 100%");
    }

    [Fact]
    public async Task MatchLeave_AfterStart_ReleasesNothing()
    {
        var svc = CreateService(BaseVnNow);
        var matchTimeVn = BaseVnNow.AddHours(-1);

        var (releasePercent, _) = await svc.CalculateMatchLeaveReleaseAsync(complexId: 0, matchTimeVn);

        releasePercent.Should().Be(0m);
    }
}
