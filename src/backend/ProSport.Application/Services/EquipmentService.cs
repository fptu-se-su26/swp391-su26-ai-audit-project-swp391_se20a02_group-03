using Microsoft.Extensions.Logging;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using ProSport.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProSport.Application.Services;

public class EquipmentService : IEquipmentService
{
    private readonly IEquipmentRepository _equipmentRepository;
    private readonly IEquipmentCategoryRepository _categoryRepository;
    private readonly ILogger<EquipmentService> _logger;

    public EquipmentService(
        IEquipmentRepository equipmentRepository, 
        IEquipmentCategoryRepository categoryRepository,
        ILogger<EquipmentService> logger)
    {
        _equipmentRepository = equipmentRepository;
        _categoryRepository = categoryRepository;
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
            Price = dto.Price,
            ImageUrl = dto.ImageUrl,
            StockQuantity = 0,
            Status = "Available"
        };

        var created = await _equipmentRepository.CreateAsync(equipment);
        var category = await _categoryRepository.GetByIdAsync(created.EquipmentCategoryId);
        created.EquipmentCategory = category;

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
        equipment.Price = dto.Price;
        equipment.Status = dto.Status;
        equipment.ImageUrl = dto.ImageUrl;

        await _equipmentRepository.UpdateAsync(equipment);
        var category = await _categoryRepository.GetByIdAsync(equipment.EquipmentCategoryId);
        equipment.EquipmentCategory = category;

        return MapEquipmentDtoCombined(equipment);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var equipment = await _equipmentRepository.GetByIdAsync(id);
        if (equipment == null) return false;

