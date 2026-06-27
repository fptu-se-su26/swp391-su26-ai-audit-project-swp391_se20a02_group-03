namespace ProSport.Application.DTOs;

// TK-010: DTO hiển thị thông tin tài khoản cho màn hình quản lý của Admin.
public class UserDto
{
    public int UserId { get; set; }
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? PhoneNumber { get; set; }
    public string Role { get; set; } = null!;
    public string EKycStatus { get; set; } = null!;
    public string? AvatarUrl { get; set; }
    public bool IsPhoneVerified { get; set; }
    public bool IsLocked { get; set; }
    public DateTime CreatedAt { get; set; }
}

// TK-010: tham số lọc/phân trang danh sách người dùng.
public class AdminUserQueryParameters
{
    private const int MaxPageSize = 100;
    private int _pageSize = 10;

    public string? Search { get; set; }
    public string? Role { get; set; }
    public int Page { get; set; } = 1;

    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = value > MaxPageSize ? MaxPageSize : (value < 1 ? 10 : value);
    }
}
