using Microsoft.Extensions.Logging;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using ProSport.Domain.Entities;

namespace ProSport.Application.Services;

public class BookingService : IBookingService
{
    private readonly IBookingRepository _bookingRepository;
    private readonly ICourtRepository _courtRepository;
    private readonly ILogger<BookingService> _logger;

    public BookingService(IBookingRepository bookingRepository, ICourtRepository courtRepository, ILogger<BookingService> logger)
    {
        _bookingRepository = bookingRepository;
        _courtRepository = courtRepository;
        _logger = logger;
    }

    public async Task<ApiResponseDto<IEnumerable<BookingDto>>> GetAllBookingsAsync()
    {
        try
        {
            var bookings = await _bookingRepository.GetAllAsync();
            return new ApiResponseDto<IEnumerable<BookingDto>>(200, "Success", MapToDtos(bookings));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all bookings");
            return new ApiResponseDto<IEnumerable<BookingDto>>(500, "An unexpected error occurred.");
        }
    }

    public async Task<ApiResponseDto<BookingDto>> GetBookingByIdAsync(int bookingId)
    {
        try
        {
            var booking = await _bookingRepository.GetByIdAsync(bookingId);
            if (booking == null) return new ApiResponseDto<BookingDto>(404, "Booking not found");

            return new ApiResponseDto<BookingDto>(200, "Success", MapToDto(booking));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting booking by id: {BookingId}", bookingId);
            return new ApiResponseDto<BookingDto>(500, "An unexpected error occurred.");
        }
    }

    public async Task<ApiResponseDto<IEnumerable<BookingDto>>> GetUserBookingsAsync(int userId)
    {
        try
        {
            var bookings = await _bookingRepository.GetByUserIdAsync(userId);
            return new ApiResponseDto<IEnumerable<BookingDto>>(200, "Success", MapToDtos(bookings));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting bookings for user: {UserId}", userId);
            return new ApiResponseDto<IEnumerable<BookingDto>>(500, "An unexpected error occurred.");
        }
    }

    public async Task<ApiResponseDto<BookingDto>> CreateBookingAsync(CreateBookingDto dto)
    {
        try
        {
            decimal totalAmount = 0;
            var details = new List<BookingDetail>();

            foreach (var d in dto.Details)
            {
                var court = await _courtRepository.GetByIdAsync(d.CourtId);
                if (court == null || court.Status != "Available")
                    return new ApiResponseDto<BookingDto>(400, $"Court {d.CourtId} is not available.");

                // Kiểm tra trùng lịch
                var availableCourts = await _courtRepository.GetAvailableCourtsAsync(d.BookingDate, d.StartTime, d.EndTime);
                var isAvailable = availableCourts.Any(c => c.CourtId == d.CourtId);

                if (!isAvailable)
                    return new ApiResponseDto<BookingDto>(400, $"Court {d.CourtId} is already booked at {d.StartTime} - {d.EndTime}");

                // Tính giá dựa trên PricingRule
                var price = CalculatePrice(court, d.BookingDate, d.StartTime, d.EndTime);
                totalAmount += price;

                details.Add(new BookingDetail
                {
                    CourtId = d.CourtId,
                    BookingDate = d.BookingDate,
                    StartTime = d.StartTime,
                    EndTime = d.EndTime,
                    Price = price
                });
            }

            var booking = new Booking
            {
                UserId = dto.UserId,
                TotalAmount = totalAmount,
                Status = "Pending",
                PaymentMethod = "VNPay",
                PaymentStatus = "Pending",
                BookingDetails = details
            };

            var created = await _bookingRepository.CreateAsync(booking);
            return new ApiResponseDto<BookingDto>(201, "Booking created", MapToDto(created));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating booking for user: {UserId}", dto.UserId);
            return new ApiResponseDto<BookingDto>(500, "An unexpected error occurred.");
        }
    }

    /// <summary>
    /// Tính giá sân dựa trên PricingRule. Nếu không có rule phù hợp, fallback về 100.000đ/giờ.
    /// </summary>
    private static decimal CalculatePrice(Court court, DateTime bookingDate, TimeSpan startTime, TimeSpan endTime)
    {
        var hours = (decimal)(endTime - startTime).TotalHours;
        bool isWeekend = bookingDate.DayOfWeek == DayOfWeek.Saturday || bookingDate.DayOfWeek == DayOfWeek.Sunday;

        if (court.PricingRules != null && court.PricingRules.Any())
        {
            // Tìm PricingRule phù hợp: cùng loại ngày (weekend/weekday) và khung giờ trùng
            var matchingRule = court.PricingRules
                .Where(r => r.IsWeekend == isWeekend && !r.IsDeleted)
                .Where(r => r.StartTime <= startTime && r.EndTime >= endTime)
                .OrderByDescending(r => r.PricePerHour)
                .FirstOrDefault();

            if (matchingRule != null)
                return hours * matchingRule.PricePerHour;
        }

        // Fallback: 100.000đ/giờ nếu chưa cấu hình PricingRule
        return hours * 100000m;
    }

    private static IEnumerable<BookingDto> MapToDtos(IEnumerable<Booking> bookings)
    {
        return bookings.Select(MapToDto);
    }

    private static BookingDto MapToDto(Booking booking)
    {
        return new BookingDto
        {
            BookingId = booking.BookingId,
            UserId = booking.UserId,
            TotalAmount = booking.TotalAmount,
            Status = booking.Status,
            PaymentMethod = booking.PaymentMethod,
            PaymentStatus = booking.PaymentStatus,
            Details = booking.BookingDetails.Select(bd => new BookingDetailDto
            {
                CourtId = bd.CourtId,
                CourtName = bd.Court?.Name ?? "Unknown",
                BookingDate = bd.BookingDate,
                StartTime = bd.StartTime,
                EndTime = bd.EndTime,
                Price = bd.Price
            }).ToList()
        };
    }
}
