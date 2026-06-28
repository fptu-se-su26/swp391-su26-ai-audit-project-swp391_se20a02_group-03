using System.ComponentModel.DataAnnotations;

namespace ProSport.Application.DTOs;

// Voucher giảm giá phát hành bởi Admin/Staff.
public class VoucherDto
{
    public int VoucherId { get; set; }
    public string Code { get; set; } = null!;
    public string Name { get; set; } = null!;
    public decimal DiscountPercent { get; set; }
    public decimal? MaxDiscountAmount { get; set; }
    public decimal? MinOrderAmount { get; set; }
    public int TotalQuantity { get; set; }
    public int UsedQuantity { get; set; }
    public int RemainingQuantity => TotalQuantity - UsedQuantity;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateVoucherDto
{
    [Required, MaxLength(50)]
    public string Code { get; set; } = null!;

    [Required, MaxLength(200)]
    public string Name { get; set; } = null!;

    [Range(0.01, 100, ErrorMessage = "Phần trăm giảm giá phải từ 0.01 đến 100.")]
    public decimal DiscountPercent { get; set; }

    public decimal? MaxDiscountAmount { get; set; }
    public decimal? MinOrderAmount { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Số lượng phải lớn hơn 0.")]
    public int TotalQuantity { get; set; }

    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }
}

public class UpdateVoucherDto
{
    [Required, MaxLength(200)]
    public string Name { get; set; } = null!;

    [Range(0.01, 100, ErrorMessage = "Phần trăm giảm giá phải từ 0.01 đến 100.")]
    public decimal DiscountPercent { get; set; }

    public decimal? MaxDiscountAmount { get; set; }
    public decimal? MinOrderAmount { get; set; }

    [Range(0, int.MaxValue)]
    public int TotalQuantity { get; set; }

    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }

    public bool IsActive { get; set; }
}
