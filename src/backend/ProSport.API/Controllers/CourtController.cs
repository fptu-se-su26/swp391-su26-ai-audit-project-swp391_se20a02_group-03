using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;

namespace ProSport.API.Controllers;

[Route("api/courts")]
[ApiController]
public class CourtController : ControllerBase
{
    private readonly ICourtService _courtService;

    public CourtController(ICourtService courtService)
    {
        _courtService = courtService;
    }

    // READ - list all courts with pagination and filtering
    [HttpGet]
    public async Task<IActionResult> GetAllCourts([FromQuery] CourtQueryParameters parameters)
    {
        var response = await _courtService.GetAllCourtsAsync(parameters);
        return StatusCode(response.StatusCode, response);
    }

    // READ - get by id
    [HttpGet("{id}")]
    public async Task<IActionResult> GetCourtById(int id)
    {
        var response = await _courtService.GetCourtByIdAsync(id);
        return StatusCode(response.StatusCode, response);
    }

    // READ - available courts
    [HttpGet("available")]
    public async Task<IActionResult> GetAvailableCourts([FromQuery] DateTime date, [FromQuery] TimeSpan startTime, [FromQuery] TimeSpan endTime)
    {
        var response = await _courtService.GetAvailableCourtsAsync(date, startTime, endTime);
        return StatusCode(response.StatusCode, response);
    }

    // READ - booked slots
    [HttpGet("{id}/booked-slots")]
    public async Task<IActionResult> GetBookedSlots(int id, [FromQuery] DateTime date)
    {
        var response = await _courtService.GetBookedSlotsAsync(id, date);
        return StatusCode(response.StatusCode, response);
    }

    // CREATE - new court (admin only)
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> CreateCourt([FromBody] CreateCourtDto dto)
    {
        var response = await _courtService.CreateCourtAsync(dto);
        return StatusCode(response.StatusCode, response);
    }

    // UPDATE - modify existing court (admin only)
    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCourt(int id, [FromBody] UpdateCourtDto dto)
    {
        var response = await _courtService.UpdateCourtAsync(id, dto);
        return StatusCode(response.StatusCode, response);
    }

    // DELETE - soft delete court (admin only)
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCourt(int id)
    {
        var response = await _courtService.DeleteCourtAsync(id);
        return StatusCode(response.StatusCode, response);
    }
}
