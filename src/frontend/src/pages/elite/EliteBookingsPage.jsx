import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import EliteLayout from '../../layouts/EliteLayout'
import StatusBadge from '../../components/ui/StatusBadge'
import { bookingApi } from '../../api/bookingApi'
import { useToast } from '../../components/Toast'
import { Search, Loader2, CalendarDays, Copy, QrCode } from 'lucide-react'

const STATUS_TABS = [
  { key: '', label: 'Tất cả' },
  { key: 'Pending', label: 'Chờ TT' },
  { key: 'Confirmed', label: 'Đã xác nhận' },
  { key: 'Completed', label: 'Hoàn thành' },
  { key: 'Cancelled', label: 'Đã hủy' },
]

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

export default function EliteBookingsPage() {
  const { addToast } = useToast()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [todayOnly, setTodayOnly] = useState(true)

  useEffect(() => {
    let active = true
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const res = await bookingApi.getAllBookings()
        if (!active) return
        if (res.statusCode === 200 && Array.isArray(res.data)) {
          setBookings(res.data)
        } else {
          setError(res.message || 'Không tải được danh sách đặt sân.')
        }
      } catch (err) {
        if (active) setError(typeof err === 'string' ? err : 'Không tải được danh sách đặt sân.')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [])

  const stats = useMemo(() => {
    const today = bookings.filter(b => b.details?.some(d => isSameDay(d.bookingDate)))
    return {
      todayTotal: today.length,
      todayConfirmed: today.filter(b => b.status === 'Confirmed').length,
      pendingPay: bookings.filter(b => b.paymentStatus === 'Pending').length,
    }
  }, [bookings])

  const filtered = useMemo(() => {
    return bookings.filter(b => {
      if (todayOnly && !b.details?.some(d => isSameDay(d.bookingDate))) return false
      if (statusFilter && b.status !== statusFilter) return false
      const q = search.trim().toLowerCase()
      if (!q) return true
      const court = b.details?.[0]?.courtName?.toLowerCase() || ''
      const code = b.checkInCode?.toLowerCase() || ''
      return String(b.bookingId).includes(q) || court.includes(q) || code.includes(q)
    })
  }, [bookings, search, statusFilter, todayOnly])

  function copyCode(code) {
    if (!code) return
    navigator.clipboard.writeText(code)
      .then(() => addToast('Đã copy mã QR check-in.', 'success'))
      .catch(() => addToast('Không copy được mã.', 'error'))
  }

  return (
    <EliteLayout>
      <div className="space-y-7">
        <div className="flex flex-wrap justify-between items-end gap-5">
          <div>
            <h1 className="font-heading text-3xl sm:text-4xl uppercase tracking-[-0.01em] text-foreground mb-2">Đặt sân hôm nay</h1>
            <p className="text-sm text-foreground-muted">Theo dõi lịch đặt, thanh toán và mã check-in.</p>
          </div>
          <div className="flex gap-2">
            <Link to="/elite/pos" className="btn-primary no-underline">
              + Đặt tại quầy
            </Link>
            <Link to="/elite/scanner" className="btn-outline no-underline">
              <QrCode size={16} /> Quét QR
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-3 max-md:grid-cols-1 gap-[2px] bg-border-strong border-2 border-border-strong mb-2">
          <div className="bg-surface p-6">
            <p className="font-heading text-[34px] leading-none text-foreground mb-1.5">{stats.todayTotal}</p>
            <p className="label-mono text-foreground-subtle">Lượt đặt hôm nay</p>
          </div>
          <div className="bg-surface p-6">
            <p className="font-heading text-[34px] leading-none text-accent mb-1.5">{stats.todayConfirmed}</p>
            <p className="label-mono text-foreground-subtle">Đã xác nhận hôm nay</p>
          </div>
          <div className="bg-ink p-6">
            <p className="font-heading text-[34px] leading-none text-paper mb-1.5">{stats.pendingPay}</p>
            <p className="label-mono text-[#9c9c96]">Chờ thanh toán (tổng)</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5 items-center">
          <div className="flex items-center gap-2 bg-surface border-2 border-border-strong rounded-[2px] h-11 px-3.5 min-w-[240px] flex-1 sm:flex-none">
            <Search size={16} className="text-foreground-subtle shrink-0" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm mã / sân / QR..."
              className="border-none outline-none text-sm text-foreground w-full bg-transparent"
            />
          </div>
          <button
            type="button"
            onClick={() => setTodayOnly(v => !v)}
            className={`label-mono px-4 h-11 rounded-[2px] border-2 cursor-pointer transition-colors ${
              todayOnly ? 'border-ink bg-ink text-paper' : 'border-border-hover text-foreground-muted bg-transparent'
            }`}
          >
            Chỉ hôm nay
          </button>
          {STATUS_TABS.map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusFilter(tab.key)}
              className={`label-mono px-4 h-11 rounded-[2px] border-2 cursor-pointer transition-colors ${
                statusFilter === tab.key
                  ? 'border-ink bg-ink text-paper'
                  : 'border-border-hover text-foreground-muted bg-transparent hover:border-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="border-2 border-border-strong bg-surface overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-ink text-paper">
                <th className="text-left px-4.5 py-3.5 label-mono px-[18px]">Mã</th>
                <th className="text-left py-3.5 label-mono px-[18px]">Sân</th>
                <th className="text-left py-3.5 label-mono px-[18px]">Giờ</th>
                <th className="text-right py-3.5 label-mono px-[18px]">Tiền</th>
                <th className="text-left py-3.5 label-mono px-[18px]">TT</th>
                <th className="text-left py-3.5 label-mono px-[18px]">QR</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-foreground-subtle border-t border-border-default">
                  <Loader2 className="inline animate-spin mr-2" size={18} /> Đang tải...
                </td></tr>
              )}
              {!loading && error && (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-danger border-t border-border-default">{error}</td></tr>
              )}
              {!loading && !error && filtered.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-foreground-subtle border-t border-border-default">Không có lượt đặt phù hợp.</td></tr>
              )}
              {!loading && !error && filtered.map(b => {
                const d = b.details?.[0]
                return (
                  <tr key={b.bookingId} className="hover:bg-surface-hover border-t border-border-default">
                    <td className="px-[18px] py-3.5 font-extrabold text-foreground">#{b.bookingId}</td>
                    <td className="px-[18px] py-3.5 font-bold text-foreground">{d?.courtName || '—'}</td>
                    <td className="px-[18px] py-3.5 whitespace-nowrap">
                      {d ? (
                        <>
                          <p className="text-sm font-medium text-foreground flex items-center gap-1">
                            <CalendarDays size={13} className="text-foreground-subtle" />
                            {new Date(d.bookingDate).toLocaleDateString('vi-VN')}
                          </p>
                          <p className="text-xs text-foreground-muted">{fmtTime(d.startTime)} – {fmtTime(d.endTime)}</p>
                        </>
                      ) : '—'}
                    </td>
                    <td className="px-[18px] py-3.5 text-right font-extrabold text-foreground">
                      {Number(b.totalAmount || 0).toLocaleString('vi-VN')}đ
                    </td>
                    <td className="px-[18px] py-3.5">
                      <StatusBadge status={b.status} />
                      {b.paymentMethod && (
                        <p className="text-[0.65rem] text-foreground-subtle mt-1">{b.paymentMethod}</p>
                      )}
                    </td>
                    <td className="px-[18px] py-3.5">
                      {b.checkInCode ? (
                        <button
                          type="button"
                          onClick={() => copyCode(b.checkInCode)}
                          className="inline-flex items-center gap-1 label-mono text-foreground bg-background-base border border-border-strong px-2.5 py-1 rounded-[2px] cursor-pointer hover:bg-surface-hover"
                          title={b.checkInCode}
                        >
                          <Copy size={12} /> Copy QR
                        </button>
                      ) : (
                        <span className="text-xs text-foreground-subtle">—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </EliteLayout>
  )
}
