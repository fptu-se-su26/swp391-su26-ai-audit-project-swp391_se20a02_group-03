namespace ProSport.API.Controllers;

using Microsoft.AspNetCore.Mvc;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using System.Threading.Tasks;

[ApiController]
[Route("api/equipment-categories")]
public class EquipmentCategoryController : ControllerBase
{
    private readonly IEquipmentCategoryService _service;

    public EquipmentCategoryController(IEquipmentCategoryService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _service.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _service.GetByIdAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateUpdateEquipmentCategoryDto dto)
    {
        var result = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.EquipmentCategoryId }, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateUpdateEquipmentCategoryDto dto)
    {
        var result = await _service.UpdateAsync(id, dto);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _service.DeleteAsync(id);
        if (!success) return NotFound();
        return NoContent();
    }
}
