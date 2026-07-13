using Microsoft.EntityFrameworkCore;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using ProSport.Domain.Entities;
using ProSport.Infrastructure.Data;

namespace ProSport.Infrastructure.Services;

public class CancellationPolicyService : ICancellationPolicyService
{
    private readonly ProSportDbContext _db;
    private readonly TimeProvider _clock;

    public CancellationPolicyService(ProSportDbContext db, TimeProvider? clock = null)
    {
        _db = db;
        _clock = clock ?? TimeProvider.System;
    }

    /// <summary>
    /// "Bây giờ" theo giờ VN — slot (BookingDate/StartTime, matchTime) lưu theo giờ VN
    /// nên mọi phép so sánh phải cùng hệ quy chiếu; so với UtcNow trần sẽ lệch 7 tiếng.
    /// </summary>
    private DateTime VnNow()
        => TimeZoneInfo.ConvertTimeFromUtc(_clock.GetUtcNow().UtcDateTime, VnTimeHelper.GetVnTimeZone());

    public async Task<CancellationPolicyDto> GetOrDefaultAsync(int complexId)
    {
        var policy = await _db.ComplexCancellationPolicies.AsNoTracking()
            .FirstOrDefaultAsync(p => p.ComplexId == complexId);

        if (policy == null)
            return new CancellationPolicyDto { ComplexId = complexId };

        return Map(policy);
    }

    public async Task<ApiResponseDto<CancellationPolicyDto>> UpsertAsync(int complexId, CancellationPolicyDto dto)
    {
        var policy = await _db.ComplexCancellationPolicies.FirstOrDefaultAsync(p => p.ComplexId == complexId);
        if (policy == null)
        {
            policy = new ComplexCancellationPolicy { ComplexId = complexId };
            _db.ComplexCancellationPolicies.Add(policy);
        }

        policy.FullRefundHoursBefore = dto.FullRefundHoursBefore;
        policy.PartialRefundHoursBefore = dto.PartialRefundHoursBefore;
        policy.PartialRefundPercent = dto.PartialRefundPercent;
        policy.PenaltyPercentAfterPartial = dto.PenaltyPercentAfterPartial;
        policy.WeatherFullRefundEnabled = dto.WeatherFullRefundEnabled;

        await _db.SaveChangesAsync();
        return new ApiResponseDto<CancellationPolicyDto>(200, "Cập nhật chính sách hủy thành công.", Map(policy));
    }

    public async Task<CancellationRefundPreviewDto> CalculateBookingRefundAsync(Booking booking, bool weatherCancel = false)
    {
        var complexId = await GetComplexIdFromBookingAsync(booking);
        var policy = await GetOrDefaultAsync(complexId);

        if (weatherCancel && policy.WeatherFullRefundEnabled)
            return FullRefund(booking.TotalAmount, "Hoàn 100% do hủy vì thời tiết.");

        var firstSlot = booking.BookingDetails.OrderBy(d => d.BookingDate).ThenBy(d => d.StartTime).FirstOrDefault();
        if (firstSlot == null)
            return NoRefund("Không có chi tiết booking.");

        var slotStart = firstSlot.BookingDate.Date.Add(firstSlot.StartTime);
        var hoursUntil = (slotStart - VnNow()).TotalHours;

        // Slot đã bắt đầu/kết thúc: không hoàn — việc tất toán thuộc luồng complete, không phải hủy.
        if (hoursUntil <= 0)
            return NoRefund("Slot đã bắt đầu — không áp dụng hoàn tiền khi hủy.");

        if (hoursUntil >= policy.FullRefundHoursBefore)
            return FullRefund(booking.TotalAmount, $"Hoàn 100% (hủy trước {policy.FullRefundHoursBefore}h).");

        if (hoursUntil >= policy.PartialRefundHoursBefore)
        {
            var refund = booking.TotalAmount * policy.PartialRefundPercent / 100m;
            var penalty = booking.TotalAmount - refund;
            return new CancellationRefundPreviewDto
            {
                RefundAmount = refund,
                PenaltyAmount = penalty,
                RefundPercent = policy.PartialRefundPercent,
                Message = $"Hoàn {policy.PartialRefundPercent}% (hủy trước {policy.PartialRefundHoursBefore}h)."
            };
        }

        var penaltyPct = policy.PenaltyPercentAfterPartial;
        var refundAmt = booking.TotalAmount * (100m - penaltyPct) / 100m;
        return new CancellationRefundPreviewDto
        {
            RefundAmount = refundAmt,
            PenaltyAmount = booking.TotalAmount - refundAmt,
            RefundPercent = 100m - penaltyPct,
            Message = $"Hoàn {100m - penaltyPct}% (hủy sát giờ, phạt {penaltyPct}%)."
        };
    }

    public async Task<(decimal releasePercent, string message)> CalculateMatchLeaveReleaseAsync(int complexId, DateTime matchTime)
    {
        var policy = await GetOrDefaultAsync(complexId);
        // matchTime là giờ VN — cùng hệ quy chiếu với VnNow() (không dùng UtcNow trần).
        var hoursUntil = (matchTime - VnNow()).TotalHours;

        if (hoursUntil >= policy.FullRefundHoursBefore)
            return (100m, $"Hoàn 100% cọc (rút trước {policy.FullRefundHoursBefore}h).");

        if (hoursUntil >= policy.PartialRefundHoursBefore)
            return (policy.PartialRefundPercent, $"Hoàn {policy.PartialRefundPercent}% cọc.");

        return (0m, $"Mất 100% cọc (rút dưới {policy.PartialRefundHoursBefore}h).");
    }

    private async Task<int> GetComplexIdFromBookingAsync(Booking booking)
    {
        var courtId = booking.BookingDetails.FirstOrDefault()?.CourtId;
        if (courtId == null)
            return booking.BookingDetails.FirstOrDefault()?.Court?.ComplexId ?? 0;

        var court = await _db.Courts.AsNoTracking().FirstOrDefaultAsync(c => c.CourtId == courtId);
        return court?.ComplexId ?? 0;
    }

    private static CancellationRefundPreviewDto FullRefund(decimal total, string msg) => new()
    {
        RefundAmount = total,
        PenaltyAmount = 0,
        RefundPercent = 100m,
        Message = msg
    };

    private static CancellationRefundPreviewDto NoRefund(string msg) => new()
    {
        RefundAmount = 0,
        PenaltyAmount = 0,
        RefundPercent = 0,
        Message = msg
    };

    private static CancellationPolicyDto Map(ComplexCancellationPolicy p) => new()
    {
        ComplexId = p.ComplexId,
        FullRefundHoursBefore = p.FullRefundHoursBefore,
        PartialRefundHoursBefore = p.PartialRefundHoursBefore,
        PartialRefundPercent = p.PartialRefundPercent,
        PenaltyPercentAfterPartial = p.PenaltyPercentAfterPartial,
        WeatherFullRefundEnabled = p.WeatherFullRefundEnabled
    };
}
