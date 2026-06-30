namespace ProSport.Domain.Entities;

public class ComplexCancellationPolicy : BaseEntity
{
    public int ComplexCancellationPolicyId { get; set; }
    public int ComplexId { get; set; }
    public int FullRefundHoursBefore { get; set; } = 48;
    public int PartialRefundHoursBefore { get; set; } = 24;
    public decimal PartialRefundPercent { get; set; } = 50m;
    public decimal PenaltyPercentAfterPartial { get; set; } = 80m;
    public bool WeatherFullRefundEnabled { get; set; } = true;

    public Complex Complex { get; set; } = null!;
}
