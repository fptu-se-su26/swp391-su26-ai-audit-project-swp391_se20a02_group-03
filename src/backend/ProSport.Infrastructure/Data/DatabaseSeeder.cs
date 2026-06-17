using Microsoft.EntityFrameworkCore;
using ProSport.Domain.Entities;

namespace ProSport.Infrastructure.Data;

public static class DatabaseSeeder
{
    private const int MinDiverseEquipmentCount = 20;

    public static async Task EnsureEquipmentRentalSchemaAsync(ProSportDbContext context)
    {
        await context.Database.ExecuteSqlRawAsync("""
            IF EXISTS (
                SELECT 1 FROM sys.columns
                WHERE object_id = OBJECT_ID('dbo.BookingDetails_Equipments')
                  AND name = 'BookingId' AND is_nullable = 0)
            BEGIN
                ALTER TABLE [dbo].[BookingDetails_Equipments] ALTER COLUMN [BookingId] INT NULL;
            END

            IF COL_LENGTH('dbo.BookingDetails_Equipments', 'UserId') IS NULL
                ALTER TABLE [dbo].[BookingDetails_Equipments] ADD [UserId] INT NOT NULL
                    CONSTRAINT [DF_BookingDetailsEquip_UserId] DEFAULT (1);

            IF COL_LENGTH('dbo.BookingDetails_Equipments', 'DepositAmount') IS NULL
                ALTER TABLE [dbo].[BookingDetails_Equipments] ADD [DepositAmount] DECIMAL(18,2) NOT NULL
                    CONSTRAINT [DF_BookingDetailsEquip_DepositAmount] DEFAULT (0);

            IF COL_LENGTH('dbo.BookingDetails_Equipments', 'DepositStatus') IS NULL
                ALTER TABLE [dbo].[BookingDetails_Equipments] ADD [DepositStatus] VARCHAR(20) NOT NULL
                    CONSTRAINT [DF_BookingDetailsEquip_DepositStatus] DEFAULT ('Held');

            IF COL_LENGTH('dbo.BookingDetails_Equipments', 'RentalStatus') IS NULL
                ALTER TABLE [dbo].[BookingDetails_Equipments] ADD [RentalStatus] VARCHAR(20) NOT NULL
                    CONSTRAINT [DF_BookingDetailsEquip_RentalStatus] DEFAULT ('Rented');

            IF COL_LENGTH('dbo.BookingDetails_Equipments', 'ReturnCondition') IS NULL
                ALTER TABLE [dbo].[BookingDetails_Equipments] ADD [ReturnCondition] VARCHAR(20) NULL;

            IF COL_LENGTH('dbo.BookingDetails_Equipments', 'DamageNote') IS NULL
                ALTER TABLE [dbo].[BookingDetails_Equipments] ADD [DamageNote] NVARCHAR(500) NULL;

            IF COL_LENGTH('dbo.BookingDetails_Equipments', 'DamageFee') IS NULL
                ALTER TABLE [dbo].[BookingDetails_Equipments] ADD [DamageFee] DECIMAL(18,2) NULL;

            IF COL_LENGTH('dbo.BookingDetails_Equipments', 'DepositRefundAmount') IS NULL
                ALTER TABLE [dbo].[BookingDetails_Equipments] ADD [DepositRefundAmount] DECIMAL(18,2) NULL;

            IF COL_LENGTH('dbo.BookingDetails_Equipments', 'AdditionalCharge') IS NULL
                ALTER TABLE [dbo].[BookingDetails_Equipments] ADD [AdditionalCharge] DECIMAL(18,2) NULL;

            IF COL_LENGTH('dbo.BookingDetails_Equipments', 'RentedAt') IS NULL
                ALTER TABLE [dbo].[BookingDetails_Equipments] ADD [RentedAt] DATETIME2(7) NOT NULL
                    CONSTRAINT [DF_BookingDetailsEquip_RentedAt] DEFAULT (SYSDATETIME());
            """);
    }

    public static async Task SeedEquipmentAsync(ProSportDbContext context)
    {
        await EnsureCategoryColumnAsync(context);

        if (await IsSeedUpToDateAsync(context))
        {
            return;
        }

        await ClearEquipmentDataAsync(context);

        var equipments = BuildEquipmentCatalog();
        context.Equipments.AddRange(equipments);
        await context.SaveChangesAsync();
    }

