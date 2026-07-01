namespace ProSport.Domain.Entities;

/// <summary>
/// Tổ hợp thể thao (Complex/Facility).
/// </summary>
public class Complex : BaseEntity
{
    public int ComplexId { get; set; }
    public string Name { get; set; } = null!;
    public string? Address { get; set; }
    public string? Description { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? LogoUrl { get; set; }

    /// <summary>Giờ mở cửa mặc định (fallback khi chưa có ComplexOperatingSchedule).</summary>
    public TimeSpan? OpeningTime { get; set; }

    /// <summary>Giờ đóng cửa mặc định (fallback khi chưa có ComplexOperatingSchedule).</summary>
    public TimeSpan? ClosingTime { get; set; }

    public int SlotDurationMinutes { get; set; } = 60;
    public string Status { get; set; } = "Active";

    public ICollection<Court> Courts { get; set; } = new List<Court>();
    public ICollection<ComplexOwner> ComplexOwners { get; set; } = new List<ComplexOwner>();
}
