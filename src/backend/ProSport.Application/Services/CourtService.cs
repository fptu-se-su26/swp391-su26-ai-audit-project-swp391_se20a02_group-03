using Microsoft.Extensions.Logging;
using ProSport.Application.DTOs;
using ProSport.Application.DTOs.Owner;
using ProSport.Application.Interfaces;
using ProSport.Domain.Constants;
using ProSport.Domain.Entities;

namespace ProSport.Application.Services;

public class CourtService : ICourtService
{
    private readonly ICourtRepository _courtRepository;
    private readonly IComplexScheduleService _complexScheduleService;
    private readonly ILogger<CourtService> _logger;

    public CourtService(
        ICourtRepository courtRepository,
        IComplexScheduleService complexScheduleService,
        ILogger<CourtService> logger)
    {
        _courtRepository = courtRepository;
        _complexScheduleService = complexScheduleService;
        _logger = logger;
    }

    public async Task<ApiResponseDto<PagedResult<CourtDto>>> GetAllCourtsAsync(CourtQueryParameters parameters)
    {
        try
        {
            var (courts, totalCount) = await _courtRepository.GetPagedCourtsAsync(parameters);
            var dtos = courts.Select(MapToDto).ToList();

            var result = new PagedResult<CourtDto>
            {
                Items = dtos,
                TotalCount = totalCount,
                CurrentPage = parameters.PageNumber,
                TotalPages = (int)Math.Ceiling(totalCount / (double)parameters.PageSize)
            };

            return new ApiResponseDto<PagedResult<CourtDto>>(200, "Success", result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all courts");
            return new ApiResponseDto<PagedResult<CourtDto>>(500, "An unexpected error occurred.");
        }
    }

    public async Task<ApiResponseDto<CourtDto>> GetCourtByIdAsync(int courtId)
    {
        try
        {
            var court = await _courtRepository.GetByIdAsync(courtId);
            if (court == null)
                return new ApiResponseDto<CourtDto>(404, "Court not found");

            return new ApiResponseDto<CourtDto>(200, "Success", MapToDto(court));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting court by id: {CourtId}", courtId);
            return new ApiResponseDto<CourtDto>(500, "An unexpected error occurred.");
        }
    }

    public async Task<ApiResponseDto<IEnumerable<CourtDto>>> GetAvailableCourtsAsync(DateTime date, TimeSpan startTime, TimeSpan endTime)
    {
        try
        {
            var courts = await _courtRepository.GetAvailableCourtsAsync(date, startTime, endTime);
            var dtos = courts.Select(MapToDto);
            return new ApiResponseDto<IEnumerable<CourtDto>>(200, "Success", dtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting available courts for date: {Date}", date);
            return new ApiResponseDto<IEnumerable<CourtDto>>(500, "An unexpected error occurred.");
        }
    }

    public async Task<ApiResponseDto<CourtDto>> CreateCourtAsync(CreateCourtDto dto)
    {
        try
        {
            var court = new Court
            {
                Name = dto.Name,
                CourtTypeId = dto.CourtTypeId,
                ImageUrl = dto.ImageUrl,
                Description = dto.Description,
                Status = "Available"
            };

            var created = await _courtRepository.CreateAsync(court);

            // Re-fetch to include CourtType navigation
            var fullCourt = await _courtRepository.GetByIdAsync(created.CourtId);
            return new ApiResponseDto<CourtDto>(201, "Court created successfully", MapToDto(fullCourt!));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating court: {CourtName}", dto.Name);
            return new ApiResponseDto<CourtDto>(500, "An unexpected error occurred.");
        }
    }

    private static CourtDto MapToDto(Court court)
    {
        return new CourtDto
        {
            CourtId = court.CourtId,
            Name = court.Name,
            Code = court.Code,
            ComplexId = court.ComplexId,
            CourtTypeName = court.CourtType?.Name ?? "",
            Status = CourtStatuses.ToApiStatus(court.Status),
            ImageUrl = court.ImageUrl,
            Description = court.Description,
            PricePerHour = court.PricingRules?.FirstOrDefault()?.PricePerHour ?? 100000
        };
    }

    public async Task<ApiResponseDto<IEnumerable<string>>> GetBookedSlotsAsync(int courtId, DateTime date)
    {
        try
        {
            var bookedSlots = await _courtRepository.GetBookedSlotsAsync(courtId, date);
            return new ApiResponseDto<IEnumerable<string>>(200, "Success", bookedSlots);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting booked slots for court: {CourtId} on {Date}", courtId, date);
            return new ApiResponseDto<IEnumerable<string>>(500, "An unexpected error occurred.");
        }
    }

    public async Task<ApiResponseDto<CourtAvailabilityDto>> GetCourtAvailabilityAsync(int courtId, DateTime date)
    {
        try
        {
            var court = await _courtRepository.GetByIdAsync(courtId);
            if (court == null)
                return new ApiResponseDto<CourtAvailabilityDto>(404, "Court not found");

            var booked = (await _courtRepository.GetBookedSlotsAsync(courtId, date)).ToList();
            var slotDurationMinutes = 60;
            var slots = new List<string>();
            var isClosed = false;

            if (court.ComplexId.HasValue)
            {
                var hoursResponse = await _complexScheduleService.GetOperatingHoursAsync(court.ComplexId.Value);
                if (hoursResponse.StatusCode == 200 && hoursResponse.Data != null)
                {
                    var schedule = hoursResponse.Data;
                    slotDurationMinutes = schedule.SlotDurationMinutes > 0 ? schedule.SlotDurationMinutes : 60;

                    if (schedule.Closures.Any(c => c.ClosureDate.Date == date.Date))
                    {
                        isClosed = true;
                    }
                    else
                    {
                        var daySchedule = schedule.WeeklySchedule
                            .FirstOrDefault(d => d.DayOfWeek == (int)date.DayOfWeek)
                            ?? schedule.WeeklySchedule.FirstOrDefault();

                        if (daySchedule != null
                            && TimeSpan.TryParse(daySchedule.OpenTime, out var open)
                            && TimeSpan.TryParse(daySchedule.CloseTime, out var close))
                        {
                            slots = GenerateHourlySlots(open, close, slotDurationMinutes);
                        }
                    }

                    foreach (var window in schedule.MaintenanceWindows)
                    {
                        if (window.CourtId.HasValue && window.CourtId.Value != courtId)
                            continue;
                        if (window.StartAt.Date > date.Date || window.EndAt.Date < date.Date)
                            continue;

                        var blockStart = window.StartAt.Date == date.Date
                            ? window.StartAt.TimeOfDay
                            : TimeSpan.Zero;
                        var blockEnd = window.EndAt.Date == date.Date
                            ? window.EndAt.TimeOfDay
                            : TimeSpan.FromHours(24);

                        slots = slots.Where(slot =>
                        {
                            if (!TimeSpan.TryParse(slot, out var slotStart))
                                return true;
                            var slotEnd = slotStart.Add(TimeSpan.FromMinutes(slotDurationMinutes));
                            return slotEnd <= blockStart || slotStart >= blockEnd;
                        }).ToList();
                    }
                }
            }

            if (slots.Count == 0 && !isClosed)
                slots = GenerateHourlySlots(new TimeSpan(6, 0, 0), new TimeSpan(22, 0, 0), slotDurationMinutes);

            return new ApiResponseDto<CourtAvailabilityDto>(200, "Success", new CourtAvailabilityDto
            {
                CourtId = courtId,
                Date = date.ToString("yyyy-MM-dd"),
                SlotDurationMinutes = slotDurationMinutes,
                IsClosed = isClosed,
                Slots = slots,
                BookedSlots = booked
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting court availability for court {CourtId} on {Date}", courtId, date);
            return new ApiResponseDto<CourtAvailabilityDto>(500, "An unexpected error occurred.");
        }
    }

    private static List<string> GenerateHourlySlots(TimeSpan open, TimeSpan close, int slotDurationMinutes)
    {
        var slots = new List<string>();
        if (slotDurationMinutes <= 0 || open >= close)
            return slots;

        var step = TimeSpan.FromMinutes(slotDurationMinutes);
        for (var time = open; time + step <= close; time += step)
            slots.Add($"{time.Hours:D2}:{time.Minutes:D2}");

        return slots;
    }
    // UPDATE - modify existing court (admin only)
    public async Task<ApiResponseDto<CourtDto>> UpdateCourtAsync(int id, UpdateCourtDto dto)
    {
        try
        {
            var court = await _courtRepository.GetByIdAsync(id);
            if (court == null || court.IsDeleted)
                return new ApiResponseDto<CourtDto>(404, "Court not found");

            // Apply updates if provided
            if (dto.Name != null) court.Name = dto.Name;
            if (dto.CourtTypeId.HasValue) court.CourtTypeId = dto.CourtTypeId.Value;
            if (dto.ImageUrl != null) court.ImageUrl = dto.ImageUrl;
            if (dto.Description != null) court.Description = dto.Description;
            if (dto.Status != null) court.Status = CourtStatuses.NormalizeApiStatus(dto.Status);

            await _courtRepository.UpdateAsync(court);
            var updatedDto = MapToDto(court);
            return new ApiResponseDto<CourtDto>(200, "Court updated", updatedDto);
        }
        catch (Exception ex)
        {
            // M10 FIX: Add try/catch so DB errors return consistent ApiResponseDto instead of unhandled exception
            _logger.LogError(ex, "Error updating court {CourtId}", id);
            return new ApiResponseDto<CourtDto>(500, "Lỗi hệ thống khi cập nhật sân");
        }
    }

    // DELETE - soft delete court (admin only)
    public async Task<ApiResponseDto<object>> DeleteCourtAsync(int id)
    {
        var court = await _courtRepository.GetByIdAsync(id);
        if (court == null || court.IsDeleted)
            return new ApiResponseDto<object>(404, "Court not found");

        var hasActiveBookings = await _courtRepository.HasActiveBookingsAsync(id);
        if (hasActiveBookings)
        {
            return new ApiResponseDto<object>(400, "Không thể xóa sân đang có lịch đặt trong tương lai.");
        }

        court.IsDeleted = true;
        await _courtRepository.UpdateAsync(court);
        return new ApiResponseDto<object>(200, "Court deleted");
    }

    // ==========================================
    // PRICING RULES
    // ==========================================

    public async Task<ApiResponseDto<IEnumerable<PricingRuleDto>>> GetPricingRulesAsync(int courtId)
    {
        var rules = await _courtRepository.GetPricingRulesByCourtIdAsync(courtId);
        var dtos = rules.Select(MapToPricingRuleDto);
        return new ApiResponseDto<IEnumerable<PricingRuleDto>>(200, "Success", dtos);
    }

    public async Task<ApiResponseDto<PricingRuleDto>> CreatePricingRuleAsync(int courtId, CreatePricingRuleDto dto)
    {
        var court = await _courtRepository.GetByIdAsync(courtId);
        if (court == null || court.IsDeleted)
            return new ApiResponseDto<PricingRuleDto>(404, "Court not found");

        if (dto.PricePerHour <= 0 || (dto.Multiplier ?? 1) <= 0)
            return new ApiResponseDto<PricingRuleDto>(400, "Giá và hệ số phải lớn hơn 0.");
        if (dto.EndTime <= dto.StartTime)
            return new ApiResponseDto<PricingRuleDto>(400, "Giờ kết thúc phải sau giờ bắt đầu.");
        if (dto.ValidFrom.HasValue && dto.ValidTo.HasValue && dto.ValidFrom > dto.ValidTo)
            return new ApiResponseDto<PricingRuleDto>(400, "validFrom phải <= validTo.");

        var existingRules = await _courtRepository.GetPricingRulesByCourtIdAsync(courtId);
        if (HasOverlap(existingRules, dto.StartTime, dto.EndTime, dto.DayOfWeek, dto.ValidFrom, dto.ValidTo, null))
            return new ApiResponseDto<PricingRuleDto>(409, "Quy tắc giá trùng phạm vi với rule hiện có.");

        var newRule = new PricingRule
        {
            ComplexId = court.ComplexId,
            CourtId = courtId,
            CourtTypeId = court.CourtTypeId,
            StartTime = dto.StartTime,
            EndTime = dto.EndTime,
            PricePerHour = dto.PricePerHour,
            Multiplier = dto.Multiplier ?? 1m,
            IsWeekend = dto.IsWeekend,
            DayOfWeek = dto.DayOfWeek,
            ValidFrom = dto.ValidFrom,
            ValidTo = dto.ValidTo,
            RuleType = dto.RuleType,
            Status = dto.Status
        };

        var createdRule = await _courtRepository.AddPricingRuleAsync(newRule);
        return new ApiResponseDto<PricingRuleDto>(201, "Pricing rule created", MapToPricingRuleDto(createdRule));
    }

    public async Task<ApiResponseDto<PricingRuleDto>> UpdatePricingRuleAsync(int courtId, int ruleId, UpdatePricingRuleDto dto)
    {
        var rule = await _courtRepository.GetPricingRuleByIdAsync(ruleId);
        if (rule == null || rule.CourtId != courtId)
            return new ApiResponseDto<PricingRuleDto>(404, "Pricing rule not found");

        if (dto.PricePerHour <= 0 || (dto.Multiplier ?? 1) <= 0)
            return new ApiResponseDto<PricingRuleDto>(400, "Giá và hệ số phải lớn hơn 0.");
        if (dto.EndTime <= dto.StartTime)
            return new ApiResponseDto<PricingRuleDto>(400, "Giờ kết thúc phải sau giờ bắt đầu.");

        var existingRules = await _courtRepository.GetPricingRulesByCourtIdAsync(courtId);
        if (HasOverlap(existingRules, dto.StartTime, dto.EndTime, dto.DayOfWeek, dto.ValidFrom, dto.ValidTo, ruleId))
            return new ApiResponseDto<PricingRuleDto>(409, "Quy tắc giá trùng phạm vi với rule hiện có.");

        rule.StartTime = dto.StartTime;
        rule.EndTime = dto.EndTime;
        rule.PricePerHour = dto.PricePerHour;
        rule.Multiplier = dto.Multiplier ?? 1m;
        rule.IsWeekend = dto.IsWeekend;
        rule.DayOfWeek = dto.DayOfWeek;
        rule.ValidFrom = dto.ValidFrom;
        rule.ValidTo = dto.ValidTo;
        rule.RuleType = dto.RuleType;
        rule.Status = dto.Status;
        rule.UpdatedAt = DateTime.UtcNow;

        await _courtRepository.UpdatePricingRuleAsync(rule);
        return new ApiResponseDto<PricingRuleDto>(200, "Pricing rule updated", MapToPricingRuleDto(rule));
    }

    public async Task<ApiResponseDto<object>> DeletePricingRuleAsync(int courtId, int ruleId)
    {
        var rule = await _courtRepository.GetPricingRuleByIdAsync(ruleId);
        if (rule == null || rule.CourtId != courtId)
        {
            return new ApiResponseDto<object>(404, "Pricing rule not found");
        }

        await _courtRepository.DeletePricingRuleAsync(rule);
        return new ApiResponseDto<object>(200, "Pricing rule deleted");
    }

    private static PricingRuleDto MapToPricingRuleDto(PricingRule rule)
    {
        return new PricingRuleDto
        {
            PricingRuleId = rule.PricingRuleId,
            ComplexId = rule.ComplexId,
            CourtId = rule.CourtId,
            StartTime = rule.StartTime,
            EndTime = rule.EndTime,
            PricePerHour = rule.PricePerHour,
            Multiplier = rule.Multiplier,
            IsWeekend = rule.IsWeekend,
            DayOfWeek = rule.DayOfWeek,
            ValidFrom = rule.ValidFrom,
            ValidTo = rule.ValidTo,
            RuleType = rule.RuleType,
            Status = rule.Status
        };
    }

    internal static bool HasOverlap(
        IEnumerable<PricingRule> rules,
        TimeSpan start,
        TimeSpan end,
        int? dayOfWeek,
        DateTime? validFrom,
        DateTime? validTo,
        int? excludeRuleId)
    {
        foreach (var rule in rules.Where(r => r.Status != "Inactive" && r.PricingRuleId != excludeRuleId))
        {
            var dayOverlap = dayOfWeek == null || rule.DayOfWeek == null || dayOfWeek == rule.DayOfWeek;
            var timeOverlap = !(end <= rule.StartTime || start >= rule.EndTime);
            var dateOverlap = !(validTo.HasValue && rule.ValidFrom.HasValue && validTo < rule.ValidFrom)
                && !(validFrom.HasValue && rule.ValidTo.HasValue && validFrom > rule.ValidTo);
            if (dayOverlap && timeOverlap && dateOverlap)
                return true;
        }
        return false;
    }
}
