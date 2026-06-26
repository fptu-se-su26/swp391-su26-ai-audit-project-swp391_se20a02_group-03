using ProSport.Application.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProSport.Application.Interfaces;

public interface IEquipmentService
{
    // CRUD methods
    Task<PagedResult<EquipmentDto>> GetPagedAsync(EquipmentQueryParameters parameters);
    Task<EquipmentDto?> GetByIdAsync(int id);
    Task<EquipmentDto> CreateAsync(CreateEquipmentDto dto);
    Task<EquipmentDto?> UpdateAsync(int id, UpdateEquipmentDto dto);
    Task<bool> DeleteAsync(int id);

    // Rent/Return methods
    Task<ApiResponseDto<IEnumerable<EquipmentDto>>> GetAllAsync();
    Task<ApiResponseDto<bool>> BuyAsync(int userId, BuyEquipmentRequest request);
    Task<EquipmentDashboardDto> GetDashboardStatsAsync();
}
