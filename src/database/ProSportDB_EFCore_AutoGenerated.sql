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
    WHERE [MigrationId] = N'20260616092257_AddPaymentDeadline'
)
BEGIN
    ALTER TABLE [Bookings] ADD [PaymentDeadline] datetime2 NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260616092257_AddPaymentDeadline'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260616092257_AddPaymentDeadline', N'8.0.8');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260617142007_AddPaymentDeadlineToBookings'
)
BEGIN
    ALTER TABLE [Bookings] ADD [PaymentDeadline] datetime2 NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260617142007_AddPaymentDeadlineToBookings'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260617142007_AddPaymentDeadlineToBookings', N'8.0.8');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260617165643_AddEquipmentInventory'
)
BEGIN
    DECLARE @var0 sysname;
    SELECT @var0 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Equipments]') AND [c].[name] = N'Condition');
    IF @var0 IS NOT NULL EXEC(N'ALTER TABLE [Equipments] DROP CONSTRAINT [' + @var0 + '];');
    ALTER TABLE [Equipments] DROP COLUMN [Condition];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260617165643_AddEquipmentInventory'
)
BEGIN
    DECLARE @var1 sysname;
    SELECT @var1 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Equipments]') AND [c].[name] = N'Type');
    IF @var1 IS NOT NULL EXEC(N'ALTER TABLE [Equipments] DROP CONSTRAINT [' + @var1 + '];');
    ALTER TABLE [Equipments] DROP COLUMN [Type];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260617165643_AddEquipmentInventory'
)
BEGIN
    EXEC sp_rename N'[Equipments].[TotalQuantity]', N'StockQuantity', N'COLUMN';
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260617165643_AddEquipmentInventory'
)
BEGIN
    EXEC sp_rename N'[Equipments].[RentalPrice]', N'Price', N'COLUMN';
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260617165643_AddEquipmentInventory'
)
BEGIN
    EXEC sp_rename N'[Equipments].[AvailableQuantity]', N'EquipmentCategoryId', N'COLUMN';
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260617165643_AddEquipmentInventory'
)
BEGIN
    ALTER TABLE [Equipments] ADD [Status] nvarchar(20) NOT NULL DEFAULT N'Available';
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260617165643_AddEquipmentInventory'
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
    WHERE [MigrationId] = N'20260617165643_AddEquipmentInventory'
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
    WHERE [MigrationId] = N'20260617165643_AddEquipmentInventory'
)
BEGIN
    CREATE INDEX [IX_Equipments_EquipmentCategoryId] ON [Equipments] ([EquipmentCategoryId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260617165643_AddEquipmentInventory'
)
BEGIN
    CREATE INDEX [IX_InventoryTransactions_EquipmentId] ON [InventoryTransactions] ([EquipmentId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260617165643_AddEquipmentInventory'
)
BEGIN
    CREATE INDEX [IX_InventoryTransactions_UserId] ON [InventoryTransactions] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260617165643_AddEquipmentInventory'
)
BEGIN
    ALTER TABLE [Equipments] ADD CONSTRAINT [FK_Equipments_EquipmentCategories_EquipmentCategoryId] FOREIGN KEY ([EquipmentCategoryId]) REFERENCES [EquipmentCategories] ([EquipmentCategoryId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260617165643_AddEquipmentInventory'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260617165643_AddEquipmentInventory', N'8.0.8');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260617173327_AddPaymentDeadline'
)
BEGIN
    IF COL_LENGTH('dbo.Bookings', 'PaymentDeadline') IS NULL
        ALTER TABLE [Bookings] ADD [PaymentDeadline] datetime2 NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260617173327_AddPaymentDeadline'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260617173327_AddPaymentDeadline', N'8.0.8');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618032857_AddEscrowRowVersion'
)
BEGIN
    ALTER TABLE [EscrowWallets] ADD [RowVersion] rowversion NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618032857_AddEscrowRowVersion'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260618032857_AddEscrowRowVersion', N'8.0.8');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
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
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
)
BEGIN
    CREATE TABLE [Equipments] (
        [EquipmentId] int NOT NULL IDENTITY,
        [EquipmentName] nvarchar(100) NOT NULL,
        [Category] nvarchar(30) NOT NULL DEFAULT N'Racket',
        [SportType] nvarchar(20) NOT NULL,
        [RetailPrice] decimal(18,2) NOT NULL,
        [RentalPrice] AS CAST([RetailPrice] * 0.05 AS DECIMAL(18,2)) PERSISTED,
        [RentalStock] int NOT NULL DEFAULT 0,
        [SalesStock] int NOT NULL DEFAULT 0,
        [ImageUrl] nvarchar(500) NULL,
        [Description] nvarchar(max) NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_Equipments] PRIMARY KEY ([EquipmentId])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
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
        [CreatedAt] datetime2 NOT NULL DEFAULT (SYSDATETIME()),
        [UpdatedAt] datetime2 NULL,
        [IsDeleted] bit NOT NULL DEFAULT CAST(0 AS bit),
        CONSTRAINT [PK_Users] PRIMARY KEY ([UserId])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
)
BEGIN
    CREATE TABLE [Courts] (
        [CourtId] int NOT NULL IDENTITY,
        [Name] nvarchar(100) NOT NULL,
        [CourtTypeId] int NOT NULL,
        [Description] nvarchar(max) NULL,
        [ImageUrl] nvarchar(max) NULL,
        [Status] nvarchar(20) NOT NULL DEFAULT N'Available',
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_Courts] PRIMARY KEY ([CourtId]),
        CONSTRAINT [FK_Courts_CourtTypes_CourtTypeId] FOREIGN KEY ([CourtTypeId]) REFERENCES [CourtTypes] ([CourtTypeId])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
)
BEGIN
    CREATE TABLE [EquipmentUnits] (
        [EquipmentUnitId] int NOT NULL IDENTITY,
        [EquipmentId] int NOT NULL,
        [SerialNumber] nvarchar(50) NOT NULL,
        [RentalCount] int NOT NULL,
        [Status] nvarchar(20) NOT NULL DEFAULT N'Available',
        [Condition] nvarchar(100) NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_EquipmentUnits] PRIMARY KEY ([EquipmentUnitId]),
        CONSTRAINT [FK_EquipmentUnits_Equipments_EquipmentId] FOREIGN KEY ([EquipmentId]) REFERENCES [Equipments] ([EquipmentId]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
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
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_Bookings] PRIMARY KEY ([BookingId]),
        CONSTRAINT [FK_Bookings_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([UserId])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
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
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
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
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
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
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
)
BEGIN
    CREATE TABLE [EscrowWallets] (
        [EscrowWalletId] int NOT NULL IDENTITY,
        [UserId] int NOT NULL,
        [Balance] decimal(18,2) NOT NULL DEFAULT 0.0,
        [LockedBalance] decimal(18,2) NOT NULL DEFAULT 0.0,
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
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
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
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
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
        [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit),
        [CreatedByStaffId] int NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NULL,
        [IsDeleted] bit NOT NULL,
        CONSTRAINT [PK_Vouchers] PRIMARY KEY ([VoucherId]),
        CONSTRAINT [FK_Vouchers_Users_CreatedByStaffId] FOREIGN KEY ([CreatedByStaffId]) REFERENCES [Users] ([UserId])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
)
BEGIN
    CREATE TABLE [PricingRules] (
        [PricingRuleId] int NOT NULL IDENTITY,
        [CourtId] int NULL,
        [CourtTypeId] int NULL,
        [StartTime] time NOT NULL,
        [EndTime] time NOT NULL,
        [PricePerHour] decimal(18,2) NOT NULL,
        [IsWeekend] bit NOT NULL DEFAULT CAST(0 AS bit),
        [DayOfWeek] int NULL,
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
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
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
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
)
BEGIN
    CREATE TABLE [BookingDetails_Equipments] (
        [DetailId] int NOT NULL IDENTITY,
        [BookingId] int NULL,
        [UserId] int NOT NULL,
        [EquipmentId] int NOT NULL,
        [Quantity] int NOT NULL,
        [UnitPrice] decimal(18,2) NOT NULL,
        [Subtotal] AS [Quantity] * [UnitPrice] PERSISTED,
        [DepositAmount] decimal(18,2) NOT NULL DEFAULT 0.0,
        [DepositStatus] nvarchar(20) NOT NULL DEFAULT N'Held',
        [RentalStatus] nvarchar(20) NOT NULL DEFAULT N'Rented',
        [ReturnCondition] nvarchar(20) NULL,
        [DamageNote] nvarchar(500) NULL,
        [DamageFee] decimal(18,2) NULL,
        [DepositRefundAmount] decimal(18,2) NULL,
        [AdditionalCharge] decimal(18,2) NULL,
        [RentedAt] datetime2 NOT NULL DEFAULT (SYSDATETIME()),
        [EquipmentUnitId] int NULL,
        CONSTRAINT [PK_BookingDetails_Equipments] PRIMARY KEY ([DetailId]),
        CONSTRAINT [FK_BookingDetails_Equipments_Bookings_BookingId] FOREIGN KEY ([BookingId]) REFERENCES [Bookings] ([BookingId]),
        CONSTRAINT [FK_BookingDetails_Equipments_EquipmentUnits_EquipmentUnitId] FOREIGN KEY ([EquipmentUnitId]) REFERENCES [EquipmentUnits] ([EquipmentUnitId]) ON DELETE SET NULL,
        CONSTRAINT [FK_BookingDetails_Equipments_Equipments_EquipmentId] FOREIGN KEY ([EquipmentId]) REFERENCES [Equipments] ([EquipmentId])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
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
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
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
        CONSTRAINT [FK_Matches_Bookings_BookingId] FOREIGN KEY ([BookingId]) REFERENCES [Bookings] ([BookingId]),
        CONSTRAINT [FK_Matches_Courts_CourtId] FOREIGN KEY ([CourtId]) REFERENCES [Courts] ([CourtId]),
        CONSTRAINT [FK_Matches_Users_HostId] FOREIGN KEY ([HostId]) REFERENCES [Users] ([UserId])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
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
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
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
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
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
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
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
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
)
BEGIN
    CREATE INDEX [IX_BookingDetails_BookingId] ON [BookingDetails] ([BookingId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
)
BEGIN
    CREATE INDEX [IX_BookingDetails_CourtId] ON [BookingDetails] ([CourtId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
)
BEGIN
    CREATE INDEX [IX_BookingDetails_Equipments_BookingId] ON [BookingDetails_Equipments] ([BookingId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
)
BEGIN
    CREATE INDEX [IX_BookingDetails_Equipments_EquipmentId] ON [BookingDetails_Equipments] ([EquipmentId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
)
BEGIN
    CREATE INDEX [IX_BookingDetails_Equipments_EquipmentUnitId] ON [BookingDetails_Equipments] ([EquipmentUnitId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
)
BEGIN
    EXEC(N'CREATE UNIQUE INDEX [IX_Bookings_CheckInCode] ON [Bookings] ([CheckInCode]) WHERE [CheckInCode] IS NOT NULL');
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
)
BEGIN
    CREATE INDEX [IX_Bookings_UserId] ON [Bookings] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
)
BEGIN
    CREATE INDEX [IX_CartItems_EquipmentId] ON [CartItems] ([EquipmentId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
)
BEGIN
    CREATE INDEX [IX_CartItems_UserId] ON [CartItems] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
)
BEGIN
    CREATE INDEX [IX_ChatHistories_UserId] ON [ChatHistories] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
)
BEGIN
    CREATE UNIQUE INDEX [IX_CheckIns_BookingId] ON [CheckIns] ([BookingId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
)
BEGIN
    CREATE INDEX [IX_CheckIns_StaffId] ON [CheckIns] ([StaffId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
)
BEGIN
    CREATE INDEX [IX_Courts_CourtTypeId] ON [Courts] ([CourtTypeId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
)
BEGIN
    CREATE UNIQUE INDEX [IX_EkycProfiles_IdentityNumber] ON [EkycProfiles] ([IdentityNumber]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
)
BEGIN
    CREATE UNIQUE INDEX [IX_EkycProfiles_UserId] ON [EkycProfiles] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
)
BEGIN
    CREATE INDEX [IX_EquipmentUnits_EquipmentId] ON [EquipmentUnits] ([EquipmentId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
)
BEGIN
    CREATE UNIQUE INDEX [IX_EscrowWallets_UserId] ON [EscrowWallets] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
)
BEGIN
    CREATE INDEX [IX_Matches_BookingId] ON [Matches] ([BookingId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
)
BEGIN
    CREATE INDEX [IX_Matches_CourtId] ON [Matches] ([CourtId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
)
BEGIN
    CREATE INDEX [IX_Matches_HostId] ON [Matches] ([HostId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
)
BEGIN
    CREATE UNIQUE INDEX [IX_MatchMembers_MatchId_UserId] ON [MatchMembers] ([MatchId], [UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
)
BEGIN
    CREATE INDEX [IX_MatchMembers_UserId] ON [MatchMembers] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
)
BEGIN
    CREATE INDEX [IX_OtpCodes_UserId_Type_IsUsed_ExpiryTime] ON [OtpCodes] ([UserId], [Type], [IsUsed], [ExpiryTime]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
)
BEGIN
    CREATE INDEX [IX_PlayerRatings_MatchId] ON [PlayerRatings] ([MatchId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
)
BEGIN
    CREATE INDEX [IX_PlayerRatings_RatedUserId] ON [PlayerRatings] ([RatedUserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
)
BEGIN
    CREATE UNIQUE INDEX [IX_PlayerRatings_RaterId_RatedUserId_MatchId] ON [PlayerRatings] ([RaterId], [RatedUserId], [MatchId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
)
BEGIN
    CREATE INDEX [IX_PricingRules_CourtId] ON [PricingRules] ([CourtId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
)
BEGIN
    CREATE INDEX [IX_PricingRules_CourtTypeId] ON [PricingRules] ([CourtTypeId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
)
BEGIN
    CREATE INDEX [IX_Reports_MatchId] ON [Reports] ([MatchId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
)
BEGIN
    CREATE INDEX [IX_Reports_ReportedUserId] ON [Reports] ([ReportedUserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
)
BEGIN
    CREATE INDEX [IX_Reports_ReporterId] ON [Reports] ([ReporterId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
)
BEGIN
    CREATE INDEX [IX_Reports_ResolvedByAdminId] ON [Reports] ([ResolvedByAdminId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
)
BEGIN
    CREATE INDEX [IX_Transactions_BookingId] ON [Transactions] ([BookingId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
)
BEGIN
    CREATE INDEX [IX_Transactions_EscrowWalletId] ON [Transactions] ([EscrowWalletId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
)
BEGIN
    CREATE INDEX [IX_Transactions_MatchId] ON [Transactions] ([MatchId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Users_Email] ON [Users] ([Email]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
)
BEGIN
    EXEC(N'CREATE UNIQUE INDEX [IX_Users_GoogleId] ON [Users] ([GoogleId]) WHERE [GoogleId] IS NOT NULL');
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Vouchers_Code] ON [Vouchers] ([Code]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
)
BEGIN
    CREATE INDEX [IX_Vouchers_CreatedByStaffId] ON [Vouchers] ([CreatedByStaffId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260618045048_AddCartAndEquipmentUpdates'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260618045048_AddCartAndEquipmentUpdates', N'8.0.8');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260627033506_AddUserIsLocked'
)
BEGIN
    DROP TABLE [BookingDetails_Equipments];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260627033506_AddUserIsLocked'
)
BEGIN
    DROP TABLE [EquipmentUnits];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260627033506_AddUserIsLocked'
)
BEGIN
    DECLARE @var2 sysname;
    SELECT @var2 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Equipments]') AND [c].[name] = N'RentalPrice');
    IF @var2 IS NOT NULL EXEC(N'ALTER TABLE [Equipments] DROP CONSTRAINT [' + @var2 + '];');
    ALTER TABLE [Equipments] DROP COLUMN [RentalPrice];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260627033506_AddUserIsLocked'
)
BEGIN
    DECLARE @var3 sysname;
    SELECT @var3 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Equipments]') AND [c].[name] = N'RentalStock');
    IF @var3 IS NOT NULL EXEC(N'ALTER TABLE [Equipments] DROP CONSTRAINT [' + @var3 + '];');
    ALTER TABLE [Equipments] DROP COLUMN [RentalStock];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260627033506_AddUserIsLocked'
)
BEGIN
    DECLARE @var4 sysname;
    SELECT @var4 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Equipments]') AND [c].[name] = N'SalesStock');
    IF @var4 IS NOT NULL EXEC(N'ALTER TABLE [Equipments] DROP CONSTRAINT [' + @var4 + '];');
    ALTER TABLE [Equipments] DROP COLUMN [SalesStock];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260627033506_AddUserIsLocked'
)
BEGIN
    ALTER TABLE [Users] ADD [IsLocked] bit NOT NULL DEFAULT CAST(0 AS bit);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260627033506_AddUserIsLocked'
)
BEGIN
    ALTER TABLE [Equipments] ADD [Name] nvarchar(100) NOT NULL DEFAULT N'';
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260627033506_AddUserIsLocked'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260627033506_AddUserIsLocked', N'8.0.8');
END;
GO

COMMIT;
GO

