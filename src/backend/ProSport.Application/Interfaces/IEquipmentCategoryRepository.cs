namespace ProSport.Application.Interfaces;

using ProSport.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IEquipmentCategoryRepository
{
    Task<IEnumerable<EquipmentCategory>> GetAllAsync();
    Task<EquipmentCategory?> GetByIdAsync(int id);
    Task<EquipmentCategory> CreateAsync(EquipmentCategory category);
    Task UpdateAsync(EquipmentCategory category);
    Task DeleteAsync(EquipmentCategory category);
}
