using Microsoft.Extensions.Logging;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using ProSport.Domain.Entities;

namespace ProSport.Application.Services;

public class EquipmentRentalService : IEquipmentRentalService
{
    private const string WalkInGuestEmail = "walkin@prosport.vn";

    private readonly IEquipmentRentalRepository _rentalRepository;
    private readonly IEquipmentRepository _equipmentRepository;
    private readonly IBookingRepository _bookingRepository;
    private readonly IUserRepository _userRepository;
    private readonly ILogger<EquipmentRentalService> _logger;

    public EquipmentRentalService(
        IEquipmentRentalRepository rentalRepository,
        IEquipmentRepository equipmentRepository,
        IBookingRepository bookingRepository,
        IUserRepository userRepository,
        ILogger<EquipmentRentalService> logger)
    {
        _rentalRepository = rentalRepository;
        _equipmentRepository = equipmentRepository;
        _bookingRepository = bookingRepository;
        _userRepository = userRepository;
        _logger = logger;
    }

    public async Task<ApiResponseDto<IEnumerable<EquipmentRentalDto>>> GetRentalsAsync(string? status = null)
    {
        try
        {
            var rentals = await _rentalRepository.GetAllAsync(status);
            return new ApiResponseDto<IEnumerable<EquipmentRentalDto>>(200, "Success", rentals.Select(MapDto));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting equipment rentals");
            return new ApiResponseDto<IEnumerable<EquipmentRentalDto>>(500, "An unexpected error occurred.");
        }
    }

    public async Task<ApiResponseDto<EquipmentRentalDto>> RentAtCounterAsync(StaffRentEquipmentRequest request, int staffId)
    {
        try
        {
            if (request.Quantity < 1)
                return new ApiResponseDto<EquipmentRentalDto>(400, "Số lượng phải lớn hơn 0.");

            var equipment = await _equipmentRepository.GetByIdAsync(request.EquipmentId);
            if (equipment == null || equipment.IsDeleted)
                return new ApiResponseDto<EquipmentRentalDto>(404, "Không tìm thấy thiết bị.");
            if (equipment.Status != "Available")
                return new ApiResponseDto<EquipmentRentalDto>(400, "Thiết bị không khả dụng để cho thuê.");
            if (equipment.StockQuantity < request.Quantity)
                return new ApiResponseDto<EquipmentRentalDto>(400, $"Chỉ còn {equipment.StockQuantity} sản phẩm trong kho.");

            int userId;
            if (request.BookingId.HasValue)
            {
                var booking = await _bookingRepository.GetByIdAsync(request.BookingId.Value);
                if (booking == null)
                    return new ApiResponseDto<EquipmentRentalDto>(404, "Không tìm thấy booking.");
                userId = booking.UserId;
            }
            else if (request.CustomerUserId.HasValue)
            {
                userId = request.CustomerUserId.Value;
            }
            else if (!string.IsNullOrWhiteSpace(request.CustomerEmail))
            {
                var user = await _userRepository.GetByEmailAsync(request.CustomerEmail.Trim());
                if (user == null)
                    return new ApiResponseDto<EquipmentRentalDto>(404, $"Không tìm thấy tài khoản {request.CustomerEmail}.");
                userId = user.UserId;
            }
            else
            {
                var guest = await _userRepository.GetByEmailAsync(WalkInGuestEmail);
                if (guest == null)
                    return new ApiResponseDto<EquipmentRentalDto>(500, "Chưa cấu hình tài khoản khách lẻ walkin@prosport.vn.");
                userId = guest.UserId;
            }

            var unitPrice = EquipmentPricing.GetRentalPricePerHour(equipment.RetailPrice);
            var deposit = unitPrice * request.Quantity;

            var rental = new BookingDetailEquipment
            {
                BookingId = request.BookingId,
                UserId = userId,
                EquipmentId = equipment.EquipmentId,
                Quantity = request.Quantity,
                UnitPrice = unitPrice,
                DepositAmount = deposit,
                DepositStatus = "Held",
                RentalStatus = "Rented",
                RentedAt = DateTime.UtcNow
            };

            equipment.StockQuantity -= request.Quantity;
            if (equipment.StockQuantity <= 0)
            {
                equipment.StockQuantity = 0;
                equipment.Status = "Out of Stock";
            }

            var created = await _rentalRepository.CreateWithStockDecrementAsync(rental, equipment);

            _logger.LogInformation("Staff {StaffId} rented equipment {EquipmentId} x{Qty} for user {UserId}",
                staffId, equipment.EquipmentId, request.Quantity, userId);

            return new ApiResponseDto<EquipmentRentalDto>(201, "Cho thuê thiết bị thành công.", MapDto(created));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error renting equipment at counter by staff {StaffId}", staffId);
            return new ApiResponseDto<EquipmentRentalDto>(500, "An unexpected error occurred.");
        }
    }

