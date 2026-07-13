using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using System.Security.Claims;

namespace ProSport.API.Controllers;

[Route("api/escrow")]
[ApiController]
[Authorize]
public class EscrowController : ControllerBase
{
    private readonly IEscrowService _escrowService;
    private readonly IWebHostEnvironment _environment;

    public EscrowController(IEscrowService escrowService, IWebHostEnvironment environment)
    {
        _escrowService = escrowService;
        _environment = environment;
    }

    private bool TryGetUserId(out int userId)
    {
        userId = 0;
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return !string.IsNullOrEmpty(claim) && int.TryParse(claim, out userId);
    }

    [HttpGet("my-wallet")]
    public async Task<IActionResult> GetMyWallet()
    {
        if (!TryGetUserId(out int userId))
            return Unauthorized(new ApiResponseDto<object>(401, "Unauthorized"));

        var response = await _escrowService.GetWalletAsync(userId);
        return StatusCode(response.StatusCode, response);
    }

    [HttpGet("my-transactions")]
    public async Task<IActionResult> GetMyTransactions()
    {
        if (!TryGetUserId(out int userId))
            return Unauthorized(new ApiResponseDto<object>(401, "Unauthorized"));

        var response = await _escrowService.GetTransactionHistoryAsync(userId);
        return StatusCode(response.StatusCode, response);
    }

    // API nạp tiền mock — chỉ Development, ẩn hoàn toàn ở Production
    [HttpPost("deposit-mock")]
    public async Task<IActionResult> DepositMock([FromQuery] decimal amount)
    {
        if (!_environment.IsDevelopment())
            return NotFound();

        if (!TryGetUserId(out int userId))
            return Unauthorized(new ApiResponseDto<object>(401, "Unauthorized"));

        const decimal maxMockDeposit = 10_000_000m;
        if (amount > maxMockDeposit)
            return BadRequest(new ApiResponseDto<object>(400, $"Số tiền mock tối đa {maxMockDeposit:N0} VND"));

        var response = await _escrowService.DepositAsync(userId, amount, $"MOCK-{Guid.NewGuid()}", "Nạp tiền Mock");
        return StatusCode(response.StatusCode, response);
    }

    [HttpPost("pay-booking/{bookingId}")]
    public async Task<IActionResult> PayBooking(int bookingId)
    {
        if (!TryGetUserId(out int userId))
            return Unauthorized(new ApiResponseDto<object>(401, "Unauthorized"));

        var response = await _escrowService.PayForBookingAsync(userId, bookingId);
        return StatusCode(response.StatusCode, response);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // BƯỚC 1: Nạp tiền thật vào ví qua VNPay
    // ─────────────────────────────────────────────────────────────────────────

    /// <summary>
    /// Tạo URL thanh toán VNPay để nạp tiền thật vào ví Escrow.
    /// Sau khi user thanh toán thành công trên VNPay, IPN tự động cộng tiền vào ví.
    /// </summary>
    [HttpPost("deposit")]
    public async Task<IActionResult> CreateDepositUrl([FromBody] EscrowDepositRequestDto dto)
    {
        if (!TryGetUserId(out int userId))
            return Unauthorized(new ApiResponseDto<object>(401, "Unauthorized"));

        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";
        var response = await _escrowService.CreateDepositUrlAsync(userId, dto.Amount, ipAddress);
        return StatusCode(response.StatusCode, response);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // BƯỚC 2: Thanh toán phí tham gia kèo bằng ví Escrow
    // ─────────────────────────────────────────────────────────────────────────

    /// <summary>
    /// Trừ tiền ví Escrow để thanh toán phí tham gia kèo.
    /// Gọi endpoint này sau khi Join Match được chấp nhận hoặc khi muốn tách biệt bước thanh toán.
    /// </summary>
    [HttpPost("pay-match-fee/{matchId:int}")]
    public async Task<IActionResult> PayMatchFee(int matchId, [FromQuery] decimal amount, [FromQuery] string? description)
    {
        if (!TryGetUserId(out int userId))
            return Unauthorized(new ApiResponseDto<object>(401, "Unauthorized"));

        if (amount <= 0)
            return BadRequest(new ApiResponseDto<object>(400, "Số tiền phí tham gia kèo phải lớn hơn 0"));

        var response = await _escrowService.PayMatchFeeAsync(
            userId, matchId, amount,
            description ?? $"Thanh toán phí tham gia kèo #{matchId}");

        return StatusCode(response.StatusCode, response);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // BƯỚC 3: Hoàn tiền thủ công (Admin/Staff only)
    // ─────────────────────────────────────────────────────────────────────────

    /// <summary>
    /// Hoàn tiền thủ công vào ví Escrow của một user.
    /// Chỉ Admin hoặc Staff được phép gọi. Dùng khi có khiếu nại hoặc lỗi hệ thống.
    /// Idempotent nếu truyền referenceId.
    /// </summary>
    [HttpPost("refund")]
    [Authorize(Roles = "Admin,Staff")]
    public async Task<IActionResult> RefundToWallet([FromBody] EscrowRefundRequestDto dto)
    {
        if (!TryGetUserId(out int operatorId))
            return Unauthorized(new ApiResponseDto<object>(401, "Unauthorized"));

        if (dto.UserId <= 0)
            return BadRequest(new ApiResponseDto<object>(400, "UserId không hợp lệ"));

        if (dto.Amount <= 0)
            return BadRequest(new ApiResponseDto<object>(400, "Số tiền hoàn phải lớn hơn 0"));

        if (string.IsNullOrWhiteSpace(dto.Reason))
            return BadRequest(new ApiResponseDto<object>(400, "Lý do hoàn tiền là bắt buộc"));

        var response = await _escrowService.RefundToEscrowAsync(
            dto.UserId, dto.Amount, dto.Reason, dto.ReferenceId, operatorId);

        return StatusCode(response.StatusCode, response);
    }
}

