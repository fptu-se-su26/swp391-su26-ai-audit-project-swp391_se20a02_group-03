using Microsoft.Extensions.Logging;
using ProSport.Application.DTOs;
using ProSport.Application.Exceptions;
using ProSport.Application.Interfaces;
using ProSport.Domain.Constants;
using ProSport.Domain.Entities;

namespace ProSport.Application.Services;

public class BookingService : IBookingService
{
    private const string WalkInGuestEmail = "walkin@prosport.vn";

    private readonly IBookingRepository _bookingRepository;
    private readonly ICourtRepository _courtRepository;
    private readonly IEscrowRepository _escrowRepository;
    private readonly IUserRepository _userRepository;
    private readonly IEmailService _emailService;
    private readonly ILogger<BookingService> _logger;
    private readonly IStaffOperationGuard _staffOperationGuard;
    private readonly ICancellationPolicyService _cancellationPolicy;
    private readonly IMembershipService _membershipService;
    private readonly INotificationService _notificationService;

    /// <summary>
    /// Thời gian chờ thanh toán tối đa (15 phút). Quá hạn sẽ tự hủy booking.
    /// </summary>
    private static readonly TimeSpan PaymentTimeout = TimeSpan.FromMinutes(15);

    public BookingService(
        IBookingRepository bookingRepository,
        ICourtRepository courtRepository,
        IEscrowRepository escrowRepository,
        IUserRepository userRepository,
        IEmailService emailService,
        ILogger<BookingService> logger,
        IStaffOperationGuard staffOperationGuard,
        ICancellationPolicyService cancellationPolicy,
        IMembershipService membershipService,
        INotificationService notificationService)
    {
        _bookingRepository = bookingRepository;
        _courtRepository = courtRepository;
        _escrowRepository = escrowRepository;
        _userRepository = userRepository;
        _emailService = emailService;
        _logger = logger;
        _staffOperationGuard = staffOperationGuard;
        _cancellationPolicy = cancellationPolicy;
        _membershipService = membershipService;
        _notificationService = notificationService;
    }

    public async Task<ApiResponseDto<IEnumerable<BookingDto>>> GetAllBookingsAsync()
    {
        try
        {
            var bookings = await _bookingRepository.GetAllAsync();
            return new ApiResponseDto<IEnumerable<BookingDto>>(200, "Success", MapToDtos(bookings));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all bookings");
            return new ApiResponseDto<IEnumerable<BookingDto>>(500, "An unexpected error occurred.");
        }
    }

    public async Task<ApiResponseDto<BookingDto>> GetBookingByIdAsync(int bookingId)
    {
        try
        {
            var booking = await _bookingRepository.GetByIdAsync(bookingId);
            if (booking == null) return new ApiResponseDto<BookingDto>(404, "Booking not found");

            return new ApiResponseDto<BookingDto>(200, "Success", MapToDto(booking));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting booking by id: {BookingId}", bookingId);
            return new ApiResponseDto<BookingDto>(500, "An unexpected error occurred.");
        }
    }

    public async Task<ApiResponseDto<IEnumerable<BookingDto>>> GetUserBookingsAsync(int userId)
    {
        try
        {
            var bookings = await _bookingRepository.GetByUserIdAsync(userId);
            return new ApiResponseDto<IEnumerable<BookingDto>>(200, "Success", MapToDtos(bookings));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting bookings for user: {UserId}", userId);
            return new ApiResponseDto<IEnumerable<BookingDto>>(500, "An unexpected error occurred.");
        }
    }

