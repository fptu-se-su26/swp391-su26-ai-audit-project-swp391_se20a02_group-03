using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ProSport.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddComplexAndOwner : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ComplexId",
                table: "Courts",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "BookingDetails_Equipments",
                columns: table => new
                {
                    DetailId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BookingId = table.Column<int>(type: "int", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    EquipmentId = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    UnitPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    DepositAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    DepositStatus = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "Held"),
                    RentalStatus = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "Rented"),
                    ReturnCondition = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    DamageNote = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    DamageFee = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    DepositRefundAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    AdditionalCharge = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    RentedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "SYSDATETIME()"),
                    EquipmentUnitId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookingDetails_Equipments", x => x.DetailId);
                    table.ForeignKey(
                        name: "FK_BookingDetails_Equipments_Bookings_BookingId",
                        column: x => x.BookingId,
                        principalTable: "Bookings",
                        principalColumn: "BookingId",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_BookingDetails_Equipments_Equipments_EquipmentId",
                        column: x => x.EquipmentId,
                        principalTable: "Equipments",
                        principalColumn: "EquipmentId");
                    table.ForeignKey(
                        name: "FK_BookingDetails_Equipments_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId");
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
                    OpeningTime = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: true),
                    ClosingTime = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: true),
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

            // Seed data: OwnerDemoSeeder + SampleUserSeeder + DatabaseSeeder (idempotent at runtime).
            // Không InsertData ở đây — tránh PK trùng khi nâng cấp DB đã có dữ liệu.

            migrationBuilder.CreateIndex(
                name: "IX_Courts_ComplexId",
                table: "Courts",
                column: "ComplexId");

            migrationBuilder.CreateIndex(
                name: "IX_BookingDetails_Equipments_BookingId",
                table: "BookingDetails_Equipments",
                column: "BookingId");

            migrationBuilder.CreateIndex(
                name: "IX_BookingDetails_Equipments_EquipmentId",
                table: "BookingDetails_Equipments",
                column: "EquipmentId");

            migrationBuilder.CreateIndex(
                name: "IX_BookingDetails_Equipments_UserId",
                table: "BookingDetails_Equipments",
                column: "UserId");

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

            migrationBuilder.AddForeignKey(
                name: "FK_Courts_Complexes_ComplexId",
                table: "Courts",
                column: "ComplexId",
                principalTable: "Complexes",
                principalColumn: "ComplexId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Courts_Complexes_ComplexId",
                table: "Courts");

            migrationBuilder.DropTable(
                name: "BookingDetails_Equipments");

            migrationBuilder.DropTable(
                name: "ComplexOwners");

            migrationBuilder.DropTable(
                name: "Complexes");

            migrationBuilder.DropIndex(
                name: "IX_Courts_ComplexId",
                table: "Courts");

            migrationBuilder.DropColumn(
                name: "ComplexId",
                table: "Courts");
        }
    }
}
