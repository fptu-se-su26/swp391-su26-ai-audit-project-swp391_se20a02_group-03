import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { cartApi } from '../../api/cartApi';
import ApexLayout from '../../layouts/ApexLayout';
import { ShoppingCart, ArrowLeft, CheckCircle2, ChevronRight, MapPin, Package } from 'lucide-react';
import { useToast } from '../../components/Toast';

function formatVND(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
};

export default function CartCheckoutPage() {
    const navigate = useNavigate();
    const { cartItems, cartData, clearCart, loading: cartLoading } = useCart();
    const { addToast } = useToast();
    const [isProcessing, setIsProcessing] = useState(false);

    async function handleCheckout() {
        setIsProcessing(true);
        try {
            const payload = {
                bookingId: null
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
            addToast('Lỗi kết nối server', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    if (cartLoading) {
        return (
            <ApexLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <Package size={64} className="text-brand-300" />
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
                </div>
            </ApexLayout>
        );
    }

    if (cartItems.length === 0) {
        return (
            <ApexLayout>
                <div className="container py-20 text-center">
                    <div className="max-w-md mx-auto card-base p-10">
                        <h2 className="section-title text-2xl mb-4">Mọi thứ đã xong!</h2>
                        <p className="text-brand-500 mb-8 font-medium">Giỏ hàng của bạn đã hoàn tất hoặc không có sản phẩm nào để thanh toán.</p>
                        <button onClick={() => navigate('/gear/catalog')} className="btn-primary w-full">Về cửa hàng</button>
                    </div>
                </div>
            </ApexLayout>
        );
    }

    const grandTotal = cartData?.totalAmount || 0;

    return (
        <ApexLayout>
            <div className="bg-brand-50/50 min-h-screen pb-20 pt-8">
                <div className="container pt-8">
                    {/* Header */}
                    <div className="flex flex-col mb-8 animate-fade-up">
                        <div className="flex items-center gap-2 text-xs font-bold text-brand-400 uppercase tracking-widest mb-2">
                            <span>Giỏ hàng</span>
                            <ChevronRight size={12} />
                            <span className="text-brand-900">Thanh toán</span>
                        </div>
                        <h1 className="section-title text-4xl">Xác nhận thanh toán</h1>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Order Details */}
                        <div className="lg:col-span-8 flex flex-col gap-6">

                            {/* Item List (Simplified) */}
                            <div className="card-base p-0 overflow-hidden animate-fade-up" style={{ animationDelay: '0.1s' }}>
                                <div className="p-6 bg-brand-50/50 border-b border-brand-100 flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-brand-900 uppercase tracking-widest flex items-center gap-2">
                                        <ShoppingCart size={16} /> Danh sách thiết bị
                                    </h3>
                                    <span className="text-xs font-bold text-brand-400">{cartItems.length} mục</span>
                                </div>
                                <div className="divide-y divide-brand-100">
                                    {cartItems.map((item) => (
                                        <div key={item.cartItemId} className="p-6 flex items-center justify-between hover:bg-brand-50/20 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-brand-50 rounded-lg overflow-hidden border border-brand-100 p-1 flex-shrink-0">
                                                    <img src={item.imageUrl || item.img || item.image || `https://images.unsplash.com/photo-1519704943920-dec0fa3c114f?q=80&w=100&auto=format&fit=crop`} alt="" className="w-full h-full object-cover rounded opacity-80" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-brand-900">{item.equipmentName}</p>
                                                    <p className="text-[10px] text-brand-400 font-bold uppercase">{item.quantity} x {formatVND(item.unitPrice)}</p>
                                                </div>
                                            </div>
                                            <p className="text-sm font-bold text-brand-900">{formatVND(item.unitPrice * item.quantity)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Link to="/gear/cart" className="inline-flex items-center gap-2 text-brand-500 hover:text-accent font-bold text-sm mt-2 transition-colors">
                                <ArrowLeft size={16} />
                                Chỉnh sửa giỏ hàng
                            </Link>
                        </div>

                        {/* Order Summary Summary Panel */}
                        <div className="lg:col-span-4 sticky top-24">
                            <div className="card-base p-8 shadow-2xl shadow-brand-900/10 animate-fade-up" style={{ animationDelay: '0.2s' }}>
                                <h3 className="section-title text-xl mb-8">Thanh toán</h3>

                                <div className="space-y-2 mb-10">
                                    <div className="flex justify-between items-end">
                                        <span className="text-base font-bold text-brand-900">Tổng cộng</span>
                                        <span className="text-3xl font-black text-brand-900 tracking-tighter">{formatVND(grandTotal)}</span>
                                    </div>
                                    <p className="text-[10px] text-right text-brand-400 font-bold uppercase">Bao gồm thuế và phí dịch vụ</p>
                                </div>

                                <button 
                                    onClick={handleCheckout}
                                    disabled={isProcessing}
                                    className={`auth-btn flex items-center justify-center gap-3 py-4 text-base ${isProcessing ? 'opacity-70' : 'bg-brand-900'}`}
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                            Xử lý...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 size={20} />
                                            Xác nhận Thanh toán
                                        </>
                                    )}
                                </button>
                                
                                <div className="mt-8 flex flex-col gap-4">
                                    <div className="p-4 bg-brand-50 rounded-2xl flex items-start gap-3 border border-brand-100/50">
                                        <MapPin size={18} className="text-brand-400 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-900 mb-1">Địa điểm nhận</p>
                                            <p className="text-xs text-brand-500 font-medium">Quầy hỗ trợ - ProSport Arena (Tầng 1)</p>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-center text-brand-400 font-bold leading-relaxed px-4">
                                        Bằng cách nhấn xác nhận, bạn đồng ý với các Điều khoản Mua thiết bị của chúng tôi.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ApexLayout>
    );
}