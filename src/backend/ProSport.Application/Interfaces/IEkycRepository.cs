using ProSport.Domain.Entities;

namespace ProSport.Application.Interfaces;

// Truy xuất hồ sơ E-KYC (kèm thông tin User).
public interface IEkycRepository
{
    Task<List<EkycProfile>> GetAllAsync(string? status = null);
    Task<EkycProfile?> GetByIdAsync(int id);
    Task<EkycProfile?> GetByUserIdAsync(int userId);
    Task<User?> GetUserByIdAsync(int userId);
    Task AddAsync(EkycProfile profile);
    Task SaveChangesAsync();
}
