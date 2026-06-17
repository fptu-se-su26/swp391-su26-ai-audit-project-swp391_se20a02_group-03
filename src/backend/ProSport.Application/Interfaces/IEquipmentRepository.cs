namespace ProSport.Application.Interfaces;

using ProSport.Application.DTOs;
using ProSport.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IEquipmentRepository
{
    Task<(IEnumerable<Equipment> Items, int TotalCount)> GetPagedAsync(EquipmentQueryParameters parameters);
    Task<Equipment?> GetByIdAsync(int id);
    Task<Equipment> CreateAsync(Equipment equipment);
    Task UpdateAsync(Equipment equipment);
    Task DeleteAsync(Equipment equipment);
}
