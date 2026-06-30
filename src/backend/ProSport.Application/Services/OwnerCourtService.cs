using System.Text.Json;
using ProSport.Application.DTOs;
using ProSport.Application.DTOs.Owner;
using ProSport.Application.Interfaces;
using ProSport.Domain.Constants;
using ProSport.Domain.Entities;

namespace ProSport.Application.Services;

public class OwnerCourtService : IOwnerCourtService
{
    private readonly ICourtRepository _courtRepository;
    private readonly IAuditLogService _auditLogService;
    private readonly IBookingRepository _bookingRepository;
    private readonly IBookingService _bookingService;

    public OwnerCourtService(
        ICourtRepository courtRepository,
        IAuditLogService auditLogService,
        IBookingRepository bookingRepository,
        IBookingService bookingService)
    {
        _courtRepository = courtRepository;
        _auditLogService = auditLogService;
        _bookingRepository = bookingRepository;
        _bookingService = bookingService;
    }

    public async Task<ApiResponseDto<CourtDto>> CreateCourtAsync(int actorUserId, OwnerCourtCreateDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            return new ApiResponseDto<CourtDto>(400, "Tên sân là bắt buộc.");

        var code = NormalizeCode(dto.Code, dto.Name);
        if (await _courtRepository.ExistsCodeInComplexAsync(dto.ComplexId, code, null))
            return new ApiResponseDto<CourtDto>(409, $"Mã sân '{code}' đã tồn tại trong tổ hợp.");

        var court = new Court
        {
            Name = dto.Name.Trim(),
            Code = code,
            CourtTypeId = dto.CourtTypeId,
            Description = dto.Description,
            ImageUrl = dto.ImageUrl,
            ComplexId = dto.ComplexId,
            Status = CourtStatuses.Active,
            CreatedAt = DateTime.UtcNow,
            IsDeleted = false
        };

        var created = await _courtRepository.CreateAsync(court);

        if (dto.BasePrice > 0)
        {
            await _courtRepository.AddPricingRuleAsync(new PricingRule
            {
                ComplexId = dto.ComplexId,
                CourtId = created.CourtId,
                CourtTypeId = dto.CourtTypeId,
                StartTime = new TimeSpan(6, 0, 0),
                EndTime = new TimeSpan(22, 0, 0),
                PricePerHour = dto.BasePrice,
                Multiplier = 1m,
                RuleType = "BasePrice",
                Status = "Active",
                IsWeekend = false,
                CreatedAt = DateTime.UtcNow,
                IsDeleted = false
            });
        }

        await _auditLogService.LogAsync(actorUserId, "CREATE", "Court", created.CourtId.ToString(), dto.ComplexId,
            null, JsonSerializer.Serialize(new { created.Name, created.Code, created.Status }));

        var full = await _courtRepository.GetByIdAsync(created.CourtId);
        return new ApiResponseDto<CourtDto>(201, "Tạo sân thành công", MapToDto(full!));
    }

    public async Task<ApiResponseDto<CourtDto>> UpdateCourtAsync(int actorUserId, int courtId, OwnerCourtUpdateDto dto)
    {
        var court = await _courtRepository.GetByIdAsync(courtId);
        if (court == null)
            return new ApiResponseDto<CourtDto>(404, "Không tìm thấy sân.");

        var old = JsonSerializer.Serialize(new { court.Name, court.Code, court.Status });

        if (!string.IsNullOrWhiteSpace(dto.Name)) court.Name = dto.Name.Trim();
        if (dto.CourtTypeId.HasValue) court.CourtTypeId = dto.CourtTypeId.Value;
        if (dto.Description != null) court.Description = dto.Description;
        if (dto.ImageUrl != null) court.ImageUrl = dto.ImageUrl;

        if (dto.Code != null)
        {
            var code = NormalizeCode(dto.Code, court.Name);
            if (await _courtRepository.ExistsCodeInComplexAsync(court.ComplexId!.Value, code, courtId))
                return new ApiResponseDto<CourtDto>(409, $"Mã sân '{code}' đã tồn tại trong tổ hợp.");
            court.Code = code;
        }

        court.UpdatedAt = DateTime.UtcNow;
        await _courtRepository.UpdateAsync(court);

        await _auditLogService.LogAsync(actorUserId, "UPDATE", "Court", courtId.ToString(), court.ComplexId,
            old, JsonSerializer.Serialize(new { court.Name, court.Code, court.Status }));

        return new ApiResponseDto<CourtDto>(200, "Cập nhật sân thành công", MapToDto(court));
    }

    public async Task<ApiResponseDto<CourtDto>> UpdateCourtStatusAsync(int actorUserId, int courtId, string apiStatus)
    {
        var court = await _courtRepository.GetByIdAsync(courtId);
        if (court == null)
            return new ApiResponseDto<CourtDto>(404, "Không tìm thấy sân.");

        var normalized = CourtStatuses.NormalizeApiStatus(apiStatus);
        if (normalized is not (CourtStatuses.Active or CourtStatuses.Maintenance or CourtStatuses.Inactive))
            return new ApiResponseDto<CourtDto>(400, "Trạng thái không hợp lệ. Dùng ACTIVE, MAINTENANCE hoặc INACTIVE.");

        var oldStatus = court.Status;
        court.Status = normalized;
        court.UpdatedAt = DateTime.UtcNow;
        await _courtRepository.UpdateAsync(court);

        await _auditLogService.LogAsync(actorUserId, "STATUS_CHANGE", "Court", courtId.ToString(), court.ComplexId,
            oldStatus, normalized);

        if (normalized is CourtStatuses.Maintenance or CourtStatuses.Inactive)
        {
            var bookingIds = await _bookingRepository.GetActiveFutureBookingIdsByCourtAsync(courtId);
            var reason = normalized == CourtStatuses.Maintenance
                ? $"Sân {court.Name} chuyển sang bảo trì. Booking của bạn đã được hủy và hoàn tiền."
                : $"Sân {court.Name} ngừng hoạt động. Booking của bạn đã được hủy và hoàn tiền.";

            foreach (var bookingId in bookingIds)
                await _bookingService.CancelAndRefundSystemAsync(bookingId, reason);
        }

        return new ApiResponseDto<CourtDto>(200, "Cập nhật trạng thái sân thành công", MapToDto(court));
    }

    private static string NormalizeCode(string? code, string name)
    {
        if (!string.IsNullOrWhiteSpace(code))
            return code.Trim().ToUpperInvariant();
        var slug = new string(name.Where(char.IsLetterOrDigit).Take(8).ToArray()).ToUpperInvariant();
        return string.IsNullOrEmpty(slug) ? $"C{DateTime.UtcNow.Ticks % 100000}" : slug;
    }

    private static CourtDto MapToDto(Court court) => new()
    {
        CourtId = court.CourtId,
        Name = court.Name,
        Code = court.Code,
        ComplexId = court.ComplexId,
        CourtTypeName = court.CourtType?.Name ?? "",
        Status = CourtStatuses.ToApiStatus(court.Status),
        ImageUrl = court.ImageUrl,
        Description = court.Description,
        PricePerHour = court.PricingRules?.FirstOrDefault()?.PricePerHour ?? 0
    };
}
