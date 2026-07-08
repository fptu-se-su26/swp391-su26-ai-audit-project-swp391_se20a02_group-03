import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { cartApi } from '../../api/cartApi';
import { paymentApi } from '../../api/paymentApi';
import GearLayout from '../../layouts/GearLayout';
import PageLoader from '../../components/ui/PageLoader';
import { ShoppingCart, ArrowLeft, CheckCircle2, MapPin, Wallet } from 'lucide-react';
import { useToast } from '../../components/Toast';

function formatVND(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
};

export default function CartCheckoutPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { cartItems, cartData, clearCart, loading: cartLoading } = useCart();
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
        return linkedIds.length === 1 ? linkedIds[0] : null;
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
            if (response.statusCode === 200) {
                addToast('Thanh toán thành công!', 'success');
                clearCart();
                navigate('/customer/bookings');
            } else {
                addToast(response.message || 'Thanh toán thất bại', 'error');
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
                <PageLoader message="Đang tải thông tin thanh toán..." />
            </GearLayout>
        );
    }

    if (cartItems.length === 0 || itemsToCheckout.length === 0) {
        return (
            <GearLayout>
                <div className="font-sans max-w-md mx-auto py-20 text-center">
                    <div className="card-base p-10">
                        <h2 className="font-heading text-2xl uppercase tracking-tight text-foreground mb-4">Mọi thứ đã xong!</h2>
                        <p className="text-foreground-muted mb-8 text-sm">Giỏ hàng của bạn đã hoàn tất hoặc không có sản phẩm nào để thanh toán.</p>
                        <button onClick={() => navigate('/gear/catalog')} className="btn-primary w-full">Về cửa hàng</button>
                    </div>
                </div>
            </GearLayout>
        );
    }

    const grandTotal = checkoutBookingId
        ? itemsToCheckout.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
        : (cartData?.totalAmount || 0);

    const hasWalletInfo = walletBalance !== null;
    const shortfall = hasWalletInfo ? Math.max(0, grandTotal - walletBalance) : 0;
    const canCheckout = !hasWalletInfo || shortfall === 0;

    return (
        <GearLayout>
            <div className="font-sans">
                {/* Header & Breadcrumb */}
                <div className="mb-10">
                    <div className="flex items-center gap-2 label-mono text-foreground-muted mb-2.5">
                        <Link to="/gear/cart" className="hover:text-accent transition-colors">Giỏ hàng</Link>
                        <span>/</span>
                        <span className="text-foreground">Thanh toán</span>
                    </div>
                    <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground">Xác nhận thanh toán</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 items-start">
                    {/* Order Details */}
                    <div className="flex flex-col gap-6">
                        <div className="border-2 border-border-strong bg-surface">
                            <div className="p-6 border-b-2 border-border-strong flex items-center justify-between">
                                <h3 className="label-mono text-foreground flex items-center gap-2">
                                    <ShoppingCart size={16} /> Danh sách thiết bị
                                </h3>
                                <span className="label-mono text-foreground-muted">{itemsToCheckout.length} mục</span>
                            </div>
                            <div className="divide-y-2 divide-border-default">
                                {itemsToCheckout.map((item) => (
                                    <div key={item.cartItemId} className="p-6 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="w-14 h-14 border-2 border-border-strong overflow-hidden flex-shrink-0">
                                                <img src={item.imageUrl || item.img || item.image || `https://images.unsplash.com/photo-1519704943920-dec0fa3c114f?q=80&w=100&auto=format&fit=crop`} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-extrabold text-[15px] text-foreground truncate">{item.equipmentName}</p>
                                                <p className="label-mono text-foreground-muted mt-1">{item.quantity} x {formatVND(item.unitPrice)}</p>
                                            </div>
                                        </div>
                                        <p className="font-heading text-lg text-foreground whitespace-nowrap">{formatVND(item.unitPrice * item.quantity)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Link to="/gear/cart" className="inline-flex items-center gap-2 font-bold text-sm text-foreground hover:text-accent transition-colors w-fit">
                            <ArrowLeft size={16} />
                            Chỉnh sửa giỏ hàng
                        </Link>
                    </div>

                    {/* Order Summary Panel */}
                    <div className="sticky top-24 lg:top-28">
                        <div className="border-2 border-border-strong bg-ink text-paper p-8">
                            <h3 className="font-heading text-lg uppercase mb-6">Thanh toán</h3>

                            <div className="flex justify-between items-end pb-5 mb-5 border-b border-white/15">
                                <span className="font-extrabold text-base">Tổng cộng</span>
                                <span className="font-heading text-2xl">{formatVND(grandTotal)}</span>
                            </div>

                            {hasWalletInfo && (
                                <div className="flex items-center justify-between mb-5 text-sm">
                                    <span className="flex items-center gap-2 text-paper/70">
                                        <Wallet size={15} /> Số dư ví
                                    </span>
                                    <span className={`font-bold ${shortfall > 0 ? 'text-danger' : 'text-accent'}`}>{formatVND(walletBalance)}</span>
                                </div>
                            )}

                            {shortfall > 0 && (
                                <div className="mb-5 border border-danger p-4 bg-danger-bg/10">
                                    <p className="text-danger text-xs font-semibold mb-3">
                                        Ví không đủ {formatVND(shortfall)} để thanh toán. Nạp thêm qua VNPay để tiếp tục.
                                    </p>
                                    <button
                                        onClick={() => handleDepositTopUp(shortfall)}
                                        disabled={isDepositing}
                                        className="w-full h-11 flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-[0.04em] bg-paper text-ink hover:bg-white transition-colors rounded-[2px] disabled:opacity-60"
                                    >
                                        {isDepositing ? 'Đang chuyển hướng...' : `Nạp ${formatVND(shortfall)} qua VNPay`}
                                    </button>
                                </div>
                            )}

                            <button
                                onClick={handleCheckout}
                                disabled={isProcessing || !canCheckout}
                                className="w-full h-14 flex items-center justify-center gap-3 font-extrabold text-[13px] uppercase tracking-[0.06em] bg-accent text-ink hover:bg-accent-bright transition-colors rounded-[2px] disabled:opacity-60"
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-ink/40 border-t-ink rounded-full animate-spin" />
                                        Xử lý...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 size={18} />
                                        Xác nhận Thanh toán
                                    </>
                                )}
                            </button>

                            <div className="mt-6 flex items-start gap-3 border border-white/15 p-4">
                                <MapPin size={16} className="text-paper/60 shrink-0 mt-0.5" />
                                <div>
                                    <p className="label-mono text-paper/60 mb-1">Địa điểm nhận</p>
                                    <p className="text-xs text-paper/80">Quầy hỗ trợ - ProSport Arena (Tầng 1)</p>
                                </div>
                            </div>
                            <p className="label-mono text-paper/50 text-center mt-5 normal-case font-normal tracking-normal">
                                Bằng cách nhấn xác nhận, bạn đồng ý với các Điều khoản Mua thiết bị của chúng tôi.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </GearLayout>
    );
}
