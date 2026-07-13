using ProSport.Application.DTOs.Owner;

namespace ProSport.Application.Interfaces;

public interface IOwnerAccessService
{
    Task<OwnerContextDto> GetOwnerContextAsync(int userId);
    Task<bool> CanManageComplexAsync(int userId, int complexId);
    Task<bool> HasAccessToComplexAsync(int userId, int complexId);
    Task<int> GetPrimaryComplexIdAsync(int userId);
    Task<IReadOnlyList<int>> GetManagedComplexIdsAsync(int userId);
    Task RequireOwnerRoleAsync(int userId);
    Task RequireComplexAccessAsync(int userId, int complexId, bool isAdmin = false);
    Task RequireOwnerOrAdminAccessAsync(int userId, int complexId, bool isAdmin);
    Task RequireCourtAccessAsync(int userId, int courtId, bool isAdmin);
    Task RequireBookingAccessAsync(int userId, int bookingId, bool isAdmin);
}
