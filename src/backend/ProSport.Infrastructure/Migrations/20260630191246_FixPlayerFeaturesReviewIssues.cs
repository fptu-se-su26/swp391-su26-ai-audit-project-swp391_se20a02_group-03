using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProSport.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixPlayerFeaturesReviewIssues : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_TournamentRegistrations_TournamentId",
                table: "TournamentRegistrations");

            migrationBuilder.DropIndex(
                name: "IX_MatchResults_MatchId",
                table: "MatchResults");

            migrationBuilder.CreateIndex(
                name: "IX_TournamentRegistrations_TournamentId_CaptainUserId",
                table: "TournamentRegistrations",
                columns: new[] { "TournamentId", "CaptainUserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MatchResults_MatchId",
                table: "MatchResults",
                column: "MatchId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_RecurringRuleId",
                table: "Bookings",
                column: "RecurringRuleId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_RecurringBookingRules_RecurringRuleId",
                table: "Bookings",
                column: "RecurringRuleId",
                principalTable: "RecurringBookingRules",
                principalColumn: "RecurringBookingRuleId",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_RecurringBookingRules_RecurringRuleId",
                table: "Bookings");

            migrationBuilder.DropIndex(
                name: "IX_TournamentRegistrations_TournamentId_CaptainUserId",
                table: "TournamentRegistrations");

            migrationBuilder.DropIndex(
                name: "IX_MatchResults_MatchId",
                table: "MatchResults");

            migrationBuilder.DropIndex(
                name: "IX_Bookings_RecurringRuleId",
                table: "Bookings");

            migrationBuilder.CreateIndex(
                name: "IX_TournamentRegistrations_TournamentId",
                table: "TournamentRegistrations",
                column: "TournamentId");

            migrationBuilder.CreateIndex(
                name: "IX_MatchResults_MatchId",
                table: "MatchResults",
                column: "MatchId");
        }
    }
}
