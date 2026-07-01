namespace ProSport.Domain.Entities;

public class BookingPaymentShare : BaseEntity
{
    public int BookingPaymentShareId { get; set; }
    public int BookingId { get; set; }
    public int UserId { get; set; }
    public decimal Amount { get; set; }
    public string Status { get; set; } = "Pending";
    public DateTime PaymentDeadline { get; set; }
    public DateTime? PaidAt { get; set; }
    public bool IsHost { get; set; }

    public Booking Booking { get; set; } = null!;
    public User User { get; set; } = null!;
}
