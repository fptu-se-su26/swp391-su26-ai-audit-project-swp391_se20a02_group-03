import { useState, useEffect, useCallback } from 'react'
import { Calendar, Swords, Circle, Clock, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import ApexLayout from '../../layouts/ApexLayout'
import { bookingApi } from '../../api/bookingApi'
import { paymentApi } from '../../api/paymentApi'
import { useToast } from '../../components/Toast'
import { useConfirm, BOOKING_CANCEL_CONFIRM } from '../../components/ui/ConfirmDialog'
import { isEventFinished } from '../../utils/date'
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
      <div className="max-w-[1000px] mx-auto auth-animate-in">
        {/* Header */}
        <div className="flex max-sm:flex-col sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl uppercase tracking-[-0.01em] text-foreground">Lịch sử đặt sân</h1>
            <p className="text-sm text-foreground-muted mt-1">Quản lý tất cả lịch đặt sân, thanh toán và trạng thái nhận sân.</p>
          </div>
          <Link to="/apex/booking" className="btn-primary shrink-0">
            <Plus size={16} />
            Đặt sân mới
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-surface border-2 border-border-strong p-1 mb-6 w-fit max-w-full overflow-x-auto">
          {filterTabs.map(t => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`px-5 py-2 label-mono whitespace-nowrap flex items-center transition-colors ${
                filter === t.id
                  ? 'bg-ink text-paper'
                  : 'text-foreground-muted hover:text-foreground'
              }`}
            >
              {t.label}
              {filter === t.id && (
                <span className="ml-2 text-[10px] font-mono font-bold bg-paper/20 px-1.5 py-0.5">
                  {filteredBookings.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-[3px] border-border-default border-t-accent rounded-full animate-spin" />
          </div>
        ) : filteredBookings.length === 0 ? (
          <EmptyState
            icon={<Calendar size={28} />}
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
              <div key={b.bookingId} className="card-base transition-colors hover:border-border-hover">
                <div className="flex max-md:flex-col md:items-center justify-between gap-4">
                  {/* Left: Booking Info */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-background-base border-2 border-border-default flex items-center justify-center shrink-0 text-foreground">
                      {b.details?.[0]?.courtName?.toLowerCase().includes('pickleball') ? <Circle size={20} /> : <Swords size={20} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <h3 className="font-heading text-base uppercase text-foreground">{b.details?.[0]?.courtName || 'Sân chưa xác định'}</h3>
                        <StatusBadge status={b.status} />
                      </div>
                      <p className="text-[13px] text-foreground-muted flex items-center gap-2 mb-1">
                        <Calendar size={14} />
                        {new Date(b.details?.[0]?.bookingDate).toLocaleDateString('vi-VN')} · {formatTime(b.details?.[0]?.startTime)} – {formatTime(b.details?.[0]?.endTime)}
                      </p>
                      <p className="label-mono text-foreground-muted">Mã đơn: #{b.bookingId}</p>

                      {/* Payment countdown */}
                      {b.status === 'Pending' && b.paymentDeadline && (
                        <p className={`text-xs font-bold mt-2 flex items-center gap-1 ${getDeadlineRemaining(b.paymentDeadline) === 'Hết hạn' ? 'text-danger' : 'text-warning'}`}>
                          <Clock size={12} /> {getDeadlineRemaining(b.paymentDeadline) === 'Hết hạn' ? 'Đã hết hạn thanh toán' : `Còn ${getDeadlineRemaining(b.paymentDeadline)} để thanh toán`}
                        </p>
                      )}

                      {/* Check-in code */}
                      {b.status === 'Confirmed' && b.checkInCode && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs text-foreground-muted">Mã vào sân:</span>
                          <span className="font-mono font-bold text-accent border border-accent px-2.5 py-1 text-xs tracking-wider">{b.checkInCode}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Price + Actions */}
                  <div className="flex items-center gap-4 md:gap-6">
                    <div className="text-right">
                      <p className="label-mono text-foreground-muted mb-0.5">Tổng tiền</p>
                      <p className="text-[15px] font-bold text-foreground">{b.totalAmount?.toLocaleString('vi-VN')} đ</p>
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
                      {(b.status === 'Confirmed' || b.status === 'Pending') &&
                        !isEventFinished({
                          date: b.details?.[0]?.bookingDate,
                          startTime: b.details?.[0]?.startTime,
                          endTime: b.details?.[0]?.endTime,
                        }) && (
                        <button
                          onClick={() => handleCancel(b.bookingId)}
                          className="h-9 px-4 border-2 border-danger text-danger bg-transparent text-xs font-bold uppercase tracking-[0.04em] hover:bg-danger-bg transition-colors"
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
