using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ProSport.Infrastructure.Data;

/// <summary>
/// DB được tạo trước đây bằng EnsureCreated (không có __EFMigrationsHistory).
/// MigrateAsync() sẽ fail vì migrations trùng cột / thiếu migration gốc.
/// Bootstrap: patch schema thiếu + baseline history, hoặc EnsureCreated cho DB trống.
/// </summary>
public static class DatabaseBootstrap
{
    private const string ProductVersion = "8.0.8";

    private static readonly string[] AllMigrationIds =
    [
        "20260616092257_AddPaymentDeadline",
        "20260617142007_AddPaymentDeadlineToBookings",
        "20260617165643_AddEquipmentInventory",
        "20260617173327_AddPaymentDeadline",
        "20260618032857_AddEscrowRowVersion",
        "20260618045048_AddCartAndEquipmentUpdates",
        "20260627033506_AddUserIsLocked",
    ];

    public static async Task ApplyAsync(ProSportDbContext context, ILogger logger, CancellationToken cancellationToken = default)
    {
        var applied = (await context.Database.GetAppliedMigrationsAsync(cancellationToken)).ToList();
        var pending = (await context.Database.GetPendingMigrationsAsync(cancellationToken)).ToList();

        if (applied.Count == 0)
        {
            var usersExist = await UsersTableExistsAsync(context, cancellationToken);

            if (usersExist)
            {
                logger.LogWarning(
                    "Phát hiện DB legacy (EnsureCreated): có bảng Users nhưng chưa có migration history. Patch schema + baseline.");
                await ApplyLegacySchemaPatchesAsync(context, cancellationToken);
                await BaselineMigrationsAsync(context, cancellationToken);
                return;
            }

            if (pending.Count > 0)
            {
                logger.LogInformation("DB trống: tạo schema bằng EnsureCreated rồi baseline migrations.");
                await context.Database.EnsureCreatedAsync(cancellationToken);
                await ApplyLegacySchemaPatchesAsync(context, cancellationToken);
                await BaselineMigrationsAsync(context, cancellationToken);
                return;
            }
        }

        if (pending.Count > 0)
        {
            logger.LogInformation("Applying {Count} pending migration(s)...", pending.Count);
            await context.Database.MigrateAsync(cancellationToken);
        }
    }

    private static async Task<bool> UsersTableExistsAsync(ProSportDbContext context, CancellationToken cancellationToken)
    {
        await context.Database.OpenConnectionAsync(cancellationToken);
        try
        {
            await using var command = context.Database.GetDbConnection().CreateCommand();
            command.CommandText = "SELECT CASE WHEN OBJECT_ID(N'dbo.Users', N'U') IS NOT NULL THEN 1 ELSE 0 END";
            var result = await command.ExecuteScalarAsync(cancellationToken);
            return Convert.ToInt32(result) == 1;
        }
        finally
        {
            await context.Database.CloseConnectionAsync();
        }
    }

    private static async Task ApplyLegacySchemaPatchesAsync(ProSportDbContext context, CancellationToken cancellationToken)
    {
        await context.Database.ExecuteSqlRawAsync(
            """
            IF COL_LENGTH('dbo.Users', 'IsLocked') IS NULL
                ALTER TABLE [dbo].[Users] ADD [IsLocked] bit NOT NULL
                    CONSTRAINT [DF_Users_IsLocked] DEFAULT (0);
            """,
            cancellationToken);
    }

    private static async Task BaselineMigrationsAsync(ProSportDbContext context, CancellationToken cancellationToken)
    {
        // EnsureCreated does NOT create __EFMigrationsHistory — create it first if missing
        await context.Database.ExecuteSqlRawAsync(
            """
            IF OBJECT_ID(N'[__EFMigrationsHistory]', N'U') IS NULL
                CREATE TABLE [__EFMigrationsHistory] (
                    [MigrationId]    nvarchar(150) NOT NULL,
                    [ProductVersion] nvarchar(32)  NOT NULL,
                    CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
                );
            """,
            cancellationToken);

        foreach (var migrationId in AllMigrationIds)
        {
            await context.Database.ExecuteSqlRawAsync(
                """
                IF NOT EXISTS (SELECT 1 FROM [__EFMigrationsHistory] WHERE [MigrationId] = {0})
                    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES ({0}, {1});
                """,
                migrationId,
                ProductVersion);
        }
    }
}
