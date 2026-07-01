using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using ProSport.Domain.Constants;
using System.Security.Claims;

namespace ProSport.API.Controllers;

[Route("api/payment")]
[ApiController]
public class PaymentController : ControllerBase
{
    private readonly IVnPayService _vnPayService;
    private readonly IEscrowService _escrowService;
    private readonly IEscrowRepository _escrowRepository;
    private readonly IBookingService _bookingService;
    private readonly IConfiguration _configuration;
    private readonly ILogger<PaymentController> _logger;

    public PaymentController(
        IVnPayService vnPayService,
        IEscrowService escrowService,
        IEscrowRepository escrowRepository,
        IBookingService bookingService,
        IConfiguration configuration,
        ILogger<PaymentController> logger)
    {
        _vnPayService = vnPayService;
        _escrowService = escrowService;
        _escrowRepository = escrowRepository;
        _bookingService = bookingService;
        _configuration = configuration;
        _logger = logger;
    }

    [Authorize]
    [HttpPost("vnpay/create-url")]
    public async Task<IActionResult> CreatePaymentUrl([FromQuery] decimal amount, [FromQuery] string orderType, [FromQuery] string referenceId)
    {
        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized(new ApiResponseDto<object>(401, "Unauthorized"));
        }

        if (string.IsNullOrWhiteSpace(orderType) || string.IsNullOrWhiteSpace(referenceId))
        {
            return BadRequest(new ApiResponseDto<object>(400, "Thiếu thông tin thanh toán"));
        }

        // Bảo mật: Lấy số tiền thực tế từ DB nếu là Booking + check ownership
        if (orderType == VnPayOrderType.Booking)
        {
            if (int.TryParse(referenceId, out int bookingId))
            {
                var bookingRes = await _bookingService.GetBookingByIdAsync(bookingId);
                if (bookingRes.StatusCode != 200 || bookingRes.Data == null)
                {
                    return BadRequest(bookingRes);
                }

                // Security: Kiểm tra booking thuộc user hiện tại
                if (bookingRes.Data.UserId != userId)
                {
                    return Forbid();
                }

                if (bookingRes.Data.Status != BookingStatus.Pending)
                {
                    return BadRequest(new ApiResponseDto<object>(400, $"Booking đang ở trạng thái {bookingRes.Data.Status}, không thể thanh toán"));
                }

                // Kiểm tra booking đã thanh toán chưa
                if (bookingRes.Data.PaymentStatus == PaymentStatus.Paid)
                {
                    return BadRequest(new ApiResponseDto<object>(400, "Booking đã được thanh toán"));
                }

                if (bookingRes.Data.PaymentDeadline.HasValue && DateTime.UtcNow > bookingRes.Data.PaymentDeadline.Value)
                {
                    return BadRequest(new ApiResponseDto<object>(400, "Booking đã hết hạn thanh toán. Vui lòng đặt lại."));
                }

                // Lấy số tiền từ DB, không tin FE gửi lên
                amount = bookingRes.Data.TotalAmount;
            }
            else
            {
                return BadRequest(new ApiResponseDto<object>(400, "ReferenceId không hợp lệ"));
            }
        }
        else if (orderType == VnPayOrderType.Deposit)
        {
            if (amount <= 0)
            {
                return BadRequest(new ApiResponseDto<object>(400, "Số tiền nạp ví phải lớn hơn 0"));
            }
        }
        else
        {
            return BadRequest(new ApiResponseDto<object>(400, "Loại thanh toán không hợp lệ"));
        }

