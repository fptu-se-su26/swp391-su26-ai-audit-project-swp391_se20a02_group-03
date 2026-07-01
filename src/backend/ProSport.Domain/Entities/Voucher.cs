namespace ProSport.Domain.Entities;

public class Voucher : BaseEntity
{
    public int VoucherId { get; set; }
    public string Code { get; set; } = null!;
    public string Name { get; set; } = null!;
    public decimal DiscountPercent { get; set; }
    public decimal? MaxDiscountAmount { get; set; }
    public decimal? MinOrderAmount { get; set; }
    public int TotalQuantity { get; set; }
    public int UsedQuantity { get; set; } = 0;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int? CreatedByStaffId { get; set; }
    public int? ApplicableComplexId { get; set; }
    public int? ApplicableProductId { get; set; }
    public string VoucherType { get; set; } = "Percent";

    /// <summary>Active | Inactive | Expired — nguồn duy nhất cho trạng thái voucher.</summary>
    public string Status { get; set; } = "Active";

    public User? CreatedByStaff { get; set; }
    public Complex? ApplicableComplex { get; set; }
    public ProductStock? ApplicableProduct { get; set; }
}
