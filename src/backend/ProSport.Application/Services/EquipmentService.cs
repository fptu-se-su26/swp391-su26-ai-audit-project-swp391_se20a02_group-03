using Microsoft.Extensions.Logging;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using ProSport.Domain.Constants;
using ProSport.Domain.Entities;using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProSport.Application.Services;

public class EquipmentService : IEquipmentService
{
    private readonly IEquipmentRepository _equipmentRepository;
    private readonly IEquipmentCategoryRepository _categoryRepository;
    private readonly IEscrowRepository _escrowRepository;
    private readonly ILogger<EquipmentService> _logger;

    public EquipmentService(
        IEquipmentRepository equipmentRepository, 
        IEquipmentCategoryRepository categoryRepository,
        IEscrowRepository escrowRepository,
        ILogger<EquipmentService> logger)
    {
        _equipmentRepository = equipmentRepository;
        _categoryRepository = categoryRepository;
        _escrowRepository = escrowRepository;
        _logger = logger;
    }
    // CRUD Methods
    public async Task<PagedResult<EquipmentDto>> GetPagedAsync(EquipmentQueryParameters parameters)
    {
        var (items, totalCount) = await _equipmentRepository.GetPagedAsync(parameters);

        var dtoItems = items.Select(e => MapEquipmentDtoCombined(e)).ToList();

        return new PagedResult<EquipmentDto>
        {
            Items = dtoItems,
            TotalCount = totalCount,
            CurrentPage = parameters.PageNumber,
            TotalPages = (int)Math.Ceiling((double)totalCount / parameters.PageSize)
        };
    }

    public async Task<EquipmentDto?> GetByIdAsync(int id)
    {
        var e = await _equipmentRepository.GetByIdAsync(id);
        if (e == null) return null;

        return MapEquipmentDtoCombined(e);
    }

    public async Task<EquipmentDto> CreateAsync(CreateEquipmentDto dto)
    {
        var equipment = new Equipment
        {
            EquipmentCategoryId = dto.EquipmentCategoryId,
            Name = dto.Name,
            EquipmentName = dto.Name,
            Category = "Racket",
            SportType = "Badminton",
            Description = dto.Description,
            RetailPrice = dto.Price,
            ImageUrl = dto.ImageUrl,
            StockQuantity = 0,
            Status = "Available"
        };

        var created = await _equipmentRepository.CreateAsync(equipment);
        var category = await _categoryRepository.GetByIdAsync(created.EquipmentCategoryId);
        created.EquipmentCategory = category!; // MapEquipmentDtoCombined null-check qua ?.Name ?? "Unknown"

        return MapEquipmentDtoCombined(created);
    }

    public async Task<EquipmentDto?> UpdateAsync(int id, UpdateEquipmentDto dto)
    {
        var equipment = await _equipmentRepository.GetByIdAsync(id);
        if (equipment == null) return null;

        equipment.EquipmentCategoryId = dto.EquipmentCategoryId;
        equipment.Name = dto.Name;
        equipment.EquipmentName = dto.Name;
        equipment.Description = dto.Description;
        equipment.RetailPrice = dto.Price;
        equipment.Status = dto.Status;
        equipment.ImageUrl = dto.ImageUrl;

        await _equipmentRepository.UpdateAsync(equipment);
        var category = await _categoryRepository.GetByIdAsync(equipment.EquipmentCategoryId);
        equipment.EquipmentCategory = category!; // MapEquipmentDtoCombined null-check qua ?.Name ?? "Unknown"

        return MapEquipmentDtoCombined(equipment);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var equipment = await _equipmentRepository.GetByIdAsync(id);
        if (equipment == null) return false;

        await _equipmentRepository.DeleteAsync(equipment);
        return true;
    }

    // Purchase Methods
    public async Task<ApiResponseDto<IEnumerable<EquipmentDto>>> GetAllAsync()
    {
        try
        {
            var equipments = await _equipmentRepository.GetAllAsync();
            var dtos = equipments.Select(MapEquipmentDtoCombined);
            return new ApiResponseDto<IEnumerable<EquipmentDto>>(200, "Success", dtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all equipment");
            return new ApiResponseDto<IEnumerable<EquipmentDto>>(500, "An unexpected error occurred.");
        }
    }

    public async Task<ApiResponseDto<bool>> BuyAsync(int userId, BuyEquipmentRequest request)
    {
        try
        {
            if (request.Quantity <= 0)
                return new ApiResponseDto<bool>(400, "Quantity must be greater than zero.");

            var equipment = await _equipmentRepository.GetByIdAsync(request.EquipmentId);
            if (equipment == null) return new ApiResponseDto<bool>(404, "Equipment not found");

            if (equipment.StockQuantity < request.Quantity)
                return new ApiResponseDto<bool>(400, $"Not enough stock for {equipment.EquipmentName}. Only {equipment.StockQuantity} available.");

            var totalAmount = equipment.RetailPrice * request.Quantity;
            var equipmentName = equipment.EquipmentName ?? equipment.Name ?? $"#{equipment.EquipmentId}";
            var referenceId = request.BookingId.HasValue
                ? $"EquipmentBuy_B{request.BookingId}_{request.EquipmentId}_{Guid.NewGuid():N}"
                : $"EquipmentBuy_{request.EquipmentId}_{Guid.NewGuid():N}";
            var description = request.BookingId.HasValue
                ? $"Mua {equipmentName} x{request.Quantity} (booking #{request.BookingId})"
                : $"Mua {equipmentName} x{request.Quantity}";

            var purchased = await _escrowRepository.ExecuteInTransactionAsync(async () =>
            {
                if (!await _escrowRepository.PayEquipmentPurchaseAsync(
                        userId, totalAmount, request.BookingId, referenceId, description))
                {
                    return false;
                }

                equipment.StockQuantity -= request.Quantity;
                await _equipmentRepository.UpdateEquipmentAsync(equipment);
                return true;
            });

            if (!purchased)
                return new ApiResponseDto<bool>(400, "Số dư ví không đủ để thanh toán.");

            return new ApiResponseDto<bool>(200, "Equipment purchased successfully", true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error buying equipment for user: {UserId}", userId);
            return new ApiResponseDto<bool>(500, "An unexpected error occurred.");
        }
    }

    public async Task<EquipmentDashboardDto> GetDashboardStatsAsync()
    {
        var allEquipment = (await _equipmentRepository.GetAllAsync()).ToList();

        var stats = new EquipmentDashboardDto
        {
            TotalSalesRevenue = 0, 
            TotalItemsSold = 0,    
            LowStockItemsCount = allEquipment.Count(e => e.StockQuantity < 5),
            TotalInventoryValue = allEquipment.Sum(e => e.RetailPrice * e.StockQuantity),
            TopSellingEquipment = new List<TopEquipmentDto>()
        };

        return stats;
    }

    private static EquipmentDto MapEquipmentDtoCombined(Equipment e) => new()
    {
        EquipmentId = e.EquipmentId,
        EquipmentCategoryId = e.EquipmentCategoryId,
        CategoryName = e.EquipmentCategory?.Name ?? "Unknown",
        Name = !string.IsNullOrWhiteSpace(e.Name) ? e.Name : e.EquipmentName,
        Description = e.Description,
        Price = e.RetailPrice,
        StockQuantity = e.StockQuantity,
        Status = e.Status ?? "Available",
        Category = e.Category ?? "Racket",
        Type = e.SportType ?? "Badminton",
        RetailPrice = e.RetailPrice,
        ImageUrl = e.ImageUrl
    };
}
