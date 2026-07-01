using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProSport.Application.Interfaces;
using System;
using System.IO;
using System.Threading.Tasks;

namespace ProSport.API.Controllers;

[Route("api/upload")]
[ApiController]
public class UploadController : ControllerBase
{
    private const long MaxFileSizeBytes = 5 * 1024 * 1024;
    private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg", ".jpeg", ".png", ".webp"
    };
    private static readonly HashSet<string> AllowedMimeTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "image/jpeg", "image/png", "image/webp"
    };

    private readonly IStorageService _storageService;

    public UploadController(IStorageService storageService)
    {
        _storageService = storageService;
    }

    [HttpPost("image")]
    [Authorize(Roles = "Admin,Staff")]
    public async Task<IActionResult> UploadImage(IFormFile file, [FromForm] string folder = "courts")
    {
        try
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { Message = "File is required." });

            if (file.Length > MaxFileSizeBytes)
                return BadRequest(new { Message = "File size must not exceed 5MB." });

            var extension = Path.GetExtension(file.FileName);
            if (string.IsNullOrWhiteSpace(extension) || !AllowedExtensions.Contains(extension))
                return BadRequest(new { Message = "Only .jpg, .jpeg, .png, and .webp files are allowed." });

            if (!string.IsNullOrWhiteSpace(file.ContentType) && !AllowedMimeTypes.Contains(file.ContentType))
                return BadRequest(new { Message = "Invalid image MIME type." });

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
