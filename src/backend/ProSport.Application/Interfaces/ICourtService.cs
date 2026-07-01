using System.Collections.Generic;
using ProSport.Application.DTOs;
using ProSport.Application.DTOs.Owner;

namespace ProSport.Application.Interfaces;

public interface ICourtService
{
    Task<ApiResponseDto<PagedResult<CourtDto>>> GetAllCourtsAsync(CourtQueryParameters parameters);
    Task<ApiResponseDto<CourtDto>> GetCourtByIdAsync(int courtId);
    Task<ApiResponseDto<IEnumerable<CourtDto>>> GetAvailableCourtsAsync(DateTime date, TimeSpan startTime, TimeSpan endTime);
    Task<ApiResponseDto<CourtDto>> CreateCourtAsync(CreateCourtDto dto);
    Task<ApiResponseDto<CourtDto>> UpdateCourtAsync(int id, UpdateCourtDto dto);
    Task<ApiResponseDto<IEnumerable<string>>> GetBookedSlotsAsync(int courtId, DateTime date);
    Task<ApiResponseDto<CourtAvailabilityDto>> GetCourtAvailabilityAsync(int courtId, DateTime date);
    Task<ApiResponseDto<object>> DeleteCourtAsync(int id);
    
    // Pricing Rules
    Task<ApiResponseDto<IEnumerable<PricingRuleDto>>> GetPricingRulesAsync(int courtId);
    Task<ApiResponseDto<PricingRuleDto>> CreatePricingRuleAsync(int courtId, CreatePricingRuleDto dto);
    Task<ApiResponseDto<PricingRuleDto>> UpdatePricingRuleAsync(int courtId, int ruleId, UpdatePricingRuleDto dto);
    Task<ApiResponseDto<object>> DeletePricingRuleAsync(int courtId, int ruleId);
}
