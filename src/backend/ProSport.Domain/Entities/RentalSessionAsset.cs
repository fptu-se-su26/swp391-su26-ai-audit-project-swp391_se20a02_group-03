namespace ProSport.Domain.Entities;

public class RentalSessionAsset
{
    public int RentalSessionAssetId { get; set; }
    public int RentalSessionId { get; set; }
    public int RentalAssetId { get; set; }
    public string BeforeCondition { get; set; } = "Good";
    public string? AfterCondition { get; set; }

    /// <summary>Đơn giá thuê tại thời điểm giao dịch (hóa đơn chi tiết).</summary>
    public decimal RentalPriceAtTime { get; set; }

    public RentalSession RentalSession { get; set; } = null!;
    public RentalAsset RentalAsset { get; set; } = null!;
}