    public async Task<ApiResponseDto<EquipmentRentalDto>> ReturnEquipmentAsync(int detailId, ReturnEquipmentRequest request, int staffId)
    {
        try
        {
            var rental = await _rentalRepository.GetByIdAsync(detailId);
            if (rental == null)
                return new ApiResponseDto<EquipmentRentalDto>(404, "Không tìm thấy phiên thuê.");
            if (rental.RentalStatus != "Rented")
                return new ApiResponseDto<EquipmentRentalDto>(400, "Thiết bị đã được trả trước đó.");

            var condition = string.IsNullOrWhiteSpace(request.ReturnCondition) ? "Good" : request.ReturnCondition.Trim();
            rental.RentalStatus = "Returned";
            rental.ReturnCondition = condition;
            rental.DamageNote = request.DamageNote?.Trim();
            rental.DamageFee = request.DamageFee;

            if (condition.Equals("Damaged", StringComparison.OrdinalIgnoreCase) || condition.Equals("Lost", StringComparison.OrdinalIgnoreCase))
            {
                var repairCost = request.DamageFee ?? rental.DepositAmount;
                rental.DepositStatus = "Forfeited";
                rental.DepositRefundAmount = 0;
                // Deposit covers up to repairCost; only bill the delta beyond forfeited deposit.
                rental.AdditionalCharge = Math.Max(0m, repairCost - rental.DepositAmount);
            }
            else
            {
                rental.DepositStatus = "Refunded";
                rental.DepositRefundAmount = rental.DepositAmount;
                rental.AdditionalCharge = 0;
            }

            var equipment = await _equipmentRepository.GetByIdAsync(rental.EquipmentId);
            if (equipment != null)
            {
                equipment.StockQuantity += rental.Quantity;
                if (equipment.Status == "Out of Stock" && equipment.StockQuantity > 0)
                    equipment.Status = "Available";
                await _equipmentRepository.UpdateAsync(equipment);
            }

            await _rentalRepository.UpdateAsync(rental);

            _logger.LogInformation("Staff {StaffId} returned rental {DetailId} condition {Condition}",
                staffId, detailId, condition);

            var reloaded = await _rentalRepository.GetByIdAsync(detailId);
            return new ApiResponseDto<EquipmentRentalDto>(200, "Đã nhận trả thiết bị.", MapDto(reloaded!));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error returning equipment rental {DetailId}", detailId);
            return new ApiResponseDto<EquipmentRentalDto>(500, "An unexpected error occurred.");
        }
    }

    private static EquipmentRentalDto MapDto(BookingDetailEquipment r) => new()
    {
        DetailId = r.DetailId,
        BookingId = r.BookingId,
        UserId = r.UserId,
        CustomerName = r.User?.FullName,
        EquipmentId = r.EquipmentId,
        EquipmentName = r.Equipment?.Name ?? r.Equipment?.EquipmentName ?? $"#{r.EquipmentId}",
        Quantity = r.Quantity,
        UnitPrice = r.UnitPrice,
        Subtotal = r.UnitPrice * r.Quantity,
        DepositAmount = r.DepositAmount,
        RentalStatus = r.RentalStatus,
        ReturnCondition = r.ReturnCondition,
        DamageNote = r.DamageNote,
        RentedAt = r.RentedAt
    };
}
