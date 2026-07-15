using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using ProSport.Domain.Constants;
using ProSport.Domain.Entities;

namespace ProSport.Application.Services;

// Phê duyệt E-KYC: đồng bộ trạng thái EkycProfile.Status và User.EKycStatus.
public class EkycService : IEkycService
{
    private readonly IEkycRepository _repository;

    public EkycService(IEkycRepository repository)
    {
        _repository = repository;
    }

    private static EkycProfileDto Map(EkycProfile e) => new EkycProfileDto
    {
        EkycProfileId = e.EkycProfileId,
        UserId = e.UserId,
        UserEmail = e.User?.Email,
        ProfileFullName = e.User?.FullName,
        FullName = e.FullName,
        IdentityNumber = e.IdentityNumber,
        FrontImageUrl = e.FrontImageUrl,
        BackImageUrl = e.BackImageUrl,
        FaceImageUrl = e.FaceImageUrl,
        Status = e.Status,
        RejectionReason = e.RejectionReason,
        CreatedAt = e.CreatedAt
    };

    public async Task<ApiResponseDto<List<EkycProfileDto>>> GetAllAsync(string? status = null)
    {
        var items = await _repository.GetAllAsync(status);
        return new ApiResponseDto<List<EkycProfileDto>>(200, "Lấy danh sách hồ sơ E-KYC thành công.", items.Select(Map).ToList());
    }

    public async Task<ApiResponseDto<EkycProfileDto>> GetByIdAsync(int id)
    {
        var e = await _repository.GetByIdAsync(id);
        if (e is null) return new ApiResponseDto<EkycProfileDto>(404, "Không tìm thấy hồ sơ E-KYC.");
        return new ApiResponseDto<EkycProfileDto>(200, "Thành công.", Map(e));
    }

    public async Task<ApiResponseDto<EkycProfileDto>> ApproveAsync(int id)
    {
        var e = await _repository.GetByIdAsync(id);
        if (e is null) return new ApiResponseDto<EkycProfileDto>(404, "Không tìm thấy hồ sơ E-KYC.");

        e.Status = "Approved";
        e.RejectionReason = null;
        // Hồ sơ (EkycProfile.Status) giữ "Approved" cho UI Admin KYC; trạng thái xác thực
        // của User chuẩn hoá về "Verified" để khớp seed/Google và cờ User.IsVerified.
        if (e.User is not null) e.User.EKycStatus = EKycStatuses.Verified;

        await _repository.SaveChangesAsync();
        return new ApiResponseDto<EkycProfileDto>(200, "Đã phê duyệt hồ sơ E-KYC.", Map(e));
    }

    // TK-004: Customer nộp hồ sơ E-KYC. Hồ sơ vào trạng thái Pending chờ Admin duyệt
    // (AdminKycPage); khi Admin Approve thì User.EKycStatus = "Verified" → User.IsVerified = true.
    // Nộp lại được phép khi hồ sơ trước đó bị Rejected (ghi đè hồ sơ cũ).
    public async Task<ApiResponseDto<EkycProfileDto>> SubmitAsync(int userId, SubmitEkycDto dto)
    {
        var user = await _repository.GetUserByIdAsync(userId);
        if (user is null)
            return new ApiResponseDto<EkycProfileDto>(404, "Không tìm thấy tài khoản.");

        var existing = await _repository.GetByUserIdAsync(userId);
        if (existing is not null && existing.Status == "Pending")
            return new ApiResponseDto<EkycProfileDto>(400, "Hồ sơ E-KYC của bạn đang chờ duyệt. Vui lòng đợi kết quả.");
        if (existing is not null && existing.Status == "Approved")
            return new ApiResponseDto<EkycProfileDto>(400, "Tài khoản đã được xác thực E-KYC.");

        if (existing is null)
        {
            existing = new EkycProfile { UserId = userId };
            await _repository.AddAsync(existing);
        }

        existing.FullName = dto.FullName.Trim();
        existing.IdentityNumber = dto.IdentityNumber.Trim();
        existing.FrontImageUrl = dto.FrontImageUrl;
        existing.BackImageUrl = dto.BackImageUrl;
        existing.FaceImageUrl = dto.FaceImageUrl ?? string.Empty;
        existing.Status = "Pending";
        existing.RejectionReason = null;

        user.EKycStatus = EKycStatuses.Pending;

        await _repository.SaveChangesAsync();
        return new ApiResponseDto<EkycProfileDto>(201, "Đã gửi hồ sơ E-KYC. Vui lòng chờ quản trị viên phê duyệt.", Map(existing));
    }

    // TK-004: Customer xem trạng thái hồ sơ E-KYC của chính mình.
    public async Task<ApiResponseDto<EkycProfileDto>> GetMineAsync(int userId)
    {
        var e = await _repository.GetByUserIdAsync(userId);
        if (e is null) return new ApiResponseDto<EkycProfileDto>(404, "Bạn chưa nộp hồ sơ E-KYC.");
        return new ApiResponseDto<EkycProfileDto>(200, "Thành công.", Map(e));
    }

    public async Task<ApiResponseDto<EkycProfileDto>> RejectAsync(int id, string reason)
    {
        if (string.IsNullOrWhiteSpace(reason))
            return new ApiResponseDto<EkycProfileDto>(400, "Vui lòng nhập lý do từ chối.");

        var e = await _repository.GetByIdAsync(id);
        if (e is null) return new ApiResponseDto<EkycProfileDto>(404, "Không tìm thấy hồ sơ E-KYC.");

        e.Status = "Rejected";
        e.RejectionReason = reason;
        if (e.User is not null) e.User.EKycStatus = EKycStatuses.Rejected;

        await _repository.SaveChangesAsync();
        return new ApiResponseDto<EkycProfileDto>(200, "Đã từ chối hồ sơ E-KYC.", Map(e));
    }
}
