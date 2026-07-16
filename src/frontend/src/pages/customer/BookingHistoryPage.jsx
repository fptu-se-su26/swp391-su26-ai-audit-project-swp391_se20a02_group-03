import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { bookingApi } from '../../api/bookingApi'
import { paymentApi } from '../../api/paymentApi'
import { useToast } from '../../components/Toast'
import { useConfirm, BOOKING_CANCEL_CONFIRM } from '../../components/ui/ConfirmDialog'
import PageLoader from '../../components/ui/PageLoader'
import EmptyState from '../../components/ui/EmptyState'
import { CalendarDays, Clock, MapPin, SearchX, CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react'
import { statusLabels } from '../../utils/labels'

const FILTERS = [
  { value: 'All', label: 'Tất cả' },
  { value: 'Upcoming', label: 'Sắp tới / Chờ duyệt' },
  { value: 'Completed', label: 'Đã hoàn thành' },
  { value: 'Cancelled', label: 'Đã hủy' },
]

export default function BookingHistoryPage() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();
  const confirm = useConfirm();
  const navigate = useNavigate();

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await bookingApi.getMyBookings();
      if (res.statusCode === 200 && res.data) {
        setBookings(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      addToast('Lỗi khi tải lịch sử đặt sân', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  async function handleCancel(bookingId) {
    const ok = await confirm(BOOKING_CANCEL_CONFIRM);
    if (!ok) return;
    addToast('Đang hủy đặt sân...', 'info');
    try {
      const res = await bookingApi.cancelBooking(bookingId);
      if (res.statusCode === 200) {
        addToast(res.message || 'Hủy đặt sân thành công', 'success');
        fetchBookings(); // Reload data
      } else {
        addToast(res.message || 'Lỗi khi hủy đặt sân', 'error');
      }
    } catch (error) {
      addToast(typeof error === 'string' ? error : (error?.message || 'Có lỗi xảy ra'), 'error');
    }
  };

  async function handlePayment(bookingId, amount) {
      try {
          const vnpayRes = await paymentApi.createVnPayUrl(amount, 'Booking', bookingId);
          if (vnpayRes.statusCode === 200 && vnpayRes.data) {
              window.location.assign(vnpayRes.data);
          } else {
              addToast("Không thể tạo link thanh toán VNPay", "error");
          }
      } catch(error) {
          addToast(error?.message || "Có lỗi xảy ra", "error");
      }
  }

  const filteredBookings = bookings.filter(b => {
    if (filter === 'All') return true;
    if (filter === 'Upcoming') return b.status === 'Confirmed' || b.status === 'Pending';
    if (filter === 'Completed') return b.status === 'Completed';
    if (filter === 'Cancelled') return b.status === 'Cancelled';
    return true;
  });

  function formatTime(t) {
    if (!t) return '';
    return t.length > 5 ? t.slice(0, 5) : t;
  }

  const getDeadlineRemaining = useCallback((deadline) => {
    if (!deadline) return null;
    const deadlineTime = new Date(deadline).getTime();
    const now = Date.now();
    const diff = deadlineTime - now;
    if (diff <= 0) return 'Hết hạn';
    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return `${mins}:${String(secs).padStart(2, '0')}`;
  }, []);

  const [, setTick] = useState(0);
  useEffect(() => {
    const hasPending = bookings.some(b => b.status === 'Pending' && b.paymentDeadline);
    if (!hasPending) return;
    const timer = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, [bookings]);

  function getStatusUI(status) {
      switch(status) {
          case 'Confirmed': return { bg: 'bg-[#14b8a6]/10', text: 'text-[#14b8a6]', icon: <CheckCircle2 size={12} /> };
          case 'Completed': return { bg: 'bg-blue-50', text: 'text-blue-600', icon: <CheckCircle2 size={12} /> };
          case 'Pending': return { bg: 'bg-orange-50', text: 'text-orange-500', icon: <Clock size={12} /> };
          case 'Cancelled': return { bg: 'bg-red-50', text: 'text-red-500', icon: <XCircle size={12} /> };
          case 'Refunded': return { bg: 'bg-gray-100', text: 'text-gray-500', icon: <RefreshCw size={12} /> };
          default: return { bg: 'bg-gray-100', text: 'text-gray-500', icon: <AlertCircle size={12} /> };
      }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FA] font-sans">
      <Navbar theme="light" />

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 pt-[100px] sm:pt-[120px] pb-24 w-full flex-1">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-[#0f172a] mb-2 m-0">Lịch sử đặt sân</h1>
            <p className="text-[14px] text-gray-500 m-0">Theo dõi các lượt đặt sân và trạng thái thanh toán của bạn.</p>
          </div>
          <button 
            onClick={() => navigate('/courts')}
            className="h-12 px-6 bg-[#14b8a6] hover:bg-[#0f9e8c] text-white rounded-full text-[13px] font-bold uppercase tracking-wide transition-all shadow-[0_4px_14px_rgba(20,184,166,0.25)] border-0 cursor-pointer whitespace-nowrap w-fit"
          >
            + Đặt sân mới
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`h-10 px-5 rounded-full text-[13px] font-bold transition-all border-0 cursor-pointer ${
                  filter === f.value 
                  ? 'bg-[#14b8a6] text-white shadow-md' 
                  : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="py-20 flex justify-center"><PageLoader message="Đang tải lịch sử..." /></div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-[20px] shadow-[0_2px_16px_rgba(0,0,0,0.04)] border border-gray-100 py-24 px-6 text-center mt-6">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <SearchX className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="font-heading text-xl uppercase tracking-tight text-[#0f172a] mb-2 m-0">Chưa có dữ liệu</h3>
              <p className="text-[14px] text-gray-500 mb-6">Bạn chưa có lượt đặt sân nào trong danh mục này.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredBookings.map(b => {
              const statusUI = getStatusUI(b.status);
              const isExpired = getDeadlineRemaining(b.paymentDeadline) === 'Hết hạn';
              
              return (
                <div key={b.bookingId} className="bg-white rounded-[16px] shadow-[0_2px_16px_rgba(0,0,0,0.04)] border border-gray-100 p-6 flex flex-col hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all">
                  
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="flex gap-4 items-center min-w-0">
                      <div className="w-12 h-12 rounded-[12px] bg-teal-50 flex items-center justify-center text-[#14b8a6] shrink-0">
                        <CalendarDays size={22} strokeWidth={1.5} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-[16px] text-[#0f172a] m-0 mb-1.5 truncate">
                          {b.details?.[0]?.courtName || 'Sân chưa xác định'}
                        </h3>
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${statusUI.bg} ${statusUI.text}`}>
                          {statusUI.icon}
                          {statusLabels[b.status] || b.status}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="space-y-3 mb-6 flex-1">
                    <div className="flex items-center gap-3 text-[14px] text-gray-600">
                      <Clock size={16} className="text-gray-400" />
                      <span>{new Date(b.details?.[0]?.bookingDate).toLocaleDateString('vi-VN')} • {formatTime(b.details?.[0]?.startTime)} - {formatTime(b.details?.[0]?.endTime)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[14px] text-gray-600">
                      <MapPin size={16} className="text-gray-400" />
                      <span className="font-mono text-[13px] text-gray-500">Mã đơn: #{b.bookingId}</span>
                    </div>

                    {b.status === 'Pending' && b.paymentDeadline && (
                      <div className={`mt-3 p-3 rounded-[8px] text-[13px] font-medium flex items-center gap-2 ${isExpired ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-600'}`}>
                        <Clock size={16} />
                        {isExpired ? 'Đã hết hạn thanh toán' : `Còn ${getDeadlineRemaining(b.paymentDeadline)} để thanh toán`}
                      </div>
                    )}

                    {b.status === 'Confirmed' && b.checkInCode && (
                      <div className="mt-4 p-3.5 bg-[#14b8a6]/10 rounded-[10px] border border-[#14b8a6]/20 flex items-center justify-between">
                        <span className="text-[13px] font-bold text-[#14b8a6] uppercase tracking-wider">Mã vào sân</span>
                        <span className="font-mono font-bold text-[16px] text-[#0f172a] bg-white px-3 py-1 rounded-[6px] shadow-sm tracking-[0.2em]">{b.checkInCode}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="border-t border-dashed border-gray-200 pt-5 flex items-end justify-between gap-4 mt-auto">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 m-0 mb-1">Tổng tiền</p>
                      <p className="font-heading text-xl text-[#0f172a] m-0">{b.totalAmount.toLocaleString('vi-VN')} đ</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {(b.status === 'Confirmed' || (b.status === 'Pending' && !isExpired)) && (
                        <button 
                          onClick={() => handleCancel(b.bookingId)} 
                          className="h-10 px-4 rounded-[8px] border-2 border-red-100 text-red-500 hover:bg-red-50 text-[12px] font-bold uppercase tracking-wide transition-colors cursor-pointer bg-white"
                        >
                          Hủy sân
                        </button>
                      )}
                      
                      {b.status === 'Pending' && !isExpired && (
                        <button 
                          onClick={() => handlePayment(b.bookingId, b.totalAmount)} 
                          className="h-10 px-5 rounded-[8px] bg-[#14b8a6] hover:bg-[#0f9e8c] text-white text-[12px] font-bold uppercase tracking-wide transition-colors shadow-[0_4px_12px_rgba(20,184,166,0.25)] border-0 cursor-pointer"
                        >
                          Thanh toán
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer variant="light" />
    </div>
  )
}
