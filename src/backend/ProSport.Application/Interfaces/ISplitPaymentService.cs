using ProSport.Application.DTOs;

namespace ProSport.Application.Interfaces;

public interface ISplitPaymentService
{
    Task<ApiResponseDto<BookingDto>> CreateSplitBookingAsync(int hostUserId, CreateSplitBookingDto dto);
    Task<ApiResponseDto<bool>> PayShareAsync(int userId, int bookingId);
    Task<ApiResponseDto<IEnumerable<BookingPaymentShareDto>>> GetSharesAsync(int bookingId, int userId);
    Task<int> ExpireUnpaidSharesAsync();
}
