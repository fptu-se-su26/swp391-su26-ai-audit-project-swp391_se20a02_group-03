using ProSport.Domain.Entities;

namespace ProSport.Application.Interfaces;

public interface IEquipmentRentalRepository
{
    Task<IEnumerable<BookingDetailEquipment>> GetAllAsync(string? rentalStatus = null);
    Task<BookingDetailEquipment?> GetByIdAsync(int detailId);
    Task<BookingDetailEquipment> CreateAsync(BookingDetailEquipment rental);
    Task UpdateAsync(BookingDetailEquipment rental);
}
