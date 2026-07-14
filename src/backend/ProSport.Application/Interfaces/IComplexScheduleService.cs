using ProSport.Application.DTOs;
using ProSport.Application.DTOs.Owner;

namespace ProSport.Application.Interfaces;

public interface IComplexScheduleService
{
    Task<ApiResponseDto<ComplexOperatingHoursDto>> GetOperatingHoursAsync(int complexId);
    Task<ApiResponseDto<ComplexOperatingHoursDto>> SaveOperatingHoursAsync(int actorUserId, int complexId, SaveComplexOperatingHoursDto dto);
}
