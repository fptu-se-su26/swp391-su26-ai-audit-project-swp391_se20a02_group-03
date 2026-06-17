namespace ProSport.API.Controllers;

using Microsoft.AspNetCore.Mvc;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using System.Threading.Tasks;

[ApiController]
[Route("api/equipments")]
public class EquipmentController : ControllerBase
{
    private readonly IEquipmentService _service;

    public EquipmentController(IEquipmentService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetPaged([FromQuery] EquipmentQueryParameters parameters)
    {
        var result = await _service.GetPagedAsync(parameters);
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
    public async Task<IActionResult> Create([FromBody] CreateEquipmentDto dto)
    {
        var result = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.EquipmentId }, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateEquipmentDto dto)
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
