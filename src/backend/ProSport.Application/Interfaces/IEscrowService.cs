using ProSport.Application.DTOs;

namespace ProSport.Application.Interfaces;

public interface IEscrowService
{
    Task<ApiResponseDto<EscrowWalletDto>> GetWalletAsync(int userId);
    Task<ApiResponseDto<IEnumerable<TransactionDto>>> GetTransactionHistoryAsync(int userId);
    
    // Nạp tiền vào ví (thường gọi từ Webhook của VNPay)
    Task<ApiResponseDto<bool>> DepositAsync(int userId, decimal amount, string referenceId, string description);
    
    // Khóa tiền ký quỹ (khi xin join kèo)
    Task<ApiResponseDto<bool>> LockFundsAsync(int userId, decimal amount, int matchId, string description);
    
    // Mở khóa tiền (khi rời kèo hợp lệ hoặc kèo hủy)
    Task<ApiResponseDto<bool>> ReleaseFundsAsync(int userId, decimal amount, int matchId, string description);
    
    // Trừ thẳng tiền bị khóa (khi đánh xong trừ tiền sân, hoặc phạt bùng kèo)
    Task<ApiResponseDto<bool>> DeductLockedFundsAsync(int userId, decimal amount, int matchId, string description);
    
    // Thanh toán Booking bằng ví Escrow
    Task<ApiResponseDto<bool>> PayForBookingAsync(int userId, int bookingId);

    // Tạo URL VNPay để nạp tiền thật vào ví Escrow
    Task<ApiResponseDto<string>> CreateDepositUrlAsync(int userId, decimal amount, string ipAddress);

    // Thanh toán phí tham gia kèo bằng ví Escrow (trừ Balance, ghi Transaction)
    Task<ApiResponseDto<bool>> PayMatchFeeAsync(int userId, int matchId, decimal amount, string description);

    // Hoàn tiền thủ công vào ví Escrow (Admin/Staff)
    Task<ApiResponseDto<bool>> RefundToEscrowAsync(int userId, decimal amount, string reason, string? referenceId, int operatorId);

    // Liên kết tài khoản nhận tiền
    Task<ApiResponseDto<bool>> LinkAccountAsync(int userId, string provider, string accountNumber, string accountName);

    // Rút tiền về tài khoản đã liên kết
    Task<ApiResponseDto<bool>> WithdrawAsync(int userId, decimal amount);
}

