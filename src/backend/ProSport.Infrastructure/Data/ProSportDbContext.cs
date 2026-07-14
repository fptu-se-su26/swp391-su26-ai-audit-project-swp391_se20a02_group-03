using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using ProSport.Domain.Constants;
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
    public DbSet<EquipmentCategory> EquipmentCategories { get; set; } = null!;
    public DbSet<Equipment> Equipments { get; set; } = null!;
    public DbSet<InventoryTransaction> InventoryTransactions { get; set; } = null!;
    // --- Bảng mới ---
    public DbSet<Complex> Complexes { get; set; } = null!;
    public DbSet<ComplexOwner> ComplexOwners { get; set; } = null!;
    public DbSet<StaffAssignment> StaffAssignments { get; set; } = null!;
    public DbSet<AuditLog> AuditLogs { get; set; } = null!;
    public DbSet<ComplexOperatingSchedule> ComplexOperatingSchedules { get; set; } = null!;
    public DbSet<ComplexClosure> ComplexClosures { get; set; } = null!;
    public DbSet<ComplexMaintenanceWindow> ComplexMaintenanceWindows { get; set; } = null!;
    public DbSet<CheckIn> CheckIns { get; set; } = null!;
    public DbSet<Voucher> Vouchers { get; set; } = null!;
    public DbSet<PlayerRating> PlayerRatings { get; set; } = null!;
    public DbSet<Report> Reports { get; set; } = null!;
    public DbSet<ChatHistory> ChatHistories { get; set; } = null!;
    public DbSet<CartItem> CartItems { get; set; } = null!;
    public DbSet<ProductStock> ProductStocks { get; set; } = null!;
    public DbSet<ComplexReview> ComplexReviews { get; set; } = null!;
    public DbSet<BookingPaymentShare> BookingPaymentShares { get; set; } = null!;
    public DbSet<RecurringBookingRule> RecurringBookingRules { get; set; } = null!;
    public DbSet<ComplexCancellationPolicy> ComplexCancellationPolicies { get; set; } = null!;
    public DbSet<UserSkillRating> UserSkillRatings { get; set; } = null!;
    public DbSet<MatchResult> MatchResults { get; set; } = null!;
    public DbSet<Membership> Memberships { get; set; } = null!;
    public DbSet<Tournament> Tournaments { get; set; } = null!;
    public DbSet<TournamentRegistration> TournamentRegistrations { get; set; } = null!;

    public override int SaveChanges()
    {
        UpdateAuditFields();
        ApplySoftDelete();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateAuditFields();
        ApplySoftDelete();
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

    // TK-015: Mọi lệnh Delete trên entity kế thừa BaseEntity sẽ được tự động chuyển
    // thành cập nhật cờ IsDeleted = true (Soft Delete), thay vì xóa cứng khỏi DB.
    // Ngoại lệ: entity có IsDeleted bị Ignore (vd OtpCode) vẫn xóa cứng bình thường.
    private void ApplySoftDelete()
    {
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            if (entry.State != EntityState.Deleted)
                continue;

            // Nếu IsDeleted không được map (bị Ignore) thì cho phép hard delete.
            if (entry.Metadata.FindProperty(nameof(BaseEntity.IsDeleted)) is null)
                continue;

            entry.State = EntityState.Modified;
            entry.Entity.IsDeleted = true;
            entry.Entity.UpdatedAt = DateTime.UtcNow;
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ========================
        // === EXISTING ENTITIES ===
        // ========================

        // --- User ---
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("Users");
            entity.HasKey(e => e.UserId);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.GoogleId).IsUnique().HasFilter("[GoogleId] IS NOT NULL");
            // Chống trùng số điện thoại ở tầng DB. Filter kèm [IsDeleted] = 0 để đồng nhất với
            // GetByPhoneAsync (bỏ qua user đã xóa mềm) và các unique index khác trong file này.
            entity.HasIndex(e => e.PhoneNumber).IsUnique().HasFilter("[PhoneNumber] IS NOT NULL AND [IsDeleted] = 0");

            entity.Property(e => e.FullName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255).HasColumnType("varchar(255)");
            entity.Property(e => e.PasswordHash).HasMaxLength(500).HasColumnType("varchar(500)");
            entity.Property(e => e.PhoneNumber).HasMaxLength(15).HasColumnType("varchar(15)");
            entity.Property(e => e.Role).IsRequired().HasMaxLength(20).HasColumnType("varchar(20)");
            entity.Property(e => e.EKycStatus).IsRequired().HasMaxLength(20).HasColumnType("varchar(20)").HasDefaultValue("Unverified");
            entity.Property(e => e.AvatarUrl).HasMaxLength(500).HasColumnType("varchar(500)");
            entity.Property(e => e.GoogleId).HasMaxLength(100).HasColumnType("varchar(100)");
            entity.Property(e => e.IsPhoneVerified).HasDefaultValue(false);
            entity.Property(e => e.IsLocked).HasColumnName("IsLocked").HasDefaultValue(false);
            entity.Property(e => e.IsDeleted).HasColumnName("IsDeleted").HasDefaultValue(false);
            entity.Property(e => e.CreatedAt).HasColumnName("CreatedAt").HasDefaultValueSql("SYSDATETIME()");
            entity.Property(e => e.UpdatedAt).HasColumnName("UpdatedAt");

            entity.HasOne(e => e.EkycProfile)
                  .WithOne(e => e.User)
                  .HasForeignKey<EkycProfile>(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.EscrowWallet)
                  .WithOne(e => e.User)
                  .HasForeignKey<EscrowWallet>(e => e.UserId)
                  .OnDelete(DeleteBehavior.ClientSetNull);
        });

        // --- OtpCode ---
        modelBuilder.Entity<OtpCode>(entity =>
        {
            entity.ToTable("OtpCodes");
            entity.HasKey(e => e.OtpId);
            entity.HasIndex(e => new { e.UserId, e.Type, e.IsUsed, e.ExpiryTime });

            entity.Property(e => e.Code).IsRequired().HasMaxLength(6).HasColumnType("varchar(6)");
            entity.Property(e => e.Type).IsRequired().HasMaxLength(20).HasColumnType("varchar(20)");
            entity.Property(e => e.IsUsed).HasDefaultValue(false);
            entity.Property(e => e.CreatedAt).HasColumnName("CreatedAt").HasDefaultValueSql("SYSDATETIME()");
            entity.Ignore(e => e.IsDeleted);
            entity.Ignore(e => e.UpdatedAt);

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
            entity.Property(e => e.Code).HasMaxLength(20);
            entity.HasIndex(e => new { e.ComplexId, e.Code }).IsUnique().HasFilter("[Code] IS NOT NULL AND [IsDeleted] = 0");
            entity.HasIndex(e => new { e.ComplexId, e.IsDeleted });
            entity.Property(e => e.Status).HasDefaultValue("Available").HasMaxLength(20);

            entity.HasOne(e => e.CourtType)
                  .WithMany(c => c.Courts)
                  .HasForeignKey(e => e.CourtTypeId)
                  .OnDelete(DeleteBehavior.ClientSetNull);
        });

        // --- PricingRule (FIX: thêm CourtTypeId, DayOfWeek) ---
        modelBuilder.Entity<PricingRule>(entity =>
        {
            entity.HasKey(e => e.PricingRuleId);
            entity.Property(e => e.PricePerHour).HasColumnType("decimal(18,2)");
            entity.Property(e => e.Multiplier).HasColumnType("decimal(8,4)");
            entity.Property(e => e.RuleType).HasMaxLength(30).HasDefaultValue("BasePrice");
            entity.Property(e => e.Status).HasMaxLength(20).HasDefaultValue("Active");
            entity.Property(e => e.IsWeekend).HasDefaultValue(false);

            entity.HasOne(e => e.Court)
                  .WithMany(c => c.PricingRules)
                  .HasForeignKey(e => e.CourtId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.CourtType)
                  .WithMany()
                  .HasForeignKey(e => e.CourtTypeId)
                  .OnDelete(DeleteBehavior.ClientSetNull);
        });

        // --- Booking (FIX: thêm CheckInCode, CancellationFee) ---
        modelBuilder.Entity<Booking>(entity =>
        {
            entity.ToTable(t =>
            {
                t.HasCheckConstraint("CK_Bookings_Status",
                    $"[Status] IN ('{BookingStatus.Pending}','{BookingStatus.PendingPayment}','{BookingStatus.Confirmed}','{BookingStatus.CheckedIn}','{BookingStatus.Cancelled}','{BookingStatus.Completed}','{BookingStatus.Expired}','{BookingStatus.NoShow}')");
                t.HasCheckConstraint("CK_Bookings_PaymentStatus",
                    $"[PaymentStatus] IS NULL OR [PaymentStatus] IN ('{PaymentStatus.Pending}','{PaymentStatus.Paid}','{PaymentStatus.Refunded}','{PaymentStatus.Cancelled}')");
                t.HasCheckConstraint("CK_Bookings_PaymentMethod",
                    $"[PaymentMethod] IS NULL OR [PaymentMethod] IN ('{PaymentMethod.VNPay}','{PaymentMethod.Escrow}','{PaymentMethod.Cash}')");
            });
            entity.HasKey(e => e.BookingId);
            entity.Property(e => e.TotalAmount).HasColumnType("decimal(18,2)");
            entity.Property(e => e.Status).HasDefaultValue("Pending").HasMaxLength(20);
            entity.Property(e => e.PaymentMethod).HasMaxLength(50);
            entity.Property(e => e.PaymentStatus).HasDefaultValue("Pending").HasMaxLength(20);
            entity.Property(e => e.CheckInCode).HasMaxLength(50);
            entity.HasIndex(e => e.CheckInCode).IsUnique().HasFilter("[CheckInCode] IS NOT NULL");
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => new { e.Status, e.IsDeleted });
            entity.HasIndex(e => e.CreatedAt);
            entity.Property(e => e.CancellationFee).HasColumnType("decimal(18,2)").HasDefaultValue(0m);
            entity.Property(e => e.PaymentDeadline);

            entity.HasOne(e => e.User)
                  .WithMany(u => u.Bookings)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(e => e.RecurringRule)
                  .WithMany()
                  .HasForeignKey(e => e.RecurringRuleId)
                  .OnDelete(DeleteBehavior.SetNull);
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

            entity.HasIndex(e => new { e.CourtId, e.BookingDate });
        });

        // --- Match (FIX: thêm BookingId) ---
        modelBuilder.Entity<Match>(entity =>
        {
            entity.ToTable(t =>
            {
                t.HasCheckConstraint("CK_Matches_Status",
                    $"[Status] IN ('{MatchStatus.Open}','{MatchStatus.Closed}','{MatchStatus.Completed}','{MatchStatus.Cancelled}')");
            });
            entity.HasKey(e => e.MatchId);
            entity.HasIndex(e => e.Status);
            entity.Property(e => e.Status).HasDefaultValue("Open").HasMaxLength(20);
            entity.Property(e => e.EscrowAmount).HasColumnType("decimal(18,2)");
            entity.Property(e => e.LevelRequirement).HasMaxLength(50);

            entity.HasOne(e => e.Host)
                  .WithMany(u => u.HostedMatches)
                  .HasForeignKey(e => e.HostId)
                  .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(e => e.Court)
                  .WithMany()
                  .HasForeignKey(e => e.CourtId)
                  .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(e => e.Booking)
                  .WithMany()
                  .HasForeignKey(e => e.BookingId)
                  .OnDelete(DeleteBehavior.ClientSetNull);
        });

        // --- MatchParticipant (FIX: thêm Unique (MatchId, UserId)) ---
        modelBuilder.Entity<MatchParticipant>(entity =>
        {
            entity.ToTable("MatchMembers");
            entity.HasKey(e => e.MatchParticipantId);
            entity.Property(e => e.Role).HasDefaultValue("Joiner").HasMaxLength(20);
            entity.Property(e => e.Status).HasDefaultValue("Pending").HasMaxLength(20);

            // FIX: Chống join trùng — 1 user chỉ tham gia 1 kèo 1 lần
            entity.HasIndex(e => new { e.MatchId, e.UserId }).IsUnique();

            entity.HasOne(e => e.Match)
                  .WithMany(m => m.Participants)
                  .HasForeignKey(e => e.MatchId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.ClientSetNull);
        });

        // --- EscrowWallet (FIX: Unique UserId — 1 user = 1 ví) ---
        modelBuilder.Entity<EscrowWallet>(entity =>
        {
            entity.ToTable("EscrowWallets");
            entity.HasKey(e => e.EscrowWalletId);
            entity.Property(e => e.Balance).HasColumnType("decimal(18,2)").HasDefaultValue(0m);
            entity.Property(e => e.LockedBalance).HasColumnType("decimal(18,2)").HasDefaultValue(0m);
            entity.Property(e => e.RowVersion).IsRowVersion();

            // FIX: Unique — mỗi user chỉ có đúng 1 ví
            entity.HasIndex(e => e.UserId).IsUnique();
        });

        // --- Transaction (FIX: thêm MatchId) ---
        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.HasKey(e => e.TransactionId);
            entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");
            entity.Property(e => e.Type).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Status).HasDefaultValue("Pending").HasMaxLength(20);
            entity.Property(e => e.ReferenceId).HasMaxLength(100);
            entity.HasIndex(e => e.ReferenceId)
                .IsUnique()
                .HasFilter("[ReferenceId] IS NOT NULL");

            entity.HasOne(e => e.EscrowWallet)
                  .WithMany(w => w.Transactions)
                  .HasForeignKey(e => e.EscrowWalletId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Booking)
                  .WithMany(b => b.Transactions)
                  .HasForeignKey(e => e.BookingId);
            entity.HasOne(e => e.Match)
                  .WithMany()
                  .HasForeignKey(e => e.MatchId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // --- EquipmentCategory ---
        modelBuilder.Entity<EquipmentCategory>(entity =>
        {
            entity.HasKey(e => e.EquipmentCategoryId);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(500);
        });

        // --- Equipment (Merged) ---
        modelBuilder.Entity<Equipment>(entity =>
        {
            entity.ToTable("Equipments");
            entity.HasKey(e => e.EquipmentId);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.Status).HasDefaultValue("Available").HasMaxLength(20);
            entity.Property(e => e.EquipmentName).HasMaxLength(100);
            entity.Property(e => e.Category).HasMaxLength(30).HasDefaultValue("Racket");
            entity.Property(e => e.SportType).HasMaxLength(20);
            entity.Property(e => e.RetailPrice).HasColumnType("decimal(18,2)");
            entity.Property(e => e.ImageUrl).HasMaxLength(500);

            entity.HasOne(e => e.EquipmentCategory)
                  .WithMany(c => c.Equipments)
                  .HasForeignKey(e => e.EquipmentCategoryId)
                  .OnDelete(DeleteBehavior.ClientSetNull);
        });

        // --- InventoryTransaction ---
        modelBuilder.Entity<InventoryTransaction>(entity =>
        {
            entity.HasKey(e => e.InventoryTransactionId);
            entity.Property(e => e.TransactionType).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Notes).HasMaxLength(500);

            entity.HasOne(e => e.Equipment)
                  .WithMany(eq => eq.InventoryTransactions)
                  .HasForeignKey(e => e.EquipmentId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.ClientSetNull);
        });


        // ====================
        // === NEW ENTITIES ===
        // ====================

        // --- Complex ---
        modelBuilder.Entity<Complex>(entity =>
        {
            entity.HasKey(e => e.ComplexId);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Address).HasMaxLength(255);
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.Phone).HasMaxLength(20);
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.LogoUrl).HasMaxLength(500);
            entity.Property(e => e.OpeningTime).HasColumnType("time");
            entity.Property(e => e.ClosingTime).HasColumnType("time");
            entity.Property(e => e.Status).HasDefaultValue("Active").HasMaxLength(20);
            entity.Property(e => e.SlotDurationMinutes).HasDefaultValue(60);
        });

        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.HasKey(e => e.AuditLogId);
            entity.Property(e => e.Action).IsRequired().HasMaxLength(50);
            entity.Property(e => e.EntityType).IsRequired().HasMaxLength(50);
            entity.Property(e => e.EntityId).IsRequired().HasMaxLength(50);
            entity.HasIndex(e => e.ComplexId);
            entity.HasIndex(e => e.CreatedAt);
        });

        modelBuilder.Entity<ComplexOperatingSchedule>(entity =>
        {
            entity.HasKey(e => e.ComplexOperatingScheduleId);
            entity.HasIndex(e => new { e.ComplexId, e.DayOfWeek }).IsUnique();
            entity.HasOne(e => e.Complex).WithMany().HasForeignKey(e => e.ComplexId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ComplexClosure>(entity =>
        {
            entity.HasKey(e => e.ComplexClosureId);
            entity.HasIndex(e => new { e.ComplexId, e.ClosureDate }).IsUnique();
            entity.HasOne(e => e.Complex).WithMany().HasForeignKey(e => e.ComplexId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ComplexMaintenanceWindow>(entity =>
        {
            entity.HasKey(e => e.ComplexMaintenanceWindowId);
            entity.HasOne(e => e.Complex).WithMany().HasForeignKey(e => e.ComplexId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Court).WithMany().HasForeignKey(e => e.CourtId).OnDelete(DeleteBehavior.ClientSetNull);
        });

        // --- ComplexOwner ---
        modelBuilder.Entity<ComplexOwner>(entity =>
        {
            entity.HasKey(e => e.ComplexOwnerId);
            entity.Property(e => e.Status).HasDefaultValue("Active").HasMaxLength(20);
            
            // UNIQUE constraint: một user chỉ làm owner của một tổ hợp một lần
            entity.HasIndex(e => new { e.UserId, e.ComplexId }).IsUnique();

            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(e => e.Complex)
                  .WithMany(c => c.ComplexOwners)
                  .HasForeignKey(e => e.ComplexId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.ApprovedByAdmin)
                  .WithMany()
                  .HasForeignKey(e => e.ApprovedByAdminId)
                  .OnDelete(DeleteBehavior.ClientSetNull);
        });

        // --- Court (thêm relation tới Complex) ---
        modelBuilder.Entity<Court>()
            .HasOne(e => e.Complex)
            .WithMany(c => c.Courts)
            .HasForeignKey(e => e.ComplexId)
            .OnDelete(DeleteBehavior.ClientSetNull);

        // --- StaffAssignment ---
        modelBuilder.Entity<StaffAssignment>(entity =>
        {
            entity.HasKey(e => e.StaffAssignmentId);
            entity.Property(e => e.Status).HasDefaultValue("Active").HasMaxLength(20);
            entity.HasIndex(e => new { e.StaffUserId, e.ComplexId }).IsUnique();

            entity.HasOne(e => e.StaffUser)
                  .WithMany()
                  .HasForeignKey(e => e.StaffUserId)
                  .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(e => e.Complex)
                  .WithMany()
                  .HasForeignKey(e => e.ComplexId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.AssignedByUser)
                  .WithMany()
                  .HasForeignKey(e => e.AssignedByUserId)
                  .OnDelete(DeleteBehavior.ClientSetNull);
        });

        // --- CheckIn (UC-S01, UC-S02) ---
        modelBuilder.Entity<CheckIn>(entity =>
        {
            entity.HasKey(e => e.CheckInId);
            entity.HasIndex(e => e.BookingId).IsUnique(); // 1 booking = 1 check-in

            entity.HasOne(e => e.Booking)
                  .WithOne(b => b.CheckIn)
                  .HasForeignKey<CheckIn>(e => e.BookingId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Staff)
                  .WithMany()
                  .HasForeignKey(e => e.StaffId)
                  .OnDelete(DeleteBehavior.ClientSetNull);
        });

        // --- Voucher (UC-S06) ---
        modelBuilder.Entity<Voucher>(entity =>
        {
            entity.ToTable(t =>
            {
                t.HasCheckConstraint("CK_Vouchers_Status",
                    $"[Status] IN ('{VoucherStatus.Active}','{VoucherStatus.Inactive}','{VoucherStatus.Expired}')");
            });
            entity.HasKey(e => e.VoucherId);
            entity.Property(e => e.Code).IsRequired().HasMaxLength(20);
            entity.HasIndex(e => e.Code).IsUnique();
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.DiscountPercent).HasColumnType("decimal(5,2)");
            entity.Property(e => e.MaxDiscountAmount).HasColumnType("decimal(18,2)");
            entity.Property(e => e.MinOrderAmount).HasColumnType("decimal(18,2)");
            entity.Property(e => e.Status).HasDefaultValue(VoucherStatus.Active).HasMaxLength(20);

            entity.HasOne(e => e.CreatedByStaff)
                  .WithMany()
                  .HasForeignKey(e => e.CreatedByStaffId)
                  .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(e => e.ApplicableComplex)
                  .WithMany()
                  .HasForeignKey(e => e.ApplicableComplexId)
                  .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(e => e.ApplicableProduct)
                  .WithMany()
                  .HasForeignKey(e => e.ApplicableProductId)
                  .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<ProductStock>(entity =>
        {
            entity.HasKey(e => e.ProductStockId);
            entity.HasIndex(e => new { e.ComplexId, e.Sku }).IsUnique().HasFilter("[IsDeleted] = 0");
            entity.Property(e => e.SellingPrice).HasColumnType("decimal(18,2)");
            entity.HasOne(e => e.Complex).WithMany().HasForeignKey(e => e.ComplexId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ComplexReview>(entity =>
        {
            entity.HasKey(e => e.ComplexReviewId);
            entity.HasIndex(e => new { e.ComplexId, e.UserId }).IsUnique().HasFilter("[IsDeleted] = 0");
            entity.HasOne(e => e.Complex).WithMany().HasForeignKey(e => e.ComplexId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.ClientSetNull);
        });

        // --- PlayerRating (UC-C13) ---
        modelBuilder.Entity<PlayerRating>(entity =>
        {
            entity.HasKey(e => e.PlayerRatingId);
            // 1 user chỉ đánh giá 1 user khác trong cùng 1 kèo 1 lần
            entity.HasIndex(e => new { e.RaterId, e.RatedUserId, e.MatchId }).IsUnique();

            entity.HasOne(e => e.Rater)
                  .WithMany()
                  .HasForeignKey(e => e.RaterId)
                  .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(e => e.RatedUser)
                  .WithMany()
                  .HasForeignKey(e => e.RatedUserId)
                  .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(e => e.Match)
                  .WithMany()
                  .HasForeignKey(e => e.MatchId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // --- Report (UC-C14, UC-A07) ---
        modelBuilder.Entity<Report>(entity =>
        {
            entity.HasKey(e => e.ReportId);
            entity.Property(e => e.Reason).IsRequired().HasMaxLength(500);
            entity.Property(e => e.Status).HasDefaultValue("Pending").HasMaxLength(20);
            entity.Property(e => e.Evidence).HasMaxLength(1000);
            entity.Property(e => e.AdminNote).HasMaxLength(1000);

            entity.HasOne(e => e.Reporter)
                  .WithMany()
                  .HasForeignKey(e => e.ReporterId)
                  .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(e => e.ReportedUser)
                  .WithMany()
                  .HasForeignKey(e => e.ReportedUserId)
                  .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(e => e.Match)
                  .WithMany()
                  .HasForeignKey(e => e.MatchId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.ResolvedByAdmin)
                  .WithMany()
                  .HasForeignKey(e => e.ResolvedByAdminId)
                  .OnDelete(DeleteBehavior.ClientSetNull);
        });

        // --- ChatHistory (UC-C15) ---
        modelBuilder.Entity<ChatHistory>(entity =>
        {
            entity.HasKey(e => e.ChatHistoryId);
            entity.Property(e => e.Question).IsRequired();
            entity.Property(e => e.Answer).IsRequired();

            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // --- CartItem ---
        modelBuilder.Entity<CartItem>(entity =>
        {
            entity.ToTable("CartItems");
            entity.HasKey(ci => ci.CartItemId);

            entity.HasOne(ci => ci.Equipment)
                  .WithMany()
                  .HasForeignKey(ci => ci.EquipmentId);

            entity.HasOne(ci => ci.User)
                  .WithMany()
                  .HasForeignKey(ci => ci.UserId);
        });

        modelBuilder.Entity<BookingPaymentShare>(entity =>
        {
            entity.HasKey(e => e.BookingPaymentShareId);
            entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");
            entity.Property(e => e.Status).HasMaxLength(20);
            entity.HasIndex(e => new { e.BookingId, e.UserId }).IsUnique();
            entity.HasOne(e => e.Booking).WithMany(b => b.PaymentShares).HasForeignKey(e => e.BookingId);
            entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId);
        });

        modelBuilder.Entity<RecurringBookingRule>(entity =>
        {
            entity.HasKey(e => e.RecurringBookingRuleId);
            entity.Property(e => e.Frequency).HasMaxLength(20);
            entity.Property(e => e.Status).HasMaxLength(20);
            entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId);
            entity.HasOne(e => e.Court).WithMany().HasForeignKey(e => e.CourtId);
        });

        modelBuilder.Entity<ComplexCancellationPolicy>(entity =>
        {
            entity.HasKey(e => e.ComplexCancellationPolicyId);
            entity.HasIndex(e => e.ComplexId).IsUnique();
            entity.Property(e => e.PartialRefundPercent).HasColumnType("decimal(5,2)");
            entity.Property(e => e.PenaltyPercentAfterPartial).HasColumnType("decimal(5,2)");
            entity.HasOne(e => e.Complex).WithMany().HasForeignKey(e => e.ComplexId);
        });

        modelBuilder.Entity<UserSkillRating>(entity =>
        {
            entity.HasKey(e => e.UserSkillRatingId);
            entity.HasIndex(e => new { e.UserId, e.SportType }).IsUnique();
            entity.Property(e => e.SportType).HasMaxLength(50);
            entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId);
        });

        modelBuilder.Entity<MatchResult>(entity =>
        {
            entity.HasKey(e => e.MatchResultId);
            entity.HasIndex(e => e.MatchId).IsUnique();
            entity.Property(e => e.Status).HasMaxLength(20);
            entity.Property(e => e.DisputeReason).HasMaxLength(500);
            entity.HasOne(e => e.Match).WithMany().HasForeignKey(e => e.MatchId);
            entity.HasOne(e => e.Winner).WithMany().HasForeignKey(e => e.WinnerUserId);
            entity.HasOne(e => e.ReportedBy).WithMany().HasForeignKey(e => e.ReportedByUserId);
            entity.HasOne(e => e.ConfirmedBy).WithMany().HasForeignKey(e => e.ConfirmedByUserId).OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<Membership>(entity =>
        {
            entity.HasKey(e => e.MembershipId);
            entity.Property(e => e.Tier).HasMaxLength(50);
            entity.Property(e => e.DiscountPercent).HasColumnType("decimal(5,2)");
            entity.Property(e => e.Status).HasMaxLength(20);
            entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId);
            entity.HasOne(e => e.Complex).WithMany().HasForeignKey(e => e.ComplexId);
        });

        modelBuilder.Entity<Tournament>(entity =>
        {
            entity.HasKey(e => e.TournamentId);
            entity.Property(e => e.Name).HasMaxLength(200);
            entity.Property(e => e.EntryFee).HasColumnType("decimal(18,2)");
            entity.Property(e => e.Format).HasMaxLength(50);
            entity.Property(e => e.Status).HasMaxLength(20);
            entity.HasOne(e => e.Complex).WithMany().HasForeignKey(e => e.ComplexId);
        });

        modelBuilder.Entity<TournamentRegistration>(entity =>
        {
            entity.HasKey(e => e.TournamentRegistrationId);
            entity.HasIndex(e => new { e.TournamentId, e.CaptainUserId }).IsUnique();
            entity.Property(e => e.TeamName).HasMaxLength(100);
            entity.Property(e => e.Status).HasMaxLength(20);
            entity.HasOne(e => e.Tournament).WithMany(t => t.Registrations).HasForeignKey(e => e.TournamentId);
            entity.HasOne(e => e.Captain).WithMany().HasForeignKey(e => e.CaptainUserId);
            entity.HasOne(e => e.PaymentTransaction).WithMany().HasForeignKey(e => e.PaymentTransactionId).OnDelete(DeleteBehavior.ClientSetNull);
        });

        // TK-015: Global Query Filter
        // (IsDeleted = true) khỏi mọi truy vấn, áp dụng cho mọi entity kế thừa BaseEntity
        // mà có map cột IsDeleted (bỏ qua entity Ignore IsDeleted như OtpCode).
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (!typeof(BaseEntity).IsAssignableFrom(entityType.ClrType))
                continue;
            if (entityType.FindProperty(nameof(BaseEntity.IsDeleted)) is null)
                continue;

            var parameter = Expression.Parameter(entityType.ClrType, "e");
            var body = Expression.Not(Expression.Property(parameter, nameof(BaseEntity.IsDeleted)));
            modelBuilder.Entity(entityType.ClrType).HasQueryFilter(Expression.Lambda(body, parameter));
        }

        // OtpCode không có IsDeleted (xóa cứng) nhưng nav bắt buộc tới User (có soft-delete filter):
        // OTP của user đã xóa mềm là vô nghĩa -> áp filter khớp cha để tránh nav null bất ngờ (EF 10622).
        modelBuilder.Entity<OtpCode>().HasQueryFilter(o => !o.User.IsDeleted);

        // TK-038: Seed dữ liệu mẫu bằng HasData() (Users, CourtTypes, Courts, PricingRules,
        // EquipmentCategories, Equipments). Dữ liệu sẽ được nhúng vào Migration -> xuất ra file SQL.
        modelBuilder.SeedInitialData();
    }
}