    private static async Task EnsureCategoryColumnAsync(ProSportDbContext context)
    {
        await context.Database.ExecuteSqlRawAsync("""
            IF COL_LENGTH('dbo.Equipments', 'Category') IS NULL
            BEGIN
                ALTER TABLE [dbo].[Equipments]
                ADD [Category] VARCHAR(30) NOT NULL
                    CONSTRAINT [DF_Equipments_Category] DEFAULT ('Racket');
            END
            """);
    }

    private static async Task<bool> IsSeedUpToDateAsync(ProSportDbContext context)
    {
        var count = await context.Equipments.CountAsync(e => !e.IsDeleted);
        if (count < MinDiverseEquipmentCount)
        {
            return false;
        }

        var categories = await context.Equipments
            .Where(e => !e.IsDeleted)
            .Select(e => e.Category)
            .Distinct()
            .ToListAsync();

        var requiredCategories = new[]
        {
            "Racket",
            "Footwear",
            "Apparel",
            "Ball / Birdie",
            "Accessories",
            "Protection"
        };

        return requiredCategories.All(categories.Contains);
    }

    private static async Task ClearEquipmentDataAsync(ProSportDbContext context)
    {
        await context.Database.ExecuteSqlRawAsync("DELETE FROM [dbo].[BookingDetails_Equipments]");

        await context.Database.ExecuteSqlRawAsync("""
            IF OBJECT_ID('dbo.EquipmentUnits', 'U') IS NOT NULL
                DELETE FROM [dbo].[EquipmentUnits];
            """);

        await context.Database.ExecuteSqlRawAsync("DELETE FROM [dbo].[Equipments]");
    }

