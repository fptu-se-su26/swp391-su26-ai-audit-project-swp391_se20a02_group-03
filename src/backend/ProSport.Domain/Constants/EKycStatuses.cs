namespace ProSport.Domain.Constants;

/// <summary>
/// Trạng thái xác thực định danh của User (cột User.EKycStatus).
/// Dùng thống nhất thay vì hard-code string rải rác — trước đây bị lệch
/// giữa "Verified" (seed/Google) và "Approved" (luồng Admin duyệt).
/// Lưu ý: EkycProfile.Status (trạng thái HỒ SƠ) là field khác, dùng
/// bộ giá trị riêng (Pending/Approved/Rejected) mà UI Admin KYC phụ thuộc.
/// </summary>
public static class EKycStatuses
{
    public const string Unverified = "Unverified";
    public const string Pending = "Pending";
    public const string Verified = "Verified";
    public const string Rejected = "Rejected";
}
