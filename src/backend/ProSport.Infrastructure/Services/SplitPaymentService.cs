using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using ProSport.Application.Services;
using ProSport.Domain.Constants;
using ProSport.Domain.Entities;
using ProSport.Infrastructure.Data;

namespace ProSport.Infrastructure.Services;

public class SplitPaymentService : ISplitPaymentService
{
    private readonly ProSportDbContext _db;
    private readonly IBookingRepository _bookingRepository;
    private readonly ICourtRepository _courtRepository;
    private readonly IEscrowRepository _escrowRepository;
    private readonly IUserRepository _userRepository;
    private readonly INotificationService _notifications;
    private readonly IMembershipService _membershipService;
    private readonly ILogger<SplitPaymentService> _logger;

    public SplitPaymentService(
        ProSportDbContext db,
        IBookingRepository bookingRepository,
        ICourtRepository courtRepository,
        IEscrowRepository escrowRepository,
        IUserRepository userRepository,
        INotificationService notifications,
        IMembershipService membershipService,
        ILogger<SplitPaymentService> logger)
    {
        _db = db;
        _bookingRepository = bookingRepository;
        _courtRepository = courtRepository;
        _escrowRepository = escrowRepository;
        _userRepository = userRepository;
        _notifications = notifications;
        _membershipService = membershipService;
        _logger = logger;
    }

    public async Task<ApiResponseDto<BookingDto>> CreateSplitBookingAsync(int hostUserId, CreateSplitBookingDto dto)
    {
        try
        {
            if (dto.Participants.Count < 2)
                return new ApiResponseDto<BookingDto>(400, "Cần ít nhất 2 người tham gia chia bill.");

            var createDto = new CreateBookingDto { UserId = hostUserId, Details = dto.Details };
            var bookingService = new BookingServiceProxy(_bookingRepository, _courtRepository, _membershipService);
            var (total, details, error) = await bookingService.ValidateAndBuildDetailsAsync(createDto);
            if (error != null) return new ApiResponseDto<BookingDto>(400, error);

            var participantSum = dto.Participants.Sum(p => p.Amount);
            if (Math.Abs(participantSum - total) > 0.01m)
                return new ApiResponseDto<BookingDto>(400, $"Tổng phần chia ({participantSum:N0}) phải bằng tổng đơn ({total:N0}).");

            var deadline = DateTime.UtcNow.AddHours(Math.Clamp(dto.SplitDeadlineHours, 1, 72));
            var shares = new List<BookingPaymentShare>();

            foreach (var p in dto.Participants)
            {
                int userId;
                if (p.UserId.HasValue)
                    userId = p.UserId.Value;
                else if (!string.IsNullOrWhiteSpace(p.Email))
                {
                    var user = await _userRepository.GetByEmailAsync(p.Email.Trim());
                    if (user == null)
                        return new ApiResponseDto<BookingDto>(404, $"Không tìm thấy user với email {p.Email}");
                    userId = user.UserId;
                }
                else
                    return new ApiResponseDto<BookingDto>(400, "Mỗi participant cần UserId hoặc Email.");

                shares.Add(new BookingPaymentShare
                {
                    UserId = userId,
                    Amount = p.Amount,
                    Status = PaymentShareStatus.Pending,
                    PaymentDeadline = deadline,
                    IsHost = userId == hostUserId
                });
            }

            var booking = new Booking
            {
                UserId = hostUserId,
                TotalAmount = total,
                Status = BookingStatus.Pending,
                PaymentMethod = PaymentMethod.Escrow,
                PaymentStatus = PaymentStatus.Pending,
                PaymentDeadline = deadline,
                IsSplitPayment = true,
                SplitPaymentDeadline = deadline,
                BookingDetails = details,
                PaymentShares = shares
            };

            var created = await _bookingRepository.CreateWithTransactionAsync(booking);

            foreach (var share in shares.Where(s => s.UserId != hostUserId))
            {
                await _notifications.SendToUserAsync(share.UserId, new RealtimeNotificationDto
                {
                    Type = "split_payment_invite",
                    Title = "Lời mời chia bill đặt sân",
                    Message = $"Bạn được mời trả {share.Amount:N0} VNĐ cho booking #{created.BookingId}",
                    Data = new { bookingId = created.BookingId, amount = share.Amount }
                });
            }

            return new ApiResponseDto<BookingDto>(201, "Tạo đơn chia bill thành công.", MapBooking(created));
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("đã được đặt"))
        {
            return new ApiResponseDto<BookingDto>(409, ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "CreateSplitBooking failed for user {UserId}", hostUserId);
            return new ApiResponseDto<BookingDto>(500, "Lỗi tạo đơn chia bill.");
        }
    }

    public async Task<ApiResponseDto<bool>> PayShareAsync(int userId, int bookingId)
    {
        var share = await _db.BookingPaymentShares
            .FirstOrDefaultAsync(s => s.BookingId == bookingId && s.UserId == userId && s.Status == PaymentShareStatus.Pending);
        if (share == null)
            return new ApiResponseDto<bool>(404, "Không tìm thấy phần thanh toán của bạn.");

        var ok = await _escrowRepository.PaySplitShareAtomicAsync(userId, bookingId, share.BookingPaymentShareId, share.Amount);
        if (!ok)
            return new ApiResponseDto<bool>(400, "Không thể thanh toán. Kiểm tra số dư ví hoặc hạn thanh toán.");

        var booking = await _db.Bookings.Include(b => b.PaymentShares).FirstAsync(b => b.BookingId == bookingId);
        if (booking.PaymentStatus == PaymentStatus.Paid)
        {
            await _notifications.SendToUserAsync(booking.UserId, new RealtimeNotificationDto
            {
                Type = "split_payment_complete",
                Title = "Chia bill hoàn tất",
                Message = $"Booking #{bookingId} đã được thanh toán đủ.",
                Data = new { bookingId }
            });
        }

        return new ApiResponseDto<bool>(200, "Thanh toán phần chia bill thành công.", true);
    }

