using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using ProSport.Application.Interfaces;

namespace ProSport.Infrastructure.Services;

public class LocalStorageService : IStorageService
{
    public LocalStorageService()
    {
    }

    public async Task<string> UploadImageAsync(Stream fileStream, string fileName, string folderName)
    {
        if (fileStream == null || fileStream.Length == 0)
        {
            throw new ArgumentException("File stream is empty", nameof(fileStream));
        }

        // Check file size (< 5MB)
        if (fileStream.Length > 5 * 1024 * 1024)
        {
            throw new ArgumentException("File size must be less than 5MB");
        }

        // Check file format
        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
        if (!allowedExtensions.Contains(extension))
        {
            throw new ArgumentException("Only JPG, JPEG, PNG and WEBP formats are allowed");
        }

        var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", folderName);
        if (!Directory.Exists(folderPath))
        {
            Directory.CreateDirectory(folderPath);
        }

        var newFileName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(folderPath, newFileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await fileStream.CopyToAsync(stream);
        }

        // Return relative path
        return $"/uploads/{folderName}/{newFileName}";
    }

    public Task DeleteImageAsync(string imageUrl)
    {
        if (string.IsNullOrEmpty(imageUrl))
            return Task.CompletedTask;

        var relativePath = imageUrl.TrimStart('/');
        var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", relativePath);

        if (File.Exists(fullPath))
        {
            File.Delete(fullPath);
        }

        return Task.CompletedTask;
    }
}
