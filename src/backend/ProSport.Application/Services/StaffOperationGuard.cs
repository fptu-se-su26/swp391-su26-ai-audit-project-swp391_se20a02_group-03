using ProSport.Application.Exceptions;
using ProSport.Application.Interfaces;
using ProSport.Domain.Constants;

namespace ProSport.Application.Services;

public class StaffOperationGuard : IStaffOperationGuard
{
    private readonly IUserRepository _userRepository;
    private readonly IStaffAssignmentRepository _staffAssignmentRepository;

    public StaffOperationGuard(
        IUserRepository userRepository,
        IStaffAssignmentRepository staffAssignmentRepository)
    {
        _userRepository = userRepository;
        _staffAssignmentRepository = staffAssignmentRepository;
    }

    public async Task EnsureCanCheckInAsync(int userId, int complexId)
    {
        if (await IsPrivilegedOperatorAsync(userId))
            return;

        await EnsureStaffPermissionAsync(userId, complexId, requiresCheckIn: true, requiresWalkIn: false);
    }

    public async Task EnsureCanCreateWalkInAsync(int userId, int complexId)
    {
        if (await IsPrivilegedOperatorAsync(userId))
            return;

        await EnsureStaffPermissionAsync(userId, complexId, requiresCheckIn: false, requiresWalkIn: true);
    }

    private async Task<bool> IsPrivilegedOperatorAsync(int userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        return user?.Role is Roles.Admin or Roles.CourtOwner;
    }

    private async Task EnsureStaffPermissionAsync(int userId, int complexId, bool requiresCheckIn, bool requiresWalkIn)
    {
        var assignment = await _staffAssignmentRepository.GetByStaffAndComplexAsync(userId, complexId);
        if (assignment == null || assignment.Status != "Active")
            throw new OwnerAccessDeniedException("Nhân viên không có quyền thao tác tại tổ hợp này.");

        if (requiresCheckIn && !assignment.CanCheckIn)
            throw new OwnerAccessDeniedException("Nhân viên không có quyền check-in.");

        if (requiresWalkIn && !assignment.CanCreateWalkIn)
            throw new OwnerAccessDeniedException("Nhân viên không có quyền tạo walk-in.");
    }
}