        try
        {
            var url = _vnPayService.CreatePaymentUrl(ipAddress, userId, amount, orderType, referenceId);
            return Ok(new ApiResponseDto<string>(200, "Tạo URL thanh toán thành công", url));
        }
        catch (InvalidOperationException ex)
        {
            return StatusCode(503, new ApiResponseDto<object>(503, ex.Message));
        }
    }

    /// <summary>
    /// IPN endpoint — VNPay server gọi trực tiếp (server-to-server).
    /// Đây là nơi CẬP NHẬT trạng thái booking/ví. Idempotent.
    /// Trả về RspCode theo đúng format VNPay yêu cầu.
    /// </summary>
    [HttpGet("vnpay/ipn")]
    public async Task<IActionResult> VnPayIpn()
    {
        try
        {
            if (!IsAllowedVnPayIp())
            {
                _logger.LogWarning("VNPay IPN rejected from IP {Ip}", HttpContext.Connection.RemoteIpAddress);
                return Ok(new { RspCode = "97", Message = "Unauthorized IP" });
            }

            var queryDictionary = Request.Query
                .Select(k => new KeyValuePair<string, string>(k.Key, k.Value.ToString()!))
                .ToList();
            var response = _vnPayService.GetPaymentResult(queryDictionary);

            _logger.LogInformation(
                "VNPay IPN received: OrderType={OrderType}, ReferenceId={RefId}, Amount={Amount}, ResponseCode={Code}, TxnId={TxnId}",
                response.OrderType, response.ReferenceId, response.Amount, response.VnPayResponseCode, response.VnPayTransactionId);

            if (!response.IsValidSignature)
            {
                _logger.LogWarning("VNPay IPN: Invalid signature. ResponseCode: {Code}", response.VnPayResponseCode);
                return Ok(new { RspCode = "97", Message = "Invalid signature" });
            }

            if (!response.Success)
            {
                _logger.LogInformation("VNPay IPN: Payment not successful. ResponseCode: {Code}", response.VnPayResponseCode);
                return Ok(new { RspCode = "00", Message = "Payment failed or cancelled" });
            }

            // Xử lý nạp tiền ví Escrow
            if (response.OrderType == "Deposit")
            {
                if (response.UserId > 0)
                {
                    var depositRes = await _escrowService.DepositAsync(
                        response.UserId, response.Amount, response.VnPayTransactionId, "Nạp tiền VNPAY");
                    if (depositRes.StatusCode == 200)
                    {
                        return Ok(new { RspCode = "00", Message = "Confirm Success" });
                    }
                }
                return Ok(new { RspCode = "99", Message = "Error processing deposit" });
            }
            // Xử lý thanh toán booking
            else if (response.OrderType == "Booking")
            {
                if (int.TryParse(response.ReferenceId, out int bookingId))
                {
                    var confirmRes = await _bookingService.ConfirmBookingPaymentAsync(
                        bookingId, response.VnPayTransactionId, response.Amount);

                    _logger.LogInformation("IPN ConfirmBookingPayment result: BookingId={BookingId}, StatusCode={StatusCode}, Message={Message}",
                        bookingId, confirmRes.StatusCode, confirmRes.Message);

                    if (confirmRes.StatusCode == 200)
                    {
                        return Ok(new { RspCode = "00", Message = "Confirm Success" });
                    }
                    // Booking đã thanh toán rồi (idempotent) → vẫn trả 00
                    if (confirmRes.StatusCode == 400 && confirmRes.Message?.Contains("đã được thanh toán") == true)
                    {
                        return Ok(new { RspCode = "00", Message = "Already confirmed" });
                    }
                    return Ok(new { RspCode = "99", Message = confirmRes.Message });
                }
                return Ok(new { RspCode = "99", Message = "Invalid Booking ReferenceId" });
            }

            return Ok(new { RspCode = "99", Message = "Unknown order type" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "VNPay IPN processing error");
            return Ok(new { RspCode = "99", Message = "Internal error" });
        }
    }

    /// <summary>
    /// Return URL — User được redirect về đây sau khi thanh toán trên VNPay.
    /// CHỈ ĐỌC trạng thái và trả về kết quả cho frontend hiển thị.
    /// DB đã được cập nhật bởi IPN endpoint (hoặc sẽ cập nhật ngay sau).
    /// Nếu IPN chưa kịp xử lý, gọi ConfirmBookingPaymentAsync như fallback (idempotent).
    /// </summary>
    [HttpGet("vnpay/return")]
    public async Task<IActionResult> VnPayReturn()
    {
        var queryDictionary = Request.Query
            .Select(k => new KeyValuePair<string, string>(k.Key, k.Value.ToString()!))
            .ToList();
        var response = _vnPayService.GetPaymentResult(queryDictionary);

        if (!response.IsValidSignature)
        {
            return BadRequest(new ApiResponseDto<object>(400, "Chữ ký VNPay không hợp lệ", response));
        }

        if (!response.Success)
        {
            return BadRequest(new ApiResponseDto<object>(400, "Thanh toán thất bại hoặc đã bị hủy", response));
        }

        // Return URL is read-only: report status without mutating wallet/booking if already processed.
        if (response.OrderType == "Deposit")
        {
            if (response.UserId > 0 && !string.IsNullOrWhiteSpace(response.VnPayTransactionId))
            {
                var alreadyProcessed = await _escrowRepository.TransactionExistsByReferenceIdAsync(response.VnPayTransactionId);
                if (!alreadyProcessed)
                {
                    await _escrowService.DepositAsync(
                        response.UserId, response.Amount, response.VnPayTransactionId, "Nạp tiền VNPAY");
                }
            }
            return Ok(new ApiResponseDto<object>(200, "Nạp tiền ví thành công", response));
        }
        else if (response.OrderType == "Booking")
        {
            if (int.TryParse(response.ReferenceId, out int bookingId))
            {
                var bookingDetail = await _bookingService.GetBookingByIdAsync(bookingId);
                if (bookingDetail.StatusCode == 200 && bookingDetail.Data?.PaymentStatus == PaymentStatus.Paid)
                {
                    return Ok(new ApiResponseDto<object>(200, "Thanh toán sân thành công", new
                    {
                        vnpay = response,
                        booking = bookingDetail.Data
                    }));
                }

                // Fallback when IPN has not arrived yet (idempotent confirm).
                var confirmRes = await _bookingService.ConfirmBookingPaymentAsync(
                    bookingId, response.VnPayTransactionId, response.Amount);

                if (confirmRes.StatusCode == 200 ||
                    (confirmRes.StatusCode == 400 && confirmRes.Message?.Contains("đã được thanh toán") == true))
                {
                    bookingDetail = await _bookingService.GetBookingByIdAsync(bookingId);
                    return Ok(new ApiResponseDto<object>(200, "Thanh toán sân thành công", new
                    {
                        vnpay = response,
                        booking = bookingDetail.Data
                    }));
                }
                return BadRequest(confirmRes);
            }
            return BadRequest(new ApiResponseDto<object>(400, "Lỗi cập nhật trạng thái Booking", response));
        }

        return BadRequest(new ApiResponseDto<object>(400, "Loại thanh toán không được hỗ trợ", response));
    }

    private bool IsAllowedVnPayIp()
    {
        var whitelist = _configuration.GetSection("VnPay:AllowedIps").Get<string[]>();
        if (whitelist == null || whitelist.Length == 0)
            return true;

        var remoteIp = HttpContext.Connection.RemoteIpAddress?.ToString();
        if (string.IsNullOrEmpty(remoteIp))
            return false;

        return whitelist.Any(ip => string.Equals(ip.Trim(), remoteIp, StringComparison.OrdinalIgnoreCase));
    }
}
