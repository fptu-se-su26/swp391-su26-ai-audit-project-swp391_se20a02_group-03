import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import ProSportDashLayout from '../../layouts/ProSportDashLayout'
import StatusBadge from '../../components/ui/StatusBadge'
import { bookingApi } from '../../api/bookingApi'
import PageLoader from '../../components/ui/PageLoader'
import { CalendarDays } from 'lucide-react'

function fmtTime(t) {
  return t ? String(t).slice(0, 5) : ''
}

function isSameDay(dateStr) {
  if (!dateStr) return false
  const d = new Date(dateStr)
  const today = new Date()
  return d.getFullYear() === today.getFullYear()
    && d.getMonth() === today.getMonth()
    && d.getDate() === today.getDate()
}

export default function DashBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [todayOnly, setTodayOnly] = useState(true)

  useEffect(() => {
    let active = true
    bookingApi.getAllBookings()
      .then(res => {
        if (!active) return
        if (res.statusCode === 200 && Array.isArray(res.data)) setBookings(res.data)
        else setError(res.message || 'Không tải được danh sách.')
      })
      .catch(err => { if (active) setError(typeof err === 'string' ? err : 'Lỗi tải dữ liệu.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const filtered = useMemo(() => {
    return bookings.filter(b => {
      if (todayOnly && !b.details?.some(d => isSameDay(d.bookingDate))) return false
      return true
    })
  }, [bookings, todayOnly])

  return (
    <ProSportDashLayout>
      <div>
        <div className="flex flex-wrap items-end justify-between gap-5 mb-6">
          <div>
            <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground mb-2">Đặt sân</h1>
            <p className="text-[13px] text-foreground-muted">Theo dõi lịch đặt và trạng thái thanh toán.</p>
          </div>
          <Link to="/elite/pos" className="btn-primary text-xs no-underline">+ Đặt tại quầy</Link>
        </div>

        <div className="flex gap-2 mb-5">
          <button
            type="button"
            onClick={() => setTodayOnly(true)}
            className={`px-5 py-2.5 font-bold text-[11.5px] uppercase tracking-[0.02em] border-2 rounded-[2px] cursor-pointer transition-colors ${todayOnly ? 'bg-[var(--theme-primary)] text-[var(--theme-secondary)] border-[var(--theme-primary)]' : 'bg-transparent border-border-hover text-foreground-muted'}`}
          >
            Hôm nay
          </button>
          <button
            type="button"
            onClick={() => setTodayOnly(false)}
            className={`px-5 py-2.5 font-bold text-[11.5px] uppercase tracking-[0.02em] border-2 rounded-[2px] cursor-pointer transition-colors ${!todayOnly ? 'bg-[var(--theme-primary)] text-[var(--theme-secondary)] border-[var(--theme-primary)]' : 'bg-transparent border-border-hover text-foreground-muted'}`}
          >
            Tất cả
          </button>
        </div>

        {loading && <PageLoader label="Đang tải..." />}
        {error && <div className="border-2 border-danger bg-danger-bg px-4 py-3 text-sm text-danger rounded-[2px] mb-4">{error}</div>}

        {!loading && !error && (
          <div className="border-2 border-border-strong bg-surface overflow-hidden rounded-[2px] overflow-x-auto">
            <table className="w-full border-collapse text-sm min-w-[640px]">
              <thead>
                <tr className="bg-ink text-paper">
                  <th className="text-left px-4.5 py-3.5 label-mono">Mã</th>
                  <th className="text-left px-4.5 py-3.5 label-mono">Sân</th>
                  <th className="text-left px-4.5 py-3.5 label-mono">Giờ</th>
                  <th className="text-right px-4.5 py-3.5 label-mono">Tiền</th>
                  <th className="text-left px-4.5 py-3.5 label-mono">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-10 text-center text-foreground-subtle">Không có lượt đặt.</td></tr>
                )}
                {filtered.map(b => {
                  const d = b.details?.[0]
                  return (
                    <tr key={b.bookingId} className="border-t border-border-default hover:bg-surface-hover">
                      <td className="px-4.5 py-3.5 font-extrabold text-foreground">#{b.bookingId}</td>
                      <td className="px-4.5 py-3.5 font-bold text-foreground">{d?.courtName || '—'}</td>
                      <td className="px-4.5 py-3.5 text-foreground-muted">
                        {d && (
                          <span className="inline-flex items-center gap-1">
                            <CalendarDays size={13} className="text-foreground-subtle" />
                            {new Date(d.bookingDate).toLocaleDateString('vi-VN')} {fmtTime(d.startTime)}–{fmtTime(d.endTime)}
                          </span>
                        )}
                      </td>
                      <td className="px-4.5 py-3.5 text-right font-extrabold text-foreground">{Number(b.totalAmount || 0).toLocaleString('vi-VN')}đ</td>
                      <td className="px-4.5 py-3.5"><StatusBadge status={b.status} /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ProSportDashLayout>
  )
}
