using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using System.Security.Claims;

namespace ProSport.API.Controllers;

[Route("api/equipment")]
[ApiController]
public class EquipmentController : ControllerBase
{
    private readonly IEquipmentService _equipmentService;
    private readonly ICartService _cartService;

    public EquipmentController(IEquipmentService equipmentService, ICartService cartService)
    {
        _equipmentService = equipmentService;
        _cartService = cartService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var response = await _equipmentService.GetAllAsync();
        return StatusCode(response.StatusCode, response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var response = await _equipmentService.GetByIdAsync(id);
        return StatusCode(response.StatusCode, response);
    }

    [Authorize]
    [HttpPost("rent")]
    public async Task<IActionResult> Rent([FromBody] RentEquipmentRequest request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized(new ApiResponseDto<object>(401, "Unauthorized"));
        }

        var response = await _equipmentService.RentAsync(userId, request);
        return StatusCode(response.StatusCode, response);
    }

    [Authorize]
    [HttpPost("return")]
    public async Task<IActionResult> Return([FromBody] ReturnEquipmentRequest request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized(new ApiResponseDto<object>(401, "Unauthorized"));
        }

        var response = await _equipmentService.ReturnAsync(userId, request);
        return StatusCode(response.StatusCode, response);
    }

    [Authorize(Roles = "Admin,Staff")]
    [HttpPut("return/{rentalId}/inspect")]
    public async Task<IActionResult> InspectReturn(int rentalId, [FromBody] InspectEquipmentRentalRequest request)
    {
        var response = await _equipmentService.InspectReturnAsync(rentalId, request);
        return StatusCode(response.StatusCode, response);
    }

    [Authorize(Roles = "Admin,Staff")]
    [HttpGet("returns/pending")]
    public async Task<IActionResult> GetPendingInspections()
    {
        var response = await _equipmentService.GetPendingInspectionsAsync();
        return StatusCode(response.StatusCode, response);
    }

    [Authorize]
    [HttpGet("my-rentals")]
    public async Task<IActionResult> MyRentals()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized(new ApiResponseDto<object>(401, "Unauthorized"));
        }

        var response = await _equipmentService.GetUserRentalsAsync(userId);
        return StatusCode(response.StatusCode, response);
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard()
    {
        var stats = await _equipmentService.GetDashboardStatsAsync();
        return Ok(new { success = true, data = stats });
    }

    [Authorize]
    [HttpPost("cart/add")]
    public async Task<IActionResult> AddToCart([FromBody] AddToCartRequest request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized(new { success = false, message = "Unauthorized" });
        }

        try
        {
            var cartItem = await _cartService.AddToCartAsync(userId, request.EquipmentId, request.Quantity, request.BookingId);
            return Ok(new { success = true, data = cartItem, message = "Đã thêm vào giỏ hàng" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    [Authorize]
    [HttpGet("cart")]
    public async Task<IActionResult> GetCart()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized(new { success = false, message = "Unauthorized" });
        }

        var cart = await _cartService.GetCartAsync(userId);
        return Ok(new { success = true, data = cart });
    }

    [Authorize]
    [HttpPut("cart/items/{cartItemId}")]
    public async Task<IActionResult> UpdateCartItem(int cartItemId, [FromBody] UpdateCartItemRequest request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized(new { success = false, message = "Unauthorized" });
        }

        try
        {
            await _cartService.UpdateQuantityAsync(userId, cartItemId, request.Quantity);
            var updatedCart = await _cartService.GetCartAsync(userId);
            return Ok(new { success = true, data = updatedCart });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    [Authorize]
    [HttpDelete("cart/items/{cartItemId}")]
    public async Task<IActionResult> RemoveFromCart(int cartItemId)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized(new { success = false, message = "Unauthorized" });
        }

        await _cartService.RemoveFromCartAsync(userId, cartItemId);
        var updatedCart = await _cartService.GetCartAsync(userId);
        return Ok(new { success = true, data = updatedCart });
    }

    [Authorize]
    [HttpDelete("cart")]
    public async Task<IActionResult> ClearCart()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized(new { success = false, message = "Unauthorized" });
        }

        await _cartService.ClearCartAsync(userId);
        return Ok(new { success = true, message = "Giỏ hàng đã được xoá" });
    }

    [Authorize]
    [HttpPost("checkout")]
    public async Task<IActionResult> Checkout([FromBody] CartCheckoutRequest request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized(new { success = false, message = "Unauthorized" });
        }

        try
        {
            await _cartService.CheckoutAsync(userId, request.BookingId);
            return Ok(new { success = true, message = "Thanh toán thành công" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }
}

public class CartCheckoutRequest
{
    public int? BookingId { get; set; }
}