    private static List<Equipment> BuildEquipmentCatalog() => new()
    {
        // ── Racket ──────────────────────────────────────────────────────────
        new Equipment
        {
            EquipmentName = "Vợt Yonex Astrox 88D",
            Category = "Racket",
            SportType = "Badminton",
            RetailPrice = 6_000_000m,
            RentalStock = 10,
            SalesStock = 5,
            ImageUrl = "https://images.unsplash.com/photo-1617083934551-1af7da84de49?w=400&q=80",
            Description = "Vợt tấn công nặng đầu, cân bằng 4U, phù hợp người chơi trung bình đến nâng cao."
        },
        new Equipment
        {
            EquipmentName = "Vợt Lining Windstorm 72",
            Category = "Racket",
            SportType = "Badminton",
            RetailPrice = 4_000_000m,
            RentalStock = 8,
            SalesStock = 8,
            ImageUrl = "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80",
            Description = "Vợt siêu nhẹ, tốc độ cao, lý tưởng cho người mới bắt đầu và đánh đôi."
        },
        new Equipment
        {
            EquipmentName = "Vợt Victor Thruster K Falcon",
            Category = "Racket",
            SportType = "Badminton",
            RetailPrice = 5_500_000m,
            RentalStock = 6,
            SalesStock = 4,
            ImageUrl = "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80",
            Description = "Vợt công thủ toàn diện, độ cứng vừa phải, kiểm soát tốt ở lưới và phía sau sân."
        },
        new Equipment
        {
            EquipmentName = "Vợt Selkirk AMPED Epic",
            Category = "Racket",
            SportType = "Pickleball",
            RetailPrice = 7_000_000m,
            RentalStock = 6,
            SalesStock = 4,
            ImageUrl = "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&q=80",
            Description = "Vợt polymer core FiberFlex, cân bằng giữa sức mạnh và kiểm soát bóng."
        },
        new Equipment
        {
            EquipmentName = "Vợt HEAD Radical Elite",
            Category = "Racket",
            SportType = "Pickleball",
            RetailPrice = 5_000_000m,
            RentalStock = 10,
            SalesStock = 6,
            ImageUrl = "https://images.unsplash.com/photo-1612452040814-e42b8f2da8ea?w=400&q=80",
            Description = "Vợt composite nhẹ, grip êm tay, phù hợp người mới chơi pickleball."
        },

        // ── Footwear ──────────────────────────────────────────────────────
        new Equipment
        {
            EquipmentName = "Giày Yonex Power Cushion 65Z3",
            Category = "Footwear",
            SportType = "Badminton",
            RetailPrice = 3_200_000m,
            RentalStock = 12,
            SalesStock = 6,
            ImageUrl = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
            Description = "Giày cầu lông Power Cushion, đệm gót êm, bám sân tốt khi di chuyển nhanh."
        },
        new Equipment
        {
            EquipmentName = "Giày Victor A610 III",
            Category = "Footwear",
            SportType = "Badminton",
            RetailPrice = 2_400_000m,
            RentalStock = 10,
            SalesStock = 8,
            ImageUrl = "https://images.unsplash.com/photo-1606107557195-0a394bbe4a5d?w=400&q=80",
            Description = "Giày cầu lông nhẹ, thoáng khí, phù hợp tập luyện và thi đấu phong trào."
        },
        new Equipment
        {
            EquipmentName = "Giày Asics Gel-Rocket 11",
            Category = "Footwear",
            SportType = "Pickleball",
            RetailPrice = 2_800_000m,
            RentalStock = 8,
            SalesStock = 5,
            ImageUrl = "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&q=80",
            Description = "Giày đa năng cho sân trong nhà, đế cao su bám tốt, hỗ trợ cổ chân ổn định."
        },
        new Equipment
        {
            EquipmentName = "Giày Mizuno Wave Fang NX",
            Category = "Footwear",
            SportType = "Badminton",
            RetailPrice = 3_500_000m,
            RentalStock = 6,
            SalesStock = 3,
            ImageUrl = "https://images.unsplash.com/photo-1460353581641-37baddab0fa0?w=400&q=80",
            Description = "Giày cầu lông cao cấp, công nghệ Wave giảm chấn, phù hợp vận động viên."
        },

        // ── Apparel ───────────────────────────────────────────────────────
        new Equipment
        {
            EquipmentName = "Áo thi đấu Yonex Tournament",
            Category = "Apparel",
            SportType = "Badminton",
            RetailPrice = 650_000m,
            RentalStock = 20,
            SalesStock = 15,
            ImageUrl = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
            Description = "Áo thun thi đấu thoáng mát, thấm hút mồ hôi, form regular fit."
        },
        new Equipment
        {
            EquipmentName = "Quần short thể thao Pro-Sport DryFit",
            Category = "Apparel",
            SportType = "Badminton",
            RetailPrice = 450_000m,
            RentalStock = 18,
            SalesStock = 12,
            ImageUrl = "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&q=80",
            Description = "Quần short co giãn 4 chiều, khô nhanh, phù hợp tập luyện và thi đấu."
        },
        new Equipment
        {
            EquipmentName = "Áo khoác gió thể thao Pro-Sport",
            Category = "Apparel",
            SportType = "Pickleball",
            RetailPrice = 890_000m,
            RentalStock = 14,
            SalesStock = 10,
            ImageUrl = "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&q=80",
            Description = "Áo khoác chống gió nhẹ, có mũ trùm đầu, dễ gấp gọn mang theo."
        },
        new Equipment
        {
            EquipmentName = "Váy thi đấu nữ Victor",
            Category = "Apparel",
            SportType = "Badminton",
            RetailPrice = 720_000m,
            RentalStock = 10,
            SalesStock = 6,
            ImageUrl = "https://images.unsplash.com/photo-1518310383802-640c2b31135a?w=400&q=80",
            Description = "Váy thi đấu nữ co giãn, thiết kế năng động, thoải mái khi vận động."
        },

        // ── Ball / Birdie ─────────────────────────────────────────────────
        new Equipment
        {
            EquipmentName = "Cầu lông nhựa Yonex Mavis 350 (ống 6 quả)",
            Category = "Ball / Birdie",
            SportType = "Badminton",
            RetailPrice = 280_000m,
            RentalStock = 30,
            SalesStock = 25,
            ImageUrl = "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80",
            Description = "Cầu nhựa tập luyện bền, quỹ đạo ổn định, phù hợp sân trong nhà."
        },
        new Equipment
        {
            EquipmentName = "Cầu lông lông ngỗng Yonex AS-50 (hộp 12 quả)",
            Category = "Ball / Birdie",
            SportType = "Badminton",
            RetailPrice = 1_200_000m,
            RentalStock = 15,
            SalesStock = 10,
            ImageUrl = "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&q=80",
            Description = "Cầu lông thi đấu cao cấp, lông ngỗng tự nhiên, độ bền và cảm giác đánh tốt."
        },
        new Equipment
        {
            EquipmentName = "Bóng Pickleball Franklin X-40 (hộp 6 quả)",
            Category = "Ball / Birdie",
            SportType = "Pickleball",
            RetailPrice = 350_000m,
            RentalStock = 25,
            SalesStock = 20,
            ImageUrl = "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&q=80",
            Description = "Bóng pickleball trong nhà, lỗ 40, độ nảy đồng đều, chuẩn thi đấu."
        },
        new Equipment
        {
            EquipmentName = "Bóng Pickleball Onix Fuse G2 (hộp 6 quả)",
            Category = "Ball / Birdie",
            SportType = "Pickleball",
            RetailPrice = 420_000m,
            RentalStock = 20,
            SalesStock = 15,
            ImageUrl = "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=400&q=80",
            Description = "Bóng pickleball ngoài trời, bền, ít vỡ, phù hợp sân cứng."
        },

        // ── Accessories ───────────────────────────────────────────────────
        new Equipment
        {
            EquipmentName = "Quấn cán vợt Yonex Super Grap (3 cuộn)",
            Category = "Accessories",
            SportType = "Badminton",
            RetailPrice = 180_000m,
            RentalStock = 40,
            SalesStock = 30,
            ImageUrl = "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80",
            Description = "Quấn cán thấm mồ hôi, mềm, tăng độ bám khi cầm vợt lâu."
        },
        new Equipment
        {
            EquipmentName = "Túi đựng vợt 6 ngăn Yonex Pro",
            Category = "Accessories",
            SportType = "Badminton",
            RetailPrice = 2_100_000m,
            RentalStock = 8,
            SalesStock = 5,
            ImageUrl = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",
            Description = "Túi vợt 6 ngăn có ngăn giày riêng, chống nước nhẹ, đeo vai hoặc xách tay."
        },
        new Equipment
        {
            EquipmentName = "Băng cổ tay thấm mồ hôi (bộ 2)",
            Category = "Accessories",
            SportType = "Badminton",
            RetailPrice = 120_000m,
            RentalStock = 35,
            SalesStock = 25,
            ImageUrl = "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80",
            Description = "Băng tay co giãn, thấm mồ hôi, giữ khô tay khi thi đấu."
        },
        new Equipment
        {
            EquipmentName = "Khăn thể thao microfiber Pro-Sport",
            Category = "Accessories",
            SportType = "Pickleball",
            RetailPrice = 95_000m,
            RentalStock = 50,
            SalesStock = 40,
            ImageUrl = "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=400&q=80",
            Description = "Khăn lau mồ hôi siêu thấm, khô nhanh, kích thước 40x80cm."
        },
        new Equipment
        {
            EquipmentName = "Hộp cầu lông mini tập luyện",
            Category = "Accessories",
            SportType = "Badminton",
            RetailPrice = 150_000m,
            RentalStock = 20,
            SalesStock = 15,
            ImageUrl = "https://images.unsplash.com/photo-1517649763962-0c62306601b7?w=400&q=80",
            Description = "Hộp đựng cầu tiện lợi, có khóa, phù hợp mang theo khi tập."
        },

        // ── Protection ────────────────────────────────────────────────────
        new Equipment
        {
            EquipmentName = "Băng gối thể thao neoprene",
            Category = "Protection",
            SportType = "Badminton",
            RetailPrice = 320_000m,
            RentalStock = 15,
            SalesStock = 10,
            ImageUrl = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
            Description = "Băng gối hỗ trợ khớp, co giãn, giảm chấn khi di chuyển đột ngột."
        },
        new Equipment
        {
            EquipmentName = "Băng cổ chân thể thao",
            Category = "Protection",
            SportType = "Badminton",
            RetailPrice = 250_000m,
            RentalStock = 18,
            SalesStock = 12,
            ImageUrl = "https://images.unsplash.com/photo-1518310383802-640c2b31135a?w=400&q=80",
            Description = "Băng cổ chân cố định khớp, phòng tránh trẹo cổ chân khi thi đấu."
        },
        new Equipment
        {
            EquipmentName = "Kính bảo hộ Pickleball Pro-Sport",
            Category = "Protection",
            SportType = "Pickleball",
            RetailPrice = 480_000m,
            RentalStock = 12,
            SalesStock = 8,
            ImageUrl = "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&q=80",
            Description = "Kính chống va đập, chống sương mù, bảo vệ mắt khi đánh gần lưới."
        },
        new Equipment
        {
            EquipmentName = "Băng khuỷu tay hỗ trợ",
            Category = "Protection",
            SportType = "Pickleball",
            RetailPrice = 210_000m,
            RentalStock = 14,
            SalesStock = 10,
            ImageUrl = "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80",
            Description = "Băng khuỷu tay co giãn, giảm mỏi cơ tay khi đánh liên tục."
        },
    };
}
