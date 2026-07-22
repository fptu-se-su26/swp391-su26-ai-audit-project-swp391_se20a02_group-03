import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { cartApi } from '../../api/cartApi';
import { orderApi } from '../../api/orderApi';
import { shippingApi } from '../../api/shippingApi';
import { paymentApi } from '../../api/paymentApi';
import GearLayout from '../../layouts/GearLayout';
import PageLoader from '../../components/ui/PageLoader';
import BaseCard from '../../components/ui/BaseCard';
import BaseButton from '../../components/ui/BaseButton';
import { ShoppingCart, ArrowLeft, CheckCircle2, MapPin, Wallet, Truck, Banknote, CreditCard } from 'lucide-react';
import { useToast } from '../../components/Toast';
import { resolveProductImage, CATEGORY_FALLBACKS } from '../../utils/productImages';

const formatVND = (a) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(a || 0);

// Giỏ có thể chứa 2 loại: thiết bị gắn với 1 booking (nhận tại quầy, thanh toán ví)
// hoặc đơn hàng shop độc lập (giao GHN, PayOS/COD/Ví) — xem OrderRepository.CreateFromCartAtomicAsync
// ở backend, tách theo BookingId == null.
const PAYMENT_METHODS = [
  { key: 'Wallet', label: 'Ví Escrow', desc: 'Trừ trực tiếp từ số dư ví', icon: Wallet },
  { key: 'COD', label: 'COD', desc: 'Thanh toán khi nhận hàng', icon: Banknote },
  { key: 'PayOS', label: 'PayOS', desc: 'Thanh toán online qua PayOS', icon: CreditCard },
];

