using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProSport.Application.DTOs.Owner;
using ProSport.Application.Interfaces;
using ProSport.Domain.Constants;

namespace ProSport.API.Controllers.Owner;

[Route("api/owner/inventory")]
[ApiController]
[Authorize(Roles = Roles.CourtOwner + "," + Roles.Admin)]
public class OwnerInventoryController : OwnerControllerBase
{
    private readonly IOwnerAccessService _ownerAccessService;
    private readonly IOwnerInventoryService _inventoryService;

    public OwnerInventoryController(
        ICurrentUserContext currentUser,
        IOwnerAccessService ownerAccessService,
        IOwnerInventoryService inventoryService) : base(currentUser)
    {
        _ownerAccessService = ownerAccessService;
        _inventoryService = inventoryService;
    }

    [HttpGet("products")]
    public async Task<IActionResult> GetProducts([FromQuery] OwnerInventoryQueryDto query)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();
        try
        {
            await _ownerAccessService.RequireOwnerOrAdminAccessAsync(userId.Value, query.ComplexId, IsAdmin);
            var response = await _inventoryService.GetProductsAsync(query);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex) { return FromOwnerException(ex); }
    }

    [HttpPost("products")]
    public async Task<IActionResult> CreateProduct([FromBody] CreateProductStockDto dto)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();
        try
        {
            await _ownerAccessService.RequireOwnerOrAdminAccessAsync(userId.Value, dto.ComplexId, IsAdmin);
            var response = await _inventoryService.CreateProductAsync(userId.Value, dto);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex) { return FromOwnerException(ex); }
    }

    [HttpPut("products/{id:int}")]
    public async Task<IActionResult> UpdateProduct(int id, [FromQuery] int complexId, [FromBody] UpdateProductStockDto dto)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();
        try
        {
            await _ownerAccessService.RequireOwnerOrAdminAccessAsync(userId.Value, complexId, IsAdmin);
            var response = await _inventoryService.UpdateProductAsync(userId.Value, id, complexId, dto);
            return StatusCode(response.StatusCode, response);
        }
        catch (Exception ex) { return FromOwnerException(ex); }
    }
}
