using System.ComponentModel.DataAnnotations;

namespace ProSport.Application.DTOs
{
    public class UpdateCourtDto
    {
        // Optional fields – if null, the existing value is kept
        public string? Name { get; set; }
        public int? CourtTypeId { get; set; }
        public string? ImageUrl { get; set; }
        public string? Description { get; set; }
        public string? Status { get; set; }
    }
}
