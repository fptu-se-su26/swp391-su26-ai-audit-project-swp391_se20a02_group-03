using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProSport.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddTransactionReferenceIdUniqueIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
WITH RankedTransactions AS (
    SELECT TransactionId,
           ROW_NUMBER() OVER (PARTITION BY ReferenceId ORDER BY TransactionId DESC) AS RowNum
    FROM Transactions
    WHERE ReferenceId IS NOT NULL
)
UPDATE t
SET ReferenceId = CONCAT(t.ReferenceId, '_dup_', t.TransactionId)
FROM Transactions t
INNER JOIN RankedTransactions rt ON t.TransactionId = rt.TransactionId
WHERE rt.RowNum > 1;
");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_ReferenceId",
                table: "Transactions",
                column: "ReferenceId",
                unique: true,
                filter: "[ReferenceId] IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Transactions_ReferenceId",
                table: "Transactions");
        }
    }
}
