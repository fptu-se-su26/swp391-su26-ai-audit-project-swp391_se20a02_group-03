using ProSport.Domain.Entities;

namespace ProSport.Application.Interfaces;

public interface IComplexRepository
{
    Task<Complex?> GetByIdAsync(int complexId);
    Task<List<Complex>> GetAllActiveAsync();
    Task<Complex> CreateAsync(Complex complex);
    Task UpdateAsync(Complex complex);
}
