using System.ComponentModel.DataAnnotations.Schema;

namespace ProSport.Domain.Entities;

public class OrderItem : BaseEntity
{
    public int OrderItemId { get; set; }
    public int OrderId { get; set; }
    public int EquipmentId { get; set; }

    /// <summary>Snapshot tên sản phẩm tại thời điểm mua (không đổi khi Equipment bị sửa/xóa).</summary>
    public string EquipmentName { get; set; } = string.Empty;

    public int Quantity { get; set; }

    [Column(TypeName = "decimal(18,2)")] public decimal UnitPrice { get; set; }

    public Order Order { get; set; } = null!;
    public Equipment Equipment { get; set; } = null!;
}
