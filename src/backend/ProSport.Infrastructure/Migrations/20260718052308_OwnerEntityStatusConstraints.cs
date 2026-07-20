using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProSport.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class OwnerEntityStatusConstraints : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddCheckConstraint(
                name: "CK_Equipments_Status",
                table: "Equipments",
                sql: "[Status] IN ('Available','Discontinued')");

            migrationBuilder.AddCheckConstraint(
                name: "CK_ComplexReviews_Status",
                table: "ComplexReviews",
                sql: "[Status] IN ('Published','Hidden')");

            migrationBuilder.AddCheckConstraint(
                name: "CK_ComplexOwners_Status",
                table: "ComplexOwners",
                sql: "[Status] IN ('Active','Inactive')");

            migrationBuilder.AddCheckConstraint(
                name: "CK_Complexes_Status",
                table: "Complexes",
                sql: "[Status] IN ('Active','Inactive')");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_Equipments_Status",
                table: "Equipments");

            migrationBuilder.DropCheckConstraint(
                name: "CK_ComplexReviews_Status",
                table: "ComplexReviews");

            migrationBuilder.DropCheckConstraint(
                name: "CK_ComplexOwners_Status",
                table: "ComplexOwners");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Complexes_Status",
                table: "Complexes");
        }
    }
}
