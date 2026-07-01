namespace ProSport.Domain.Entities;

public class Membership : BaseEntity
{
    public int MembershipId { get; set; }
    public int UserId { get; set; }
    public int ComplexId { get; set; }
    public string Tier { get; set; } = "Standard";
    public decimal DiscountPercent { get; set; } = 10m;
    public DateTime ValidFrom { get; set; }
    public DateTime ValidTo { get; set; }
    public string Status { get; set; } = "Active";

    public User User { get; set; } = null!;
    public Complex Complex { get; set; } = null!;
}
