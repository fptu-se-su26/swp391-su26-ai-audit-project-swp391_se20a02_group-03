using Microsoft.EntityFrameworkCore;
using ProSport.Domain.Entities;

namespace ProSport.Infrastructure.Data;

public static class DatabaseSeeder
{
    public static async Task SeedEquipmentAsync(ProSportDbContext context)
    {
        await EnsureCategoryColumnAsync(context);

        // Ensure at least one EquipmentCategory exists (FK required)
        if (!await context.EquipmentCategories.AnyAsync())
        {
            var defaultCategories = new[]
            {
                new ProSport.Domain.Entities.EquipmentCategory { Name = "Racket", Description = "All racket types", CreatedAt = DateTime.UtcNow },
                new ProSport.Domain.Entities.EquipmentCategory { Name = "Footwear", Description = "Sports shoes", CreatedAt = DateTime.UtcNow },
                new ProSport.Domain.Entities.EquipmentCategory { Name = "Apparel", Description = "Sports clothing", CreatedAt = DateTime.UtcNow },
                new ProSport.Domain.Entities.EquipmentCategory { Name = "Ball / Birdie", Description = "Balls and shuttlecocks", CreatedAt = DateTime.UtcNow },
                new ProSport.Domain.Entities.EquipmentCategory { Name = "Accessories", Description = "Miscellaneous accessories", CreatedAt = DateTime.UtcNow },
                new ProSport.Domain.Entities.EquipmentCategory { Name = "Protection", Description = "Protective gear", CreatedAt = DateTime.UtcNow },
            };
            context.EquipmentCategories.AddRange(defaultCategories);
            await context.SaveChangesAsync();
        }

        // Idempotent: chỉ seed khi bảng trống — không xóa dữ liệu admin đã thêm
        if (await context.Equipments.AnyAsync(e => !e.IsDeleted))
        {
            return;
        }

        // Get the default category id
        var defaultCategoryId = await context.EquipmentCategories
            .Where(c => !c.IsDeleted)
            .Select(c => c.EquipmentCategoryId)
            .FirstAsync();

        var equipments = BuildEquipmentCatalog(defaultCategoryId);
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

    private static List<Equipment> BuildEquipmentCatalog(int categoryId = 1) => new()
{
﻿        new Equipment { EquipmentCategoryId = 1, EquipmentName = "Vợt Cầu Lông Yonex Astrox 77 Tour Limited - Light Beige Chính Hãng", Category = "Racket", SportType = "Badminton", RetailPrice = 2939000.00m, StockQuantity = 10, ImageUrl = "/images/racket-yonex-astrox-77-tour-limited.png", Description = "Vợt cầu lông Yonex Astrox 77 Tour Limited - Light Beige, phiên bản giới hạn 2026, thiết kế cho lối đánh tấn công toàn diện, kế thừa DNA dòng Astrox 77 Tour với lớp sơn Light Beige độc bản." },
        new Equipment { EquipmentCategoryId = 3, EquipmentName = "Áo thi đấu Adidas Climacool Pro", Category = "Apparel", SportType = "Badminton", RetailPrice = 890000.00m, StockQuantity = 10, ImageUrl = "/images/apparel-adidas-climacool-pro.png", Description = "Áo thi đấu chất liệu Climacool thoáng khí, thấm hút mồ hôi nhanh, phù hợp thi đấu cầu lông cường độ cao." },
        new Equipment { EquipmentCategoryId = 3, EquipmentName = "Áo polo Adidas Club Tennis", Category = "Apparel", SportType = "Pickleball", RetailPrice = 750000.00m, StockQuantity = 10, ImageUrl = "/images/apparel-adidas-club-tennis-polo.png", Description = "Áo polo thể thao form rộng rãi, vải co giãn 4 chiều, phù hợp chơi pickleball ngoài trời." },
        new Equipment { EquipmentCategoryId = 3, EquipmentName = "Quần short Adidas Aeroready", Category = "Apparel", SportType = "Badminton", RetailPrice = 550000.00m, StockQuantity = 10, ImageUrl = "/images/apparel-adidas-aeroready-shorts.png", Description = "Quần short công nghệ Aeroready giúp khô thoáng nhanh, có túi khóa kéo tiện lợi." },
        new Equipment { EquipmentCategoryId = 3, EquipmentName = "Áo khoác gió Adidas Track Jacket", Category = "Apparel", SportType = "Badminton", RetailPrice = 1200000.00m, StockQuantity = 10, ImageUrl = "/images/apparel-adidas-track-jacket.png", Description = "Áo khoác gió 3 sọc kinh điển, chống gió nhẹ, phù hợp khởi động trước trận đấu." },
        new Equipment { EquipmentCategoryId = 3, EquipmentName = "Quần dài thể thao Adidas Tiro", Category = "Apparel", SportType = "Pickleball", RetailPrice = 650000.00m, StockQuantity = 10, ImageUrl = "/images/apparel-adidas-tiro-pants.png", Description = "Quần dài thể thao form slim-fit, vải nhẹ co giãn tốt, thích hợp tập luyện và di chuyển." },
        new Equipment { EquipmentCategoryId = 3, EquipmentName = "Áo ba lỗ Adidas Training Tank", Category = "Apparel", SportType = "Badminton", RetailPrice = 480000.00m, StockQuantity = 10, ImageUrl = "/images/apparel-adidas-training-tank.png", Description = "Áo tank top tập luyện, chất liệu nhẹ thoáng khí, hỗ trợ vận động linh hoạt." },
        new Equipment { EquipmentCategoryId = 3, EquipmentName = "Áo hoodie Adidas Essentials", Category = "Apparel", SportType = "Pickleball", RetailPrice = 1450000.00m, StockQuantity = 10, ImageUrl = "/images/apparel-adidas-essentials-hoodie.png", Description = "Áo hoodie nỉ bông giữ ấm, phù hợp mặc ngoài sân sau khi tập luyện." },
        new Equipment { EquipmentCategoryId = 3, EquipmentName = "Váy thể thao Adidas Match Skort", Category = "Apparel", SportType = "Pickleball", RetailPrice = 890000.00m, StockQuantity = 10, ImageUrl = "/images/apparel-adidas-match-skort.png", Description = "Váy thể thao nữ tích hợp quần lót trong, thoải mái vận động khi thi đấu pickleball." },
        new Equipment { EquipmentCategoryId = 3, EquipmentName = "Áo dài tay Adidas UV Protection", Category = "Apparel", SportType = "Badminton", RetailPrice = 950000.00m, StockQuantity = 10, ImageUrl = "/images/apparel-adidas-uv-protection.png", Description = "Áo dài tay chống nắng UPF 50+, chất liệu co giãn nhẹ, phù hợp chơi sân ngoài trời." },
        new Equipment { EquipmentCategoryId = 3, EquipmentName = "Bộ đồ thể thao Adidas Tracksuit 3-Stripes", Category = "Apparel", SportType = "Badminton", RetailPrice = 2100000.00m, StockQuantity = 10, ImageUrl = "/images/apparel-adidas-tracksuit-3stripes.png", Description = "Bộ áo khoác và quần dài đồng bộ 3 sọc, phong cách năng động, phù hợp mặc trước/sau trận." },
        new Equipment { EquipmentCategoryId = 1, EquipmentName = "Vợt Yonex Astrox 100ZZ", Category = "Racket", SportType = "Badminton", RetailPrice = 7200000.00m, StockQuantity = 10, ImageUrl = "/images/racket-yonex-astrox-100zz.png", Description = "Vợt tấn công cao cấp, thân cứng, lực đập mạnh, dành cho vận động viên trình độ cao." },
        new Equipment { EquipmentCategoryId = 1, EquipmentName = "Vợt Yonex Astrox 99 Pro", Category = "Racket", SportType = "Badminton", RetailPrice = 6800000.00m, StockQuantity = 10, ImageUrl = "/images/racket-yonex-astrox-99-pro.png", Description = "Vợt cân bằng đầu nặng, kiểm soát tốt kết hợp lực đập mạnh, phù hợp lối chơi tấn công." },
        new Equipment { EquipmentCategoryId = 1, EquipmentName = "Vợt Yonex Nanoflare 800", Category = "Racket", SportType = "Badminton", RetailPrice = 6500000.00m, StockQuantity = 10, ImageUrl = "/images/racket-yonex-nanoflare-800.png", Description = "Vợt tốc độ cao, thân nhẹ, phù hợp lối đánh nhanh và phòng thủ phản công." },
        new Equipment { EquipmentCategoryId = 1, EquipmentName = "Vợt Yonex Nanoflare 1000Z", Category = "Racket", SportType = "Badminton", RetailPrice = 7900000.00m, StockQuantity = 10, ImageUrl = "/images/racket-yonex-nanoflare-1000z.png", Description = "Vợt tốc độ vung cực nhanh, thiết kế khung khí động học, dành cho lối chơi tốc độ." },
        new Equipment { EquipmentCategoryId = 1, EquipmentName = "Vợt Yonex Duora 10", Category = "Racket", SportType = "Badminton", RetailPrice = 4900000.00m, StockQuantity = 10, ImageUrl = "/images/racket-yonex-duora-10.png", Description = "Vợt thiết kế 2 mặt bất đối xứng, hỗ trợ cả tấn công và phòng thủ linh hoạt." },
        new Equipment { EquipmentCategoryId = 1, EquipmentName = "Vợt Yonex Voltric Z-Force II", Category = "Racket", SportType = "Badminton", RetailPrice = 5600000.00m, StockQuantity = 10, ImageUrl = "/images/racket-yonex-voltric-zforce-ii.png", Description = "Vợt đầu nặng thiên về tấn công, lực đập cầu mạnh mẽ, phổ biến với VĐV chuyên nghiệp." },
        new Equipment { EquipmentCategoryId = 1, EquipmentName = "Vợt Yonex Arcsaber 11", Category = "Racket", SportType = "Badminton", RetailPrice = 5200000.00m, StockQuantity = 10, ImageUrl = "/images/racket-yonex-arcsaber-11.png", Description = "Vợt cân bằng, kiểm soát cầu chính xác, phù hợp lối chơi kỹ thuật và cầu net." },
        new Equipment { EquipmentCategoryId = 1, EquipmentName = "Vợt Yonex Astrox 88S Game", Category = "Racket", SportType = "Badminton", RetailPrice = 4700000.00m, StockQuantity = 10, ImageUrl = "/images/racket-yonex-astrox-88s-game.png", Description = "Vợt nhẹ, thao tác nhanh tay, phù hợp đánh đôi và phản xạ lưới nhanh." },
        new Equipment { EquipmentCategoryId = 1, EquipmentName = "Vợt Yonex Astrox 88D Pro", Category = "Racket", SportType = "Badminton", RetailPrice = 5100000.00m, StockQuantity = 10, ImageUrl = "/images/racket-yonex-astrox-88d-pro.png", Description = "Vợt đầu nặng hỗ trợ lực đập cầu, phù hợp lối chơi tấn công từ cuối sân." },
        new Equipment { EquipmentCategoryId = 1, EquipmentName = "Vợt Yonex Nanoflare 700", Category = "Racket", SportType = "Badminton", RetailPrice = 3800000.00m, StockQuantity = 10, ImageUrl = "/images/racket-yonex-nanoflare-700.png", Description = "Vợt tốc độ tầm trung, cân bằng giữa tốc độ vung và kiểm soát, phù hợp người chơi phong trào." },
        new Equipment { EquipmentCategoryId = 2, EquipmentName = "Giày Yonex Power Cushion 65Z3", Category = "Footwear", SportType = "Badminton", RetailPrice = 3200000.00m, StockQuantity = 10, ImageUrl = "/images/shoe-yonex-power-cushion-65z3-v2.png", Description = "Giày cầu lông đế đệm Power Cushion, ổn định chuyển hướng nhanh, bám sân tốt." },
        new Equipment { EquipmentCategoryId = 2, EquipmentName = "Giày Yonex Power Cushion Eclipsion Z2", Category = "Footwear", SportType = "Badminton", RetailPrice = 4500000.00m, StockQuantity = 10, ImageUrl = "/images/shoe-yonex-eclipsion-z2.png", Description = "Giày cao cấp hỗ trợ lực bật nhảy, đế Power Graphite Belt tăng độ ổn định." },
        new Equipment { EquipmentCategoryId = 2, EquipmentName = "Giày Yonex Power Cushion Comfort Z2", Category = "Footwear", SportType = "Badminton", RetailPrice = 2600000.00m, StockQuantity = 10, ImageUrl = "/images/shoe-yonex-comfort-z2.png", Description = "Giày êm ái, đệm gót mềm, phù hợp tập luyện thường xuyên và chơi phong trào." },
        new Equipment { EquipmentCategoryId = 2, EquipmentName = "Giày Yonex Power Cushion 88 Dial 3", Category = "Footwear", SportType = "Badminton", RetailPrice = 4200000.00m, StockQuantity = 10, ImageUrl = "/images/shoe-yonex-88-dial-3.png", Description = "Giày có khóa dial siết chặt cổ chân, hỗ trợ ổn định khi di chuyển ngang." },
        new Equipment { EquipmentCategoryId = 2, EquipmentName = "Giày Yonex Power Cushion Aerus Z2", Category = "Footwear", SportType = "Badminton", RetailPrice = 3900000.00m, StockQuantity = 10, ImageUrl = "/images/shoe-yonex-aerus-z2.png", Description = "Giày siêu nhẹ, tối ưu tốc độ di chuyển, phù hợp lối chơi tấn công nhanh." },
        new Equipment { EquipmentCategoryId = 2, EquipmentName = "Giày Yonex Power Cushion 65X3", Category = "Footwear", SportType = "Badminton", RetailPrice = 3000000.00m, StockQuantity = 10, ImageUrl = "/images/shoe-yonex-65x3.png", Description = "Giày cầu lông phổ thông, đế bám sân tốt, độ bền cao cho tập luyện hàng ngày." },
        new Equipment { EquipmentCategoryId = 2, EquipmentName = "Giày Yonex Power Cushion Infinity", Category = "Footwear", SportType = "Badminton", RetailPrice = 3500000.00m, StockQuantity = 10, ImageUrl = "/images/shoe-yonex-infinity.png", Description = "Giày cân bằng giữa êm ái và ổn định, phù hợp cả tập luyện lẫn thi đấu." },
        new Equipment { EquipmentCategoryId = 2, EquipmentName = "Giày Yonex Power Cushion 37", Category = "Footwear", SportType = "Badminton", RetailPrice = 2200000.00m, StockQuantity = 10, ImageUrl = "/images/shoe-yonex-power-cushion-37.png", Description = "Giày phổ thông giá tốt, phù hợp người mới chơi cầu lông." },
        new Equipment { EquipmentCategoryId = 2, EquipmentName = "Giày Yonex Power Cushion Cascade Drive", Category = "Footwear", SportType = "Badminton", RetailPrice = 2800000.00m, StockQuantity = 10, ImageUrl = "/images/shoe-yonex-cascade-drive.png", Description = "Giày đế êm, hỗ trợ giảm chấn tốt khi bật nhảy đập cầu." },
        new Equipment { EquipmentCategoryId = 2, EquipmentName = "Giày Yonex Power Cushion Fusionrev 5", Category = "Footwear", SportType = "Pickleball", RetailPrice = 3600000.00m, StockQuantity = 10, ImageUrl = "/images/shoe-yonex-fusionrev-5.png", Description = "Giày đa năng, hỗ trợ di chuyển đa hướng, phù hợp cả cầu lông và pickleball." },
        new Equipment { EquipmentCategoryId = 4, EquipmentName = "Cầu lông Yonex Aerosensa 50 (ống 12 quả)", Category = "Ball / Birdie", SportType = "Badminton", RetailPrice = 620000.00m, StockQuantity = 10, ImageUrl = "/images/shuttlecock-yonex-aerosensa-50.png", Description = "Cầu lông lông ngỗng cao cấp, độ bay ổn định, dùng trong thi đấu chuyên nghiệp." },
        new Equipment { EquipmentCategoryId = 4, EquipmentName = "Cầu lông Victor Champion No.3 (ống 12 quả)", Category = "Ball / Birdie", SportType = "Badminton", RetailPrice = 480000.00m, StockQuantity = 10, ImageUrl = "/images/shuttlecock-victor-champion-no3.png", Description = "Cầu lông ngỗng tiêu chuẩn thi đấu, tốc độ trung bình, bền với cú đập mạnh." },
        new Equipment { EquipmentCategoryId = 4, EquipmentName = "Cầu lông Li-Ning A+60 (ống 12 quả)", Category = "Ball / Birdie", SportType = "Badminton", RetailPrice = 450000.00m, StockQuantity = 10, ImageUrl = "/images/shuttlecock-lining-a60.png", Description = "Cầu lông ngỗng phổ biến trong tập luyện và giải phong trào, độ bay đều." },
        new Equipment { EquipmentCategoryId = 4, EquipmentName = "Cầu lông RSL Tourney No.1 (ống 12 quả)", Category = "Ball / Birdie", SportType = "Badminton", RetailPrice = 500000.00m, StockQuantity = 10, ImageUrl = "/images/shuttlecock-rsl-tourney-no1.png", Description = "Cầu lông ngỗng chuẩn thi đấu quốc tế, được nhiều giải BWF sử dụng." },
        new Equipment { EquipmentCategoryId = 4, EquipmentName = "Cầu lông nhựa Yonex Mavis 2000 (ống 6 quả)", Category = "Ball / Birdie", SportType = "Badminton", RetailPrice = 260000.00m, StockQuantity = 10, ImageUrl = "/images/shuttlecock-yonex-mavis-2000.png", Description = "Cầu lông nhựa bền, ít bị ảnh hưởng bởi thời tiết, phù hợp tập luyện hàng ngày." },
        new Equipment { EquipmentCategoryId = 1, EquipmentName = "Vợt Pickleball Selkirk Vanguard Power Air", Category = "Racket", SportType = "Pickleball", RetailPrice = 4200000.00m, StockQuantity = 10, ImageUrl = "/images/paddle-selkirk-vanguard-power-air.png", Description = "Vợt lõi polymer công nghệ Power Air, lực đánh mạnh, phổ biến với người chơi tấn công." },
        new Equipment { EquipmentCategoryId = 1, EquipmentName = "Vợt Pickleball Joola Ben Johns Hyperion CFS", Category = "Racket", SportType = "Pickleball", RetailPrice = 4500000.00m, StockQuantity = 10, ImageUrl = "/images/paddle-joola-ben-johns-hyperion-cfs.png", Description = "Vợt mặt carbon fiber, sweet spot lớn, dòng vợt gắn liền tên tuổi Ben Johns." },
        new Equipment { EquipmentCategoryId = 1, EquipmentName = "Vợt Pickleball Franklin Christian Alshon Pro", Category = "Racket", SportType = "Pickleball", RetailPrice = 3200000.00m, StockQuantity = 10, ImageUrl = "/images/paddle-franklin-christian-alshon-pro.png", Description = "Vợt cân bằng giữa kiểm soát và lực đánh, phù hợp người chơi trung cấp trở lên." },
        new Equipment { EquipmentCategoryId = 1, EquipmentName = "Vợt Pickleball Paddletek Bantam TS-5", Category = "Racket", SportType = "Pickleball", RetailPrice = 3600000.00m, StockQuantity = 10, ImageUrl = "/images/paddle-paddletek-bantam-ts5.png", Description = "Vợt lõi polypropylene êm tay, kiểm soát bóng tốt ở lưới." },
        new Equipment { EquipmentCategoryId = 1, EquipmentName = "Vợt Pickleball Gamma Compass", Category = "Racket", SportType = "Pickleball", RetailPrice = 2800000.00m, StockQuantity = 10, ImageUrl = "/images/paddle-gamma-compass.png", Description = "Vợt nhẹ, thao tác nhanh tay, phù hợp người mới chơi pickleball." },
        new Equipment { EquipmentCategoryId = 4, EquipmentName = "Bóng Pickleball Franklin X-40 Outdoor (hộp 6 quả)", Category = "Ball / Birdie", SportType = "Pickleball", RetailPrice = 280000.00m, StockQuantity = 10, ImageUrl = "/images/ball-franklin-x40-outdoor.png", Description = "Bóng thi đấu ngoài trời tiêu chuẩn USAPA, 40 lỗ, độ nảy ổn định." },
        new Equipment { EquipmentCategoryId = 4, EquipmentName = "Bóng Pickleball Onix Fuse G2 Outdoor (hộp 6 quả)", Category = "Ball / Birdie", SportType = "Pickleball", RetailPrice = 260000.00m, StockQuantity = 10, ImageUrl = "/images/ball-onix-fuse-g2-outdoor.png", Description = "Bóng ngoài trời được nhiều giải đấu Mỹ sử dụng, độ bền cao." },
        new Equipment { EquipmentCategoryId = 4, EquipmentName = "Bóng Pickleball Onix Pure 2 Indoor (hộp 6 quả)", Category = "Ball / Birdie", SportType = "Pickleball", RetailPrice = 240000.00m, StockQuantity = 10, ImageUrl = "/images/ball-onix-pure-2-indoor.png", Description = "Bóng trong nhà 26 lỗ, độ nảy đều, phù hợp sân indoor." },
        new Equipment { EquipmentCategoryId = 4, EquipmentName = "Bóng Pickleball Dura Fast 40 Outdoor (hộp 6 quả)", Category = "Ball / Birdie", SportType = "Pickleball", RetailPrice = 220000.00m, StockQuantity = 10, ImageUrl = "/images/ball-dura-fast-40.png", Description = "Bóng ngoài trời phổ biến tại giải phong trào, giá tốt, độ bền ổn." },
        new Equipment { EquipmentCategoryId = 4, EquipmentName = "Bóng Pickleball Gamma Photon Outdoor (hộp 6 quả)", Category = "Ball / Birdie", SportType = "Pickleball", RetailPrice = 250000.00m, StockQuantity = 10, ImageUrl = "/images/ball-gamma-photon-outdoor.png", Description = "Bóng ngoài trời thiết kế khí động học, bay ổn định trong gió nhẹ." },

};

    public static async Task SeedCourtsAsync(ProSportDbContext context)
    {
        if (await context.CourtTypes.AnyAsync())
        {
            return;
        }

        var badmintonType = new CourtType { Name = "Badminton", Description = "Sân cầu lông tiêu chuẩn" };
        var pickleballType = new CourtType { Name = "Pickleball", Description = "Sân Pickleball tiêu chuẩn" };
        var tennisType = new CourtType { Name = "Tennis", Description = "Sân Tennis tiêu chuẩn" };
        context.CourtTypes.AddRange(badmintonType, pickleballType, tennisType);
        await context.SaveChangesAsync();

        var courts = new List<Court>
        {
            new Court { Name = "Sân Cầu Lông A1", CourtTypeId = badmintonType.CourtTypeId, Status = "Available", Description = "Sân thảm PVC Yonex cao cấp", ImageUrl = "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600" },
            new Court { Name = "Sân Cầu Lông A2", CourtTypeId = badmintonType.CourtTypeId, Status = "Available", Description = "Sân thảm PVC Yonex cao cấp", ImageUrl = "https://images.unsplash.com/photo-1517649763962-0c62306601b7?w=600" },
            new Court { Name = "Sân Cầu Lông A3", CourtTypeId = badmintonType.CourtTypeId, Status = "Available", Description = "Sân thảm gỗ cao cấp", ImageUrl = "https://images.unsplash.com/photo-1521537634581-227f84850b41?w=600" },
            new Court { Name = "Sân Pickleball P1", CourtTypeId = pickleballType.CourtTypeId, Status = "Available", Description = "Sân ngoài trời tiêu chuẩn Mỹ", ImageUrl = "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600" },
            new Court { Name = "Sân Pickleball P2", CourtTypeId = pickleballType.CourtTypeId, Status = "Available", Description = "Sân ngoài trời tiêu chuẩn Mỹ", ImageUrl = "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=600" },
            new Court { Name = "Sân Cầu Lông A4", CourtTypeId = badmintonType.CourtTypeId, Status = "Available", Description = "Sân thảm PVC chống trượt", ImageUrl = "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600" },
            new Court { Name = "Sân Cầu Lông A5 VIP", CourtTypeId = badmintonType.CourtTypeId, Status = "Available", Description = "Sân VIP có điều hòa", ImageUrl = "https://images.unsplash.com/photo-1521537634581-227f84850b41?w=600" },
            new Court { Name = "Sân Pickleball P3", CourtTypeId = pickleballType.CourtTypeId, Status = "Available", Description = "Sân trong nhà chuẩn thi đấu", ImageUrl = "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600" },
            new Court { Name = "Sân Pickleball P4 VIP", CourtTypeId = pickleballType.CourtTypeId, Status = "Available", Description = "Sân có mái che cao cấp", ImageUrl = "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=600" },
            new Court { Name = "Sân Tennis T1", CourtTypeId = tennisType.CourtTypeId, Status = "Available", Description = "Sân cứng (Hard Court)", ImageUrl = "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=600" },
            new Court { Name = "Sân Tennis T2", CourtTypeId = tennisType.CourtTypeId, Status = "Available", Description = "Sân đất nện (Clay Court)", ImageUrl = "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600" }
        };
        context.Courts.AddRange(courts);
        await context.SaveChangesAsync();

        var badmintonPricing = new List<PricingRule>
        {
            new PricingRule { CourtTypeId = badmintonType.CourtTypeId, StartTime = new TimeSpan(5, 0, 0), EndTime = new TimeSpan(17, 0, 0), PricePerHour = 80000m, IsWeekend = false },
            new PricingRule { CourtTypeId = badmintonType.CourtTypeId, StartTime = new TimeSpan(17, 0, 0), EndTime = new TimeSpan(22, 0, 0), PricePerHour = 120000m, IsWeekend = false },
            new PricingRule { CourtTypeId = badmintonType.CourtTypeId, StartTime = new TimeSpan(5, 0, 0), EndTime = new TimeSpan(22, 0, 0), PricePerHour = 140000m, IsWeekend = true }
        };

        var pickleballPricing = new List<PricingRule>
        {
            new PricingRule { CourtTypeId = pickleballType.CourtTypeId, StartTime = new TimeSpan(5, 0, 0), EndTime = new TimeSpan(17, 0, 0), PricePerHour = 100000m, IsWeekend = false },
            new PricingRule { CourtTypeId = pickleballType.CourtTypeId, StartTime = new TimeSpan(17, 0, 0), EndTime = new TimeSpan(22, 0, 0), PricePerHour = 150000m, IsWeekend = false },
            new PricingRule { CourtTypeId = pickleballType.CourtTypeId, StartTime = new TimeSpan(5, 0, 0), EndTime = new TimeSpan(22, 0, 0), PricePerHour = 180000m, IsWeekend = true }
        };

        var tennisPricing = new List<PricingRule>
        {
            new PricingRule { CourtTypeId = tennisType.CourtTypeId, StartTime = new TimeSpan(5, 0, 0), EndTime = new TimeSpan(17, 0, 0), PricePerHour = 150000m, IsWeekend = false },
            new PricingRule { CourtTypeId = tennisType.CourtTypeId, StartTime = new TimeSpan(17, 0, 0), EndTime = new TimeSpan(22, 0, 0), PricePerHour = 220000m, IsWeekend = false },
            new PricingRule { CourtTypeId = tennisType.CourtTypeId, StartTime = new TimeSpan(5, 0, 0), EndTime = new TimeSpan(22, 0, 0), PricePerHour = 250000m, IsWeekend = true }
        };

        context.PricingRules.AddRange(badmintonPricing);
        context.PricingRules.AddRange(pickleballPricing);
        context.PricingRules.AddRange(tennisPricing);
        await context.SaveChangesAsync();
    }
}


