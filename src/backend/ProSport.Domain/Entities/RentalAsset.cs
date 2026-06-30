namespace ProSport.Domain.Entities;

public class RentalAsset : BaseEntity
{
    public int RentalAssetId { get; set; }
    public int ComplexId { get; set; }
    public int ProductStockId { get; set; }
    public string AssetCode { get; set; } = string.Empty;
    public string Condition { get; set; } = "Good";
    public string Status { get; set; } = "AVAILABLE";
    public int RentCount { get; set; }
    public DateTime? LastConditionCheck { get; set; }
    public string? MaintenanceNote { get; set; }

    public Complex Complex { get; set; } = null!;
    public ProductStock ProductStock { get; set; } = null!;
    public ICollection<RentalSessionAsset> SessionAssets { get; set; } = new List<RentalSessionAsset>();
}
