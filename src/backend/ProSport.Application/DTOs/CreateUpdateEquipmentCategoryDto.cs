using System.ComponentModel.DataAnnotations;

namespace ProSport.Application.DTOs;

public class CreateUpdateEquipmentCategoryDto
{
    [Required(ErrorMessage = "Tên danh mục là bắt buộc.")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Tên danh mục phải từ 2 đến 100 ký tự.")]
    public string Name { get; set; } = null!;

    [StringLength(500, ErrorMessage = "Mô tả tối đa 500 ký tự.")]
    public string? Description { get; set; }
}
