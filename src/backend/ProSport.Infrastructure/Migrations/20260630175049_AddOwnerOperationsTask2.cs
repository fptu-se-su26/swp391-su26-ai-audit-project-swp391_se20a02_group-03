using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProSport.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddOwnerOperationsTask2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Courts_ComplexId",
                table: "Courts");

            migrationBuilder.AddColumn<int>(
                name: "ComplexId",
                table: "PricingRules",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Multiplier",
                table: "PricingRules",
                type: "decimal(8,4)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RuleType",
                table: "PricingRules",
                type: "nvarchar(30)",
                maxLength: 30,
                nullable: false,
                defaultValue: "BasePrice");

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "PricingRules",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "Active");

            migrationBuilder.AddColumn<DateTime>(
                name: "ValidFrom",
                table: "PricingRules",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ValidTo",
                table: "PricingRules",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Code",
                table: "Courts",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SlotDurationMinutes",
                table: "Complexes",
                type: "int",
                nullable: false,
                defaultValue: 60);

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

            migrationBuilder.UpdateData(
                table: "Complexes",
                keyColumn: "ComplexId",
                keyValue: 1,
                column: "SlotDurationMinutes",
                value: 60);

            migrationBuilder.UpdateData(
                table: "Courts",
                keyColumn: "CourtId",
                keyValue: 1,
                column: "Code",
                value: null);

            migrationBuilder.UpdateData(
                table: "Courts",
                keyColumn: "CourtId",
                keyValue: 2,
                column: "Code",
                value: null);

            migrationBuilder.UpdateData(
                table: "Courts",
                keyColumn: "CourtId",
                keyValue: 3,
                column: "Code",
                value: null);

            migrationBuilder.UpdateData(
                table: "Courts",
                keyColumn: "CourtId",
                keyValue: 4,
                column: "Code",
                value: null);

            migrationBuilder.UpdateData(
                table: "Courts",
                keyColumn: "CourtId",
                keyValue: 5,
                column: "Code",
                value: null);

            migrationBuilder.UpdateData(
                table: "PricingRules",
                keyColumn: "PricingRuleId",
                keyValue: 1,
                columns: new[] { "ComplexId", "Multiplier", "RuleType", "Status", "ValidFrom", "ValidTo" },
                values: new object[] { null, null, "BasePrice", "Active", null, null });

            migrationBuilder.UpdateData(
                table: "PricingRules",
                keyColumn: "PricingRuleId",
                keyValue: 2,
                columns: new[] { "ComplexId", "Multiplier", "RuleType", "Status", "ValidFrom", "ValidTo" },
                values: new object[] { null, null, "BasePrice", "Active", null, null });

            migrationBuilder.UpdateData(
                table: "PricingRules",
                keyColumn: "PricingRuleId",
                keyValue: 3,
                columns: new[] { "ComplexId", "Multiplier", "RuleType", "Status", "ValidFrom", "ValidTo" },
                values: new object[] { null, null, "BasePrice", "Active", null, null });

            migrationBuilder.UpdateData(
                table: "PricingRules",
                keyColumn: "PricingRuleId",
                keyValue: 4,
                columns: new[] { "ComplexId", "Multiplier", "RuleType", "Status", "ValidFrom", "ValidTo" },
                values: new object[] { null, null, "BasePrice", "Active", null, null });

            migrationBuilder.UpdateData(
                table: "PricingRules",
                keyColumn: "PricingRuleId",
                keyValue: 5,
                columns: new[] { "ComplexId", "Multiplier", "RuleType", "Status", "ValidFrom", "ValidTo" },
                values: new object[] { null, null, "BasePrice", "Active", null, null });

            migrationBuilder.UpdateData(
                table: "PricingRules",
                keyColumn: "PricingRuleId",
                keyValue: 6,
                columns: new[] { "ComplexId", "Multiplier", "RuleType", "Status", "ValidFrom", "ValidTo" },
                values: new object[] { null, null, "BasePrice", "Active", null, null });

            migrationBuilder.CreateIndex(
                name: "IX_Courts_ComplexId_Code",
                table: "Courts",
                columns: new[] { "ComplexId", "Code" },
                unique: true,
                filter: "[Code] IS NOT NULL AND [IsDeleted] = 0");

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_ComplexId",
                table: "AuditLogs",
                column: "ComplexId");

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_CreatedAt",
                table: "AuditLogs",
                column: "CreatedAt");

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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AuditLogs");

            migrationBuilder.DropTable(
                name: "ComplexClosures");

            migrationBuilder.DropTable(
                name: "ComplexMaintenanceWindows");

            migrationBuilder.DropTable(
                name: "ComplexOperatingSchedules");

            migrationBuilder.DropIndex(
                name: "IX_Courts_ComplexId_Code",
                table: "Courts");

            migrationBuilder.DropColumn(
                name: "ComplexId",
                table: "PricingRules");

            migrationBuilder.DropColumn(
                name: "Multiplier",
                table: "PricingRules");

            migrationBuilder.DropColumn(
                name: "RuleType",
                table: "PricingRules");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "PricingRules");

            migrationBuilder.DropColumn(
                name: "ValidFrom",
                table: "PricingRules");

            migrationBuilder.DropColumn(
                name: "ValidTo",
                table: "PricingRules");

            migrationBuilder.DropColumn(
                name: "Code",
                table: "Courts");

            migrationBuilder.DropColumn(
                name: "SlotDurationMinutes",
                table: "Complexes");

            migrationBuilder.CreateIndex(
                name: "IX_Courts_ComplexId",
                table: "Courts",
                column: "ComplexId");
        }
    }
}
