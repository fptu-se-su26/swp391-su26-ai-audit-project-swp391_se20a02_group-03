namespace ProSport.Application.DTOs.Owner;

public class ProductStockDto
{
    public int ProductStockId { get; set; }
    public int ComplexId { get; set; }
    public string Sku { get; set; } = "";
    public string ProductName { get; set; } = "";
    public string Category { get; set; } = "";
    public int Quantity { get; set; }
    public int LowStockThreshold { get; set; }
    public decimal SellingPrice { get; set; }
    public string Status { get; set; } = "";
    public bool IsLowStock { get; set; }
}

public class CreateProductStockDto
{
    public int ComplexId { get; set; }
    public string Sku { get; set; } = "";
    public string ProductName { get; set; } = "";
    public string Category { get; set; } = "";
    public int Quantity { get; set; }
    public int LowStockThreshold { get; set; } = 5;
    public decimal SellingPrice { get; set; }
    public string Status { get; set; } = "Active";
}

public class UpdateProductStockDto
{
    public string? ProductName { get; set; }
    public string? Category { get; set; }
    public int? Quantity { get; set; }
    public int? LowStockThreshold { get; set; }
    public decimal? SellingPrice { get; set; }
    public string? Status { get; set; }
}

public class OwnerReportRevenueDto
{
    public decimal BookingRevenue { get; set; }
    public decimal RefundAmount { get; set; }
    public decimal EscrowHeld { get; set; }
    public decimal NetRevenue { get; set; }
    public List<RevenueByDayDto> RevenueByDay { get; set; } = new();
    public List<RevenueByCourtDto> RevenueByCourt { get; set; } = new();
}

public class RevenueByDayDto
{
    public DateTime Date { get; set; }
    public decimal Amount { get; set; }
}

public class RevenueByCourtDto
{
    public int CourtId { get; set; }
    public string CourtName { get; set; } = "";
    public decimal Amount { get; set; }
}

public class OwnerReportOccupancyDto
{
    public List<CourtOccupancyDto> Courts { get; set; } = new();
}

public class CourtOccupancyDto
{
    public int CourtId { get; set; }
    public string CourtName { get; set; } = "";
    public int BookedSlots { get; set; }
    public int TotalSlots { get; set; }
    public decimal OccupancyPercent { get; set; }
}

public class OwnerReportInventoryDto
{
    public int TotalProducts { get; set; }
    public int LowStockCount { get; set; }
}

public class ComplexReviewDto
{
    public int ComplexReviewId { get; set; }
    public int ComplexId { get; set; }
    public string CustomerName { get; set; } = "";
    public int Rating { get; set; }
    public string Content { get; set; } = "";
    public string? OwnerReply { get; set; }
    public DateTime? OwnerReplyAt { get; set; }
    public bool IsReported { get; set; }
    public string Status { get; set; } = "";
    public DateTime CreatedAt { get; set; }
}

public class OwnerReviewReplyDto
{
    public string Reply { get; set; } = "";
}

public class OwnerReviewReportDto
{
    public string Reason { get; set; } = "";
}

public class AuditLogDto
{
    public long AuditLogId { get; set; }
    public int? ActorUserId { get; set; }
    public string Action { get; set; } = "";
    public string EntityType { get; set; } = "";
    public string EntityId { get; set; } = "";
    public int? ComplexId { get; set; }
    public string? OldValues { get; set; }
    public string? NewValues { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class AuditLogQueryDto
{
    public int ComplexId { get; set; }
    public string? EntityType { get; set; }
    public DateTime? From { get; set; }
    public DateTime? To { get; set; }
    public int Page { get; set; } = 1;
    public int Size { get; set; } = 20;
}

public class OwnerVoucherDto
{
    public int VoucherId { get; set; }
    public string Code { get; set; } = "";
    public string Name { get; set; } = "";
    public string VoucherType { get; set; } = "";
    public decimal DiscountPercent { get; set; }
    public decimal? MaxDiscountAmount { get; set; }
    public decimal? MinOrderAmount { get; set; }
    public int TotalQuantity { get; set; }
    public int UsedQuantity { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int? ApplicableComplexId { get; set; }
    public int? ApplicableProductId { get; set; }
    public string Status { get; set; } = "";
    public bool IsActive { get; set; }
}

public class CreateOwnerVoucherDto
{
    public string Code { get; set; } = "";
    public string Name { get; set; } = "";
    public string VoucherType { get; set; } = "Percent";
    public decimal DiscountPercent { get; set; }
    public decimal? MaxDiscountAmount { get; set; }
    public decimal? MinOrderAmount { get; set; }
    public int TotalQuantity { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int? ApplicableProductId { get; set; }
}

public class UpdateOwnerVoucherDto
{
    public string? Name { get; set; }
    public decimal? DiscountPercent { get; set; }
    public decimal? MaxDiscountAmount { get; set; }
    public decimal? MinOrderAmount { get; set; }
    public int? TotalQuantity { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public int? ApplicableProductId { get; set; }
}

public class UpdateVoucherStatusDto
{
    public string Status { get; set; } = "";
}

public class OwnerInventoryQueryDto
{
    public int ComplexId { get; set; }
    public string? Keyword { get; set; }
    public string? Category { get; set; }
    public string? Status { get; set; }
    public int Page { get; set; } = 1;
    public int Size { get; set; } = 20;
}
