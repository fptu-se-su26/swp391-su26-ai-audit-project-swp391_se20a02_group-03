using Microsoft.EntityFrameworkCore;
using ProSport.Domain.Entities;

namespace ProSport.Infrastructure.Data;

public class ProSportDbContext : DbContext
{
    public ProSportDbContext(DbContextOptions<ProSportDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<OtpCode> OtpCodes { get; set; } = null!;
    public DbSet<EkycProfile> EkycProfiles { get; set; } = null!;
    public DbSet<CourtType> CourtTypes { get; set; } = null!;
    public DbSet<Court> Courts { get; set; } = null!;
    public DbSet<PricingRule> PricingRules { get; set; } = null!;
    public DbSet<Booking> Bookings { get; set; } = null!;
    public DbSet<BookingDetail> BookingDetails { get; set; } = null!;
    public DbSet<Match> Matches { get; set; } = null!;
    public DbSet<MatchParticipant> MatchParticipants { get; set; } = null!;
    public DbSet<EscrowWallet> EscrowWallets { get; set; } = null!;
    public DbSet<Transaction> Transactions { get; set; } = null!;
    public DbSet<Equipment> Equipments { get; set; } = null!;
    public DbSet<EquipmentRental> EquipmentRentals { get; set; } = null!;

    public override int SaveChanges()
    {
        UpdateAuditFields();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateAuditFields();
        return base.SaveChangesAsync(cancellationToken);
    }

    private void UpdateAuditFields()
    {
        var entries = ChangeTracker.Entries<BaseEntity>();
        foreach (var entry in entries)
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAt = DateTime.UtcNow;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = DateTime.UtcNow;
            }
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // --- User ---
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.GoogleId).IsUnique().HasFilter("[GoogleId] IS NOT NULL");
            
