using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ProSport.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddStaffAssignment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
                    CanManageRental = table.Column<bool>(type: "bit", nullable: false),
                    CanApplySurcharge = table.Column<bool>(type: "bit", nullable: false),
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

            // Staff demo assignments: OwnerDemoSeeder (idempotent at runtime).

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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StaffAssignments");
        }
    }
}
