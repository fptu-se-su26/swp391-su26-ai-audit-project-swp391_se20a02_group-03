using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProSport.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddOwnerTask3InventoryRental : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ApplicableComplexId",
                table: "Vouchers",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ApplicableProductId",
                table: "Vouchers",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Vouchers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "VoucherType",
                table: "Vouchers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

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
                name: "RentalSessions",
                columns: table => new
                {
                    RentalSessionId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ComplexId = table.Column<int>(type: "int", nullable: false),
                    BookingId = table.Column<int>(type: "int", nullable: true),
                    CustomerUserId = table.Column<int>(type: "int", nullable: false),
                    StaffUserId = table.Column<int>(type: "int", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RentalFee = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    SurchargeTotal = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CompletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RentalSessions", x => x.RentalSessionId);
                    table.ForeignKey(
                        name: "FK_RentalSessions_Bookings_BookingId",
                        column: x => x.BookingId,
                        principalTable: "Bookings",
                        principalColumn: "BookingId");
                    table.ForeignKey(
                        name: "FK_RentalSessions_Complexes_ComplexId",
                        column: x => x.ComplexId,
                        principalTable: "Complexes",
                        principalColumn: "ComplexId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RentalSessions_Users_CustomerUserId",
                        column: x => x.CustomerUserId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                    table.ForeignKey(
                        name: "FK_RentalSessions_Users_StaffUserId",
                        column: x => x.StaffUserId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "RentalAssets",
                columns: table => new
                {
                    RentalAssetId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ComplexId = table.Column<int>(type: "int", nullable: false),
                    ProductStockId = table.Column<int>(type: "int", nullable: false),
                    AssetCode = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Condition = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RentCount = table.Column<int>(type: "int", nullable: false),
                    LastConditionCheck = table.Column<DateTime>(type: "datetime2", nullable: true),
                    MaintenanceNote = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RentalAssets", x => x.RentalAssetId);
                    table.ForeignKey(
                        name: "FK_RentalAssets_Complexes_ComplexId",
                        column: x => x.ComplexId,
                        principalTable: "Complexes",
                        principalColumn: "ComplexId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RentalAssets_ProductStocks_ProductStockId",
                        column: x => x.ProductStockId,
                        principalTable: "ProductStocks",
                        principalColumn: "ProductStockId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "RentalSurcharges",
                columns: table => new
                {
                    RentalSurchargeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RentalSessionId = table.Column<int>(type: "int", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Reason = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AppliedByUserId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RentalSurcharges", x => x.RentalSurchargeId);
                    table.ForeignKey(
                        name: "FK_RentalSurcharges_RentalSessions_RentalSessionId",
                        column: x => x.RentalSessionId,
                        principalTable: "RentalSessions",
                        principalColumn: "RentalSessionId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RentalSurcharges_Users_AppliedByUserId",
                        column: x => x.AppliedByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "ConditionChecks",
                columns: table => new
                {
                    ConditionCheckId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RentalSessionId = table.Column<int>(type: "int", nullable: false),
                    RentalAssetId = table.Column<int>(type: "int", nullable: false),
                    CheckType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Condition = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ImageUrls = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StaffUserId = table.Column<int>(type: "int", nullable: false),
                    IsFinal = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConditionChecks", x => x.ConditionCheckId);
                    table.ForeignKey(
                        name: "FK_ConditionChecks_RentalAssets_RentalAssetId",
                        column: x => x.RentalAssetId,
                        principalTable: "RentalAssets",
                        principalColumn: "RentalAssetId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ConditionChecks_RentalSessions_RentalSessionId",
                        column: x => x.RentalSessionId,
                        principalTable: "RentalSessions",
                        principalColumn: "RentalSessionId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ConditionChecks_Users_StaffUserId",
                        column: x => x.StaffUserId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "RentalSessionAssets",
                columns: table => new
                {
                    RentalSessionAssetId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RentalSessionId = table.Column<int>(type: "int", nullable: false),
                    RentalAssetId = table.Column<int>(type: "int", nullable: false),
                    BeforeCondition = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AfterCondition = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RentalSessionAssets", x => x.RentalSessionAssetId);
                    table.ForeignKey(
                        name: "FK_RentalSessionAssets_RentalAssets_RentalAssetId",
                        column: x => x.RentalAssetId,
                        principalTable: "RentalAssets",
                        principalColumn: "RentalAssetId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RentalSessionAssets_RentalSessions_RentalSessionId",
                        column: x => x.RentalSessionId,
                        principalTable: "RentalSessions",
                        principalColumn: "RentalSessionId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Vouchers_ApplicableComplexId",
                table: "Vouchers",
                column: "ApplicableComplexId");

            migrationBuilder.CreateIndex(
                name: "IX_Vouchers_ApplicableProductId",
                table: "Vouchers",
                column: "ApplicableProductId");

            migrationBuilder.CreateIndex(
                name: "IX_ComplexReviews_ComplexId",
                table: "ComplexReviews",
                column: "ComplexId");

            migrationBuilder.CreateIndex(
                name: "IX_ComplexReviews_UserId",
                table: "ComplexReviews",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ConditionChecks_RentalAssetId",
                table: "ConditionChecks",
                column: "RentalAssetId");

            migrationBuilder.CreateIndex(
                name: "IX_ConditionChecks_RentalSessionId",
                table: "ConditionChecks",
                column: "RentalSessionId");

            migrationBuilder.CreateIndex(
                name: "IX_ConditionChecks_StaffUserId",
                table: "ConditionChecks",
                column: "StaffUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductStocks_ComplexId_Sku",
                table: "ProductStocks",
                columns: new[] { "ComplexId", "Sku" },
                unique: true,
                filter: "[IsDeleted] = 0");

            migrationBuilder.CreateIndex(
                name: "IX_RentalAssets_ComplexId_AssetCode",
                table: "RentalAssets",
                columns: new[] { "ComplexId", "AssetCode" },
                unique: true,
                filter: "[IsDeleted] = 0");

            migrationBuilder.CreateIndex(
                name: "IX_RentalAssets_ProductStockId",
                table: "RentalAssets",
                column: "ProductStockId");

            migrationBuilder.CreateIndex(
                name: "IX_RentalSessionAssets_RentalAssetId",
                table: "RentalSessionAssets",
                column: "RentalAssetId");

            migrationBuilder.CreateIndex(
                name: "IX_RentalSessionAssets_RentalSessionId",
                table: "RentalSessionAssets",
                column: "RentalSessionId");

            migrationBuilder.CreateIndex(
                name: "IX_RentalSessions_BookingId",
                table: "RentalSessions",
                column: "BookingId");

            migrationBuilder.CreateIndex(
                name: "IX_RentalSessions_ComplexId",
                table: "RentalSessions",
                column: "ComplexId");

            migrationBuilder.CreateIndex(
                name: "IX_RentalSessions_CustomerUserId",
                table: "RentalSessions",
                column: "CustomerUserId");

            migrationBuilder.CreateIndex(
                name: "IX_RentalSessions_StaffUserId",
                table: "RentalSessions",
                column: "StaffUserId");

            migrationBuilder.CreateIndex(
                name: "IX_RentalSurcharges_AppliedByUserId",
                table: "RentalSurcharges",
                column: "AppliedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_RentalSurcharges_RentalSessionId",
                table: "RentalSurcharges",
                column: "RentalSessionId");

            migrationBuilder.AddForeignKey(
                name: "FK_Vouchers_Complexes_ApplicableComplexId",
                table: "Vouchers",
                column: "ApplicableComplexId",
                principalTable: "Complexes",
                principalColumn: "ComplexId");

            migrationBuilder.AddForeignKey(
                name: "FK_Vouchers_ProductStocks_ApplicableProductId",
                table: "Vouchers",
                column: "ApplicableProductId",
                principalTable: "ProductStocks",
                principalColumn: "ProductStockId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Vouchers_Complexes_ApplicableComplexId",
                table: "Vouchers");

            migrationBuilder.DropForeignKey(
                name: "FK_Vouchers_ProductStocks_ApplicableProductId",
                table: "Vouchers");

            migrationBuilder.DropTable(
                name: "ComplexReviews");

            migrationBuilder.DropTable(
                name: "ConditionChecks");

            migrationBuilder.DropTable(
                name: "RentalSessionAssets");

            migrationBuilder.DropTable(
                name: "RentalSurcharges");

            migrationBuilder.DropTable(
                name: "RentalAssets");

            migrationBuilder.DropTable(
                name: "RentalSessions");

            migrationBuilder.DropTable(
                name: "ProductStocks");

            migrationBuilder.DropIndex(
                name: "IX_Vouchers_ApplicableComplexId",
                table: "Vouchers");

            migrationBuilder.DropIndex(
                name: "IX_Vouchers_ApplicableProductId",
                table: "Vouchers");

            migrationBuilder.DropColumn(
                name: "ApplicableComplexId",
                table: "Vouchers");

            migrationBuilder.DropColumn(
                name: "ApplicableProductId",
                table: "Vouchers");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Vouchers");

            migrationBuilder.DropColumn(
                name: "VoucherType",
                table: "Vouchers");
        }
    }
}