        await _equipmentRepository.DeleteAsync(equipment);
        return true;
    }

    // Rent/Return Methods
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

    public async Task<ApiResponseDto<bool>> RentAsync(int userId, RentEquipmentRequest request)
    {
        try
        {
            if (request.Quantity <= 0)
                return new ApiResponseDto<bool>(400, "Quantity must be greater than zero.");

            var equipment = await _equipmentRepository.GetByIdAsync(request.EquipmentId);
            if (equipment == null) return new ApiResponseDto<bool>(404, "Equipment not found");

            // Unit-level tracking logic
            EquipmentUnit? selectedUnit = null;
            if (!string.IsNullOrEmpty(request.PreferredSerialNumber))
            {
                selectedUnit = await _equipmentRepository.GetEquipmentUnitBySerialAsync(request.PreferredSerialNumber);
                if (selectedUnit == null || selectedUnit.EquipmentId != request.EquipmentId || selectedUnit.Status != "Available")
                {
                    return new ApiResponseDto<bool>(400, "Preferred unit is not available");
                }
            }
            else
            {
                var availableUnits = await _equipmentRepository.GetAvailableUnitsForEquipmentAsync(request.EquipmentId);
                selectedUnit = availableUnits.FirstOrDefault();
                if (selectedUnit == null)
                {
                    return new ApiResponseDto<bool>(400, "No available units for this equipment");
                }
            }

            decimal unitPrice = equipment.RentalPrice;
            if (request.BookingId == null)
            {
                unitPrice *= 1.3m;
            }

            // Note: We don't manually decrement equipment.RentalStock here because it will be computed from units
            // but we still need to keep the entity consistent if properties are used.
            // For now, let's keep it as is or update it based on the new logic.
            equipment.RentalStock = (await _equipmentRepository.GetAvailableUnitsForEquipmentAsync(equipment.EquipmentId)).Count() - 1;
            await _equipmentRepository.UpdateEquipmentAsync(equipment);

            var rental = new EquipmentRental
            {
                EquipmentId = request.EquipmentId,
                EquipmentUnitId = selectedUnit.EquipmentUnitId,
                BookingId = request.BookingId,
                UserId = userId,
                Quantity = 1, // Unit-level tracking assumes 1 unit per rental record
                UnitPrice = unitPrice,
                DepositAmount = EquipmentRentalRules.CalculateDeposit(equipment.RetailPrice, 1),
                DepositStatus = "Held",
                RentalStatus = "Rented",
                RentedAt = DateTime.UtcNow
            };

            await _equipmentRepository.UpdateEquipmentUnitStatusAsync(selectedUnit.EquipmentUnitId, "Rented");
            await _equipmentRepository.CreateRentalAsync(rental);

            return new ApiResponseDto<bool>(200, "Equipment rented successfully", true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error renting equipment for user: {UserId}", userId);
            return new ApiResponseDto<bool>(500, "An unexpected error occurred.");
        }
    }

    public async Task<ApiResponseDto<bool>> ReturnAsync(int userId, ReturnEquipmentRequest request)
    {
        try
        {
            var rental = await _equipmentRepository.GetRentalByIdAsync(request.EquipmentRentalId);
            if (rental == null) return new ApiResponseDto<bool>(404, "Rental record not found");

            if (rental.UserId != userId)
                return new ApiResponseDto<bool>(403, "You are not allowed to return this rental.");

            if (rental.RentalStatus != "Rented")
                return new ApiResponseDto<bool>(400, "This rental has already been returned.");

            var equipment = rental.Equipment;
            equipment.RentalStock += rental.Quantity;
            await _equipmentRepository.UpdateEquipmentAsync(equipment);

            rental.RentalStatus = "Returned";
            await _equipmentRepository.UpdateRentalAsync(rental);

            return new ApiResponseDto<bool>(200, "Equipment returned successfully. Deposit will be processed after inspection.", true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error returning equipment rental: {RentalId}", request.EquipmentRentalId);
            return new ApiResponseDto<bool>(500, "An unexpected error occurred.");
        }
    }

    public async Task<ApiResponseDto<EquipmentRentalDto>> InspectReturnAsync(int rentalId, InspectEquipmentRentalRequest request)
    {
        try
        {
            var rental = await _equipmentRepository.GetRentalByIdAsync(rentalId);
            if (rental == null) return new ApiResponseDto<EquipmentRentalDto>(404, "Rental record not found");

            if (rental.RentalStatus != "Returned")
                return new ApiResponseDto<EquipmentRentalDto>(400, "Rental must be returned before inspection.");

            if (rental.DepositStatus != "Held")
                return new ApiResponseDto<EquipmentRentalDto>(400, "Deposit has already been processed.");

            var condition = request.Condition?.Trim();
            if (condition is not ("Good" or "Damaged" or "Lost"))
                return new ApiResponseDto<EquipmentRentalDto>(400, "Condition must be Good, Damaged, or Lost.");

            rental.ReturnCondition = condition;
            rental.DamageNote = request.DamageNote;

            switch (condition)
            {
                case "Good":
                    rental.DamageFee = 0;
                    rental.DepositRefundAmount = rental.DepositAmount;
                    rental.AdditionalCharge = 0;
                    rental.DepositStatus = "Refunded";
                    
                    if (rental.EquipmentUnitId.HasValue)
                    {
                        var unit = await _equipmentRepository.GetEquipmentUnitByIdAsync(rental.EquipmentUnitId.Value);
                        if (unit != null)
                        {
                            unit.Status = "Available";
                            unit.RentalCount += 1;
                            await _equipmentRepository.UpdateEquipmentUnitAsync(unit);
                        }
                    }
                    break;

                case "Damaged":
                    var damageFee = request.DamageFee ?? 0;
                    if (damageFee < 0)
                        return new ApiResponseDto<EquipmentRentalDto>(400, "Damage fee cannot be negative.");
                    if (damageFee > rental.DepositAmount)
                        return new ApiResponseDto<EquipmentRentalDto>(400, "Damage fee cannot exceed deposit amount.");

                    rental.DamageFee = damageFee;
                    rental.DepositRefundAmount = rental.DepositAmount - damageFee;
                    rental.AdditionalCharge = 0;
                    rental.DepositStatus = "Deducted";

                    if (rental.EquipmentUnitId.HasValue)
                    {
                        var unit = await _equipmentRepository.GetEquipmentUnitByIdAsync(rental.EquipmentUnitId.Value);
                        if (unit != null)
                        {
                            unit.Status = "Maintenance";
                            unit.RentalCount += 1;
                            await _equipmentRepository.UpdateEquipmentUnitAsync(unit);
                        }
                    }
                    break;

                case "Lost":
                    var replacementCost = rental.Equipment.RetailPrice * rental.Quantity;
                    rental.DamageFee = replacementCost;
                    rental.DepositRefundAmount = Math.Max(0, rental.DepositAmount - replacementCost);
                    rental.AdditionalCharge = Math.Max(0, replacementCost - rental.DepositAmount);
                    rental.DepositStatus = "Deducted";

                    if (rental.EquipmentUnitId.HasValue)
                    {
                        var unit = await _equipmentRepository.GetEquipmentUnitByIdAsync(rental.EquipmentUnitId.Value);
                        if (unit != null)
                        {
                            unit.Status = "Liquidated";
                            // RentalCount does not increase for lost items
                            await _equipmentRepository.UpdateEquipmentUnitAsync(unit);
                        }
                    }
                    break;
            }

            await _equipmentRepository.UpdateRentalAsync(rental);
            
            // Re-fetch to get updated navigation properties if needed, or update equipment.RentalStock
            var equipment = await _equipmentRepository.GetByIdAsync(rental.EquipmentId);
            if (equipment != null)
            {
                var availableUnits = await _equipmentRepository.GetAvailableUnitsForEquipmentAsync(equipment.EquipmentId);
                equipment.RentalStock = availableUnits.Count();
                await _equipmentRepository.UpdateEquipmentAsync(equipment);
            }

            return new ApiResponseDto<EquipmentRentalDto>(200, "Inspection completed successfully.", MapRentalDto(rental));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error inspecting equipment rental: {RentalId}", rentalId);
            return new ApiResponseDto<EquipmentRentalDto>(500, "An unexpected error occurred.");
        }
    }

    public async Task<ApiResponseDto<IEnumerable<EquipmentRentalDto>>> GetUserRentalsAsync(int userId)
    {
        try
        {
            var rentals = await _equipmentRepository.GetUserRentalsAsync(userId);
            var result = rentals.Select(MapRentalDto);
            return new ApiResponseDto<IEnumerable<EquipmentRentalDto>>(200, "Success", result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting rentals for user: {UserId}", userId);
            return new ApiResponseDto<IEnumerable<EquipmentRentalDto>>(500, "An unexpected error occurred.");
        }
    }

    public async Task<ApiResponseDto<IEnumerable<EquipmentRentalDto>>> GetPendingInspectionsAsync()
    {
        try
        {
            var rentals = await _equipmentRepository.GetPendingInspectionsAsync();
            var result = rentals.Select(MapRentalDto);
            return new ApiResponseDto<IEnumerable<EquipmentRentalDto>>(200, "Success", result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting pending equipment inspections");
            return new ApiResponseDto<IEnumerable<EquipmentRentalDto>>(500, "An unexpected error occurred.");
        }
    }

 feat/DE190130_API_Tham_Gia_&_Vi_Escrow
    private static EquipmentDto MapEquipmentDtoCombined(Equipment e) => new()
    public async Task<EquipmentDashboardDto> GetDashboardStatsAsync()
    {
        var rentals = (await _equipmentRepository.GetAllRentalsAsync()).ToList();
        var units = (await _equipmentRepository.GetAllUnitsAsync()).ToList();
        var allEquipment = (await _equipmentRepository.GetAllAsync()).ToList();

        var stats = new EquipmentDashboardDto
        {
            ActiveRentals = rentals.Count(r => r.RentalStatus == "Active" || r.RentalStatus == "Rented"),
            TotalRevenue = rentals.Where(r => r.RentalStatus == "Completed" || r.RentalStatus == "Returned" || r.RentalStatus == "Inspected") 
                                  .Sum(r => r.UnitPrice * r.Quantity),
            
            PendingInspections = rentals.Count(r => r.RentalStatus == "Returned" && string.IsNullOrEmpty(r.ReturnCondition)),
            
            TotalEquipmentValue = allEquipment.Sum(e => e.RetailPrice * (e.Units?.Count ?? 0)),
            
            UnitsByStatus = new UnitsByStatusDto
            {
                Available = units.Count(u => u.Status == "Available"),
                Rented = units.Count(u => u.Status == "Rented"),
                Maintenance = units.Count(u => u.Status == "Maintenance"),
                Liquidated = units.Count(u => u.Status == "Liquidated")
            },
            
            TopRentedEquipment = rentals
                .GroupBy(r => r.EquipmentId)
                .Select(g => new TopEquipmentDto
                {
                    EquipmentName = g.First().Equipment.EquipmentName,
                    TotalRentals = g.Count(),
                    Revenue = g.Sum(r => r.UnitPrice * r.Quantity)
                })
                .OrderByDescending(x => x.TotalRentals)
                .Take(5)
                .ToList()
        };

        return stats;
    }

    private static EquipmentDto MapEquipmentDto(Equipment e) => new()
 main
    {
        EquipmentId = e.EquipmentId,
        EquipmentCategoryId = e.EquipmentCategoryId,
        CategoryName = e.EquipmentCategory?.Name ?? "Unknown",
        Name = e.Name ?? e.EquipmentName,
        Description = e.Description,
        Price = e.Price,
        StockQuantity = e.StockQuantity,
        Status = e.Status ?? "Available",
        Category = e.Category ?? "Racket",
        Type = e.SportType ?? "Badminton",
        RetailPrice = e.RetailPrice,
        RentalPrice = e.RentalPrice,
        RentalStock = e.Units != null && e.Units.Any() 
            ? e.Units.Count(u => u.Status == "Available" && !u.IsDeleted) 
            : e.RentalStock,
        SalesStock = e.SalesStock,
        ImageUrl = e.ImageUrl
    };

    private static EquipmentRentalDto MapRentalDto(EquipmentRental r) => new()
    {
        EquipmentRentalId = r.DetailId,
        EquipmentId = r.EquipmentId,
        EquipmentName = r.Equipment.EquipmentName ?? r.Equipment.Name,
        BookingId = r.BookingId,
        Quantity = r.Quantity,
        UnitPrice = r.UnitPrice,
        TotalPrice = r.Subtotal,
        DepositAmount = r.DepositAmount,
        DepositStatus = r.DepositStatus,
        RentalStatus = r.RentalStatus,
        ReturnCondition = r.ReturnCondition,
        DamageNote = r.DamageNote,
        DamageFee = r.DamageFee,
        DepositRefundAmount = r.DepositRefundAmount,
        AdditionalCharge = r.AdditionalCharge,
        RentedAt = r.RentedAt,
        SerialNumber = r.EquipmentUnit?.SerialNumber
    };
}
