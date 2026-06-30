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
}
