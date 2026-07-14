using Microsoft.EntityFrameworkCore;
using ProSport.Application.Interfaces;
using ProSport.Domain.Constants;
using ProSport.Domain.Entities;
using ProSport.Infrastructure.Data;

namespace ProSport.Infrastructure.Repositories;

public class OrderRepository : IOrderRepository
{
    private readonly ProSportDbContext _context;
    private readonly IEscrowRepository _escrowRepository;

    public OrderRepository(ProSportDbContext context, IEscrowRepository escrowRepository)
    {
        _context = context;
        _escrowRepository = escrowRepository;
    }

    public async Task<Order> CreateFromCartAtomicAsync(Order order)
    {
        await using var tx = await _context.Database.BeginTransactionAsync(System.Data.IsolationLevel.Serializable);
        try
        {
            // Chỉ lấy item mua lẻ (không gắn booking) để tạo đơn shop giao hàng.
            var items = await _context.CartItems
                .Where(ci => ci.UserId == order.UserId && ci.BookingId == null && !ci.IsDeleted)
                .Include(ci => ci.Equipment)
                .ToListAsync();

            if (items.Count == 0)
                throw new InvalidOperationException("Giỏ hàng trống.");

            foreach (var item in items)
            {
                if (item.Equipment == null)
                    throw new InvalidOperationException("Thiết bị trong giỏ không tồn tại.");
                if (item.Equipment.StockQuantity < item.Quantity)
                {
                    var n = item.Equipment.EquipmentName ?? item.Equipment.Name ?? $"#{item.EquipmentId}";
                    throw new InvalidOperationException($"Chỉ còn {item.Equipment.StockQuantity} {n} sẵn sàng.");
                }
            }

            var subtotal = items.Sum(i => i.Quantity * i.UnitPrice);
            order.Subtotal = subtotal;
            // Phase 1: chưa tính phí ship (GHN ở Phase 2). Tổng = subtotal.
            order.TotalAmount = subtotal + order.ShippingFee;

            order.Items = items.Select(i => new OrderItem
            {
                EquipmentId = i.EquipmentId,
                EquipmentName = i.Equipment!.EquipmentName ?? i.Equipment.Name ?? $"#{i.EquipmentId}",
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice,
                CreatedAt = DateTime.UtcNow
            }).ToList();

            // Thanh toán — Phase 1 chỉ Ví Escrow (PayOS/COD chặn ở tầng service).
            if (order.PaymentMethod == OrderPaymentMethods.Wallet)
            {
                var refId = $"Order_U{order.UserId}_{Guid.NewGuid():N}";
                var paid = await _escrowRepository.PayEquipmentPurchaseAsync(
                    order.UserId, order.TotalAmount, null, refId, "Thanh toán đơn hàng cửa hàng");
                if (!paid)
                    throw new InvalidOperationException("Số dư ví không đủ để thanh toán đơn hàng.");

                order.PaymentReference = refId;
                order.PaymentStatus = PaymentStatus.Paid;
                order.Status = OrderStatuses.Paid;
            }

            // Trừ tồn kho atomic + xóa item khỏi giỏ.
            foreach (var item in items)
            {
                var qty = item.Quantity;
                var eqId = item.EquipmentId;

                if (_context.Database.IsRelational())
                {
                    var rows = await _context.Equipments
                        .Where(e => e.EquipmentId == eqId && !e.IsDeleted && e.StockQuantity >= qty)
                        .ExecuteUpdateAsync(s => s.SetProperty(e => e.StockQuantity, e => e.StockQuantity - qty));
                    if (rows == 0)
                        throw new InvalidOperationException($"Không đủ hàng cho {item.Equipment!.EquipmentName ?? $"#{eqId}"}.");
                }
                else
                {
                    var eq = await _context.Equipments.FirstAsync(e => e.EquipmentId == eqId);
                    if (eq.StockQuantity < qty)
                        throw new InvalidOperationException($"Không đủ hàng cho {eq.EquipmentName ?? $"#{eqId}"}.");
                    eq.StockQuantity -= qty;
                }

                item.IsDeleted = true;
                item.UpdatedAt = DateTime.UtcNow;
            }

            order.CreatedAt = DateTime.UtcNow;
            _context.Orders.Add(order);

            await _context.SaveChangesAsync();
            await tx.CommitAsync();
            return order;
        }
        catch
        {
            await tx.RollbackAsync();
            throw;
        }
    }

    public async Task<List<Order>> GetByUserAsync(int userId)
    {
        return await _context.Orders.AsNoTracking()
            .Include(o => o.Items)
            .Where(o => o.UserId == userId && !o.IsDeleted)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
    }

    public async Task<Order?> GetByIdAsync(int orderId)
    {
        return await _context.Orders.AsNoTracking()
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.OrderId == orderId && !o.IsDeleted);
    }
}
