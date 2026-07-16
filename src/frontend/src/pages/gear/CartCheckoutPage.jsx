import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { cartApi } from '../../api/cartApi';
import { paymentApi } from '../../api/paymentApi';
import GearLayout from '../../layouts/GearLayout';
import PageLoader from '../../components/ui/PageLoader';
import { ShoppingCart, ArrowLeft, CheckCircle2, MapPin, Wallet, ShieldCheck } from 'lucide-react';
import { useToast } from '../../components/Toast';

import { resolveProductImage, CATEGORY_FALLBACKS } from '../../utils/productImages';

function formatVND(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
};

export default function CartCheckoutPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { cartItems, cartData, refreshCart, loading: cartLoading } = useCart();
    const { addToast } = useToast();
    const [isProcessing, setIsProcessing] = useState(false);
    const [walletBalance, setWalletBalance] = useState(null);
    const [isDepositing, setIsDepositing] = useState(false);

    useEffect(() => {
        paymentApi.getEscrowWallet()
            .then((res) => setWalletBalance(res.data?.balance ?? 0))
            .catch(() => setWalletBalance(null));
    }, []);

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

    async function handleCheckout() {
        setIsProcessing(true);
        try {
            const payload = {
                bookingId: checkoutBookingId
            };
            const response = await cartApi.checkout(payload);
            if (response?.success === true) {
                addToast(response.message || 'Thanh toán thành công!', 'success');
                await refreshCart();
                navigate('/customer/bookings');
            } else {
                addToast(response?.message || 'Thanh toán thất bại', 'error');
            }
        } catch (error) {
            console.error('Lỗi khi thanh toán:', error);
            addToast(typeof error === 'string' ? error : (error?.message || 'Số dư ví không đủ hoặc lỗi kết nối server'), 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    async function handleDepositTopUp(shortfall) {
        setIsDepositing(true);
        try {
            const refId = Date.now().toString();
            const res = await paymentApi.createVnPayUrl(shortfall, 'Deposit', refId);
            if (res.statusCode === 200 && res.data) {
                window.location.href = res.data;
            } else {
                addToast(res.message || 'Không thể tạo URL thanh toán VNPay', 'error');
            }
        } catch (error) {
            addToast(typeof error === 'string' ? error : 'Có lỗi xảy ra khi gọi VNPay', 'error');
        } finally {
            setIsDepositing(false);
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
                    <div className="bg-white rounded-[16px] shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-100 p-10 max-w-md w-full text-center">
                        <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 text-[#14b8a6]">
                            <CheckCircle2 size={32} />
                        </div>
                        <h2 className="font-heading text-2xl uppercase tracking-tight text-[#0f172a] mb-4">Mọi thứ đã xong!</h2>
                        <p className="text-gray-500 mb-8 text-[14px]">Giỏ hàng của bạn đã hoàn tất hoặc không có sản phẩm nào để thanh toán.</p>
                        <button onClick={() => navigate('/gear/catalog')} className="bg-[#14b8a6] hover:bg-[#0f9e8c] text-white px-8 py-3 rounded-[8px] text-[13px] font-bold uppercase tracking-wide w-full transition-colors border-0 cursor-pointer shadow-[0_4px_14px_rgba(20,184,166,0.3)]">
                            Về cửa hàng
                        </button>
                    </div>
                </div>
            </GearLayout>
        );
    }

    const fallbackTotal = itemsToCheckout.reduce((sum, item) => sum + (item.unitPrice || 0) * (item.quantity || 1), 0);
    const grandTotal = checkoutBookingId
        ? fallbackTotal
        : (cartData?.grandTotal ?? cartData?.totalPrice ?? fallbackTotal);

    const hasWalletInfo = walletBalance !== null;
    const shortfall = hasWalletInfo ? Math.max(0, grandTotal - walletBalance) : 0;
    const canCheckout = !hasWalletInfo || shortfall === 0;

    return (
        <GearLayout>
            <div className="font-sans bg-[#F8F9FA] min-h-screen">
                <div className="max-w-[1100px] mx-auto px-4 md:px-8 py-10">

                    {/* ── HEADER ── */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-gray-400 mb-3">
                            <Link to="/gear/cart" className="hover:text-[#14b8a6] transition-colors no-underline text-gray-400">Giỏ hàng</Link>
                            <span>/</span>
                            <span className="text-gray-700">Thanh toán</span>
                        </div>
                        <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-[#0f172a] m-0">Xác nhận thanh toán</h1>
                    </div>

                    {/* ── MAIN GRID ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
                        
                        {/* LEFT: Order Details */}
                        <div className="flex flex-col gap-6">
                            <div className="bg-white rounded-[16px] shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">
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
                            </div>

                            <Link to="/gear/cart" className="inline-flex items-center gap-2 text-[13px] font-bold text-gray-400 hover:text-[#14b8a6] transition-colors no-underline w-fit">
                                <ArrowLeft size={14} />
                                Chỉnh sửa giỏ hàng
                            </Link>
                        </div>

                        {/* RIGHT: Order Summary Panel */}
                        <div className="sticky top-24">
                            <div className="bg-white rounded-[16px] shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-gray-100 p-6">
                                <h3 className="font-heading text-[16px] uppercase tracking-wider text-[#0f172a] m-0 mb-6">Thanh toán</h3>

                                <div className="flex justify-between items-end pb-5 mb-5 border-b border-dashed border-gray-200">
                                    <span className="text-[13px] font-bold uppercase tracking-wider text-gray-500">Tổng cộng</span>
                                    <span className="text-[26px] font-bold text-[#0f172a] leading-none">{formatVND(grandTotal)}</span>
                                </div>

                                {hasWalletInfo && (
                                    <div className="flex items-center justify-between mb-6 text-[13px]">
                                        <span className="flex items-center gap-2 text-gray-500 font-medium">
                                            <Wallet size={15} /> Số dư ví
                                        </span>
                                        <span className={`font-bold ${shortfall > 0 ? 'text-red-500' : 'text-[#14b8a6]'}`}>{formatVND(walletBalance)}</span>
                                    </div>
                                )}

                                {shortfall > 0 && (
                                    <div className="mb-6 rounded-[8px] border border-red-100 p-4 bg-red-50/50 text-center">
                                        <p className="text-red-500 text-[12px] font-medium m-0 mb-3 leading-relaxed">
                                            Ví không đủ {formatVND(shortfall)} để thanh toán. Nạp thêm qua VNPay để tiếp tục.
                                        </p>
                                        <button
                                            onClick={() => handleDepositTopUp(shortfall)}
                                            disabled={isDepositing}
                                            className="w-full h-10 flex items-center justify-center gap-2 font-bold text-[12px] uppercase tracking-wide bg-white text-red-500 border border-red-200 hover:bg-red-50 hover:border-red-300 transition-colors rounded-[6px] disabled:opacity-60 cursor-pointer"
                                        >
                                            {isDepositing ? 'Đang chuyển hướng...' : `Nạp ${formatVND(shortfall)}`}
                                        </button>
                                    </div>
                                )}

                                <button
                                    data-testid="checkout-btn"
                                    onClick={handleCheckout}
                                    disabled={isProcessing || !canCheckout}
                                    className="w-full h-13 py-3.5 flex items-center justify-center gap-3 bg-[#14b8a6] hover:bg-[#0f9e8c] active:scale-[0.98] text-white rounded-[10px] text-[13px] font-bold uppercase tracking-wide transition-all cursor-pointer border-0 shadow-[0_6px_20px_rgba(20,184,166,0.35)] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 disabled:hover:bg-[#14b8a6]"
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                            Xử lý...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 size={16} />
                                            Xác nhận Thanh toán
                                        </>
                                    )}
                                </button>

                                <div className="mt-6 flex items-start gap-3 bg-gray-50 rounded-[8px] p-3 border border-gray-100">
                                    <MapPin size={14} className="text-gray-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 m-0 mb-1">Địa điểm nhận</p>
                                        <p className="text-[12px] text-gray-700 m-0 font-medium">Quầy hỗ trợ - ProSport Arena (Tầng 1)</p>
                                    </div>
                                </div>
                                
                                <p className="text-[11px] text-gray-400 text-center m-0 mt-5 leading-relaxed">
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
