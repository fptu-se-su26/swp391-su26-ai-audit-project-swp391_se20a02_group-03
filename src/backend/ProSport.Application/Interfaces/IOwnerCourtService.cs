using ProSport.Application.DTOs;
using ProSport.Application.DTOs.Owner;

namespace ProSport.Application.Interfaces;

public interface IOwnerCourtService
{
    Task<ApiResponseDto<CourtDto>> CreateCourtAsync(int actorUserId, OwnerCourtCreateDto dto);
    Task<ApiResponseDto<CourtDto>> UpdateCourtAsync(int actorUserId, int courtId, OwnerCourtUpdateDto dto);
    Task<ApiResponseDto<CourtDto>> UpdateCourtStatusAsync(int actorUserId, int courtId, string apiStatus);
}
