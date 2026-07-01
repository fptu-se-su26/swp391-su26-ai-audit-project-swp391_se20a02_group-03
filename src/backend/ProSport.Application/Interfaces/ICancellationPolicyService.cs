using ProSport.Application.DTOs;
using ProSport.Domain.Entities;

namespace ProSport.Application.Interfaces;

public interface ICancellationPolicyService
{
    Task<CancellationPolicyDto> GetOrDefaultAsync(int complexId);
    Task<ApiResponseDto<CancellationPolicyDto>> UpsertAsync(int complexId, CancellationPolicyDto dto);
    Task<CancellationRefundPreviewDto> CalculateBookingRefundAsync(Booking booking, bool weatherCancel = false);
    Task<(decimal releasePercent, string message)> CalculateMatchLeaveReleaseAsync(int complexId, DateTime matchTime);
}
