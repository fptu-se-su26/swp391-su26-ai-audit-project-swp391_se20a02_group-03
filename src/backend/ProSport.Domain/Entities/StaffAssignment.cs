namespace ProSport.Domain.Entities;

/// <summary>
/// Phân công nhân viên vận hành tại một tổ hợp thể thao.
/// Owner quản lý Staff thông qua bảng này — Staff không truy cập Owner Dashboard.
/// </summary>
public class StaffAssignment : BaseEntity
{
    public int StaffAssignmentId { get; set; }
    public int StaffUserId { get; set; }
    public int ComplexId { get; set; }

    /// <summary>Active | Inactive | Suspended</summary>
    public string Status { get; set; } = "Active";

    public bool CanCheckIn { get; set; } = true;
    public bool CanCreateWalkIn { get; set; } = true;

    public int? AssignedByUserId { get; set; }

    public User StaffUser { get; set; } = null!;
    public Complex Complex { get; set; } = null!;
    public User? AssignedByUser { get; set; }
}
