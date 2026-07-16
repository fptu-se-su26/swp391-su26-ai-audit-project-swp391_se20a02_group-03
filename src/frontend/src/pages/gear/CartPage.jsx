import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus, CreditCard, ShieldCheck, ShoppingCart } from 'lucide-react';
import GearLayout from '../../layouts/GearLayout';
import PageLoader from '../../components/ui/PageLoader';
import { resolveProductImage, CATEGORY_FALLBACKS } from '../../utils/productImages';

function formatVND(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

// Dummy cross-sell products
const CROSS_SELL_ITEMS = [
    { id: 101, name: 'Quấn cán vợt Yonex AC102EX', category: 'Accessories', price: 65000, img: resolveProductImage('Yonex AC102EX', 'Accessories') },
    { id: 102, name: 'Ống cầu lông Yonex AS-30', category: 'Ball / Birdie', price: 680000, img: resolveProductImage('Yonex AS-30', 'Ball / Birdie') },
    { id: 103, name: 'Băng chặn mồ hôi tay Yonex', category: 'Accessories', price: 120000, img: resolveProductImage('Băng chặn mồ hôi tay', 'Accessories') },
    { id: 104, name: 'Bột chống trơn Yonex AC470', category: 'Accessories', price: 150000, img: resolveProductImage('Bột chống trơn', 'Accessories') },
];

export default function CartPage() {
    const navigate = useNavigate();
    const { cartItems, cartData, loading, removeFromCart, updateQuantity, addToCart } = useCart();

    if (loading && cartItems.length === 0) {
        return (
            <GearLayout>
                <div className="bg-[#F8F9FA] min-h-screen">
                    <PageLoader message="Đang tải giỏ hàng..." />
                </div>
            </GearLayout>
        );
    }

    if (cartItems.length === 0) {
        return (
            <GearLayout>
                <div className="bg-[#F8F9FA] min-h-screen flex items-center justify-center py-24">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="w-9 h-9 text-gray-300" />
                        </div>
                        <h2 className="font-heading text-2xl uppercase tracking-tight text-[#0f172a] mb-3">Giỏ hàng đang trống</h2>
                        <p className="text-[14px] text-gray-500 mb-8 max-w-sm mx-auto">
                            Bạn chưa thêm thiết bị nào vào giỏ hàng. Hãy khám phá kho đồ thể thao của chúng tôi ngay!
                        </p>
                        <button
                            onClick={() => navigate('/gear/catalog')}
                            className="bg-[#14b8a6] hover:bg-[#0f9e8c] text-white px-8 py-3 rounded-[8px] text-[13px] font-bold uppercase tracking-wide transition-colors cursor-pointer border-0 shadow-[0_4px_14px_rgba(20,184,166,0.3)]"
                        >
                            Khám phá danh mục
                        </button>
                    </div>
                </div>
            </GearLayout>
        );
    }

    // Safely calculate total to prevent 0 VND error if cartData isn't perfectly synced yet
    const calculatedTotal = cartItems.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
    const grandTotal = (cartData?.totalAmount && cartData.totalAmount > 0) ? cartData.totalAmount : calculatedTotal;
    const shipping = 0;

    return (
        <GearLayout>
            <div className="font-sans bg-[#F8F9FA] min-h-screen">
                {/* Expansive layout container max-w-1440px */}
                <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-10">

                    {/* ── HEADER ── */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-gray-400 mb-3">
                            <Link to="/gear/catalog" className="hover:text-[#14b8a6] transition-colors no-underline text-gray-400">
                                Cửa tiệm
                            </Link>
                            <span>/</span>
                            <span className="text-gray-700">Giỏ hàng</span>
                        </div>
                        <div className="flex items-end justify-between gap-4 flex-wrap mb-4">
                            <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-[#0f172a] m-0">
                                Giỏ hàng của bạn
                            </h1>
                            <p className="text-[13px] text-gray-500 m-0">
                                Bạn có <strong className="text-gray-900">{cartItems.length} thiết bị</strong> trong giỏ
                            </p>
                        </div>
                        <Link
                            to="/gear/catalog"
                            className="inline-flex items-center gap-2 text-[13px] font-bold text-gray-500 hover:text-[#14b8a6] transition-colors no-underline w-fit"
                        >
                            <ArrowLeft size={14} />
                            Tiếp tục mua sắm
                        </Link>
                    </div>

                    {/* ── MAIN GRID ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] gap-8 xl:gap-12 items-start">

                        {/* LEFT: Cart Items */}
                        <div className="bg-white rounded-[16px] shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">

                            {/* Column headers */}
                            <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_40px] gap-4 px-8 py-5 border-b border-gray-100 bg-gray-50/50">
                                <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Sản phẩm</span>
                                <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 text-center">Số lượng</span>
                                <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 text-right">Thành tiền</span>
                                <span />
                            </div>

                            {/* Items */}
                            {cartItems.map((item, idx) => (
                                <div
                                    key={item.cartItemId}
                                    className={`flex flex-col sm:flex-row items-center gap-6 px-8 py-6 transition-colors hover:bg-gray-50/30 ${idx < cartItems.length - 1 ? 'border-b border-gray-100' : ''}`}
                                >
                                    {/* Image */}
                                    <div className="w-24 h-24 rounded-[10px] bg-gray-50 flex items-center justify-center overflow-hidden shrink-0 border border-gray-100 p-2">
                                        <img
                                            src={resolveProductImage(item.equipmentName, item.category || 'Accessories', item.imageUrl || item.img || item.image)}
                                            alt={item.equipmentName}
                                            className="w-full h-full object-contain mix-blend-multiply"
                                            onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = CATEGORY_FALLBACKS.Accessories }}
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0 w-full">
                                        <h3 className="font-bold text-[15px] text-[#0f172a] m-0 mb-2 leading-snug">{item.equipmentName}</h3>
                                        <p className="text-[14px] text-gray-500 font-medium m-0">{formatVND(item.unitPrice)}</p>
                                    </div>

                                    {/* Quantity selector */}
                                    <div className="flex items-center gap-3 bg-gray-50 rounded-[10px] border border-gray-200 p-1.5 shrink-0">
                                        <button
                                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                            className="w-8 h-8 flex items-center justify-center rounded-[8px] text-gray-500 hover:bg-white hover:text-gray-900 hover:shadow-sm transition-all cursor-pointer bg-transparent border-0 disabled:opacity-30"
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="w-8 text-center font-bold text-[14px] text-[#0f172a]">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                            className="w-8 h-8 flex items-center justify-center rounded-[8px] text-gray-500 hover:bg-white hover:text-gray-900 hover:shadow-sm transition-all cursor-pointer bg-transparent border-0"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>

                                    {/* Subtotal */}
                                    <p className="font-bold text-[16px] text-[#0f172a] min-w-[130px] text-right m-0 hidden sm:block">
                                        {formatVND(item.unitPrice * item.quantity)}
                                    </p>

                                    {/* Delete */}
                                    <button
                                        onClick={() => removeFromCart(item.cartItemId)}
                                        className="w-10 h-10 flex items-center justify-center rounded-[10px] text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all cursor-pointer bg-transparent border-0 shrink-0 ml-2"
                                        title="Gỡ bỏ"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* RIGHT: Order Summary */}
                        <div className="sticky top-28">
                            <div className="bg-white rounded-[16px] shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-gray-100 p-8">
                                <h3 className="font-heading text-[16px] uppercase tracking-wider text-[#0f172a] m-0 mb-6">
                                    Tóm tắt đơn hàng
                                </h3>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[14px] text-gray-500">Tạm tính</span>
                                        <span className="text-[14px] font-bold text-[#0f172a]">{formatVND(grandTotal)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[14px] text-gray-500">Phí vận chuyển</span>
                                        <span className="text-[14px] font-bold text-[#14b8a6]">{shipping === 0 ? 'Miễn phí' : formatVND(shipping)}</span>
                                    </div>
                                </div>

                                <div className="border-t border-dashed border-gray-200 pt-5 mb-8">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[13px] font-bold uppercase tracking-wider text-gray-500">Tổng thanh toán</span>
                                        <span className="text-[28px] font-bold text-[#0f172a] leading-none tracking-tight">{formatVND(grandTotal + shipping)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate('/gear/cart/checkout')}
                                    className="w-full h-14 py-4 flex items-center justify-center gap-3 bg-[#14b8a6] hover:bg-[#0f9e8c] active:scale-[0.98] text-white rounded-[10px] text-[13px] font-bold uppercase tracking-wide transition-all cursor-pointer border-0 shadow-[0_6px_20px_rgba(20,184,166,0.35)]"
                                >
                                    <CreditCard size={18} />
                                    Tiến hành thanh toán
                                </button>

                                <div className="flex items-center justify-center gap-2 mt-5">
                                    <ShieldCheck size={14} className="text-gray-300" />
                                    <p className="text-[12px] text-gray-400 font-medium m-0 text-center">
                                        Đảm bảo thiết bị chính hãng 100%
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── CROSS SELL SECTION ── */}
                    <div className="mt-20 pt-16 border-t border-gray-200/60">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="font-heading text-2xl uppercase tracking-tight text-[#0f172a] m-0">Có thể bạn sẽ thích</h2>
                            <Link to="/gear/catalog" className="text-[13px] font-bold text-gray-400 hover:text-[#14b8a6] transition-colors no-underline">Xem tất cả</Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {CROSS_SELL_ITEMS.map(product => (
                                <Link 
                                    to="/gear/catalog" 
                                    key={product.id} 
                                    className="bg-white rounded-[12px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col group hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all no-underline relative"
                                >
                                    <div className="w-full h-32 bg-gray-50 rounded-[8px] flex items-center justify-center mb-4 overflow-hidden p-2 relative">
                                        <img src={product.img} alt={product.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 m-0 mb-1.5">{product.category}</p>
                                    <h4 className="font-bold text-[13px] text-[#0f172a] m-0 mb-3 leading-snug flex-1">{product.name}</h4>
                                    <div className="flex items-end justify-between">
                                        <span className="font-bold text-[14px] text-gray-900 leading-none">{formatVND(product.price)}</span>
                                        <button 
                                            onClick={(e) => { e.preventDefault(); addToCart(product.id, 1) }}
                                            className="w-8 h-8 rounded-full bg-[#14b8a6] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-[0_4px_10px_rgba(20,184,166,0.3)] border-0 cursor-pointer -mt-4 translate-y-2 group-hover:translate-y-0"
                                        >
                                            <ShoppingCart size={12} />
                                        </button>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </GearLayout>
    );
}
