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
    
    // Pricing Rules
    Task<IEnumerable<PricingRule>> GetPricingRulesByCourtIdAsync(int courtId);
    Task<PricingRule?> GetPricingRuleByIdAsync(int ruleId);
    Task<PricingRule> AddPricingRuleAsync(PricingRule rule);
    Task DeletePricingRuleAsync(PricingRule rule);
}
