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
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="dash-page-title">Đặt sân</h1>
            <p className="dash-page-sub">Theo dõi lịch đặt và trạng thái thanh toán.</p>
          </div>
          <Link to="/elite/pos" className="btn-primary text-sm no-underline px-4 py-2">+ Đặt tại quầy</Link>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setTodayOnly(true)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer ${todayOnly ? 'bg-[#14B8A6] text-white border-[#14B8A6]' : 'border-[#e0ecf0] text-slate-500'}`}
          >
            Hôm nay
          </button>
          <button
            type="button"
            onClick={() => setTodayOnly(false)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer ${!todayOnly ? 'bg-[#14B8A6] text-white border-[#14B8A6]' : 'border-[#e0ecf0] text-slate-500'}`}
          >
            Tất cả
          </button>
        </div>

        {loading && <PageLoader label="Đang tải..." />}
        {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-4">{error}</div>}

        {!loading && !error && (
          <div className="bg-white rounded-xl border-[1.5px] border-[#e0ecf0] overflow-hidden">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-[#f5f9fc] border-b border-[#e0ecf0]">
                  <th className="text-left px-4 py-3 font-semibold text-slate-500">Mã</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-500">Sân</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-500">Giờ</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-500">Tiền</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-500">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-400">Không có lượt đặt.</td></tr>
                )}
                {filtered.map(b => {
                  const d = b.details?.[0]
                  return (
                    <tr key={b.bookingId} className="border-b border-[#f0f5f9] hover:bg-[#f5f9fc]/60">
                      <td className="px-4 py-3 font-semibold text-slate-600">#{b.bookingId}</td>
                      <td className="px-4 py-3 font-medium">{d?.courtName || '—'}</td>
                      <td className="px-4 py-3">
                        {d && (
                          <span className="inline-flex items-center gap-1">
                            <CalendarDays size={13} className="text-slate-400" />
                            {new Date(d.bookingDate).toLocaleDateString('vi-VN')} {fmtTime(d.startTime)}–{fmtTime(d.endTime)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">{Number(b.totalAmount || 0).toLocaleString('vi-VN')}đ</td>
                      <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
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