    public async Task<ApiResponseDto<IEnumerable<BookingPaymentShareDto>>> GetSharesAsync(int bookingId, int userId)
    {
        var booking = await _db.Bookings.AsNoTracking().FirstOrDefaultAsync(b => b.BookingId == bookingId);
        if (booking == null) return new ApiResponseDto<IEnumerable<BookingPaymentShareDto>>(404, "Booking not found");

        var isParticipant = await _db.BookingPaymentShares.AnyAsync(s => s.BookingId == bookingId && s.UserId == userId);
        if (booking.UserId != userId && !isParticipant)
            return new ApiResponseDto<IEnumerable<BookingPaymentShareDto>>(403, "Forbidden");

        var shares = await _db.BookingPaymentShares.AsNoTracking()
            .Include(s => s.User)
            .Where(s => s.BookingId == bookingId)
            .Select(s => new BookingPaymentShareDto
            {
                ShareId = s.BookingPaymentShareId,
                BookingId = s.BookingId,
                UserId = s.UserId,
                UserName = s.User.FullName,
                Amount = s.Amount,
                Status = s.Status,
                PaymentDeadline = s.PaymentDeadline,
                IsHost = s.IsHost
            }).ToListAsync();

        return new ApiResponseDto<IEnumerable<BookingPaymentShareDto>>(200, "Success", shares);
    }

    public async Task<int> ExpireUnpaidSharesAsync()
    {
        var now = DateTime.UtcNow;
        var expiredBookings = await _db.Bookings
            .Include(b => b.PaymentShares)
            .Where(b => b.IsSplitPayment
                && b.Status == BookingStatus.Pending
                && b.PaymentStatus != PaymentStatus.Paid
                && b.SplitPaymentDeadline != null
                && b.SplitPaymentDeadline < now)
            .ToListAsync();

        var count = 0;
        foreach (var booking in expiredBookings)
        {
            foreach (var share in booking.PaymentShares.Where(s => s.Status == PaymentShareStatus.Paid))
            {
                var refunded = await _escrowRepository.RefundSplitShareAtomicAsync(
                    share.UserId, booking.BookingId, share.BookingPaymentShareId, share.Amount);
                if (!refunded)
                {
                    _logger.LogWarning(
                        "Failed to refund split share {ShareId} for booking {BookingId}",
                        share.BookingPaymentShareId, booking.BookingId);
                    continue;
                }

                share.Status = PaymentShareStatus.Refunded;
            }

            booking.Status = BookingStatus.Cancelled;
            booking.PaymentStatus = PaymentStatus.Refunded;
            foreach (var share in booking.PaymentShares.Where(s => s.Status == PaymentShareStatus.Pending))
                share.Status = PaymentShareStatus.Expired;

            await _notifications.SendToUserAsync(booking.UserId, new RealtimeNotificationDto
            {
                Type = "split_payment_expired",
                Title = "Chia bill hết hạn",
                Message = $"Booking #{booking.BookingId} đã bị hủy do chưa thanh toán đủ. Các khoản đã trả được hoàn về ví.",
                Data = new { bookingId = booking.BookingId }
            });

            count++;
        }

        if (count > 0)
            await _db.SaveChangesAsync();

        return count;
    }

    private static BookingDto MapBooking(Booking b) => new()
    {
        BookingId = b.BookingId,
        UserId = b.UserId,
        TotalAmount = b.TotalAmount,
        Status = b.Status,
        PaymentMethod = b.PaymentMethod,
        PaymentStatus = b.PaymentStatus,
        CheckInCode = b.CheckInCode,
        PaymentDeadline = b.PaymentDeadline
    };

    /// <summary>Lightweight helper — reuses booking validation without circular DI.</summary>
    private sealed class BookingServiceProxy
    {
        private readonly IBookingRepository _repo;
        private readonly ICourtRepository _courts;
        private readonly IMembershipService _membership;

        public BookingServiceProxy(IBookingRepository repo, ICourtRepository courts, IMembershipService membership)
        {
            _repo = repo;
            _courts = courts;
            _membership = membership;
        }

        public async Task<(decimal total, List<BookingDetail> details, string? error)> ValidateAndBuildDetailsAsync(CreateBookingDto dto)
        {
            if (dto.Details == null || !dto.Details.Any())
                return (0, new(), "Phải có ít nhất 1 chi tiết đặt sân.");

            decimal total = 0;
            var details = new List<BookingDetail>();
            foreach (var d in dto.Details)
            {
                if (d.EndTime <= d.StartTime)
                    return (0, new(), "Giờ kết thúc phải sau giờ bắt đầu.");
                var court = await _courts.GetByIdAsync(d.CourtId);
                if (court == null || !CourtStatuses.IsBookable(court.Status))
                    return (0, new(), $"Sân {d.CourtId} không khả dụng.");
                var discountPercent = court.ComplexId.HasValue
                    ? await _membership.GetActiveDiscountPercentAsync(dto.UserId, court.ComplexId.Value, d.BookingDate)
                    : 0m;
                var price = BookingPriceCalculator.Calculate(court, d.BookingDate, d.StartTime, d.EndTime, discountPercent);
                total += price;
                details.Add(new BookingDetail
                {
                    CourtId = d.CourtId,
                    BookingDate = d.BookingDate,
                    StartTime = d.StartTime,
                    EndTime = d.EndTime,
                    Price = price
                });
            }
            return (total, details, null);
        }
    }
}
