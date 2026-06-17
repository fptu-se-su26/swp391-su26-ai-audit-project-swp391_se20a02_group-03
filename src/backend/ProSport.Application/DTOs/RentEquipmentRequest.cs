namespace ProSport.Application.DTOs;

public class RentEquipmentRequest
{
    public int EquipmentId { get; set; }
    public int? BookingId { get; set; }
    public int Quantity { get; set; }
}
