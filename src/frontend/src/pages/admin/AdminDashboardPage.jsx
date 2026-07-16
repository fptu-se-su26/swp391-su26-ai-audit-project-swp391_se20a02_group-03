import { useState, useEffect } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import { dashboardApi } from '../../api/dashboardApi'
import { courtApi } from '../../api/courtApi'
import { ShieldAlert } from 'lucide-react'
import PageLoader from '../../components/ui/PageLoader'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

// API trả status UPPERCASE (CourtStatuses.ToApiStatus) — thêm alias để không rơi về nhãn/màu raw
const COURT_STATUS_LABELS = { Available: 'Trống', ACTIVE: 'Trống', Booked: 'Đã đặt', Maintenance: 'Bảo trì', MAINTENANCE: 'Bảo trì', Closed: 'Đóng', INACTIVE: 'Ngưng hoạt động' }
const COURT_STATUS_COLORS = { Available: '#14b8a6', ACTIVE: '#14b8a6', Booked: '#0d1b2a', Maintenance: '#b26a00', MAINTENANCE: '#b26a00', Closed: '#b23b3b', INACTIVE: '#b23b3b' }

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
  const [courtStatusData, setCourtStatusData] = useState([])

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

  useEffect(() => {
    courtApi.getAll({ pageSize: 500 })
      .then(res => {
        const list = Array.isArray(res.data) ? res.data : (res.data?.items || [])
        const counts = list.reduce((acc, c) => {
          acc[c.status] = (acc[c.status] || 0) + 1
          return acc
        }, {})
        setCourtStatusData(Object.entries(counts).map(([status, value]) => ({
          status,
          name: COURT_STATUS_LABELS[status] || status,
          value,
        })))
      })
      .catch(() => setCourtStatusData([]))
  }, [])

  const maxRevenue = stats?.revenueTrend?.reduce((m, p) => Math.max(m, p.amount), 0) || 0
  const chartData = stats?.revenueTrend?.map(p => ({ label: p.label, amount: p.amount })) || []

  const cards = stats ? [
    { label: 'Tổng Doanh thu', value: fmtVnd(stats.totalRevenue) },
    { label: 'Lượt Đặt sân Tích cực', value: stats.activeBookings },
    { label: 'Kèo đấu Đang diễn ra', value: stats.ongoingMatches },
    { label: 'Sản phẩm Thiết bị', value: stats.totalEquipment, dark: true },
  ] : []

  return (
    <AdminLayout>
      <div className="max-w-[1200px] mx-auto space-y-6 auth-animate-in">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl md:text-3xl uppercase tracking-tight text-gray-900 m-0 mb-1.5">Tổng quan bảng điều khiển</h1>
            <p className="text-[13px] text-gray-500 m-0">
              {stats
                ? `${stats.totalUsers} người dùng · ${stats.totalCourts} sân đang quản lý`
                : 'Nhịp đập thời gian thực của hoạt động cơ sở thể thao.'}
            </p>
          </div>
        </div>

        {loading && <PageLoader message="Đang tải số liệu..." />}
        {!loading && error && (
          <div className="py-20 text-center text-red-500 bg-red-50 rounded-[12px] border border-red-100">
            <ShieldAlert className="inline mr-2" size={22} /> {error}
          </div>
        )}

        {!loading && !error && stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
              {cards.map(c => (
                <div key={c.label} className="p-5 bg-white rounded-[12px] border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 m-0 mb-2">{c.label}</p>
                  <p className="font-heading text-2xl text-gray-900 m-0">{c.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-4">
              {/* Revenue Trends */}
              <div className="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col">
                <h3 className="font-bold text-[14px] uppercase tracking-wide text-gray-800 m-0 mb-5">Xu hướng doanh thu (7 ngày)</h3>
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                      <XAxis dataKey="label" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={{ stroke: '#f3f4f6' }} tickLine={false} />
                      <YAxis hide />
                      <Tooltip
                        formatter={(value) => fmtVnd(value)}
                        contentStyle={{ background: '#ffffff', border: '1px solid #f3f4f6', borderRadius: 8, fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                        labelStyle={{ color: '#1f2937', fontWeight: 'bold', marginBottom: '4px' }}
                        cursor={{ fill: '#f9fafb' }}
                      />
                      <Bar dataKey="amount" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-[12px] font-medium text-gray-400 mt-4 text-center m-0">Doanh thu cao nhất trong kỳ: <span className="text-gray-600">{fmtVnd(maxRevenue)}</span></p>
              </div>

              {/* Court occupancy pie */}
              <div className="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col">
                <h3 className="font-bold text-[14px] uppercase tracking-wide text-gray-800 m-0 mb-5">Hiệu suất khai thác sân</h3>
                {courtStatusData.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8 flex-1 flex items-center justify-center m-0">Chưa có dữ liệu sân.</p>
                ) : (
                  <>
                    <div className="h-[160px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={courtStatusData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2} stroke="none">
                            {courtStatusData.map(entry => (
                              <Cell key={entry.status} fill={COURT_STATUS_COLORS[entry.status] || '#9ca3af'} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #f3f4f6', borderRadius: 8, fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} itemStyle={{ color: '#4b5563' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-col gap-3 mt-6">
                      {courtStatusData.map(entry => (
                        <div key={entry.status} className="flex items-center justify-between text-[13px]">
                          <span className="flex items-center gap-2 text-gray-600 font-medium">
                            <span className="w-2.5 h-2.5 shrink-0 rounded-full" style={{ background: COURT_STATUS_COLORS[entry.status] || '#9ca3af' }} />
                            {entry.name}
                          </span>
                          <span className="font-bold text-gray-900">{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-5 rounded-[12px] border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col mt-4">
              <h3 className="font-bold text-[14px] uppercase tracking-wide text-gray-800 m-0 mb-5">Hoạt động gần đây</h3>
              <div className="flex flex-col flex-1">
                {stats.recentActivity.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-8 m-0">Chưa có hoạt động nào.</p>
                )}
                {stats.recentActivity.map((item, i, arr) => (
                  <div key={i} className={`pb-5 ${i < arr.length - 1 ? 'border-b border-gray-100 mb-5' : ''}`}>
                    <div className="flex items-start justify-between gap-4 mb-1.5">
                      <p className="font-bold text-[14px] text-gray-900 m-0">{item.title}</p>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 shrink-0 m-0 mt-0.5">{timeAgo(item.time)}</p>
                    </div>
                    <p className="text-[13.5px] text-gray-500 m-0 max-w-[800px] leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