    public async Task<ApiResponseDto<BookingDto>> CreateBookingAsync(CreateBookingDto dto)
    {
        try
        {
            // === VALIDATION: Kiểm tra input hợp lệ ===
            if (dto.Details == null || !dto.Details.Any())
                return new ApiResponseDto<BookingDto>(400, "Phải có ít nhất 1 chi tiết đặt sân.");

            // TK-004: Bắt buộc xác thực E-KYC trước khi đặt sân (chống bùng kèo / tài khoản ảo).
            var bookingUser = await _userRepository.GetByIdAsync(dto.UserId);
            if (bookingUser == null)
                return new ApiResponseDto<BookingDto>(404, "Không tìm thấy tài khoản.");
            if (bookingUser.IsLocked)
                return new ApiResponseDto<BookingDto>(403, "Tài khoản đang bị khóa.");
            if (!bookingUser.IsVerified)
                return new ApiResponseDto<BookingDto>(403, "Tài khoản chưa xác thực E-KYC. Vui lòng hoàn tất xác thực định danh trước khi đặt sân.");

            // Anti-spam: Giới hạn tối đa 3 booking Pending chưa thanh toán
            var userBookings = await _bookingRepository.GetByUserIdAsync(dto.UserId);
            var pendingCount = userBookings.Count(b => b.Status == BookingStatus.Pending
                && b.PaymentDeadline.HasValue && b.PaymentDeadline.Value > DateTime.UtcNow);
            if (pendingCount >= 3)
                return new ApiResponseDto<BookingDto>(400, "Bạn đang có 3 đơn đặt sân chưa thanh toán. Vui lòng thanh toán hoặc hủy trước khi đặt thêm.");

            decimal totalAmount = 0;
            var details = new List<BookingDetail>();

            // Cross-platform timezone: try Windows ID first, fallback to IANA (Linux/Docker)
            TimeZoneInfo vnTz;
            try { vnTz = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time"); }
            catch { vnTz = TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh"); }
            var vnNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, vnTz);

            // C2 FIX: Cache courts to avoid repeated DB calls for the same court across multiple dates/slots
            var courtCache = new Dictionary<int, Domain.Entities.Court>();

            foreach (var d in dto.Details)
            {
                // Validate: Ngày đặt sân không được trong quá khứ
                if (d.BookingDate.Date < vnNow.Date)
                    return new ApiResponseDto<BookingDto>(400, "Không thể đặt sân cho ngày trong quá khứ.");

                // Validate: Giờ bắt đầu phải trước giờ kết thúc
                if (d.EndTime <= d.StartTime)
                    return new ApiResponseDto<BookingDto>(400, "Giờ kết thúc phải sau giờ bắt đầu.");

                // Validate: Thời lượng tối thiểu 1 giờ, tối đa 4 giờ
                var duration = d.EndTime - d.StartTime;
                if (duration < TimeSpan.FromHours(1))
                    return new ApiResponseDto<BookingDto>(400, "Thời lượng đặt sân tối thiểu là 1 giờ.");
                if (duration > TimeSpan.FromHours(4))
                    return new ApiResponseDto<BookingDto>(400, "Thời lượng đặt sân tối đa là 4 giờ.");

                // Validate: Nếu book ngày hôm nay, giờ bắt đầu phải lớn hơn giờ hiện tại
                if (d.BookingDate.Date == vnNow.Date && d.StartTime <= vnNow.TimeOfDay)
                    return new ApiResponseDto<BookingDto>(400, "Giờ đặt sân phải lớn hơn giờ hiện tại.");

                if (!courtCache.TryGetValue(d.CourtId, out var court))
                {
                    court = await _courtRepository.GetByIdAsync(d.CourtId);
                    if (court != null) courtCache[d.CourtId] = court;
                }

            if (court == null || !CourtStatuses.IsBookable(court.Status))
                    return new ApiResponseDto<BookingDto>(400, $"Sân {d.CourtId} không khả dụng.");

                // C2 & H3 FIX: Removed N+1 and non-atomic GetAvailableCourtsAsync check.
                // Overlap and availability checking is safely delegated to _bookingRepository.CreateWithTransactionAsync
                // which uses a Serializable transaction to prevent TOCTOU race conditions.

                // Tính giá dựa trên PricingRule (đã fix logic cross-slot)
                var price = await CalculatePriceAsync(dto.UserId, court, d.BookingDate, d.StartTime, d.EndTime);
                totalAmount += price;

                details.Add(new BookingDetail
                {
                    CourtId = d.CourtId,
                    BookingDate = d.BookingDate,
                    StartTime = d.StartTime,
                    EndTime = d.EndTime,
                    Price = price
                });
            }

            var booking = new Booking
            {
                UserId = dto.UserId,
                TotalAmount = totalAmount,
                Status = BookingStatus.Pending,
                PaymentMethod = PaymentMethod.VNPay,
                PaymentStatus = Domain.Constants.PaymentStatus.Pending,
                PaymentDeadline = DateTime.UtcNow.Add(PaymentTimeout),
                BookingDetails = details
            };

            // Sử dụng CreateWithTransactionAsync để đảm bảo atomic operation
            // tránh race condition double-booking
            var created = await _bookingRepository.CreateWithTransactionAsync(booking);
            return new ApiResponseDto<BookingDto>(201, "Đặt sân thành công. Vui lòng thanh toán trong 15 phút.", MapToDto(created));
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("đã được đặt"))
        {
            // Race condition: sân đã bị người khác đặt giữa lúc check và create
            return new ApiResponseDto<BookingDto>(409, ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating booking for user: {UserId}", dto.UserId);
            return new ApiResponseDto<BookingDto>(500, "An unexpected error occurred.");
        }
    }

    public async Task<ApiResponseDto<BookingDto>> CreateWalkInBookingAsync(WalkInBookingDto dto, int staffId)
    {
        try
        {
            if (dto.Details == null || !dto.Details.Any())
                return new ApiResponseDto<BookingDto>(400, "Phải có ít nhất 1 chi tiết đặt sân.");

            var customerEmail = dto.CustomerEmail?.Trim();
            var customerName = dto.CustomerName?.Trim();
            User? customer;

            if (!string.IsNullOrEmpty(customerEmail))
            {
                customer = await _userRepository.GetByEmailAsync(customerEmail);
                if (customer == null)
                    return new ApiResponseDto<BookingDto>(404, $"Không tìm thấy tài khoản với email {customerEmail}. Dùng tên khách lẻ nếu chưa đăng ký.");
                if (customer.IsLocked)
                    return new ApiResponseDto<BookingDto>(400, "Tài khoản khách đang bị khóa.");
            }
            else if (!string.IsNullOrEmpty(customerName))
            {
                customer = await _userRepository.GetByEmailAsync(WalkInGuestEmail);
                if (customer == null)
                    return new ApiResponseDto<BookingDto>(500, "Chưa cấu hình tài khoản khách lẻ walkin@prosport.vn. Liên hệ quản trị.");
            }
            else
            {
                return new ApiResponseDto<BookingDto>(400, "Nhập email khách hoặc tên khách lẻ.");
            }

            decimal totalAmount = 0;
            var details = new List<BookingDetail>();

            TimeZoneInfo vnTz;
            try { vnTz = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time"); }
            catch { vnTz = TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh"); }
            var vnNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, vnTz);
            var courtCache = new Dictionary<int, Court>();

            foreach (var d in dto.Details)
            {
                if (d.BookingDate.Date < vnNow.Date)
                    return new ApiResponseDto<BookingDto>(400, "Không thể đặt sân cho ngày trong quá khứ.");

                if (d.EndTime <= d.StartTime)
                    return new ApiResponseDto<BookingDto>(400, "Giờ kết thúc phải sau giờ bắt đầu.");

                var duration = d.EndTime - d.StartTime;
                if (duration < TimeSpan.FromHours(1))
                    return new ApiResponseDto<BookingDto>(400, "Thời lượng đặt sân tối thiểu là 1 giờ.");
                if (duration > TimeSpan.FromHours(4))
                    return new ApiResponseDto<BookingDto>(400, "Thời lượng đặt sân tối đa là 4 giờ.");

                if (d.BookingDate.Date == vnNow.Date && d.EndTime <= vnNow.TimeOfDay)
                    return new ApiResponseDto<BookingDto>(400, "Khung giờ đã qua, vui lòng chọn slot khác.");

                if (!courtCache.TryGetValue(d.CourtId, out var court))
                {
                    court = await _courtRepository.GetByIdAsync(d.CourtId);
                    if (court != null) courtCache[d.CourtId] = court;
                }

            if (court == null || !CourtStatuses.IsBookable(court.Status))
                    return new ApiResponseDto<BookingDto>(400, $"Sân {d.CourtId} không khả dụng.");

                if (court.ComplexId.HasValue)
                    await _staffOperationGuard.EnsureCanCreateWalkInAsync(staffId, court.ComplexId.Value);

                var price = await CalculatePriceAsync(customer!.UserId, court, d.BookingDate, d.StartTime, d.EndTime);
                totalAmount += price;

                details.Add(new BookingDetail
                {
                    CourtId = d.CourtId,
                    BookingDate = d.BookingDate,
                    StartTime = d.StartTime,
                    EndTime = d.EndTime,
                    Price = price
                });
            }

            var booking = new Booking
            {
                UserId = customer!.UserId,
                TotalAmount = totalAmount,
                Status = BookingStatus.Confirmed,
                PaymentMethod = PaymentMethod.Cash,
                PaymentStatus = PaymentStatus.Paid,
                PaymentDeadline = null,
                BookingDetails = details
            };

            var created = await _bookingRepository.CreateWithTransactionAsync(booking);
            created.CheckInCode = $"QR-{created.BookingId}-{Guid.NewGuid().ToString()[..8]}";
            await _bookingRepository.UpdateAsync(created);

            var guestLabel = !string.IsNullOrEmpty(customerEmail)
                ? customerEmail
                : $"{customerName}{(string.IsNullOrEmpty(dto.CustomerPhone) ? "" : $" / {dto.CustomerPhone}")}";
            await CreateCashPaymentTransactionAsync(created, staffId, guestLabel, dto.Notes);

            if (!string.IsNullOrEmpty(customerEmail) && customer!.Email != WalkInGuestEmail
                && !string.IsNullOrEmpty(customer.Email))
            {
                var firstDetail = created.BookingDetails.FirstOrDefault();
                var courtNames = string.Join(", ", created.BookingDetails.Select(bd => bd.Court?.Name ?? $"Court {bd.CourtId}"));
                var detailsHtml = $@"
                    <p><b>Booking ID:</b> #{created.BookingId}</p>
                    <p><b>Courts:</b> {courtNames}</p>
                    <p><b>Date:</b> {firstDetail?.BookingDate:dd/MM/yyyy}</p>
                    <p><b>Time:</b> {firstDetail?.StartTime:HH\\:mm} - {firstDetail?.EndTime:HH\\:mm}</p>
                    <p><b>Total Paid (Cash):</b> {created.TotalAmount:N0} VND</p>";

                try
                {
                    await _emailService.SendBookingConfirmationEmailAsync(
                        customer.Email, customer.FullName, detailsHtml, created.CheckInCode);
                }
                catch (Exception emailEx)
                {
                    _logger.LogError(emailEx, "Failed to send walk-in confirmation email to {Email}", customer.Email);
                }
            }

            var reloaded = await _bookingRepository.GetByIdAsync(created.BookingId);
            return new ApiResponseDto<BookingDto>(201, "Đặt sân tại quầy thành công. Thanh toán tiền mặt đã xác nhận.", MapToDto(reloaded ?? created));
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("đã được đặt"))
        {
            return new ApiResponseDto<BookingDto>(409, ex.Message);
        }
        catch (OwnerAccessDeniedException ex)
        {
            return new ApiResponseDto<BookingDto>(403, ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating walk-in booking by staff {StaffId}", staffId);
            return new ApiResponseDto<BookingDto>(500, "An unexpected error occurred.");
        }
    }

    /// <summary>
    /// Tính giá sân dựa trên PricingRule và membership discount (nếu có).
    /// </summary>
    private async Task<decimal> CalculatePriceAsync(int userId, Court court, DateTime bookingDate, TimeSpan startTime, TimeSpan endTime)
    {
        var discountPercent = 0m;
        if (court.ComplexId.HasValue)
            discountPercent = await _membershipService.GetActiveDiscountPercentAsync(userId, court.ComplexId.Value, bookingDate);

        // Effective rules gồm cả rule theo loại sân — nav court.PricingRules bỏ sót chúng.
        var effectiveRules = await _courtRepository.GetPricingRulesByCourtIdAsync(court.CourtId);
        return BookingPriceCalculator.Calculate(court, bookingDate, startTime, endTime, discountPercent, effectiveRules);
    }

    public async Task<ApiResponseDto<BookingDto>> ConfirmBookingPaymentAsync(int bookingId, string vnpayTransactionId, decimal paidAmount)
    {
        try
        {
            var outcome = await _escrowRepository.ConfirmVnPayBookingPaymentAsync(bookingId, vnpayTransactionId, paidAmount);
            var booking = await _bookingRepository.GetByIdAsync(bookingId);

            switch (outcome)
            {
                case VnPayPaymentConfirmOutcome.NotFound:
                    return new ApiResponseDto<BookingDto>(404, "Booking not found");
                case VnPayPaymentConfirmOutcome.Expired:
                    return new ApiResponseDto<BookingDto>(400, "Booking đã hết hạn thanh toán. Vui lòng đặt lại.");
                case VnPayPaymentConfirmOutcome.AmountMismatch:
                    _logger.LogWarning(
                        "Payment amount mismatch for booking {BookingId}: expected {Expected}, got {Actual}",
                        bookingId, booking?.TotalAmount, paidAmount);
                    return new ApiResponseDto<BookingDto>(400,
                        $"Số tiền thanh toán ({paidAmount:N0}) không khớp với hóa đơn ({booking?.TotalAmount:N0})");
                case VnPayPaymentConfirmOutcome.DuplicateReference:
                    return booking?.PaymentStatus == PaymentStatus.Paid
                        ? new ApiResponseDto<BookingDto>(200, "Thanh toán thành công", MapToDto(booking))
                        : new ApiResponseDto<BookingDto>(409, "Mã giao dịch VNPay đã được sử dụng.");
                case VnPayPaymentConfirmOutcome.AlreadyPaid:
                    return new ApiResponseDto<BookingDto>(400, "Booking đã được thanh toán.");
                case VnPayPaymentConfirmOutcome.Success:
                    break;
                default:
                    return new ApiResponseDto<BookingDto>(500, "An unexpected error occurred.");
            }

            booking ??= await _bookingRepository.GetByIdAsync(bookingId);
            if (booking == null)
                return new ApiResponseDto<BookingDto>(404, "Booking not found");

            if (booking.User != null && !string.IsNullOrEmpty(booking.User.Email))
            {
                var courtNames = string.Join(", ", booking.BookingDetails.Select(bd => bd.Court?.Name ?? $"Court {bd.CourtId}"));
                var firstDetail = booking.BookingDetails.FirstOrDefault();
                var bookingDate = firstDetail?.BookingDate.ToString("dd/MM/yyyy");
                var timeRange = $"{firstDetail?.StartTime:hh\\:mm} - {firstDetail?.EndTime:hh\\:mm}";

                var detailsHtml = $@"
                    <p><b>Booking ID:</b> #{booking.BookingId}</p>
                    <p><b>Courts:</b> {courtNames}</p>
                    <p><b>Date:</b> {bookingDate}</p>
                    <p><b>Time:</b> {timeRange}</p>
                    <p><b>Total Paid:</b> {booking.TotalAmount:N0} VND</p>
                ";

                try
                {
                    await _emailService.SendBookingConfirmationEmailAsync(
                        booking.User.Email,
                        booking.User.FullName,
                        detailsHtml,
                        booking.CheckInCode ?? string.Empty);
                }
                catch (Exception emailEx)
                {
                    _logger.LogError(emailEx, "Failed to send booking confirmation email to {Email}", booking.User.Email);
                }
            }

            return new ApiResponseDto<BookingDto>(200, "Thanh toán thành công", MapToDto(booking));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error confirming payment for booking {BookingId}", bookingId);
            return new ApiResponseDto<BookingDto>(500, "An unexpected error occurred.");
        }
    }

    /// <summary>
    /// Legacy helper retained for cash walk-in audit; VNPay uses ConfirmVnPayBookingPaymentAsync.
    /// </summary>
    private async Task CreatePaymentTransactionAsync(Booking booking, string vnpayTransactionId)
    {
        try
        {
            // Tìm escrow wallet của user để gắn transaction
            var wallet = await _escrowRepository.GetWalletByUserIdAsync(booking.UserId);
            if (wallet == null)
            {
                // Auto-create wallet nếu chưa có
                wallet = new EscrowWallet { UserId = booking.UserId, Balance = 0, LockedBalance = 0 };
                await _escrowRepository.CreateWalletAsync(wallet);
            }

            // Idempotency check: Không tạo duplicate transaction
            var existingTransactions = await _escrowRepository.GetTransactionsByWalletIdAsync(wallet.EscrowWalletId);
            if (existingTransactions.Any(t => t.ReferenceId == vnpayTransactionId))
            {
                _logger.LogInformation("Transaction with ReferenceId {VnPayTxnId} already exists, skipping duplicate.", vnpayTransactionId);
                return;
            }

            var transaction = new Transaction
            {
                EscrowWalletId = wallet.EscrowWalletId,
                BookingId = booking.BookingId,
                Amount = booking.TotalAmount,
                Type = TransactionType.Payment,
                Status = TransactionStatus.Completed,
                ReferenceId = vnpayTransactionId,
                Description = $"Thanh toán VNPay đặt sân mã #{booking.BookingId}"
            };

            await _escrowRepository.AddTransactionAsync(transaction);
        }
        catch (Exception ex)
        {
            // Log nhưng không throw — payment đã thành công, chỉ thiếu audit record
            _logger.LogError(ex, "Failed to create transaction record for booking {BookingId}", booking.BookingId);
        }
    }

    private async Task CreateCashPaymentTransactionAsync(Booking booking, int staffId, string guestLabel, string? notes)
    {
        try
        {
            var wallet = await _escrowRepository.GetWalletByUserIdAsync(booking.UserId);
            if (wallet == null)
            {
                wallet = new EscrowWallet { UserId = booking.UserId, Balance = 0, LockedBalance = 0 };
                await _escrowRepository.CreateWalletAsync(wallet);
            }

            var referenceId = $"CASH-{booking.BookingId}-{staffId}";
            var existingTransactions = await _escrowRepository.GetTransactionsByWalletIdAsync(wallet.EscrowWalletId);
            if (existingTransactions.Any(t => t.ReferenceId == referenceId))
                return;

            var noteSuffix = string.IsNullOrWhiteSpace(notes) ? "" : $" | {notes.Trim()}";
            var transaction = new Transaction
            {
                EscrowWalletId = wallet.EscrowWalletId,
                BookingId = booking.BookingId,
                Amount = booking.TotalAmount,
                Type = TransactionType.Payment,
                Status = TransactionStatus.Completed,
                ReferenceId = referenceId,
                Description = $"Thanh toán tiền mặt tại quầy #{booking.BookingId} — {guestLabel}{noteSuffix}"
            };

            await _escrowRepository.AddTransactionAsync(transaction);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to create cash transaction for walk-in booking {BookingId}", booking.BookingId);
        }
    }

    public async Task<ApiResponseDto<bool>> CancelBookingAsync(int userId, int bookingId)
    {
        try
        {
            var booking = await _bookingRepository.GetByIdAsync(bookingId);
            if (booking == null) return new ApiResponseDto<bool>(404, "Booking not found");

            if (booking.UserId != userId) return new ApiResponseDto<bool>(403, "Forbidden");

            if (booking.Status == BookingStatus.Cancelled || booking.Status == BookingStatus.Completed)
                return new ApiResponseDto<bool>(400, $"Không thể hủy booking ở trạng thái {booking.Status}");

            string cancelMessage;

            // Chỉ tính phí phạt nếu booking ĐÃ THANH TOÁN
            if (booking.PaymentStatus == Domain.Constants.PaymentStatus.Paid)
            {
                var preview = await _cancellationPolicy.CalculateBookingRefundAsync(booking);
                booking.CancellationFee = preview.PenaltyAmount;
                var refundAmount = preview.RefundAmount;

                // Refund vào ví Escrow theo chính sách complex
                if (refundAmount > 0)
                {
                    var refundResult = await _escrowRepository.ExecuteInTransactionAsync(async () =>
                    {
                        var wallet = await _escrowRepository.CreditWalletAsync(booking.UserId, refundAmount);

                        var transaction = new Transaction
                        {
                            EscrowWalletId = wallet.EscrowWalletId,
                            BookingId = booking.BookingId,
                            Amount = refundAmount,
                            Type = TransactionType.Refund,
                            Status = TransactionStatus.Completed,
                            Description = $"Hoàn tiền hủy sân mã #{booking.BookingId} ({preview.RefundPercent}% — {preview.Message})"
                        };
                        await _escrowRepository.AddTransactionAsync(transaction);
                        return true;
                    });

                    if (refundResult)
                    {
                        booking.PaymentStatus = Domain.Constants.PaymentStatus.Refunded;
                    }
                    else
                    {
                        _logger.LogError("Failed to refund {Amount} for booking {BookingId}", refundAmount, bookingId);
                    }
                }

                cancelMessage = $"Hủy đặt sân thành công. {preview.Message} Tiền hoàn {refundAmount:N0} VNĐ.";
            }
            else
            {
                // Booking Pending chưa thanh toán → hủy miễn phí, không phạt
                booking.CancellationFee = 0;
                cancelMessage = "Hủy đặt sân thành công. Không phát sinh phí phạt do chưa thanh toán.";
            }

            booking.Status = BookingStatus.Cancelled;
            await _bookingRepository.UpdateAsync(booking);

            return new ApiResponseDto<bool>(200, cancelMessage, true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error cancelling booking {BookingId} for user {UserId}", bookingId, userId);
            return new ApiResponseDto<bool>(500, "An unexpected error occurred.");
        }
    }

    public async Task<ApiResponseDto<BookingDto>> ProcessCheckInAsync(string checkInCode, int staffId)
    {
        try
        {
            var booking = await _bookingRepository.GetByCheckInCodeAsync(checkInCode);
            if (booking == null) return new ApiResponseDto<BookingDto>(404, "Mã Check-in không hợp lệ hoặc không tồn tại.");

            // BUG-05 FIX: Only Confirmed bookings should be allowed for check-in (Completed = already done)
            if (booking.Status != BookingStatus.Confirmed)
                return new ApiResponseDto<BookingDto>(400, $"Booking đang ở trạng thái {booking.Status}, không thể check-in.");

            if (booking.CheckIn != null)
                return new ApiResponseDto<BookingDto>(400, $"Sân đã được check-in vào lúc {booking.CheckIn.CheckInTime:HH:mm dd/MM/yyyy}.");

            var firstDetail = booking.BookingDetails.FirstOrDefault();
            if (firstDetail != null)
            {
                var court = await _courtRepository.GetByIdAsync(firstDetail.CourtId);
                if (court?.ComplexId != null)
                    await _staffOperationGuard.EnsureCanCheckInAsync(staffId, court.ComplexId.Value);

                // Cross-platform timezone: try Windows ID first, fallback to IANA (Linux/Docker)
                TimeZoneInfo vnTz2;
                try { vnTz2 = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time"); }
                catch { vnTz2 = TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh"); }
                var vnNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, vnTz2);
                var startTime = firstDetail.BookingDate.Date.Add(firstDetail.StartTime);
                var endTime = firstDetail.BookingDate.Date.Add(firstDetail.EndTime);

                if (vnNow < startTime.AddMinutes(-30))
                    return new ApiResponseDto<BookingDto>(400, $"Chưa đến giờ check-in. Chỉ cho phép check-in từ {startTime.AddMinutes(-30):HH:mm} trở đi.");

                if (vnNow > endTime)
                    return new ApiResponseDto<BookingDto>(400, "Đã quá giờ thuê sân, không thể check-in.");
            }

            booking.CheckIn = new CheckIn
            {
                BookingId = booking.BookingId,
                StaffId = staffId,
                CheckInTime = DateTime.UtcNow,
                Notes = "Checked in via QR Code Scanner"
            };
            booking.Status = BookingStatus.CheckedIn;

            await _bookingRepository.UpdateAsync(booking);

            return new ApiResponseDto<BookingDto>(200, "Check-in thành công!", MapToDto(booking));
        }
        catch (OwnerAccessDeniedException ex)
        {
            return new ApiResponseDto<BookingDto>(403, ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing check in for code {CheckInCode}", checkInCode);
            return new ApiResponseDto<BookingDto>(500, "An unexpected error occurred.");
        }
    }

    public async Task<ApiResponseDto<BookingDto>> ProcessCheckInForBookingAsync(int bookingId, int staffId, string? checkInCode)
    {
        var booking = await _bookingRepository.GetByIdAsync(bookingId);
        if (booking == null)
            return new ApiResponseDto<BookingDto>(404, "Không tìm thấy booking.");

        if (!string.IsNullOrWhiteSpace(checkInCode) && booking.CheckInCode != checkInCode)
            return new ApiResponseDto<BookingDto>(400, "Mã check-in không khớp.");

        return await ProcessCheckInAsync(booking.CheckInCode ?? "", staffId);
    }

    public async Task<ApiResponseDto<bool>> CancelBookingAsOperatorAsync(int operatorUserId, int bookingId)
    {
        var booking = await _bookingRepository.GetByIdAsync(bookingId);
        if (booking == null)
            return new ApiResponseDto<bool>(404, "Booking not found");

        if (booking.Status == BookingStatus.Cancelled || booking.Status == BookingStatus.Completed)
            return new ApiResponseDto<bool>(400, $"Không thể hủy booking ở trạng thái {booking.Status}");

        // Operator/owner forced cancel (weather, outage) — customer is not at fault; full refund, no penalty.
        var cancellationFee = 0m;
        var refundAmount = booking.PaymentStatus == PaymentStatus.Paid ? booking.TotalAmount : 0m;

        var cancelled = await _escrowRepository.CancelBookingWithRefundAsync(
            bookingId,
            cancellationFee,
            refundAmount,
            "Hủy bởi operator",
            $"OperatorCancel_{bookingId}");

        if (!cancelled)
        {
            _logger.LogError("Operator cancel failed for booking {BookingId}", bookingId);
            return new ApiResponseDto<bool>(500, "Không thể hủy booking.");
        }

        return new ApiResponseDto<bool>(200, "Hủy booking thành công.", true);
    }

    public async Task<ApiResponseDto<bool>> CancelAndRefundSystemAsync(int bookingId, string reason)
    {
        try
        {
            var booking = await _bookingRepository.GetByIdAsync(bookingId);
            if (booking == null)
                return new ApiResponseDto<bool>(404, "Booking not found");

            if (booking.Status == BookingStatus.Cancelled || booking.Status == BookingStatus.Completed)
                return new ApiResponseDto<bool>(200, "Booking đã ở trạng thái cuối.", true);

            var refundAmount = booking.PaymentStatus == PaymentStatus.Paid ? booking.TotalAmount : 0;
            var cancelled = await _escrowRepository.CancelBookingWithRefundAsync(
                bookingId,
                cancellationFee: 0,
                refundAmount,
                reason,
                $"SystemCancel_{bookingId}");

            if (!cancelled)
            {
                _logger.LogError("System cancel failed for booking {BookingId}", bookingId);
                return new ApiResponseDto<bool>(500, "Không thể hủy booking.");
            }

            try
            {
                await _notificationService.SendToUserAsync(booking.UserId, new RealtimeNotificationDto
                {
                    Type = "booking_system_cancelled",
                    Title = "Đặt sân bị hủy",
                    Message = reason,
                    Data = new { bookingId = booking.BookingId }
                });
            }
            catch (Exception notifyEx)
            {
                _logger.LogWarning(notifyEx, "Notification failed for system cancel booking {BookingId}", bookingId);
            }

            return new ApiResponseDto<bool>(200, "Đã hủy và hoàn tiền booking.", true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "System cancel failed for booking {BookingId}", bookingId);
            return new ApiResponseDto<bool>(500, "An unexpected error occurred.");
        }
    }

    private async Task<bool> RefundPaidBookingPartialAsync(Booking booking, decimal refundAmount, string reason)
    {
        if (refundAmount <= 0)
            return true;

        if (booking.IsSplitPayment && booking.PaymentShares.Count > 0)
        {
            var paidShares = booking.PaymentShares.Where(s => s.Status == PaymentShareStatus.Paid).ToList();
            var totalPaid = paidShares.Sum(s => s.Amount);
            if (totalPaid <= 0)
                return true;

            foreach (var share in paidShares)
            {
                var shareRefund = Math.Round(refundAmount * (share.Amount / totalPaid), 2, MidpointRounding.AwayFromZero);
                if (shareRefund <= 0)
                    continue;

                var ok = await _escrowRepository.RefundSplitShareAtomicAsync(
                    share.UserId, booking.BookingId, share.BookingPaymentShareId, shareRefund);
                if (!ok)
                    return false;
            }

            return true;
        }

        return await _escrowRepository.ExecuteInTransactionAsync(async () =>
        {
            var wallet = await _escrowRepository.CreditWalletAsync(booking.UserId, refundAmount);

            await _escrowRepository.AddTransactionAsync(new Transaction
            {
                EscrowWalletId = wallet.EscrowWalletId,
                BookingId = booking.BookingId,
                Amount = refundAmount,
                Type = TransactionType.Refund,
                Status = TransactionStatus.Completed,
                Description = $"Hoàn {refundAmount:N0} VNĐ do hủy booking #{booking.BookingId}: {reason}"
            });

            return true;
        });
    }

    private async Task<bool> RefundPaidBookingAsync(Booking booking, string reason)
    {
        if (booking.IsSplitPayment && booking.PaymentShares.Count > 0)
        {
            foreach (var share in booking.PaymentShares.Where(s => s.Status == PaymentShareStatus.Paid))
            {
                var ok = await _escrowRepository.RefundSplitShareAtomicAsync(
                    share.UserId, booking.BookingId, share.BookingPaymentShareId, share.Amount);
                if (!ok)
                    return false;
            }

            return true;
        }

        var refundAmount = booking.TotalAmount;
        if (refundAmount <= 0)
            return true;

        return await _escrowRepository.ExecuteInTransactionAsync(async () =>
        {
            var wallet = await _escrowRepository.CreditWalletAsync(booking.UserId, refundAmount);

            await _escrowRepository.AddTransactionAsync(new Transaction
            {
                EscrowWalletId = wallet.EscrowWalletId,
                BookingId = booking.BookingId,
                Amount = refundAmount,
                Type = TransactionType.Refund,
                Status = TransactionStatus.Completed,
                Description = $"Hoàn 100% do hủy hệ thống #{booking.BookingId}: {reason}"
            });

            return true;
        });
    }

    public async Task<ApiResponseDto<BookingDto>> UpdateBookingStatusAsync(int bookingId, string status, int actorUserId)
    {
        var allowed = new[] { BookingStatus.Confirmed, BookingStatus.CheckedIn, BookingStatus.Completed, BookingStatus.Cancelled, BookingStatus.NoShow };
        if (!allowed.Contains(status, StringComparer.OrdinalIgnoreCase))
            return new ApiResponseDto<BookingDto>(400, "Trạng thái không hợp lệ.");

        var booking = await _bookingRepository.GetByIdAsync(bookingId);
        if (booking == null)
            return new ApiResponseDto<BookingDto>(404, "Booking not found");

        booking.Status = status;
        booking.UpdatedAt = DateTime.UtcNow;
        await _bookingRepository.UpdateAsync(booking);

        return new ApiResponseDto<BookingDto>(200, "Cập nhật trạng thái thành công.", MapToDto(booking));
    }

    private static IEnumerable<BookingDto> MapToDtos(IEnumerable<Booking> bookings)
    {
        return bookings.Select(MapToDto);
    }

    private static BookingDto MapToDto(Booking booking)
    {
        return new BookingDto
        {
            BookingId = booking.BookingId,
            UserId = booking.UserId,
            CustomerName = booking.User?.FullName,
            TotalAmount = booking.TotalAmount,
            Status = booking.Status,
            PaymentMethod = booking.PaymentMethod,
            PaymentStatus = booking.PaymentStatus,
            CheckInCode = booking.CheckInCode,
            PaymentDeadline = booking.PaymentDeadline,
            Details = booking.BookingDetails.Select(bd => new BookingDetailDto
            {
                CourtId = bd.CourtId,
                CourtName = bd.Court?.Name ?? "Unknown",
                BookingDate = bd.BookingDate,
                StartTime = bd.StartTime,
                EndTime = bd.EndTime,
                Price = bd.Price
            }).ToList()
        };
    }
}
