using System.ComponentModel.DataAnnotations.Schema;

namespace ProSport.Domain.Entities;

[Table("Users")]
public class User : BaseEntity
{
    [Column("UserId")]
    public int UserId { get; set; }

    [Column("FullName")]
    public string FullName { get; set; } = null!;

    [Column("Email")]
    public string Email { get; set; } = null!;

    [Column("PasswordHash")]
    public string? PasswordHash { get; set; }

    [Column("PhoneNumber")]
    public string? PhoneNumber { get; set; }

    [Column("Role")]
    public string Role { get; set; } = null!;

    [Column("EKycStatus")]
    public string EKycStatus { get; set; } = null!;

    [Column("AvatarUrl")]
    public string? AvatarUrl { get; set; }

    [Column("GoogleId")]
    public string? GoogleId { get; set; }

    [Column("IsPhoneVerified")]
    public bool IsPhoneVerified { get; set; }

    // TK-010: Cờ khóa tài khoản (Ban/Unban). true = bị khóa, không thể đăng nhập / thao tác.
    [Column("IsLocked")]
    public bool IsLocked { get; set; } = false;

    // TK-004: Cờ xác thực định danh. Suy ra từ EKycStatus để tránh 2 nguồn trạng thái lệch nhau.
    // Chuẩn hoá về Constants.EKycStatuses.Verified — khớp seed data + Google login.
    [NotMapped]
    public bool IsVerified => EKycStatus == Constants.EKycStatuses.Verified;

    // Navigation properties
    public EkycProfile? EkycProfile { get; set; }
    public EscrowWallet? EscrowWallet { get; set; }
    public ICollection<OtpCode> OtpCodes { get; set; } = new List<OtpCode>();
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    public ICollection<Match> HostedMatches { get; set; } = new List<Match>();
}
