using ProSport.Application.DTOs;

namespace ProSport.Application.Interfaces;

public interface IEkycService
{
    Task<ApiResponseDto<List<EkycProfileDto>>> GetAllAsync(string? status = null);
    Task<ApiResponseDto<EkycProfileDto>> GetByIdAsync(int id);
    Task<ApiResponseDto<EkycProfileDto>> ApproveAsync(int id);
    Task<ApiResponseDto<EkycProfileDto>> RejectAsync(int id, string reason);
}
