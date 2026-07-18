using Microsoft.Extensions.Logging;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using ProSport.Domain.Constants;
using ProSport.Domain.Entities;

namespace ProSport.Application.Services;

public class EscrowService : IEscrowService
{
    private readonly IEscrowRepository _escrowRepository;
    private readonly IBookingRepository _bookingRepository;
    private readonly IVnPayService _vnPayService;
    private readonly ILogger<EscrowService> _logger;

    public EscrowService(
        IEscrowRepository escrowRepository,
        IBookingRepository bookingRepository,
        IVnPayService vnPayService,
        ILogger<EscrowService> logger)
    {
        _escrowRepository = escrowRepository;
        _bookingRepository = bookingRepository;
        _vnPayService = vnPayService;
        _logger = logger;
    }


    public async Task<ApiResponseDto<EscrowWalletDto>> GetWalletAsync(int userId)
    {
        try
        {
            var wallet = await _escrowRepository.GetWalletByUserIdAsync(userId);
            if (wallet == null)
            {
                // Auto create wallet if not exists
                wallet = new EscrowWallet { UserId = userId, Balance = 0, LockedBalance = 0 };
                await _escrowRepository.CreateWalletAsync(wallet);
            }

            return new ApiResponseDto<EscrowWalletDto>(200, "Success", new EscrowWalletDto
            {
                EscrowWalletId = wallet.EscrowWalletId,
                UserId = wallet.UserId,
                Balance = wallet.Balance,
                LockedBalance = wallet.LockedBalance
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting wallet for user {UserId}", userId);
            return new ApiResponseDto<EscrowWalletDto>(500, "Lỗi server khi lấy thông tin ví");
        }
    }

    public async Task<ApiResponseDto<IEnumerable<TransactionDto>>> GetTransactionHistoryAsync(int userId)
    {
        try
        {
            var wallet = await _escrowRepository.GetWalletByUserIdAsync(userId);
            if (wallet == null) return new ApiResponseDto<IEnumerable<TransactionDto>>(404, "Ví không tồn tại");

            var transactions = await _escrowRepository.GetTransactionsByWalletIdAsync(wallet.EscrowWalletId);
            var dtos = transactions.Select(t => new TransactionDto
            {
                TransactionId = t.TransactionId,
                Amount = t.Amount,
                Type = t.Type,
                Status = t.Status,
                ReferenceId = t.ReferenceId,
                Description = t.Description,
                CreatedAt = t.CreatedAt
            });

            return new ApiResponseDto<IEnumerable<TransactionDto>>(200, "Success", dtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting transaction history for user {UserId}", userId);
            return new ApiResponseDto<IEnumerable<TransactionDto>>(500, "Lỗi server khi lấy lịch sử giao dịch");
        }
    }

    public async Task<ApiResponseDto<bool>> DepositAsync(int userId, decimal amount, string referenceId, string description)
    {
        try
        {
            return await _escrowRepository.ExecuteInTransactionAsync(async () =>
            {
                if (amount <= 0)
                    return new ApiResponseDto<bool>(400, "Số tiền nạp phải lớn hơn 0", false);

                // C4 FIX: Prevent O(N) in-memory scan and TOCTOU race by checking existence directly in DB within Serializable tx
                if (!string.IsNullOrWhiteSpace(referenceId))
                {
                    var exists = await _escrowRepository.TransactionExistsByReferenceIdAsync(referenceId);
                    if (exists)
                    {
                        return new ApiResponseDto<bool>(200, "Giao dịch nạp tiền đã được xử lý trước đó", true);
                    }
                }

                var wallet = await _escrowRepository.CreditWalletAsync(userId, amount);
                var transaction = new Domain.Entities.Transaction
                {
                    EscrowWalletId = wallet.EscrowWalletId,
                    Amount = amount,
                    Type = TransactionType.Deposit,
                    Status = TransactionStatus.Completed,
                    ReferenceId = referenceId,
                    Description = description
                };

                await _escrowRepository.AddTransactionAsync(transaction);

                return new ApiResponseDto<bool>(200, "Nạp tiền thành công", true);
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error depositing to wallet for user {UserId}", userId);
            return new ApiResponseDto<bool>(500, "Lỗi server khi nạp tiền", false);
        }
    }

    public async Task<ApiResponseDto<bool>> LockFundsAsync(int userId, decimal amount, int matchId, string description)
    {
        try
        {
            // L4 FIX: Validate amount > 0 to prevent invalid transaction records
            if (amount <= 0)
                return new ApiResponseDto<bool>(400, "Số tiền phải lớn hơn 0", false);

            return await _escrowRepository.ExecuteInTransactionAsync(async () =>
            {
                var wallet = await _escrowRepository.GetWalletByUserIdAsync(userId);
                if (wallet == null) return new ApiResponseDto<bool>(404, "Ví không tồn tại", false);

                if (!await _escrowRepository.TryLockWalletFundsAsync(userId, amount))
                    return new ApiResponseDto<bool>(400, "Số dư không đủ để ký quỹ. Vui lòng nạp thêm tiền.", false);

                var transaction = new Domain.Entities.Transaction
                {
                    EscrowWalletId = wallet.EscrowWalletId,
                    MatchId = matchId,
                    Amount = amount,
                    Type = ProSport.Domain.Constants.TransactionType.EscrowLock,
                    Status = ProSport.Domain.Constants.TransactionStatus.Completed,
                    Description = description
                };

                await _escrowRepository.AddTransactionAsync(transaction);
                
                return new ApiResponseDto<bool>(200, "Khóa tiền ký quỹ thành công", true);
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error locking funds for user {UserId}, match {MatchId}", userId, matchId);
            return new ApiResponseDto<bool>(500, "Lỗi server khi khóa tiền ký quỹ", false);
        }
    }

    public async Task<ApiResponseDto<bool>> ReleaseFundsAsync(int userId, decimal amount, int matchId, string description)
    {
        try
        {
            // L4 FIX: Validate amount > 0 to prevent invalid transaction records
            if (amount <= 0)
                return new ApiResponseDto<bool>(400, "Số tiền phải lớn hơn 0", false);

            return await _escrowRepository.ExecuteInTransactionAsync(async () =>
            {
                var wallet = await _escrowRepository.GetWalletByUserIdAsync(userId);
                if (wallet == null) return new ApiResponseDto<bool>(404, "Ví không tồn tại", false);

                if (!await _escrowRepository.TryReleaseWalletFundsAsync(userId, amount))
                    return new ApiResponseDto<bool>(400, "Số tiền yêu cầu mở khóa vượt quá số dư đang bị khóa", false);

                var transaction = new Domain.Entities.Transaction
                {
                    EscrowWalletId = wallet.EscrowWalletId,
                    MatchId = matchId,
                    Amount = amount,
                    Type = ProSport.Domain.Constants.TransactionType.EscrowRelease,
                    Status = ProSport.Domain.Constants.TransactionStatus.Completed,
                    Description = description
                };

                await _escrowRepository.AddTransactionAsync(transaction);
                
                return new ApiResponseDto<bool>(200, "Mở khóa tiền ký quỹ thành công", true);
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error releasing funds for user {UserId}, match {MatchId}", userId, matchId);
            return new ApiResponseDto<bool>(500, "Lỗi server khi mở khóa tiền ký quỹ", false);
        }
    }

    public async Task<ApiResponseDto<bool>> DeductLockedFundsAsync(int userId, decimal amount, int matchId, string description)
    {
        try
        {
            return await _escrowRepository.ExecuteInTransactionAsync(async () =>
            {
                var wallet = await _escrowRepository.GetWalletByUserIdAsync(userId);
                if (wallet == null) return new ApiResponseDto<bool>(404, "Ví không tồn tại", false);

                if (!await _escrowRepository.TryDeductLockedWalletFundsAsync(userId, amount))
                    return new ApiResponseDto<bool>(400, "Số dư bị khóa không đủ để khấu trừ", false);

                var transaction = new Domain.Entities.Transaction
                {
                    EscrowWalletId = wallet.EscrowWalletId,
                    MatchId = matchId,
                    Amount = amount,
                    Type = ProSport.Domain.Constants.TransactionType.Payment, // Thường là trả tiền sân hoặc phạt bùng kèo
                    Status = ProSport.Domain.Constants.TransactionStatus.Completed,
                    Description = description
                };

                await _escrowRepository.AddTransactionAsync(transaction);
                
                return new ApiResponseDto<bool>(200, "Khấu trừ tiền ký quỹ thành công", true);
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deducting locked funds for user {UserId}, match {MatchId}", userId, matchId);
            return new ApiResponseDto<bool>(500, "Lỗi server khi trừ tiền ký quỹ", false);
        }
    }

    public async Task<ApiResponseDto<bool>> PayForBookingAsync(int userId, int bookingId)
    {
        try
        {
            var booking = await _bookingRepository.GetByIdAsync(bookingId);
            if (booking == null)
                return new ApiResponseDto<bool>(404, "Không tìm thấy thông tin đặt sân", false);

            if (booking.UserId != userId)
                return new ApiResponseDto<bool>(403, "Bạn không có quyền thanh toán cho đơn này", false);

            if (booking.PaymentStatus == PaymentStatus.Paid)
                return new ApiResponseDto<bool>(400, "Đơn đặt sân này đã được thanh toán", false);

            // Kiểm tra booking đã hết hạn thanh toán chưa
            if (booking.PaymentDeadline.HasValue && DateTime.UtcNow > booking.PaymentDeadline.Value)
            {
                // Quá hạn thanh toán = Expired (timeout), phân biệt với Cancelled (hủy chủ động).
                booking.Status = BookingStatus.Expired;
                await _bookingRepository.UpdateAsync(booking);
                return new ApiResponseDto<bool>(400, "Đơn đặt sân đã hết hạn thanh toán. Vui lòng đặt lại.", false);
            }

            // Sử dụng atomic method để tránh race condition trừ tiền 2 lần
            var payResult = await _escrowRepository.PayFromWalletAtomicAsync(
                userId, booking.TotalAmount, bookingId);

            if (!payResult)
            {
                var latestBooking = await _bookingRepository.GetByIdAsync(bookingId);
                if (latestBooking?.PaymentStatus == PaymentStatus.Paid)
                    return new ApiResponseDto<bool>(400, "Đơn đặt sân này đã được thanh toán", false);

                return new ApiResponseDto<bool>(400, "Số dư không đủ hoặc đơn đặt sân không còn hợp lệ để thanh toán.", false);
            }

            // C5 FIX: Booking Update logic removed from here. 
            // It is now handled atomically inside _escrowRepository.PayFromWalletAtomicAsync

            return new ApiResponseDto<bool>(200, "Thanh toán bằng ví Escrow thành công", true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error paying for booking {BookingId} by user {UserId}", bookingId, userId);
            return new ApiResponseDto<bool>(500, "Lỗi server khi thanh toán đặt sân", false);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // BƯỚC 1: Tạo URL VNPay để nạp tiền thật vào ví Escrow
    // ─────────────────────────────────────────────────────────────────────────

    /// <summary>
    /// Tạo URL thanh toán VNPay để nạp tiền thật vào ví Escrow.
    /// ReferenceId được sinh tự động (DEPOSIT-{userId}-{guid8}) để đảm bảo unique &amp; idempotent ở IPN.
    /// </summary>
    public Task<ApiResponseDto<string>> CreateDepositUrlAsync(int userId, decimal amount, string ipAddress)
    {
        try
        {
            if (amount <= 0)
                return Task.FromResult(new ApiResponseDto<string>(400, "Số tiền nạp phải lớn hơn 0"));

            // Giới hạn tối thiểu / tối đa để tránh spam
            const decimal minDeposit = 10_000m;
            const decimal maxDeposit = 100_000_000m;
            if (amount < minDeposit)
                return Task.FromResult(new ApiResponseDto<string>(400, $"Số tiền nạp tối thiểu là {minDeposit:N0} VND"));
            if (amount > maxDeposit)
                return Task.FromResult(new ApiResponseDto<string>(400, $"Số tiền nạp tối đa là {maxDeposit:N0} VND"));

            // ReferenceId tự sinh — unique mỗi lần, IPN dùng VnPayTransactionId để idempotent
            var referenceId = $"DEPOSIT-{userId}-{Guid.NewGuid().ToString("N")[..8].ToUpper()}";

            var url = _vnPayService.CreatePaymentUrl(
                ipAddress, userId, amount,
                orderType: Domain.Constants.VnPayOrderType.Deposit,
                referenceId: referenceId);

            return Task.FromResult(new ApiResponseDto<string>(200, "Tạo URL nạp tiền thành công", url));
        }
        catch (InvalidOperationException ex)
        {
            // VNPay chưa cấu hình
            _logger.LogWarning(ex, "VNPay not configured when creating deposit URL for user {UserId}", userId);
            return Task.FromResult(new ApiResponseDto<string>(503, ex.Message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating deposit URL for user {UserId}", userId);
            return Task.FromResult(new ApiResponseDto<string>(500, "Lỗi server khi tạo URL nạp tiền"));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // BƯỚC 2: Thanh toán phí tham gia kèo bằng ví Escrow
    // ─────────────────────────────────────────────────────────────────────────

    /// <summary>
    /// Trừ tiền ví Escrow (Balance) để thanh toán phí tham gia kèo.
    /// Atomic: check balance → debit → ghi Transaction trong 1 Serializable DB Transaction.
    /// </summary>
    public async Task<ApiResponseDto<bool>> PayMatchFeeAsync(int userId, int matchId, decimal amount, string description)
    {
        try
        {
            if (amount <= 0)
                return new ApiResponseDto<bool>(400, "Số tiền phải lớn hơn 0", false);

            // ReferenceId phải unique theo (match, user): Transaction.ReferenceId có unique index,
            // nên "MATCH-{matchId}" (thiếu userId) khiến người thứ 2 trả phí cùng kèo bị lỗi.
            var referenceId = $"MATCH-{matchId}-{userId}";

            return await _escrowRepository.ExecuteInTransactionAsync(async () =>
            {
                var wallet = await _escrowRepository.GetWalletByUserIdAsync(userId);
                if (wallet == null)
                    return new ApiResponseDto<bool>(404, "Ví Escrow không tồn tại. Vui lòng nạp tiền trước.", false);

                // Idempotent: nếu user đã trả phí kèo này rồi thì không trừ tiền lần nữa.
                if (await _escrowRepository.TransactionExistsByReferenceIdAsync(referenceId))
                    return new ApiResponseDto<bool>(200, "Bạn đã thanh toán phí tham gia kèo này trước đó", true);

                if (wallet.Balance < amount)
                    return new ApiResponseDto<bool>(400,
                        $"Số dư không đủ. Cần {amount:N0} VND nhưng ví chỉ có {wallet.Balance:N0} VND.", false);

                var debited = await _escrowRepository.TryDebitWalletAsync(userId, amount);
                if (!debited)
                    return new ApiResponseDto<bool>(400, "Số dư không đủ để thanh toán phí tham gia kèo.", false);

                var transaction = new Domain.Entities.Transaction
                {
                    EscrowWalletId = wallet.EscrowWalletId,
                    MatchId = matchId,
                    Amount = amount,
                    Type = TransactionType.Payment,
                    Status = TransactionStatus.Completed,
                    ReferenceId = referenceId,
                    Description = string.IsNullOrWhiteSpace(description)
                        ? $"Thanh toán phí tham gia kèo #{matchId}"
                        : description
                };

                await _escrowRepository.AddTransactionAsync(transaction);

                return new ApiResponseDto<bool>(200, "Thanh toán phí tham gia kèo thành công", true);
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error paying match fee for user {UserId}, match {MatchId}", userId, matchId);
            return new ApiResponseDto<bool>(500, "Lỗi server khi thanh toán phí tham gia kèo", false);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // BƯỚC 3: Hoàn tiền thủ công vào ví Escrow (Admin/Staff)
    // ─────────────────────────────────────────────────────────────────────────

    /// <summary>
    /// Hoàn tiền thủ công vào ví Escrow của một user (Admin/Staff dùng khi khiếu nại/lỗi hệ thống).
    /// Idempotent qua referenceId (nếu cung cấp): sẽ không nạp lại nếu referenceId đã tồn tại.
    /// </summary>
    public async Task<ApiResponseDto<bool>> RefundToEscrowAsync(
        int userId, decimal amount, string reason, string? referenceId, int operatorId)
    {
        try
        {
            if (amount <= 0)
                return new ApiResponseDto<bool>(400, "Số tiền hoàn phải lớn hơn 0", false);

            if (string.IsNullOrWhiteSpace(reason))
                return new ApiResponseDto<bool>(400, "Lý do hoàn tiền là bắt buộc", false);

            return await _escrowRepository.ExecuteInTransactionAsync(async () =>
            {
                // Idempotent check — nếu referenceId đã tồn tại, không xử lý lại
                if (!string.IsNullOrWhiteSpace(referenceId))
                {
                    var exists = await _escrowRepository.TransactionExistsByReferenceIdAsync($"REFUND-{referenceId}");
                    if (exists)
                        return new ApiResponseDto<bool>(200, "Giao dịch hoàn tiền này đã được xử lý trước đó", true);
                }

                var wallet = await _escrowRepository.CreditWalletAsync(userId, amount);

                var internalRefId = string.IsNullOrWhiteSpace(referenceId)
                    ? $"REFUND-MANUAL-{operatorId}-{Guid.NewGuid().ToString("N")[..8].ToUpper()}"
                    : $"REFUND-{referenceId}";

                var transaction = new Domain.Entities.Transaction
                {
                    EscrowWalletId = wallet.EscrowWalletId,
                    Amount = amount,
                    Type = TransactionType.Refund,
                    Status = TransactionStatus.Completed,
                    ReferenceId = internalRefId,
                    Description = $"[Hoàn tiền thủ công] {reason} (Operator: #{operatorId})"
                };

                await _escrowRepository.AddTransactionAsync(transaction);

                _logger.LogInformation(
                    "Manual refund: OperatorId={OperatorId} refunded {Amount} VND to UserId={UserId}. Reason={Reason}, RefId={RefId}",
                    operatorId, amount, userId, reason, internalRefId);

                return new ApiResponseDto<bool>(200, $"Hoàn tiền {amount:N0} VND vào ví thành công", true);
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error refunding to escrow for user {UserId} by operator {OperatorId}", userId, operatorId);
            return new ApiResponseDto<bool>(500, "Lỗi server khi hoàn tiền vào ví", false);
        }
    }
}