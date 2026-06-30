namespace ProSport.Domain.Entities;

public class Voucher : BaseEntity
{
    public int VoucherId { get; set; }
    public string Code { get; set; } = null!; // Mã voucher (unique)
    public string Name { get; set; } = null!;
    public decimal DiscountPercent { get; set; } // % giảm giá (VD: 10 = 10%)
    public decimal? MaxDiscountAmount { get; set; } // Giảm tối đa (VND)
    public decimal? MinOrderAmount { get; set; } // Đơn tối thiểu để áp dụng
    public int TotalQuantity { get; set; }
    public int UsedQuantity { get; set; } = 0;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsActive { get; set; } = true;
    public int? CreatedByStaffId { get; set; }
    public int? ApplicableComplexId { get; set; }
    public int? ApplicableProductId { get; set; }
    public string VoucherType { get; set; } = "Percent";
    public string Status { get; set; } = "Active";

    // Navigation properties
    public User? CreatedByStaff { get; set; }
    public Complex? ApplicableComplex { get; set; }
    public ProductStock? ApplicableProduct { get; set; }
}
