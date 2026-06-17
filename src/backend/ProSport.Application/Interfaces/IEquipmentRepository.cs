using ProSport.Domain.Entities;

namespace ProSport.Application.Interfaces;

public interface IEquipmentRepository
{
    Task<IEnumerable<Equipment>> GetAllAsync();
    Task<Equipment?> GetByIdAsync(int id);
    Task<IEnumerable<EquipmentRental>> GetUserRentalsAsync(int userId);
    Task CreateRentalAsync(EquipmentRental rental);
    Task UpdateEquipmentAsync(Equipment equipment);
    Task<EquipmentRental?> GetRentalByIdAsync(int rentalId);
    Task UpdateRentalAsync(EquipmentRental rental);
    Task<IEnumerable<EquipmentRental>> GetPendingInspectionsAsync();
}
