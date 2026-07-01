using ProSport.Application.DTOs;

namespace ProSport.Application.Interfaces;

public interface IMembershipService
{
    Task<ApiResponseDto<IEnumerable<MembershipDto>>> GetMyMembershipsAsync(int userId);
    Task<ApiResponseDto<IEnumerable<MembershipDto>>> GetByComplexAsync(int complexId);
    Task<ApiResponseDto<MembershipDto>> CreateAsync(int actorUserId, int complexId, CreateMembershipDto dto, bool isAdmin = false);
    Task<ApiResponseDto<bool>> UpdateStatusAsync(int actorUserId, int complexId, int membershipId, string status, bool isAdmin = false);
    Task<decimal> GetActiveDiscountPercentAsync(int userId, int complexId, DateTime? asOf = null);
}
