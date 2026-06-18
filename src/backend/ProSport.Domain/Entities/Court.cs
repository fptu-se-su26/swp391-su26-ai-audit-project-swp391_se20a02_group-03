using System.ComponentModel.DataAnnotations.Schema;

namespace ProSport.Domain.Entities;

/// <summary>
/// Bảng Courts — Migration: [Name] NVARCHAR(100), [CourtTypeId] FK, [Status] default 'Available'
/// PATCH V2:
///   - SportType: thêm [NotMapped] — không có trong migration, EF bỏ qua không sinh SQL column.
///   - Status default: đổi "Active" → "Available" để khớp DB default trong migration.
///   - Xóa ICollection&lt;Booking&gt; Bookings: gây shadow FK 'CourtId' trên Bookings table.
///   - Xóa ICollection&lt;Match&gt; Matches: gây shadow FK 'CourtId1' trên Matches table.
/// </summary>
public class Court : BaseEntity
{
    public int CourtId { get; set; }
    public string Name { get; set; } = null!;
    public int CourtTypeId { get; set; }

    /// <summary>
    /// [NotMapped]: Không có cột SportType trong migration. 
    /// Giữ lại property để không break DTO/code khác nhưng EF sẽ bỏ qua.
    /// </summary>
    [NotMapped]
    public string? SportType { get; set; }

    public string? Description { get; set; }
    public string? ImageUrl { get; set; }

    /// <summary>
    /// Default "Available" khớp với DB default trong migration (HasDefaultValue("Available")).
    /// </summary>
    public string Status { get; set; } = "Available";

    // Navigation properties
    public CourtType CourtType { get; set; } = null!;
    public ICollection<PricingRule> PricingRules { get; set; } = new List<PricingRule>();
    public ICollection<BookingDetail> BookingDetails { get; set; } = new List<BookingDetail>();

    // NOTE: ICollection<Booking> Bookings đã bị xóa — gây shadow property 'CourtId' trên Bookings table.
    // NOTE: ICollection<Match> Matches đã bị xóa — gây shadow property 'CourtId1' trên Matches table.
    // Booking được access qua BookingDetail.Court. Match.Court là one-way navigation từ phía Match.
}
