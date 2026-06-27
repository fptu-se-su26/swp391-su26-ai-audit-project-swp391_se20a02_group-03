using ProSport.Application.DTOs;

namespace ProSport.Application.Interfaces;

public interface IVoucherService
{
    Task<ApiResponseDto<List<VoucherDto>>> GetAllAsync(bool onlyActive = false);
    Task<ApiResponseDto<VoucherDto>> GetByIdAsync(int id);
    Task<ApiResponseDto<VoucherDto>> CreateAsync(CreateVoucherDto dto, int? staffId);
    Task<ApiResponseDto<VoucherDto>> UpdateAsync(int id, UpdateVoucherDto dto);
    Task<ApiResponseDto<bool>> DeleteAsync(int id);
}
