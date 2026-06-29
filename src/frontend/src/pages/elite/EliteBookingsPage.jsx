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
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Đặt sân hôm nay</h1>
            <p className="text-sm text-slate-500">Theo dõi lịch đặt, thanh toán và mã check-in.</p>
          </div>
          <div className="flex gap-2">
            <Link to="/elite/pos" className="text-sm font-semibold bg-[#5E6AD2] text-white px-4 py-2 rounded-lg no-underline hover:bg-[#4e5bc4]">
              + Đặt tại quầy
            </Link>
            <Link to="/elite/scanner" className="text-sm font-semibold border border-slate-200 text-slate-700 px-4 py-2 rounded-lg no-underline hover:bg-slate-50 flex items-center gap-1">
              <QrCode size={16} /> Quét QR
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <p className="text-2xl font-bold text-slate-900">{stats.todayTotal}</p>
            <p className="text-sm text-slate-500">Lượt đặt hôm nay</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <p className="text-2xl font-bold text-green-600">{stats.todayConfirmed}</p>
            <p className="text-sm text-slate-500">Đã xác nhận hôm nay</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <p className="text-2xl font-bold text-amber-600">{stats.pendingPay}</p>
            <p className="text-sm text-slate-500">Chờ thanh toán (tổng)</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex flex-wrap gap-3 justify-between items-center py-4 px-5 border-b border-slate-200">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full py-2 px-4 w-72 max-w-full focus-within:border-[#5E6AD2]">
              <Search size={16} className="text-slate-400 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Tìm mã / sân / QR..."
                className="border-none outline-none text-sm text-slate-900 w-full bg-transparent"
              />
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <button
                type="button"
                onClick={() => setTodayOnly(v => !v)}
                className={`py-1.5 px-3 rounded-full border text-xs font-semibold cursor-pointer ${
                  todayOnly ? 'border-[#5E6AD2] bg-[#5E6AD2]/10 text-[#5E6AD2]' : 'border-slate-200 text-slate-500'
                }`}
              >
                Chỉ hôm nay
              </button>
              {STATUS_TABS.map(tab => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setStatusFilter(tab.key)}
                  className={`py-1.5 px-3 rounded-full border text-xs font-medium cursor-pointer ${
                    statusFilter === tab.key
                      ? 'border-[#5E6AD2] bg-[#5E6AD2]/10 text-[#5E6AD2]'
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
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
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Mã</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Sân</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Giờ</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Tiền</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">TT</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">QR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading && (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                    <Loader2 className="inline animate-spin mr-2" size={18} /> Đang tải...
                  </td></tr>
                )}
                {!loading && error && (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-red-500">{error}</td></tr>
                )}
                {!loading && !error && filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-400">Không có lượt đặt phù hợp.</td></tr>
                )}
                {!loading && !error && filtered.map(b => {
                  const d = b.details?.[0]
                  return (
                    <tr key={b.bookingId} className="hover:bg-slate-50/55">
                      <td className="px-5 py-4 text-sm font-semibold text-slate-600">#{b.bookingId}</td>
                      <td className="px-5 py-4 text-sm font-semibold text-slate-900">{d?.courtName || '—'}</td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {d ? (
                          <>
                            <p className="text-sm font-medium text-slate-900 flex items-center gap-1">
                              <CalendarDays size={13} className="text-slate-400" />
                              {new Date(d.bookingDate).toLocaleDateString('vi-VN')}
                            </p>
                            <p className="text-xs text-slate-500">{fmtTime(d.startTime)} – {fmtTime(d.endTime)}</p>
                          </>
                        ) : '—'}
                      </td>
                      <td className="px-5 py-4 text-right text-sm font-semibold">
                        {Number(b.totalAmount || 0).toLocaleString('vi-VN')}đ
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={b.status} />
                        {b.paymentMethod && (
                          <p className="text-[0.65rem] text-slate-400 mt-1">{b.paymentMethod}</p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {b.checkInCode ? (
                          <button
                            type="button"
                            onClick={() => copyCode(b.checkInCode)}
                            className="inline-flex items-center gap-1 text-xs font-mono text-[#5E6AD2] bg-[#5E6AD2]/10 px-2 py-1 rounded border-none cursor-pointer hover:bg-[#5E6AD2]/20"
                            title={b.checkInCode}
                          >
                            <Copy size={12} /> Copy QR
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </EliteLayout>
  )
}
