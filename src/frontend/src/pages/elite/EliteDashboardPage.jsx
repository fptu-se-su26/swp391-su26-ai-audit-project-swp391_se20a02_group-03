import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import EliteLayout from '../../layouts/EliteLayout'
import { dashboardApi } from '../../api/dashboardApi'
import PageLoader from '../../components/ui/PageLoader'

function formatVnd(value) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace('.0', '')} triệu ₫`
  return `${Number(value || 0).toLocaleString('vi-VN')} ₫`
}

export default function EliteDashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const res = await dashboardApi.getEliteStats()
        if (!active) return
        if (res.statusCode === 200 && res.data) setStats(res.data)
        else setError(res.message || 'Không tải được số liệu.')
      } catch (err) {
        if (active) setError(typeof err === 'string' ? err : 'Không tải được số liệu.')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [])

  if (loading) {
    return (
      <EliteLayout>
        <PageLoader label="Đang tải tổng quan..." />
      </EliteLayout>
    )
  }

  return (
    <EliteLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Tổng quan</h1>
            <p className="text-sm text-slate-500">Chỉ số vận hành và tác vụ đang hoạt động hôm nay.</p>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <div className="grid grid-cols-4 max-[1200px]:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-6 relative z-[1]">
              <span className="text-[0.75rem] font-bold text-slate-500 tracking-[0.05em]">TỶ LỆ LẤP SÂN</span>
            </div>
            <h2 className="font-['Oswald'] text-[3.5rem] font-bold text-slate-950 leading-none mb-2 relative z-[1]">
              {stats?.occupancyRate ?? 0}%
            </h2>
            <p className="text-sm text-slate-500 relative z-[1]">
              {stats?.activeCourts ?? 0}/{stats?.totalCourts ?? 0} sân có lịch hôm nay
            </p>
          </div>

          <div className="bg-white rounded-2xl p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-6 relative z-[1]">
              <span className="text-[0.75rem] font-bold text-slate-500 tracking-[0.05em]">KÈO ĐANG MỞ</span>
            </div>
            <h2 className="font-['Oswald'] text-[3.5rem] font-bold text-slate-950 leading-none mb-2 relative z-[1]">
              {stats?.activeMatches ?? 0}
            </h2>
            <p className="text-sm text-slate-500 relative z-[1]">Kèo MatchPro đang hoạt động</p>
          </div>

          <div className="bg-white rounded-2xl p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-6 relative z-[1]">
              <span className="text-[0.75rem] font-bold text-slate-500 tracking-[0.05em]">DOANH THU NGÀY</span>
            </div>
            <h2 className="font-['Oswald'] text-[2.5rem] font-bold text-slate-950 leading-none mb-2 relative z-[1]">
              {formatVnd(stats?.todayRevenue ?? 0)}
            </h2>
            <p className="text-sm text-slate-500 relative z-[1]">{stats?.todayBookings ?? 0} đơn hôm nay</p>
          </div>

          <div className="bg-white rounded-2xl p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <h3 className="text-[1.125rem] font-bold text-slate-900 mb-5">Thao tác nhanh</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/elite/pos" className="bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all p-4 text-sm font-semibold text-slate-800 hover:bg-white hover:border-[#00c2ff] hover:shadow-[0_4px_12px_rgba(0,194,255,0.1)]">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#00c2ff] text-[var(--theme-primary)]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                </div>
                Đặt sân mới
              </Link>
              <Link to="/elite/scanner" className="bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all p-4 text-sm font-semibold text-slate-800 hover:bg-white hover:border-[#00c2ff] hover:shadow-[0_4px_12px_rgba(0,194,255,0.1)]">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-200 text-slate-500">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><rect x="7" y="7" width="10" height="10" rx="1"/></svg>
                </div>
                Quét QR
              </Link>
              <Link to="/elite/disputes" className="bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all p-4 text-sm font-semibold text-slate-800 hover:bg-white hover:border-[#00c2ff] hover:shadow-[0_4px_12px_rgba(0,194,255,0.1)]">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-100 text-red-700">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/></svg>
                </div>
                Khiếu nại ({stats?.openDisputes ?? 0})
              </Link>
              <Link to="/elite/bookings" className="bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all p-4 text-sm font-semibold text-slate-800 hover:bg-white hover:border-[#00c2ff] hover:shadow-[0_4px_12px_rgba(0,194,255,0.1)]">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-indigo-500 text-white">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                Đặt sân hôm nay
              </Link>
              <Link to="/elite/equipment" className="bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all p-4 text-sm font-semibold text-slate-800 hover:bg-white hover:border-[#00c2ff] hover:shadow-[0_4px_12px_rgba(0,194,255,0.1)]">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-500 text-white">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7h-4V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/></svg>
                </div>
                Thuê thiết bị
              </Link>
            </div>
          </div>
        </div>
      </div>
    </EliteLayout>
  )
}
