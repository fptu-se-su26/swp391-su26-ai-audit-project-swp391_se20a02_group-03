using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProSport.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPerformanceQueryIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_BookingDetails_CourtId",
                table: "BookingDetails");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_Status",
                table: "Matches",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_Courts_ComplexId_IsDeleted",
                table: "Courts",
                columns: new[] { "ComplexId", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_CreatedAt",
                table: "Bookings",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_Status_IsDeleted",
                table: "Bookings",
                columns: new[] { "Status", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_BookingDetails_CourtId_BookingDate",
                table: "BookingDetails",
                columns: new[] { "CourtId", "BookingDate" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Matches_Status",
                table: "Matches");

            migrationBuilder.DropIndex(
                name: "IX_Courts_ComplexId_IsDeleted",
                table: "Courts");

            migrationBuilder.DropIndex(
                name: "IX_Bookings_CreatedAt",
                table: "Bookings");

            migrationBuilder.DropIndex(
                name: "IX_Bookings_Status_IsDeleted",
                table: "Bookings");

            migrationBuilder.DropIndex(
                name: "IX_BookingDetails_CourtId_BookingDate",
                table: "BookingDetails");

            migrationBuilder.CreateIndex(
                name: "IX_BookingDetails_CourtId",
                table: "BookingDetails",
                column: "CourtId");
        }
    }
}
