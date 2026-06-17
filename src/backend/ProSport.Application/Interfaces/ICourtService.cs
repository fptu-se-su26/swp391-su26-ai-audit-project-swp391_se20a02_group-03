using System.Collections.Generic;
using ProSport.Application.DTOs;

namespace ProSport.Application.Interfaces;

public interface ICourtService
{
    Task<ApiResponseDto<IEnumerable<CourtDto>>> GetAllCourtsAsync();
    Task<ApiResponseDto<CourtDto>> GetCourtByIdAsync(int courtId);
    Task<ApiResponseDto<IEnumerable<CourtDto>>> GetAvailableCourtsAsync(DateTime date, TimeSpan startTime, TimeSpan endTime);
    Task<ApiResponseDto<CourtDto>> CreateCourtAsync(CreateCourtDto dto);
    Task<ApiResponseDto<CourtDto>> UpdateCourtAsync(int id, UpdateCourtDto dto);
    Task<ApiResponseDto<IEnumerable<string>>> GetBookedSlotsAsync(int courtId, DateTime date);
    Task<ApiResponseDto<object>> DeleteCourtAsync(int id);
}
