namespace ProSport.Domain.Entities;

public class RentalSessionAsset
{
    public int RentalSessionAssetId { get; set; }
    public int RentalSessionId { get; set; }
    public int RentalAssetId { get; set; }
    public string BeforeCondition { get; set; } = "Good";
    public string? AfterCondition { get; set; }

    public RentalSession RentalSession { get; set; } = null!;
    public RentalAsset RentalAsset { get; set; } = null!;
}
