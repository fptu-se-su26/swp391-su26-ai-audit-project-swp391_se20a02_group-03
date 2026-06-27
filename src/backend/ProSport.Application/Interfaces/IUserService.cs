using ProSport.Application.DTOs;

namespace ProSport.Application.Interfaces;

// TK-010: Nghiệp vụ quản lý người dùng cho Admin.
public interface IUserService
{
    Task<ApiResponseDto<PagedResult<UserDto>>> GetUsersAsync(AdminUserQueryParameters parameters);

    // Khóa / mở khóa tài khoản (Ban / Unban).
    Task<ApiResponseDto<object>> SetLockStatusAsync(int userId, bool isLocked);
}
