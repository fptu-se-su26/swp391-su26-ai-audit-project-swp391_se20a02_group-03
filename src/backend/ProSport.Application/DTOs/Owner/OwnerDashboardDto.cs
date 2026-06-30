namespace ProSport.Application.DTOs.Owner;

public class OwnerDashboardDto
{
    public decimal TotalRevenue { get; set; }
    public decimal BookingRevenue { get; set; }
    public decimal RentalRevenue { get; set; }
    public decimal ProductRevenue { get; set; }
    public decimal SurchargeRevenue { get; set; }
    public decimal RefundAmount { get; set; }
    public int BookingCount { get; set; }
    public int PendingBookingCount { get; set; }
    public decimal OccupancyRate { get; set; }
    public int ActiveRentalCount { get; set; }
    public int DamagedAssetCount { get; set; }
    public int LowStockCount { get; set; }
    public List<OwnerUpcomingBookingDto> UpcomingBookings { get; set; } = new();
    public List<OwnerRevenuePointDto> RevenueByDate { get; set; } = new();
    public List<OwnerOccupancyByCourtDto> OccupancyByCourt { get; set; } = new();
}

public class OwnerUpcomingBookingDto
{
    public int BookingId { get; set; }
    public string CustomerName { get; set; } = null!;
    public string CourtName { get; set; } = null!;
    public DateTime BookingDate { get; set; }
    public string StartTime { get; set; } = null!;
    public string EndTime { get; set; } = null!;
    public string Status { get; set; } = null!;
    public decimal TotalAmount { get; set; }
}

public class OwnerRevenuePointDto
{
    public string Label { get; set; } = null!;
    public decimal Amount { get; set; }
}

public class OwnerOccupancyByCourtDto
{
    public int CourtId { get; set; }
    public string CourtName { get; set; } = null!;
    public decimal OccupancyRate { get; set; }
    public int BookedSlots { get; set; }
    public int TotalSlots { get; set; }
}

public class OwnerStaffDto
{
    public int StaffAssignmentId { get; set; }
    public int StaffUserId { get; set; }
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? PhoneNumber { get; set; }
    public int ComplexId { get; set; }
    public string Status { get; set; } = null!;
    public bool CanCheckIn { get; set; }
    public bool CanCreateWalkIn { get; set; }
    public bool CanManageRental { get; set; }
    public bool CanApplySurcharge { get; set; }
}

public class CreateStaffAssignmentDto
{
    public string Email { get; set; } = null!;
    public int ComplexId { get; set; }
    public bool CanCheckIn { get; set; } = true;
    public bool CanCreateWalkIn { get; set; } = true;
    public bool CanManageRental { get; set; } = true;
    public bool CanApplySurcharge { get; set; }
}

public class UpdateStaffPermissionsDto
{
    public bool? CanCheckIn { get; set; }
    public bool? CanCreateWalkIn { get; set; }
    public bool? CanManageRental { get; set; }
    public bool? CanApplySurcharge { get; set; }
}

public class UpdateStaffStatusDto
{
    public string Status { get; set; } = null!;
}

public class UpdateComplexDto
{
    public string? Name { get; set; }
    public string? Address { get; set; }
    public string? Description { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? LogoUrl { get; set; }
    public string? OpeningTime { get; set; }
    public string? ClosingTime { get; set; }
}

public class OwnerCourtCreateDto
{
    public int ComplexId { get; set; }
    public string Name { get; set; } = null!;
    public string? Code { get; set; }
    public int CourtTypeId { get; set; }
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public decimal BasePrice { get; set; }
}

public class OwnerCourtUpdateDto
{
    public string? Name { get; set; }
    public string? Code { get; set; }
    public int? CourtTypeId { get; set; }
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
}

public class OwnerCourtStatusDto
{
    public string Status { get; set; } = null!;
}

public class OwnerBookingQueryDto
{
    public int ComplexId { get; set; }
    public int? CourtId { get; set; }
    public DateTime? DateFrom { get; set; }
    public DateTime? DateTo { get; set; }
    public string? Status { get; set; }
    public string? Keyword { get; set; }
    public int Page { get; set; } = 1;
    public int Size { get; set; } = 20;
}
