namespace ProSport.Domain.Entities;

/// <summary>
/// Bảng liên kết giữa User (role CourtOwner) và Complex.
/// Một user có thể sở hữu/quản lý nhiều Complex; một Complex có thể có nhiều Owner.
/// UNIQUE(UserId, ComplexId) — tránh trùng lặp.
/// </summary>
public class ComplexOwner : BaseEntity
{
    public int ComplexOwnerId { get; set; }

    /// <summary>UserId của người dùng có role CourtOwner.</summary>
    public int UserId { get; set; }

    /// <summary>ComplexId của tổ hợp được quản lý.</summary>
    public int ComplexId { get; set; }

    /// <summary>
    /// Là primary owner (người đại diện chính) của tổ hợp này?
    /// Dùng để xác định default complex khi Owner quản lý nhiều Complex.
    /// </summary>
    public bool IsPrimary { get; set; } = false;

    /// <summary>
    /// Trạng thái liên kết: Active | Inactive | Suspended.
    /// Chỉ Active mới có quyền truy cập. Admin có thể suspend mà không xóa dữ liệu.
    /// </summary>
    public string Status { get; set; } = "Active";

    /// <summary>Admin đã phê duyệt liên kết này. Null = chưa duyệt hoặc tự tạo.</summary>
    public int? ApprovedByAdminId { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
    public Complex Complex { get; set; } = null!;
    public User? ApprovedByAdmin { get; set; }
}
