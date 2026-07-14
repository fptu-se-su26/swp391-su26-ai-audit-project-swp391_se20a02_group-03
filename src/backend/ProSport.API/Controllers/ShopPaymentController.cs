using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;

namespace ProSport.API.Controllers;

/// <summary>
/// Xác nhận thanh toán PayOS cho đơn hàng shop. Webhook do PayOS gọi (không đăng nhập,
/// xác thực bằng chữ ký). Endpoint mock-confirm chỉ dùng khi chạy mock để demo hoàn tất đơn.
/// </summary>
[Route("api/orders")]
[ApiController]
public class ShopPaymentController : ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly IPayOsService _payOsService;

    public ShopPaymentController(IOrderService orderService, IPayOsService payOsService)
    {
        _orderService = orderService;
        _payOsService = payOsService;
    }

    // PayOS gọi khi thanh toán xong. Trả 200 để PayOS ngừng retry.
    [AllowAnonymous]
    [HttpPost("payos/webhook")]
    public async Task<IActionResult> PayOsWebhook([FromBody] PayOsWebhookDto payload)
    {
        var dataJson = payload.Data is null ? string.Empty : JsonSerializer.Serialize(payload.Data);
        if (!_payOsService.VerifyWebhookSignature(dataJson, payload.Signature ?? string.Empty))
            return Ok(new { code = "97", desc = "Invalid signature" });

        if (payload.Success && payload.Data is not null)
            await _orderService.ConfirmPayOsPaymentAsync(payload.Data.OrderCode, payload.Data.Amount);

        return Ok(new { code = "00", desc = "success" });
    }

    // Chỉ chạy ở chế độ mock (chưa cấu hình PayOS thật) — giả lập thanh toán thành công để demo.
    [Authorize]
    [HttpPost("{id:int}/payos/mock-confirm")]
    public async Task<IActionResult> MockConfirm(int id)
    {
        if (!_payOsService.IsMockMode)
            return NotFound();

        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(claim) || !int.TryParse(claim, out var userId))
            return Unauthorized(new ApiResponseDto<object>(401, "Unauthorized"));

        // Xác thực đơn thuộc user trước khi giả lập.
        var order = await _orderService.GetByIdAsync(userId, id, User.IsInRole("Admin"));
        if (order.StatusCode != 200 || order.Data is null)
            return StatusCode(order.StatusCode, order);

        var res = await _orderService.ConfirmPayOsPaymentAsync(id, order.Data.TotalAmount);
        return StatusCode(res.StatusCode, res);
    }
}

public class PayOsWebhookDto
{
    public string? Code { get; set; }
    public bool Success { get; set; }
    public PayOsWebhookData? Data { get; set; }
    public string? Signature { get; set; }
}

public class PayOsWebhookData
{
    public int OrderCode { get; set; }
    public decimal Amount { get; set; }
}
