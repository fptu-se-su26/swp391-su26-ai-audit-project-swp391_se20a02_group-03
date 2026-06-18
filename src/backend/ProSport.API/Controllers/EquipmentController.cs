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

    public EquipmentController(IEquipmentService equipmentService)
    {
        _equipmentService = equipmentService;
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
}
