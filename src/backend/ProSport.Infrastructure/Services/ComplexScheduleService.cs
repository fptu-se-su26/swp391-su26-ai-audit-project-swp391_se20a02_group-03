using Microsoft.EntityFrameworkCore;
using ProSport.Application.DTOs;
using ProSport.Application.DTOs.Owner;
using ProSport.Application.Interfaces;
using ProSport.Application.Services;
using ProSport.Domain.Constants;
using ProSport.Domain.Entities;
using ProSport.Infrastructure.Data;

namespace ProSport.Infrastructure.Services;

public class ComplexScheduleService : IComplexScheduleService
{
    private readonly ProSportDbContext _db;
    private readonly IAuditLogService _auditLogService;
    private readonly IBookingService _bookingService;

    public ComplexScheduleService(
        ProSportDbContext db,
        IAuditLogService auditLogService,
        IBookingService bookingService)
    {
        _db = db;
        _auditLogService = auditLogService;
        _bookingService = bookingService;
    }

    public async Task<ApiResponseDto<ComplexOperatingHoursDto>> GetOperatingHoursAsync(int complexId)
    {
        var complex = await _db.Complexes.FirstOrDefaultAsync(c => c.ComplexId == complexId && !c.IsDeleted);
        if (complex == null)
            return new ApiResponseDto<ComplexOperatingHoursDto>(404, "Không tìm thấy tổ hợp.");

        var schedules = await _db.ComplexOperatingSchedules
            .Where(s => s.ComplexId == complexId && !s.IsDeleted)
            .OrderBy(s => s.DayOfWeek)
            .ToListAsync();

        if (!schedules.Any())
        {
            schedules = Enumerable.Range(0, 7).Select(d => new ComplexOperatingSchedule
            {
                DayOfWeek = d,
                OpenTime = ParseTime(complex.OpeningTime, new TimeSpan(6, 0, 0)),
                CloseTime = ParseTime(complex.ClosingTime, new TimeSpan(22, 0, 0))
            }).ToList();
        }

        var dto = new ComplexOperatingHoursDto
        {
            ComplexId = complexId,
            SlotDurationMinutes = complex.SlotDurationMinutes > 0 ? complex.SlotDurationMinutes : 60,
            WeeklySchedule = schedules.Select(s => new DayScheduleDto
            {
                DayOfWeek = s.DayOfWeek,
                OpenTime = s.OpenTime.ToString(@"hh\:mm"),
                CloseTime = s.CloseTime.ToString(@"hh\:mm")
            }).ToList(),
            Closures = await _db.ComplexClosures
                .Where(c => c.ComplexId == complexId && !c.IsDeleted)
                .Select(c => new ComplexClosureDto { ComplexClosureId = c.ComplexClosureId, ClosureDate = c.ClosureDate, Reason = c.Reason })
                .ToListAsync(),
            MaintenanceWindows = await _db.ComplexMaintenanceWindows
                .Where(m => m.ComplexId == complexId && !m.IsDeleted)
                .Select(m => new MaintenanceWindowDto
                {
                    ComplexMaintenanceWindowId = m.ComplexMaintenanceWindowId,
                    CourtId = m.CourtId,
                    StartAt = m.StartAt,
                    EndAt = m.EndAt,
                    Reason = m.Reason
                }).ToListAsync()
        };

        return new ApiResponseDto<ComplexOperatingHoursDto>(200, "Success", dto);
    }

    public async Task<ApiResponseDto<ComplexOperatingHoursDto>> SaveOperatingHoursAsync(int actorUserId, int complexId, SaveComplexOperatingHoursDto dto)
    {
        var complex = await _db.Complexes.FirstOrDefaultAsync(c => c.ComplexId == complexId && !c.IsDeleted);
        if (complex == null)
            return new ApiResponseDto<ComplexOperatingHoursDto>(404, "Không tìm thấy tổ hợp.");

        foreach (var day in dto.WeeklySchedule)
        {
            if (!TimeSpan.TryParse(day.OpenTime, out var open) || !TimeSpan.TryParse(day.CloseTime, out var close))
                return new ApiResponseDto<ComplexOperatingHoursDto>(400, "Định dạng giờ không hợp lệ.");
            if (open >= close)
                return new ApiResponseDto<ComplexOperatingHoursDto>(400, $"Ngày {day.DayOfWeek}: giờ mở phải trước giờ đóng.");
        }

        foreach (var m in dto.MaintenanceWindows)
        {
            if (m.EndAt <= m.StartAt)
                return new ApiResponseDto<ComplexOperatingHoursDto>(400, "Khoảng bảo trì không hợp lệ.");
        }

        complex.SlotDurationMinutes = dto.SlotDurationMinutes > 0 ? dto.SlotDurationMinutes : 60;
        complex.UpdatedAt = DateTime.UtcNow;

        var existingSchedules = await _db.ComplexOperatingSchedules.Where(s => s.ComplexId == complexId).ToListAsync();
        _db.ComplexOperatingSchedules.RemoveRange(existingSchedules);

        foreach (var day in dto.WeeklySchedule)
        {
            _db.ComplexOperatingSchedules.Add(new ComplexOperatingSchedule
            {
                ComplexId = complexId,
                DayOfWeek = day.DayOfWeek,
                OpenTime = TimeSpan.Parse(day.OpenTime),
                CloseTime = TimeSpan.Parse(day.CloseTime),
                CreatedAt = DateTime.UtcNow,
                IsDeleted = false
            });
        }

        var existingClosures = await _db.ComplexClosures.Where(c => c.ComplexId == complexId).ToListAsync();
        _db.ComplexClosures.RemoveRange(existingClosures);
        foreach (var c in dto.Closures)
        {
            _db.ComplexClosures.Add(new ComplexClosure
            {
                ComplexId = complexId,
                ClosureDate = c.ClosureDate.Date,
                Reason = c.Reason,
                CreatedAt = DateTime.UtcNow,
                IsDeleted = false
            });
        }

        var existingMaint = await _db.ComplexMaintenanceWindows.Where(m => m.ComplexId == complexId).ToListAsync();
        _db.ComplexMaintenanceWindows.RemoveRange(existingMaint);
        foreach (var m in dto.MaintenanceWindows)
        {
            _db.ComplexMaintenanceWindows.Add(new ComplexMaintenanceWindow
            {
                ComplexId = complexId,
                CourtId = m.CourtId,
                StartAt = m.StartAt,
                EndAt = m.EndAt,
                Reason = m.Reason,
                CreatedAt = DateTime.UtcNow,
                IsDeleted = false
            });
        }

        await _db.SaveChangesAsync();
        await _auditLogService.LogAsync(actorUserId, "UPDATE", "ComplexOperatingHours", complexId.ToString(), complexId);

        await CancelConflictingBookingsAsync(complexId, dto);

        return await GetOperatingHoursAsync(complexId);
    }

