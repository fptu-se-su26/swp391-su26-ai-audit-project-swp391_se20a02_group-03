using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using ProSport.Application.Services;
using ProSport.Domain.Constants;
using ProSport.Domain.Entities;
using ProSport.Infrastructure.Data;

namespace ProSport.Infrastructure.Services;

public class RecurringBookingService : IRecurringBookingService
{
    private static readonly HashSet<string> ValidFrequencies = new(StringComparer.OrdinalIgnoreCase)
    {
        "Weekly",
        "Biweekly",
        "Monthly"
    };

    private readonly ProSportDbContext _db;
    private readonly IBookingRepository _bookingRepository;
    private readonly ICourtRepository _courtRepository;
    private readonly IMembershipService _membershipService;
    private readonly ILogger<RecurringBookingService> _logger;

    public RecurringBookingService(
        ProSportDbContext db,
        IBookingRepository bookingRepository,
        ICourtRepository courtRepository,
        IMembershipService membershipService,
        ILogger<RecurringBookingService> logger)
    {
        _db = db;
        _bookingRepository = bookingRepository;
        _courtRepository = courtRepository;
        _membershipService = membershipService;
        _logger = logger;
    }

    public async Task<ApiResponseDto<RecurringBookingRuleDto>> CreateRuleAsync(int userId, CreateRecurringRuleDto dto)
    {
        var court = await _courtRepository.GetByIdAsync(dto.CourtId);
        if (court == null || !court.ComplexId.HasValue)
            return new ApiResponseDto<RecurringBookingRuleDto>(404, "Sân không tồn tại.");

        if (dto.ValidTo <= dto.ValidFrom)
            return new ApiResponseDto<RecurringBookingRuleDto>(400, "ValidTo phải sau ValidFrom.");

        if (string.IsNullOrWhiteSpace(dto.Frequency) || !ValidFrequencies.Contains(dto.Frequency))
            return new ApiResponseDto<RecurringBookingRuleDto>(400, "Frequency không hợp lệ. Chọn Weekly, Biweekly hoặc Monthly.");

        var rule = new RecurringBookingRule
        {
            UserId = userId,
            CourtId = dto.CourtId,
            DayOfWeek = dto.DayOfWeek,
            StartTime = dto.StartTime,
            EndTime = dto.EndTime,
            ValidFrom = dto.ValidFrom.Date,
            ValidTo = dto.ValidTo.Date,
            Frequency = dto.Frequency,
            Status = "Active"
        };

        _db.RecurringBookingRules.Add(rule);
        await _db.SaveChangesAsync();

        await GenerateForRuleAsync(rule, dto.GenerateWeeksAhead);

        return new ApiResponseDto<RecurringBookingRuleDto>(201, "Tạo lịch đặt định kỳ thành công.", MapRule(rule, court.Name));
    }

    public async Task<ApiResponseDto<IEnumerable<RecurringBookingRuleDto>>> GetUserRulesAsync(int userId)
    {
        var rules = await _db.RecurringBookingRules.AsNoTracking()
            .Include(r => r.Court)
            .Where(r => r.UserId == userId && r.Status == "Active")
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        return new ApiResponseDto<IEnumerable<RecurringBookingRuleDto>>(200, "Success",
            rules.Select(r => MapRule(r, r.Court.Name)));
    }

    public async Task<ApiResponseDto<bool>> CancelRuleAsync(int userId, int ruleId)
    {
        var rule = await _db.RecurringBookingRules.FirstOrDefaultAsync(r => r.RecurringBookingRuleId == ruleId && r.UserId == userId);
        if (rule == null) return new ApiResponseDto<bool>(404, "Rule not found");
        rule.Status = "Cancelled";
        await _db.SaveChangesAsync();
        return new ApiResponseDto<bool>(200, "Đã hủy lịch đặt định kỳ.", true);
    }

    public async Task<int> GenerateUpcomingBookingsAsync()
    {
        var rules = await _db.RecurringBookingRules
            .Include(r => r.Court)
            .Where(r => r.Status == "Active" && r.ValidTo >= DateTime.UtcNow.Date)
            .ToListAsync();

        var count = 0;
        foreach (var rule in rules)
            count += await GenerateForRuleAsync(rule, 2);

        return count;
    }

