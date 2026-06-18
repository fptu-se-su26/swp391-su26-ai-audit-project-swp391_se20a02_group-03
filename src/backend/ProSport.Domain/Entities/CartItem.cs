using System.ComponentModel.DataAnnotations.Schema;

namespace ProSport.Domain.Entities;

public class CartItem : BaseEntity
{
    public int CartItemId { get; set; }
    public int UserId { get; set; }
    public int EquipmentId { get; set; }
    public int Quantity { get; set; }
    public string? PreferredSerialNumber { get; set; } // optional: user chọn unit cụ thể
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal UnitPrice { get; set; } // giá thuê tại thời điểm add
    
    public int? BookingId { get; set; } // optional: nếu user thuê kèm booking sân
    
    // Navigation
    public Equipment Equipment { get; set; } = null!;
    public User User { get; set; } = null!;
}
