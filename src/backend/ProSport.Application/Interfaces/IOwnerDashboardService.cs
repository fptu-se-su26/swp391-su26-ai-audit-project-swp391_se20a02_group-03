using ProSport.Application.DTOs;
using ProSport.Application.DTOs.Owner;

namespace ProSport.Application.Interfaces;

public interface IOwnerDashboardService
{
    Task<ApiResponseDto<OwnerDashboardDto>> GetDashboardAsync(int complexId, DateTime? from, DateTime? to);
    Task<ApiResponseDto<PagedResult<BookingDto>>> GetBookingsAsync(OwnerBookingQueryDto query);
    Task<ApiResponseDto<IEnumerable<OwnerBookingCalendarDto>>> GetCalendarBookingsAsync(OwnerBookingQueryDto query);
}

public interface IOwnerStaffService
{
    Task<ApiResponseDto<IEnumerable<OwnerStaffDto>>> GetStaffAsync(int complexId);
    Task<ApiResponseDto<OwnerStaffDto>> AssignStaffAsync(int ownerUserId, CreateStaffAssignmentDto dto);
    Task<ApiResponseDto<OwnerStaffDto>> UpdatePermissionsAsync(int assignmentId, int complexId, UpdateStaffPermissionsDto dto);
    Task<ApiResponseDto<OwnerStaffDto>> UpdateStatusAsync(int assignmentId, int complexId, UpdateStaffStatusDto dto);
    Task<ApiResponseDto<object>> RemoveAssignmentAsync(int assignmentId, int complexId);
}
