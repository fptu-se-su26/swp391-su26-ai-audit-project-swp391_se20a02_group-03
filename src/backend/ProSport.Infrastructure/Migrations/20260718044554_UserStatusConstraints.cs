using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProSport.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UserStatusConstraints : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddCheckConstraint(
                name: "CK_Users_EKycStatus",
                table: "Users",
                sql: "[EKycStatus] IN ('Unverified','Pending','Verified','Rejected')");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Users_Role",
                table: "Users",
                sql: "[Role] IN ('Admin','Staff','Customer','CourtOwner')");

            migrationBuilder.AddCheckConstraint(
                name: "CK_EkycProfiles_Status",
                table: "EkycProfiles",
                sql: "[Status] IN ('Pending','Approved','Rejected')");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_Users_EKycStatus",
                table: "Users");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Users_Role",
                table: "Users");

            migrationBuilder.DropCheckConstraint(
                name: "CK_EkycProfiles_Status",
                table: "EkycProfiles");
        }
    }
}
