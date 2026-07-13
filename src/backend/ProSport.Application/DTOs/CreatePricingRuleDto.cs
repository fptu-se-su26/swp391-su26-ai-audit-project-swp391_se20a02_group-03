using System;
using System.ComponentModel.DataAnnotations;

namespace ProSport.Application.DTOs;

public class CreatePricingRuleDto
{
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }

    [Range(0, 100_000_000, ErrorMessage = "Giá theo giờ phải từ 0 đến 100 triệu.")]
    public decimal PricePerHour { get; set; }

    [Range(0.1, 10, ErrorMessage = "Hệ số nhân phải từ 0.1 đến 10.")]
    public decimal? Multiplier { get; set; }

    public bool IsWeekend { get; set; }

    [Range(0, 6, ErrorMessage = "DayOfWeek phải từ 0 (Chủ nhật) đến 6 (Thứ bảy).")]
    public int? DayOfWeek { get; set; }

    public DateTime? ValidFrom { get; set; }
    public DateTime? ValidTo { get; set; }

    [Required(ErrorMessage = "RuleType là bắt buộc.")]
    [StringLength(30, ErrorMessage = "RuleType tối đa 30 ký tự.")]
    public string RuleType { get; set; } = "BasePrice";

    [RegularExpression("^(Active|Inactive)$", ErrorMessage = "Status phải là Active hoặc Inactive.")]
    public string Status { get; set; } = "Active";
}
