using ProSport.Application.DTOs;

namespace ProSport.Application.Interfaces;

public interface IEkycService
{
    Task<ApiResponseDto<List<EkycProfileDto>>> GetAllAsync(string? status = null);
    Task<ApiResponseDto<EkycProfileDto>> GetByIdAsync(int id);
    Task<ApiResponseDto<EkycProfileDto>> ApproveAsync(int id);
    Task<ApiResponseDto<EkycProfileDto>> RejectAsync(int id, string reason);

    // TK-004: luồng phía Customer — tự nộp hồ sơ và xem trạng thái hồ sơ của mình.
    Task<ApiResponseDto<EkycProfileDto>> SubmitAsync(int userId, SubmitEkycDto dto);
    Task<ApiResponseDto<EkycProfileDto>> GetMineAsync(int userId);
}
