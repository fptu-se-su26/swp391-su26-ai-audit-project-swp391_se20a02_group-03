import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../../api/orderApi';
import GearLayout from '../../layouts/GearLayout';
import PageLoader from '../../components/ui/PageLoader';
import { Package, Truck, MapPin } from 'lucide-react';

const formatVND = (a) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(a || 0);

const STATUS_LABEL = {
  Pending: { text: 'Chờ thanh toán', cls: 'text-warning border-warning' },
  Paid: { text: 'Đã thanh toán', cls: 'text-accent border-accent' },
  Processing: { text: 'Đang xử lý', cls: 'text-foreground border-border-strong' },
  Shipped: { text: 'Đang giao', cls: 'text-foreground border-border-strong' },
  Delivered: { text: 'Đã giao', cls: 'text-accent border-accent' },
  Cancelled: { text: 'Đã hủy', cls: 'text-danger border-danger' },
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
      <div className="font-sans">
        <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground mb-8">Đơn hàng của tôi</h1>
        {error && <div className="text-danger text-sm mb-4">{error}</div>}

        {!orders.length ? (
          <div className="card-base p-10 text-center">
            <Package size={32} className="mx-auto text-foreground-muted mb-4" />
            <p className="text-foreground-muted mb-6 text-sm">Bạn chưa có đơn hàng nào.</p>
            <Link to="/gear/catalog" className="btn-primary inline-block">Mua sắm ngay</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {orders.map((o) => {
              const st = STATUS_LABEL[o.status] || STATUS_LABEL.Pending;
              return (
                <div key={o.orderId} className="border-2 border-border-strong bg-surface">
                  <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b-2 border-border-default">
                    <div className="flex items-center gap-3">
                      <span className="font-heading text-lg text-foreground">Đơn #{o.orderId}</span>
                      <span className={`label-mono px-2.5 py-1 border ${st.cls}`}>{st.text}</span>
                    </div>
                    <span className="label-mono text-foreground-muted">{new Date(o.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>

                  <div className="p-5 grid md:grid-cols-2 gap-5">
                    <div>
                      <div className="space-y-1.5 mb-4">
                        {o.items.map((it) => (
                          <div key={it.orderItemId} className="flex justify-between text-sm gap-2">
                            <span className="text-foreground truncate">{it.equipmentName} × {it.quantity}</span>
                            <span className="text-foreground-muted whitespace-nowrap">{formatVND(it.lineTotal)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="text-sm space-y-1 border-t border-border-default pt-3">
                        <div className="flex justify-between"><span className="text-foreground-subtle">Tạm tính</span><span>{formatVND(o.subtotal)}</span></div>
                        <div className="flex justify-between"><span className="text-foreground-subtle">Phí ship</span><span>{formatVND(o.shippingFee)}</span></div>
                        <div className="flex justify-between font-extrabold text-foreground"><span>Tổng</span><span>{formatVND(o.totalAmount)}</span></div>
                        <div className="flex justify-between"><span className="text-foreground-subtle">Thanh toán</span><span>{PAYMENT_LABEL[o.paymentMethod] || o.paymentMethod} · {o.paymentStatus}</span></div>
                      </div>
                    </div>

                    <div className="text-sm">
                      <p className="flex items-start gap-2 text-foreground mb-2">
                        <MapPin size={15} className="shrink-0 mt-0.5 text-foreground-muted" />
                        <span>{o.recipientName} · {o.recipientPhone}<br />
                          <span className="text-foreground-muted">{o.addressDetail}, {o.wardName}, {o.districtName}, {o.provinceName}</span></span>
                      </p>
                      <p className="flex items-center gap-2 text-foreground mt-3">
                        <Truck size={15} className="text-foreground-muted" />
                        {o.trackingCode
                          ? <span>Mã vận đơn <strong>{o.trackingCode}</strong> ({o.shippingProvider}) · {o.shippingStatus}</span>
                          : <span className="text-foreground-muted">Chưa tạo vận đơn</span>}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </GearLayout>
  );
}
