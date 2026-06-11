using ProSport.Domain.Entities;

namespace ProSport.Application.Interfaces;

public interface IBookingRepository
{
    Task<IEnumerable<Booking>> GetAllAsync();
    Task<Booking?> GetByIdAsync(int bookingId);
    Task<IEnumerable<Booking>> GetByUserIdAsync(int userId);
    Task<Booking> CreateAsync(Booking booking);
    Task UpdateAsync(Booking booking);
}
