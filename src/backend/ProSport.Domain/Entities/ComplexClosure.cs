namespace ProSport.Domain.Entities;

public class ComplexClosure : BaseEntity
{
    public int ComplexClosureId { get; set; }
    public int ComplexId { get; set; }
    public DateTime ClosureDate { get; set; }
    public string? Reason { get; set; }

    public Complex Complex { get; set; } = null!;
}
