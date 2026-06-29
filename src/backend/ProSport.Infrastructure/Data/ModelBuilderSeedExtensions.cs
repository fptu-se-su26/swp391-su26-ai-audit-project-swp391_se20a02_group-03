using Microsoft.EntityFrameworkCore;
using ProSport.Domain.Entities;

namespace ProSport.Infrastructure.Data;

/// <summary>
/// TK-038: Seed dữ liệu mẫu bằng EF Core HasData().
/// Ưu điểm: dữ liệu được nhúng thẳng vào Migration -> file SQL xuất ra (dotnet ef migrations script)
/// sẽ chứa sẵn các lệnh INSERT, giám khảo chạy script là có data đăng nhập được ngay.
///
/// LƯU Ý:
/// - HasData yêu cầu giá trị TĨNH: PK gán cứng, ngày tháng là hằng số (không dùng DateTime.UtcNow).
/// - Mật khẩu admin/sample đều là BCrypt hash tĩnh của "Admin@123456".
/// - Bộ 20 thiết bị phủ ĐỦ 6 Category để seeder runtime (DatabaseSeeder) nhận diện "đã seed đủ" và tự bỏ qua,
///   tránh việc bị xóa & ghi đè khi chạy app.
/// </summary>
public static class ModelBuilderSeedExtensions
{
    // Ngày seed cố định để migration ổn định, không bị churn mỗi lần build.
    private static readonly DateTime SeedDate = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);

    // BCrypt hash tĩnh của mật khẩu mẫu (xem SampleAccountDefaults.Password).
    private const string SamplePasswordHash = SampleAccountDefaults.PasswordHash;

    public static void SeedInitialData(this ModelBuilder modelBuilder)
    {
        SeedEquipmentCategories(modelBuilder);
        SeedCourtTypes(modelBuilder);
        SeedUsers(modelBuilder);
        SeedCourts(modelBuilder);
        SeedPricingRules(modelBuilder);
        SeedEquipments(modelBuilder);
    }

    // 6 danh mục thiết bị (Id 1..6)
    private static void SeedEquipmentCategories(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<EquipmentCategory>().HasData(
            new EquipmentCategory { EquipmentCategoryId = 1, Name = "Racket", Description = "Tất cả các loại vợt", CreatedAt = SeedDate, IsDeleted = false },
            new EquipmentCategory { EquipmentCategoryId = 2, Name = "Footwear", Description = "Giày thể thao", CreatedAt = SeedDate, IsDeleted = false },
            new EquipmentCategory { EquipmentCategoryId = 3, Name = "Apparel", Description = "Trang phục thể thao", CreatedAt = SeedDate, IsDeleted = false },
            new EquipmentCategory { EquipmentCategoryId = 4, Name = "Ball / Birdie", Description = "Bóng và cầu lông", CreatedAt = SeedDate, IsDeleted = false },
            new EquipmentCategory { EquipmentCategoryId = 5, Name = "Accessories", Description = "Phụ kiện", CreatedAt = SeedDate, IsDeleted = false },
            new EquipmentCategory { EquipmentCategoryId = 6, Name = "Protection", Description = "Đồ bảo hộ", CreatedAt = SeedDate, IsDeleted = false }
        );
    }

    // 2 loại sân (Id 1=Badminton, 2=Pickleball)
    private static void SeedCourtTypes(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CourtType>().HasData(
            new CourtType { CourtTypeId = 1, Name = "Badminton", Description = "Sân cầu lông tiêu chuẩn", CreatedAt = SeedDate, IsDeleted = false },
            new CourtType { CourtTypeId = 2, Name = "Pickleball", Description = "Sân Pickleball tiêu chuẩn", CreatedAt = SeedDate, IsDeleted = false }
        );
    }

    // 10 người dùng (Id 1=Admin, 2-3=Staff, 4-10=Customer). Mật khẩu chung: Admin@123456
    private static void SeedUsers(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasData(
            new User { UserId = 1, FullName = "System Admin", Email = "admin@prosport.vn", PasswordHash = SamplePasswordHash, PhoneNumber = "0900000001", Role = "Admin", EKycStatus = "Verified", IsPhoneVerified = true, IsLocked = false, IsDeleted = false, CreatedAt = SeedDate },
            new User { UserId = 2, FullName = "Nguyễn Văn Staff", Email = "staff1@prosport.vn", PasswordHash = SamplePasswordHash, PhoneNumber = "0900000002", Role = "Staff", EKycStatus = "Verified", IsPhoneVerified = true, IsLocked = false, IsDeleted = false, CreatedAt = SeedDate },
            new User { UserId = 3, FullName = "Trần Thị Staff", Email = "staff2@prosport.vn", PasswordHash = SamplePasswordHash, PhoneNumber = "0900000003", Role = "Staff", EKycStatus = "Verified", IsPhoneVerified = true, IsLocked = false, IsDeleted = false, CreatedAt = SeedDate },
            new User { UserId = 4, FullName = "Lê Văn Cường", Email = "customer1@prosport.vn", PasswordHash = SamplePasswordHash, PhoneNumber = "0900000004", Role = "Customer", EKycStatus = "Verified", IsPhoneVerified = true, IsLocked = false, IsDeleted = false, CreatedAt = SeedDate },
            new User { UserId = 5, FullName = "Phạm Thị Dung", Email = "customer2@prosport.vn", PasswordHash = SamplePasswordHash, PhoneNumber = "0900000005", Role = "Customer", EKycStatus = "Verified", IsPhoneVerified = true, IsLocked = false, IsDeleted = false, CreatedAt = SeedDate },
            new User { UserId = 6, FullName = "Hoàng Văn Em", Email = "customer3@prosport.vn", PasswordHash = SamplePasswordHash, PhoneNumber = "0900000006", Role = "Customer", EKycStatus = "Pending", IsPhoneVerified = true, IsLocked = false, IsDeleted = false, CreatedAt = SeedDate },
            new User { UserId = 7, FullName = "Võ Thị Phượng", Email = "customer4@prosport.vn", PasswordHash = SamplePasswordHash, PhoneNumber = "0900000007", Role = "Customer", EKycStatus = "Verified", IsPhoneVerified = true, IsLocked = false, IsDeleted = false, CreatedAt = SeedDate },
            new User { UserId = 8, FullName = "Đặng Văn Giang", Email = "customer5@prosport.vn", PasswordHash = SamplePasswordHash, PhoneNumber = "0900000008", Role = "Customer", EKycStatus = "Unverified", IsPhoneVerified = false, IsLocked = false, IsDeleted = false, CreatedAt = SeedDate },
            new User { UserId = 9, FullName = "Bùi Thị Hoa", Email = "customer6@prosport.vn", PasswordHash = SamplePasswordHash, PhoneNumber = "0900000009", Role = "Customer", EKycStatus = "Verified", IsPhoneVerified = true, IsLocked = true, IsDeleted = false, CreatedAt = SeedDate },
            new User { UserId = 10, FullName = "Đỗ Văn Inh", Email = "customer7@prosport.vn", PasswordHash = SamplePasswordHash, PhoneNumber = "0900000010", Role = "Customer", EKycStatus = "Verified", IsPhoneVerified = true, IsLocked = false, IsDeleted = false, CreatedAt = SeedDate }
        );
    }

    // 5 sân (Id 1..5)
    private static void SeedCourts(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Court>().HasData(
            new Court { CourtId = 1, Name = "Sân Cầu Lông A1", CourtTypeId = 1, Status = "Available", Description = "Sân thảm PVC Yonex cao cấp", ImageUrl = "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600", CreatedAt = SeedDate, IsDeleted = false },
            new Court { CourtId = 2, Name = "Sân Cầu Lông A2", CourtTypeId = 1, Status = "Available", Description = "Sân thảm PVC Yonex cao cấp", ImageUrl = "https://images.unsplash.com/photo-1517649763962-0c62306601b7?w=600", CreatedAt = SeedDate, IsDeleted = false },
            new Court { CourtId = 3, Name = "Sân Cầu Lông A3", CourtTypeId = 1, Status = "Available", Description = "Sân thảm gỗ cao cấp", ImageUrl = "https://images.unsplash.com/photo-1521537634581-227f84850b41?w=600", CreatedAt = SeedDate, IsDeleted = false },
            new Court { CourtId = 4, Name = "Sân Pickleball P1", CourtTypeId = 2, Status = "Available", Description = "Sân ngoài trời tiêu chuẩn Mỹ", ImageUrl = "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600", CreatedAt = SeedDate, IsDeleted = false },
            new Court { CourtId = 5, Name = "Sân Pickleball P2", CourtTypeId = 2, Status = "Available", Description = "Sân ngoài trời tiêu chuẩn Mỹ", ImageUrl = "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=600", CreatedAt = SeedDate, IsDeleted = false }
        );
    }

    // 6 quy tắc giá (Id 1..6) theo loại sân
    private static void SeedPricingRules(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<PricingRule>().HasData(
            new PricingRule { PricingRuleId = 1, CourtTypeId = 1, StartTime = new TimeSpan(5, 0, 0), EndTime = new TimeSpan(17, 0, 0), PricePerHour = 80000m, IsWeekend = false, CreatedAt = SeedDate, IsDeleted = false },
            new PricingRule { PricingRuleId = 2, CourtTypeId = 1, StartTime = new TimeSpan(17, 0, 0), EndTime = new TimeSpan(22, 0, 0), PricePerHour = 120000m, IsWeekend = false, CreatedAt = SeedDate, IsDeleted = false },
            new PricingRule { PricingRuleId = 3, CourtTypeId = 1, StartTime = new TimeSpan(5, 0, 0), EndTime = new TimeSpan(22, 0, 0), PricePerHour = 140000m, IsWeekend = true, CreatedAt = SeedDate, IsDeleted = false },
            new PricingRule { PricingRuleId = 4, CourtTypeId = 2, StartTime = new TimeSpan(5, 0, 0), EndTime = new TimeSpan(17, 0, 0), PricePerHour = 100000m, IsWeekend = false, CreatedAt = SeedDate, IsDeleted = false },
            new PricingRule { PricingRuleId = 5, CourtTypeId = 2, StartTime = new TimeSpan(17, 0, 0), EndTime = new TimeSpan(22, 0, 0), PricePerHour = 150000m, IsWeekend = false, CreatedAt = SeedDate, IsDeleted = false },
            new PricingRule { PricingRuleId = 6, CourtTypeId = 2, StartTime = new TimeSpan(5, 0, 0), EndTime = new TimeSpan(22, 0, 0), PricePerHour = 180000m, IsWeekend = true, CreatedAt = SeedDate, IsDeleted = false }
        );
    }

    // 20 thiết bị (Id 1..20) — phủ đủ 6 Category
    private static void SeedEquipments(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Equipment>().HasData(
            // ── Racket (cat 1) ──
            NewEquipment(1, 1, "Vợt Yonex Astrox 88D", "Racket", "Badminton", 6_000_000m, 5, "https://images.unsplash.com/photo-1617083934551-1af7da84de49?w=400&q=80", "Vợt tấn công nặng đầu, cân bằng 4U, phù hợp người chơi trung bình đến nâng cao."),
            NewEquipment(2, 1, "Vợt Lining Windstorm 72", "Racket", "Badminton", 4_000_000m, 8, "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80", "Vợt siêu nhẹ, tốc độ cao, lý tưởng cho người mới bắt đầu và đánh đôi."),
            NewEquipment(3, 1, "Vợt Victor Thruster K Falcon", "Racket", "Badminton", 5_500_000m, 4, "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80", "Vợt công thủ toàn diện, độ cứng vừa phải, kiểm soát tốt."),
            NewEquipment(4, 1, "Vợt Selkirk AMPED Epic", "Racket", "Pickleball", 7_000_000m, 4, "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&q=80", "Vợt polymer core FiberFlex, cân bằng giữa sức mạnh và kiểm soát bóng."),
            // ── Footwear (cat 2) ──
            NewEquipment(5, 2, "Giày Yonex Power Cushion 65Z3", "Footwear", "Badminton", 3_200_000m, 6, "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80", "Giày cầu lông Power Cushion, đệm gót êm, bám sân tốt."),
            NewEquipment(6, 2, "Giày Victor A610 III", "Footwear", "Badminton", 2_400_000m, 8, "https://images.unsplash.com/photo-1606107557195-0a394bbe4a5d?w=400&q=80", "Giày cầu lông nhẹ, thoáng khí, phù hợp tập luyện và thi đấu phong trào."),
            NewEquipment(7, 2, "Giày Asics Gel-Rocket 11", "Footwear", "Pickleball", 2_800_000m, 5, "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&q=80", "Giày đa năng cho sân trong nhà, đế cao su bám tốt, hỗ trợ cổ chân ổn định."),
            // ── Apparel (cat 3) ──
            NewEquipment(8, 3, "Áo thi đấu Yonex Tournament", "Apparel", "Badminton", 650_000m, 15, "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80", "Áo thun thi đấu thoáng mát, thấm hút mồ hôi, form regular fit."),
            NewEquipment(9, 3, "Quần short thể thao Pro-Sport DryFit", "Apparel", "Badminton", 450_000m, 12, "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&q=80", "Quần short co giãn 4 chiều, khô nhanh, phù hợp tập luyện và thi đấu."),
            NewEquipment(10, 3, "Áo khoác gió thể thao Pro-Sport", "Apparel", "Pickleball", 890_000m, 10, "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&q=80", "Áo khoác chống gió nhẹ, có mũ trùm đầu, dễ gấp gọn mang theo."),
            // ── Ball / Birdie (cat 4) ──
            NewEquipment(11, 4, "Cầu lông nhựa Yonex Mavis 350 (ống 6 quả)", "Ball / Birdie", "Badminton", 280_000m, 25, "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80", "Cầu nhựa tập luyện bền, quỹ đạo ổn định, phù hợp sân trong nhà."),
            NewEquipment(12, 4, "Cầu lông lông ngỗng Yonex AS-50 (hộp 12 quả)", "Ball / Birdie", "Badminton", 1_200_000m, 10, "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&q=80", "Cầu lông thi đấu cao cấp, lông ngỗng tự nhiên, độ bền và cảm giác đánh tốt."),
            NewEquipment(13, 4, "Bóng Pickleball Franklin X-40 (hộp 6 quả)", "Ball / Birdie", "Pickleball", 350_000m, 20, "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&q=80", "Bóng pickleball trong nhà, lỗ 40, độ nảy đồng đều, chuẩn thi đấu."),
            NewEquipment(14, 4, "Bóng Pickleball Onix Fuse G2 (hộp 6 quả)", "Ball / Birdie", "Pickleball", 420_000m, 15, "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=400&q=80", "Bóng pickleball ngoài trời, bền, ít vỡ, phù hợp sân cứng."),
            // ── Accessories (cat 5) ──
            NewEquipment(15, 5, "Quấn cán vợt Yonex Super Grap (3 cuộn)", "Accessories", "Badminton", 180_000m, 30, "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80", "Quấn cán thấm mồ hôi, mềm, tăng độ bám khi cầm vợt lâu."),
            NewEquipment(16, 5, "Túi đựng vợt 6 ngăn Yonex Pro", "Accessories", "Badminton", 2_100_000m, 5, "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80", "Túi vợt 6 ngăn có ngăn giày riêng, chống nước nhẹ."),
            NewEquipment(17, 5, "Băng cổ tay thấm mồ hôi (bộ 2)", "Accessories", "Badminton", 120_000m, 25, "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80", "Băng tay co giãn, thấm mồ hôi, giữ khô tay khi thi đấu."),
            // ── Protection (cat 6) ──
            NewEquipment(18, 6, "Băng gối thể thao neoprene", "Protection", "Badminton", 320_000m, 10, "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80", "Băng gối hỗ trợ khớp, co giãn, giảm chấn khi di chuyển đột ngột."),
            NewEquipment(19, 6, "Băng cổ chân thể thao", "Protection", "Badminton", 250_000m, 12, "https://images.unsplash.com/photo-1518310383802-640c2b31135a?w=400&q=80", "Băng cổ chân cố định khớp, phòng tránh trẹo cổ chân khi thi đấu."),
            NewEquipment(20, 6, "Kính bảo hộ Pickleball Pro-Sport", "Protection", "Pickleball", 480_000m, 8, "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&q=80", "Kính chống va đập, chống sương mù, bảo vệ mắt khi đánh gần lưới.")
        );
    }

    private static Equipment NewEquipment(int id, int categoryId, string name, string category, string sportType, decimal retailPrice, int stock, string imageUrl, string description) => new()
    {
        EquipmentId = id,
        EquipmentCategoryId = categoryId,
        Name = name,
        EquipmentName = name,
        Category = category,
        SportType = sportType,
        RetailPrice = retailPrice,
        Price = retailPrice,
        StockQuantity = stock,
        Status = "Available",
        ImageUrl = imageUrl,
        Description = description,
        CreatedAt = SeedDate,
        IsDeleted = false
    };
}