            entity.Property(e => e.FullName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
            entity.Property(e => e.PasswordHash).HasMaxLength(500);
            entity.Property(e => e.PhoneNumber).HasMaxLength(15);
            entity.Property(e => e.Role).IsRequired().HasMaxLength(20);
            entity.Property(e => e.EKycStatus).IsRequired().HasMaxLength(20).HasDefaultValue("Unverified");
            entity.Property(e => e.AvatarUrl).HasMaxLength(500);
            entity.Property(e => e.IsPhoneVerified).HasDefaultValue(false);

            entity.HasOne(e => e.EkycProfile)
                  .WithOne(e => e.User)
                  .HasForeignKey<EkycProfile>(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // --- OtpCode ---
        modelBuilder.Entity<OtpCode>(entity =>
        {
            entity.HasKey(e => e.OtpId);
            entity.HasIndex(e => new { e.UserId, e.Type, e.IsUsed, e.ExpiryTime });

            entity.Property(e => e.Code).IsRequired().HasMaxLength(6);
            entity.Property(e => e.Type).IsRequired().HasMaxLength(20);
            entity.Property(e => e.IsUsed).HasDefaultValue(false);

            entity.HasOne(d => d.User)
                .WithMany(p => p.OtpCodes)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        // --- EkycProfile ---
        modelBuilder.Entity<EkycProfile>(entity =>
        {
            entity.HasKey(e => e.EkycProfileId);
            entity.Property(e => e.FullName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.IdentityNumber).IsRequired().HasMaxLength(20);
            entity.Property(e => e.Status).HasDefaultValue("Pending").HasMaxLength(20);
            entity.HasIndex(e => e.IdentityNumber).IsUnique();
        });

        // --- CourtType ---
        modelBuilder.Entity<CourtType>(entity =>
        {
            entity.HasKey(e => e.CourtTypeId);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(50);
        });

        // --- Court ---
        modelBuilder.Entity<Court>(entity =>
        {
            entity.HasKey(e => e.CourtId);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Status).HasDefaultValue("Available").HasMaxLength(20);

            entity.HasOne(e => e.CourtType)
                  .WithMany(c => c.Courts)
                  .HasForeignKey(e => e.CourtTypeId)
                  .OnDelete(DeleteBehavior.ClientSetNull);
        });

        // --- PricingRule ---
        modelBuilder.Entity<PricingRule>(entity =>
        {
            entity.HasKey(e => e.PricingRuleId);
            entity.Property(e => e.PricePerHour).HasColumnType("decimal(18,2)");
            entity.Property(e => e.IsWeekend).HasDefaultValue(false);

            entity.HasOne(e => e.Court)
                  .WithMany(c => c.PricingRules)
                  .HasForeignKey(e => e.CourtId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // --- Booking ---
        modelBuilder.Entity<Booking>(entity =>
        {
            entity.HasKey(e => e.BookingId);
            entity.Property(e => e.TotalAmount).HasColumnType("decimal(18,2)");
            entity.Property(e => e.Status).HasDefaultValue("Pending").HasMaxLength(20);
            entity.Property(e => e.PaymentMethod).HasMaxLength(50);
            entity.Property(e => e.PaymentStatus).HasDefaultValue("Pending").HasMaxLength(20);

            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.ClientSetNull);
        });

        // --- BookingDetail ---
        modelBuilder.Entity<BookingDetail>(entity =>
        {
            entity.HasKey(e => e.BookingDetailId);
            entity.Property(e => e.Price).HasColumnType("decimal(18,2)");

            entity.HasOne(e => e.Booking)
                  .WithMany(b => b.BookingDetails)
                  .HasForeignKey(e => e.BookingId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Court)
                  .WithMany(c => c.BookingDetails)
                  .HasForeignKey(e => e.CourtId)
                  .OnDelete(DeleteBehavior.ClientSetNull);
        });

        // --- Match ---
        modelBuilder.Entity<Match>(entity =>
        {
            entity.HasKey(e => e.MatchId);
            entity.Property(e => e.Status).HasDefaultValue("Open").HasMaxLength(20);
            entity.Property(e => e.EscrowAmount).HasColumnType("decimal(18,2)");
            entity.Property(e => e.LevelRequirement).HasMaxLength(50);

            entity.HasOne(e => e.Host)
                  .WithMany()
                  .HasForeignKey(e => e.HostId)
                  .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(e => e.Court)
                  .WithMany()
                  .HasForeignKey(e => e.CourtId)
                  .OnDelete(DeleteBehavior.ClientSetNull);
        });

        // --- MatchParticipant ---
        modelBuilder.Entity<MatchParticipant>(entity =>
        {
            entity.HasKey(e => e.MatchParticipantId);
            entity.Property(e => e.Role).HasDefaultValue("Joiner").HasMaxLength(20);
            entity.Property(e => e.Status).HasDefaultValue("Pending").HasMaxLength(20);

            entity.HasOne(e => e.Match)
                  .WithMany(m => m.Participants)
                  .HasForeignKey(e => e.MatchId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.ClientSetNull);
        });

        // --- EscrowWallet ---
        modelBuilder.Entity<EscrowWallet>(entity =>
        {
            entity.HasKey(e => e.EscrowWalletId);
            entity.Property(e => e.Balance).HasColumnType("decimal(18,2)").HasDefaultValue(0);
            entity.Property(e => e.LockedBalance).HasColumnType("decimal(18,2)").HasDefaultValue(0);

            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.ClientSetNull);
        });

        // --- Transaction ---
        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.HasKey(e => e.TransactionId);
            entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");
            entity.Property(e => e.Type).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Status).HasDefaultValue("Pending").HasMaxLength(20);
            entity.Property(e => e.ReferenceId).HasMaxLength(100);

            entity.HasOne(e => e.EscrowWallet)
                  .WithMany(w => w.Transactions)
                  .HasForeignKey(e => e.EscrowWalletId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Booking)
                  .WithMany(b => b.Transactions)
                  .HasForeignKey(e => e.BookingId)
                  .OnDelete(DeleteBehavior.ClientSetNull);
        });

        // --- Equipment ---
        modelBuilder.Entity<Equipment>(entity =>
        {
            entity.HasKey(e => e.EquipmentId);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Type).IsRequired().HasMaxLength(50);
            entity.Property(e => e.RentalPrice).HasColumnType("decimal(18,2)");
        });

        // --- EquipmentRental ---
        modelBuilder.Entity<EquipmentRental>(entity =>
        {
            entity.HasKey(e => e.EquipmentRentalId);
            entity.Property(e => e.TotalPrice).HasColumnType("decimal(18,2)");
            entity.Property(e => e.DamageFee).HasColumnType("decimal(18,2)");
            entity.Property(e => e.Status).HasDefaultValue("Rented").HasMaxLength(20);

            entity.HasOne(e => e.Equipment)
                  .WithMany(eq => eq.Rentals)
                  .HasForeignKey(e => e.EquipmentId)
                  .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(e => e.Booking)
                  .WithMany()
                  .HasForeignKey(e => e.BookingId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
