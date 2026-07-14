using ProSport.Domain.Entities;

namespace ProSport.Application.Interfaces;

public interface IOrderRepository
{
    /// <summary>
    /// Tạo đơn từ giỏ hàng trong 1 transaction Serializable: kiểm tồn kho, thanh toán ví
    /// (Phase 1), trừ tồn kho atomic, xóa item khỏi giỏ. Ném InvalidOperationException nếu
    /// giỏ trống / thiếu hàng / số dư không đủ.
    /// </summary>
    Task<Order> CreateFromCartAtomicAsync(Order order);

    Task<List<Order>> GetByUserAsync(int userId);
    Task<Order?> GetByIdAsync(int orderId);
}
