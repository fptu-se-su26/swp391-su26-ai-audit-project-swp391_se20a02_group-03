using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ProSport.Domain.Entities;
using ProSport.Infrastructure.Services;

namespace ProSport.Infrastructure.Data;

/// <summary>
/// Seed dữ liệu vận hành demo cho Staff (bookings hôm nay, khiếu nại, kèo, thuê thiết bị).
/// Chỉ chạy một lần — nhận diện qua PaymentMethod = StaffDemo.
/// </summary>
public static class StaffDemoSeeder
{
    private const string DemoMarker = "StaffDemo";

    public static async Task SeedAsync(ProSportDbContext context, ILogger logger)
    {
        if (await context.Bookings.AnyAsync(b => b.PaymentMethod == DemoMarker))
        {
            logger.LogInformation("[StaffDemoSeeder] Demo operational data already exists. Skipping.");
            return;
        }

        var today = VnTimeHelper.VnToday();
        var nowUtc = DateTime.UtcNow;

        var booking1 = new Booking
        {
            UserId = 4,
            TotalAmount = 80000m,
            Status = "Confirmed",
            PaymentMethod = DemoMarker,
            PaymentStatus = "Paid",
            CreatedAt = nowUtc,
            IsDeleted = false,
        };
        context.Bookings.Add(booking1);
        await context.SaveChangesAsync();
        booking1.CheckInCode = $"DEMO-QR-{booking1.BookingId}-AM01";
        context.BookingDetails.Add(new BookingDetail
        {
            BookingId = booking1.BookingId,
            CourtId = 1,
            BookingDate = today,
            StartTime = new TimeSpan(9, 0, 0),
            EndTime = new TimeSpan(10, 0, 0),
            Price = 80000m,
            CreatedAt = nowUtc,
            IsDeleted = false,
        });

        var booking2 = new Booking
        {
            UserId = 5,
            TotalAmount = 160000m,
            Status = "Confirmed",
            PaymentMethod = DemoMarker,
            PaymentStatus = "Paid",
            CreatedAt = nowUtc,
            IsDeleted = false,
        };
        context.Bookings.Add(booking2);
        await context.SaveChangesAsync();
        booking2.CheckInCode = $"DEMO-QR-{booking2.BookingId}-PM01";
        context.BookingDetails.Add(new BookingDetail
        {
            BookingId = booking2.BookingId,
            CourtId = 2,
            BookingDate = today,
            StartTime = new TimeSpan(14, 0, 0),
            EndTime = new TimeSpan(16, 0, 0),
            Price = 160000m,
            CreatedAt = nowUtc,
            IsDeleted = false,
        });

        var booking3 = new Booking
        {
            UserId = 7,
            TotalAmount = 240000m,
            Status = "Confirmed",
            PaymentMethod = DemoMarker,
            PaymentStatus = "Paid",
            CreatedAt = nowUtc,
            IsDeleted = false,
        };
        context.Bookings.Add(booking3);
        await context.SaveChangesAsync();
        booking3.CheckInCode = $"DEMO-QR-{booking3.BookingId}-EV01";
        context.BookingDetails.Add(new BookingDetail
        {
            BookingId = booking3.BookingId,
            CourtId = 3,
            BookingDate = today,
            StartTime = new TimeSpan(18, 0, 0),
            EndTime = new TimeSpan(20, 0, 0),
            Price = 240000m,
            CreatedAt = nowUtc,
            IsDeleted = false,
        });

        var booking4 = new Booking
        {
            UserId = 11,
            TotalAmount = 120000m,
            Status = "Completed",
            PaymentMethod = DemoMarker,
            PaymentStatus = "Paid",
            CreatedAt = nowUtc.AddHours(-2),
            IsDeleted = false,
        };
        context.Bookings.Add(booking4);
        await context.SaveChangesAsync();
        booking4.CheckInCode = $"DEMO-QR-{booking4.BookingId}-CK01";
        context.BookingDetails.Add(new BookingDetail
        {
            BookingId = booking4.BookingId,
            CourtId = 4,
            BookingDate = today,
            StartTime = new TimeSpan(7, 0, 0),
            EndTime = new TimeSpan(8, 0, 0),
            Price = 120000m,
            CreatedAt = nowUtc,
            IsDeleted = false,
        });
        context.CheckIns.Add(new CheckIn
        {
            BookingId = booking4.BookingId,
            StaffId = 2,
            CheckInTime = nowUtc.AddHours(-1),
            Notes = "Demo check-in",
            CreatedAt = nowUtc,
            IsDeleted = false,
        });

        var demoMatch = new Match
        {
            HostId = 4,
            CourtId = 1,
            MatchDate = today,
            StartTime = new TimeSpan(19, 0, 0),
            EndTime = new TimeSpan(21, 0, 0),
            MaxParticipants = 4,
            CurrentParticipants = 2,
            EscrowAmount = 50000m,
            Status = "Open",
            LevelRequirement = "Intermediate",
            Notes = "Kèo demo Staff — cầu lông đôi",
            CreatedAt = nowUtc,
            IsDeleted = false,
        };
        context.Matches.Add(demoMatch);
        await context.SaveChangesAsync();

        context.Reports.AddRange(
            new Report
            {
                ReporterId = 4,
                ReportedUserId = 8,
                MatchId = demoMatch.MatchId,
                Reason = "Đối thủ không đến sân đúng giờ (demo khiếu nại).",
                Status = "Pending",
                CreatedAt = nowUtc,
                IsDeleted = false,
            },
            new Report
            {
                ReporterId = 5,
                ReportedUserId = 6,
                MatchId = demoMatch.MatchId,
                Reason = "Tranh cãi điểm số trong trận (demo đang đối chứng).",
                Status = "Investigating",
                AdminNote = "Staff đang thu thập bằng chứng.",
                ResolvedByAdminId = 2,
                CreatedAt = nowUtc.AddHours(-3),
                IsDeleted = false,
            });

        var equipment = await context.Equipments.FirstAsync(e => e.EquipmentId == 1);
        equipment.StockQuantity = Math.Max(0, equipment.StockQuantity - 1);
        context.BookingDetailEquipments.Add(new BookingDetailEquipment
        {
            UserId = 4,
            EquipmentId = 1,
            Quantity = 1,
            UnitPrice = 30000m,
            DepositAmount = 100000m,
            DepositStatus = "Held",
            RentalStatus = "Rented",
            RentedAt = nowUtc.AddHours(-1),
        });

        await context.SaveChangesAsync();
        logger.LogInformation("[StaffDemoSeeder] Created demo bookings, reports, match and equipment rental for {Date}.", today.ToString("yyyy-MM-dd"));
    }
}
