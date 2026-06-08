using ProSport.Application.DTOs;

namespace ProSport.Application.Interfaces;

public interface IBookingService
{
    Task<ApiResponseDto<IEnumerable<BookingDto>>> GetAllBookingsAsync();
    Task<ApiResponseDto<BookingDto>> GetBookingByIdAsync(int bookingId);
    Task<ApiResponseDto<IEnumerable<BookingDto>>> GetUserBookingsAsync(int userId);
    Task<ApiResponseDto<BookingDto>> CreateBookingAsync(CreateBookingDto dto);
}