export default function CartCheckoutPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { cartItems, cartData, clearCart, refreshCart, loading: cartLoading } = useCart();
  const { addToast } = useToast();

  const [isProcessing, setIsProcessing] = useState(false);
  const [walletBalance, setWalletBalance] = useState(null);
  const [isDepositing, setIsDepositing] = useState(false);

  // Form giao hàng — chỉ dùng khi checkout đơn shop độc lập (không gắn booking)
  const [form, setForm] = useState({
    recipientName: '', recipientPhone: '', provinceId: '', districtId: '', wardCode: '',
    addressDetail: '', note: '', paymentMethod: 'Wallet',
  });
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [shippingFee, setShippingFee] = useState(null);
  const [feeLoading, setFeeLoading] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const checkoutBookingId = useMemo(() => {
    const fromQuery = searchParams.get('bookingId');
    if (fromQuery) {
      const parsed = Number(fromQuery);
      if (Number.isFinite(parsed) && parsed > 0) return parsed;
    }
    const linkedIds = [...new Set(cartItems.map((item) => item.bookingId).filter(Boolean))];
    const everyItemHasSameBooking = cartItems.length > 0
      && linkedIds.length === 1
      && cartItems.every((item) => item.bookingId === linkedIds[0]);
    return everyItemHasSameBooking ? linkedIds[0] : null;
  }, [cartItems, searchParams]);

  const itemsToCheckout = useMemo(() => {
    if (!checkoutBookingId) return cartItems;
    return cartItems.filter((item) => item.bookingId === checkoutBookingId);
  }, [cartItems, checkoutBookingId]);

  const isBookingCheckout = checkoutBookingId !== null;

  useEffect(() => {
    paymentApi.getEscrowWallet().then((r) => setWalletBalance(r.data?.balance ?? 0)).catch(() => setWalletBalance(null));
    if (!isBookingCheckout) {
      shippingApi.provinces().then((r) => setProvinces(r.data || [])).catch(() => {});
    }
  }, [isBookingCheckout]);

  useEffect(() => {
    if (!form.provinceId) { setDistricts([]); return; }
    shippingApi.districts(Number(form.provinceId)).then((r) => setDistricts(r.data || [])).catch(() => {});
    set('districtId', ''); set('wardCode', ''); setWards([]); setShippingFee(null);
  }, [form.provinceId]);

  useEffect(() => {
    if (!form.districtId) { setWards([]); return; }
    shippingApi.wards(Number(form.districtId)).then((r) => setWards(r.data || [])).catch(() => {});
    set('wardCode', ''); setShippingFee(null);
  }, [form.districtId]);

  useEffect(() => {
    if (!form.districtId || !form.wardCode) { setShippingFee(null); return; }
    setFeeLoading(true);
    shippingApi.fee(Number(form.districtId), form.wardCode)
      .then((r) => setShippingFee(r.data?.fee ?? 0))
      .catch(() => setShippingFee(null))
      .finally(() => setFeeLoading(false));
  }, [form.wardCode]);

  const bookingSubtotal = itemsToCheckout.reduce((sum, item) => sum + (item.unitPrice || 0) * (item.quantity || 1), 0);
  const shopSubtotal = cartData?.totalAmount ?? cartItems.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const grandTotal = isBookingCheckout ? bookingSubtotal : (shopSubtotal + (shippingFee || 0));

  const hasWalletInfo = walletBalance !== null;
  const shortfall = hasWalletInfo ? Math.max(0, grandTotal - walletBalance) : 0;
  const canCheckoutBooking = !hasWalletInfo || shortfall === 0;
  const insufficientWalletShop = form.paymentMethod === 'Wallet' && hasWalletInfo && grandTotal > walletBalance;

  async function handleBookingCheckout() {
    setIsProcessing(true);
    try {
      const response = await cartApi.checkout({ bookingId: checkoutBookingId });
      if (response?.success === true) {
        addToast(response.message || 'Thanh toán thành công!', 'success');
        await refreshCart();
        navigate('/customer/bookings');
      } else {
        addToast(response?.message || 'Thanh toán thất bại', 'error');
      }
    } catch (error) {
      addToast(typeof error === 'string' ? error : (error?.message || 'Số dư ví không đủ hoặc lỗi kết nối server'), 'error');
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleDepositTopUp(shortfall) {
    setIsDepositing(true);
    try {
      const refId = Date.now().toString();
      const res = await paymentApi.createPayOsUrl(shortfall, 'Deposit', refId);
      if (res.statusCode === 200 && res.data) {
        window.location.assign(res.data);
      } else {
        addToast(res.message || 'Không thể tạo URL thanh toán PayOS', 'error');
      }
    } catch (error) {
      addToast(typeof error === 'string' ? error : 'Có lỗi xảy ra khi gọi PayOS', 'error');
    } finally {
      setIsDepositing(false);
    }
  }

  async function placeShopOrder() {
    if (!form.recipientName.trim()) return addToast('Vui lòng nhập tên người nhận.', 'error');
    if (!/^0\d{9}$/.test(form.recipientPhone.trim())) return addToast('Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0).', 'error');
    if (!form.provinceId || !form.districtId || !form.wardCode) return addToast('Vui lòng chọn đầy đủ Tỉnh/Quận/Phường.', 'error');
    if (!form.addressDetail.trim()) return addToast('Vui lòng nhập địa chỉ chi tiết.', 'error');

    setIsProcessing(true);
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
      setIsProcessing(false);
    }
  }

  if (cartLoading) {
    return (
      <GearLayout>
        <div className="bg-[#F8F9FA] min-h-screen">
          <PageLoader message="Đang tải thông tin thanh toán..." />
        </div>
      </GearLayout>
    );
  }

  if (cartItems.length === 0 || itemsToCheckout.length === 0) {
    return (
      <GearLayout>
        <div className="bg-[#F8F9FA] min-h-screen flex items-center justify-center py-24">
          <BaseCard density="comfortable" className="max-w-md w-full text-center">
            <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 text-[#14b8a6]">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="font-heading text-2xl uppercase tracking-tight text-[#0f172a] mb-4">Mọi thứ đã xong!</h2>
            <p className="text-gray-500 mb-8 text-[14px]">Giỏ hàng của bạn đã hoàn tất hoặc không có sản phẩm nào để thanh toán.</p>
            <BaseButton onClick={() => navigate('/gear/catalog')} variant="primary" fullWidth className="shadow-[0_4px_14px_rgba(20,184,166,0.3)]">
              Về cửa hàng
            </BaseButton>
          </BaseCard>
        </div>
      </GearLayout>
    );
  }

  const inputCls = 'w-full h-11 px-3 rounded-[8px] border border-gray-200 bg-white text-[#0f172a] text-sm focus:border-[#14b8a6] focus:ring-2 focus:ring-teal-100 outline-none transition-colors';

  return (
    <GearLayout>
      <div className="font-sans bg-[#F8F9FA] min-h-screen">
        <div className="max-w-[1100px] mx-auto px-4 md:px-8 py-10">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-gray-400 mb-3">
              <Link to="/gear/cart" className="hover:text-[#14b8a6] transition-colors no-underline text-gray-400">Giỏ hàng</Link>
              <span>/</span>
              <span className="text-gray-700">Thanh toán</span>
            </div>
            <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-[#0f172a] m-0">
              {isBookingCheckout ? 'Xác nhận thanh toán' : 'Thông tin giao hàng'}
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
            {/* LEFT */}
            <div className="flex flex-col gap-6">
              <BaseCard density="comfortable" noPad className="overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <h3 className="text-[13px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2 m-0">
                    <ShoppingCart size={15} /> Danh sách thiết bị
                  </h3>
                  <span className="text-[12px] font-bold text-gray-400">{itemsToCheckout.length} mục</span>
                </div>
                <div className="divide-y divide-gray-100">
                  {itemsToCheckout.map((item) => (
                    <div key={item.cartItemId} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors hover:bg-gray-50/30">
                      <div className="flex items-center gap-5 min-w-0 w-full sm:w-auto">
                        <div className="w-16 h-16 rounded-[8px] bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center p-1.5">
                          <img
                            src={resolveProductImage(item.equipmentName, item.category || 'Accessories', item.imageUrl || item.img || item.image)}
                            alt=""
                            className="w-full h-full object-contain mix-blend-multiply"
                            onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = CATEGORY_FALLBACKS.Accessories }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-[14px] text-[#0f172a] m-0 truncate leading-snug">{item.equipmentName}</p>
                          <p className="text-[13px] text-gray-500 font-medium m-0 mt-1">{item.quantity} x {formatVND(item.unitPrice)}</p>
                        </div>
                      </div>
                      <p className="font-bold text-[16px] text-[#0f172a] m-0 whitespace-nowrap hidden sm:block">{formatVND(item.unitPrice * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </BaseCard>

              {!isBookingCheckout && (
                <BaseCard density="comfortable" className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 text-[13px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                    <Truck size={16} className="text-[#14b8a6]" /> Địa chỉ nhận hàng
                  </div>
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
                </BaseCard>
              )}

              {!isBookingCheckout && (
                <BaseCard density="comfortable">
                  <div className="text-[13px] font-bold uppercase tracking-widest text-gray-500 mb-4">Phương thức thanh toán</div>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {PAYMENT_METHODS.map((m) => {
                      const Icon = m.icon;
                      const active = form.paymentMethod === m.key;
                      return (
                        <button key={m.key} type="button" onClick={() => set('paymentMethod', m.key)}
                          className={`text-left p-4 rounded-[8px] border-2 transition-colors cursor-pointer ${active ? 'border-[#14b8a6] bg-teal-50/50' : 'border-gray-100 hover:border-gray-200'}`}>
                          <Icon size={18} className="mb-2 text-[#14b8a6]" />
                          <p className="font-bold text-sm text-[#0f172a] m-0">{m.label}</p>
                          <p className="text-[11px] text-gray-500 mt-0.5 m-0">{m.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                  {insufficientWalletShop && (
                    <p className="text-red-500 text-xs mt-3 m-0">Số dư ví không đủ ({formatVND(walletBalance)}). Chọn COD/PayOS hoặc nạp thêm ví.</p>
                  )}
                </BaseCard>
              )}

              <Link to="/gear/cart" className="inline-flex items-center gap-2 text-[13px] font-bold text-gray-400 hover:text-[#14b8a6] transition-colors no-underline w-fit">
                <ArrowLeft size={14} />
                Chỉnh sửa giỏ hàng
              </Link>
            </div>

            {/* RIGHT: Summary */}
            <div className="sticky top-24">
              <div className="bg-[#0f172a] text-white rounded-lg p-6 md:p-8">
                <h3 className="font-heading text-[16px] uppercase tracking-wider m-0 mb-6">Thanh toán</h3>

                {!isBookingCheckout && (
                  <div className="space-y-2 py-4 border-b border-white/15 text-sm mb-4">
                    <div className="flex justify-between"><span className="text-white/70">Tạm tính</span><span>{formatVND(shopSubtotal)}</span></div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Phí vận chuyển (GHN)</span>
                      <span>{feeLoading ? '...' : shippingFee === null ? 'Chọn địa chỉ' : formatVND(shippingFee)}</span>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-end pb-5 mb-5 border-b border-dashed border-white/20">
                  <span className="text-[13px] font-bold uppercase tracking-wider text-white/70">Tổng cộng</span>
                  <span className="text-[26px] font-bold leading-none">{formatVND(grandTotal)}</span>
                </div>

                {isBookingCheckout && hasWalletInfo && (
                  <div className="flex items-center justify-between mb-5 text-sm">
                    <span className="flex items-center gap-2 text-white/70"><Wallet size={15} /> Số dư ví</span>
                    <span className={`font-bold ${shortfall > 0 ? 'text-red-400' : 'text-teal-300'}`}>{formatVND(walletBalance)}</span>
                  </div>
                )}

                {isBookingCheckout && shortfall > 0 && (
                  <div className="mb-5 rounded-[8px] border border-red-400/40 p-4 bg-red-500/10 text-center">
                    <p className="text-red-300 text-xs font-medium mb-3 m-0">
                      Ví không đủ {formatVND(shortfall)} để thanh toán. Nạp thêm qua PayOS để tiếp tục.
                    </p>
                    <BaseButton onClick={() => handleDepositTopUp(shortfall)} disabled={isDepositing} variant="secondary" fullWidth>
                      {isDepositing ? 'Đang chuyển hướng...' : `Nạp ${formatVND(shortfall)}`}
                    </BaseButton>
                  </div>
                )}

                <BaseButton
                  onClick={isBookingCheckout ? handleBookingCheckout : placeShopOrder}
                  disabled={isProcessing || (isBookingCheckout ? !canCheckoutBooking : insufficientWalletShop)}
                  variant="primary"
                  size="lg"
                  fullWidth
                  className="shadow-[0_6px_20px_rgba(20,184,166,0.35)]"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Xử lý...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={18} />
                      {isBookingCheckout ? 'Xác nhận Thanh toán' : 'Đặt hàng'}
                    </>
                  )}
                </BaseButton>

                {isBookingCheckout && (
                  <div className="mt-6 flex items-start gap-3 border border-white/15 rounded-[8px] p-3">
                    <MapPin size={14} className="text-white/60 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-white/60 m-0 mb-1">Địa điểm nhận</p>
                      <p className="text-[12px] text-white/80 m-0">Quầy hỗ trợ - ProSport Arena (Tầng 1)</p>
                    </div>
                  </div>
                )}

                <p className="text-[11px] text-white/50 text-center m-0 mt-5 leading-relaxed">
                  Bằng cách nhấn xác nhận, bạn đồng ý với các Điều khoản Mua thiết bị của chúng tôi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GearLayout>
  );
}
