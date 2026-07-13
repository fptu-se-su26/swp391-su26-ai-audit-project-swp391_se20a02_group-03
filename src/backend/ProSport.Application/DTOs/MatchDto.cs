using System.ComponentModel.DataAnnotations;

namespace ProSport.Application.DTOs;

public class MatchDto
{
    public int MatchId { get; set; }
    public int HostId { get; set; }
    public int CourtId { get; set; }
    public int? BookingId { get; set; }
    public DateTime MatchDate { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public int MaxParticipants { get; set; }
    public int CurrentParticipants { get; set; }
    public decimal EscrowAmount { get; set; }
    public string Status { get; set; } = null!;
    public string? LevelRequirement { get; set; }
    public string? Notes { get; set; }
    public string? HostName { get; set; }
    public string? CourtName { get; set; }
    public string? SportType { get; set; }
}

public class CreateMatchDto
{
    [Range(1, int.MaxValue, ErrorMessage = "Sân không hợp lệ.")]
    public int CourtId { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Phải có booking hợp lệ trước khi tạo kèo.")]
    public int BookingId { get; set; } // Phải có booking trước mới tạo được kèo

    [Required(ErrorMessage = "Ngày diễn ra trận là bắt buộc.")]
    public DateTime MatchDate { get; set; }

    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }

    [Range(2, 50, ErrorMessage = "Số người tham gia phải từ 2 đến 50.")]
    public int MaxParticipants { get; set; }

    [Range(0, 100_000_000, ErrorMessage = "Tiền cọc phải từ 0 đến 100 triệu.")]
    public decimal EscrowAmount { get; set; } // Host tự quy định số tiền cọc cho mỗi Joiner

    [StringLength(50, ErrorMessage = "Yêu cầu trình độ tối đa 50 ký tự.")]
    public string? LevelRequirement { get; set; }

    [StringLength(500, ErrorMessage = "Ghi chú tối đa 500 ký tự.")]
    public string? Notes { get; set; }
}

public class MatchParticipantDto
{
    public int MatchParticipantId { get; set; }
    public int MatchId { get; set; }
    public int UserId { get; set; }
    public string Role { get; set; } = null!;
    public string Status { get; set; } = null!;
    public bool HasPaidEscrow { get; set; }
}
