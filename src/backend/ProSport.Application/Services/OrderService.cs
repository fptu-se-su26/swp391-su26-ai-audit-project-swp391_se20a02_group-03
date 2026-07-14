using System.Text.RegularExpressions;
using ProSport.Application.DTOs;
using ProSport.Application.Interfaces;
using ProSport.Domain.Constants;
using ProSport.Domain.Entities;

namespace ProSport.Application.Services;

public class OrderService : IOrderService
{
    // SĐT di động VN: 10 số, bắt đầu bằng 0.
    private static readonly Regex VnPhoneRegex = new(@"^0\d{9}$", RegexOptions.Compiled);

    private readonly IOrderRepository _orderRepository;
    private readonly IShippingService _shippingService;

    public OrderService(IOrderRepository orderRepository, IShippingService shippingService)
    {
        _orderRepository = orderRepository;
        _shippingService = shippingService;
    }

    public async Task<ApiResponseDto<OrderDto>> CheckoutFromCartAsync(int userId, CreateOrderDto dto)
    {
        // ── Validate phương thức thanh toán ──
        if (!OrderPaymentMethods.IsValid(dto.PaymentMethod))
            return new ApiResponseDto<OrderDto>(400, "Phương thức thanh toán không hợp lệ.");

        // Phase 1 chỉ hỗ trợ Ví Escrow; PayOS/COD sẽ có ở phase sau.
        if (dto.PaymentMethod != OrderPaymentMethods.Wallet)
            return new ApiResponseDto<OrderDto>(400, "Hiện chỉ hỗ trợ thanh toán bằng Ví Escrow. PayOS/COD sẽ sớm có.");

        // ── Validate địa chỉ giao hàng ──
        if (string.IsNullOrWhiteSpace(dto.RecipientName))
            return new ApiResponseDto<OrderDto>(400, "Vui lòng nhập tên người nhận.");
        if (string.IsNullOrWhiteSpace(dto.RecipientPhone) || !VnPhoneRegex.IsMatch(dto.RecipientPhone.Trim()))
            return new ApiResponseDto<OrderDto>(400, "Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0).");
        if (string.IsNullOrWhiteSpace(dto.AddressDetail))
            return new ApiResponseDto<OrderDto>(400, "Vui lòng nhập địa chỉ chi tiết (số nhà, đường).");
        if (dto.ProvinceId <= 0)
            return new ApiResponseDto<OrderDto>(400, "Vui lòng chọn Tỉnh/Thành phố.");
        if (dto.DistrictId <= 0)
            return new ApiResponseDto<OrderDto>(400, "Vui lòng chọn Quận/Huyện.");
        if (string.IsNullOrWhiteSpace(dto.WardCode))
            return new ApiResponseDto<OrderDto>(400, "Vui lòng chọn Phường/Xã.");

        var order = new Order
        {
            UserId = userId,
            PaymentMethod = dto.PaymentMethod,
            RecipientName = dto.RecipientName.Trim(),
            RecipientPhone = dto.RecipientPhone.Trim(),
            ProvinceId = dto.ProvinceId,
            ProvinceName = dto.ProvinceName?.Trim() ?? string.Empty,
            DistrictId = dto.DistrictId,
            DistrictName = dto.DistrictName?.Trim() ?? string.Empty,
            WardCode = dto.WardCode?.Trim() ?? string.Empty,
            WardName = dto.WardName?.Trim() ?? string.Empty,
            AddressDetail = dto.AddressDetail.Trim(),
            Note = dto.Note?.Trim(),
            ShippingProvider = "GHN",
            ShippingStatus = ShippingStatuses.Pending
        };

        // Phí ship tính trước khi thanh toán (GHN hoặc mock) — cộng vào tổng đơn.
        order.ShippingFee = await _shippingService.CalculateFeeAsync(order.DistrictId, order.WardCode);

        Order created;
        try
        {
            created = await _orderRepository.CreateFromCartAtomicAsync(order);
        }
        catch (InvalidOperationException ex)
        {
            return new ApiResponseDto<OrderDto>(400, ex.Message);
        }

        // Tạo vận đơn ở hãng ship (best-effort — đơn đã thanh toán vẫn giữ, ship có thể retry sau).
        var shipment = await _shippingService.CreateShipmentAsync(created);
        if (shipment.Success && !string.IsNullOrWhiteSpace(shipment.TrackingCode))
        {
            await _orderRepository.SetTrackingAsync(created.OrderId, shipment.TrackingCode, ShippingStatuses.Created);
            created.TrackingCode = shipment.TrackingCode;
            created.ShippingStatus = ShippingStatuses.Created;
        }

        return new ApiResponseDto<OrderDto>(201, "Đặt hàng thành công.", Map(created));
    }

    public async Task<ApiResponseDto<List<OrderDto>>> GetMyOrdersAsync(int userId)
    {
        var orders = await _orderRepository.GetByUserAsync(userId);
        return new ApiResponseDto<List<OrderDto>>(200, "Success", orders.Select(Map).ToList());
    }

    public async Task<ApiResponseDto<OrderDto>> GetByIdAsync(int userId, int orderId, bool isAdmin)
    {
        var order = await _orderRepository.GetByIdAsync(orderId);
        if (order == null)
            return new ApiResponseDto<OrderDto>(404, "Không tìm thấy đơn hàng.");
        if (order.UserId != userId && !isAdmin)
            return new ApiResponseDto<OrderDto>(403, "Bạn không có quyền xem đơn hàng này.");
        return new ApiResponseDto<OrderDto>(200, "Success", Map(order));
    }

    private static OrderDto Map(Order o) => new()
    {
        OrderId = o.OrderId,
        UserId = o.UserId,
        Status = o.Status,
        PaymentMethod = o.PaymentMethod,
        PaymentStatus = o.PaymentStatus,
        Subtotal = o.Subtotal,
        ShippingFee = o.ShippingFee,
        TotalAmount = o.TotalAmount,
        RecipientName = o.RecipientName,
        RecipientPhone = o.RecipientPhone,
        ProvinceName = o.ProvinceName,
        DistrictName = o.DistrictName,
        WardName = o.WardName,
        AddressDetail = o.AddressDetail,
        Note = o.Note,
        ShippingProvider = o.ShippingProvider,
        TrackingCode = o.TrackingCode,
        ShippingStatus = o.ShippingStatus,
        PaymentReference = o.PaymentReference,
        CreatedAt = o.CreatedAt,
        Items = o.Items.Select(i => new OrderItemDto
        {
            OrderItemId = i.OrderItemId,
            EquipmentId = i.EquipmentId,
            EquipmentName = i.EquipmentName,
            Quantity = i.Quantity,
            UnitPrice = i.UnitPrice,
            LineTotal = i.Quantity * i.UnitPrice
        }).ToList()
    };
}
