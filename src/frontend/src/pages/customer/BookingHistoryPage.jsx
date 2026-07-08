import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { bookingApi } from '../../api/bookingApi'
import { paymentApi } from '../../api/paymentApi'
import { useToast } from '../../components/Toast'
import { useConfirm, BOOKING_CANCEL_CONFIRM } from '../../components/ui/ConfirmDialog'
import StatusBadge from '../../components/ui/StatusBadge'
import PageLoader from '../../components/ui/PageLoader'
import EmptyState from '../../components/ui/EmptyState'
import { CalendarDays } from 'lucide-react'

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
    // HIGH FIX: Removed incorrect queueMicrotask wrapper — call fetchBookings directly inside useEffect
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
      // For simplicity, direct to VNPay. In a real app, you might want to show a modal to choose payment method.
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

  // Tính thời gian còn lại cho PaymentDeadline
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

  // Refresh countdown mỗi giây
  const [, setTick] = useState(0);
  useEffect(() => {
    const hasPending = bookings.some(b => b.status === 'Pending' && b.paymentDeadline);
    if (!hasPending) return;
    const timer = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, [bookings]);

  return (
    <div className="flex flex-col min-h-screen bg-background-base">
      <Navbar theme="light" />

      <div className="max-w-[1000px] mx-auto px-6 pt-[100px] sm:pt-[130px] pb-20 w-full flex-1">
        <div className="flex flex-wrap items-end justify-between gap-5 mb-8">
          <div>
            <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground mb-2">Lịch sử đặt sân</h1>
            <p className="text-sm text-foreground-muted">Theo dõi các lượt đặt sân và trạng thái thanh toán của bạn.</p>
          </div>
          <Link to="/courts" className="btn-primary no-underline">
            + Đặt sân mới
          </Link>
        </div>

        <div className="border-2 border-border-strong bg-surface overflow-hidden">
          <div className="flex border-b-2 border-border-strong overflow-x-auto">
            {FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`flex-1 min-w-[120px] py-4 label-mono transition-colors ${filter === f.value ? 'text-accent border-b-2 border-accent -mb-[2px] bg-surface-hover' : 'text-foreground-muted hover:text-foreground'}`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="p-4 sm:p-6">
            {isLoading ? (
              <PageLoader label="Đang tải lịch sử..." />
            ) : filteredBookings.length === 0 ? (
              <EmptyState title="Chưa có dữ liệu" subtitle="Chưa có lượt đặt sân nào phù hợp." />
            ) : (
            <div className="flex flex-col gap-4">
              {filteredBookings.map(b => (
                <div key={b.bookingId} className="border-2 border-border-default hover:border-border-hover transition-colors p-5 flex flex-wrap gap-4 items-center justify-between">
                  <div className="flex gap-4 items-center min-w-0">
                    <div className="w-12 h-12 border-2 border-border-strong bg-background-base flex items-center justify-center text-accent shrink-0">
                      <CalendarDays size={22} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-extrabold text-foreground">{b.details?.[0]?.courtName || 'Sân chưa xác định'}</h3>
                        <StatusBadge status={b.status} />
                      </div>
                      <p className="text-sm text-foreground-muted">{new Date(b.details?.[0]?.bookingDate).toLocaleDateString('vi-VN')} • {formatTime(b.details?.[0]?.startTime)} - {formatTime(b.details?.[0]?.endTime)}</p>
                      <p className="label-mono text-foreground-subtle mt-1">Mã đơn: #{b.bookingId}</p>

                      {/* Countdown thanh toán cho Pending */}
                      {b.status === 'Pending' && b.paymentDeadline && (
                        <p className={`text-xs font-bold mt-1.5 ${getDeadlineRemaining(b.paymentDeadline) === 'Hết hạn' ? 'text-danger' : 'text-warning'}`}>
                          ⏳ {getDeadlineRemaining(b.paymentDeadline) === 'Hết hạn' ? 'Đã hết hạn thanh toán' : `Còn ${getDeadlineRemaining(b.paymentDeadline)} để thanh toán`}
                        </p>
                      )}

                      {/* Mã Check-in cho Confirmed */}
                      {b.status === 'Confirmed' && b.checkInCode && (
                        <p className="text-xs mt-1.5 flex items-center gap-1.5">
                          <span className="text-foreground-subtle">Mã vào sân:</span>
                          <span className="font-mono font-bold text-accent bg-background-base border border-border-default px-2 py-0.5">{b.checkInCode}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right max-sm:text-left">
                      <p className="label-mono text-foreground-subtle mb-0.5">Tổng tiền</p>
                      <p className="font-heading text-lg text-foreground">{b.totalAmount.toLocaleString('vi-VN')} đ</p>
                    </div>

                    <div className="flex gap-2">
                      {b.status === 'Pending' && (
                        <button onClick={() => handlePayment(b.bookingId, b.totalAmount)} className="btn-primary text-xs">Thanh toán</button>
                      )}
                      {(b.status === 'Confirmed' || b.status === 'Pending') && (
                        <button onClick={() => handleCancel(b.bookingId)} className="px-4 h-10 border-2 border-danger text-danger text-xs font-bold uppercase tracking-[0.04em] rounded-[2px] hover:bg-danger-bg transition-colors">Hủy sân</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        </div>
      </div>

      <Footer variant="light" />
    </div>
  )
}
