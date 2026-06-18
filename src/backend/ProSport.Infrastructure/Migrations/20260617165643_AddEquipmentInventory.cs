using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProSport.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddEquipmentInventory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Condition",
                table: "Equipments");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Equipments");

            migrationBuilder.RenameColumn(
                name: "TotalQuantity",
                table: "Equipments",
                newName: "StockQuantity");

            migrationBuilder.RenameColumn(
                name: "RentalPrice",
                table: "Equipments",
                newName: "Price");

            migrationBuilder.RenameColumn(
                name: "AvailableQuantity",
                table: "Equipments",
                newName: "EquipmentCategoryId");

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Equipments",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "Available");

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

            migrationBuilder.CreateIndex(
                name: "IX_Equipments_EquipmentCategoryId",
                table: "Equipments",
                column: "EquipmentCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_InventoryTransactions_EquipmentId",
                table: "InventoryTransactions",
                column: "EquipmentId");

            migrationBuilder.CreateIndex(
                name: "IX_InventoryTransactions_UserId",
                table: "InventoryTransactions",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Equipments_EquipmentCategories_EquipmentCategoryId",
                table: "Equipments",
                column: "EquipmentCategoryId",
                principalTable: "EquipmentCategories",
                principalColumn: "EquipmentCategoryId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Equipments_EquipmentCategories_EquipmentCategoryId",
                table: "Equipments");

            migrationBuilder.DropTable(
                name: "EquipmentCategories");

            migrationBuilder.DropTable(
                name: "InventoryTransactions");

            migrationBuilder.DropIndex(
                name: "IX_Equipments_EquipmentCategoryId",
                table: "Equipments");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Equipments");

            migrationBuilder.RenameColumn(
                name: "StockQuantity",
                table: "Equipments",
                newName: "TotalQuantity");

            migrationBuilder.RenameColumn(
                name: "Price",
                table: "Equipments",
                newName: "RentalPrice");

            migrationBuilder.RenameColumn(
                name: "EquipmentCategoryId",
                table: "Equipments",
                newName: "AvailableQuantity");

            migrationBuilder.AddColumn<string>(
                name: "Condition",
                table: "Equipments",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "Good");

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Equipments",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");
        }
    }
}
