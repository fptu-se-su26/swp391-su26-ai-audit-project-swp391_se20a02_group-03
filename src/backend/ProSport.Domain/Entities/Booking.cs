namespace ProSport.Domain.Entities;

public class Booking : BaseEntity
{
    public int BookingId { get; set; }
    public int UserId { get; set; }
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = "Pending"; // Pending, Confirmed, Cancelled, Completed
    public string? PaymentMethod { get; set; } // VNPay, Cash
    public string? PaymentStatus { get; set; } // Pending, Paid, Refunded
    public string? CheckInCode { get; set; } // Mã QR để Staff quét check-in
    public decimal CancellationFee { get; set; } = 0; // Phí phạt khi hủy sân
    public DateTime? PaymentDeadline { get; set; } // Hạn thanh toán (VD: 15 phút), quá hạn sẽ tự hủy
    public bool IsSplitPayment { get; set; }
    public DateTime? SplitPaymentDeadline { get; set; }
    public int? RecurringRuleId { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
    public RecurringBookingRule? RecurringRule { get; set; }
    public ICollection<BookingDetail> BookingDetails { get; set; } = new List<BookingDetail>();
    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    public ICollection<BookingPaymentShare> PaymentShares { get; set; } = new List<BookingPaymentShare>();
    public CheckIn? CheckIn { get; set; }
}
