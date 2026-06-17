namespace ProSport.Application.Interfaces;

using ProSport.Application.DTOs;
using System.Threading.Tasks;

public interface IEquipmentService
{
    Task<PagedResult<EquipmentDto>> GetPagedAsync(EquipmentQueryParameters parameters);
    Task<EquipmentDto?> GetByIdAsync(int id);
    Task<EquipmentDto> CreateAsync(CreateEquipmentDto dto);
    Task<EquipmentDto?> UpdateAsync(int id, UpdateEquipmentDto dto);
    Task<bool> DeleteAsync(int id);
}
