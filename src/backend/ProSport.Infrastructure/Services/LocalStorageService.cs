using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using ProSport.Application.Interfaces;

namespace ProSport.Infrastructure.Services;

public class LocalStorageService : IStorageService
{
    private static readonly string[] AllowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

    public async Task<string> UploadImageAsync(Stream fileStream, string fileName, string folderName)
    {
        if (fileStream == null || fileStream.Length == 0)
            throw new ArgumentException("File stream is empty", nameof(fileStream));

        if (fileStream.Length > 5 * 1024 * 1024)
            throw new ArgumentException("File size must be less than 5MB");

        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(extension))
            throw new ArgumentException("Only JPG, JPEG, PNG and WEBP formats are allowed");

        var safeFolder = SanitizeFolderName(folderName);
        var uploadsRoot = Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads"));
        var folderPath = Path.GetFullPath(Path.Combine(uploadsRoot, safeFolder));

        if (!folderPath.StartsWith(uploadsRoot, StringComparison.OrdinalIgnoreCase))
            throw new ArgumentException("Invalid upload folder");

        Directory.CreateDirectory(folderPath);

        var newFileName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(folderPath, newFileName);

        await using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await fileStream.CopyToAsync(stream);
        }

        return $"/uploads/{safeFolder}/{newFileName}";
    }

    public Task DeleteImageAsync(string imageUrl)
    {
        if (string.IsNullOrEmpty(imageUrl))
            return Task.CompletedTask;

        var relativePath = imageUrl.TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
        var uploadsRoot = Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads"));
        var fullPath = Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", relativePath));

        if (!fullPath.StartsWith(uploadsRoot, StringComparison.OrdinalIgnoreCase))
            return Task.CompletedTask;

        if (File.Exists(fullPath))
            File.Delete(fullPath);

        return Task.CompletedTask;
    }

    private static string SanitizeFolderName(string folderName)
    {
        if (string.IsNullOrWhiteSpace(folderName))
            throw new ArgumentException("Folder name is required");

        var normalized = folderName.Replace('\\', '/').Trim('/');
        var segment = Path.GetFileName(normalized);

        if (string.IsNullOrWhiteSpace(segment)
            || segment is "." or ".."
            || segment.Contains("..", StringComparison.Ordinal))
        {
            throw new ArgumentException("Invalid upload folder");
        }

        return segment;
    }
}
