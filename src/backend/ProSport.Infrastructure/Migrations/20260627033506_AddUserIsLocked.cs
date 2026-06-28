using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProSport.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddUserIsLocked : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BookingDetails_Equipments");

            migrationBuilder.DropTable(
                name: "EquipmentUnits");

            migrationBuilder.DropColumn(
                name: "RentalPrice",
                table: "Equipments");

            migrationBuilder.DropColumn(
                name: "RentalStock",
                table: "Equipments");

            migrationBuilder.DropColumn(
                name: "SalesStock",
                table: "Equipments");

            migrationBuilder.AddColumn<bool>(
                name: "IsLocked",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Equipments",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsLocked",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Equipments");

            migrationBuilder.AddColumn<int>(
                name: "RentalStock",
                table: "Equipments",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SalesStock",
                table: "Equipments",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "RentalPrice",
                table: "Equipments",
                type: "decimal(18,2)",
                nullable: false,
                computedColumnSql: "CAST([RetailPrice] * 0.05 AS DECIMAL(18,2))",
                stored: true);

            migrationBuilder.CreateTable(
                name: "EquipmentUnits",
                columns: table => new
                {
                    EquipmentUnitId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EquipmentId = table.Column<int>(type: "int", nullable: false),
                    Condition = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    RentalCount = table.Column<int>(type: "int", nullable: false),
                    SerialNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "Available"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EquipmentUnits", x => x.EquipmentUnitId);
                    table.ForeignKey(
                        name: "FK_EquipmentUnits_Equipments_EquipmentId",
                        column: x => x.EquipmentId,
                        principalTable: "Equipments",
                        principalColumn: "EquipmentId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BookingDetails_Equipments",
                columns: table => new
                {
                    DetailId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BookingId = table.Column<int>(type: "int", nullable: true),
                    EquipmentId = table.Column<int>(type: "int", nullable: false),
                    EquipmentUnitId = table.Column<int>(type: "int", nullable: true),
                    AdditionalCharge = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    DamageFee = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    DamageNote = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    DepositAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false, defaultValue: 0m),
                    DepositRefundAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    DepositStatus = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "Held"),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    RentalStatus = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "Rented"),
                    RentedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "SYSDATETIME()"),
                    ReturnCondition = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Subtotal = table.Column<decimal>(type: "decimal(18,2)", nullable: false, computedColumnSql: "[Quantity] * [UnitPrice]", stored: true),
                    UnitPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookingDetails_Equipments", x => x.DetailId);
                    table.ForeignKey(
                        name: "FK_BookingDetails_Equipments_Bookings_BookingId",
                        column: x => x.BookingId,
                        principalTable: "Bookings",
                        principalColumn: "BookingId");
                    table.ForeignKey(
                        name: "FK_BookingDetails_Equipments_EquipmentUnits_EquipmentUnitId",
                        column: x => x.EquipmentUnitId,
                        principalTable: "EquipmentUnits",
                        principalColumn: "EquipmentUnitId",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_BookingDetails_Equipments_Equipments_EquipmentId",
                        column: x => x.EquipmentId,
                        principalTable: "Equipments",
                        principalColumn: "EquipmentId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_BookingDetails_Equipments_BookingId",
                table: "BookingDetails_Equipments",
                column: "BookingId");

            migrationBuilder.CreateIndex(
                name: "IX_BookingDetails_Equipments_EquipmentId",
                table: "BookingDetails_Equipments",
                column: "EquipmentId");

            migrationBuilder.CreateIndex(
                name: "IX_BookingDetails_Equipments_EquipmentUnitId",
                table: "BookingDetails_Equipments",
                column: "EquipmentUnitId");

            migrationBuilder.CreateIndex(
                name: "IX_EquipmentUnits_EquipmentId",
                table: "EquipmentUnits",
                column: "EquipmentId");
        }
    }
}
