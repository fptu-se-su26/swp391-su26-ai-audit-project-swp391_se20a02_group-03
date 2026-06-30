using System.ComponentModel.DataAnnotations;

namespace ProSport.Application.DTOs;

// Khiếu nại / báo cáo người chơi sau trận (bùng kèo, gian lận...).
public class ReportDto
{
    public int ReportId { get; set; }
    public int ReporterId { get; set; }
    public int ReportedUserId { get; set; }
    public int MatchId { get; set; }
    public string Reason { get; set; } = null!;
    public string? Evidence { get; set; }
    public string Status { get; set; } = null!;
    public string? AdminNote { get; set; }
    public int? ResolvedByAdminId { get; set; }
    public string? ReporterName { get; set; }
    public string? ReportedUserName { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateReportDto
{
    [Required]
    public int ReportedUserId { get; set; }

    [Required]
    public int MatchId { get; set; }

    [Required, MaxLength(1000)]
    public string Reason { get; set; } = null!;

    [MaxLength(500)]
    public string? Evidence { get; set; }
}

public class ResolveReportDto
{
    // Trạng thái mới: Investigating, Resolved, Rejected.
    [Required]
    public string Status { get; set; } = null!;

    [MaxLength(1000)]
    public string? AdminNote { get; set; }
}
