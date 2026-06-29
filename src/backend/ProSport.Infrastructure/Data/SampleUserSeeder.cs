using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using ProSport.Domain.Entities;

namespace ProSport.Infrastructure.Data;

public static class SampleUserSeeder
{
    private sealed record SampleUser(
        string Email,
        string FullName,
        string Role,
        string Phone,
        string EKycStatus,
        bool IsPhoneVerified,
        bool IsLocked);

    private static readonly SampleUser[] Accounts =
    [
        new("admin@prosport.vn", "System Admin", "Admin", "0900000001", "Verified", true, false),
        new("staff1@prosport.vn", "Nguyễn Văn Staff", "Staff", "0900000002", "Verified", true, false),
        new("staff2@prosport.vn", "Trần Thị Staff", "Staff", "0900000003", "Verified", true, false),
        new("customer1@prosport.vn", "Lê Văn Cường", "Customer", "0900000004", "Verified", true, false),
        new("customer2@prosport.vn", "Phạm Thị Dung", "Customer", "0900000005", "Verified", true, false),
        new("customer3@prosport.vn", "Hoàng Văn Em", "Customer", "0900000006", "Pending", true, false),
        new("customer4@prosport.vn", "Võ Thị Phượng", "Customer", "0900000007", "Verified", true, false),
        new("customer5@prosport.vn", "Đặng Văn Giang", "Customer", "0900000008", "Unverified", false, false),
        new("customer6@prosport.vn", "Bùi Thị Hoa", "Customer", "0900000009", "Verified", true, true),
        new("customer7@prosport.vn", "Đỗ Văn Inh", "Customer", "0900000010", "Verified", true, false),
    ];

    public static async Task SeedAsync(
        ProSportDbContext context,
        IConfiguration configuration,
        bool isDevelopment,
        ILogger logger,
        CancellationToken cancellationToken = default)
    {
        var adminPassword = configuration["AdminSeed:Password"]
            ?? Environment.GetEnvironmentVariable("ADMIN_SEED_PASSWORD");

        if (string.IsNullOrWhiteSpace(adminPassword) && isDevelopment)
            adminPassword = SampleAccountDefaults.Password;

        var created = 0;
        foreach (var sample in Accounts)
        {
            if (await context.Users.AnyAsync(u => u.Email == sample.Email, cancellationToken))
                continue;

            if (sample.Role == "Admin" && string.IsNullOrWhiteSpace(adminPassword))
            {
                logger.LogWarning("[Seeder] AdminSeed:Password not configured. Skipping admin creation.");
                continue;
            }

            var passwordHash = sample.Role == "Admin"
                ? BCrypt.Net.BCrypt.HashPassword(adminPassword!)
                : SampleAccountDefaults.PasswordHash;

            context.Users.Add(new User
            {
                FullName = sample.FullName,
                Email = sample.Email,
                PasswordHash = passwordHash,
                PhoneNumber = sample.Phone,
                Role = sample.Role,
                EKycStatus = sample.EKycStatus,
                IsPhoneVerified = sample.IsPhoneVerified,
                IsLocked = sample.IsLocked,
                IsDeleted = false,
                CreatedAt = DateTime.UtcNow
            });
            created++;
        }

        if (created > 0)
        {
            await context.SaveChangesAsync(cancellationToken);
            logger.LogInformation("[Seeder] Created {Count} sample user account(s). Password (non-admin): {Password}",
                created, SampleAccountDefaults.Password);
        }
        else
        {
            logger.LogInformation("[Seeder] Sample users already exist. Skipping.");
        }
    }
}
