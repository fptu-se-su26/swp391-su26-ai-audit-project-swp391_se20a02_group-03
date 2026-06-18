using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProSport.Application.Interfaces;
using System;
using System.Threading.Tasks;

namespace ProSport.API.Controllers;

[Route("api/upload")]
[ApiController]
public class UploadController : ControllerBase
{
    private readonly IStorageService _storageService;

    public UploadController(IStorageService storageService)
    {
        _storageService = storageService;
    }

    [HttpPost("image")]
    [Authorize(Roles = "Admin,Staff")] // Assuming Admin or Staff can upload images
    public async Task<IActionResult> UploadImage(IFormFile file, [FromForm] string folder = "courts")
    {
        try
        {
            using var stream = file.OpenReadStream();
            var imageUrl = await _storageService.UploadImageAsync(stream, file.FileName, folder);
            return Ok(new { Url = imageUrl });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { Message = "An unexpected error occurred during file upload." });
        }
    }
}
