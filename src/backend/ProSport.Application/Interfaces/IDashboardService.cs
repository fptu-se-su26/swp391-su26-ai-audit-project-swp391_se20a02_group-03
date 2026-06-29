using ProSport.Application.DTOs;

namespace ProSport.Application.Interfaces;

// Tổng hợp số liệu cho Bảng điều khiển Admin.
public interface IDashboardService
{
    Task<ApiResponseDto<DashboardStatsDto>> GetStatsAsync();
    Task<ApiResponseDto<EliteDashboardStatsDto>> GetEliteStatsAsync();
    Task<ApiResponseDto<CourtScheduleDto>> GetCourtScheduleAsync(DateTime? date, string? sportFilter);
    Task<ApiResponseDto<StaffOverviewDto>> GetStaffOverviewAsync();
}
