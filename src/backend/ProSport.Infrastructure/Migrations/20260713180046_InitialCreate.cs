using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ProSport.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AuditLogs",
                columns: table => new
                {
                    AuditLogId = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ActorUserId = table.Column<int>(type: "int", nullable: true),
                    Action = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    EntityType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    EntityId = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ComplexId = table.Column<int>(type: "int", nullable: true),
                    OldValues = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NewValues = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditLogs", x => x.AuditLogId);
                });

            migrationBuilder.CreateTable(
                name: "Complexes",
                columns: table => new
                {
                    ComplexId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Address = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    Phone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    LogoUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    OpeningTime = table.Column<TimeSpan>(type: "time", nullable: true),
                    ClosingTime = table.Column<TimeSpan>(type: "time", nullable: true),
                    SlotDurationMinutes = table.Column<int>(type: "int", nullable: false, defaultValue: 60),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "Active"),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Complexes", x => x.ComplexId);
                });

            migrationBuilder.CreateTable(
                name: "CourtTypes",
                columns: table => new
                {
                    CourtTypeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CourtTypes", x => x.CourtTypeId);
                });

            migrationBuilder.CreateTable(
                name: "EquipmentCategories",
                columns: table => new
                {
                    EquipmentCategoryId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EquipmentCategories", x => x.EquipmentCategoryId);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FullName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    PasswordHash = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true),
                    PhoneNumber = table.Column<string>(type: "varchar(15)", maxLength: 15, nullable: true),
                    Role = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false),
                    EKycStatus = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false, defaultValue: "Unverified"),
                    AvatarUrl = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true),
                    GoogleId = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true),
                    IsPhoneVerified = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    IsLocked = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "SYSDATETIME()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserId);
                });

            migrationBuilder.CreateTable(
                name: "ComplexCancellationPolicies",
                columns: table => new
                {
                    ComplexCancellationPolicyId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ComplexId = table.Column<int>(type: "int", nullable: false),
                    FullRefundHoursBefore = table.Column<int>(type: "int", nullable: false),
                    PartialRefundHoursBefore = table.Column<int>(type: "int", nullable: false),
                    PartialRefundPercent = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    PenaltyPercentAfterPartial = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    WeatherFullRefundEnabled = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ComplexCancellationPolicies", x => x.ComplexCancellationPolicyId);
                    table.ForeignKey(
                        name: "FK_ComplexCancellationPolicies_Complexes_ComplexId",
                        column: x => x.ComplexId,
                        principalTable: "Complexes",
                        principalColumn: "ComplexId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ComplexClosures",
                columns: table => new
                {
                    ComplexClosureId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ComplexId = table.Column<int>(type: "int", nullable: false),
                    ClosureDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Reason = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ComplexClosures", x => x.ComplexClosureId);
                    table.ForeignKey(
                        name: "FK_ComplexClosures_Complexes_ComplexId",
                        column: x => x.ComplexId,
                        principalTable: "Complexes",
                        principalColumn: "ComplexId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ComplexOperatingSchedules",
                columns: table => new
                {
                    ComplexOperatingScheduleId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ComplexId = table.Column<int>(type: "int", nullable: false),
                    DayOfWeek = table.Column<int>(type: "int", nullable: false),
                    OpenTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    CloseTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ComplexOperatingSchedules", x => x.ComplexOperatingScheduleId);
                    table.ForeignKey(
                        name: "FK_ComplexOperatingSchedules_Complexes_ComplexId",
                        column: x => x.ComplexId,
                        principalTable: "Complexes",
                        principalColumn: "ComplexId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProductStocks",
                columns: table => new
                {
                    ProductStockId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ComplexId = table.Column<int>(type: "int", nullable: false),
                    Sku = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProductName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Category = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    LowStockThreshold = table.Column<int>(type: "int", nullable: false),
                    SellingPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductStocks", x => x.ProductStockId);
                    table.ForeignKey(
                        name: "FK_ProductStocks_Complexes_ComplexId",
                        column: x => x.ComplexId,
                        principalTable: "Complexes",
                        principalColumn: "ComplexId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Tournaments",
                columns: table => new
                {
                    TournamentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ComplexId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EntryFee = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    MaxTeams = table.Column<int>(type: "int", nullable: false),
                    RegisteredTeams = table.Column<int>(type: "int", nullable: false),
                    Format = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    SportType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tournaments", x => x.TournamentId);
                    table.ForeignKey(
                        name: "FK_Tournaments_Complexes_ComplexId",
                        column: x => x.ComplexId,
                        principalTable: "Complexes",
                        principalColumn: "ComplexId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Courts",
                columns: table => new
                {
                    CourtId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Code = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    CourtTypeId = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "Available"),
                    ComplexId = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Courts", x => x.CourtId);
                    table.ForeignKey(
                        name: "FK_Courts_Complexes_ComplexId",
                        column: x => x.ComplexId,
                        principalTable: "Complexes",
                        principalColumn: "ComplexId");
                    table.ForeignKey(
                        name: "FK_Courts_CourtTypes_CourtTypeId",
                        column: x => x.CourtTypeId,
                        principalTable: "CourtTypes",
                        principalColumn: "CourtTypeId");
                });

            migrationBuilder.CreateTable(
                name: "Equipments",
                columns: table => new
                {
                    EquipmentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EquipmentCategoryId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    EquipmentName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Category = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false, defaultValue: "Racket"),
                    SportType = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    RetailPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StockQuantity = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "Available"),
                    ImageUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Equipments", x => x.EquipmentId);
                    table.ForeignKey(
                        name: "FK_Equipments_EquipmentCategories_EquipmentCategoryId",
                        column: x => x.EquipmentCategoryId,
                        principalTable: "EquipmentCategories",
                        principalColumn: "EquipmentCategoryId");
                });

            migrationBuilder.CreateTable(
                name: "ChatHistories",
                columns: table => new
                {
                    ChatHistoryId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Question = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Answer = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChatHistories", x => x.ChatHistoryId);
                    table.ForeignKey(
                        name: "FK_ChatHistories_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ComplexOwners",
                columns: table => new
                {
                    ComplexOwnerId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    ComplexId = table.Column<int>(type: "int", nullable: false),
                    IsPrimary = table.Column<bool>(type: "bit", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "Active"),
                    ApprovedByAdminId = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ComplexOwners", x => x.ComplexOwnerId);
                    table.ForeignKey(
                        name: "FK_ComplexOwners_Complexes_ComplexId",
                        column: x => x.ComplexId,
                        principalTable: "Complexes",
                        principalColumn: "ComplexId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ComplexOwners_Users_ApprovedByAdminId",
                        column: x => x.ApprovedByAdminId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                    table.ForeignKey(
                        name: "FK_ComplexOwners_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "ComplexReviews",
                columns: table => new
                {
                    ComplexReviewId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ComplexId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Rating = table.Column<int>(type: "int", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OwnerReply = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OwnerReplyAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsReported = table.Column<bool>(type: "bit", nullable: false),
                    ReportReason = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ComplexReviews", x => x.ComplexReviewId);
                    table.ForeignKey(
                        name: "FK_ComplexReviews_Complexes_ComplexId",
                        column: x => x.ComplexId,
                        principalTable: "Complexes",
                        principalColumn: "ComplexId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ComplexReviews_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "EkycProfiles",
                columns: table => new
                {
                    EkycProfileId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    IdentityNumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    FrontImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BackImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FaceImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "Pending"),
                    RejectionReason = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EkycProfiles", x => x.EkycProfileId);
                    table.ForeignKey(
                        name: "FK_EkycProfiles_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EscrowWallets",
                columns: table => new
                {
                    EscrowWalletId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Balance = table.Column<decimal>(type: "decimal(18,2)", nullable: false, defaultValue: 0m),
                    LockedBalance = table.Column<decimal>(type: "decimal(18,2)", nullable: false, defaultValue: 0m),
                    RowVersion = table.Column<byte[]>(type: "rowversion", rowVersion: true, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EscrowWallets", x => x.EscrowWalletId);
                    table.ForeignKey(
                        name: "FK_EscrowWallets_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "Memberships",
                columns: table => new
                {
                    MembershipId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    ComplexId = table.Column<int>(type: "int", nullable: false),
                    Tier = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    DiscountPercent = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    ValidFrom = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ValidTo = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Memberships", x => x.MembershipId);
                    table.ForeignKey(
                        name: "FK_Memberships_Complexes_ComplexId",
                        column: x => x.ComplexId,
                        principalTable: "Complexes",
                        principalColumn: "ComplexId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Memberships_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OtpCodes",
                columns: table => new
                {
                    OtpId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Code = table.Column<string>(type: "varchar(6)", maxLength: 6, nullable: false),
                    Type = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false),
                    ExpiryTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsUsed = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "SYSDATETIME()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OtpCodes", x => x.OtpId);
                    table.ForeignKey(
                        name: "FK_OtpCodes_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "StaffAssignments",
                columns: table => new
                {
                    StaffAssignmentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StaffUserId = table.Column<int>(type: "int", nullable: false),
                    ComplexId = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "Active"),
                    CanCheckIn = table.Column<bool>(type: "bit", nullable: false),
                    CanCreateWalkIn = table.Column<bool>(type: "bit", nullable: false),
                    AssignedByUserId = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StaffAssignments", x => x.StaffAssignmentId);
                    table.ForeignKey(
                        name: "FK_StaffAssignments_Complexes_ComplexId",
                        column: x => x.ComplexId,
                        principalTable: "Complexes",
                        principalColumn: "ComplexId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StaffAssignments_Users_AssignedByUserId",
                        column: x => x.AssignedByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                    table.ForeignKey(
                        name: "FK_StaffAssignments_Users_StaffUserId",
                        column: x => x.StaffUserId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "UserSkillRatings",
                columns: table => new
                {
                    UserSkillRatingId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    SportType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    EloRating = table.Column<int>(type: "int", nullable: false),
                    GamesPlayed = table.Column<int>(type: "int", nullable: false),
                    Wins = table.Column<int>(type: "int", nullable: false),
                    Losses = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserSkillRatings", x => x.UserSkillRatingId);
                    table.ForeignKey(
                        name: "FK_UserSkillRatings_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Vouchers",
                columns: table => new
                {
                    VoucherId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DiscountPercent = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    MaxDiscountAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    MinOrderAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    TotalQuantity = table.Column<int>(type: "int", nullable: false),
                    UsedQuantity = table.Column<int>(type: "int", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedByStaffId = table.Column<int>(type: "int", nullable: true),
                    ApplicableComplexId = table.Column<int>(type: "int", nullable: true),
                    ApplicableProductId = table.Column<int>(type: "int", nullable: true),
                    VoucherType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "Active"),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vouchers", x => x.VoucherId);
                    table.CheckConstraint("CK_Vouchers_Status", "[Status] IN ('Active','Inactive','Expired')");
                    table.ForeignKey(
                        name: "FK_Vouchers_Complexes_ApplicableComplexId",
                        column: x => x.ApplicableComplexId,
                        principalTable: "Complexes",
                        principalColumn: "ComplexId");
                    table.ForeignKey(
                        name: "FK_Vouchers_ProductStocks_ApplicableProductId",
                        column: x => x.ApplicableProductId,
                        principalTable: "ProductStocks",
                        principalColumn: "ProductStockId");
                    table.ForeignKey(
                        name: "FK_Vouchers_Users_CreatedByStaffId",
                        column: x => x.CreatedByStaffId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "ComplexMaintenanceWindows",
                columns: table => new
                {
                    ComplexMaintenanceWindowId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ComplexId = table.Column<int>(type: "int", nullable: false),
                    CourtId = table.Column<int>(type: "int", nullable: true),
                    StartAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Reason = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ComplexMaintenanceWindows", x => x.ComplexMaintenanceWindowId);
                    table.ForeignKey(
                        name: "FK_ComplexMaintenanceWindows_Complexes_ComplexId",
                        column: x => x.ComplexId,
                        principalTable: "Complexes",
                        principalColumn: "ComplexId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ComplexMaintenanceWindows_Courts_CourtId",
                        column: x => x.CourtId,
                        principalTable: "Courts",
                        principalColumn: "CourtId");
                });

            migrationBuilder.CreateTable(
                name: "PricingRules",
                columns: table => new
                {
                    PricingRuleId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ComplexId = table.Column<int>(type: "int", nullable: true),
                    CourtId = table.Column<int>(type: "int", nullable: true),
                    CourtTypeId = table.Column<int>(type: "int", nullable: true),
                    StartTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    EndTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    PricePerHour = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Multiplier = table.Column<decimal>(type: "decimal(8,4)", nullable: true),
                    IsWeekend = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    DayOfWeek = table.Column<int>(type: "int", nullable: true),
                    ValidFrom = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ValidTo = table.Column<DateTime>(type: "datetime2", nullable: true),
                    RuleType = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false, defaultValue: "BasePrice"),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "Active"),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PricingRules", x => x.PricingRuleId);
                    table.ForeignKey(
                        name: "FK_PricingRules_CourtTypes_CourtTypeId",
                        column: x => x.CourtTypeId,
                        principalTable: "CourtTypes",
                        principalColumn: "CourtTypeId");
                    table.ForeignKey(
                        name: "FK_PricingRules_Courts_CourtId",
                        column: x => x.CourtId,
                        principalTable: "Courts",
                        principalColumn: "CourtId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RecurringBookingRules",
                columns: table => new
                {
                    RecurringBookingRuleId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    CourtId = table.Column<int>(type: "int", nullable: false),
                    DayOfWeek = table.Column<int>(type: "int", nullable: false),
                    StartTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    EndTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    ValidFrom = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ValidTo = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Frequency = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    LastGeneratedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RecurringBookingRules", x => x.RecurringBookingRuleId);
                    table.ForeignKey(
                        name: "FK_RecurringBookingRules_Courts_CourtId",
                        column: x => x.CourtId,
                        principalTable: "Courts",
                        principalColumn: "CourtId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RecurringBookingRules_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CartItems",
                columns: table => new
                {
                    CartItemId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    EquipmentId = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    PreferredSerialNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UnitPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    BookingId = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CartItems", x => x.CartItemId);
                    table.ForeignKey(
                        name: "FK_CartItems_Equipments_EquipmentId",
                        column: x => x.EquipmentId,
                        principalTable: "Equipments",
                        principalColumn: "EquipmentId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CartItems_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "InventoryTransactions",
                columns: table => new
                {
                    InventoryTransactionId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EquipmentId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    TransactionType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    TransactionDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InventoryTransactions", x => x.InventoryTransactionId);
                    table.ForeignKey(
                        name: "FK_InventoryTransactions_Equipments_EquipmentId",
                        column: x => x.EquipmentId,
                        principalTable: "Equipments",
                        principalColumn: "EquipmentId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_InventoryTransactions_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "Bookings",
                columns: table => new
                {
                    BookingId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    TotalAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "Pending"),
                    PaymentMethod = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    PaymentStatus = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true, defaultValue: "Pending"),
                    CheckInCode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    CancellationFee = table.Column<decimal>(type: "decimal(18,2)", nullable: false, defaultValue: 0m),
                    PaymentDeadline = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsSplitPayment = table.Column<bool>(type: "bit", nullable: false),
                    SplitPaymentDeadline = table.Column<DateTime>(type: "datetime2", nullable: true),
                    RecurringRuleId = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bookings", x => x.BookingId);
                    table.CheckConstraint("CK_Bookings_PaymentMethod", "[PaymentMethod] IS NULL OR [PaymentMethod] IN ('VNPay','Escrow','Cash')");
                    table.CheckConstraint("CK_Bookings_PaymentStatus", "[PaymentStatus] IS NULL OR [PaymentStatus] IN ('Pending','Paid','Refunded','Cancelled')");
                    table.CheckConstraint("CK_Bookings_Status", "[Status] IN ('Pending','PendingPayment','Confirmed','CheckedIn','Cancelled','Completed','Expired','NoShow')");
                    table.ForeignKey(
                        name: "FK_Bookings_RecurringBookingRules_RecurringRuleId",
                        column: x => x.RecurringRuleId,
                        principalTable: "RecurringBookingRules",
                        principalColumn: "RecurringBookingRuleId",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Bookings_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "BookingDetails",
                columns: table => new
                {
                    BookingDetailId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BookingId = table.Column<int>(type: "int", nullable: false),
                    CourtId = table.Column<int>(type: "int", nullable: false),
                    BookingDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    StartTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    EndTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookingDetails", x => x.BookingDetailId);
                    table.ForeignKey(
                        name: "FK_BookingDetails_Bookings_BookingId",
                        column: x => x.BookingId,
                        principalTable: "Bookings",
                        principalColumn: "BookingId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BookingDetails_Courts_CourtId",
                        column: x => x.CourtId,
                        principalTable: "Courts",
                        principalColumn: "CourtId");
                });

            migrationBuilder.CreateTable(
                name: "BookingPaymentShares",
                columns: table => new
                {
                    BookingPaymentShareId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BookingId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    PaymentDeadline = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PaidAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsHost = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookingPaymentShares", x => x.BookingPaymentShareId);
                    table.ForeignKey(
                        name: "FK_BookingPaymentShares_Bookings_BookingId",
                        column: x => x.BookingId,
                        principalTable: "Bookings",
                        principalColumn: "BookingId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BookingPaymentShares_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CheckIns",
                columns: table => new
                {
                    CheckInId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BookingId = table.Column<int>(type: "int", nullable: false),
                    StaffId = table.Column<int>(type: "int", nullable: false),
                    CheckInTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CheckOutTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CheckIns", x => x.CheckInId);
                    table.ForeignKey(
                        name: "FK_CheckIns_Bookings_BookingId",
                        column: x => x.BookingId,
                        principalTable: "Bookings",
                        principalColumn: "BookingId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CheckIns_Users_StaffId",
                        column: x => x.StaffId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "Matches",
                columns: table => new
                {
                    MatchId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HostId = table.Column<int>(type: "int", nullable: false),
                    CourtId = table.Column<int>(type: "int", nullable: false),
                    BookingId = table.Column<int>(type: "int", nullable: true),
                    MatchDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    StartTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    EndTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    MaxParticipants = table.Column<int>(type: "int", nullable: false),
                    CurrentParticipants = table.Column<int>(type: "int", nullable: false),
                    EscrowAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "Open"),
                    LevelRequirement = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Matches", x => x.MatchId);
                    table.CheckConstraint("CK_Matches_Status", "[Status] IN ('Open','Closed','Completed','Cancelled')");
                    table.ForeignKey(
                        name: "FK_Matches_Bookings_BookingId",
                        column: x => x.BookingId,
                        principalTable: "Bookings",
                        principalColumn: "BookingId");
                    table.ForeignKey(
                        name: "FK_Matches_Courts_CourtId",
                        column: x => x.CourtId,
                        principalTable: "Courts",
                        principalColumn: "CourtId");
                    table.ForeignKey(
                        name: "FK_Matches_Users_HostId",
                        column: x => x.HostId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "MatchMembers",
                columns: table => new
                {
                    MatchParticipantId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MatchId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "Joiner"),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "Pending"),
                    HasPaidEscrow = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MatchMembers", x => x.MatchParticipantId);
                    table.ForeignKey(
                        name: "FK_MatchMembers_Matches_MatchId",
                        column: x => x.MatchId,
                        principalTable: "Matches",
                        principalColumn: "MatchId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MatchMembers_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "MatchResults",
                columns: table => new
                {
                    MatchResultId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MatchId = table.Column<int>(type: "int", nullable: false),
                    WinnerUserId = table.Column<int>(type: "int", nullable: true),
                    LoserUserId = table.Column<int>(type: "int", nullable: true),
                    ReportedByUserId = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    TeamAScore = table.Column<int>(type: "int", nullable: true),
                    TeamBScore = table.Column<int>(type: "int", nullable: true),
                    ConfirmedByUserId = table.Column<int>(type: "int", nullable: true),
                    ConfirmedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DisputeReason = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    DisputedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MatchResults", x => x.MatchResultId);
                    table.ForeignKey(
                        name: "FK_MatchResults_Matches_MatchId",
                        column: x => x.MatchId,
                        principalTable: "Matches",
                        principalColumn: "MatchId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MatchResults_Users_ConfirmedByUserId",
                        column: x => x.ConfirmedByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                    table.ForeignKey(
                        name: "FK_MatchResults_Users_ReportedByUserId",
                        column: x => x.ReportedByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MatchResults_Users_WinnerUserId",
                        column: x => x.WinnerUserId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "PlayerRatings",
                columns: table => new
                {
                    PlayerRatingId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RaterId = table.Column<int>(type: "int", nullable: false),
                    RatedUserId = table.Column<int>(type: "int", nullable: false),
                    MatchId = table.Column<int>(type: "int", nullable: false),
                    Score = table.Column<int>(type: "int", nullable: false),
                    Comment = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlayerRatings", x => x.PlayerRatingId);
                    table.ForeignKey(
                        name: "FK_PlayerRatings_Matches_MatchId",
                        column: x => x.MatchId,
                        principalTable: "Matches",
                        principalColumn: "MatchId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PlayerRatings_Users_RatedUserId",
                        column: x => x.RatedUserId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                    table.ForeignKey(
                        name: "FK_PlayerRatings_Users_RaterId",
                        column: x => x.RaterId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "Reports",
                columns: table => new
                {
                    ReportId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReporterId = table.Column<int>(type: "int", nullable: false),
                    ReportedUserId = table.Column<int>(type: "int", nullable: false),
                    MatchId = table.Column<int>(type: "int", nullable: false),
                    Reason = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Evidence = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "Pending"),
                    AdminNote = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    ResolvedByAdminId = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reports", x => x.ReportId);
                    table.ForeignKey(
                        name: "FK_Reports_Matches_MatchId",
                        column: x => x.MatchId,
                        principalTable: "Matches",
                        principalColumn: "MatchId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Reports_Users_ReportedUserId",
                        column: x => x.ReportedUserId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                    table.ForeignKey(
                        name: "FK_Reports_Users_ReporterId",
                        column: x => x.ReporterId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                    table.ForeignKey(
                        name: "FK_Reports_Users_ResolvedByAdminId",
                        column: x => x.ResolvedByAdminId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "Transactions",
                columns: table => new
                {
                    TransactionId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EscrowWalletId = table.Column<int>(type: "int", nullable: false),
                    BookingId = table.Column<int>(type: "int", nullable: true),
                    MatchId = table.Column<int>(type: "int", nullable: true),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "Pending"),
                    ReferenceId = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Transactions", x => x.TransactionId);
                    table.ForeignKey(
                        name: "FK_Transactions_Bookings_BookingId",
                        column: x => x.BookingId,
                        principalTable: "Bookings",
                        principalColumn: "BookingId");
                    table.ForeignKey(
                        name: "FK_Transactions_EscrowWallets_EscrowWalletId",
                        column: x => x.EscrowWalletId,
                        principalTable: "EscrowWallets",
                        principalColumn: "EscrowWalletId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Transactions_Matches_MatchId",
                        column: x => x.MatchId,
                        principalTable: "Matches",
                        principalColumn: "MatchId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TournamentRegistrations",
                columns: table => new
                {
                    TournamentRegistrationId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TournamentId = table.Column<int>(type: "int", nullable: false),
                    CaptainUserId = table.Column<int>(type: "int", nullable: false),
                    TeamName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    EntryFeePaid = table.Column<bool>(type: "bit", nullable: false),
                    PaymentTransactionId = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TournamentRegistrations", x => x.TournamentRegistrationId);
                    table.ForeignKey(
                        name: "FK_TournamentRegistrations_Tournaments_TournamentId",
                        column: x => x.TournamentId,
                        principalTable: "Tournaments",
                        principalColumn: "TournamentId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TournamentRegistrations_Transactions_PaymentTransactionId",
                        column: x => x.PaymentTransactionId,
                        principalTable: "Transactions",
                        principalColumn: "TransactionId");
                    table.ForeignKey(
                        name: "FK_TournamentRegistrations_Users_CaptainUserId",
                        column: x => x.CaptainUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Complexes",
                columns: new[] { "ComplexId", "Address", "ClosingTime", "CreatedAt", "Description", "Email", "IsDeleted", "LogoUrl", "Name", "OpeningTime", "Phone", "SlotDurationMinutes", "Status", "UpdatedAt" },
                values: new object[] { 1, "123 Nguyễn Văn Linh, Quận 7, TP.HCM", new TimeSpan(0, 23, 0, 0, 0), new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Tổ hợp thể thao cầu lông và pickleball hiện đại nhất khu vực.", "contact@prosport-q7.vn", false, null, "Pro-Sport Complex Quận 7", new TimeSpan(0, 5, 0, 0, 0), "0912345678", 60, "Active", null });

            migrationBuilder.InsertData(
                table: "CourtTypes",
                columns: new[] { "CourtTypeId", "CreatedAt", "Description", "IsDeleted", "Name", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Sân cầu lông tiêu chuẩn", false, "Badminton", null },
                    { 2, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Sân Pickleball tiêu chuẩn", false, "Pickleball", null }
                });

            migrationBuilder.InsertData(
                table: "EquipmentCategories",
                columns: new[] { "EquipmentCategoryId", "CreatedAt", "Description", "IsDeleted", "Name", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Tất cả các loại vợt", false, "Racket", null },
                    { 2, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Giày thể thao", false, "Footwear", null },
                    { 3, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Trang phục thể thao", false, "Apparel", null },
                    { 4, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Bóng và cầu lông", false, "Ball / Birdie", null },
                    { 5, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Phụ kiện", false, "Accessories", null },
                    { 6, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Đồ bảo hộ", false, "Protection", null }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "UserId", "AvatarUrl", "CreatedAt", "EKycStatus", "Email", "FullName", "GoogleId", "IsPhoneVerified", "PasswordHash", "PhoneNumber", "Role", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Verified", "admin@prosport.vn", "System Admin", null, true, "$2a$11$8wyDirTdDhyqTcM3BAde4uiu1da5NulhpGioT7g4ONIT3RcG6f5a2", "0900000001", "Admin", null },
                    { 2, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Verified", "staff1@prosport.vn", "Nguyễn Văn Staff", null, true, "$2a$11$8wyDirTdDhyqTcM3BAde4uiu1da5NulhpGioT7g4ONIT3RcG6f5a2", "0900000002", "Staff", null },
                    { 3, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Verified", "staff2@prosport.vn", "Trần Thị Staff", null, true, "$2a$11$8wyDirTdDhyqTcM3BAde4uiu1da5NulhpGioT7g4ONIT3RcG6f5a2", "0900000003", "Staff", null },
                    { 4, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Verified", "customer1@prosport.vn", "Lê Văn Cường", null, true, "$2a$11$8wyDirTdDhyqTcM3BAde4uiu1da5NulhpGioT7g4ONIT3RcG6f5a2", "0900000004", "Customer", null },
                    { 5, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Verified", "customer2@prosport.vn", "Phạm Thị Dung", null, true, "$2a$11$8wyDirTdDhyqTcM3BAde4uiu1da5NulhpGioT7g4ONIT3RcG6f5a2", "0900000005", "Customer", null },
                    { 6, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Pending", "customer3@prosport.vn", "Hoàng Văn Em", null, true, "$2a$11$8wyDirTdDhyqTcM3BAde4uiu1da5NulhpGioT7g4ONIT3RcG6f5a2", "0900000006", "Customer", null },
                    { 7, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Verified", "customer4@prosport.vn", "Võ Thị Phượng", null, true, "$2a$11$8wyDirTdDhyqTcM3BAde4uiu1da5NulhpGioT7g4ONIT3RcG6f5a2", "0900000007", "Customer", null }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "UserId", "AvatarUrl", "CreatedAt", "EKycStatus", "Email", "FullName", "GoogleId", "PasswordHash", "PhoneNumber", "Role", "UpdatedAt" },
                values: new object[] { 8, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Unverified", "customer5@prosport.vn", "Đặng Văn Giang", null, "$2a$11$8wyDirTdDhyqTcM3BAde4uiu1da5NulhpGioT7g4ONIT3RcG6f5a2", "0900000008", "Customer", null });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "UserId", "AvatarUrl", "CreatedAt", "EKycStatus", "Email", "FullName", "GoogleId", "IsLocked", "IsPhoneVerified", "PasswordHash", "PhoneNumber", "Role", "UpdatedAt" },
                values: new object[] { 9, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Verified", "customer6@prosport.vn", "Bùi Thị Hoa", null, true, true, "$2a$11$8wyDirTdDhyqTcM3BAde4uiu1da5NulhpGioT7g4ONIT3RcG6f5a2", "0900000009", "Customer", null });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "UserId", "AvatarUrl", "CreatedAt", "EKycStatus", "Email", "FullName", "GoogleId", "IsPhoneVerified", "PasswordHash", "PhoneNumber", "Role", "UpdatedAt" },
                values: new object[] { 10, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Verified", "customer7@prosport.vn", "Đỗ Văn Inh", null, true, "$2a$11$8wyDirTdDhyqTcM3BAde4uiu1da5NulhpGioT7g4ONIT3RcG6f5a2", "0900000010", "Customer", null });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "UserId", "AvatarUrl", "CreatedAt", "EKycStatus", "Email", "FullName", "GoogleId", "PasswordHash", "PhoneNumber", "Role", "UpdatedAt" },
                values: new object[] { 11, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Unverified", "walkin@prosport.vn", "Khách lẻ Walk-in", null, "$2a$11$8wyDirTdDhyqTcM3BAde4uiu1da5NulhpGioT7g4ONIT3RcG6f5a2", "0900000099", "Customer", null });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "UserId", "AvatarUrl", "CreatedAt", "EKycStatus", "Email", "FullName", "GoogleId", "IsPhoneVerified", "PasswordHash", "PhoneNumber", "Role", "UpdatedAt" },
                values: new object[] { 12, null, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Verified", "courtowner@prosport.vn", "Chủ Sân Demo", null, true, "$2a$11$8wyDirTdDhyqTcM3BAde4uiu1da5NulhpGioT7g4ONIT3RcG6f5a2", "0900000012", "CourtOwner", null });

            migrationBuilder.InsertData(
                table: "ComplexOwners",
                columns: new[] { "ComplexOwnerId", "ApprovedByAdminId", "ComplexId", "CreatedAt", "IsDeleted", "IsPrimary", "Status", "UpdatedAt", "UserId" },
                values: new object[] { 1, 1, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, true, "Active", null, 12 });

            migrationBuilder.InsertData(
                table: "Courts",
                columns: new[] { "CourtId", "Code", "ComplexId", "CourtTypeId", "CreatedAt", "Description", "ImageUrl", "IsDeleted", "Name", "Status", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, null, 1, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Sân thảm PVC Yonex cao cấp", "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600", false, "Sân Cầu Lông A1", "Available", null },
                    { 2, null, 1, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Sân thảm PVC Yonex cao cấp", "https://images.unsplash.com/photo-1517649763962-0c62306601b7?w=600", false, "Sân Cầu Lông A2", "Available", null },
                    { 3, null, 1, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Sân thảm gỗ cao cấp", "https://images.unsplash.com/photo-1521537634581-227f84850b41?w=600", false, "Sân Cầu Lông A3", "Available", null },
                    { 4, null, 1, 2, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Sân ngoài trời tiêu chuẩn Mỹ", "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600", false, "Sân Pickleball P1", "Available", null },
                    { 5, null, 1, 2, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Sân ngoài trời tiêu chuẩn Mỹ", "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=600", false, "Sân Pickleball P2", "Available", null }
                });

            migrationBuilder.InsertData(
                table: "Equipments",
                columns: new[] { "EquipmentId", "Category", "CreatedAt", "Description", "EquipmentCategoryId", "EquipmentName", "ImageUrl", "IsDeleted", "Name", "RetailPrice", "SportType", "Status", "StockQuantity", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, "Racket", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Vợt tấn công nặng đầu, cân bằng 4U, phù hợp người chơi trung bình đến nâng cao.", 1, "Vợt Yonex Astrox 88D", "https://images.unsplash.com/photo-1617083934551-1af7da84de49?w=400&q=80", false, "Vợt Yonex Astrox 88D", 6000000m, "Badminton", "Available", 5, null },
                    { 2, "Racket", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Vợt siêu nhẹ, tốc độ cao, lý tưởng cho người mới bắt đầu và đánh đôi.", 1, "Vợt Lining Windstorm 72", "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80", false, "Vợt Lining Windstorm 72", 4000000m, "Badminton", "Available", 8, null },
                    { 3, "Racket", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Vợt công thủ toàn diện, độ cứng vừa phải, kiểm soát tốt.", 1, "Vợt Victor Thruster K Falcon", "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80", false, "Vợt Victor Thruster K Falcon", 5500000m, "Badminton", "Available", 4, null },
                    { 4, "Racket", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Vợt polymer core FiberFlex, cân bằng giữa sức mạnh và kiểm soát bóng.", 1, "Vợt Selkirk AMPED Epic", "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&q=80", false, "Vợt Selkirk AMPED Epic", 7000000m, "Pickleball", "Available", 4, null },
                    { 5, "Footwear", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Giày cầu lông Power Cushion, đệm gót êm, bám sân tốt.", 2, "Giày Yonex Power Cushion 65Z3", "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80", false, "Giày Yonex Power Cushion 65Z3", 3200000m, "Badminton", "Available", 6, null },
                    { 6, "Footwear", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Giày cầu lông nhẹ, thoáng khí, phù hợp tập luyện và thi đấu phong trào.", 2, "Giày Victor A610 III", "https://images.unsplash.com/photo-1606107557195-0a394bbe4a5d?w=400&q=80", false, "Giày Victor A610 III", 2400000m, "Badminton", "Available", 8, null },
                    { 7, "Footwear", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Giày đa năng cho sân trong nhà, đế cao su bám tốt, hỗ trợ cổ chân ổn định.", 2, "Giày Asics Gel-Rocket 11", "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&q=80", false, "Giày Asics Gel-Rocket 11", 2800000m, "Pickleball", "Available", 5, null },
                    { 8, "Apparel", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Áo thun thi đấu thoáng mát, thấm hút mồ hôi, form regular fit.", 3, "Áo thi đấu Yonex Tournament", "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80", false, "Áo thi đấu Yonex Tournament", 650000m, "Badminton", "Available", 15, null },
                    { 9, "Apparel", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Quần short co giãn 4 chiều, khô nhanh, phù hợp tập luyện và thi đấu.", 3, "Quần short thể thao Pro-Sport DryFit", "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&q=80", false, "Quần short thể thao Pro-Sport DryFit", 450000m, "Badminton", "Available", 12, null },
                    { 10, "Apparel", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Áo khoác chống gió nhẹ, có mũ trùm đầu, dễ gấp gọn mang theo.", 3, "Áo khoác gió thể thao Pro-Sport", "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&q=80", false, "Áo khoác gió thể thao Pro-Sport", 890000m, "Pickleball", "Available", 10, null },
                    { 11, "Ball / Birdie", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Cầu nhựa tập luyện bền, quỹ đạo ổn định, phù hợp sân trong nhà.", 4, "Cầu lông nhựa Yonex Mavis 350 (ống 6 quả)", "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80", false, "Cầu lông nhựa Yonex Mavis 350 (ống 6 quả)", 280000m, "Badminton", "Available", 25, null },
                    { 12, "Ball / Birdie", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Cầu lông thi đấu cao cấp, lông ngỗng tự nhiên, độ bền và cảm giác đánh tốt.", 4, "Cầu lông lông ngỗng Yonex AS-50 (hộp 12 quả)", "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&q=80", false, "Cầu lông lông ngỗng Yonex AS-50 (hộp 12 quả)", 1200000m, "Badminton", "Available", 10, null },
                    { 13, "Ball / Birdie", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Bóng pickleball trong nhà, lỗ 40, độ nảy đồng đều, chuẩn thi đấu.", 4, "Bóng Pickleball Franklin X-40 (hộp 6 quả)", "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&q=80", false, "Bóng Pickleball Franklin X-40 (hộp 6 quả)", 350000m, "Pickleball", "Available", 20, null },
                    { 14, "Ball / Birdie", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Bóng pickleball ngoài trời, bền, ít vỡ, phù hợp sân cứng.", 4, "Bóng Pickleball Onix Fuse G2 (hộp 6 quả)", "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=400&q=80", false, "Bóng Pickleball Onix Fuse G2 (hộp 6 quả)", 420000m, "Pickleball", "Available", 15, null },
                    { 15, "Accessories", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Quấn cán thấm mồ hôi, mềm, tăng độ bám khi cầm vợt lâu.", 5, "Quấn cán vợt Yonex Super Grap (3 cuộn)", "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80", false, "Quấn cán vợt Yonex Super Grap (3 cuộn)", 180000m, "Badminton", "Available", 30, null },
                    { 16, "Accessories", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Túi vợt 6 ngăn có ngăn giày riêng, chống nước nhẹ.", 5, "Túi đựng vợt 6 ngăn Yonex Pro", "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80", false, "Túi đựng vợt 6 ngăn Yonex Pro", 2100000m, "Badminton", "Available", 5, null },
                    { 17, "Accessories", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Băng tay co giãn, thấm mồ hôi, giữ khô tay khi thi đấu.", 5, "Băng cổ tay thấm mồ hôi (bộ 2)", "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80", false, "Băng cổ tay thấm mồ hôi (bộ 2)", 120000m, "Badminton", "Available", 25, null },
                    { 18, "Protection", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Băng gối hỗ trợ khớp, co giãn, giảm chấn khi di chuyển đột ngột.", 6, "Băng gối thể thao neoprene", "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80", false, "Băng gối thể thao neoprene", 320000m, "Badminton", "Available", 10, null },
                    { 19, "Protection", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Băng cổ chân cố định khớp, phòng tránh trẹo cổ chân khi thi đấu.", 6, "Băng cổ chân thể thao", "https://images.unsplash.com/photo-1518310383802-640c2b31135a?w=400&q=80", false, "Băng cổ chân thể thao", 250000m, "Badminton", "Available", 12, null },
                    { 20, "Protection", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Kính chống va đập, chống sương mù, bảo vệ mắt khi đánh gần lưới.", 6, "Kính bảo hộ Pickleball Pro-Sport", "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&q=80", false, "Kính bảo hộ Pickleball Pro-Sport", 480000m, "Pickleball", "Available", 8, null }
                });

            migrationBuilder.InsertData(
                table: "PricingRules",
                columns: new[] { "PricingRuleId", "ComplexId", "CourtId", "CourtTypeId", "CreatedAt", "DayOfWeek", "EndTime", "IsDeleted", "Multiplier", "PricePerHour", "RuleType", "StartTime", "Status", "UpdatedAt", "ValidFrom", "ValidTo" },
                values: new object[,]
                {
                    { 1, null, null, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new TimeSpan(0, 17, 0, 0, 0), false, null, 80000m, "BasePrice", new TimeSpan(0, 5, 0, 0, 0), "Active", null, null, null },
                    { 2, null, null, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new TimeSpan(0, 22, 0, 0, 0), false, null, 120000m, "BasePrice", new TimeSpan(0, 17, 0, 0, 0), "Active", null, null, null }
                });

            migrationBuilder.InsertData(
                table: "PricingRules",
                columns: new[] { "PricingRuleId", "ComplexId", "CourtId", "CourtTypeId", "CreatedAt", "DayOfWeek", "EndTime", "IsDeleted", "IsWeekend", "Multiplier", "PricePerHour", "RuleType", "StartTime", "Status", "UpdatedAt", "ValidFrom", "ValidTo" },
                values: new object[] { 3, null, null, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new TimeSpan(0, 22, 0, 0, 0), false, true, null, 140000m, "BasePrice", new TimeSpan(0, 5, 0, 0, 0), "Active", null, null, null });

            migrationBuilder.InsertData(
                table: "PricingRules",
                columns: new[] { "PricingRuleId", "ComplexId", "CourtId", "CourtTypeId", "CreatedAt", "DayOfWeek", "EndTime", "IsDeleted", "Multiplier", "PricePerHour", "RuleType", "StartTime", "Status", "UpdatedAt", "ValidFrom", "ValidTo" },
                values: new object[,]
                {
                    { 4, null, null, 2, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new TimeSpan(0, 17, 0, 0, 0), false, null, 100000m, "BasePrice", new TimeSpan(0, 5, 0, 0, 0), "Active", null, null, null },
                    { 5, null, null, 2, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new TimeSpan(0, 22, 0, 0, 0), false, null, 150000m, "BasePrice", new TimeSpan(0, 17, 0, 0, 0), "Active", null, null, null }
                });

            migrationBuilder.InsertData(
                table: "PricingRules",
                columns: new[] { "PricingRuleId", "ComplexId", "CourtId", "CourtTypeId", "CreatedAt", "DayOfWeek", "EndTime", "IsDeleted", "IsWeekend", "Multiplier", "PricePerHour", "RuleType", "StartTime", "Status", "UpdatedAt", "ValidFrom", "ValidTo" },
                values: new object[] { 6, null, null, 2, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, new TimeSpan(0, 22, 0, 0, 0), false, true, null, 180000m, "BasePrice", new TimeSpan(0, 5, 0, 0, 0), "Active", null, null, null });

            migrationBuilder.InsertData(
                table: "StaffAssignments",
                columns: new[] { "StaffAssignmentId", "AssignedByUserId", "CanCheckIn", "CanCreateWalkIn", "ComplexId", "CreatedAt", "IsDeleted", "StaffUserId", "Status", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, 12, true, true, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, 2, "Active", null },
                    { 2, 12, true, true, 1, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, 3, "Active", null }
                });

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_ComplexId",
                table: "AuditLogs",
                column: "ComplexId");

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_CreatedAt",
                table: "AuditLogs",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_BookingDetails_BookingId",
                table: "BookingDetails",
                column: "BookingId");

            migrationBuilder.CreateIndex(
                name: "IX_BookingDetails_CourtId_BookingDate",
                table: "BookingDetails",
                columns: new[] { "CourtId", "BookingDate" });

            migrationBuilder.CreateIndex(
                name: "IX_BookingPaymentShares_BookingId_UserId",
                table: "BookingPaymentShares",
                columns: new[] { "BookingId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_BookingPaymentShares_UserId",
                table: "BookingPaymentShares",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_CheckInCode",
                table: "Bookings",
                column: "CheckInCode",
                unique: true,
                filter: "[CheckInCode] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_CreatedAt",
                table: "Bookings",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_RecurringRuleId",
                table: "Bookings",
                column: "RecurringRuleId");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_Status_IsDeleted",
                table: "Bookings",
                columns: new[] { "Status", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_UserId",
                table: "Bookings",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_CartItems_EquipmentId",
                table: "CartItems",
                column: "EquipmentId");

            migrationBuilder.CreateIndex(
                name: "IX_CartItems_UserId",
                table: "CartItems",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ChatHistories_UserId",
                table: "ChatHistories",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_CheckIns_BookingId",
                table: "CheckIns",
                column: "BookingId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CheckIns_StaffId",
                table: "CheckIns",
                column: "StaffId");

            migrationBuilder.CreateIndex(
                name: "IX_ComplexCancellationPolicies_ComplexId",
                table: "ComplexCancellationPolicies",
                column: "ComplexId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ComplexClosures_ComplexId_ClosureDate",
                table: "ComplexClosures",
                columns: new[] { "ComplexId", "ClosureDate" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ComplexMaintenanceWindows_ComplexId",
                table: "ComplexMaintenanceWindows",
                column: "ComplexId");

            migrationBuilder.CreateIndex(
                name: "IX_ComplexMaintenanceWindows_CourtId",
                table: "ComplexMaintenanceWindows",
                column: "CourtId");

            migrationBuilder.CreateIndex(
                name: "IX_ComplexOperatingSchedules_ComplexId_DayOfWeek",
                table: "ComplexOperatingSchedules",
                columns: new[] { "ComplexId", "DayOfWeek" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ComplexOwners_ApprovedByAdminId",
                table: "ComplexOwners",
                column: "ApprovedByAdminId");

            migrationBuilder.CreateIndex(
                name: "IX_ComplexOwners_ComplexId",
                table: "ComplexOwners",
                column: "ComplexId");

            migrationBuilder.CreateIndex(
                name: "IX_ComplexOwners_UserId_ComplexId",
                table: "ComplexOwners",
                columns: new[] { "UserId", "ComplexId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ComplexReviews_ComplexId_UserId",
                table: "ComplexReviews",
                columns: new[] { "ComplexId", "UserId" },
                unique: true,
                filter: "[IsDeleted] = 0");

            migrationBuilder.CreateIndex(
                name: "IX_ComplexReviews_UserId",
                table: "ComplexReviews",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Courts_ComplexId_Code",
                table: "Courts",
                columns: new[] { "ComplexId", "Code" },
                unique: true,
                filter: "[Code] IS NOT NULL AND [IsDeleted] = 0");

            migrationBuilder.CreateIndex(
                name: "IX_Courts_ComplexId_IsDeleted",
                table: "Courts",
                columns: new[] { "ComplexId", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_Courts_CourtTypeId",
                table: "Courts",
                column: "CourtTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_EkycProfiles_IdentityNumber",
                table: "EkycProfiles",
                column: "IdentityNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_EkycProfiles_UserId",
                table: "EkycProfiles",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Equipments_EquipmentCategoryId",
                table: "Equipments",
                column: "EquipmentCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_EscrowWallets_UserId",
                table: "EscrowWallets",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_InventoryTransactions_EquipmentId",
                table: "InventoryTransactions",
                column: "EquipmentId");

            migrationBuilder.CreateIndex(
                name: "IX_InventoryTransactions_UserId",
                table: "InventoryTransactions",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_BookingId",
                table: "Matches",
                column: "BookingId");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_CourtId",
                table: "Matches",
                column: "CourtId");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_HostId",
                table: "Matches",
                column: "HostId");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_Status",
                table: "Matches",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_MatchMembers_MatchId_UserId",
                table: "MatchMembers",
                columns: new[] { "MatchId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MatchMembers_UserId",
                table: "MatchMembers",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_MatchResults_ConfirmedByUserId",
                table: "MatchResults",
                column: "ConfirmedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_MatchResults_MatchId",
                table: "MatchResults",
                column: "MatchId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MatchResults_ReportedByUserId",
                table: "MatchResults",
                column: "ReportedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_MatchResults_WinnerUserId",
                table: "MatchResults",
                column: "WinnerUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Memberships_ComplexId",
                table: "Memberships",
                column: "ComplexId");

            migrationBuilder.CreateIndex(
                name: "IX_Memberships_UserId",
                table: "Memberships",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_OtpCodes_UserId_Type_IsUsed_ExpiryTime",
                table: "OtpCodes",
                columns: new[] { "UserId", "Type", "IsUsed", "ExpiryTime" });

            migrationBuilder.CreateIndex(
                name: "IX_PlayerRatings_MatchId",
                table: "PlayerRatings",
                column: "MatchId");

            migrationBuilder.CreateIndex(
                name: "IX_PlayerRatings_RatedUserId",
                table: "PlayerRatings",
                column: "RatedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_PlayerRatings_RaterId_RatedUserId_MatchId",
                table: "PlayerRatings",
                columns: new[] { "RaterId", "RatedUserId", "MatchId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PricingRules_CourtId",
                table: "PricingRules",
                column: "CourtId");

            migrationBuilder.CreateIndex(
                name: "IX_PricingRules_CourtTypeId",
                table: "PricingRules",
                column: "CourtTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductStocks_ComplexId_Sku",
                table: "ProductStocks",
                columns: new[] { "ComplexId", "Sku" },
                unique: true,
                filter: "[IsDeleted] = 0");

            migrationBuilder.CreateIndex(
                name: "IX_RecurringBookingRules_CourtId",
                table: "RecurringBookingRules",
                column: "CourtId");

            migrationBuilder.CreateIndex(
                name: "IX_RecurringBookingRules_UserId",
                table: "RecurringBookingRules",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Reports_MatchId",
                table: "Reports",
                column: "MatchId");

            migrationBuilder.CreateIndex(
                name: "IX_Reports_ReportedUserId",
                table: "Reports",
                column: "ReportedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Reports_ReporterId",
                table: "Reports",
                column: "ReporterId");

            migrationBuilder.CreateIndex(
                name: "IX_Reports_ResolvedByAdminId",
                table: "Reports",
                column: "ResolvedByAdminId");

            migrationBuilder.CreateIndex(
                name: "IX_StaffAssignments_AssignedByUserId",
                table: "StaffAssignments",
                column: "AssignedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_StaffAssignments_ComplexId",
                table: "StaffAssignments",
                column: "ComplexId");

            migrationBuilder.CreateIndex(
                name: "IX_StaffAssignments_StaffUserId_ComplexId",
                table: "StaffAssignments",
                columns: new[] { "StaffUserId", "ComplexId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TournamentRegistrations_CaptainUserId",
                table: "TournamentRegistrations",
                column: "CaptainUserId");

            migrationBuilder.CreateIndex(
                name: "IX_TournamentRegistrations_PaymentTransactionId",
                table: "TournamentRegistrations",
                column: "PaymentTransactionId");

            migrationBuilder.CreateIndex(
                name: "IX_TournamentRegistrations_TournamentId_CaptainUserId",
                table: "TournamentRegistrations",
                columns: new[] { "TournamentId", "CaptainUserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tournaments_ComplexId",
                table: "Tournaments",
                column: "ComplexId");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_BookingId",
                table: "Transactions",
                column: "BookingId");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_EscrowWalletId",
                table: "Transactions",
                column: "EscrowWalletId");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_MatchId",
                table: "Transactions",
                column: "MatchId");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_ReferenceId",
                table: "Transactions",
                column: "ReferenceId",
                unique: true,
                filter: "[ReferenceId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_GoogleId",
                table: "Users",
                column: "GoogleId",
                unique: true,
                filter: "[GoogleId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Users_PhoneNumber",
                table: "Users",
                column: "PhoneNumber",
                unique: true,
                filter: "[PhoneNumber] IS NOT NULL AND [IsDeleted] = 0");

            migrationBuilder.CreateIndex(
                name: "IX_UserSkillRatings_UserId_SportType",
                table: "UserSkillRatings",
                columns: new[] { "UserId", "SportType" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Vouchers_ApplicableComplexId",
                table: "Vouchers",
                column: "ApplicableComplexId");

            migrationBuilder.CreateIndex(
                name: "IX_Vouchers_ApplicableProductId",
                table: "Vouchers",
                column: "ApplicableProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Vouchers_Code",
                table: "Vouchers",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Vouchers_CreatedByStaffId",
                table: "Vouchers",
                column: "CreatedByStaffId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AuditLogs");

            migrationBuilder.DropTable(
                name: "BookingDetails");

            migrationBuilder.DropTable(
                name: "BookingPaymentShares");

            migrationBuilder.DropTable(
                name: "CartItems");

            migrationBuilder.DropTable(
                name: "ChatHistories");

            migrationBuilder.DropTable(
                name: "CheckIns");

            migrationBuilder.DropTable(
                name: "ComplexCancellationPolicies");

            migrationBuilder.DropTable(
                name: "ComplexClosures");

            migrationBuilder.DropTable(
                name: "ComplexMaintenanceWindows");

            migrationBuilder.DropTable(
                name: "ComplexOperatingSchedules");

            migrationBuilder.DropTable(
                name: "ComplexOwners");

            migrationBuilder.DropTable(
                name: "ComplexReviews");

            migrationBuilder.DropTable(
                name: "EkycProfiles");

            migrationBuilder.DropTable(
                name: "InventoryTransactions");

            migrationBuilder.DropTable(
                name: "MatchMembers");

            migrationBuilder.DropTable(
                name: "MatchResults");

            migrationBuilder.DropTable(
                name: "Memberships");

            migrationBuilder.DropTable(
                name: "OtpCodes");

            migrationBuilder.DropTable(
                name: "PlayerRatings");

            migrationBuilder.DropTable(
                name: "PricingRules");

            migrationBuilder.DropTable(
                name: "Reports");

            migrationBuilder.DropTable(
                name: "StaffAssignments");

            migrationBuilder.DropTable(
                name: "TournamentRegistrations");

            migrationBuilder.DropTable(
                name: "UserSkillRatings");

            migrationBuilder.DropTable(
                name: "Vouchers");

            migrationBuilder.DropTable(
                name: "Equipments");

            migrationBuilder.DropTable(
                name: "Tournaments");

            migrationBuilder.DropTable(
                name: "Transactions");

            migrationBuilder.DropTable(
                name: "ProductStocks");

            migrationBuilder.DropTable(
                name: "EquipmentCategories");

            migrationBuilder.DropTable(
                name: "EscrowWallets");

            migrationBuilder.DropTable(
                name: "Matches");

            migrationBuilder.DropTable(
                name: "Bookings");

            migrationBuilder.DropTable(
                name: "RecurringBookingRules");

            migrationBuilder.DropTable(
                name: "Courts");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Complexes");

            migrationBuilder.DropTable(
                name: "CourtTypes");
        }
    }
}
