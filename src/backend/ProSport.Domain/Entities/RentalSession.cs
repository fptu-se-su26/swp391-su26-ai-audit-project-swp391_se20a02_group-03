namespace ProSport.Domain.Entities;

public class RentalSession : BaseEntity
{
    public int RentalSessionId { get; set; }
    public int ComplexId { get; set; }
    public int? BookingId { get; set; }
    public int CustomerUserId { get; set; }
    public int? StaffUserId { get; set; }
    public string Status { get; set; } = "Active";
    public decimal RentalFee { get; set; }
    public decimal SurchargeTotal { get; set; }
    public DateTime? CompletedAt { get; set; }

    public Complex Complex { get; set; } = null!;
    public Booking? Booking { get; set; }
    public User Customer { get; set; } = null!;
    public User? Staff { get; set; }
    public ICollection<RentalSessionAsset> SessionAssets { get; set; } = new List<RentalSessionAsset>();
    public ICollection<ConditionCheck> ConditionChecks { get; set; } = new List<ConditionCheck>();
    public ICollection<RentalSurcharge> Surcharges { get; set; } = new List<RentalSurcharge>();
}
