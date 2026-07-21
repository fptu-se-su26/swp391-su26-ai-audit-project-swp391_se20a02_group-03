using System.ComponentModel.DataAnnotations;

namespace ProSport.Application.DTOs;

public class CreateEquipmentDto
{
    [Range(1, int.MaxValue, ErrorMessage = "Danh mục thiết bị không hợp lệ.")]
    public int EquipmentCategoryId { get; set; }

    [Required(ErrorMessage = "Tên thiết bị là bắt buộc.")]
    [StringLength(150, MinimumLength = 2, ErrorMessage = "Tên thiết bị phải từ 2 đến 150 ký tự.")]
    public string Name { get; set; } = null!;

    [StringLength(1000, ErrorMessage = "Mô tả tối đa 1000 ký tự.")]
    public string? Description { get; set; }

    [Range(0, 1_000_000_000, ErrorMessage = "Giá phải từ 0 đến 1 tỷ.")]
    public decimal Price { get; set; }

    [Required(ErrorMessage = "Môn thể thao là bắt buộc.")]
    [RegularExpression("^(Badminton|Pickleball)$", ErrorMessage = "Môn thể thao chỉ được là 'Badminton' hoặc 'Pickleball'.")]
    public string SportType { get; set; } = null!;

    [Range(0, 1_000_000, ErrorMessage = "Số lượng tồn kho phải từ 0 đến 1,000,000.")]
    public int StockQuantity { get; set; }

    [Url(ErrorMessage = "ImageUrl không đúng định dạng URL.")]
    [StringLength(500)]
    public string? ImageUrl { get; set; }
}
