import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { bookingApi } from '../../api/bookingApi';
import { cartApi } from '../../api/cartApi';
import GearLayout from '../../layouts/GearLayout';
import { ShoppingCart, Calendar, Info, ArrowLeft, CheckCircle2, ChevronRight, MapPin } from 'lucide-react';
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
    const [userBookings, setUserBookings] = useState([]);
    const [selectedBookingId, setSelectedBookingId] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserBookings();
    }, []);

    async function fetchUserBookings() {
        try {
            setLoading(true);
            const response = await bookingApi.getMyBookings();
            if (response && response.statusCode === 200) {
                // Chỉ lấy các booking sắp tới hoặc đang hiệu lực
                const active = response.data.filter(b => b.status === 'Pending' || b.status === 'Paid');
                setUserBookings(active);
            }
        } catch (error) {
            console.error('Lỗi khi tải danh sách booking:', error);
        } finally {
            setLoading(false);
        }
    };

    async function handleCheckout() {
        setIsProcessing(true);
        try {
            const payload = {
                bookingId: selectedBookingId ? parseInt(selectedBookingId) : null
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

    if (cartLoading || loading) {
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
                    <div className="max-w-md mx-auto card-base p-10">
                        <h2 className="section-title text-2xl mb-4">Mọi thứ đã xong!</h2>
                        <p className="text-brand-500 mb-8 font-medium">Giỏ hàng của bạn đã hoàn tất hoặc không có sản phẩm nào để thanh toán.</p>
                        <button onClick={() => navigate('/gear/catalog')} className="btn-primary w-full">Về cửa hàng</button>
                    </div>
                </div>
            </GearLayout>
        );
    }

    const totalRental = cartData?.totalRentalPrice || 0;
    const totalDeposit = cartData?.totalDepositAmount || 0;
    const surcharge = selectedBookingId ? 0 : totalRental * 0.3;
    const grandTotal = totalRental + totalDeposit + surcharge;

    return (
        <GearLayout>
            <div className="bg-brand-50/50 min-h-screen pb-20">
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
                            {/* Booking Selection Section */}
                            <div className="card-base p-8 border-none shadow-xl shadow-brand-900/5 bg-white relative overflow-hidden animate-fade-up">
                                <div className="absolute top-0 left-0 w-2 h-full bg-accent"></div>
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-12 h-12 bg-accent/5 rounded-2xl flex items-center justify-center text-accent shrink-0">
                                        <Calendar size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-brand-900 mb-1">Bạn có đặt sân ProSport?</h3>
                                        <p className="text-sm text-brand-500 font-medium leading-relaxed">
                                            Chọn một lượt đặt sân khả dụng của bạn để được <span className="text-accent font-bold">MIỄN PHÍ</span> surcharge 30%.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="relative group">
                                        <select
                                            value={selectedBookingId}
                                            onChange={(e) => setSelectedBookingId(e.target.value)}
                                            className="auth-input appearance-none pl-12 pr-10 cursor-pointer"
                                        >
                                            <option value="">Không kèm đặt sân (+30% surcharge)</option>
                                            {userBookings.map(b => (
                                                <option key={b.bookingId} value={b.bookingId}>
                                                    Booking #{b.bookingId} - {b.courtName} ({new Date(b.date).toLocaleDateString()})
                                                </option>
                                            ))}
                                        </select>
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-400 group-hover:text-accent transition-colors" size={20} />
                                    </div>

                                    {!selectedBookingId && (
                                        <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100/50">
                                            <Info size={18} className="text-amber-500 shrink-0" />
                                            <p className="text-xs text-amber-700 leading-relaxed font-medium">
                                                Thuê lẻ sẽ chịu phụ phí <span className="font-bold underline">30% phí vận chuyển & quản lý</span>. Hãy đặt sân trước để nhận ưu đãi!
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

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
                                
                                <div className="space-y-5 border-b border-brand-100 pb-8 mb-8">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-brand-500 font-medium">Tổng tiền đồ</span>
                                        <span className="text-brand-900 font-bold">{formatVND(totalRental)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-brand-500 font-medium">Tiền cọc thiết bị</span>
                                        <span className="text-brand-900 font-bold">{formatVND(totalDeposit)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="text-brand-500 font-medium">Phụ phí thuê lẻ</span>
                                            {selectedBookingId && <CheckCircle2 size={14} className="text-emerald-500" />}
                                        </div>
                                        <span className={`font-bold ${surcharge > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                                            {surcharge > 0 ? `+ ${formatVND(surcharge)}` : 'Miễn phí'}
                                        </span>
                                    </div>
                                </div>

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
                                            <p className="text-xs text-brand-500 font-medium">Quầy Support - ProSport Arena (Tầng 1)</p>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-center text-brand-400 font-bold leading-relaxed px-4">
                                        Bằng cách nhấn xác nhận, bạn đồng ý với các Điều khoản Thuê thiết bị và chính sách hoàn cọc của chúng tôi.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GearLayout>
    );
}