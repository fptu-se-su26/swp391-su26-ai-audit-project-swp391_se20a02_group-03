using ProSport.Application.DTOs;
using ProSport.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProSport.Application.Interfaces;

public interface IEquipmentRepository
{
    // CRUD methods
    Task<(IEnumerable<Equipment> Items, int TotalCount)> GetPagedAsync(EquipmentQueryParameters parameters);
    Task<Equipment?> GetByIdAsync(int id);
    Task<Equipment> CreateAsync(Equipment equipment);
    Task UpdateAsync(Equipment equipment);
    Task DeleteAsync(Equipment equipment);

    // Rent/Return methods
    Task<IEnumerable<Equipment>> GetAllAsync();
    Task<IEnumerable<EquipmentRental>> GetUserRentalsAsync(int userId);
    Task CreateRentalAsync(EquipmentRental rental);
    Task UpdateEquipmentAsync(Equipment equipment);
    Task<EquipmentRental?> GetRentalByIdAsync(int rentalId);
    Task UpdateRentalAsync(EquipmentRental rental);
    Task<IEnumerable<EquipmentRental>> GetPendingInspectionsAsync();
}
