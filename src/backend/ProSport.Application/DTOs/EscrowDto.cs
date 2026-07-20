namespace ProSport.Application.DTOs;

public class EscrowWalletDto
{
    public int EscrowWalletId { get; set; }
    public int UserId { get; set; }
    public decimal Balance { get; set; }
    public decimal LockedBalance { get; set; }
    public decimal TotalBalance => Balance + LockedBalance;

    public string? LinkedProvider { get; set; }
    public string? LinkedAccountNumber { get; set; }
    public string? LinkedAccountName { get; set; }
}

public class TransactionDto
{
    public int TransactionId { get; set; }
    public decimal Amount { get; set; }
    public string Type { get; set; } = null!;
    public string Status { get; set; } = null!;
    public string? ReferenceId { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class EscrowDepositRequestDto
{
    public decimal Amount { get; set; }
}

public class EscrowRefundRequestDto
{
    public int UserId { get; set; }
    public decimal Amount { get; set; }
    public string Reason { get; set; } = null!;
    public string? ReferenceId { get; set; }
}

public class LinkAccountRequestDto
{
    public string Provider { get; set; } = null!; // Ngân hàng Vietcombank, Momo, PayOS, etc.
    public string AccountNumber { get; set; } = null!; // Số tài khoản
    public string AccountName { get; set; } = null!; // Tên chủ tài khoản
}

public class EscrowWithdrawRequestDto
{
    public decimal Amount { get; set; }
}
