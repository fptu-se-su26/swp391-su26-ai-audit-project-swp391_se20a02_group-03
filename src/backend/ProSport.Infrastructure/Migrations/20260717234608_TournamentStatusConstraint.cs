using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProSport.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class TournamentStatusConstraint : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddCheckConstraint(
                name: "CK_Tournaments_Status",
                table: "Tournaments",
                sql: "[Status] IN ('Open','Closed','Completed','Cancelled')");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_Tournaments_Status",
                table: "Tournaments");
        }
    }
}
