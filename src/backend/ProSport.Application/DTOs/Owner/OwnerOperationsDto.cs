using ProSport.Application.DTOs.Owner;

namespace ProSport.Application.DTOs.Owner;

public class ComplexOperatingHoursDto
{
    public int ComplexId { get; set; }
    public int SlotDurationMinutes { get; set; } = 60;
    public List<DayScheduleDto> WeeklySchedule { get; set; } = new();
    public List<ComplexClosureDto> Closures { get; set; } = new();
    public List<MaintenanceWindowDto> MaintenanceWindows { get; set; } = new();
}

public class DayScheduleDto
{
    public int DayOfWeek { get; set; }
    public string OpenTime { get; set; } = "06:00";
    public string CloseTime { get; set; } = "22:00";
}

public class ComplexClosureDto
{
    public int? ComplexClosureId { get; set; }
    public DateTime ClosureDate { get; set; }
    public string? Reason { get; set; }
}

public class MaintenanceWindowDto
{
    public int? ComplexMaintenanceWindowId { get; set; }
    public int? CourtId { get; set; }
    public DateTime StartAt { get; set; }
    public DateTime EndAt { get; set; }
    public string? Reason { get; set; }
}

public class SaveComplexOperatingHoursDto
{
    public int SlotDurationMinutes { get; set; } = 60;
    public List<DayScheduleDto> WeeklySchedule { get; set; } = new();
    public List<ComplexClosureDto> Closures { get; set; } = new();
    public List<MaintenanceWindowDto> MaintenanceWindows { get; set; } = new();
}

public class UpdatePricingRuleDto
{
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public decimal PricePerHour { get; set; }
    public decimal? Multiplier { get; set; }
    public bool IsWeekend { get; set; }
    public int? DayOfWeek { get; set; }
    public DateTime? ValidFrom { get; set; }
    public DateTime? ValidTo { get; set; }
    public string RuleType { get; set; } = "BasePrice";
    public string Status { get; set; } = "Active";
}

public class UpdateBookingStatusDto
{
    public string Status { get; set; } = null!;
}

public class OwnerBookingCalendarDto
{
    public int BookingId { get; set; }
    public int CourtId { get; set; }
    public string CourtName { get; set; } = null!;
    public string CustomerName { get; set; } = null!;
    public DateTime BookingDate { get; set; }
    public string StartTime { get; set; } = null!;
    public string EndTime { get; set; } = null!;
    public string Status { get; set; } = null!;
    public string PaymentStatus { get; set; } = null!;
    public decimal TotalAmount { get; set; }
}
