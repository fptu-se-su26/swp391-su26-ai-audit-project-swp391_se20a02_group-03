using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
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
        if (e.User is not null) e.User.EKycStatus = "Approved";

        await _repository.SaveChangesAsync();
        return new ApiResponseDto<EkycProfileDto>(200, "Đã phê duyệt hồ sơ E-KYC.", Map(e));
    }

    public async Task<ApiResponseDto<EkycProfileDto>> RejectAsync(int id, string reason)
    {
        if (string.IsNullOrWhiteSpace(reason))
            return new ApiResponseDto<EkycProfileDto>(400, "Vui lòng nhập lý do từ chối.");

        var e = await _repository.GetByIdAsync(id);
        if (e is null) return new ApiResponseDto<EkycProfileDto>(404, "Không tìm thấy hồ sơ E-KYC.");

        e.Status = "Rejected";
        e.RejectionReason = reason;
        if (e.User is not null) e.User.EKycStatus = "Rejected";

        await _repository.SaveChangesAsync();
        return new ApiResponseDto<EkycProfileDto>(200, "Đã từ chối hồ sơ E-KYC.", Map(e));
    }
}
