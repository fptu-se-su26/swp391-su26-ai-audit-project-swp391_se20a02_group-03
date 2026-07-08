import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus, CreditCard } from 'lucide-react';
import GearLayout from '../../layouts/GearLayout';
import PageLoader from '../../components/ui/PageLoader';
import EmptyState from '../../components/ui/EmptyState';

function formatVND(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
};

export default function CartPage() {
    const navigate = useNavigate();
    const { cartItems, cartData, loading, removeFromCart, updateQuantity } = useCart();

    if (loading && cartItems.length === 0) {
        return (
            <GearLayout>
                <PageLoader message="Đang tải giỏ hàng..." />
            </GearLayout>
        );
    }

    if (cartItems.length === 0) {
        return (
            <GearLayout>
                <EmptyState
                    icon={<ShoppingBag className="w-7 h-7" />}
                    title="Giỏ hàng đang trống"
                    subtitle="Bạn chưa thêm thiết bị nào vào giỏ hàng. Hãy khám phá kho đồ thể thao của chúng tôi ngay!"
                    action={
                        <button
                            onClick={() => navigate('/gear/catalog')}
                            className="btn-primary"
                        >
                            Khám phá danh mục
                        </button>
                    }
                />
            </GearLayout>
        );
    }

    const grandTotal = cartData?.totalAmount || 0;

    return (
        <GearLayout>
            <div className="font-sans">
                {/* Header & Breadcrumb */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 flex-wrap">
                    <div>
                        <div className="flex items-center gap-2 label-mono text-foreground-muted mb-2.5">
                            <Link to="/gear/catalog" className="hover:text-accent transition-colors">Cửa tiệm</Link>
                            <span>/</span>
                            <span className="text-foreground">Giỏ hàng</span>
                        </div>
                        <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground">Giỏ hàng của bạn</h1>
                    </div>
                    <p className="text-sm text-foreground-muted">Bạn có <strong className="text-foreground">{cartItems.length} thiết bị</strong> trong giỏ</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 items-start">
                    {/* Items List */}
                    <div className="flex flex-col gap-4">
                        {cartItems.map((item) => (
                            <div
                                key={item.cartItemId}
                                className="border-2 border-border-strong bg-surface p-6 flex flex-col sm:flex-row items-center gap-6"
                            >
                                <div className="w-24 h-24 flex-shrink-0 border-2 border-border-strong overflow-hidden">
                                    <img
                                        src={item.imageUrl || item.img || item.image || `https://images.unsplash.com/photo-1519704943920-dec0fa3c114f?q=80&w=200&auto=format&fit=crop`}
                                        alt={item.equipmentName}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-1 min-w-0 w-full">
                                    <h3 className="font-extrabold text-[15px] text-foreground mb-1.5 truncate">{item.equipmentName}</h3>
                                    <p className="label-mono text-foreground-muted">{formatVND(item.unitPrice)}</p>
                                </div>

                                <div className="flex items-center gap-6 justify-between w-full sm:w-auto">
                                    {/* Quantity */}
                                    <div className="flex items-center border-2 border-border-strong h-10">
                                        <button
                                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                            className="w-9 h-full flex items-center justify-center text-foreground hover:bg-surface-hover transition-colors disabled:opacity-40"
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="w-9 text-center font-extrabold text-sm text-foreground border-x-2 border-border-strong h-full flex items-center justify-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                            className="w-9 h-full flex items-center justify-center text-foreground hover:bg-surface-hover transition-colors"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>

                                    <p className="font-heading text-lg text-foreground min-w-[110px] text-right">{formatVND(item.unitPrice * item.quantity)}</p>

                                    <button
                                        onClick={() => removeFromCart(item.cartItemId)}
                                        className="w-10 h-10 flex items-center justify-center border-2 border-border-strong text-foreground-muted hover:text-danger hover:border-danger transition-colors"
                                        title="Gỡ bỏ"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        <Link to="/gear/catalog" className="inline-flex items-center gap-2 font-bold text-sm text-foreground hover:text-accent transition-colors mt-2 w-fit">
                            <ArrowLeft size={16} />
                            Quay lại danh mục
                        </Link>
                    </div>

                    {/* Summary Panel */}
                    <div className="sticky top-24 lg:top-28">
                        <div className="border-2 border-border-strong bg-ink text-paper p-8">
                            <h3 className="font-heading text-lg uppercase mb-6">Tóm tắt đơn hàng</h3>

                            <div className="flex justify-between items-center pb-5 mb-5 border-b border-white/15">
                                <span className="text-sm text-paper/60">Tạm tính</span>
                                <span className="font-bold text-sm">{formatVND(grandTotal)}</span>
                            </div>

                            <div className="flex justify-between items-center mb-7">
                                <span className="font-extrabold text-base">Tổng thanh toán</span>
                                <span className="font-heading text-2xl">{formatVND(grandTotal)}</span>
                            </div>

                            <button
                                onClick={() => navigate('/gear/cart/checkout')}
                                className="w-full h-14 flex items-center justify-center gap-3 font-extrabold text-[13px] uppercase tracking-[0.06em] bg-accent text-ink hover:bg-accent-bright transition-colors rounded-[2px]"
                            >
                                <CreditCard size={18} />
                                Tiến hành thanh toán
                            </button>

                            <p className="label-mono text-paper/50 text-center mt-5">Đảm bảo chất lượng thiết bị chính hãng</p>
                        </div>
                    </div>
                </div>
            </div>
        </GearLayout>
    );
}