    private async Task CancelConflictingBookingsAsync(int complexId, SaveComplexOperatingHoursDto dto)
    {
        var courtIds = await _db.Courts
            .Where(c => c.ComplexId == complexId && !c.IsDeleted)
            .Select(c => c.CourtId)
            .ToListAsync();

        if (courtIds.Count == 0)
            return;

        var conflictingBookingIds = new HashSet<int>();

        foreach (var closure in dto.Closures)
        {
            var ids = await _db.BookingDetails
                .Where(d => courtIds.Contains(d.CourtId)
                    && d.BookingDate.Date == closure.ClosureDate.Date
                    && !d.Booking.IsDeleted
                    && !OwnerDashboardMetrics.ExcludedBookingStatuses.Contains(d.Booking.Status))
                .Select(d => d.BookingId)
                .Distinct()
                .ToListAsync();

            foreach (var id in ids)
                conflictingBookingIds.Add(id);
        }

        foreach (var window in dto.MaintenanceWindows)
        {
            var targetCourtIds = window.CourtId.HasValue
                ? new List<int> { window.CourtId.Value }
                : courtIds;

            var details = await _db.BookingDetails
                .Include(d => d.Booking)
                .Where(d => targetCourtIds.Contains(d.CourtId)
                    && !d.Booking.IsDeleted
                    && !OwnerDashboardMetrics.ExcludedBookingStatuses.Contains(d.Booking.Status))
                .ToListAsync();

            foreach (var detail in details)
            {
                var slotStart = detail.BookingDate.Date.Add(detail.StartTime);
                var slotEnd = detail.BookingDate.Date.Add(detail.EndTime);
                if (slotStart < window.EndAt && slotEnd > window.StartAt)
                    conflictingBookingIds.Add(detail.BookingId);
            }
        }

        foreach (var bookingId in conflictingBookingIds)
        {
            await _bookingService.CancelAndRefundSystemAsync(
                bookingId,
                "Chủ sân cập nhật lịch đóng cửa/bảo trì. Booking của bạn đã được hủy và hoàn tiền.");
        }
    }

    public async Task<bool> IsSlotWithinOperatingHoursAsync(int complexId, int? courtId, DateTime bookingDate, TimeSpan startTime, TimeSpan endTime)
    {
        if (await _db.ComplexClosures.AnyAsync(c => c.ComplexId == complexId && !c.IsDeleted && c.ClosureDate == bookingDate.Date))
            return false;

        var dayOfWeek = (int)bookingDate.DayOfWeek;
        var schedule = await _db.ComplexOperatingSchedules
            .FirstOrDefaultAsync(s => s.ComplexId == complexId && s.DayOfWeek == dayOfWeek && !s.IsDeleted);

        if (schedule != null)
        {
            if (startTime < schedule.OpenTime || endTime > schedule.CloseTime)
                return false;
        }

        var slotStart = bookingDate.Date.Add(startTime);
        var slotEnd = bookingDate.Date.Add(endTime);

        var inMaintenance = await _db.ComplexMaintenanceWindows.AnyAsync(m =>
            m.ComplexId == complexId && !m.IsDeleted
            && (m.CourtId == null || m.CourtId == courtId)
            && m.StartAt < slotEnd && m.EndAt > slotStart);

        return !inMaintenance;
    }

    private static TimeSpan ParseTime(string? value, TimeSpan fallback) =>
        TimeSpan.TryParse(value, out var t) ? t : fallback;
}
