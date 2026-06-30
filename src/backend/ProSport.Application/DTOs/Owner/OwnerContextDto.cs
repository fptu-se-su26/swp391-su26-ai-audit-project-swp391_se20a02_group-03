namespace ProSport.Application.DTOs.Owner;

public class OwnerContextDto
{
    public OwnerUserDto User { get; set; } = null!;
    public string Role { get; set; } = null!;
    public int? DefaultComplexId { get; set; }
    public ComplexDto? CurrentComplex { get; set; }
    public List<ComplexDto> ManagedComplexes { get; set; } = new();
}

public class OwnerUserDto
{
    public int UserId { get; set; }
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
}

public class ComplexDto
{
    public int ComplexId { get; set; }
    public string Name { get; set; } = null!;
    public string? Address { get; set; }
    public string? LogoUrl { get; set; }
    public bool IsPrimary { get; set; }
}
