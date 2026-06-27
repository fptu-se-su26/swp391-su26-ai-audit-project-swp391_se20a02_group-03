using System.ComponentModel.DataAnnotations;

namespace ProSport.Application.DTOs;

// Hồ sơ E-KYC để Admin phê duyệt (mở khóa Ví Escrow & quyền Host kèo).
public class EkycProfileDto
{
    public int EkycProfileId { get; set; }
    public int UserId { get; set; }
    public string? UserEmail { get; set; }
    public string? ProfileFullName { get; set; }
    public string FullName { get; set; } = null!;
    public string IdentityNumber { get; set; } = null!;
    public string FrontImageUrl { get; set; } = null!;
    public string BackImageUrl { get; set; } = null!;
    public string FaceImageUrl { get; set; } = null!;
    public string Status { get; set; } = null!;
    public string? RejectionReason { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class RejectKycDto
{
    [Required, MaxLength(500)]
    public string Reason { get; set; } = null!;
}
