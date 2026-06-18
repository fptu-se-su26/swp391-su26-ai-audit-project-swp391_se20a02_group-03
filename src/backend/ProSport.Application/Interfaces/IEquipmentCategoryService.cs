namespace ProSport.Application.Interfaces;

using ProSport.Application.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IEquipmentCategoryService
{
    Task<IEnumerable<EquipmentCategoryDto>> GetAllAsync();
    Task<EquipmentCategoryDto?> GetByIdAsync(int id);
    Task<EquipmentCategoryDto> CreateAsync(CreateUpdateEquipmentCategoryDto dto);
    Task<EquipmentCategoryDto?> UpdateAsync(int id, CreateUpdateEquipmentCategoryDto dto);
    Task<bool> DeleteAsync(int id);
}
