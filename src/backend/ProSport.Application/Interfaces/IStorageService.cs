using System.IO;
using System.Threading.Tasks;

namespace ProSport.Application.Interfaces;

public interface IStorageService
{
    Task<string> UploadImageAsync(Stream fileStream, string fileName, string folderName);
    Task DeleteImageAsync(string imageUrl);
}
