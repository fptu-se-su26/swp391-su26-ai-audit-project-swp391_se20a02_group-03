import { useState, useEffect, useMemo } from 'react'
import ProSportDashLayout from '../../layouts/ProSportDashLayout'
import { bookingApi } from '../../api/bookingApi'
import PageLoader from '../../components/ui/PageLoader'

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
          <h1 className="dash-page-title">Thanh toán</h1>
          <p className="dash-page-sub">Tổng hợp giao dịch đặt sân theo phương thức và trạng thái.</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6 max-md:grid-cols-1">
          <div className="bg-white rounded-xl p-4 border-[1.5px] border-[#e0ecf0]">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Đã thu</p>
            <p className="text-xl font-bold text-foreground mt-1">{stats.paidTotal.toLocaleString('vi-VN')}đ</p>
          </div>
          <div className="bg-white rounded-xl p-4 border-[1.5px] border-[#e0ecf0]">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Chờ thanh toán</p>
            <p className="text-xl font-bold text-amber-600 mt-1">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border-[1.5px] border-[#e0ecf0]">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Tiền mặt (Paid)</p>
            <p className="text-xl font-bold text-[#14B8A6] mt-1">{stats.cash}</p>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          {PAY_TABS.map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setPayFilter(tab.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer ${
                payFilter === tab.key ? 'bg-[#14B8A6] text-white border-[#14B8A6]' : 'border-[#e0ecf0] text-slate-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading && <PageLoader label="Đang tải..." />}
        {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        {!loading && !error && (
          <div className="bg-white rounded-xl border-[1.5px] border-[#e0ecf0] overflow-hidden">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-[#f5f9fc] border-b border-[#e0ecf0]">
                  <th className="text-left px-4 py-3 font-semibold text-slate-500">Mã</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-500">Phương thức</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-500">Trạng thái TT</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-500">Số tiền</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-10 text-center text-slate-400">Không có giao dịch.</td></tr>
                )}
                {filtered.map(b => (
                  <tr key={b.bookingId} className="border-b border-[#f0f5f9]">
                    <td className="px-4 py-3 font-semibold">#{b.bookingId}</td>
                    <td className="px-4 py-3">{b.paymentMethod || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        b.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {b.paymentStatus || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">{Number(b.totalAmount || 0).toLocaleString('vi-VN')}đ</td>
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
