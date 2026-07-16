namespace ProSport.Domain.Entities;

public class EscrowWallet : BaseEntity
{
    public int EscrowWalletId { get; set; }
    public int UserId { get; set; }
    public decimal Balance { get; set; } = 0; // Số dư khả dụng
    public decimal LockedBalance { get; set; } = 0; // Số dư đang bị đóng băng cho các kèo

    public string? LinkedProvider { get; set; } // Tên ngân hàng / Tên ví
    public string? LinkedAccountNumber { get; set; } // Số tài khoản
    public string? LinkedAccountName { get; set; } // Tên chủ thẻ

    [System.ComponentModel.DataAnnotations.Timestamp]
    public byte[] RowVersion { get; set; } = null!;

    // Navigation properties
    public User User { get; set; } = null!;
    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}
