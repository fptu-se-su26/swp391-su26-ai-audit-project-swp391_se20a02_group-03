using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ProSport.API.Controllers;

[ApiController]
[Route("api/equipment")]
public class EquipmentController : ControllerBase
{
    private readonly IEquipmentService _equipmentService;
    private readonly ICartService _cartService;

    public EquipmentController(
        IEquipmentService equipmentService,
        ICartService cartService)
    {
        _equipmentService = equipmentService;
        _cartService = cartService;
    }

    // CRUD Endpoints
    [HttpGet("paged")]
    public async Task<IActionResult> GetPaged([FromQuery] EquipmentQueryParameters parameters)
    {
        var result = await _equipmentService.GetPagedAsync(parameters);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _equipmentService.GetByIdAsync(id);
        if (result == null)
            return NotFound(new ApiResponseDto<EquipmentDto?>(404, "Không tìm thấy thiết bị.", null));
        // Bọc ApiResponseDto cho khớp contract với GET /equipment (list) — FE đọc res.statusCode/res.data.
        return Ok(new ApiResponseDto<EquipmentDto>(200, "Success", result));
    }

    [Authorize(Roles = "Admin")] // TK-039: chỉ Admin được tạo thiết bị
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateEquipmentDto dto)
    {
        var result = await _equipmentService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.EquipmentId }, result);
    }

    [Authorize(Roles = "Admin")] // TK-039: chỉ Admin được sửa thiết bị
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateEquipmentDto dto)
    {
        var result = await _equipmentService.UpdateAsync(id, dto);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [Authorize(Roles = "Admin")] // TK-039: chỉ Admin được xóa thiết bị
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _equipmentService.DeleteAsync(id);
        if (!success) return NotFound();
        return NoContent();
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var response = await _equipmentService.GetAllAsync();
        return StatusCode(response.StatusCode, response);
    }

    [Authorize(Roles = "Admin")] // TK-039: dashboard kho chỉ dành cho Admin
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
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(403, new { success = false, message = ex.Message });
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
