using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using ProSport.Domain.Constants;
using ProSport.Domain.Entities;

namespace ProSport.Application.Services;

public class VoucherService : IVoucherService
{
    private readonly IVoucherRepository _repository;

    public VoucherService(IVoucherRepository repository)
    {
        _repository = repository;
    }

    private static VoucherDto Map(Voucher v) => new VoucherDto
    {
        VoucherId = v.VoucherId,
        Code = v.Code,
        Name = v.Name,
        DiscountPercent = v.DiscountPercent,
        MaxDiscountAmount = v.MaxDiscountAmount,
        MinOrderAmount = v.MinOrderAmount,
        TotalQuantity = v.TotalQuantity,
        UsedQuantity = v.UsedQuantity,
        StartDate = v.StartDate,
        EndDate = v.EndDate,
        IsActive = VoucherStatus.IsUsable(v.Status),
        CreatedAt = v.CreatedAt
    };

    public async Task<ApiResponseDto<List<VoucherDto>>> GetAllAsync(bool onlyActive = false)
    {
        var items = await _repository.GetAllAsync(onlyActive);
        return new ApiResponseDto<List<VoucherDto>>(200, "Lấy danh sách voucher thành công.", items.Select(Map).ToList());
    }

    public async Task<ApiResponseDto<VoucherDto>> GetByIdAsync(int id)
    {
        var v = await _repository.GetByIdAsync(id);
        if (v is null) return new ApiResponseDto<VoucherDto>(404, "Không tìm thấy voucher.");
        return new ApiResponseDto<VoucherDto>(200, "Thành công.", Map(v));
    }

    public async Task<ApiResponseDto<VoucherDto>> CreateAsync(CreateVoucherDto dto, int? staffId)
    {
        if (dto.EndDate <= dto.StartDate)
            return new ApiResponseDto<VoucherDto>(400, "Ngày kết thúc phải sau ngày bắt đầu.");

        var existing = await _repository.GetByCodeAsync(dto.Code);
        if (existing is not null)
            return new ApiResponseDto<VoucherDto>(409, "Mã voucher đã tồn tại.");

        var voucher = new Voucher
        {
            Code = dto.Code.Trim().ToUpperInvariant(),
            Name = dto.Name,
            DiscountPercent = dto.DiscountPercent,
            MaxDiscountAmount = dto.MaxDiscountAmount,
            MinOrderAmount = dto.MinOrderAmount,
            TotalQuantity = dto.TotalQuantity,
            UsedQuantity = 0,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            Status = VoucherStatus.Active,
            CreatedByStaffId = staffId
        };

        await _repository.AddAsync(voucher);
        return new ApiResponseDto<VoucherDto>(201, "Tạo voucher thành công.", Map(voucher));
    }

    public async Task<ApiResponseDto<VoucherDto>> UpdateAsync(int id, UpdateVoucherDto dto)
    {
        var voucher = await _repository.GetByIdAsync(id);
        if (voucher is null) return new ApiResponseDto<VoucherDto>(404, "Không tìm thấy voucher.");

        if (dto.EndDate <= dto.StartDate)
            return new ApiResponseDto<VoucherDto>(400, "Ngày kết thúc phải sau ngày bắt đầu.");

        if (dto.TotalQuantity < voucher.UsedQuantity)
            return new ApiResponseDto<VoucherDto>(400, "Tổng số lượng không được nhỏ hơn số đã sử dụng.");

        voucher.Name = dto.Name;
        voucher.DiscountPercent = dto.DiscountPercent;
        voucher.MaxDiscountAmount = dto.MaxDiscountAmount;
        voucher.MinOrderAmount = dto.MinOrderAmount;
        voucher.TotalQuantity = dto.TotalQuantity;
        voucher.StartDate = dto.StartDate;
        voucher.EndDate = dto.EndDate;
        voucher.Status = dto.IsActive ? VoucherStatus.Active : VoucherStatus.Inactive;

        await _repository.UpdateAsync(voucher);
        return new ApiResponseDto<VoucherDto>(200, "Cập nhật voucher thành công.", Map(voucher));
    }

    public async Task<ApiResponseDto<bool>> DeleteAsync(int id)
    {
        var voucher = await _repository.GetByIdAsync(id);
        if (voucher is null) return new ApiResponseDto<bool>(404, "Không tìm thấy voucher.", false);

        await _repository.DeleteAsync(voucher);
        return new ApiResponseDto<bool>(200, "Đã xóa voucher.", true);
    }
}
