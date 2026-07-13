using System.ComponentModel.DataAnnotations;

namespace ProSport.Application.DTOs;

public class CourtDto
{
    public int CourtId { get; set; }
    public string Name { get; set; } = null!;
    public string? Code { get; set; }
    public int? ComplexId { get; set; }
    public string CourtTypeName { get; set; } = null!;
    public string Status { get; set; } = null!;
    public string? ImageUrl { get; set; }
    public string? Description { get; set; }
    public decimal PricePerHour { get; set; }
}

public class CourtAvailabilityDto
{
    public int CourtId { get; set; }
    public string Date { get; set; } = null!;
    public int SlotDurationMinutes { get; set; } = 60;
    public bool IsClosed { get; set; }
    public List<string> Slots { get; set; } = new();
    public List<string> BookedSlots { get; set; } = new();
}

public class CreateCourtDto
{
    [Required(ErrorMessage = "Tên sân là bắt buộc.")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Tên sân phải từ 2 đến 100 ký tự.")]
    public string Name { get; set; } = null!;

    [Range(1, int.MaxValue, ErrorMessage = "Loại sân không hợp lệ.")]
    public int CourtTypeId { get; set; }

    [Url(ErrorMessage = "ImageUrl không đúng định dạng URL.")]
    [StringLength(500)]
    public string? ImageUrl { get; set; }

    [StringLength(1000, ErrorMessage = "Mô tả tối đa 1000 ký tự.")]
    public string? Description { get; set; }
}
