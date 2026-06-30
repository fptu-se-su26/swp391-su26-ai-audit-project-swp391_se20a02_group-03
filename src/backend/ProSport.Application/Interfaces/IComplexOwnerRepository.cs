using ProSport.Domain.Entities;

namespace ProSport.Application.Interfaces;

public interface IComplexOwnerRepository
{
    Task<List<ComplexOwner>> GetByUserIdAsync(int userId);
    Task<ComplexOwner?> GetPrimaryByUserIdAsync(int userId);
    Task<bool> IsUserOwnerOfComplexAsync(int userId, int complexId);
    Task<ComplexOwner> CreateAsync(ComplexOwner complexOwner);
}
