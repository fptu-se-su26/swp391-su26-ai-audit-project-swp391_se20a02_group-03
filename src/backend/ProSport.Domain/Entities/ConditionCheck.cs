namespace ProSport.Domain.Entities;

public class ConditionCheck
{
    public int ConditionCheckId { get; set; }
    public int RentalSessionId { get; set; }
    public int RentalAssetId { get; set; }
    public string CheckType { get; set; } = "Before";
    public string Condition { get; set; } = "Good";
    public string? ImageUrls { get; set; }
    public string? Notes { get; set; }
    public int StaffUserId { get; set; }
    public bool IsFinal { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public RentalSession RentalSession { get; set; } = null!;
    public RentalAsset RentalAsset { get; set; } = null!;
    public User Staff { get; set; } = null!;
}
