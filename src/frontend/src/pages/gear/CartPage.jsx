import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus, CreditCard } from 'lucide-react';
import GearLayout from '../../layouts/GearLayout';

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
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
                </div>
            </GearLayout>
        );
    }

    if (cartItems.length === 0) {
        return (
            <GearLayout>
                <div className="container py-20 text-center">
                    <div className="max-w-md mx-auto card-base p-10 animate-fade-up">
                        <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="text-brand-300" size={40} />
                        </div>
                        <h2 className="section-title text-2xl mb-2">Giỏ hàng đang trống</h2>
                        <p className="text-brand-500 mb-8 font-medium">Bạn chưa thêm thiết bị nào vào giỏ hàng. Hãy khám phá kho đồ thể thao của chúng tôi ngay!</p>
                        <button 
                            onClick={() => navigate('/gear/catalog')} 
                            className="btn-primary w-full py-4 text-base"
                        >
                            Khám phá Catalog
                        </button>
                    </div>
                </div>
            </GearLayout>
        );
    }

    const totalRental = cartData?.totalRentalPrice || 0;
    const totalDeposit = cartData?.totalDepositAmount || 0;
    const grandTotal = totalRental + totalDeposit;

    return (
        <GearLayout>
            <div className="bg-brand-50/50 min-h-screen pb-20">
                <div className="container pt-8">
                    {/* Header & Breadcrumb */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                        <div>
                            <div className="flex items-center gap-2 text-xs font-bold text-brand-400 uppercase tracking-widest mb-2">
                                <Link to="/gear/catalog" className="hover:text-accent transition-colors">Catalog</Link>
                                <span>/</span>
                                <span className="text-brand-900">Giỏ hàng</span>
                            </div>
                            <h1 className="section-title text-4xl">Giỏ hàng của bạn</h1>
                        </div>
                        <p className="text-brand-500 font-medium">Bạn có <span className="text-brand-900 font-bold">{cartItems.length} thiết bị</span> trong giỏ</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Items List */}
                        <div className="lg:col-span-8 flex flex-col gap-4">
                            {cartItems.map((item, index) => (
                                <div 
                                    key={item.cartItemId} 
                                    className="card-base p-4 flex flex-col sm:flex-row items-center gap-6 group hover:shadow-md transition-all duration-300 animate-fade-up"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    {/* Image Placeholder - Backend should provide image URL */}
                                    <div className="w-24 h-24 bg-brand-50 rounded-xl overflow-hidden flex-shrink-0 border border-brand-100 group-hover:border-accent/20 transition-colors">
                                        <img 
                                            src={item.imageUrl || item.img || item.image || `https://images.unsplash.com/photo-1519704943920-dec0fa3c114f?q=80&w=200&auto=format&fit=crop`} 
                                            alt={item.equipmentName} 
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-accent bg-accent/5 px-2 py-0.5 rounded">Rental</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-brand-900 truncate mb-1 group-hover:text-accent transition-colors">{item.equipmentName}</h3>
                                        <p className="text-brand-400 text-sm font-medium">{formatVND(item.unitPrice)} / ngày</p>
                                    </div>

                                    <div className="flex items-center gap-8 justify-between w-full sm:w-auto">
                                        {/* Quantity */}
                                        <div className="flex items-center bg-brand-50 rounded-xl border border-brand-100 p-1">
                                            <button 
                                                onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                                className="w-8 h-8 flex items-center justify-center text-brand-400 hover:text-brand-900 hover:bg-white rounded-lg transition-all"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-10 text-center font-bold text-brand-900 text-sm border-none bg-transparent">{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center text-brand-400 hover:text-brand-900 hover:bg-white rounded-lg transition-all"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>

                                        <div className="text-right min-w-[120px]">
                                            <p className="text-base font-bold text-brand-900">{formatVND(item.unitPrice * item.quantity)}</p>
                                        </div>

                                        <button 
                                            onClick={() => removeFromCart(item.cartItemId)}
                                            className="w-10 h-10 flex items-center justify-center bg-brand-50 text-brand-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all border border-brand-100"
                                            title="Gỡ bỏ"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <Link to="/gear/catalog" className="inline-flex items-center gap-2 text-brand-500 hover:text-accent font-bold text-sm mt-4 transition-colors group">
                                <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                                Quay lại Catalog
                            </Link>
                        </div>

                        {/* Summary Panel */}
                        <div className="lg:col-span-4 sticky top-24">
                            <div className="card-base p-8 shadow-xl shadow-brand-900/5 animate-fade-up" style={{ animationDelay: '0.3s' }}>
                                <h3 className="section-title text-xl mb-6">Tóm tắt đơn hàng</h3>
                                
                                <div className="flex flex-col gap-4 mb-6 border-b border-brand-100 pb-6">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-brand-500 font-medium">Tổng tiền thuê</span>
                                        <span className="text-brand-900 font-bold">{formatVND(totalRental)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-brand-500 font-medium">Tiền cọc</span>
                                            <span className="text-[10px] font-bold bg-brand-50 px-1.5 py-0.5 rounded text-brand-400">20%</span>
                                        </div>
                                        <span className="text-brand-900 font-bold">{formatVND(totalDeposit)}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mb-8">
                                    <span className="text-lg font-bold text-brand-900">Tổng thanh toán</span>
                                    <span className="text-2xl font-black text-accent tracking-tighter">{formatVND(grandTotal)}</span>
                                </div>

                                <button 
                                    onClick={() => navigate('/gear/cart/checkout')}
                                    className="btn-primary w-full py-4 text-base shadow-lg shadow-brand-900/10 flex items-center justify-center gap-3"
                                >
                                    <CreditCard size={20} />
                                    Tiến hành Thanh toán
                                </button>
                                
                                <div className="mt-6 flex flex-col gap-3">
                                    <div className="flex items-center gap-3 text-[10px] text-brand-400 font-bold uppercase tracking-widest pl-2 border-l-2 border-emerald-500">
                                        Đảm bảo chất lượng thiết bị
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] text-brand-400 font-bold uppercase tracking-widest pl-2 border-l-2 border-brand-200">
                                        Hoàn cọc ngay khi trả đồ
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GearLayout>
    );
}