using ProSport.Application.DTOs;
using ProSport.Application.DTOs.Owner;
using ProSport.Application.Interfaces;
using ProSport.Domain.Constants;
using ProSport.Domain.Entities;

namespace ProSport.Application.Services;

public class OwnerStaffService : IOwnerStaffService
{
    private readonly IStaffAssignmentRepository _staffAssignmentRepository;
    private readonly IUserRepository _userRepository;

    public OwnerStaffService(
        IStaffAssignmentRepository staffAssignmentRepository,
        IUserRepository userRepository)
    {
        _staffAssignmentRepository = staffAssignmentRepository;
        _userRepository = userRepository;
    }

    public async Task<ApiResponseDto<IEnumerable<OwnerStaffDto>>> GetStaffAsync(int complexId)
    {
        var list = await _staffAssignmentRepository.GetByComplexIdAsync(complexId);
        return new ApiResponseDto<IEnumerable<OwnerStaffDto>>(200, "Success", list.Select(Map));
    }

    public async Task<ApiResponseDto<OwnerStaffDto>> AssignStaffAsync(int ownerUserId, CreateStaffAssignmentDto dto)
    {
        var user = await _userRepository.GetByEmailAsync(dto.Email.Trim());
        if (user == null)
            return new ApiResponseDto<OwnerStaffDto>(404, "Không tìm thấy tài khoản nhân viên với email này.");

        if (user.Role is Roles.Admin or Roles.CourtOwner)
            return new ApiResponseDto<OwnerStaffDto>(403, "Không thể gán vai trò Admin hoặc Chủ sân cho nhân viên vận hành.");

        if (user.Role != Roles.Staff)
        {
            user.Role = Roles.Staff;
            await _userRepository.UpdateAsync(user);
        }

        var existing = await _staffAssignmentRepository.GetByStaffAndComplexAsync(user.UserId, dto.ComplexId);
        if (existing != null && existing.Status == "Active")
            return new ApiResponseDto<OwnerStaffDto>(409, "Nhân viên đã được phân công tại tổ hợp này.");

        var assignment = new StaffAssignment
        {
            StaffUserId = user.UserId,
            ComplexId = dto.ComplexId,
            Status = "Active",
            CanCheckIn = dto.CanCheckIn,
            CanCreateWalkIn = dto.CanCreateWalkIn,
            CanManageRental = dto.CanManageRental,
            CanApplySurcharge = dto.CanApplySurcharge,
            AssignedByUserId = ownerUserId,
            CreatedAt = DateTime.UtcNow,
            IsDeleted = false
        };

        var created = await _staffAssignmentRepository.CreateAsync(assignment);
        created.StaffUser = user;
        return new ApiResponseDto<OwnerStaffDto>(201, "Phân công nhân viên thành công.", Map(created));
    }

    public async Task<ApiResponseDto<OwnerStaffDto>> UpdatePermissionsAsync(int assignmentId, int complexId, UpdateStaffPermissionsDto dto)
    {
        var assignment = await _staffAssignmentRepository.GetByIdAsync(assignmentId);
        if (assignment == null || assignment.ComplexId != complexId)
            return new ApiResponseDto<OwnerStaffDto>(404, "Không tìm thấy phân công.");

        if (dto.CanCheckIn.HasValue) assignment.CanCheckIn = dto.CanCheckIn.Value;
        if (dto.CanCreateWalkIn.HasValue) assignment.CanCreateWalkIn = dto.CanCreateWalkIn.Value;
        if (dto.CanManageRental.HasValue) assignment.CanManageRental = dto.CanManageRental.Value;
        if (dto.CanApplySurcharge.HasValue) assignment.CanApplySurcharge = dto.CanApplySurcharge.Value;
        assignment.UpdatedAt = DateTime.UtcNow;

        await _staffAssignmentRepository.UpdateAsync(assignment);
        return new ApiResponseDto<OwnerStaffDto>(200, "Cập nhật quyền thành công.", Map(assignment));
    }

    public async Task<ApiResponseDto<OwnerStaffDto>> UpdateStatusAsync(int assignmentId, int complexId, UpdateStaffStatusDto dto)
    {
        var allowed = new[] { "Active", "Inactive", "Suspended" };
        if (!allowed.Contains(dto.Status, StringComparer.OrdinalIgnoreCase))
            return new ApiResponseDto<OwnerStaffDto>(400, "Trạng thái không hợp lệ.");

        var assignment = await _staffAssignmentRepository.GetByIdAsync(assignmentId);
        if (assignment == null || assignment.ComplexId != complexId)
            return new ApiResponseDto<OwnerStaffDto>(404, "Không tìm thấy phân công.");

        assignment.Status = dto.Status;
        assignment.UpdatedAt = DateTime.UtcNow;
        await _staffAssignmentRepository.UpdateAsync(assignment);
        return new ApiResponseDto<OwnerStaffDto>(200, "Cập nhật trạng thái thành công.", Map(assignment));
    }

    public async Task<ApiResponseDto<object>> RemoveAssignmentAsync(int assignmentId, int complexId)
    {
        var assignment = await _staffAssignmentRepository.GetByIdAsync(assignmentId);
        if (assignment == null || assignment.ComplexId != complexId)
            return new ApiResponseDto<object>(404, "Không tìm thấy phân công.");

        await _staffAssignmentRepository.DeleteAsync(assignment);

        var remaining = await _staffAssignmentRepository.CountByStaffUserIdAsync(assignment.StaffUserId);
        if (remaining == 0)
        {
            var user = await _userRepository.GetByIdAsync(assignment.StaffUserId);
            if (user != null && user.Role == Roles.Staff)
            {
                user.Role = Roles.Customer;
                await _userRepository.UpdateAsync(user);
            }
        }

        return new ApiResponseDto<object>(200, "Đã gỡ phân công nhân viên.");
    }

    private static OwnerStaffDto Map(StaffAssignment s) => new()
    {
        StaffAssignmentId = s.StaffAssignmentId,
        StaffUserId = s.StaffUserId,
        FullName = s.StaffUser?.FullName ?? "",
        Email = s.StaffUser?.Email ?? "",
        PhoneNumber = s.StaffUser?.PhoneNumber,
        ComplexId = s.ComplexId,
        Status = s.Status,
        CanCheckIn = s.CanCheckIn,
        CanCreateWalkIn = s.CanCreateWalkIn,
        CanManageRental = s.CanManageRental,
        CanApplySurcharge = s.CanApplySurcharge
    };
}