    private async Task<int> GenerateForRuleAsync(RecurringBookingRule rule, int weeksAhead)
    {
        var court = rule.Court ?? await _courtRepository.GetByIdAsync(rule.CourtId);
        if (court == null) return 0;

        var startFrom = GetNextOccurrenceStart(rule);
        var endDate = DateTime.UtcNow.Date.AddDays(weeksAhead * 7);
        if (endDate > rule.ValidTo) endDate = rule.ValidTo;

        var created = 0;
        for (var date = startFrom; date <= endDate; date = date.AddDays(1))
        {
            if (!MatchesFrequency(rule, date)) continue;
            if (date < rule.ValidFrom || date > rule.ValidTo) continue;

            var exists = await _db.BookingDetails.AnyAsync(d =>
                d.CourtId == rule.CourtId
                && d.BookingDate.Date == date.Date
                && d.StartTime == rule.StartTime
                && d.Booking!.UserId == rule.UserId
                && d.Booking.RecurringRuleId == rule.RecurringBookingRuleId
                && d.Booking.Status != BookingStatus.Cancelled);

            if (exists) continue;

            var available = await _bookingRepository.IsCourtSlotAvailableAsync(
                rule.CourtId, date, rule.StartTime, rule.EndTime);
            if (!available)
            {
                rule.LastGeneratedDate = date;
                continue;
            }

            var discountPercent = court.ComplexId.HasValue
                ? await _membershipService.GetActiveDiscountPercentAsync(rule.UserId, court.ComplexId.Value, date)
                : 0m;
            var price = BookingPriceCalculator.Calculate(court, date, rule.StartTime, rule.EndTime, discountPercent);
            var booking = new Booking
            {
                UserId = rule.UserId,
                TotalAmount = price,
                Status = BookingStatus.Pending,
                PaymentMethod = PaymentMethod.VNPay,
                PaymentStatus = PaymentStatus.Pending,
                PaymentDeadline = DateTime.UtcNow.AddHours(24),
                RecurringRuleId = rule.RecurringBookingRuleId,
                BookingDetails = new List<BookingDetail>
                {
                    new()
                    {
                        CourtId = rule.CourtId,
                        BookingDate = date,
                        StartTime = rule.StartTime,
                        EndTime = rule.EndTime,
                        Price = price
                    }
                }
            };

            try
            {
                await _bookingRepository.CreateWithTransactionAsync(booking);
                created++;
                rule.LastGeneratedDate = date;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Skip recurring slot {Date} court {CourtId}", date, rule.CourtId);
            }

            rule.LastGeneratedDate = date;
        }

        if (created > 0)
            await _db.SaveChangesAsync();

        return created;
    }

    private static DateTime GetNextOccurrenceStart(RecurringBookingRule rule)
    {
        if (!rule.LastGeneratedDate.HasValue)
            return rule.ValidFrom.Date;

        if (rule.Frequency.Equals("Monthly", StringComparison.OrdinalIgnoreCase))
            return rule.LastGeneratedDate.Value.Date.AddMonths(1);

        var stepDays = rule.Frequency.Equals("Biweekly", StringComparison.OrdinalIgnoreCase) ? 14 : 7;
        return rule.LastGeneratedDate.Value.Date.AddDays(stepDays);
    }

    private static bool MatchesFrequency(RecurringBookingRule rule, DateTime date)
    {
        if (date.DayOfWeek != rule.DayOfWeek)
            return false;

        if (rule.Frequency.Equals("Monthly", StringComparison.OrdinalIgnoreCase))
            return IsMonthlyOccurrence(rule.ValidFrom.Date, date);

        var step = rule.Frequency.Equals("Biweekly", StringComparison.OrdinalIgnoreCase) ? 14 : 7;
        var anchor = GetFirstMatchingWeekday(rule.ValidFrom.Date, rule.DayOfWeek);
        var daysSinceAnchor = (date.Date - anchor).Days;
        return daysSinceAnchor >= 0 && daysSinceAnchor % step == 0;
    }

    private static DateTime GetFirstMatchingWeekday(DateTime from, DayOfWeek dayOfWeek)
    {
        var date = from.Date;
        while (date.DayOfWeek != dayOfWeek)
            date = date.AddDays(1);
        return date;
    }

    private static bool IsMonthlyOccurrence(DateTime anchor, DateTime date)
    {
        if (GetWeekdayOccurrenceInMonth(anchor) != GetWeekdayOccurrenceInMonth(date))
            return false;

        var monthDiff = (date.Year - anchor.Year) * 12 + date.Month - anchor.Month;
        return monthDiff >= 0;
    }

    private static int GetWeekdayOccurrenceInMonth(DateTime date) => (date.Day - 1) / 7 + 1;

    private static RecurringBookingRuleDto MapRule(RecurringBookingRule r, string courtName) => new()
    {
        RuleId = r.RecurringBookingRuleId,
        CourtId = r.CourtId,
        CourtName = courtName,
        DayOfWeek = r.DayOfWeek,
        StartTime = r.StartTime,
        EndTime = r.EndTime,
        ValidFrom = r.ValidFrom,
        ValidTo = r.ValidTo,
        Status = r.Status
    };
}
