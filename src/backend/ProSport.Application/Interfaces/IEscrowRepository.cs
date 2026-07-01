using ProSport.Application.DTOs;
using ProSport.Domain.Entities;

namespace ProSport.Application.Interfaces;

public interface IEscrowRepository
{
    Task<EscrowWallet?> GetWalletByUserIdAsync(int userId);
    Task<EscrowWallet> CreateWalletAsync(EscrowWallet wallet);
    Task UpdateWalletAsync(EscrowWallet wallet);
    Task<IEnumerable<Transaction>> GetTransactionsByWalletIdAsync(int walletId);
    Task AddTransactionAsync(Transaction transaction);

    /// <summary>
    /// Trừ tiền ví atomic (dùng cho thanh toán booking bằng Escrow).
    /// Sử dụng DB Transaction để tránh race condition trừ tiền 2 lần.
    /// </summary>
    Task<bool> PayFromWalletAtomicAsync(int userId, decimal amount, int bookingId);

    /// <summary>Thanh toán một phần chia bill — chỉ xác nhận booking khi tất cả shares đã Paid.</summary>
    Task<bool> PaySplitShareAtomicAsync(int userId, int bookingId, int shareId, decimal amount);

    /// <summary>Hoàn tiền escrow cho một phần chia bill đã thanh toán (khi hủy/expired).</summary>
    Task<bool> RefundSplitShareAtomicAsync(int userId, int bookingId, int shareId, decimal amount);

    /// <summary>
    /// Thực thi delegate trong 1 Database Transaction với Serializable isolation.
    /// </summary>
    Task ExecuteInTransactionAsync(Func<Task> action);

    /// <summary>
    /// Thực thi delegate trả về Task<T> trong 1 Database Transaction với Serializable isolation.
    /// </summary>
    Task<T> ExecuteInTransactionAsync<T>(Func<Task<T>> action);

    Task<bool> TransactionExistsByReferenceIdAsync(string referenceId);

    /// <summary>
    /// Xác nhận thanh toán VNPay: cập nhật booking + tạo transaction audit trong một DB transaction.
    /// </summary>
    Task<VnPayPaymentConfirmOutcome> ConfirmVnPayBookingPaymentAsync(int bookingId, string vnpayTransactionId, decimal paidAmount);

    /// <summary>
    /// Hủy booking đã thanh toán và hoàn tiền (kể cả split shares) trong một DB transaction.
    /// Idempotent theo refundReferenceId.
    /// </summary>
    Task<bool> CancelBookingWithRefundAsync(int bookingId, decimal cancellationFee, decimal refundAmount, string reason, string refundReferenceId);

    /// <summary>
    /// Cộng tiền ví bằng SQL increment (tránh race read-modify-write). Gọi trong transaction hiện có hoặc tự bọc Serializable.
    /// </summary>
    Task<EscrowWallet> CreditWalletAsync(int userId, decimal amount);

    /// <summary>Trừ Balance nếu đủ tiền — atomic trên SQL Server. Không tự commit transaction ngoài.</summary>
    Task<bool> TryDebitWalletAsync(int userId, decimal amount);

    /// <summary>Chuyển Balance → LockedBalance nếu đủ tiền.</summary>
    Task<bool> TryLockWalletFundsAsync(int userId, decimal amount);

    /// <summary>Chuyển LockedBalance → Balance nếu đủ locked.</summary>
    Task<bool> TryReleaseWalletFundsAsync(int userId, decimal amount);

    /// <summary>Trừ LockedBalance nếu đủ locked (không hoàn về Balance).</summary>
    Task<bool> TryDeductLockedWalletFundsAsync(int userId, decimal amount);

    /// <summary>Trừ ví và ghi transaction cho mua thiết bị. Gọi trong transaction hiện có; không tự SaveChanges.</summary>
    Task<bool> PayEquipmentPurchaseAsync(int userId, decimal totalAmount, int? bookingId, string referenceId, string description);
}
