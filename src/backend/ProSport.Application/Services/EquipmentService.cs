using Microsoft.Extensions.Logging;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using ProSport.Application.Services;
using ProSport.Domain.Entities;

namespace ProSport.Application.Services;

public class EquipmentService : IEquipmentService
{
    private readonly IEquipmentRepository _equipmentRepository;
    private readonly ILogger<EquipmentService> _logger;

    public EquipmentService(IEquipmentRepository equipmentRepository, ILogger<EquipmentService> logger)
    {
        _equipmentRepository = equipmentRepository;
        _logger = logger;
    }

    public async Task<ApiResponseDto<IEnumerable<EquipmentDto>>> GetAllAsync()
    {
        try
        {
            var equipments = await _equipmentRepository.GetAllAsync();
            var dtos = equipments.Select(MapEquipmentDto);
            return new ApiResponseDto<IEnumerable<EquipmentDto>>(200, "Success", dtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all equipment");
            return new ApiResponseDto<IEnumerable<EquipmentDto>>(500, "An unexpected error occurred.");
        }
    }

    public async Task<ApiResponseDto<EquipmentDto>> GetByIdAsync(int id)
    {
        try
        {
            var equipment = await _equipmentRepository.GetByIdAsync(id);
            if (equipment == null) return new ApiResponseDto<EquipmentDto>(404, "Equipment not found");

            return new ApiResponseDto<EquipmentDto>(200, "Success", MapEquipmentDto(equipment));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting equipment by id: {Id}", id);
            return new ApiResponseDto<EquipmentDto>(500, "An unexpected error occurred.");
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

            if (equipment.RentalStock < request.Quantity)
                return new ApiResponseDto<bool>(400, "Not enough equipment available");

            decimal unitPrice = equipment.RentalPrice;
            if (request.BookingId == null)
            {
                unitPrice *= 1.3m;
            }

            equipment.RentalStock -= request.Quantity;
            await _equipmentRepository.UpdateEquipmentAsync(equipment);

            var rental = new EquipmentRental
            {
                EquipmentId = request.EquipmentId,
                BookingId = request.BookingId,
                UserId = userId,
                Quantity = request.Quantity,
                UnitPrice = unitPrice,
                DepositAmount = EquipmentRentalRules.CalculateDeposit(equipment.RetailPrice, request.Quantity),
                DepositStatus = "Held",
                RentalStatus = "Rented",
                RentedAt = DateTime.UtcNow
            };

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
                    break;

                case "Lost":
                    var replacementCost = rental.Equipment.RetailPrice * rental.Quantity;
                    rental.DamageFee = replacementCost;
                    rental.DepositRefundAmount = Math.Max(0, rental.DepositAmount - replacementCost);
                    rental.AdditionalCharge = Math.Max(0, replacementCost - rental.DepositAmount);
                    rental.DepositStatus = "Deducted";
                    break;
            }

            await _equipmentRepository.UpdateRentalAsync(rental);

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

    private static EquipmentDto MapEquipmentDto(Equipment e) => new()
    {
        EquipmentId = e.EquipmentId,
        Name = e.EquipmentName,
        Category = e.Category,
        Type = e.SportType,
        RetailPrice = e.RetailPrice,
        RentalPrice = e.RentalPrice,
        RentalStock = e.RentalStock,
        SalesStock = e.SalesStock,
        ImageUrl = e.ImageUrl,
        Description = e.Description
    };

    private static EquipmentRentalDto MapRentalDto(EquipmentRental r) => new()
    {
        EquipmentRentalId = r.DetailId,
        EquipmentId = r.EquipmentId,
        EquipmentName = r.Equipment.EquipmentName,
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
        RentedAt = r.RentedAt
    };
}
