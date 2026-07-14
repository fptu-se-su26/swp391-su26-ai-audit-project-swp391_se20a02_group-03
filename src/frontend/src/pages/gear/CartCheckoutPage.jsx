import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { orderApi } from '../../api/orderApi';
import { shippingApi } from '../../api/shippingApi';
import { paymentApi } from '../../api/paymentApi';
import GearLayout from '../../layouts/GearLayout';
import PageLoader from '../../components/ui/PageLoader';
import { ShoppingCart, ArrowLeft, CheckCircle2, Wallet, Truck, Banknote, CreditCard } from 'lucide-react';
import { useToast } from '../../components/Toast';

const formatVND = (a) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(a || 0);

const PAYMENT_METHODS = [
  { key: 'Wallet', label: 'Ví Escrow', desc: 'Trừ trực tiếp từ số dư ví', icon: Wallet },
  { key: 'COD', label: 'COD', desc: 'Thanh toán khi nhận hàng', icon: Banknote },
  { key: 'PayOS', label: 'PayOS', desc: 'Thanh toán online qua PayOS', icon: CreditCard },
];

export default function CartCheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, cartData, clearCart, loading: cartLoading } = useCart();
  const { addToast } = useToast();

  const [form, setForm] = useState({
    recipientName: '', recipientPhone: '', provinceId: '', districtId: '', wardCode: '',
    addressDetail: '', note: '', paymentMethod: 'Wallet',
  });
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [shippingFee, setShippingFee] = useState(null);
  const [feeLoading, setFeeLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(null);
  const [placing, setPlacing] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    shippingApi.provinces().then((r) => setProvinces(r.data || [])).catch(() => {});
    paymentApi.getEscrowWallet().then((r) => setWalletBalance(r.data?.balance ?? 0)).catch(() => setWalletBalance(null));
  }, []);

  useEffect(() => {
    if (!form.provinceId) { setDistricts([]); return; }
    shippingApi.districts(Number(form.provinceId)).then((r) => setDistricts(r.data || [])).catch(() => {});
    set('districtId', ''); set('wardCode', ''); setWards([]); setShippingFee(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.provinceId]);

  useEffect(() => {
    if (!form.districtId) { setWards([]); return; }
    shippingApi.wards(Number(form.districtId)).then((r) => setWards(r.data || [])).catch(() => {});
    set('wardCode', ''); setShippingFee(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.districtId]);

  useEffect(() => {
    if (!form.districtId || !form.wardCode) { setShippingFee(null); return; }
    setFeeLoading(true);
    shippingApi.fee(Number(form.districtId), form.wardCode)
      .then((r) => setShippingFee(r.data?.fee ?? 0))
      .catch(() => setShippingFee(null))
      .finally(() => setFeeLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.wardCode]);

  const subtotal = cartData?.totalAmount ?? cartItems.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const total = subtotal + (shippingFee || 0);
  const insufficientWallet = form.paymentMethod === 'Wallet' && walletBalance !== null && total > walletBalance;

  async function placeOrder() {
    if (!form.recipientName.trim()) return addToast('Vui lòng nhập tên người nhận.', 'error');
    if (!/^0\d{9}$/.test(form.recipientPhone.trim())) return addToast('Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0).', 'error');
    if (!form.provinceId || !form.districtId || !form.wardCode) return addToast('Vui lòng chọn đầy đủ Tỉnh/Quận/Phường.', 'error');
    if (!form.addressDetail.trim()) return addToast('Vui lòng nhập địa chỉ chi tiết.', 'error');

    setPlacing(true);
    try {
      const payload = {
        paymentMethod: form.paymentMethod,
        recipientName: form.recipientName.trim(),
        recipientPhone: form.recipientPhone.trim(),
        provinceId: Number(form.provinceId),
        provinceName: provinces.find((p) => p.provinceId === Number(form.provinceId))?.provinceName || '',
        districtId: Number(form.districtId),
        districtName: districts.find((d) => d.districtId === Number(form.districtId))?.districtName || '',
        wardCode: form.wardCode,
        wardName: wards.find((w) => w.wardCode === form.wardCode)?.wardName || '',
        addressDetail: form.addressDetail.trim(),
        note: form.note.trim() || null,
      };
      const res = await orderApi.checkout(payload);
      if (res.statusCode !== 201) return addToast(res.message || 'Đặt hàng thất bại.', 'error');

      const order = res.data;
      if (form.paymentMethod === 'PayOS' && order.paymentUrl) {
        if (order.paymentUrl.includes('mock=1')) {
          // Demo: chưa có PayOS thật → giả lập thanh toán thành công.
          await orderApi.payosMockConfirm(order.orderId);
          addToast('Đã giả lập thanh toán PayOS (mock). Đơn hàng hoàn tất.', 'success');
          clearCart();
          navigate('/gear/orders');
        } else {
          window.location.href = order.paymentUrl;
        }
        return;
      }

      addToast(form.paymentMethod === 'COD' ? 'Đặt hàng COD thành công!' : 'Thanh toán thành công!', 'success');
      clearCart();
      navigate('/gear/orders');
    } catch (e) {
      addToast(typeof e === 'string' ? e : (e?.message || 'Có lỗi khi đặt hàng.'), 'error');
    } finally {
      setPlacing(false);
    }
  }

  if (cartLoading) return <GearLayout><PageLoader message="Đang tải giỏ hàng..." /></GearLayout>;

  if (!cartItems.length) {
    return (
      <GearLayout>
        <div className="font-sans max-w-md mx-auto py-20 text-center">
          <div className="card-base p-10">
            <h2 className="font-heading text-2xl uppercase tracking-tight text-foreground mb-4">Giỏ hàng trống</h2>
            <button onClick={() => navigate('/gear/catalog')} className="btn-primary w-full">Về cửa hàng</button>
          </div>
        </div>
      </GearLayout>
    );
  }

  const inputCls = 'w-full h-11 px-3 border-2 border-border-strong bg-surface text-foreground text-sm focus:border-accent outline-none';

  return (
    <GearLayout>
      <div className="font-sans">
        <div className="mb-8">
          <div className="flex items-center gap-2 label-mono text-foreground-muted mb-2.5">
            <Link to="/gear/cart" className="hover:text-accent transition-colors">Giỏ hàng</Link>
            <span>/</span><span className="text-foreground">Thanh toán</span>
          </div>
          <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground">Thông tin giao hàng</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 items-start">
          {/* Form */}
          <div className="flex flex-col gap-6">
            <div className="border-2 border-border-strong bg-surface p-6 grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 label-mono text-foreground flex items-center gap-2"><Truck size={16} /> Địa chỉ nhận hàng</div>
              <input className={inputCls} placeholder="Tên người nhận *" value={form.recipientName} onChange={(e) => set('recipientName', e.target.value)} />
              <input className={inputCls} placeholder="Số điện thoại * (VD: 0901234567)" value={form.recipientPhone} onChange={(e) => set('recipientPhone', e.target.value)} />
              <select className={inputCls} value={form.provinceId} onChange={(e) => set('provinceId', e.target.value)}>
                <option value="">-- Tỉnh/Thành phố * --</option>
                {provinces.map((p) => <option key={p.provinceId} value={p.provinceId}>{p.provinceName}</option>)}
              </select>
              <select className={inputCls} value={form.districtId} onChange={(e) => set('districtId', e.target.value)} disabled={!form.provinceId}>
                <option value="">-- Quận/Huyện * --</option>
                {districts.map((d) => <option key={d.districtId} value={d.districtId}>{d.districtName}</option>)}
              </select>
              <select className={inputCls} value={form.wardCode} onChange={(e) => set('wardCode', e.target.value)} disabled={!form.districtId}>
                <option value="">-- Phường/Xã * --</option>
                {wards.map((w) => <option key={w.wardCode} value={w.wardCode}>{w.wardName}</option>)}
              </select>
              <input className={inputCls} placeholder="Số nhà, tên đường *" value={form.addressDetail} onChange={(e) => set('addressDetail', e.target.value)} />
              <input className={`${inputCls} sm:col-span-2`} placeholder="Ghi chú (tuỳ chọn)" value={form.note} onChange={(e) => set('note', e.target.value)} />
            </div>

            {/* Payment method */}
            <div className="border-2 border-border-strong bg-surface p-6">
              <div className="label-mono text-foreground mb-4">Phương thức thanh toán</div>
              <div className="grid sm:grid-cols-3 gap-3">
                {PAYMENT_METHODS.map((m) => {
                  const Icon = m.icon;
                  const active = form.paymentMethod === m.key;
                  return (
                    <button key={m.key} type="button" onClick={() => set('paymentMethod', m.key)}
                      className={`text-left p-4 border-2 transition-colors ${active ? 'border-accent bg-accent/5' : 'border-border-default hover:border-border-hover'}`}>
                      <Icon size={18} className="mb-2 text-foreground" />
                      <p className="font-extrabold text-sm text-foreground">{m.label}</p>
                      <p className="text-[11px] text-foreground-muted mt-0.5">{m.desc}</p>
                    </button>
                  );
                })}
              </div>
              {insufficientWallet && (
                <p className="text-danger text-xs mt-3">Số dư ví không đủ ({formatVND(walletBalance)}). Chọn COD/PayOS hoặc nạp thêm ví.</p>
              )}
            </div>

            <Link to="/gear/cart" className="inline-flex items-center gap-2 font-bold text-sm text-foreground hover:text-accent transition-colors w-fit">
              <ArrowLeft size={16} /> Quay lại giỏ hàng
            </Link>
          </div>

          {/* Summary */}
          <div className="sticky top-24 lg:top-28">
            <div className="border-2 border-border-strong bg-ink text-paper p-8">
              <h3 className="font-heading text-lg uppercase mb-5 flex items-center gap-2"><ShoppingCart size={16} /> Đơn hàng ({cartItems.length})</h3>
              <div className="space-y-2 mb-5 max-h-48 overflow-y-auto">
                {cartItems.map((i) => (
                  <div key={i.cartItemId} className="flex justify-between text-sm gap-2">
                    <span className="text-paper/80 truncate">{i.equipmentName} × {i.quantity}</span>
                    <span className="whitespace-nowrap">{formatVND(i.unitPrice * i.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 py-4 border-t border-white/15 text-sm">
                <div className="flex justify-between"><span className="text-paper/70">Tạm tính</span><span>{formatVND(subtotal)}</span></div>
                <div className="flex justify-between">
                  <span className="text-paper/70">Phí vận chuyển (GHN)</span>
                  <span>{feeLoading ? '...' : shippingFee === null ? 'Chọn địa chỉ' : formatVND(shippingFee)}</span>
                </div>
              </div>
              <div className="flex justify-between items-end pt-4 mb-6 border-t border-white/15">
                <span className="font-extrabold">Tổng cộng</span>
                <span className="font-heading text-2xl">{formatVND(total)}</span>
              </div>
              <button onClick={placeOrder} disabled={placing || insufficientWallet}
                className="w-full h-14 flex items-center justify-center gap-3 font-extrabold text-[13px] uppercase tracking-[0.06em] bg-accent text-ink hover:bg-accent-bright transition-colors rounded-[2px] disabled:opacity-60">
                {placing ? <><div className="w-4 h-4 border-2 border-ink/40 border-t-ink rounded-full animate-spin" /> Đang xử lý...</> : <><CheckCircle2 size={18} /> Đặt hàng</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </GearLayout>
  );
}
