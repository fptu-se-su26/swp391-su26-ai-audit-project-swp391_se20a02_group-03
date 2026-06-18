using ProSport.Application.DTOs;

namespace ProSport.Application.Interfaces;

public interface IEquipmentService
{
    Task<ApiResponseDto<IEnumerable<EquipmentDto>>> GetAllAsync();
    Task<ApiResponseDto<EquipmentDto>> GetByIdAsync(int id);
    Task<ApiResponseDto<bool>> RentAsync(int userId, RentEquipmentRequest request);
    Task<ApiResponseDto<bool>> ReturnAsync(int userId, ReturnEquipmentRequest request);
    Task<ApiResponseDto<EquipmentRentalDto>> InspectReturnAsync(int rentalId, InspectEquipmentRentalRequest request);
    Task<ApiResponseDto<IEnumerable<EquipmentRentalDto>>> GetUserRentalsAsync(int userId);
    Task<ApiResponseDto<IEnumerable<EquipmentRentalDto>>> GetPendingInspectionsAsync();
    Task<EquipmentDashboardDto> GetDashboardStatsAsync();
}
