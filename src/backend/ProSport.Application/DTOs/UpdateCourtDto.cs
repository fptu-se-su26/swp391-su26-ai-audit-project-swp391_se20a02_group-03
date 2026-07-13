using System.ComponentModel.DataAnnotations;

namespace ProSport.Application.DTOs
{
    public class UpdateCourtDto
    {
        // Optional fields – if null, the existing value is kept
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Tên sân phải từ 2 đến 100 ký tự.")]
        public string? Name { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Loại sân không hợp lệ.")]
        public int? CourtTypeId { get; set; }

        [Url(ErrorMessage = "ImageUrl không đúng định dạng URL.")]
        [StringLength(500)]
        public string? ImageUrl { get; set; }

        [StringLength(1000, ErrorMessage = "Mô tả tối đa 1000 ký tự.")]
        public string? Description { get; set; }

        // Khớp CourtStatuses.NormalizeApiStatus: chấp nhận ACTIVE/AVAILABLE/MAINTENANCE/INACTIVE (không phân biệt hoa thường)
        [RegularExpression("^(?i)(ACTIVE|AVAILABLE|MAINTENANCE|INACTIVE)$", ErrorMessage = "Status phải là ACTIVE, AVAILABLE, MAINTENANCE hoặc INACTIVE.")]
        public string? Status { get; set; }
    }
}
