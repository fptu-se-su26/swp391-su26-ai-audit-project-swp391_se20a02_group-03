import { useState, useEffect, useMemo } from 'react'
import ProSportDashLayout from '../../layouts/ProSportDashLayout'
import { bookingApi } from '../../api/bookingApi'
import PageLoader from '../../components/ui/PageLoader'
import StatusBadge from '../../components/ui/StatusBadge'

const PAY_TABS = [
  { key: '', label: 'Tất cả' },
  { key: 'Paid', label: 'Đã thanh toán' },
  { key: 'Pending', label: 'Chờ TT' },
]

export default function DashPaymentsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [payFilter, setPayFilter] = useState('')

  useEffect(() => {
    let active = true
    bookingApi.getAllBookings()
      .then(res => {
        if (!active) return
        if (res.statusCode === 200 && Array.isArray(res.data)) setBookings(res.data)
        else setError(res.message || 'Không tải được dữ liệu.')
      })
      .catch(err => { if (active) setError(typeof err === 'string' ? err : 'Lỗi tải dữ liệu.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const filtered = useMemo(() => {
    return bookings.filter(b => !payFilter || b.paymentStatus === payFilter)
  }, [bookings, payFilter])

  const stats = useMemo(() => ({
    paidTotal: bookings.filter(b => b.paymentStatus === 'Paid').reduce((s, b) => s + Number(b.totalAmount || 0), 0),
    pending: bookings.filter(b => b.paymentStatus === 'Pending').length,
    cash: bookings.filter(b => b.paymentMethod === 'Cash' && b.paymentStatus === 'Paid').length,
  }), [bookings])

  return (
    <ProSportDashLayout>
      <div>
        <div className="mb-6">
          <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground mb-2">Thanh toán</h1>
          <p className="text-[13px] text-foreground-muted">Tổng hợp giao dịch đặt sân theo phương thức và trạng thái.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px] bg-ink border-2 border-ink mb-6">
          <div className="bg-surface p-5.5">
            <p className="label-mono text-foreground-subtle mb-2.5">Đã thu</p>
            <p className="font-heading text-2xl text-foreground">{stats.paidTotal.toLocaleString('vi-VN')}đ</p>
          </div>
          <div className="bg-surface p-5.5">
            <p className="label-mono text-foreground-subtle mb-2.5">Chờ thanh toán</p>
            <p className="font-heading text-2xl text-warning">{stats.pending}</p>
          </div>
          <div className="bg-ink p-5.5">
            <p className="label-mono text-[#9c9c96] mb-2.5">Tiền mặt (Paid)</p>
            <p className="font-heading text-2xl text-paper">{stats.cash}</p>
          </div>
        </div>

        <div className="flex gap-2 mb-5 flex-wrap">
          {PAY_TABS.map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setPayFilter(tab.key)}
              className={`px-5 py-2.5 font-bold text-[11.5px] uppercase tracking-[0.02em] border-2 rounded-[2px] cursor-pointer transition-colors ${
                payFilter === tab.key ? 'bg-[var(--theme-primary)] text-[var(--theme-secondary)] border-[var(--theme-primary)]' : 'bg-transparent border-border-hover text-foreground-muted'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading && <PageLoader label="Đang tải..." />}
        {error && <div className="border-2 border-danger bg-danger-bg px-4 py-3 text-sm text-danger rounded-[2px]">{error}</div>}

        {!loading && !error && (
          <div className="border-2 border-border-strong bg-surface overflow-hidden rounded-[2px] overflow-x-auto">
            <table className="w-full border-collapse text-sm min-w-[560px]">
              <thead>
                <tr className="bg-ink text-paper">
                  <th className="text-left px-4.5 py-3.5 label-mono">Mã</th>
                  <th className="text-left px-4.5 py-3.5 label-mono">Phương thức</th>
                  <th className="text-left px-4.5 py-3.5 label-mono">Trạng thái TT</th>
                  <th className="text-right px-4.5 py-3.5 label-mono">Số tiền</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-10 text-center text-foreground-subtle">Không có giao dịch.</td></tr>
                )}
                {filtered.map(b => (
                  <tr key={b.bookingId} className="border-t border-border-default hover:bg-surface-hover">
                    <td className="px-4.5 py-3.5 font-extrabold text-foreground">#{b.bookingId}</td>
                    <td className="px-4.5 py-3.5 text-foreground">{b.paymentMethod || '—'}</td>
                    <td className="px-4.5 py-3.5"><StatusBadge status={b.paymentStatus} /></td>
                    <td className="px-4.5 py-3.5 text-right font-extrabold text-foreground">{Number(b.totalAmount || 0).toLocaleString('vi-VN')}đ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ProSportDashLayout>
  )
}
