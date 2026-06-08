namespace ProSport.Domain.Entities;

public class Booking : BaseEntity
{
    public int BookingId { get; set; }
    public int UserId { get; set; }
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = "Pending"; // Pending, Confirmed, Cancelled, Completed
    public string? PaymentMethod { get; set; } // VNPay, Cash
    public string? PaymentStatus { get; set; } // Pending, Paid, Refunded

    // Navigation properties
    public User User { get; set; } = null!;
    public ICollection<BookingDetail> BookingDetails { get; set; } = new List<BookingDetail>();
    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}
