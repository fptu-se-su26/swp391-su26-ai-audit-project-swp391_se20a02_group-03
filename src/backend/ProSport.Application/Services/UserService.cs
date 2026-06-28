using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;

namespace ProSport.Application.Services;

// TK-010: Triển khai nghiệp vụ quản lý người dùng.
public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<ApiResponseDto<PagedResult<UserDto>>> GetUsersAsync(AdminUserQueryParameters parameters)
    {
        var (items, totalCount) = await _userRepository.GetPagedAsync(
            parameters.Search, parameters.Role, parameters.Page, parameters.PageSize);

        var dtos = items.Select(MapToDto).ToList();

        var result = new PagedResult<UserDto>
        {
            Items = dtos,
            TotalCount = totalCount,
            CurrentPage = parameters.Page,
            TotalPages = (int)Math.Ceiling(totalCount / (double)parameters.PageSize)
        };

        return new ApiResponseDto<PagedResult<UserDto>>(200, "Lấy danh sách người dùng thành công.", result);
    }

    public async Task<ApiResponseDto<object>> SetLockStatusAsync(int userId, bool isLocked)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user is null)
        {
            return new ApiResponseDto<object>(404, "Không tìm thấy người dùng.");
        }

        // Không cho phép khóa tài khoản Admin để tránh tự khóa toàn hệ thống.
        if (isLocked && user.Role == "Admin")
        {
            return new ApiResponseDto<object>(400, "Không thể khóa tài khoản Admin.");
        }

        if (user.IsLocked == isLocked)
        {
            var alreadyMsg = isLocked ? "Tài khoản đã bị khóa từ trước." : "Tài khoản đang ở trạng thái hoạt động.";
            return new ApiResponseDto<object>(200, alreadyMsg);
        }

        user.IsLocked = isLocked;
        await _userRepository.UpdateAsync(user);

        var message = isLocked ? "Khóa tài khoản thành công." : "Mở khóa tài khoản thành công.";
        return new ApiResponseDto<object>(200, message);
    }

    private static UserDto MapToDto(Domain.Entities.User u) => new()
    {
        UserId = u.UserId,
        FullName = u.FullName,
        Email = u.Email,
        PhoneNumber = u.PhoneNumber,
        Role = u.Role,
        EKycStatus = u.EKycStatus,
        AvatarUrl = u.AvatarUrl,
        IsPhoneVerified = u.IsPhoneVerified,
        IsLocked = u.IsLocked,
        CreatedAt = u.CreatedAt
    };
}
