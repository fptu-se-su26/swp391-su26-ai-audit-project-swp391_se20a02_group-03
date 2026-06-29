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
      <div className="space-y-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Quản lý Đặt sân</h1>
            <p className="text-sm text-slate-500">Theo dõi toàn bộ lượt đặt sân, thanh toán và trạng thái.</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <p className="font-['Oswald'] text-[2.5rem] font-bold text-slate-900 leading-none mb-2">{stats.active}</p>
            <p className="text-sm text-slate-500">Lượt đặt đang hoạt động</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <p className="font-['Oswald'] text-[2.5rem] font-bold text-slate-900 leading-none mb-2">{stats.total}</p>
            <p className="text-sm text-slate-500">Tổng số lượt đặt</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <p className="font-['Oswald'] text-[2.5rem] font-bold text-amber-600 leading-none mb-2">{stats.pendingPay}</p>
            <p className="text-sm text-slate-500">Chờ thanh toán</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="flex flex-wrap gap-3 justify-between items-center py-4 px-5 border-b border-slate-200">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full py-2 px-4 w-72 focus-within:border-[#14B8A6]">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Tìm mã đặt / sân / người dùng..."
                className="border-none outline-none text-sm text-slate-900 w-full bg-transparent"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {STATUS_TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setStatusFilter(tab.key)}
                  className={`py-[6px] px-4 rounded-full border text-sm font-medium cursor-pointer transition-colors ${
                    statusFilter === tab.key
                      ? 'border-[#e0f2fe] bg-[#e0f2fe] text-[#0284c7]'
                      : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Mã đặt</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Khách</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Sân</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Ngày & Giờ</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng tiền</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Thanh toán</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading && (
                  <tr><td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    <Loader2 className="inline animate-spin mr-2" size={18} /> Đang tải...
                  </td></tr>
                )}
                {!loading && error && (
                  <tr><td colSpan={7} className="px-5 py-12 text-center text-red-500">
                    <ShieldAlert className="inline mr-2" size={18} /> {error}
                  </td></tr>
                )}
                {!loading && !error && filtered.length === 0 && (
                  <tr><td colSpan={7} className="px-5 py-12 text-center text-slate-400">Không có lượt đặt nào.</td></tr>
                )}
                {!loading && !error && filtered.map(b => {
                  const d = b.details?.[0]
                  return (
                    <tr key={b.bookingId} className="hover:bg-slate-50/55 transition-colors">
                      <td className="px-5 py-4 whitespace-nowrap text-sm font-semibold text-slate-500">#BKG-{b.bookingId}</td>
                      <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-900">Người dùng #{b.userId}</td>
                      <td className="px-5 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">{d?.courtName || '—'}</td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {d ? (
                          <>
                            <p className="text-sm font-semibold text-slate-900 flex items-center gap-1">
                              <CalendarDays size={13} className="text-slate-400" />
                              {new Date(d.bookingDate).toLocaleDateString('vi-VN')}
                            </p>
                            <p className="text-xs text-slate-500">{fmtTime(d.startTime)} – {fmtTime(d.endTime)}</p>
                          </>
                        ) : '—'}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-right text-sm font-semibold text-slate-900">
                        {Number(b.totalAmount).toLocaleString('vi-VN')} ₫
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <StatusBadge status={b.paymentStatus || 'Unpaid'} />
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <StatusBadge status={b.status} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="py-3 px-5 border-t border-slate-200 bg-white text-sm text-slate-500">
            Hiển thị {filtered.length} / {bookings.length} lượt đặt
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
