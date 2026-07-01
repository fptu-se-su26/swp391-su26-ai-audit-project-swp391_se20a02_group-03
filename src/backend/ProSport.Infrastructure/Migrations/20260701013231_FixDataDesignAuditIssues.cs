using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProSport.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixDataDesignAuditIssues : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RecurringBookingRules_Complexes_ComplexId",
                table: "RecurringBookingRules");

            migrationBuilder.DropIndex(
                name: "IX_RecurringBookingRules_ComplexId",
                table: "RecurringBookingRules");

            migrationBuilder.DropIndex(
                name: "IX_ComplexReviews_ComplexId",
                table: "ComplexReviews");

            migrationBuilder.DropIndex(
                name: "IX_BookingPaymentShares_BookingId",
                table: "BookingPaymentShares");

            migrationBuilder.Sql(@"
UPDATE Vouchers
SET Status = CASE WHEN IsActive = 1 THEN 'Active' ELSE 'Inactive' END
WHERE Status IS NULL
   OR LTRIM(RTRIM(ISNULL(Status, ''))) = ''
   OR Status NOT IN ('Active', 'Inactive', 'Expired');

WITH RankedReviews AS (
    SELECT ComplexReviewId,
           ROW_NUMBER() OVER (PARTITION BY ComplexId, UserId ORDER BY ComplexReviewId DESC) AS RowNum
    FROM ComplexReviews
    WHERE IsDeleted = 0
)
UPDATE cr
SET IsDeleted = 1,
    UpdatedAt = GETUTCDATE()
FROM ComplexReviews cr
INNER JOIN RankedReviews rr ON cr.ComplexReviewId = rr.ComplexReviewId
WHERE rr.RowNum > 1;

UPDATE Complexes
SET OpeningTime = NULL
WHERE OpeningTime IS NOT NULL AND TRY_CONVERT(time, OpeningTime) IS NULL;

UPDATE Complexes
SET ClosingTime = NULL
WHERE ClosingTime IS NOT NULL AND TRY_CONVERT(time, ClosingTime) IS NULL;

WITH RankedShares AS (
    SELECT BookingPaymentShareId,
           ROW_NUMBER() OVER (PARTITION BY BookingId, UserId ORDER BY BookingPaymentShareId DESC) AS RowNum
    FROM BookingPaymentShares
)
DELETE bps
FROM BookingPaymentShares bps
INNER JOIN RankedShares rs ON bps.BookingPaymentShareId = rs.BookingPaymentShareId
WHERE rs.RowNum > 1;
");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Vouchers");

            migrationBuilder.DropColumn(
                name: "ComplexId",
                table: "RecurringBookingRules");

            migrationBuilder.DropColumn(
                name: "Price",
                table: "Equipments");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "Vouchers",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "Active",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<bool>(
                name: "EntryFeePaid",
                table: "TournamentRegistrations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "PaymentTransactionId",
                table: "TournamentRegistrations",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "RentalPriceAtTime",
                table: "RentalSessionAssets",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<DateTime>(
                name: "ConfirmedAt",
                table: "MatchResults",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ConfirmedByUserId",
                table: "MatchResults",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DisputeReason",
                table: "MatchResults",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DisputedAt",
                table: "MatchResults",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AlterColumn<TimeSpan>(
                name: "OpeningTime",
                table: "Complexes",
                type: "time",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(5)",
                oldMaxLength: 5,
                oldNullable: true);

            migrationBuilder.AlterColumn<TimeSpan>(
                name: "ClosingTime",
                table: "Complexes",
                type: "time",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(5)",
                oldMaxLength: 5,
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "Complexes",
                keyColumn: "ComplexId",
                keyValue: 1,
                columns: new[] { "ClosingTime", "OpeningTime" },
                values: new object[] { new TimeSpan(0, 23, 0, 0, 0), new TimeSpan(0, 5, 0, 0, 0) });

            migrationBuilder.AddCheckConstraint(
                name: "CK_Vouchers_Status",
                table: "Vouchers",
                sql: "[Status] IN ('Active','Inactive','Expired')");

            migrationBuilder.CreateIndex(
                name: "IX_TournamentRegistrations_PaymentTransactionId",
                table: "TournamentRegistrations",
                column: "PaymentTransactionId");

            migrationBuilder.CreateIndex(
                name: "IX_MatchResults_ConfirmedByUserId",
                table: "MatchResults",
                column: "ConfirmedByUserId");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Matches_Status",
                table: "Matches",
                sql: "[Status] IN ('Open','Closed','Completed','Cancelled')");

            migrationBuilder.CreateIndex(
                name: "IX_ComplexReviews_ComplexId_UserId",
                table: "ComplexReviews",
                columns: new[] { "ComplexId", "UserId" },
                unique: true,
                filter: "[IsDeleted] = 0");

            migrationBuilder.Sql(@"
UPDATE Bookings
SET PaymentMethod = 'Escrow'
WHERE PaymentMethod IS NOT NULL
  AND PaymentMethod NOT IN ('VNPay', 'Escrow', 'Cash');

UPDATE Bookings
SET PaymentStatus = 'Pending'
WHERE PaymentStatus IS NOT NULL
  AND PaymentStatus NOT IN ('Pending', 'Paid', 'Refunded', 'Cancelled');

UPDATE Bookings
SET Status = 'Confirmed'
WHERE Status NOT IN ('Pending','PendingPayment','Confirmed','CheckedIn','Cancelled','Completed','Expired','NoShow');

UPDATE Matches
SET Status = 'Open'
WHERE Status NOT IN ('Open','Closed','Completed','Cancelled');
");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Bookings_PaymentMethod",
                table: "Bookings",
                sql: "[PaymentMethod] IS NULL OR [PaymentMethod] IN ('VNPay','Escrow','Cash')");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Bookings_PaymentStatus",
                table: "Bookings",
                sql: "[PaymentStatus] IS NULL OR [PaymentStatus] IN ('Pending','Paid','Refunded','Cancelled')");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Bookings_Status",
                table: "Bookings",
                sql: "[Status] IN ('Pending','PendingPayment','Confirmed','CheckedIn','Cancelled','Completed','Expired','NoShow')");

            migrationBuilder.CreateIndex(
                name: "IX_BookingPaymentShares_BookingId_UserId",
                table: "BookingPaymentShares",
                columns: new[] { "BookingId", "UserId" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_MatchResults_Users_ConfirmedByUserId",
                table: "MatchResults",
                column: "ConfirmedByUserId",
                principalTable: "Users",
                principalColumn: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_TournamentRegistrations_Transactions_PaymentTransactionId",
                table: "TournamentRegistrations",
                column: "PaymentTransactionId",
                principalTable: "Transactions",
                principalColumn: "TransactionId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MatchResults_Users_ConfirmedByUserId",
                table: "MatchResults");

            migrationBuilder.DropForeignKey(
                name: "FK_TournamentRegistrations_Transactions_PaymentTransactionId",
                table: "TournamentRegistrations");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Vouchers_Status",
                table: "Vouchers");

            migrationBuilder.DropIndex(
                name: "IX_TournamentRegistrations_PaymentTransactionId",
                table: "TournamentRegistrations");

            migrationBuilder.DropIndex(
                name: "IX_MatchResults_ConfirmedByUserId",
                table: "MatchResults");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Matches_Status",
                table: "Matches");

            migrationBuilder.DropIndex(
                name: "IX_ComplexReviews_ComplexId_UserId",
                table: "ComplexReviews");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Bookings_PaymentMethod",
                table: "Bookings");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Bookings_PaymentStatus",
                table: "Bookings");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Bookings_Status",
                table: "Bookings");

            migrationBuilder.DropIndex(
                name: "IX_BookingPaymentShares_BookingId_UserId",
                table: "BookingPaymentShares");

            migrationBuilder.DropColumn(
                name: "EntryFeePaid",
                table: "TournamentRegistrations");

            migrationBuilder.DropColumn(
                name: "PaymentTransactionId",
                table: "TournamentRegistrations");

            migrationBuilder.DropColumn(
                name: "RentalPriceAtTime",
                table: "RentalSessionAssets");

            migrationBuilder.DropColumn(
                name: "ConfirmedAt",
                table: "MatchResults");

            migrationBuilder.DropColumn(
                name: "ConfirmedByUserId",
                table: "MatchResults");

            migrationBuilder.DropColumn(
                name: "DisputeReason",
                table: "MatchResults");

            migrationBuilder.DropColumn(
                name: "DisputedAt",
                table: "MatchResults");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "Vouchers",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20,
                oldDefaultValue: "Active");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Vouchers",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<int>(
                name: "ComplexId",
                table: "RecurringBookingRules",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "Price",
                table: "Equipments",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AlterColumn<string>(
                name: "OpeningTime",
                table: "Complexes",
                type: "nvarchar(5)",
                maxLength: 5,
                nullable: true,
                oldClrType: typeof(TimeSpan),
                oldType: "time",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ClosingTime",
                table: "Complexes",
                type: "nvarchar(5)",
                maxLength: 5,
                nullable: true,
                oldClrType: typeof(TimeSpan),
                oldType: "time",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "Complexes",
                keyColumn: "ComplexId",
                keyValue: 1,
                columns: new[] { "ClosingTime", "OpeningTime" },
                values: new object[] { "23:00", "05:00" });

            migrationBuilder.UpdateData(
                table: "Equipments",
                keyColumn: "EquipmentId",
                keyValue: 1,
                column: "Price",
                value: 6000000m);

            migrationBuilder.UpdateData(
                table: "Equipments",
                keyColumn: "EquipmentId",
                keyValue: 2,
                column: "Price",
                value: 4000000m);

            migrationBuilder.UpdateData(
                table: "Equipments",
                keyColumn: "EquipmentId",
                keyValue: 3,
                column: "Price",
                value: 5500000m);

            migrationBuilder.UpdateData(
                table: "Equipments",
                keyColumn: "EquipmentId",
                keyValue: 4,
                column: "Price",
                value: 7000000m);

            migrationBuilder.UpdateData(
                table: "Equipments",
                keyColumn: "EquipmentId",
                keyValue: 5,
                column: "Price",
                value: 3200000m);

            migrationBuilder.UpdateData(
                table: "Equipments",
                keyColumn: "EquipmentId",
                keyValue: 6,
                column: "Price",
                value: 2400000m);

            migrationBuilder.UpdateData(
                table: "Equipments",
                keyColumn: "EquipmentId",
                keyValue: 7,
                column: "Price",
                value: 2800000m);

            migrationBuilder.UpdateData(
                table: "Equipments",
                keyColumn: "EquipmentId",
                keyValue: 8,
                column: "Price",
                value: 650000m);

            migrationBuilder.UpdateData(
                table: "Equipments",
                keyColumn: "EquipmentId",
                keyValue: 9,
                column: "Price",
                value: 450000m);

            migrationBuilder.UpdateData(
                table: "Equipments",
                keyColumn: "EquipmentId",
                keyValue: 10,
                column: "Price",
                value: 890000m);

            migrationBuilder.UpdateData(
                table: "Equipments",
                keyColumn: "EquipmentId",
                keyValue: 11,
                column: "Price",
                value: 280000m);

            migrationBuilder.UpdateData(
                table: "Equipments",
                keyColumn: "EquipmentId",
                keyValue: 12,
                column: "Price",
                value: 1200000m);

            migrationBuilder.UpdateData(
                table: "Equipments",
                keyColumn: "EquipmentId",
                keyValue: 13,
                column: "Price",
                value: 350000m);

            migrationBuilder.UpdateData(
                table: "Equipments",
                keyColumn: "EquipmentId",
                keyValue: 14,
                column: "Price",
                value: 420000m);

            migrationBuilder.UpdateData(
                table: "Equipments",
                keyColumn: "EquipmentId",
                keyValue: 15,
                column: "Price",
                value: 180000m);

            migrationBuilder.UpdateData(
                table: "Equipments",
                keyColumn: "EquipmentId",
                keyValue: 16,
                column: "Price",
                value: 2100000m);

            migrationBuilder.UpdateData(
                table: "Equipments",
                keyColumn: "EquipmentId",
                keyValue: 17,
                column: "Price",
                value: 120000m);

            migrationBuilder.UpdateData(
                table: "Equipments",
                keyColumn: "EquipmentId",
                keyValue: 18,
                column: "Price",
                value: 320000m);

            migrationBuilder.UpdateData(
                table: "Equipments",
                keyColumn: "EquipmentId",
                keyValue: 19,
                column: "Price",
                value: 250000m);

            migrationBuilder.UpdateData(
                table: "Equipments",
                keyColumn: "EquipmentId",
                keyValue: 20,
                column: "Price",
                value: 480000m);

            migrationBuilder.CreateIndex(
                name: "IX_RecurringBookingRules_ComplexId",
                table: "RecurringBookingRules",
                column: "ComplexId");

            migrationBuilder.CreateIndex(
                name: "IX_ComplexReviews_ComplexId",
                table: "ComplexReviews",
                column: "ComplexId");

            migrationBuilder.CreateIndex(
                name: "IX_BookingPaymentShares_BookingId",
                table: "BookingPaymentShares",
                column: "BookingId");

            migrationBuilder.AddForeignKey(
                name: "FK_RecurringBookingRules_Complexes_ComplexId",
                table: "RecurringBookingRules",
                column: "ComplexId",
                principalTable: "Complexes",
                principalColumn: "ComplexId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
