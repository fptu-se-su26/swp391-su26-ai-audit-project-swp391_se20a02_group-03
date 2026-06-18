namespace ProSport.Application.DTOs;

public class EquipmentQueryParameters
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public int? CategoryId { get; set; }
    public string? SearchQuery { get; set; }
    public string? Status { get; set; }
}
