namespace ProSport.API.Controllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

[ApiController]
[Route("api/inventory")]
[Authorize(Roles = "Admin")] // Requires Admin access as per requirements
public class InventoryController : ControllerBase
{
    private readonly IInventoryService _service;

    public InventoryController(IInventoryService service)
    {
        _service = service;
    }

    private int? TryGetCurrentUserId()
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (int.TryParse(userIdStr, out int userId))
            return userId;
        return null;
    }

    [HttpPost("stock-in")]
    public async Task<IActionResult> StockIn([FromBody] StockTransactionDto dto)
    {
        try
        {
            var userId = TryGetCurrentUserId();
            if (userId == null)
                return Unauthorized(new { Message = "Unauthorized" });

            await _service.StockInAsync(dto, userId.Value);
            return Ok(new { Message = "Nhập kho thành công." });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }

    [HttpPost("stock-out")]
    public async Task<IActionResult> StockOut([FromBody] StockTransactionDto dto)
    {
        try
        {
            var userId = TryGetCurrentUserId();
            if (userId == null)
                return Unauthorized(new { Message = "Unauthorized" });

            await _service.StockOutAsync(dto, userId.Value);
            return Ok(new { Message = "Xuất kho thành công." });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { Message = ex.Message }); // "Tồn kho không đủ"
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }

    [HttpGet("equipment/{equipmentId}/transactions")]
    public async Task<IActionResult> GetTransactions(int equipmentId, [FromQuery] InventoryQueryParameters parameters)
    {
        var result = await _service.GetTransactionHistoryAsync(equipmentId, parameters);
        return Ok(result);
    }
}
