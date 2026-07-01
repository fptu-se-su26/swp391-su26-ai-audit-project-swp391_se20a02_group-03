namespace ProSport.Application.DTOs;

public class CourtDto
{
    public int CourtId { get; set; }
    public string Name { get; set; } = null!;
    public string? Code { get; set; }
    public int? ComplexId { get; set; }
    public string CourtTypeName { get; set; } = null!;
    public string Status { get; set; } = null!;
    public string? ImageUrl { get; set; }
    public string? Description { get; set; }
    public decimal PricePerHour { get; set; }
}

public class CourtAvailabilityDto
{
    public int CourtId { get; set; }
    public string Date { get; set; } = null!;
    public int SlotDurationMinutes { get; set; } = 60;
    public bool IsClosed { get; set; }
    public List<string> Slots { get; set; } = new();
    public List<string> BookedSlots { get; set; } = new();
}

public class CreateCourtDto
{
    public string Name { get; set; } = null!;
    public int CourtTypeId { get; set; }
    public string? ImageUrl { get; set; }
    public string? Description { get; set; }
}
