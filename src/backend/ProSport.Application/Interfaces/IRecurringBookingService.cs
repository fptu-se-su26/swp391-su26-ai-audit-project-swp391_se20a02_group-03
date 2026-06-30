using ProSport.Application.DTOs;

namespace ProSport.Application.Interfaces;

public interface IRecurringBookingService
{
    Task<ApiResponseDto<RecurringBookingRuleDto>> CreateRuleAsync(int userId, CreateRecurringRuleDto dto);
    Task<ApiResponseDto<IEnumerable<RecurringBookingRuleDto>>> GetUserRulesAsync(int userId);
    Task<ApiResponseDto<bool>> CancelRuleAsync(int userId, int ruleId);
    Task<int> GenerateUpcomingBookingsAsync();
}
