using ProSport.Application.DTOs;

namespace ProSport.Application.Interfaces;

public interface IReportService
{
    Task<ApiResponseDto<ReportDto>> CreateAsync(int reporterId, CreateReportDto dto);
    Task<ApiResponseDto<List<ReportDto>>> GetAllAsync(string? status = null);
    Task<ApiResponseDto<List<ReportDto>>> GetMyReportsAsync(int reporterId);
    Task<ApiResponseDto<ReportDto>> ResolveAsync(int reportId, int adminId, ResolveReportDto dto);
}
