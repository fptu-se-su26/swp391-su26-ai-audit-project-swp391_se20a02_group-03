using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProSport.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AdminEntityStatusConstraints : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddCheckConstraint(
                name: "CK_Reports_Status",
                table: "Reports",
                sql: "[Status] IN ('Pending','Investigating','Resolved','Rejected')");

            migrationBuilder.AddCheckConstraint(
                name: "CK_ProductStocks_Status",
                table: "ProductStocks",
                sql: "[Status] IN ('Active','Inactive')");

            migrationBuilder.AddCheckConstraint(
                name: "CK_PricingRules_Status",
                table: "PricingRules",
                sql: "[Status] IN ('Active','Inactive')");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Courts_Status",
                table: "Courts",
                sql: "[Status] IN ('Available','Maintenance','Inactive')");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_Reports_Status",
                table: "Reports");

            migrationBuilder.DropCheckConstraint(
                name: "CK_ProductStocks_Status",
                table: "ProductStocks");

            migrationBuilder.DropCheckConstraint(
                name: "CK_PricingRules_Status",
                table: "PricingRules");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Courts_Status",
                table: "Courts");
        }
    }
}
