import { useState, useEffect } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import { dashboardApi } from '../../api/dashboardApi'
import { Loader2, ShieldAlert, DollarSign, CalendarCheck, Swords, Package } from 'lucide-react'

const ACTIVITY_STYLE = {
  Confirmed: { color: '#10b981', bg: '#d1fae5' },
  Completed: { color: '#3b82f6', bg: '#dbeafe' },
  Pending: { color: '#f59e0b', bg: '#fef3c7' },
  Cancelled: { color: '#ef4444', bg: '#fee2e2' },
}

function fmtVnd(n) {
  return `${Number(n || 0).toLocaleString('vi-VN')} ₫`
}

function timeAgo(iso) {
  const d = new Date(iso)
  const diff = Math.floor((Date.now() - d.getTime()) / 60000)
  if (diff < 1) return 'Vừa xong'
  if (diff < 60) return `${diff} phút trước`
  if (diff < 1440) return `${Math.floor(diff / 60)} giờ trước`
  return d.toLocaleDateString('vi-VN')
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const res = await dashboardApi.getStats()
        if (!active) return
        if (res.statusCode === 200 && res.data) {
          setStats(res.data)
        } else {
          setError(res.message || 'Không tải được số liệu.')
        }
      } catch (err) {
        if (active) setError(typeof err === 'string' ? err : 'Không tải được số liệu.')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [])

  const maxRevenue = stats?.revenueTrend?.reduce((m, p) => Math.max(m, p.amount), 0) || 0

  const cards = stats ? [
    { label: 'Tổng Doanh thu', value: fmtVnd(stats.totalRevenue), icon: <DollarSign size={20} />, bg: '#e0f2fe', color: '#0ea5e9' },
    { label: 'Lượt Đặt sân Tích cực', value: stats.activeBookings, icon: <CalendarCheck size={20} />, bg: '#f1f5f9', color: '#64748b' },
    { label: 'Kèo đấu Đang diễn ra', value: stats.ongoingMatches, icon: <Swords size={20} />, bg: '#fef3c7', color: '#d97706' },
    { label: 'Sản phẩm Thiết bị', value: stats.totalEquipment, icon: <Package size={20} />, bg: '#f1f5f9', color: '#64748b' },
  ] : []

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Tổng quan Bảng điều khiển</h1>
            <p className="text-sm text-slate-500">
              {stats
                ? `${stats.totalUsers} người dùng · ${stats.totalCourts} sân đang quản lý`
                : 'Nhịp đập thời gian thực của hoạt động cơ sở thể thao.'}
            </p>
          </div>
        </div>

        {loading && (
          <div className="py-20 text-center text-slate-400">
            <Loader2 className="inline animate-spin mr-2" size={22} /> Đang tải số liệu...
          </div>
        )}
        {!loading && error && (
          <div className="py-20 text-center text-red-500">
            <ShieldAlert className="inline mr-2" size={22} /> {error}
          </div>
        )}

        {!loading && !error && stats && (
          <>
            <div className="grid grid-cols-4 gap-6 mb-6 max-xl:grid-cols-2">
              {cards.map(c => (
                <div key={c.label} className="bg-white rounded-xl p-6 border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: c.bg, color: c.color }}>
                      {c.icon}
                    </div>
                  </div>
                  <p className="text-sm font-medium text-slate-500 mb-1">{c.label}</p>
                  <p className="font-['Oswald'] text-3xl font-bold text-slate-900 leading-none break-all">{c.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-[2fr_1fr] gap-6 max-xl:grid-cols-1">
              {/* Revenue Trends */}
              <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-lg font-bold text-slate-900">Xu hướng Doanh thu (7 ngày)</h2>
                </div>
                <div className="h-[240px] flex items-end gap-3">
                  {stats.revenueTrend.map((p, i) => {
                    const pct = maxRevenue > 0 ? Math.max(4, (p.amount / maxRevenue) * 100) : 4
                    const isLast = i === stats.revenueTrend.length - 1
                    return (
                      <div key={p.label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                        <div
                          className={`w-full rounded-t transition-all ${isLast ? 'bg-[#0284c7]' : 'bg-[#38bdf8]'} opacity-90`}
                          style={{ height: `${pct}%` }}
                          title={fmtVnd(p.amount)}
                        ></div>
                        <span className="text-[0.7rem] text-slate-400 font-medium">{p.label}</span>
                      </div>
                    )
                  })}
                </div>
                <p className="text-xs text-slate-400 mt-3 text-center">Doanh thu cao nhất trong kỳ: {fmtVnd(maxRevenue)}</p>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col">
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-slate-900">Hoạt động Gần đây</h2>
                  <p className="text-sm text-slate-500 mt-1">Các đơn đặt sân mới nhất</p>
                </div>
                <div className="flex flex-col flex-1">
                  {stats.recentActivity.length === 0 && (
                    <p className="text-sm text-slate-400 text-center py-8">Chưa có hoạt động nào.</p>
                  )}
                  {stats.recentActivity.map((item, i, arr) => {
                    const st = ACTIVITY_STYLE[item.type] || { color: '#64748b', bg: '#f1f5f9' }
                    return (
                      <div key={i} className="flex gap-4 pb-5 relative">
                        {i < arr.length - 1 && <div className="absolute left-[15px] top-8 bottom-0 w-[2px] bg-slate-200" />}
                        <div className="w-8 h-8 rounded-full flex items-center justify-center z-[1] shrink-0" style={{ color: st.color, background: st.bg }}>
                          <span className="w-2 h-2 rounded-full" style={{ background: st.color }}></span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                          <p className="text-[0.8125rem] text-slate-500 mt-[2px] truncate">{item.description}</p>
                          <p className="text-xs text-slate-400 mt-1">{timeAgo(item.time)}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
