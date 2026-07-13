using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Logging;

namespace ProSport.Infrastructure.Data;

/// <summary>
/// Khởi tạo DB an toàn cho cả 3 trạng thái:
/// 1. DB chưa tồn tại  -> MigrateAsync tạo mới toàn bộ.
/// 2. DB rỗng (đã tạo nhưng chưa có bảng) -> MigrateAsync tạo schema.
/// 3. DB legacy (schema tạo bằng EnsureCreated hoặc bộ migration cũ đã bị gộp thành InitialCreate,
///    nên __EFMigrationsHistory không có 'InitialCreate') -> baseline InitialCreate rồi áp migration mới.
///
/// KHÔNG dùng danh sách migration id viết tay hay SQL vá schema thủ công:
/// mọi thay đổi schema sau này chỉ cần thêm migration mới, MigrateAsync tự áp dụng.
/// </summary>
public static class DatabaseBootstrap
{
    private const string InitialCreateMigrationId = "20260712152036_InitialCreate";

    public static async Task ApplyAsync(ProSportDbContext context, ILogger logger, CancellationToken cancellationToken = default)
    {
        var creator = context.GetService<IRelationalDatabaseCreator>();
        if (!await creator.ExistsAsync(cancellationToken))
        {
            logger.LogInformation("Database chưa tồn tại: tạo mới toàn bộ schema bằng migrations.");
            await context.Database.MigrateAsync(cancellationToken);
            return;
        }

        var applied = (await context.Database.GetAppliedMigrationsAsync(cancellationToken)).ToHashSet();
        if (!applied.Contains(InitialCreateMigrationId))
        {
            var actualTables = await GetActualTablesAsync(context, cancellationToken);

            // Có bảng Users nghĩa là DB đã mang schema (legacy) chứ không phải DB rỗng.
            if (actualTables.Contains("Users"))
            {
                var missing = GetExpectedTables(context).Where(t => !actualTables.Contains(t)).ToList();
                if (missing.Count > 0)
                {
                    throw new InvalidOperationException(
                        $"Database hiện có schema cũ KHÔNG đầy đủ (thiếu {missing.Count} bảng: " +
                        $"{string.Join(", ", missing.Take(10))}{(missing.Count > 10 ? ", ..." : "")}). " +
                        "Không thể baseline an toàn. Hãy xóa & tạo lại database (môi trường dev) " +
                        "hoặc khôi phục bản backup đầy đủ trước khi chạy lại.");
                }

                logger.LogWarning(
                    "Phát hiện DB legacy đã đầy đủ schema nhưng chưa baseline. Ghi '{Migration}' vào lịch sử migration.",
                    InitialCreateMigrationId);
                await BaselineAsync(context, InitialCreateMigrationId, cancellationToken);
            }
            // else: DB rỗng -> để MigrateAsync bên dưới tạo toàn bộ schema.
        }

        var pending = (await context.Database.GetPendingMigrationsAsync(cancellationToken)).ToList();
        if (pending.Count > 0)
        {
            logger.LogInformation("Áp dụng {Count} migration đang chờ...", pending.Count);
            await context.Database.MigrateAsync(cancellationToken);
        }
    }

    private static async Task<HashSet<string>> GetActualTablesAsync(ProSportDbContext context, CancellationToken cancellationToken)
    {
        var names = await context.Database
            .SqlQueryRaw<string>("SELECT TABLE_NAME AS Value FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'")
            .ToListAsync(cancellationToken);
        return names.ToHashSet(StringComparer.OrdinalIgnoreCase);
    }

    private static HashSet<string> GetExpectedTables(ProSportDbContext context)
    {
        return context.Model.GetEntityTypes()
            .Select(e => e.GetTableName())
            .Where(t => !string.IsNullOrEmpty(t))
            .Select(t => t!)
            .ToHashSet(StringComparer.OrdinalIgnoreCase);
    }

    // Ghi InitialCreate vào __EFMigrationsHistory bằng chính script EF sinh ra
    // (không hard-code DDL / ProductVersion), để không lệch với định dạng MigrateAsync mong đợi.
    private static async Task BaselineAsync(ProSportDbContext context, string migrationId, CancellationToken cancellationToken)
    {
        var history = context.GetService<IHistoryRepository>();
        await context.Database.ExecuteSqlRawAsync(history.GetCreateIfNotExistsScript(), cancellationToken);

        var insertScript = history.GetInsertScript(new HistoryRow(migrationId, ProductInfo.GetVersion()));
        await context.Database.ExecuteSqlRawAsync(insertScript, cancellationToken);
    }
}
