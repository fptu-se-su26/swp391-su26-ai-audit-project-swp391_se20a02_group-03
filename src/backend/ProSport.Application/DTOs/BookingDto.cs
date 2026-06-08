namespace ProSport.Application.DTOs;

public class BookingDto
{
    public int BookingId { get; set; }
    public int UserId { get; set; }
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = null!;
    public string? PaymentMethod { get; set; }
    public string? PaymentStatus { get; set; }
    public List<BookingDetailDto> Details { get; set; } = new List<BookingDetailDto>();
}

public class BookingDetailDto
{
    public int CourtId { get; set; }
    public string CourtName { get; set; } = null!;
    public DateTime BookingDate { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public decimal Price { get; set; }
}

public class CreateBookingDto
{
    public int UserId { get; set; }
    public List<CreateBookingDetailDto> Details { get; set; } = new List<CreateBookingDetailDto>();
}

public class CreateBookingDetailDto
{
    public int CourtId { get; set; }
    public DateTime BookingDate { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
}
