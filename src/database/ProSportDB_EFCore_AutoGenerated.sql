IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE TABLE [AuditLogs] (
        [AuditLogId] bigint NOT NULL IDENTITY,
        [ActorUserId] int NULL,
        [Action] nvarchar(50) NOT NULL,
        [EntityType] nvarchar(50) NOT NULL,
        [EntityId] nvarchar(50) NOT NULL,
        [ComplexId] int NULL,
        [OldValues] nvarchar(max) NULL,
        [NewValues] nvarchar(max) NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_AuditLogs] PRIMARY KEY ([AuditLogId])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE TABLE [Complexes] (
        [ComplexId] int NOT NULL IDENTITY,
        [Name] nvarchar(100) NOT NULL,
        [Address] nvarchar(255) NULL,
        [Description] nvarchar(1000) NULL,
        [Phone] nvarchar(20) NULL,
        [Email] nvarchar(100) NULL,
        [LogoUrl] nvarchar(500) NULL,
        [OpeningTime] time NULL,
        [ClosingTime] time NULL,
        [SlotDurationMinutes] int NOT NULL DEFAULT 60,
        [Status] nvarchar(20) NOT NULL DEFAULT N'Active',
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_Complexes] PRIMARY KEY ([ComplexId])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE TABLE [CourtTypes] (
        [CourtTypeId] int NOT NULL IDENTITY,
        [Name] nvarchar(50) NOT NULL,
        [Description] nvarchar(max) NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_CourtTypes] PRIMARY KEY ([CourtTypeId])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE TABLE [EquipmentCategories] (
        [EquipmentCategoryId] int NOT NULL IDENTITY,
        [Name] nvarchar(100) NOT NULL,
        [Description] nvarchar(500) NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_EquipmentCategories] PRIMARY KEY ([EquipmentCategoryId])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE TABLE [Users] (
        [UserId] int NOT NULL IDENTITY,
        [FullName] nvarchar(100) NOT NULL,
        [Email] varchar(255) NOT NULL,
        [PasswordHash] varchar(500) NULL,
        [PhoneNumber] varchar(15) NULL,
        [Role] varchar(20) NOT NULL,
        [EKycStatus] varchar(20) NOT NULL DEFAULT 'Unverified',
        [AvatarUrl] varchar(500) NULL,
        [GoogleId] varchar(100) NULL,
        [IsPhoneVerified] bit NOT NULL DEFAULT CAST(0 AS bit),
        [IsLocked] bit NOT NULL DEFAULT CAST(0 AS bit),
        [CreatedAt] datetime2 NOT NULL DEFAULT (SYSDATETIME()),
        [UpdatedAt] datetime2 NULL,
        [IsDeleted] bit NOT NULL DEFAULT CAST(0 AS bit),
        CONSTRAINT [PK_Users] PRIMARY KEY ([UserId])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE TABLE [ComplexCancellationPolicies] (
        [ComplexCancellationPolicyId] int NOT NULL IDENTITY,
        [ComplexId] int NOT NULL,
        [FullRefundHoursBefore] int NOT NULL,
        [PartialRefundHoursBefore] int NOT NULL,
        [PartialRefundPercent] decimal(5,2) NOT NULL,
        [PenaltyPercentAfterPartial] decimal(5,2) NOT NULL,
        [WeatherFullRefundEnabled] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_ComplexCancellationPolicies] PRIMARY KEY ([ComplexCancellationPolicyId]),
        CONSTRAINT [FK_ComplexCancellationPolicies_Complexes_ComplexId] FOREIGN KEY ([ComplexId]) REFERENCES [Complexes] ([ComplexId]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE TABLE [ComplexClosures] (
        [ComplexClosureId] int NOT NULL IDENTITY,
        [ComplexId] int NOT NULL,
        [ClosureDate] datetime2 NOT NULL,
        [Reason] nvarchar(max) NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_ComplexClosures] PRIMARY KEY ([ComplexClosureId]),
        CONSTRAINT [FK_ComplexClosures_Complexes_ComplexId] FOREIGN KEY ([ComplexId]) REFERENCES [Complexes] ([ComplexId]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE TABLE [ComplexOperatingSchedules] (
        [ComplexOperatingScheduleId] int NOT NULL IDENTITY,
        [ComplexId] int NOT NULL,
        [DayOfWeek] int NOT NULL,
        [OpenTime] time NOT NULL,
        [CloseTime] time NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_ComplexOperatingSchedules] PRIMARY KEY ([ComplexOperatingScheduleId]),
        CONSTRAINT [FK_ComplexOperatingSchedules_Complexes_ComplexId] FOREIGN KEY ([ComplexId]) REFERENCES [Complexes] ([ComplexId]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE TABLE [ProductStocks] (
        [ProductStockId] int NOT NULL IDENTITY,
        [ComplexId] int NOT NULL,
        [Sku] nvarchar(450) NOT NULL,
        [ProductName] nvarchar(max) NOT NULL,
        [Category] nvarchar(max) NOT NULL,
        [Quantity] int NOT NULL,
        [LowStockThreshold] int NOT NULL,
        [SellingPrice] decimal(18,2) NOT NULL,
        [Status] nvarchar(max) NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_ProductStocks] PRIMARY KEY ([ProductStockId]),
        CONSTRAINT [FK_ProductStocks_Complexes_ComplexId] FOREIGN KEY ([ComplexId]) REFERENCES [Complexes] ([ComplexId]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE TABLE [Tournaments] (
        [TournamentId] int NOT NULL IDENTITY,
        [ComplexId] int NOT NULL,
        [Name] nvarchar(200) NOT NULL,
        [StartDate] datetime2 NOT NULL,
        [EndDate] datetime2 NOT NULL,
        [EntryFee] decimal(18,2) NOT NULL,
        [MaxTeams] int NOT NULL,
        [RegisteredTeams] int NOT NULL,
        [Format] nvarchar(50) NOT NULL,
        [Status] nvarchar(20) NOT NULL,
        [SportType] nvarchar(max) NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_Tournaments] PRIMARY KEY ([TournamentId]),
        CONSTRAINT [FK_Tournaments_Complexes_ComplexId] FOREIGN KEY ([ComplexId]) REFERENCES [Complexes] ([ComplexId]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE TABLE [Courts] (
        [CourtId] int NOT NULL IDENTITY,
        [Name] nvarchar(100) NOT NULL,
        [Code] nvarchar(20) NULL,
        [CourtTypeId] int NOT NULL,
        [Description] nvarchar(max) NULL,
        [ImageUrl] nvarchar(max) NULL,
        [Status] nvarchar(20) NOT NULL DEFAULT N'Available',
        [ComplexId] int NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_Courts] PRIMARY KEY ([CourtId]),
        CONSTRAINT [FK_Courts_Complexes_ComplexId] FOREIGN KEY ([ComplexId]) REFERENCES [Complexes] ([ComplexId]),
        CONSTRAINT [FK_Courts_CourtTypes_CourtTypeId] FOREIGN KEY ([CourtTypeId]) REFERENCES [CourtTypes] ([CourtTypeId])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE TABLE [Equipments] (
        [EquipmentId] int NOT NULL IDENTITY,
        [EquipmentCategoryId] int NOT NULL,
        [Name] nvarchar(100) NOT NULL,
        [EquipmentName] nvarchar(100) NOT NULL,
        [Category] nvarchar(30) NOT NULL DEFAULT N'Racket',
        [SportType] nvarchar(20) NOT NULL,
        [RetailPrice] decimal(18,2) NOT NULL,
        [Description] nvarchar(max) NULL,
        [StockQuantity] int NOT NULL,
        [Status] nvarchar(20) NOT NULL DEFAULT N'Available',
        [ImageUrl] nvarchar(500) NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_Equipments] PRIMARY KEY ([EquipmentId]),
        CONSTRAINT [FK_Equipments_EquipmentCategories_EquipmentCategoryId] FOREIGN KEY ([EquipmentCategoryId]) REFERENCES [EquipmentCategories] ([EquipmentCategoryId])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE TABLE [ChatHistories] (
        [ChatHistoryId] int NOT NULL IDENTITY,
        [UserId] int NOT NULL,
        [Question] nvarchar(max) NOT NULL,
        [Answer] nvarchar(max) NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_ChatHistories] PRIMARY KEY ([ChatHistoryId]),
        CONSTRAINT [FK_ChatHistories_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([UserId]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE TABLE [ComplexOwners] (
        [ComplexOwnerId] int NOT NULL IDENTITY,
        [UserId] int NOT NULL,
        [ComplexId] int NOT NULL,
        [IsPrimary] bit NOT NULL,
        [Status] nvarchar(20) NOT NULL DEFAULT N'Active',
        [ApprovedByAdminId] int NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_ComplexOwners] PRIMARY KEY ([ComplexOwnerId]),
        CONSTRAINT [FK_ComplexOwners_Complexes_ComplexId] FOREIGN KEY ([ComplexId]) REFERENCES [Complexes] ([ComplexId]) ON DELETE CASCADE,
        CONSTRAINT [FK_ComplexOwners_Users_ApprovedByAdminId] FOREIGN KEY ([ApprovedByAdminId]) REFERENCES [Users] ([UserId]),
        CONSTRAINT [FK_ComplexOwners_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([UserId])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE TABLE [ComplexReviews] (
        [ComplexReviewId] int NOT NULL IDENTITY,
        [ComplexId] int NOT NULL,
        [UserId] int NOT NULL,
        [Rating] int NOT NULL,
        [Content] nvarchar(max) NOT NULL,
        [OwnerReply] nvarchar(max) NULL,
        [OwnerReplyAt] datetime2 NULL,
        [IsReported] bit NOT NULL,
        [ReportReason] nvarchar(max) NULL,
        [Status] nvarchar(max) NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_ComplexReviews] PRIMARY KEY ([ComplexReviewId]),
        CONSTRAINT [FK_ComplexReviews_Complexes_ComplexId] FOREIGN KEY ([ComplexId]) REFERENCES [Complexes] ([ComplexId]) ON DELETE CASCADE,
        CONSTRAINT [FK_ComplexReviews_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([UserId])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE TABLE [EkycProfiles] (
        [EkycProfileId] int NOT NULL IDENTITY,
        [UserId] int NOT NULL,
        [FullName] nvarchar(100) NOT NULL,
        [IdentityNumber] nvarchar(20) NOT NULL,
        [FrontImageUrl] nvarchar(max) NOT NULL,
        [BackImageUrl] nvarchar(max) NOT NULL,
        [FaceImageUrl] nvarchar(max) NOT NULL,
        [Status] nvarchar(20) NOT NULL DEFAULT N'Pending',
        [RejectionReason] nvarchar(max) NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_EkycProfiles] PRIMARY KEY ([EkycProfileId]),
        CONSTRAINT [FK_EkycProfiles_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([UserId]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE TABLE [EscrowWallets] (
        [EscrowWalletId] int NOT NULL IDENTITY,
        [UserId] int NOT NULL,
        [Balance] decimal(18,2) NOT NULL DEFAULT 0.0,
        [LockedBalance] decimal(18,2) NOT NULL DEFAULT 0.0,
        [RowVersion] rowversion NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_EscrowWallets] PRIMARY KEY ([EscrowWalletId]),
        CONSTRAINT [FK_EscrowWallets_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([UserId])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE TABLE [Memberships] (
        [MembershipId] int NOT NULL IDENTITY,
        [UserId] int NOT NULL,
        [ComplexId] int NOT NULL,
        [Tier] nvarchar(50) NOT NULL,
        [DiscountPercent] decimal(5,2) NOT NULL,
        [ValidFrom] datetime2 NOT NULL,
        [ValidTo] datetime2 NOT NULL,
        [Status] nvarchar(20) NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_Memberships] PRIMARY KEY ([MembershipId]),
        CONSTRAINT [FK_Memberships_Complexes_ComplexId] FOREIGN KEY ([ComplexId]) REFERENCES [Complexes] ([ComplexId]) ON DELETE CASCADE,
        CONSTRAINT [FK_Memberships_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([UserId]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE TABLE [OtpCodes] (
        [OtpId] int NOT NULL IDENTITY,
        [UserId] int NOT NULL,
        [Code] varchar(6) NOT NULL,
        [Type] varchar(20) NOT NULL,
        [ExpiryTime] datetime2 NOT NULL,
        [IsUsed] bit NOT NULL DEFAULT CAST(0 AS bit),
        [CreatedAt] datetime2 NOT NULL DEFAULT (SYSDATETIME()),
        CONSTRAINT [PK_OtpCodes] PRIMARY KEY ([OtpId]),
        CONSTRAINT [FK_OtpCodes_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([UserId])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE TABLE [StaffAssignments] (
        [StaffAssignmentId] int NOT NULL IDENTITY,
        [StaffUserId] int NOT NULL,
        [ComplexId] int NOT NULL,
        [Status] nvarchar(20) NOT NULL DEFAULT N'Active',
        [CanCheckIn] bit NOT NULL,
        [CanCreateWalkIn] bit NOT NULL,
        [AssignedByUserId] int NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_StaffAssignments] PRIMARY KEY ([StaffAssignmentId]),
        CONSTRAINT [FK_StaffAssignments_Complexes_ComplexId] FOREIGN KEY ([ComplexId]) REFERENCES [Complexes] ([ComplexId]) ON DELETE CASCADE,
        CONSTRAINT [FK_StaffAssignments_Users_AssignedByUserId] FOREIGN KEY ([AssignedByUserId]) REFERENCES [Users] ([UserId]),
        CONSTRAINT [FK_StaffAssignments_Users_StaffUserId] FOREIGN KEY ([StaffUserId]) REFERENCES [Users] ([UserId])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE TABLE [UserSkillRatings] (
        [UserSkillRatingId] int NOT NULL IDENTITY,
        [UserId] int NOT NULL,
        [SportType] nvarchar(50) NOT NULL,
        [EloRating] int NOT NULL,
        [GamesPlayed] int NOT NULL,
        [Wins] int NOT NULL,
        [Losses] int NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_UserSkillRatings] PRIMARY KEY ([UserSkillRatingId]),
        CONSTRAINT [FK_UserSkillRatings_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([UserId]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE TABLE [Vouchers] (
        [VoucherId] int NOT NULL IDENTITY,
        [Code] nvarchar(20) NOT NULL,
        [Name] nvarchar(100) NOT NULL,
        [DiscountPercent] decimal(5,2) NOT NULL,
        [MaxDiscountAmount] decimal(18,2) NULL,
        [MinOrderAmount] decimal(18,2) NULL,
        [TotalQuantity] int NOT NULL,
        [UsedQuantity] int NOT NULL,
        [StartDate] datetime2 NOT NULL,
        [EndDate] datetime2 NOT NULL,
        [CreatedByStaffId] int NULL,
        [ApplicableComplexId] int NULL,
        [ApplicableProductId] int NULL,
        [VoucherType] nvarchar(max) NOT NULL,
        [Status] nvarchar(20) NOT NULL DEFAULT N'Active',
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_Vouchers] PRIMARY KEY ([VoucherId]),
        CONSTRAINT [CK_Vouchers_Status] CHECK ([Status] IN ('Active','Inactive','Expired')),
        CONSTRAINT [FK_Vouchers_Complexes_ApplicableComplexId] FOREIGN KEY ([ApplicableComplexId]) REFERENCES [Complexes] ([ComplexId]),
        CONSTRAINT [FK_Vouchers_ProductStocks_ApplicableProductId] FOREIGN KEY ([ApplicableProductId]) REFERENCES [ProductStocks] ([ProductStockId]),
        CONSTRAINT [FK_Vouchers_Users_CreatedByStaffId] FOREIGN KEY ([CreatedByStaffId]) REFERENCES [Users] ([UserId])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE TABLE [ComplexMaintenanceWindows] (
        [ComplexMaintenanceWindowId] int NOT NULL IDENTITY,
        [ComplexId] int NOT NULL,
        [CourtId] int NULL,
        [StartAt] datetime2 NOT NULL,
        [EndAt] datetime2 NOT NULL,
        [Reason] nvarchar(max) NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_ComplexMaintenanceWindows] PRIMARY KEY ([ComplexMaintenanceWindowId]),
        CONSTRAINT [FK_ComplexMaintenanceWindows_Complexes_ComplexId] FOREIGN KEY ([ComplexId]) REFERENCES [Complexes] ([ComplexId]) ON DELETE CASCADE,
        CONSTRAINT [FK_ComplexMaintenanceWindows_Courts_CourtId] FOREIGN KEY ([CourtId]) REFERENCES [Courts] ([CourtId])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE TABLE [PricingRules] (
        [PricingRuleId] int NOT NULL IDENTITY,
        [ComplexId] int NULL,
        [CourtId] int NULL,
        [CourtTypeId] int NULL,
        [StartTime] time NOT NULL,
        [EndTime] time NOT NULL,
        [PricePerHour] decimal(18,2) NOT NULL,
        [Multiplier] decimal(8,4) NULL,
        [IsWeekend] bit NOT NULL DEFAULT CAST(0 AS bit),
        [DayOfWeek] int NULL,
        [ValidFrom] datetime2 NULL,
        [ValidTo] datetime2 NULL,
        [RuleType] nvarchar(30) NOT NULL DEFAULT N'BasePrice',
        [Status] nvarchar(20) NOT NULL DEFAULT N'Active',
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_PricingRules] PRIMARY KEY ([PricingRuleId]),
        CONSTRAINT [FK_PricingRules_CourtTypes_CourtTypeId] FOREIGN KEY ([CourtTypeId]) REFERENCES [CourtTypes] ([CourtTypeId]),
        CONSTRAINT [FK_PricingRules_Courts_CourtId] FOREIGN KEY ([CourtId]) REFERENCES [Courts] ([CourtId]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE TABLE [RecurringBookingRules] (
        [RecurringBookingRuleId] int NOT NULL IDENTITY,
        [UserId] int NOT NULL,
        [CourtId] int NOT NULL,
        [DayOfWeek] int NOT NULL,
        [StartTime] time NOT NULL,
        [EndTime] time NOT NULL,
        [ValidFrom] datetime2 NOT NULL,
        [ValidTo] datetime2 NOT NULL,
        [Frequency] nvarchar(20) NOT NULL,
        [Status] nvarchar(20) NOT NULL,
        [LastGeneratedDate] datetime2 NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_RecurringBookingRules] PRIMARY KEY ([RecurringBookingRuleId]),
        CONSTRAINT [FK_RecurringBookingRules_Courts_CourtId] FOREIGN KEY ([CourtId]) REFERENCES [Courts] ([CourtId]) ON DELETE CASCADE,
        CONSTRAINT [FK_RecurringBookingRules_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([UserId]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE TABLE [CartItems] (
        [CartItemId] int NOT NULL IDENTITY,
        [UserId] int NOT NULL,
        [EquipmentId] int NOT NULL,
        [Quantity] int NOT NULL,
        [PreferredSerialNumber] nvarchar(max) NULL,
        [UnitPrice] decimal(18,2) NOT NULL,
        [BookingId] int NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_CartItems] PRIMARY KEY ([CartItemId]),
        CONSTRAINT [FK_CartItems_Equipments_EquipmentId] FOREIGN KEY ([EquipmentId]) REFERENCES [Equipments] ([EquipmentId]) ON DELETE CASCADE,
        CONSTRAINT [FK_CartItems_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([UserId]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE TABLE [InventoryTransactions] (
        [InventoryTransactionId] int NOT NULL IDENTITY,
        [EquipmentId] int NOT NULL,
        [UserId] int NOT NULL,
        [TransactionType] nvarchar(50) NOT NULL,
        [Quantity] int NOT NULL,
        [TransactionDate] datetime2 NOT NULL,
        [Notes] nvarchar(500) NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_InventoryTransactions] PRIMARY KEY ([InventoryTransactionId]),
        CONSTRAINT [FK_InventoryTransactions_Equipments_EquipmentId] FOREIGN KEY ([EquipmentId]) REFERENCES [Equipments] ([EquipmentId]) ON DELETE CASCADE,
        CONSTRAINT [FK_InventoryTransactions_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([UserId])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE TABLE [Bookings] (
        [BookingId] int NOT NULL IDENTITY,
        [UserId] int NOT NULL,
        [TotalAmount] decimal(18,2) NOT NULL,
        [Status] nvarchar(20) NOT NULL DEFAULT N'Pending',
        [PaymentMethod] nvarchar(50) NULL,
        [PaymentStatus] nvarchar(20) NULL DEFAULT N'Pending',
        [CheckInCode] nvarchar(50) NULL,
        [CancellationFee] decimal(18,2) NOT NULL DEFAULT 0.0,
        [PaymentDeadline] datetime2 NULL,
        [IsSplitPayment] bit NOT NULL,
        [SplitPaymentDeadline] datetime2 NULL,
        [RecurringRuleId] int NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_Bookings] PRIMARY KEY ([BookingId]),
        CONSTRAINT [CK_Bookings_PaymentMethod] CHECK ([PaymentMethod] IS NULL OR [PaymentMethod] IN ('VNPay','Escrow','Cash')),
        CONSTRAINT [CK_Bookings_PaymentStatus] CHECK ([PaymentStatus] IS NULL OR [PaymentStatus] IN ('Pending','Paid','Refunded','Cancelled')),
        CONSTRAINT [CK_Bookings_Status] CHECK ([Status] IN ('Pending','PendingPayment','Confirmed','CheckedIn','Cancelled','Completed','Expired','NoShow')),
        CONSTRAINT [FK_Bookings_RecurringBookingRules_RecurringRuleId] FOREIGN KEY ([RecurringRuleId]) REFERENCES [RecurringBookingRules] ([RecurringBookingRuleId]) ON DELETE SET NULL,
        CONSTRAINT [FK_Bookings_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([UserId])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE TABLE [BookingDetails] (
        [BookingDetailId] int NOT NULL IDENTITY,
        [BookingId] int NOT NULL,
        [CourtId] int NOT NULL,
        [BookingDate] datetime2 NOT NULL,
        [StartTime] time NOT NULL,
        [EndTime] time NOT NULL,
        [Price] decimal(18,2) NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_BookingDetails] PRIMARY KEY ([BookingDetailId]),
        CONSTRAINT [FK_BookingDetails_Bookings_BookingId] FOREIGN KEY ([BookingId]) REFERENCES [Bookings] ([BookingId]) ON DELETE CASCADE,
        CONSTRAINT [FK_BookingDetails_Courts_CourtId] FOREIGN KEY ([CourtId]) REFERENCES [Courts] ([CourtId])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE TABLE [BookingPaymentShares] (
        [BookingPaymentShareId] int NOT NULL IDENTITY,
        [BookingId] int NOT NULL,
        [UserId] int NOT NULL,
        [Amount] decimal(18,2) NOT NULL,
        [Status] nvarchar(20) NOT NULL,
        [PaymentDeadline] datetime2 NOT NULL,
        [PaidAt] datetime2 NULL,
        [IsHost] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_BookingPaymentShares] PRIMARY KEY ([BookingPaymentShareId]),
        CONSTRAINT [FK_BookingPaymentShares_Bookings_BookingId] FOREIGN KEY ([BookingId]) REFERENCES [Bookings] ([BookingId]) ON DELETE CASCADE,
        CONSTRAINT [FK_BookingPaymentShares_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([UserId]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE TABLE [CheckIns] (
        [CheckInId] int NOT NULL IDENTITY,
        [BookingId] int NOT NULL,
        [StaffId] int NOT NULL,
        [CheckInTime] datetime2 NOT NULL,
        [CheckOutTime] datetime2 NULL,
        [Notes] nvarchar(max) NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_CheckIns] PRIMARY KEY ([CheckInId]),
        CONSTRAINT [FK_CheckIns_Bookings_BookingId] FOREIGN KEY ([BookingId]) REFERENCES [Bookings] ([BookingId]) ON DELETE CASCADE,
        CONSTRAINT [FK_CheckIns_Users_StaffId] FOREIGN KEY ([StaffId]) REFERENCES [Users] ([UserId])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE TABLE [Matches] (
        [MatchId] int NOT NULL IDENTITY,
        [HostId] int NOT NULL,
        [CourtId] int NOT NULL,
        [BookingId] int NULL,
        [MatchDate] datetime2 NOT NULL,
        [StartTime] time NOT NULL,
        [EndTime] time NOT NULL,
        [MaxParticipants] int NOT NULL,
        [CurrentParticipants] int NOT NULL,
        [EscrowAmount] decimal(18,2) NOT NULL,
        [Status] nvarchar(20) NOT NULL DEFAULT N'Open',
        [LevelRequirement] nvarchar(50) NULL,
        [Notes] nvarchar(max) NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_Matches] PRIMARY KEY ([MatchId]),
        CONSTRAINT [CK_Matches_Status] CHECK ([Status] IN ('Open','Closed','Completed','Cancelled')),
        CONSTRAINT [FK_Matches_Bookings_BookingId] FOREIGN KEY ([BookingId]) REFERENCES [Bookings] ([BookingId]),
        CONSTRAINT [FK_Matches_Courts_CourtId] FOREIGN KEY ([CourtId]) REFERENCES [Courts] ([CourtId]),
        CONSTRAINT [FK_Matches_Users_HostId] FOREIGN KEY ([HostId]) REFERENCES [Users] ([UserId])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE TABLE [MatchMembers] (
        [MatchParticipantId] int NOT NULL IDENTITY,
        [MatchId] int NOT NULL,
        [UserId] int NOT NULL,
        [Role] nvarchar(20) NOT NULL DEFAULT N'Joiner',
        [Status] nvarchar(20) NOT NULL DEFAULT N'Pending',
        [HasPaidEscrow] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_MatchMembers] PRIMARY KEY ([MatchParticipantId]),
        CONSTRAINT [FK_MatchMembers_Matches_MatchId] FOREIGN KEY ([MatchId]) REFERENCES [Matches] ([MatchId]) ON DELETE CASCADE,
        CONSTRAINT [FK_MatchMembers_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([UserId])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE TABLE [MatchResults] (
        [MatchResultId] int NOT NULL IDENTITY,
        [MatchId] int NOT NULL,
        [WinnerUserId] int NULL,
        [LoserUserId] int NULL,
        [ReportedByUserId] int NOT NULL,
        [Status] nvarchar(20) NOT NULL,
        [TeamAScore] int NULL,
        [TeamBScore] int NULL,
        [ConfirmedByUserId] int NULL,
        [ConfirmedAt] datetime2 NULL,
        [DisputeReason] nvarchar(500) NULL,
        [DisputedAt] datetime2 NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_MatchResults] PRIMARY KEY ([MatchResultId]),
        CONSTRAINT [FK_MatchResults_Matches_MatchId] FOREIGN KEY ([MatchId]) REFERENCES [Matches] ([MatchId]) ON DELETE CASCADE,
        CONSTRAINT [FK_MatchResults_Users_ConfirmedByUserId] FOREIGN KEY ([ConfirmedByUserId]) REFERENCES [Users] ([UserId]),
        CONSTRAINT [FK_MatchResults_Users_ReportedByUserId] FOREIGN KEY ([ReportedByUserId]) REFERENCES [Users] ([UserId]) ON DELETE CASCADE,
        CONSTRAINT [FK_MatchResults_Users_WinnerUserId] FOREIGN KEY ([WinnerUserId]) REFERENCES [Users] ([UserId])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE TABLE [PlayerRatings] (
        [PlayerRatingId] int NOT NULL IDENTITY,
        [RaterId] int NOT NULL,
        [RatedUserId] int NOT NULL,
        [MatchId] int NOT NULL,
        [Score] int NOT NULL,
        [Comment] nvarchar(max) NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_PlayerRatings] PRIMARY KEY ([PlayerRatingId]),
        CONSTRAINT [FK_PlayerRatings_Matches_MatchId] FOREIGN KEY ([MatchId]) REFERENCES [Matches] ([MatchId]) ON DELETE CASCADE,
        CONSTRAINT [FK_PlayerRatings_Users_RatedUserId] FOREIGN KEY ([RatedUserId]) REFERENCES [Users] ([UserId]),
        CONSTRAINT [FK_PlayerRatings_Users_RaterId] FOREIGN KEY ([RaterId]) REFERENCES [Users] ([UserId])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE TABLE [Reports] (
        [ReportId] int NOT NULL IDENTITY,
        [ReporterId] int NOT NULL,
        [ReportedUserId] int NOT NULL,
        [MatchId] int NOT NULL,
        [Reason] nvarchar(500) NOT NULL,
        [Evidence] nvarchar(1000) NULL,
        [Status] nvarchar(20) NOT NULL DEFAULT N'Pending',
        [AdminNote] nvarchar(1000) NULL,
        [ResolvedByAdminId] int NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_Reports] PRIMARY KEY ([ReportId]),
        CONSTRAINT [FK_Reports_Matches_MatchId] FOREIGN KEY ([MatchId]) REFERENCES [Matches] ([MatchId]) ON DELETE CASCADE,
        CONSTRAINT [FK_Reports_Users_ReportedUserId] FOREIGN KEY ([ReportedUserId]) REFERENCES [Users] ([UserId]),
        CONSTRAINT [FK_Reports_Users_ReporterId] FOREIGN KEY ([ReporterId]) REFERENCES [Users] ([UserId]),
        CONSTRAINT [FK_Reports_Users_ResolvedByAdminId] FOREIGN KEY ([ResolvedByAdminId]) REFERENCES [Users] ([UserId])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE TABLE [Transactions] (
        [TransactionId] int NOT NULL IDENTITY,
        [EscrowWalletId] int NOT NULL,
        [BookingId] int NULL,
        [MatchId] int NULL,
        [Amount] decimal(18,2) NOT NULL,
        [Type] nvarchar(50) NOT NULL,
        [Status] nvarchar(20) NOT NULL DEFAULT N'Pending',
        [ReferenceId] nvarchar(100) NULL,
        [Description] nvarchar(max) NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_Transactions] PRIMARY KEY ([TransactionId]),
        CONSTRAINT [FK_Transactions_Bookings_BookingId] FOREIGN KEY ([BookingId]) REFERENCES [Bookings] ([BookingId]),
        CONSTRAINT [FK_Transactions_EscrowWallets_EscrowWalletId] FOREIGN KEY ([EscrowWalletId]) REFERENCES [EscrowWallets] ([EscrowWalletId]) ON DELETE CASCADE,
        CONSTRAINT [FK_Transactions_Matches_MatchId] FOREIGN KEY ([MatchId]) REFERENCES [Matches] ([MatchId]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE TABLE [TournamentRegistrations] (
        [TournamentRegistrationId] int NOT NULL IDENTITY,
        [TournamentId] int NOT NULL,
        [CaptainUserId] int NOT NULL,
        [TeamName] nvarchar(100) NOT NULL,
        [Status] nvarchar(20) NOT NULL,
        [EntryFeePaid] bit NOT NULL,
        [PaymentTransactionId] int NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_TournamentRegistrations] PRIMARY KEY ([TournamentRegistrationId]),
        CONSTRAINT [FK_TournamentRegistrations_Tournaments_TournamentId] FOREIGN KEY ([TournamentId]) REFERENCES [Tournaments] ([TournamentId]) ON DELETE CASCADE,
        CONSTRAINT [FK_TournamentRegistrations_Transactions_PaymentTransactionId] FOREIGN KEY ([PaymentTransactionId]) REFERENCES [Transactions] ([TransactionId]),
        CONSTRAINT [FK_TournamentRegistrations_Users_CaptainUserId] FOREIGN KEY ([CaptainUserId]) REFERENCES [Users] ([UserId]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'ComplexId', N'Address', N'ClosingTime', N'CreatedAt', N'Description', N'Email', N'IsDeleted', N'LogoUrl', N'Name', N'OpeningTime', N'Phone', N'SlotDurationMinutes', N'Status', N'UpdatedAt') AND [object_id] = OBJECT_ID(N'[Complexes]'))
        SET IDENTITY_INSERT [Complexes] ON;
    EXEC(N'INSERT INTO [Complexes] ([ComplexId], [Address], [ClosingTime], [CreatedAt], [Description], [Email], [IsDeleted], [LogoUrl], [Name], [OpeningTime], [Phone], [SlotDurationMinutes], [Status], [UpdatedAt])
    VALUES (1, N''123 Nguyễn Văn Linh, Quận 7, TP.HCM'', ''23:00:00'', ''2026-01-01T00:00:00.0000000Z'', N''Tổ hợp thể thao cầu lông và pickleball hiện đại nhất khu vực.'', N''contact@prosport-q7.vn'', CAST(0 AS bit), NULL, N''Pro-Sport Complex Quận 7'', ''05:00:00'', N''0912345678'', 60, N''Active'', NULL)');
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'ComplexId', N'Address', N'ClosingTime', N'CreatedAt', N'Description', N'Email', N'IsDeleted', N'LogoUrl', N'Name', N'OpeningTime', N'Phone', N'SlotDurationMinutes', N'Status', N'UpdatedAt') AND [object_id] = OBJECT_ID(N'[Complexes]'))
        SET IDENTITY_INSERT [Complexes] OFF;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'CourtTypeId', N'CreatedAt', N'Description', N'IsDeleted', N'Name', N'UpdatedAt') AND [object_id] = OBJECT_ID(N'[CourtTypes]'))
        SET IDENTITY_INSERT [CourtTypes] ON;
    EXEC(N'INSERT INTO [CourtTypes] ([CourtTypeId], [CreatedAt], [Description], [IsDeleted], [Name], [UpdatedAt])
    VALUES (1, ''2026-01-01T00:00:00.0000000Z'', N''Sân cầu lông tiêu chuẩn'', CAST(0 AS bit), N''Badminton'', NULL),
    (2, ''2026-01-01T00:00:00.0000000Z'', N''Sân Pickleball tiêu chuẩn'', CAST(0 AS bit), N''Pickleball'', NULL)');
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'CourtTypeId', N'CreatedAt', N'Description', N'IsDeleted', N'Name', N'UpdatedAt') AND [object_id] = OBJECT_ID(N'[CourtTypes]'))
        SET IDENTITY_INSERT [CourtTypes] OFF;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'EquipmentCategoryId', N'CreatedAt', N'Description', N'IsDeleted', N'Name', N'UpdatedAt') AND [object_id] = OBJECT_ID(N'[EquipmentCategories]'))
        SET IDENTITY_INSERT [EquipmentCategories] ON;
    EXEC(N'INSERT INTO [EquipmentCategories] ([EquipmentCategoryId], [CreatedAt], [Description], [IsDeleted], [Name], [UpdatedAt])
    VALUES (1, ''2026-01-01T00:00:00.0000000Z'', N''Tất cả các loại vợt'', CAST(0 AS bit), N''Racket'', NULL),
    (2, ''2026-01-01T00:00:00.0000000Z'', N''Giày thể thao'', CAST(0 AS bit), N''Footwear'', NULL),
    (3, ''2026-01-01T00:00:00.0000000Z'', N''Trang phục thể thao'', CAST(0 AS bit), N''Apparel'', NULL),
    (4, ''2026-01-01T00:00:00.0000000Z'', N''Bóng và cầu lông'', CAST(0 AS bit), N''Ball / Birdie'', NULL),
    (5, ''2026-01-01T00:00:00.0000000Z'', N''Phụ kiện'', CAST(0 AS bit), N''Accessories'', NULL),
    (6, ''2026-01-01T00:00:00.0000000Z'', N''Đồ bảo hộ'', CAST(0 AS bit), N''Protection'', NULL)');
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'EquipmentCategoryId', N'CreatedAt', N'Description', N'IsDeleted', N'Name', N'UpdatedAt') AND [object_id] = OBJECT_ID(N'[EquipmentCategories]'))
        SET IDENTITY_INSERT [EquipmentCategories] OFF;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'UserId', N'AvatarUrl', N'CreatedAt', N'EKycStatus', N'Email', N'FullName', N'GoogleId', N'IsPhoneVerified', N'PasswordHash', N'PhoneNumber', N'Role', N'UpdatedAt') AND [object_id] = OBJECT_ID(N'[Users]'))
        SET IDENTITY_INSERT [Users] ON;
    EXEC(N'INSERT INTO [Users] ([UserId], [AvatarUrl], [CreatedAt], [EKycStatus], [Email], [FullName], [GoogleId], [IsPhoneVerified], [PasswordHash], [PhoneNumber], [Role], [UpdatedAt])
    VALUES (1, NULL, ''2026-01-01T00:00:00.0000000Z'', ''Verified'', ''admin@prosport.vn'', N''System Admin'', NULL, CAST(1 AS bit), ''$2a$11$8wyDirTdDhyqTcM3BAde4uiu1da5NulhpGioT7g4ONIT3RcG6f5a2'', ''0900000001'', ''Admin'', NULL),
    (2, NULL, ''2026-01-01T00:00:00.0000000Z'', ''Verified'', ''staff1@prosport.vn'', N''Nguyễn Văn Staff'', NULL, CAST(1 AS bit), ''$2a$11$8wyDirTdDhyqTcM3BAde4uiu1da5NulhpGioT7g4ONIT3RcG6f5a2'', ''0900000002'', ''Staff'', NULL),
    (3, NULL, ''2026-01-01T00:00:00.0000000Z'', ''Verified'', ''staff2@prosport.vn'', N''Trần Thị Staff'', NULL, CAST(1 AS bit), ''$2a$11$8wyDirTdDhyqTcM3BAde4uiu1da5NulhpGioT7g4ONIT3RcG6f5a2'', ''0900000003'', ''Staff'', NULL),
    (4, NULL, ''2026-01-01T00:00:00.0000000Z'', ''Verified'', ''customer1@prosport.vn'', N''Lê Văn Cường'', NULL, CAST(1 AS bit), ''$2a$11$8wyDirTdDhyqTcM3BAde4uiu1da5NulhpGioT7g4ONIT3RcG6f5a2'', ''0900000004'', ''Customer'', NULL),
    (5, NULL, ''2026-01-01T00:00:00.0000000Z'', ''Verified'', ''customer2@prosport.vn'', N''Phạm Thị Dung'', NULL, CAST(1 AS bit), ''$2a$11$8wyDirTdDhyqTcM3BAde4uiu1da5NulhpGioT7g4ONIT3RcG6f5a2'', ''0900000005'', ''Customer'', NULL),
    (6, NULL, ''2026-01-01T00:00:00.0000000Z'', ''Pending'', ''customer3@prosport.vn'', N''Hoàng Văn Em'', NULL, CAST(1 AS bit), ''$2a$11$8wyDirTdDhyqTcM3BAde4uiu1da5NulhpGioT7g4ONIT3RcG6f5a2'', ''0900000006'', ''Customer'', NULL),
    (7, NULL, ''2026-01-01T00:00:00.0000000Z'', ''Verified'', ''customer4@prosport.vn'', N''Võ Thị Phượng'', NULL, CAST(1 AS bit), ''$2a$11$8wyDirTdDhyqTcM3BAde4uiu1da5NulhpGioT7g4ONIT3RcG6f5a2'', ''0900000007'', ''Customer'', NULL)');
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'UserId', N'AvatarUrl', N'CreatedAt', N'EKycStatus', N'Email', N'FullName', N'GoogleId', N'IsPhoneVerified', N'PasswordHash', N'PhoneNumber', N'Role', N'UpdatedAt') AND [object_id] = OBJECT_ID(N'[Users]'))
        SET IDENTITY_INSERT [Users] OFF;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'UserId', N'AvatarUrl', N'CreatedAt', N'EKycStatus', N'Email', N'FullName', N'GoogleId', N'PasswordHash', N'PhoneNumber', N'Role', N'UpdatedAt') AND [object_id] = OBJECT_ID(N'[Users]'))
        SET IDENTITY_INSERT [Users] ON;
    EXEC(N'INSERT INTO [Users] ([UserId], [AvatarUrl], [CreatedAt], [EKycStatus], [Email], [FullName], [GoogleId], [PasswordHash], [PhoneNumber], [Role], [UpdatedAt])
    VALUES (8, NULL, ''2026-01-01T00:00:00.0000000Z'', ''Unverified'', ''customer5@prosport.vn'', N''Đặng Văn Giang'', NULL, ''$2a$11$8wyDirTdDhyqTcM3BAde4uiu1da5NulhpGioT7g4ONIT3RcG6f5a2'', ''0900000008'', ''Customer'', NULL)');
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'UserId', N'AvatarUrl', N'CreatedAt', N'EKycStatus', N'Email', N'FullName', N'GoogleId', N'PasswordHash', N'PhoneNumber', N'Role', N'UpdatedAt') AND [object_id] = OBJECT_ID(N'[Users]'))
        SET IDENTITY_INSERT [Users] OFF;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'UserId', N'AvatarUrl', N'CreatedAt', N'EKycStatus', N'Email', N'FullName', N'GoogleId', N'IsLocked', N'IsPhoneVerified', N'PasswordHash', N'PhoneNumber', N'Role', N'UpdatedAt') AND [object_id] = OBJECT_ID(N'[Users]'))
        SET IDENTITY_INSERT [Users] ON;
    EXEC(N'INSERT INTO [Users] ([UserId], [AvatarUrl], [CreatedAt], [EKycStatus], [Email], [FullName], [GoogleId], [IsLocked], [IsPhoneVerified], [PasswordHash], [PhoneNumber], [Role], [UpdatedAt])
    VALUES (9, NULL, ''2026-01-01T00:00:00.0000000Z'', ''Verified'', ''customer6@prosport.vn'', N''Bùi Thị Hoa'', NULL, CAST(1 AS bit), CAST(1 AS bit), ''$2a$11$8wyDirTdDhyqTcM3BAde4uiu1da5NulhpGioT7g4ONIT3RcG6f5a2'', ''0900000009'', ''Customer'', NULL)');
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'UserId', N'AvatarUrl', N'CreatedAt', N'EKycStatus', N'Email', N'FullName', N'GoogleId', N'IsLocked', N'IsPhoneVerified', N'PasswordHash', N'PhoneNumber', N'Role', N'UpdatedAt') AND [object_id] = OBJECT_ID(N'[Users]'))
        SET IDENTITY_INSERT [Users] OFF;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'UserId', N'AvatarUrl', N'CreatedAt', N'EKycStatus', N'Email', N'FullName', N'GoogleId', N'IsPhoneVerified', N'PasswordHash', N'PhoneNumber', N'Role', N'UpdatedAt') AND [object_id] = OBJECT_ID(N'[Users]'))
        SET IDENTITY_INSERT [Users] ON;
    EXEC(N'INSERT INTO [Users] ([UserId], [AvatarUrl], [CreatedAt], [EKycStatus], [Email], [FullName], [GoogleId], [IsPhoneVerified], [PasswordHash], [PhoneNumber], [Role], [UpdatedAt])
    VALUES (10, NULL, ''2026-01-01T00:00:00.0000000Z'', ''Verified'', ''customer7@prosport.vn'', N''Đỗ Văn Inh'', NULL, CAST(1 AS bit), ''$2a$11$8wyDirTdDhyqTcM3BAde4uiu1da5NulhpGioT7g4ONIT3RcG6f5a2'', ''0900000010'', ''Customer'', NULL)');
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'UserId', N'AvatarUrl', N'CreatedAt', N'EKycStatus', N'Email', N'FullName', N'GoogleId', N'IsPhoneVerified', N'PasswordHash', N'PhoneNumber', N'Role', N'UpdatedAt') AND [object_id] = OBJECT_ID(N'[Users]'))
        SET IDENTITY_INSERT [Users] OFF;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'UserId', N'AvatarUrl', N'CreatedAt', N'EKycStatus', N'Email', N'FullName', N'GoogleId', N'PasswordHash', N'PhoneNumber', N'Role', N'UpdatedAt') AND [object_id] = OBJECT_ID(N'[Users]'))
        SET IDENTITY_INSERT [Users] ON;
    EXEC(N'INSERT INTO [Users] ([UserId], [AvatarUrl], [CreatedAt], [EKycStatus], [Email], [FullName], [GoogleId], [PasswordHash], [PhoneNumber], [Role], [UpdatedAt])
    VALUES (11, NULL, ''2026-01-01T00:00:00.0000000Z'', ''Unverified'', ''walkin@prosport.vn'', N''Khách lẻ Walk-in'', NULL, ''$2a$11$8wyDirTdDhyqTcM3BAde4uiu1da5NulhpGioT7g4ONIT3RcG6f5a2'', ''0900000099'', ''Customer'', NULL)');
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'UserId', N'AvatarUrl', N'CreatedAt', N'EKycStatus', N'Email', N'FullName', N'GoogleId', N'PasswordHash', N'PhoneNumber', N'Role', N'UpdatedAt') AND [object_id] = OBJECT_ID(N'[Users]'))
        SET IDENTITY_INSERT [Users] OFF;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'UserId', N'AvatarUrl', N'CreatedAt', N'EKycStatus', N'Email', N'FullName', N'GoogleId', N'IsPhoneVerified', N'PasswordHash', N'PhoneNumber', N'Role', N'UpdatedAt') AND [object_id] = OBJECT_ID(N'[Users]'))
        SET IDENTITY_INSERT [Users] ON;
    EXEC(N'INSERT INTO [Users] ([UserId], [AvatarUrl], [CreatedAt], [EKycStatus], [Email], [FullName], [GoogleId], [IsPhoneVerified], [PasswordHash], [PhoneNumber], [Role], [UpdatedAt])
    VALUES (12, NULL, ''2026-01-01T00:00:00.0000000Z'', ''Verified'', ''courtowner@prosport.vn'', N''Chủ Sân Demo'', NULL, CAST(1 AS bit), ''$2a$11$8wyDirTdDhyqTcM3BAde4uiu1da5NulhpGioT7g4ONIT3RcG6f5a2'', ''0900000012'', ''CourtOwner'', NULL)');
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'UserId', N'AvatarUrl', N'CreatedAt', N'EKycStatus', N'Email', N'FullName', N'GoogleId', N'IsPhoneVerified', N'PasswordHash', N'PhoneNumber', N'Role', N'UpdatedAt') AND [object_id] = OBJECT_ID(N'[Users]'))
        SET IDENTITY_INSERT [Users] OFF;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'ComplexOwnerId', N'ApprovedByAdminId', N'ComplexId', N'CreatedAt', N'IsDeleted', N'IsPrimary', N'Status', N'UpdatedAt', N'UserId') AND [object_id] = OBJECT_ID(N'[ComplexOwners]'))
        SET IDENTITY_INSERT [ComplexOwners] ON;
    EXEC(N'INSERT INTO [ComplexOwners] ([ComplexOwnerId], [ApprovedByAdminId], [ComplexId], [CreatedAt], [IsDeleted], [IsPrimary], [Status], [UpdatedAt], [UserId])
    VALUES (1, 1, 1, ''2026-01-01T00:00:00.0000000Z'', CAST(0 AS bit), CAST(1 AS bit), N''Active'', NULL, 12)');
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'ComplexOwnerId', N'ApprovedByAdminId', N'ComplexId', N'CreatedAt', N'IsDeleted', N'IsPrimary', N'Status', N'UpdatedAt', N'UserId') AND [object_id] = OBJECT_ID(N'[ComplexOwners]'))
        SET IDENTITY_INSERT [ComplexOwners] OFF;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'CourtId', N'Code', N'ComplexId', N'CourtTypeId', N'CreatedAt', N'Description', N'ImageUrl', N'IsDeleted', N'Name', N'Status', N'UpdatedAt') AND [object_id] = OBJECT_ID(N'[Courts]'))
        SET IDENTITY_INSERT [Courts] ON;
    EXEC(N'INSERT INTO [Courts] ([CourtId], [Code], [ComplexId], [CourtTypeId], [CreatedAt], [Description], [ImageUrl], [IsDeleted], [Name], [Status], [UpdatedAt])
    VALUES (1, NULL, 1, 1, ''2026-01-01T00:00:00.0000000Z'', N''Sân thảm PVC Yonex cao cấp'', N''https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600'', CAST(0 AS bit), N''Sân Cầu Lông A1'', N''Available'', NULL),
    (2, NULL, 1, 1, ''2026-01-01T00:00:00.0000000Z'', N''Sân thảm PVC Yonex cao cấp'', N''https://images.unsplash.com/photo-1517649763962-0c62306601b7?w=600'', CAST(0 AS bit), N''Sân Cầu Lông A2'', N''Available'', NULL),
    (3, NULL, 1, 1, ''2026-01-01T00:00:00.0000000Z'', N''Sân thảm gỗ cao cấp'', N''https://images.unsplash.com/photo-1521537634581-227f84850b41?w=600'', CAST(0 AS bit), N''Sân Cầu Lông A3'', N''Available'', NULL),
    (4, NULL, 1, 2, ''2026-01-01T00:00:00.0000000Z'', N''Sân ngoài trời tiêu chuẩn Mỹ'', N''https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600'', CAST(0 AS bit), N''Sân Pickleball P1'', N''Available'', NULL),
    (5, NULL, 1, 2, ''2026-01-01T00:00:00.0000000Z'', N''Sân ngoài trời tiêu chuẩn Mỹ'', N''https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=600'', CAST(0 AS bit), N''Sân Pickleball P2'', N''Available'', NULL)');
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'CourtId', N'Code', N'ComplexId', N'CourtTypeId', N'CreatedAt', N'Description', N'ImageUrl', N'IsDeleted', N'Name', N'Status', N'UpdatedAt') AND [object_id] = OBJECT_ID(N'[Courts]'))
        SET IDENTITY_INSERT [Courts] OFF;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'EquipmentId', N'Category', N'CreatedAt', N'Description', N'EquipmentCategoryId', N'EquipmentName', N'ImageUrl', N'IsDeleted', N'Name', N'RetailPrice', N'SportType', N'Status', N'StockQuantity', N'UpdatedAt') AND [object_id] = OBJECT_ID(N'[Equipments]'))
        SET IDENTITY_INSERT [Equipments] ON;
    EXEC(N'INSERT INTO [Equipments] ([EquipmentId], [Category], [CreatedAt], [Description], [EquipmentCategoryId], [EquipmentName], [ImageUrl], [IsDeleted], [Name], [RetailPrice], [SportType], [Status], [StockQuantity], [UpdatedAt])
    VALUES (1, N''Racket'', ''2026-01-01T00:00:00.0000000Z'', N''Vợt tấn công nặng đầu, cân bằng 4U, phù hợp người chơi trung bình đến nâng cao.'', 1, N''Vợt Yonex Astrox 88D'', N''https://images.unsplash.com/photo-1617083934551-1af7da84de49?w=400&q=80'', CAST(0 AS bit), N''Vợt Yonex Astrox 88D'', 6000000.0, N''Badminton'', N''Available'', 5, NULL),
    (2, N''Racket'', ''2026-01-01T00:00:00.0000000Z'', N''Vợt siêu nhẹ, tốc độ cao, lý tưởng cho người mới bắt đầu và đánh đôi.'', 1, N''Vợt Lining Windstorm 72'', N''https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80'', CAST(0 AS bit), N''Vợt Lining Windstorm 72'', 4000000.0, N''Badminton'', N''Available'', 8, NULL),
    (3, N''Racket'', ''2026-01-01T00:00:00.0000000Z'', N''Vợt công thủ toàn diện, độ cứng vừa phải, kiểm soát tốt.'', 1, N''Vợt Victor Thruster K Falcon'', N''https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80'', CAST(0 AS bit), N''Vợt Victor Thruster K Falcon'', 5500000.0, N''Badminton'', N''Available'', 4, NULL),
    (4, N''Racket'', ''2026-01-01T00:00:00.0000000Z'', N''Vợt polymer core FiberFlex, cân bằng giữa sức mạnh và kiểm soát bóng.'', 1, N''Vợt Selkirk AMPED Epic'', N''https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&q=80'', CAST(0 AS bit), N''Vợt Selkirk AMPED Epic'', 7000000.0, N''Pickleball'', N''Available'', 4, NULL),
    (5, N''Footwear'', ''2026-01-01T00:00:00.0000000Z'', N''Giày cầu lông Power Cushion, đệm gót êm, bám sân tốt.'', 2, N''Giày Yonex Power Cushion 65Z3'', N''https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80'', CAST(0 AS bit), N''Giày Yonex Power Cushion 65Z3'', 3200000.0, N''Badminton'', N''Available'', 6, NULL),
    (6, N''Footwear'', ''2026-01-01T00:00:00.0000000Z'', N''Giày cầu lông nhẹ, thoáng khí, phù hợp tập luyện và thi đấu phong trào.'', 2, N''Giày Victor A610 III'', N''https://images.unsplash.com/photo-1606107557195-0a394bbe4a5d?w=400&q=80'', CAST(0 AS bit), N''Giày Victor A610 III'', 2400000.0, N''Badminton'', N''Available'', 8, NULL),
    (7, N''Footwear'', ''2026-01-01T00:00:00.0000000Z'', N''Giày đa năng cho sân trong nhà, đế cao su bám tốt, hỗ trợ cổ chân ổn định.'', 2, N''Giày Asics Gel-Rocket 11'', N''https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&q=80'', CAST(0 AS bit), N''Giày Asics Gel-Rocket 11'', 2800000.0, N''Pickleball'', N''Available'', 5, NULL),
    (8, N''Apparel'', ''2026-01-01T00:00:00.0000000Z'', N''Áo thun thi đấu thoáng mát, thấm hút mồ hôi, form regular fit.'', 3, N''Áo thi đấu Yonex Tournament'', N''https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80'', CAST(0 AS bit), N''Áo thi đấu Yonex Tournament'', 650000.0, N''Badminton'', N''Available'', 15, NULL),
    (9, N''Apparel'', ''2026-01-01T00:00:00.0000000Z'', N''Quần short co giãn 4 chiều, khô nhanh, phù hợp tập luyện và thi đấu.'', 3, N''Quần short thể thao Pro-Sport DryFit'', N''https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&q=80'', CAST(0 AS bit), N''Quần short thể thao Pro-Sport DryFit'', 450000.0, N''Badminton'', N''Available'', 12, NULL),
    (10, N''Apparel'', ''2026-01-01T00:00:00.0000000Z'', N''Áo khoác chống gió nhẹ, có mũ trùm đầu, dễ gấp gọn mang theo.'', 3, N''Áo khoác gió thể thao Pro-Sport'', N''https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&q=80'', CAST(0 AS bit), N''Áo khoác gió thể thao Pro-Sport'', 890000.0, N''Pickleball'', N''Available'', 10, NULL),
    (11, N''Ball / Birdie'', ''2026-01-01T00:00:00.0000000Z'', N''Cầu nhựa tập luyện bền, quỹ đạo ổn định, phù hợp sân trong nhà.'', 4, N''Cầu lông nhựa Yonex Mavis 350 (ống 6 quả)'', N''https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80'', CAST(0 AS bit), N''Cầu lông nhựa Yonex Mavis 350 (ống 6 quả)'', 280000.0, N''Badminton'', N''Available'', 25, NULL),
    (12, N''Ball / Birdie'', ''2026-01-01T00:00:00.0000000Z'', N''Cầu lông thi đấu cao cấp, lông ngỗng tự nhiên, độ bền và cảm giác đánh tốt.'', 4, N''Cầu lông lông ngỗng Yonex AS-50 (hộp 12 quả)'', N''https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&q=80'', CAST(0 AS bit), N''Cầu lông lông ngỗng Yonex AS-50 (hộp 12 quả)'', 1200000.0, N''Badminton'', N''Available'', 10, NULL),
    (13, N''Ball / Birdie'', ''2026-01-01T00:00:00.0000000Z'', N''Bóng pickleball trong nhà, lỗ 40, độ nảy đồng đều, chuẩn thi đấu.'', 4, N''Bóng Pickleball Franklin X-40 (hộp 6 quả)'', N''https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&q=80'', CAST(0 AS bit), N''Bóng Pickleball Franklin X-40 (hộp 6 quả)'', 350000.0, N''Pickleball'', N''Available'', 20, NULL),
    (14, N''Ball / Birdie'', ''2026-01-01T00:00:00.0000000Z'', N''Bóng pickleball ngoài trời, bền, ít vỡ, phù hợp sân cứng.'', 4, N''Bóng Pickleball Onix Fuse G2 (hộp 6 quả)'', N''https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=400&q=80'', CAST(0 AS bit), N''Bóng Pickleball Onix Fuse G2 (hộp 6 quả)'', 420000.0, N''Pickleball'', N''Available'', 15, NULL),
    (15, N''Accessories'', ''2026-01-01T00:00:00.0000000Z'', N''Quấn cán thấm mồ hôi, mềm, tăng độ bám khi cầm vợt lâu.'', 5, N''Quấn cán vợt Yonex Super Grap (3 cuộn)'', N''https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80'', CAST(0 AS bit), N''Quấn cán vợt Yonex Super Grap (3 cuộn)'', 180000.0, N''Badminton'', N''Available'', 30, NULL),
    (16, N''Accessories'', ''2026-01-01T00:00:00.0000000Z'', N''Túi vợt 6 ngăn có ngăn giày riêng, chống nước nhẹ.'', 5, N''Túi đựng vợt 6 ngăn Yonex Pro'', N''https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80'', CAST(0 AS bit), N''Túi đựng vợt 6 ngăn Yonex Pro'', 2100000.0, N''Badminton'', N''Available'', 5, NULL),
    (17, N''Accessories'', ''2026-01-01T00:00:00.0000000Z'', N''Băng tay co giãn, thấm mồ hôi, giữ khô tay khi thi đấu.'', 5, N''Băng cổ tay thấm mồ hôi (bộ 2)'', N''https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80'', CAST(0 AS bit), N''Băng cổ tay thấm mồ hôi (bộ 2)'', 120000.0, N''Badminton'', N''Available'', 25, NULL),
    (18, N''Protection'', ''2026-01-01T00:00:00.0000000Z'', N''Băng gối hỗ trợ khớp, co giãn, giảm chấn khi di chuyển đột ngột.'', 6, N''Băng gối thể thao neoprene'', N''https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80'', CAST(0 AS bit), N''Băng gối thể thao neoprene'', 320000.0, N''Badminton'', N''Available'', 10, NULL),
    (19, N''Protection'', ''2026-01-01T00:00:00.0000000Z'', N''Băng cổ chân cố định khớp, phòng tránh trẹo cổ chân khi thi đấu.'', 6, N''Băng cổ chân thể thao'', N''https://images.unsplash.com/photo-1518310383802-640c2b31135a?w=400&q=80'', CAST(0 AS bit), N''Băng cổ chân thể thao'', 250000.0, N''Badminton'', N''Available'', 12, NULL),
    (20, N''Protection'', ''2026-01-01T00:00:00.0000000Z'', N''Kính chống va đập, chống sương mù, bảo vệ mắt khi đánh gần lưới.'', 6, N''Kính bảo hộ Pickleball Pro-Sport'', N''https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&q=80'', CAST(0 AS bit), N''Kính bảo hộ Pickleball Pro-Sport'', 480000.0, N''Pickleball'', N''Available'', 8, NULL)');
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'EquipmentId', N'Category', N'CreatedAt', N'Description', N'EquipmentCategoryId', N'EquipmentName', N'ImageUrl', N'IsDeleted', N'Name', N'RetailPrice', N'SportType', N'Status', N'StockQuantity', N'UpdatedAt') AND [object_id] = OBJECT_ID(N'[Equipments]'))
        SET IDENTITY_INSERT [Equipments] OFF;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'PricingRuleId', N'ComplexId', N'CourtId', N'CourtTypeId', N'CreatedAt', N'DayOfWeek', N'EndTime', N'IsDeleted', N'Multiplier', N'PricePerHour', N'RuleType', N'StartTime', N'Status', N'UpdatedAt', N'ValidFrom', N'ValidTo') AND [object_id] = OBJECT_ID(N'[PricingRules]'))
        SET IDENTITY_INSERT [PricingRules] ON;
    EXEC(N'INSERT INTO [PricingRules] ([PricingRuleId], [ComplexId], [CourtId], [CourtTypeId], [CreatedAt], [DayOfWeek], [EndTime], [IsDeleted], [Multiplier], [PricePerHour], [RuleType], [StartTime], [Status], [UpdatedAt], [ValidFrom], [ValidTo])
    VALUES (1, NULL, NULL, 1, ''2026-01-01T00:00:00.0000000Z'', NULL, ''17:00:00'', CAST(0 AS bit), NULL, 80000.0, N''BasePrice'', ''05:00:00'', N''Active'', NULL, NULL, NULL),
    (2, NULL, NULL, 1, ''2026-01-01T00:00:00.0000000Z'', NULL, ''22:00:00'', CAST(0 AS bit), NULL, 120000.0, N''BasePrice'', ''17:00:00'', N''Active'', NULL, NULL, NULL)');
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'PricingRuleId', N'ComplexId', N'CourtId', N'CourtTypeId', N'CreatedAt', N'DayOfWeek', N'EndTime', N'IsDeleted', N'Multiplier', N'PricePerHour', N'RuleType', N'StartTime', N'Status', N'UpdatedAt', N'ValidFrom', N'ValidTo') AND [object_id] = OBJECT_ID(N'[PricingRules]'))
        SET IDENTITY_INSERT [PricingRules] OFF;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'PricingRuleId', N'ComplexId', N'CourtId', N'CourtTypeId', N'CreatedAt', N'DayOfWeek', N'EndTime', N'IsDeleted', N'IsWeekend', N'Multiplier', N'PricePerHour', N'RuleType', N'StartTime', N'Status', N'UpdatedAt', N'ValidFrom', N'ValidTo') AND [object_id] = OBJECT_ID(N'[PricingRules]'))
        SET IDENTITY_INSERT [PricingRules] ON;
    EXEC(N'INSERT INTO [PricingRules] ([PricingRuleId], [ComplexId], [CourtId], [CourtTypeId], [CreatedAt], [DayOfWeek], [EndTime], [IsDeleted], [IsWeekend], [Multiplier], [PricePerHour], [RuleType], [StartTime], [Status], [UpdatedAt], [ValidFrom], [ValidTo])
    VALUES (3, NULL, NULL, 1, ''2026-01-01T00:00:00.0000000Z'', NULL, ''22:00:00'', CAST(0 AS bit), CAST(1 AS bit), NULL, 140000.0, N''BasePrice'', ''05:00:00'', N''Active'', NULL, NULL, NULL)');
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'PricingRuleId', N'ComplexId', N'CourtId', N'CourtTypeId', N'CreatedAt', N'DayOfWeek', N'EndTime', N'IsDeleted', N'IsWeekend', N'Multiplier', N'PricePerHour', N'RuleType', N'StartTime', N'Status', N'UpdatedAt', N'ValidFrom', N'ValidTo') AND [object_id] = OBJECT_ID(N'[PricingRules]'))
        SET IDENTITY_INSERT [PricingRules] OFF;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'PricingRuleId', N'ComplexId', N'CourtId', N'CourtTypeId', N'CreatedAt', N'DayOfWeek', N'EndTime', N'IsDeleted', N'Multiplier', N'PricePerHour', N'RuleType', N'StartTime', N'Status', N'UpdatedAt', N'ValidFrom', N'ValidTo') AND [object_id] = OBJECT_ID(N'[PricingRules]'))
        SET IDENTITY_INSERT [PricingRules] ON;
    EXEC(N'INSERT INTO [PricingRules] ([PricingRuleId], [ComplexId], [CourtId], [CourtTypeId], [CreatedAt], [DayOfWeek], [EndTime], [IsDeleted], [Multiplier], [PricePerHour], [RuleType], [StartTime], [Status], [UpdatedAt], [ValidFrom], [ValidTo])
    VALUES (4, NULL, NULL, 2, ''2026-01-01T00:00:00.0000000Z'', NULL, ''17:00:00'', CAST(0 AS bit), NULL, 100000.0, N''BasePrice'', ''05:00:00'', N''Active'', NULL, NULL, NULL),
    (5, NULL, NULL, 2, ''2026-01-01T00:00:00.0000000Z'', NULL, ''22:00:00'', CAST(0 AS bit), NULL, 150000.0, N''BasePrice'', ''17:00:00'', N''Active'', NULL, NULL, NULL)');
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'PricingRuleId', N'ComplexId', N'CourtId', N'CourtTypeId', N'CreatedAt', N'DayOfWeek', N'EndTime', N'IsDeleted', N'Multiplier', N'PricePerHour', N'RuleType', N'StartTime', N'Status', N'UpdatedAt', N'ValidFrom', N'ValidTo') AND [object_id] = OBJECT_ID(N'[PricingRules]'))
        SET IDENTITY_INSERT [PricingRules] OFF;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'PricingRuleId', N'ComplexId', N'CourtId', N'CourtTypeId', N'CreatedAt', N'DayOfWeek', N'EndTime', N'IsDeleted', N'IsWeekend', N'Multiplier', N'PricePerHour', N'RuleType', N'StartTime', N'Status', N'UpdatedAt', N'ValidFrom', N'ValidTo') AND [object_id] = OBJECT_ID(N'[PricingRules]'))
        SET IDENTITY_INSERT [PricingRules] ON;
    EXEC(N'INSERT INTO [PricingRules] ([PricingRuleId], [ComplexId], [CourtId], [CourtTypeId], [CreatedAt], [DayOfWeek], [EndTime], [IsDeleted], [IsWeekend], [Multiplier], [PricePerHour], [RuleType], [StartTime], [Status], [UpdatedAt], [ValidFrom], [ValidTo])
    VALUES (6, NULL, NULL, 2, ''2026-01-01T00:00:00.0000000Z'', NULL, ''22:00:00'', CAST(0 AS bit), CAST(1 AS bit), NULL, 180000.0, N''BasePrice'', ''05:00:00'', N''Active'', NULL, NULL, NULL)');
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'PricingRuleId', N'ComplexId', N'CourtId', N'CourtTypeId', N'CreatedAt', N'DayOfWeek', N'EndTime', N'IsDeleted', N'IsWeekend', N'Multiplier', N'PricePerHour', N'RuleType', N'StartTime', N'Status', N'UpdatedAt', N'ValidFrom', N'ValidTo') AND [object_id] = OBJECT_ID(N'[PricingRules]'))
        SET IDENTITY_INSERT [PricingRules] OFF;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'StaffAssignmentId', N'AssignedByUserId', N'CanCheckIn', N'CanCreateWalkIn', N'ComplexId', N'CreatedAt', N'IsDeleted', N'StaffUserId', N'Status', N'UpdatedAt') AND [object_id] = OBJECT_ID(N'[StaffAssignments]'))
        SET IDENTITY_INSERT [StaffAssignments] ON;
    EXEC(N'INSERT INTO [StaffAssignments] ([StaffAssignmentId], [AssignedByUserId], [CanCheckIn], [CanCreateWalkIn], [ComplexId], [CreatedAt], [IsDeleted], [StaffUserId], [Status], [UpdatedAt])
    VALUES (1, 12, CAST(1 AS bit), CAST(1 AS bit), 1, ''2026-01-01T00:00:00.0000000Z'', CAST(0 AS bit), 2, N''Active'', NULL),
    (2, 12, CAST(1 AS bit), CAST(1 AS bit), 1, ''2026-01-01T00:00:00.0000000Z'', CAST(0 AS bit), 3, N''Active'', NULL)');
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'StaffAssignmentId', N'AssignedByUserId', N'CanCheckIn', N'CanCreateWalkIn', N'ComplexId', N'CreatedAt', N'IsDeleted', N'StaffUserId', N'Status', N'UpdatedAt') AND [object_id] = OBJECT_ID(N'[StaffAssignments]'))
        SET IDENTITY_INSERT [StaffAssignments] OFF;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_AuditLogs_ComplexId] ON [AuditLogs] ([ComplexId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_AuditLogs_CreatedAt] ON [AuditLogs] ([CreatedAt]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_BookingDetails_BookingId] ON [BookingDetails] ([BookingId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_BookingDetails_CourtId_BookingDate] ON [BookingDetails] ([CourtId], [BookingDate]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_BookingPaymentShares_BookingId_UserId] ON [BookingPaymentShares] ([BookingId], [UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_BookingPaymentShares_UserId] ON [BookingPaymentShares] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    EXEC(N'CREATE UNIQUE INDEX [IX_Bookings_CheckInCode] ON [Bookings] ([CheckInCode]) WHERE [CheckInCode] IS NOT NULL');
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Bookings_CreatedAt] ON [Bookings] ([CreatedAt]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Bookings_RecurringRuleId] ON [Bookings] ([RecurringRuleId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Bookings_Status_IsDeleted] ON [Bookings] ([Status], [IsDeleted]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Bookings_UserId] ON [Bookings] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_CartItems_EquipmentId] ON [CartItems] ([EquipmentId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_CartItems_UserId] ON [CartItems] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_ChatHistories_UserId] ON [ChatHistories] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_CheckIns_BookingId] ON [CheckIns] ([BookingId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_CheckIns_StaffId] ON [CheckIns] ([StaffId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_ComplexCancellationPolicies_ComplexId] ON [ComplexCancellationPolicies] ([ComplexId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_ComplexClosures_ComplexId_ClosureDate] ON [ComplexClosures] ([ComplexId], [ClosureDate]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_ComplexMaintenanceWindows_ComplexId] ON [ComplexMaintenanceWindows] ([ComplexId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_ComplexMaintenanceWindows_CourtId] ON [ComplexMaintenanceWindows] ([CourtId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_ComplexOperatingSchedules_ComplexId_DayOfWeek] ON [ComplexOperatingSchedules] ([ComplexId], [DayOfWeek]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_ComplexOwners_ApprovedByAdminId] ON [ComplexOwners] ([ApprovedByAdminId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_ComplexOwners_ComplexId] ON [ComplexOwners] ([ComplexId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_ComplexOwners_UserId_ComplexId] ON [ComplexOwners] ([UserId], [ComplexId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    EXEC(N'CREATE UNIQUE INDEX [IX_ComplexReviews_ComplexId_UserId] ON [ComplexReviews] ([ComplexId], [UserId]) WHERE [IsDeleted] = 0');
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_ComplexReviews_UserId] ON [ComplexReviews] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    EXEC(N'CREATE UNIQUE INDEX [IX_Courts_ComplexId_Code] ON [Courts] ([ComplexId], [Code]) WHERE [Code] IS NOT NULL AND [IsDeleted] = 0');
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Courts_ComplexId_IsDeleted] ON [Courts] ([ComplexId], [IsDeleted]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Courts_CourtTypeId] ON [Courts] ([CourtTypeId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_EkycProfiles_IdentityNumber] ON [EkycProfiles] ([IdentityNumber]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_EkycProfiles_UserId] ON [EkycProfiles] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Equipments_EquipmentCategoryId] ON [Equipments] ([EquipmentCategoryId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_EscrowWallets_UserId] ON [EscrowWallets] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_InventoryTransactions_EquipmentId] ON [InventoryTransactions] ([EquipmentId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_InventoryTransactions_UserId] ON [InventoryTransactions] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Matches_BookingId] ON [Matches] ([BookingId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Matches_CourtId] ON [Matches] ([CourtId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Matches_HostId] ON [Matches] ([HostId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Matches_Status] ON [Matches] ([Status]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_MatchMembers_MatchId_UserId] ON [MatchMembers] ([MatchId], [UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_MatchMembers_UserId] ON [MatchMembers] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_MatchResults_ConfirmedByUserId] ON [MatchResults] ([ConfirmedByUserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_MatchResults_MatchId] ON [MatchResults] ([MatchId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_MatchResults_ReportedByUserId] ON [MatchResults] ([ReportedByUserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_MatchResults_WinnerUserId] ON [MatchResults] ([WinnerUserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Memberships_ComplexId] ON [Memberships] ([ComplexId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Memberships_UserId] ON [Memberships] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_OtpCodes_UserId_Type_IsUsed_ExpiryTime] ON [OtpCodes] ([UserId], [Type], [IsUsed], [ExpiryTime]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_PlayerRatings_MatchId] ON [PlayerRatings] ([MatchId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_PlayerRatings_RatedUserId] ON [PlayerRatings] ([RatedUserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_PlayerRatings_RaterId_RatedUserId_MatchId] ON [PlayerRatings] ([RaterId], [RatedUserId], [MatchId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_PricingRules_CourtId] ON [PricingRules] ([CourtId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_PricingRules_CourtTypeId] ON [PricingRules] ([CourtTypeId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    EXEC(N'CREATE UNIQUE INDEX [IX_ProductStocks_ComplexId_Sku] ON [ProductStocks] ([ComplexId], [Sku]) WHERE [IsDeleted] = 0');
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_RecurringBookingRules_CourtId] ON [RecurringBookingRules] ([CourtId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_RecurringBookingRules_UserId] ON [RecurringBookingRules] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Reports_MatchId] ON [Reports] ([MatchId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Reports_ReportedUserId] ON [Reports] ([ReportedUserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Reports_ReporterId] ON [Reports] ([ReporterId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Reports_ResolvedByAdminId] ON [Reports] ([ResolvedByAdminId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_StaffAssignments_AssignedByUserId] ON [StaffAssignments] ([AssignedByUserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_StaffAssignments_ComplexId] ON [StaffAssignments] ([ComplexId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_StaffAssignments_StaffUserId_ComplexId] ON [StaffAssignments] ([StaffUserId], [ComplexId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_TournamentRegistrations_CaptainUserId] ON [TournamentRegistrations] ([CaptainUserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_TournamentRegistrations_PaymentTransactionId] ON [TournamentRegistrations] ([PaymentTransactionId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_TournamentRegistrations_TournamentId_CaptainUserId] ON [TournamentRegistrations] ([TournamentId], [CaptainUserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Tournaments_ComplexId] ON [Tournaments] ([ComplexId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Transactions_BookingId] ON [Transactions] ([BookingId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Transactions_EscrowWalletId] ON [Transactions] ([EscrowWalletId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Transactions_MatchId] ON [Transactions] ([MatchId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    EXEC(N'CREATE UNIQUE INDEX [IX_Transactions_ReferenceId] ON [Transactions] ([ReferenceId]) WHERE [ReferenceId] IS NOT NULL');
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Users_Email] ON [Users] ([Email]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    EXEC(N'CREATE UNIQUE INDEX [IX_Users_GoogleId] ON [Users] ([GoogleId]) WHERE [GoogleId] IS NOT NULL');
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    EXEC(N'CREATE UNIQUE INDEX [IX_Users_PhoneNumber] ON [Users] ([PhoneNumber]) WHERE [PhoneNumber] IS NOT NULL AND [IsDeleted] = 0');
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_UserSkillRatings_UserId_SportType] ON [UserSkillRatings] ([UserId], [SportType]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Vouchers_ApplicableComplexId] ON [Vouchers] ([ApplicableComplexId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Vouchers_ApplicableProductId] ON [Vouchers] ([ApplicableProductId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Vouchers_Code] ON [Vouchers] ([Code]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Vouchers_CreatedByStaffId] ON [Vouchers] ([CreatedByStaffId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260713180046_InitialCreate'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260713180046_InitialCreate', N'8.0.8');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260717234608_TournamentStatusConstraint'
)
BEGIN
    EXEC(N'ALTER TABLE [Tournaments] ADD CONSTRAINT [CK_Tournaments_Status] CHECK ([Status] IN (''Open'',''Closed'',''Completed'',''Cancelled''))');
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260717234608_TournamentStatusConstraint'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260717234608_TournamentStatusConstraint', N'8.0.8');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260718044554_UserStatusConstraints'
)
BEGIN
    EXEC(N'ALTER TABLE [Users] ADD CONSTRAINT [CK_Users_EKycStatus] CHECK ([EKycStatus] IN (''Unverified'',''Pending'',''Verified'',''Rejected''))');
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260718044554_UserStatusConstraints'
)
BEGIN
    EXEC(N'ALTER TABLE [Users] ADD CONSTRAINT [CK_Users_Role] CHECK ([Role] IN (''Admin'',''Staff'',''Customer'',''CourtOwner''))');
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260718044554_UserStatusConstraints'
)
BEGIN
    EXEC(N'ALTER TABLE [EkycProfiles] ADD CONSTRAINT [CK_EkycProfiles_Status] CHECK ([Status] IN (''Pending'',''Approved'',''Rejected''))');
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260718044554_UserStatusConstraints'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260718044554_UserStatusConstraints', N'8.0.8');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260718050332_AdminEntityStatusConstraints'
)
BEGIN
    EXEC(N'ALTER TABLE [Reports] ADD CONSTRAINT [CK_Reports_Status] CHECK ([Status] IN (''Pending'',''Investigating'',''Resolved'',''Rejected''))');
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260718050332_AdminEntityStatusConstraints'
)
BEGIN
    EXEC(N'ALTER TABLE [ProductStocks] ADD CONSTRAINT [CK_ProductStocks_Status] CHECK ([Status] IN (''Active'',''Inactive''))');
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260718050332_AdminEntityStatusConstraints'
)
BEGIN
    EXEC(N'ALTER TABLE [PricingRules] ADD CONSTRAINT [CK_PricingRules_Status] CHECK ([Status] IN (''Active'',''Inactive''))');
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260718050332_AdminEntityStatusConstraints'
)
BEGIN
    EXEC(N'ALTER TABLE [Courts] ADD CONSTRAINT [CK_Courts_Status] CHECK ([Status] IN (''Available'',''Maintenance'',''Inactive''))');
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260718050332_AdminEntityStatusConstraints'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260718050332_AdminEntityStatusConstraints', N'8.0.8');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260718052308_OwnerEntityStatusConstraints'
)
BEGIN
    EXEC(N'ALTER TABLE [Equipments] ADD CONSTRAINT [CK_Equipments_Status] CHECK ([Status] IN (''Available'',''Discontinued''))');
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260718052308_OwnerEntityStatusConstraints'
)
BEGIN
    EXEC(N'ALTER TABLE [ComplexReviews] ADD CONSTRAINT [CK_ComplexReviews_Status] CHECK ([Status] IN (''Published'',''Hidden''))');
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260718052308_OwnerEntityStatusConstraints'
)
BEGIN
    EXEC(N'ALTER TABLE [ComplexOwners] ADD CONSTRAINT [CK_ComplexOwners_Status] CHECK ([Status] IN (''Active'',''Inactive''))');
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260718052308_OwnerEntityStatusConstraints'
)
BEGIN
    EXEC(N'ALTER TABLE [Complexes] ADD CONSTRAINT [CK_Complexes_Status] CHECK ([Status] IN (''Active'',''Inactive''))');
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260718052308_OwnerEntityStatusConstraints'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260718052308_OwnerEntityStatusConstraints', N'8.0.8');
END;
GO

COMMIT;
GO

