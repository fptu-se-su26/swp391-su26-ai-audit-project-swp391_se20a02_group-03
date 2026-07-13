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
      <div className="space-y-9">
        <div className="mb-9">
          <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground mb-2">Tổng quan bảng điều khiển</h1>
          <p className="text-sm text-foreground-muted">
            {stats
              ? `${stats.totalUsers} người dùng · ${stats.totalCourts} sân đang quản lý`
              : 'Nhịp đập thời gian thực của hoạt động cơ sở thể thao.'}
          </p>
        </div>

        {loading && <PageLoader message="Đang tải số liệu..." />}
        {!loading && error && (
          <div className="py-20 text-center text-danger">
            <ShieldAlert className="inline mr-2" size={22} /> {error}
          </div>
        )}

        {!loading && !error && stats && (
          <>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-[2px] bg-border-strong border-2 border-border-strong mb-10">
              {cards.map(c => (
                <div key={c.label} className={`p-6 ${c.dark ? 'bg-ink' : 'bg-surface'}`}>
                  <p className={`label-mono mb-2.5 ${c.dark ? 'text-paper/60' : 'text-foreground-muted'}`}>{c.label}</p>
                  <p className={`font-heading text-2xl ${c.dark ? 'text-paper' : 'text-foreground'}`}>{c.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
              {/* Revenue Trends */}
              <div className="border-2 border-border-strong bg-surface p-7">
                <h3 className="font-heading text-base uppercase text-foreground mb-6">Xu hướng doanh thu (7 ngày)</h3>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                      <XAxis dataKey="label" tick={{ fill: 'var(--color-foreground-muted)', fontSize: 11 }} axisLine={{ stroke: 'var(--color-border-default)' }} tickLine={false} />
                      <YAxis hide />
                      <Tooltip
                        formatter={(value) => fmtVnd(value)}
                        contentStyle={{ background: 'var(--color-surface)', border: '2px solid var(--color-border-strong)', borderRadius: 2, fontSize: 12 }}
                        labelStyle={{ color: 'var(--color-foreground)' }}
                        cursor={{ fill: 'var(--color-surface-hover)' }}
                      />
                      <Bar dataKey="amount" fill="var(--color-ink)" radius={0} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-foreground-subtle mt-3 text-center">Doanh thu cao nhất trong kỳ: {fmtVnd(maxRevenue)}</p>
              </div>

              {/* Court occupancy pie */}
              <div className="border-2 border-border-strong bg-surface p-7 flex flex-col">
                <h3 className="font-heading text-base uppercase text-foreground mb-5">Hiệu suất khai thác sân</h3>
                {courtStatusData.length === 0 ? (
                  <p className="text-sm text-foreground-subtle text-center py-8 flex-1 flex items-center justify-center">Chưa có dữ liệu sân.</p>
                ) : (
                  <>
                    <div className="h-[160px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={courtStatusData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70} paddingAngle={2}>
                            {courtStatusData.map(entry => (
                              <Cell key={entry.status} fill={COURT_STATUS_COLORS[entry.status] || '#9c9c96'} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ background: 'var(--color-surface)', border: '2px solid var(--color-border-strong)', borderRadius: 2, fontSize: 12 }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-col gap-2 mt-4">
                      {courtStatusData.map(entry => (
                        <div key={entry.status} className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-2 text-foreground-muted">
                            <span className="w-2.5 h-2.5 shrink-0" style={{ background: COURT_STATUS_COLORS[entry.status] || '#9c9c96' }} />
                            {entry.name}
                          </span>
                          <span className="font-bold text-foreground">{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="border-2 border-border-strong bg-surface p-7 flex flex-col mt-6">
              <h3 className="font-heading text-base uppercase text-foreground mb-5">Hoạt động gần đây</h3>
              <div className="flex flex-col gap-4 text-sm flex-1">
                {stats.recentActivity.length === 0 && (
                  <p className="text-sm text-foreground-subtle text-center py-8">Chưa có hoạt động nào.</p>
                )}
                {stats.recentActivity.map((item, i, arr) => (
                  <div key={i} className={`pb-3.5 ${i < arr.length - 1 ? 'border-b border-border-default' : ''}`}>
                    <p className="font-extrabold text-foreground mb-0.5">{item.title}</p>
                    <p className="text-sm text-foreground-muted mt-0.5 truncate">{item.description}</p>
                    <p className="label-mono text-foreground-subtle mt-1">{timeAgo(item.time)}</p>
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
