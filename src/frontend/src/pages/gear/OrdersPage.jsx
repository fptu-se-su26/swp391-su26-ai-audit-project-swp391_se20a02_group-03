import React, { useEffect, useState } from 'react';
import { orderApi } from '../../api/orderApi';
import GearLayout from '../../layouts/GearLayout';
import PageLoader from '../../components/ui/PageLoader';
import BaseCard from '../../components/ui/BaseCard';
import BaseButton from '../../components/ui/BaseButton';
import { Package, Truck, MapPin } from 'lucide-react';

const formatVND = (a) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(a || 0);

const STATUS_LABEL = {
  Pending: { text: 'Chờ thanh toán', cls: 'text-orange-600 border-orange-200 bg-orange-50' },
  Paid: { text: 'Đã thanh toán', cls: 'text-[#14b8a6] border-teal-200 bg-teal-50' },
  Processing: { text: 'Đang xử lý', cls: 'text-gray-600 border-gray-200 bg-gray-50' },
  Shipped: { text: 'Đang giao', cls: 'text-gray-600 border-gray-200 bg-gray-50' },
  Delivered: { text: 'Đã giao', cls: 'text-[#14b8a6] border-teal-200 bg-teal-50' },
  Cancelled: { text: 'Đã hủy', cls: 'text-red-500 border-red-200 bg-red-50' },
};

const PAYMENT_LABEL = { Wallet: 'Ví Escrow', COD: 'COD', PayOS: 'PayOS' };

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    orderApi.myOrders()
      .then((r) => setOrders(r.data || []))
      .catch((e) => setError(typeof e === 'string' ? e : 'Không tải được đơn hàng.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <GearLayout><PageLoader message="Đang tải đơn hàng..." /></GearLayout>;

  return (
    <GearLayout>
      <div className="font-sans bg-[#F8F9FA] min-h-screen -m-6 md:-m-10 p-6 md:p-10">
        <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-[#0f172a] mb-8">Đơn hàng của tôi</h1>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        {!orders.length ? (
          <BaseCard density="comfortable" className="text-center">
            <Package size={32} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-6 text-sm">Bạn chưa có đơn hàng nào.</p>
            <BaseButton to="/gear/catalog" variant="primary">Mua sắm ngay</BaseButton>
          </BaseCard>
        ) : (
          <div className="flex flex-col gap-5">
            {orders.map((o) => {
              const st = STATUS_LABEL[o.status] || STATUS_LABEL.Pending;
              return (
                <BaseCard key={o.orderId} density="comfortable" noPad>
                  <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-3">
                      <span className="font-heading text-lg text-[#0f172a]">Đơn #{o.orderId}</span>
                      <span className={`text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border ${st.cls}`}>{st.text}</span>
                    </div>
                    <span className="text-[12px] font-bold text-gray-400">{new Date(o.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>

                  <div className="p-5 grid md:grid-cols-2 gap-5">
                    <div>
                      <div className="space-y-1.5 mb-4">
                        {o.items.map((it) => (
                          <div key={it.orderItemId} className="flex justify-between text-sm gap-2">
                            <span className="text-[#0f172a] truncate">{it.equipmentName} × {it.quantity}</span>
                            <span className="text-gray-500 whitespace-nowrap">{formatVND(it.lineTotal)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="text-sm space-y-1 border-t border-gray-100 pt-3">
                        <div className="flex justify-between"><span className="text-gray-400">Tạm tính</span><span>{formatVND(o.subtotal)}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Phí ship</span><span>{formatVND(o.shippingFee)}</span></div>
                        <div className="flex justify-between font-bold text-[#0f172a]"><span>Tổng</span><span>{formatVND(o.totalAmount)}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Thanh toán</span><span>{PAYMENT_LABEL[o.paymentMethod] || o.paymentMethod} · {o.paymentStatus}</span></div>
                      </div>
                    </div>

                    <div className="text-sm">
                      <p className="flex items-start gap-2 text-[#0f172a] mb-2">
                        <MapPin size={15} className="shrink-0 mt-0.5 text-gray-400" />
                        <span>{o.recipientName} · {o.recipientPhone}<br />
                          <span className="text-gray-500">{o.addressDetail}, {o.wardName}, {o.districtName}, {o.provinceName}</span></span>
                      </p>
                      <p className="flex items-center gap-2 text-[#0f172a] mt-3">
                        <Truck size={15} className="text-gray-400" />
                        {o.trackingCode
                          ? <span>Mã vận đơn <strong>{o.trackingCode}</strong> ({o.shippingProvider}) · {o.shippingStatus}</span>
                          : <span className="text-gray-400">Chưa tạo vận đơn</span>}
                      </p>
                    </div>
                  </div>
                </BaseCard>
              );
            })}
          </div>
        )}
      </div>
    </GearLayout>
  );
}
