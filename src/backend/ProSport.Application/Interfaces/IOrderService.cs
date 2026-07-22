using ProSport.Application.DTOs;

namespace ProSport.Application.Interfaces;

public interface IOrderService
{
    Task<ApiResponseDto<OrderDto>> CheckoutFromCartAsync(int userId, CreateOrderDto dto);
    Task<ApiResponseDto<List<OrderDto>>> GetMyOrdersAsync(int userId);
    Task<ApiResponseDto<OrderDto>> GetByIdAsync(int userId, int orderId, bool isAdmin);

    /// <summary>Webhook PayOS xác nhận thanh toán: đánh dấu Paid + tạo vận đơn GHN (idempotent).</summary>
    Task<ApiResponseDto<bool>> ConfirmPayOsPaymentAsync(int orderCode, decimal amount);
}
