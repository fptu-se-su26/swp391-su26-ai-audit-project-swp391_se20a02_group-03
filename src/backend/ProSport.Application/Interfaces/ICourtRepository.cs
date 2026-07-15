using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using ProSport.Application.DTOs;
using ProSport.Domain.Entities;

namespace ProSport.Application.Interfaces;

public interface ICourtRepository
{
    Task<IEnumerable<Court>> GetAllAsync();
    Task<(IEnumerable<Court> Items, int TotalCount)> GetPagedCourtsAsync(CourtQueryParameters parameters);
    Task<Court?> GetByIdAsync(int courtId);
    Task<IEnumerable<Court>> GetAvailableCourtsAsync(DateTime date, TimeSpan startTime, TimeSpan endTime);
    Task<Court> CreateAsync(Court court);
    Task UpdateAsync(Court court);
    Task<IEnumerable<string>> GetBookedSlotsAsync(int courtId, DateTime date);
    Task<bool> HasActiveBookingsAsync(int courtId);
    Task<bool> ExistsCodeInComplexAsync(int complexId, string code, int? excludeCourtId);

    /// <summary>
    /// Slot có nằm trong giờ hoạt động của tổ hợp không (không rơi vào ngày đóng cửa,
    /// khung bảo trì, và nằm trong giờ mở-đóng của ngày đó). Dùng để chặn đặt sân ngoài giờ.
    /// </summary>
    Task<bool> IsSlotWithinOperatingHoursAsync(int complexId, int? courtId, DateTime bookingDate, TimeSpan startTime, TimeSpan endTime);
    
    // Pricing Rules
    Task<IEnumerable<PricingRule>> GetPricingRulesByCourtIdAsync(int courtId);
    Task<PricingRule?> GetPricingRuleByIdAsync(int ruleId);
    Task<PricingRule> AddPricingRuleAsync(PricingRule rule);
    Task UpdatePricingRuleAsync(PricingRule rule);
    Task DeletePricingRuleAsync(PricingRule rule);
}
