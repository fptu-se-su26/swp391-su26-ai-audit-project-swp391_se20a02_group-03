using ProSport.Application.DTOs;
using ProSport.Application.DTOs.Owner;

namespace ProSport.Application.Interfaces;

public interface IOwnerInventoryService
{
    Task<ApiResponseDto<PagedResult<ProductStockDto>>> GetProductsAsync(OwnerInventoryQueryDto query);
    Task<ApiResponseDto<ProductStockDto>> CreateProductAsync(int actorUserId, CreateProductStockDto dto);
    Task<ApiResponseDto<ProductStockDto>> UpdateProductAsync(int actorUserId, int id, int complexId, UpdateProductStockDto dto);
    Task<ApiResponseDto<PagedResult<RentalAssetDto>>> GetRentalAssetsAsync(OwnerInventoryQueryDto query);
    Task<ApiResponseDto<RentalAssetDto>> CreateRentalAssetAsync(int actorUserId, CreateRentalAssetDto dto);
    Task<ApiResponseDto<RentalAssetDto>> UpdateRentalAssetAsync(int actorUserId, int id, int complexId, UpdateRentalAssetDto dto);
    Task<ApiResponseDto<RentalAssetDto>> UpdateRentalAssetStatusAsync(int actorUserId, int id, int complexId, UpdateRentalAssetStatusDto dto);
}

public interface IOwnerRentalService
{
    Task<ApiResponseDto<PagedResult<RentalSessionDto>>> GetRentalsAsync(OwnerRentalQueryDto query);
    Task<ApiResponseDto<RentalSessionDto>> GetRentalByIdAsync(int id, int complexId);
    Task<ApiResponseDto<RentalSessionDto>> CreateRentalAsync(int actorUserId, CreateRentalSessionDto dto);
    Task<ApiResponseDto<List<ConditionCheckDto>>> GetConditionHistoryAsync(int rentalId, int complexId);
    Task<ApiResponseDto<ConditionCheckDto>> AddConditionCheckAsync(int actorUserId, int rentalId, int complexId, CreateConditionCheckDto dto);
    Task<ApiResponseDto<RentalSurchargeDto>> AddSurchargeAsync(int actorUserId, int rentalId, int complexId, CreateRentalSurchargeDto dto);
}

public interface IOwnerReportService
{
    Task<ApiResponseDto<OwnerReportRevenueDto>> GetRevenueAsync(int complexId, DateTime? from, DateTime? to);
    Task<ApiResponseDto<OwnerReportOccupancyDto>> GetOccupancyAsync(int complexId, DateTime? from, DateTime? to);
    Task<ApiResponseDto<OwnerReportInventoryDto>> GetInventoryReportAsync(int complexId);
    Task<ApiResponseDto<byte[]>> ExportReportAsync(int complexId, DateTime? from, DateTime? to);
}

public interface IOwnerReviewService
{
    Task<ApiResponseDto<List<ComplexReviewDto>>> GetReviewsAsync(int complexId);
    Task<ApiResponseDto<ComplexReviewDto>> ReplyToReviewAsync(int actorUserId, int reviewId, int complexId, OwnerReviewReplyDto dto);
    Task<ApiResponseDto<ComplexReviewDto>> ReportReviewAsync(int actorUserId, int reviewId, int complexId, OwnerReviewReportDto dto);
}

public interface IOwnerVoucherService
{
    Task<ApiResponseDto<List<OwnerVoucherDto>>> GetVouchersAsync(int complexId);
    Task<ApiResponseDto<OwnerVoucherDto>> CreateVoucherAsync(int actorUserId, int complexId, CreateOwnerVoucherDto dto);
    Task<ApiResponseDto<OwnerVoucherDto>> UpdateVoucherAsync(int actorUserId, int id, int complexId, UpdateOwnerVoucherDto dto);
    Task<ApiResponseDto<OwnerVoucherDto>> UpdateVoucherStatusAsync(int actorUserId, int id, int complexId, UpdateVoucherStatusDto dto);
}
