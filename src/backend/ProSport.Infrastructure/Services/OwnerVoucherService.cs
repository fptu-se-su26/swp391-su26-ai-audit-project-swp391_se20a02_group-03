using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using ProSport.Application.DTOs;
using ProSport.Application.DTOs.Owner;
using ProSport.Application.Interfaces;
using ProSport.Domain.Entities;
using ProSport.Infrastructure.Data;

namespace ProSport.Infrastructure.Services;

public class OwnerVoucherService : IOwnerVoucherService
{
    private readonly ProSportDbContext _db;
    private readonly IAuditLogService _auditLog;

    public OwnerVoucherService(ProSportDbContext db, IAuditLogService auditLog)
    {
        _db = db;
        _auditLog = auditLog;
    }

    public async Task<ApiResponseDto<List<OwnerVoucherDto>>> GetVouchersAsync(int complexId)
    {
        var raw = await _db.Vouchers.AsNoTracking()
            .Where(v => !v.IsDeleted && (v.ApplicableComplexId == null || v.ApplicableComplexId == complexId))
            .OrderByDescending(v => v.CreatedAt)
            .ToListAsync();
        return new ApiResponseDto<List<OwnerVoucherDto>>(200, "Success", raw.Select(Map).ToList());
    }

    public async Task<ApiResponseDto<OwnerVoucherDto>> CreateVoucherAsync(int actorUserId, int complexId, CreateOwnerVoucherDto dto)
    {
        if (dto.EndDate <= dto.StartDate)
            return new ApiResponseDto<OwnerVoucherDto>(400, "Ngày kết thúc phải sau ngày bắt đầu.");

        var code = dto.Code.Trim().ToUpperInvariant();
        if (await _db.Vouchers.AnyAsync(v => v.Code == code && !v.IsDeleted))
            return new ApiResponseDto<OwnerVoucherDto>(409, "Mã voucher đã tồn tại.");

        if (dto.ApplicableProductId.HasValue)
        {
            var productOk = await _db.ProductStocks.AnyAsync(p => p.ProductStockId == dto.ApplicableProductId && p.ComplexId == complexId && !p.IsDeleted);
            if (!productOk) return new ApiResponseDto<OwnerVoucherDto>(400, "Sản phẩm không thuộc tổ hợp.");
        }

        var voucher = new Voucher
        {
            Code = code,
            Name = dto.Name,
            VoucherType = dto.VoucherType,
            DiscountPercent = dto.DiscountPercent,
            MaxDiscountAmount = dto.MaxDiscountAmount,
            MinOrderAmount = dto.MinOrderAmount,
            TotalQuantity = dto.TotalQuantity,
            UsedQuantity = 0,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            ApplicableComplexId = complexId,
            ApplicableProductId = dto.ApplicableProductId,
            Status = "Active",
            IsActive = true,
            CreatedByStaffId = actorUserId,
            CreatedAt = DateTime.UtcNow,
            IsDeleted = false
        };
        _db.Vouchers.Add(voucher);
        await _db.SaveChangesAsync();
        await _auditLog.LogAsync(actorUserId, "CREATE", "Voucher", voucher.VoucherId.ToString(), complexId, null, code);
        return new ApiResponseDto<OwnerVoucherDto>(201, "Tạo voucher thành công.", Map(voucher));
    }

    public async Task<ApiResponseDto<OwnerVoucherDto>> UpdateVoucherAsync(int actorUserId, int id, int complexId, UpdateOwnerVoucherDto dto)
    {
        var voucher = await _db.Vouchers.FirstOrDefaultAsync(v => v.VoucherId == id && v.ApplicableComplexId == complexId && !v.IsDeleted);
        if (voucher == null) return new ApiResponseDto<OwnerVoucherDto>(404, "Không tìm thấy voucher.");

        if (dto.Name != null) voucher.Name = dto.Name;
        if (dto.DiscountPercent.HasValue) voucher.DiscountPercent = dto.DiscountPercent.Value;
        if (dto.MaxDiscountAmount.HasValue) voucher.MaxDiscountAmount = dto.MaxDiscountAmount;
        if (dto.MinOrderAmount.HasValue) voucher.MinOrderAmount = dto.MinOrderAmount;
        if (dto.TotalQuantity.HasValue) voucher.TotalQuantity = dto.TotalQuantity.Value;
        if (dto.StartDate.HasValue) voucher.StartDate = dto.StartDate.Value;
        if (dto.EndDate.HasValue) voucher.EndDate = dto.EndDate.Value;
        if (dto.ApplicableProductId.HasValue) voucher.ApplicableProductId = dto.ApplicableProductId;
        voucher.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        await _auditLog.LogAsync(actorUserId, "UPDATE", "Voucher", id.ToString(), complexId, null, voucher.Code);
        return new ApiResponseDto<OwnerVoucherDto>(200, "Cập nhật voucher thành công.", Map(voucher));
    }

    public async Task<ApiResponseDto<OwnerVoucherDto>> UpdateVoucherStatusAsync(int actorUserId, int id, int complexId, UpdateVoucherStatusDto dto)
    {
        var voucher = await _db.Vouchers.FirstOrDefaultAsync(v => v.VoucherId == id && v.ApplicableComplexId == complexId && !v.IsDeleted);
        if (voucher == null) return new ApiResponseDto<OwnerVoucherDto>(404, "Không tìm thấy voucher.");

        var old = voucher.Status;
        voucher.Status = dto.Status;
        voucher.IsActive = dto.Status.Equals("Active", StringComparison.OrdinalIgnoreCase);
        voucher.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        await _auditLog.LogAsync(actorUserId, "STATUS_CHANGE", "Voucher", id.ToString(), complexId, old, dto.Status);
        return new ApiResponseDto<OwnerVoucherDto>(200, "Cập nhật trạng thái voucher thành công.", Map(voucher));
    }

    private static OwnerVoucherDto Map(Voucher v) => new()
    {
        VoucherId = v.VoucherId,
        Code = v.Code,
        Name = v.Name,
        VoucherType = v.VoucherType,
        DiscountPercent = v.DiscountPercent,
        MaxDiscountAmount = v.MaxDiscountAmount,
        MinOrderAmount = v.MinOrderAmount,
        TotalQuantity = v.TotalQuantity,
        UsedQuantity = v.UsedQuantity,
        StartDate = v.StartDate,
        EndDate = v.EndDate,
        ApplicableComplexId = v.ApplicableComplexId,
        ApplicableProductId = v.ApplicableProductId,
        Status = v.Status,
        IsActive = v.IsActive
    };
}
