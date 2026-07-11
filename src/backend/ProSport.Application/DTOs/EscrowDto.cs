namespace ProSport.Application.DTOs;

public class EscrowWalletDto
{
    public int EscrowWalletId { get; set; }
    public int UserId { get; set; }
    public decimal Balance { get; set; }
    public decimal LockedBalance { get; set; }
    public decimal TotalBalance => Balance + LockedBalance;
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

/// <summary>Request body cho POST /api/escrow/deposit — tạo URL thanh toán VNPay để nạp tiền thật vào ví.</summary>
public class EscrowDepositRequestDto
{
    /// <summary>Số tiền nạp vào ví (VND), phải > 0.</summary>
    public decimal Amount { get; set; }
}

/// <summary>Request body cho POST /api/escrow/refund — Admin/Staff hoàn tiền thủ công vào ví Escrow.</summary>
public class EscrowRefundRequestDto
{
    /// <summary>UserId của người nhận hoàn tiền.</summary>
    public int UserId { get; set; }

    /// <summary>Số tiền hoàn (VND), phải > 0.</summary>
    public decimal Amount { get; set; }

    /// <summary>Lý do hoàn tiền (bắt buộc).</summary>
    public string Reason { get; set; } = null!;

    /// <summary>Mã tham chiếu nội bộ (BookingId, MatchId, ticket số...). Nullable.</summary>
    public string? ReferenceId { get; set; }
}
