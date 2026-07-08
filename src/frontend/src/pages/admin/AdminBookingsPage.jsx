import { useState, useEffect, useMemo } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import StatusBadge from '../../components/ui/StatusBadge'
import { bookingApi } from '../../api/bookingApi'
import { Search, Loader2, ShieldAlert, CalendarDays } from 'lucide-react'

const STATUS_TABS = [
  { key: '', label: 'Tất cả' },
  { key: 'Pending', label: 'Chờ xử lý' },
  { key: 'Confirmed', label: 'Đã xác nhận' },
  { key: 'Completed', label: 'Hoàn thành' },
  { key: 'Cancelled', label: 'Đã hủy' },
]

function fmtTime(t) {
  return t ? String(t).slice(0, 5) : ''
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

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

  const stats = useMemo(() => ({
    active: bookings.filter(b => b.status === 'Pending' || b.status === 'Confirmed').length,
    pendingPay: bookings.filter(b => b.paymentStatus === 'Pending').length,
    total: bookings.length,
  }), [bookings])

  const filtered = useMemo(() => {
    return bookings.filter(b => {
      if (statusFilter && b.status !== statusFilter) return false
      const q = search.trim().toLowerCase()
      if (!q) return true
      const court = b.details?.[0]?.courtName?.toLowerCase() || ''
      return String(b.bookingId).includes(q) || court.includes(q) || String(b.userId).includes(q)
    })
  }, [bookings, search, statusFilter])

  return (
    <AdminLayout>
      <div className="space-y-7">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground mb-2">Quản lý đặt sân</h1>
          <p className="text-sm text-foreground-muted">Theo dõi toàn bộ lượt đặt sân, thanh toán và trạng thái.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px] bg-border-strong border-2 border-border-strong">
          <div className="bg-surface p-6">
            <p className="font-heading text-3xl text-foreground mb-1.5">{stats.active}</p>
            <p className="label-mono text-foreground-muted">Lượt đặt đang hoạt động</p>
          </div>
          <div className="bg-surface p-6">
            <p className="font-heading text-3xl text-foreground mb-1.5">{stats.total}</p>
            <p className="label-mono text-foreground-muted">Tổng số lượt đặt</p>
          </div>
          <div className="bg-ink p-6">
            <p className="font-heading text-3xl text-paper mb-1.5">{stats.pendingPay}</p>
            <p className="label-mono text-paper/60">Chờ thanh toán</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:justify-between gap-3.5">
          <div className="flex items-center gap-2 bg-surface border-2 border-border-strong px-3.5 h-11 w-full md:min-w-[280px] md:w-auto rounded-[2px] focus-within:border-accent">
            <Search size={16} className="text-foreground-subtle shrink-0" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm mã đặt / sân / người dùng..."
              className="border-none outline-none text-sm text-foreground w-full bg-transparent placeholder:text-foreground-subtle"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {STATUS_TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`px-4.5 h-11 font-sans text-[11.5px] font-bold uppercase tracking-[0.04em] border-2 rounded-[2px] transition-colors cursor-pointer ${
                  statusFilter === tab.key
                    ? 'bg-ink border-ink text-paper'
                    : 'bg-transparent border-border-hover text-foreground-muted hover:border-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="border-2 border-border-strong bg-surface">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-ink text-paper">
                  <th className="px-4.5 py-3.5 text-left label-mono font-bold">Mã đặt</th>
                  <th className="px-4.5 py-3.5 text-left label-mono font-bold">Khách</th>
                  <th className="px-4.5 py-3.5 text-left label-mono font-bold">Sân</th>
                  <th className="px-4.5 py-3.5 text-left label-mono font-bold">Ngày & Giờ</th>
                  <th className="px-4.5 py-3.5 text-right label-mono font-bold">Tổng tiền</th>
                  <th className="px-4.5 py-3.5 text-left label-mono font-bold">Thanh toán</th>
                  <th className="px-4.5 py-3.5 text-left label-mono font-bold">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={7} className="px-4.5 py-12 text-center text-foreground-muted">
                    <Loader2 className="inline animate-spin mr-2" size={18} /> Đang tải...
                  </td></tr>
                )}
                {!loading && error && (
                  <tr><td colSpan={7} className="px-4.5 py-12 text-center text-danger">
                    <ShieldAlert className="inline mr-2" size={18} /> {error}
                  </td></tr>
                )}
                {!loading && !error && filtered.length === 0 && (
                  <tr><td colSpan={7} className="px-4.5 py-12 text-center text-foreground-muted">Không có lượt đặt nào.</td></tr>
                )}
                {!loading && !error && filtered.map(b => {
                  const d = b.details?.[0]
                  return (
                    <tr key={b.bookingId} className="border-t border-border-default hover:bg-surface-hover transition-colors">
                      <td className="px-4.5 py-4 whitespace-nowrap font-extrabold text-foreground">#BKG-{b.bookingId}</td>
                      <td className="px-4.5 py-4 whitespace-nowrap text-foreground">Người dùng #{b.userId}</td>
                      <td className="px-4.5 py-4 whitespace-nowrap font-bold text-foreground">{d?.courtName || '—'}</td>
                      <td className="px-4.5 py-4 whitespace-nowrap">
                        {d ? (
                          <>
                            <p className="font-bold text-foreground flex items-center gap-1">
                              <CalendarDays size={13} className="text-foreground-subtle" />
                              {new Date(d.bookingDate).toLocaleDateString('vi-VN')}
                            </p>
                            <p className="text-xs text-foreground-muted">{fmtTime(d.startTime)} – {fmtTime(d.endTime)}</p>
                          </>
                        ) : '—'}
                      </td>
                      <td className="px-4.5 py-4 whitespace-nowrap text-right font-extrabold text-foreground">
                        {Number(b.totalAmount).toLocaleString('vi-VN')} ₫
                      </td>
                      <td className="px-4.5 py-4 whitespace-nowrap">
                        <StatusBadge status={b.paymentStatus || 'Unpaid'} />
                      </td>
                      <td className="px-4.5 py-4 whitespace-nowrap">
                        <StatusBadge status={b.status} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="py-3.5 px-4.5 border-t-2 border-border-strong label-mono text-foreground-muted">
            Hiển thị {filtered.length} / {bookings.length} lượt đặt
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
