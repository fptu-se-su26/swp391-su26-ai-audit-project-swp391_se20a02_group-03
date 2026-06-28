import { useState, useEffect, useCallback } from 'react'
import { Calendar, Swords, Circle, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import ApexLayout from '../../layouts/ApexLayout'
import { bookingApi } from '../../api/bookingApi'
import { paymentApi } from '../../api/paymentApi'
import { useToast } from '../../components/Toast'
import { useConfirm, BOOKING_CANCEL_CONFIRM } from '../../components/ui/ConfirmDialog'
import StatusBadge from '../../components/ui/StatusBadge'
import EmptyState from '../../components/ui/EmptyState'

const filterTabs = [
  { id: 'All', label: 'Tất cả' },
  { id: 'Upcoming', label: 'Sắp tới' },
  { id: 'Completed', label: 'Đã hoàn thành' },
  { id: 'Cancelled', label: 'Đã hủy' },
]

export default function ApexBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [filter, setFilter] = useState('All')
  const [isLoading, setIsLoading] = useState(true)
  const { addToast } = useToast()
  const confirm = useConfirm()

  const fetchBookings = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await bookingApi.getMyBookings()
      if (res.statusCode === 200 && res.data) {
        setBookings(res.data)
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
      addToast('Lỗi khi tải lịch sử đặt sân', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    queueMicrotask(fetchBookings)
  }, [fetchBookings])

  async function handleCancel(bookingId) {
    const ok = await confirm(BOOKING_CANCEL_CONFIRM)
    if (!ok) return
    try {
      const res = await bookingApi.cancelBooking(bookingId)
      if (res.statusCode === 200) {
        addToast(res.message || 'Hủy đặt sân thành công', 'success')
        fetchBookings()
      } else {
        addToast(res.message || 'Lỗi khi hủy đặt sân', 'error')
      }
    } catch (error) {
      addToast(typeof error === 'string' ? error : (error?.message || 'Có lỗi xảy ra'), 'error')
    }
  }

  async function handlePayment(bookingId, amount) {
    try {
      const vnpayRes = await paymentApi.createVnPayUrl(amount, 'Booking', bookingId)
      if (vnpayRes.statusCode === 200 && vnpayRes.data) {
        window.location.assign(vnpayRes.data)
      } else {
        addToast('Không thể tạo link thanh toán VNPay', 'error')
      }
    } catch (error) {
      addToast(error?.message || 'Có lỗi xảy ra', 'error')
    }
  }

  const filteredBookings = bookings.filter(b => {
    if (filter === 'All') return true
    if (filter === 'Upcoming') return b.status === 'Confirmed' || b.status === 'Pending'
    if (filter === 'Completed') return b.status === 'Completed'
    if (filter === 'Cancelled') return b.status === 'Cancelled'
    return true
  })

  function formatTime(t) {
    if (!t) return ''
    return t.length > 5 ? t.slice(0, 5) : t
  }

  // Countdown for payment deadline
  const getDeadlineRemaining = useCallback((deadline) => {
    if (!deadline) return null
    const diff = new Date(deadline).getTime() - Date.now()
    if (diff <= 0) return 'Hết hạn'
    const mins = Math.floor(diff / 60000)
    const secs = Math.floor((diff % 60000) / 1000)
    return `${mins}:${String(secs).padStart(2, '0')}`
  }, [])

  // Refresh countdown every second
  const [, setTick] = useState(0)
  useEffect(() => {
    const hasPending = bookings.some(b => b.status === 'Pending' && b.paymentDeadline)
    if (!hasPending) return
    const timer = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(timer)
  }, [bookings])

  return (
    <ApexLayout>
      <div className="max-w-[1000px] mx-auto animate-fade-up">
        {/* Header */}
        <div className="flex max-sm:flex-col sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[var(--theme-primary)] tracking-tight">Lịch sử đặt sân</h1>
            <p className="text-sm text-foreground-muted mt-1">Quản lý tất cả lịch đặt sân, thanh toán và trạng thái nhận sân.</p>
          </div>
          <Link to="/apex/booking" className="btn-primary shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Đặt sân mới
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-[var(--theme-surface)] border border-border-default p-1 rounded-xl mb-6 w-fit max-w-full overflow-x-auto shadow-[0_0_15px_rgba(255,255,255,0.02)]">
          {filterTabs.map(t => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 whitespace-nowrap flex items-center ${
                filter === t.id
                  ? 'bg-[var(--theme-surface-hover)] text-[var(--theme-primary)] shadow-sm ring-1 ring-white/20'
                  : 'text-foreground-muted hover:text-[var(--theme-primary)] hover:bg-[var(--theme-surface)]'
              }`}
            >
              {t.label}
              {filter === t.id && (
                <span className="ml-2 text-[11px] font-bold bg-[var(--theme-surface-hover)] text-[var(--theme-primary)] px-1.5 py-0.5 rounded">
                  {filteredBookings.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <EmptyState
            icon={<Calendar size={48} className="text-foreground-muted mb-2" />}
            title="Chưa có lịch đặt sân"
            subtitle={filter === 'All' ? 'Bạn chưa đặt sân nào. Hãy bắt đầu đặt sân đầu tiên!' : `Không có đặt sân nào ở trạng thái "${filterTabs.find(t => t.id === filter)?.label}".`}
            action={
              filter === 'All'
                ? <Link to="/apex/booking" className="btn-primary text-sm">Đặt sân ngay</Link>
                : <button className="btn-outline text-sm" onClick={() => setFilter('All')}>Xem tất cả</button>
            }
          />
        ) : (
          <div className="space-y-4">
            {filteredBookings.map(b => (
              <div key={b.bookingId} className="card-base hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                <div className="flex max-md:flex-col md:items-center justify-between gap-4">
                  {/* Left: Booking Info */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--theme-surface)] border border-border-default flex items-center justify-center text-xl shrink-0">
                      {b.details?.[0]?.courtName?.toLowerCase().includes('pickleball') ? <Circle size={20} className="text-[var(--theme-primary)]" /> : <Swords size={20} className="text-[var(--theme-primary)]" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <h3 className="text-[15px] font-bold text-[var(--theme-primary)]">{b.details?.[0]?.courtName || 'Sân chưa xác định'}</h3>
                        <StatusBadge status={b.status} />
                      </div>
                      <p className="text-[13px] text-foreground-muted flex items-center gap-2 mb-1">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--theme-primary)]/20"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        {new Date(b.details?.[0]?.bookingDate).toLocaleDateString('vi-VN')} · {formatTime(b.details?.[0]?.startTime)} – {formatTime(b.details?.[0]?.endTime)}
                      </p>
                      <p className="text-xs text-foreground-muted font-medium">Mã đơn: #{b.bookingId}</p>

                      {/* Payment countdown */}
                      {b.status === 'Pending' && b.paymentDeadline && (
                        <p className={`text-xs font-bold mt-2 flex items-center gap-1 ${getDeadlineRemaining(b.paymentDeadline) === 'Hết hạn' ? 'text-red-400' : 'text-amber-400'}`}>
                          <Clock size={12} /> {getDeadlineRemaining(b.paymentDeadline) === 'Hết hạn' ? 'Đã hết hạn thanh toán' : `Còn ${getDeadlineRemaining(b.paymentDeadline)} để thanh toán`}
                        </p>
                      )}

                      {/* Check-in code */}
                      {b.status === 'Confirmed' && b.checkInCode && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs text-foreground-muted">Mã vào sân:</span>
                          <span className="font-mono font-bold text-accent bg-accent/10 border border-accent/20 px-2.5 py-1 rounded-lg text-xs tracking-wider">{b.checkInCode}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Price + Actions */}
                  <div className="flex items-center gap-4 md:gap-6">
                    <div className="text-right">
                      <p className="text-xs text-foreground-muted mb-0.5 font-medium">Tổng tiền</p>
                      <p className="text-[15px] font-bold text-[var(--theme-primary)]">{b.totalAmount?.toLocaleString('vi-VN')} đ</p>
                    </div>

                    <div className="flex gap-2">
                      {b.status === 'Pending' && (
                        <button
                          onClick={() => handlePayment(b.bookingId, b.totalAmount)}
                          className="h-9 px-4 btn-primary text-xs"
                        >
                          Thanh toán
                        </button>
                      )}
                      {(b.status === 'Confirmed' || b.status === 'Pending') && (
                        <button
                          onClick={() => handleCancel(b.bookingId)}
                          className="h-9 px-4 border border-red-500/20 text-red-400 bg-red-500/10 rounded-lg text-xs font-semibold hover:bg-red-500/20 transition-colors"
                        >
                          Hủy sân
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ApexLayout>
  )
}
