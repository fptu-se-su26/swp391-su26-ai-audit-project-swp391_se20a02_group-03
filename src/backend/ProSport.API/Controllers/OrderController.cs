using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using System.Security.Claims;

namespace ProSport.API.Controllers;

[Route("api/orders")]
[ApiController]
[Authorize]
public class OrderController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrderController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    private bool TryGetUserId(out int userId)
    {
        userId = 0;
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return !string.IsNullOrEmpty(claim) && int.TryParse(claim, out userId);
    }

    // Tạo đơn hàng shop từ giỏ hàng (bắt buộc địa chỉ + SĐT).
    [HttpPost("checkout")]
    public async Task<IActionResult> Checkout([FromBody] CreateOrderDto dto)
    {
        if (!TryGetUserId(out int userId))
            return Unauthorized(new ApiResponseDto<object>(401, "Unauthorized"));

        var response = await _orderService.CheckoutFromCartAsync(userId, dto);
        return StatusCode(response.StatusCode, response);
    }

    [HttpGet("my-orders")]
    public async Task<IActionResult> GetMyOrders()
    {
        if (!TryGetUserId(out int userId))
            return Unauthorized(new ApiResponseDto<object>(401, "Unauthorized"));

        var response = await _orderService.GetMyOrdersAsync(userId);
        return StatusCode(response.StatusCode, response);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        if (!TryGetUserId(out int userId))
            return Unauthorized(new ApiResponseDto<object>(401, "Unauthorized"));

        var response = await _orderService.GetByIdAsync(userId, id, User.IsInRole("Admin"));
        return StatusCode(response.StatusCode, response);
    }
}
