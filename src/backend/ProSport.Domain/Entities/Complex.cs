namespace ProSport.Domain.Entities;

/// <summary>
/// Tổ hợp thể thao (Complex/Facility).
/// Mỗi Complex có thể chứa nhiều Courts và được quản lý bởi một hoặc nhiều CourtOwner.
/// </summary>
public class Complex : BaseEntity
{
    public int ComplexId { get; set; }

    /// <summary>Tên tổ hợp thể thao. Ví dụ: "Pro-Sport Complex Quận 7".</summary>
    public string Name { get; set; } = null!;

    /// <summary>Địa chỉ đầy đủ.</summary>
    public string? Address { get; set; }

    /// <summary>Mô tả tổ hợp.</summary>
    public string? Description { get; set; }

    /// <summary>Số điện thoại liên hệ.</summary>
    public string? Phone { get; set; }

    /// <summary>Email liên hệ.</summary>
    public string? Email { get; set; }

    /// <summary>URL logo hoặc ảnh đại diện.</summary>
    public string? LogoUrl { get; set; }

    /// <summary>Giờ mở cửa (hh:mm). Ví dụ: "06:00".</summary>
    public string? OpeningTime { get; set; }

    /// <summary>Giờ đóng cửa (hh:mm). Ví dụ: "23:00".</summary>
    public string? ClosingTime { get; set; }

    /// <summary>Thời lượng slot đặt sân (phút). Mặc định 60.</summary>
    public int SlotDurationMinutes { get; set; } = 60;

    /// <summary>
    /// Trạng thái hoạt động: Active | Inactive | Suspended.
    /// Default: Active.
    /// </summary>
    public string Status { get; set; } = "Active";

    // Navigation properties
    public ICollection<Court> Courts { get; set; } = new List<Court>();
    public ICollection<ComplexOwner> ComplexOwners { get; set; } = new List<ComplexOwner>();
}
