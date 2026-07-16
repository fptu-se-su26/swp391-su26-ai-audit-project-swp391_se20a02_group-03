using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProSport.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddWalletLinkedAccount : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LinkedAccountName",
                table: "EscrowWallets",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LinkedAccountNumber",
                table: "EscrowWallets",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LinkedProvider",
                table: "EscrowWallets",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LinkedAccountName",
                table: "EscrowWallets");

            migrationBuilder.DropColumn(
                name: "LinkedAccountNumber",
                table: "EscrowWallets");

            migrationBuilder.DropColumn(
                name: "LinkedProvider",
                table: "EscrowWallets");
        }
    }
}
