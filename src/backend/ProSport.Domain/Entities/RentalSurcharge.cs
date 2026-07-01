namespace ProSport.Domain.Entities;

public class RentalSurcharge
{
    public int RentalSurchargeId { get; set; }
    public int RentalSessionId { get; set; }
    public decimal Amount { get; set; }
    public string Reason { get; set; } = string.Empty;
    public int AppliedByUserId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public RentalSession RentalSession { get; set; } = null!;
    public User AppliedBy { get; set; } = null!;
}
