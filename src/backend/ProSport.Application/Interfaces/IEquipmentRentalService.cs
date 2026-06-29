using ProSport.Application.DTOs;

namespace ProSport.Application.Interfaces;

public interface IEquipmentRentalService
{
    Task<ApiResponseDto<IEnumerable<EquipmentRentalDto>>> GetRentalsAsync(string? status = null);
    Task<ApiResponseDto<EquipmentRentalDto>> RentAtCounterAsync(StaffRentEquipmentRequest request, int staffId);
    Task<ApiResponseDto<EquipmentRentalDto>> ReturnEquipmentAsync(int detailId, ReturnEquipmentRequest request, int staffId);
}
