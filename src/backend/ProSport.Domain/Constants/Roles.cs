namespace ProSport.Domain.Constants;

/// <summary>
/// Hằng số Role — dùng thống nhất toàn hệ thống thay vì hard-code string rải rác.
/// Role được lưu dạng varchar(20) trong DB.
/// </summary>
public static class Roles
{
    /// <summary>System Administrator — toàn quyền toàn hệ thống.</summary>
    public const string Admin = "Admin";

    /// <summary>Nhân viên vận hành tại sân.</summary>
    public const string Staff = "Staff";

    /// <summary>Người chơi / khách hàng đặt sân.</summary>
    public const string Customer = "Customer";

    /// <summary>
    /// Chủ sân / Chủ tổ hợp thể thao — chỉ quản lý dữ liệu
    /// của tổ hợp được phân quyền, không truy cập tổ hợp khác.
    /// </summary>
    public const string CourtOwner = "CourtOwner";
}
