using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ProSport.Domain.Constants;
using ProSport.Domain.Entities;

namespace ProSport.Infrastructure.Data;

/// <summary>
/// Seed idempotent dữ liệu Owner/Complex/Staff — không dùng InsertData trong migration
/// để tránh lỗi PK trùng khi nâng cấp DB đã có dữ liệu.
/// </summary>
public static class OwnerDemoSeeder
{
    private const string DefaultComplexName = "Pro-Sport Complex Quận 7";
    private const string OwnerEmail = "courtowner@prosport.vn";

    public static async Task SeedAsync(
        ProSportDbContext context,
        ILogger logger,
        CancellationToken cancellationToken = default)
    {
        if (!await context.Database.CanConnectAsync(cancellationToken))
            return;

        // Chỉ chạy sau khi bảng Complexes tồn tại (migration đã apply).
        if (!await TableExistsAsync(context, "Complexes", cancellationToken))
            return;

        var admin = await context.Users.AsNoTracking()
            .FirstOrDefaultAsync(u => u.Email == "admin@prosport.vn", cancellationToken);

        var owner = await context.Users
            .FirstOrDefaultAsync(u => u.Email == OwnerEmail, cancellationToken);
        if (owner == null)
        {
            owner = new User
            {
                FullName = "Chủ Sân Demo",
                Email = OwnerEmail,
                PasswordHash = SampleAccountDefaults.PasswordHash,
                PhoneNumber = "0900000012",
                Role = Roles.CourtOwner,
                EKycStatus = "Verified",
                IsPhoneVerified = true,
                IsLocked = false,
                IsDeleted = false,
                CreatedAt = DateTime.UtcNow
            };
            context.Users.Add(owner);
            await context.SaveChangesAsync(cancellationToken);
            logger.LogInformation("[OwnerDemoSeeder] Created demo court owner {Email}.", OwnerEmail);
        }

        var complex = await context.Complexes
            .FirstOrDefaultAsync(c => c.Name == DefaultComplexName && !c.IsDeleted, cancellationToken);
        if (complex == null)
        {
            complex = new Complex
            {
                Name = DefaultComplexName,
                Address = "123 Nguyễn Văn Linh, Quận 7, TP.HCM",
                Description = "Tổ hợp thể thao cầu lông và pickleball hiện đại nhất khu vực.",
                Phone = "0912345678",
                Email = "contact@prosport-q7.vn",
                OpeningTime = new TimeSpan(5, 0, 0),
                ClosingTime = new TimeSpan(23, 0, 0),
                Status = "Active",
                CreatedAt = DateTime.UtcNow,
                IsDeleted = false
            };
            context.Complexes.Add(complex);
            await context.SaveChangesAsync(cancellationToken);
            logger.LogInformation("[OwnerDemoSeeder] Created default complex.");
        }

        var hasOwnerLink = await context.ComplexOwners.AnyAsync(
            co => co.UserId == owner.UserId && co.ComplexId == complex.ComplexId && !co.IsDeleted,
            cancellationToken);
        if (!hasOwnerLink)
        {
            context.ComplexOwners.Add(new ComplexOwner
            {
                UserId = owner.UserId,
                ComplexId = complex.ComplexId,
                IsPrimary = true,
                Status = "Active",
                ApprovedByAdminId = admin?.UserId,
                CreatedAt = DateTime.UtcNow,
                IsDeleted = false
            });
            await context.SaveChangesAsync(cancellationToken);
            logger.LogInformation("[OwnerDemoSeeder] Linked court owner to complex.");
        }

        var courtsWithoutComplex = await context.Courts
            .Where(c => c.ComplexId == null && !c.IsDeleted)
            .ToListAsync(cancellationToken);
        if (courtsWithoutComplex.Count > 0)
        {
            foreach (var court in courtsWithoutComplex)
                court.ComplexId = complex.ComplexId;
            await context.SaveChangesAsync(cancellationToken);
            logger.LogInformation("[OwnerDemoSeeder] Assigned ComplexId to {Count} court(s).", courtsWithoutComplex.Count);
        }

        if (await TableExistsAsync(context, "StaffAssignments", cancellationToken))
            await SeedStaffAssignmentsAsync(context, owner, complex, cancellationToken);
    }

    private static async Task SeedStaffAssignmentsAsync(
        ProSportDbContext context,
        User owner,
        Complex complex,
        CancellationToken cancellationToken)
    {
        var staffSpecs = new[]
        {
            new { Email = "staff1@prosport.vn", CanApplySurcharge = false },
            new { Email = "staff2@prosport.vn", CanApplySurcharge = true }
        };

        foreach (var spec in staffSpecs)
        {
            var staff = await context.Users.AsNoTracking()
                .FirstOrDefaultAsync(u => u.Email == spec.Email, cancellationToken);
            if (staff == null)
                continue;

            var exists = await context.StaffAssignments.AnyAsync(
                sa => sa.StaffUserId == staff.UserId && sa.ComplexId == complex.ComplexId && !sa.IsDeleted,
                cancellationToken);
            if (exists)
                continue;

            context.StaffAssignments.Add(new StaffAssignment
            {
                StaffUserId = staff.UserId,
                ComplexId = complex.ComplexId,
                Status = "Active",
                CanCheckIn = true,
                CanCreateWalkIn = true,
                CanManageRental = true,
                CanApplySurcharge = spec.CanApplySurcharge,
                AssignedByUserId = owner.UserId,
                CreatedAt = DateTime.UtcNow,
                IsDeleted = false
            });
        }

        await context.SaveChangesAsync(cancellationToken);
    }

    private static async Task<bool> TableExistsAsync(
        ProSportDbContext context,
        string tableName,
        CancellationToken cancellationToken)
    {
        await context.Database.OpenConnectionAsync(cancellationToken);
        try
        {
            await using var command = context.Database.GetDbConnection().CreateCommand();
            command.CommandText = $"SELECT CASE WHEN OBJECT_ID(N'dbo.{tableName}', N'U') IS NOT NULL THEN 1 ELSE 0 END";
            var result = await command.ExecuteScalarAsync(cancellationToken);
            return Convert.ToInt32(result) == 1;
        }
        finally
        {
            await context.Database.CloseConnectionAsync();
        }
    }
}
