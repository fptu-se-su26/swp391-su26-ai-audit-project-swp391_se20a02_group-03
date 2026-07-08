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

  const quickActions = [
    { to: '/elite/pos', icon: '+', label: 'Đặt sân mới' },
    { to: '/elite/scanner', icon: '▦', label: 'Quét QR' },
    { to: '/elite/disputes', icon: '!', label: `Khiếu nại (${stats?.openDisputes ?? 0})` },
    { to: '/elite/bookings', icon: '▤', label: 'Đặt sân hôm nay' },
    { to: '/elite/equipment', icon: '◫', label: 'Thuê thiết bị' },
  ]

  return (
    <EliteLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl uppercase tracking-[-0.01em] text-foreground mb-2">Tổng quan</h1>
          <p className="text-sm text-foreground-muted">Chỉ số vận hành và tác vụ đang hoạt động hôm nay.</p>
        </div>

        {error && (
          <div className="border-2 border-danger bg-danger-bg px-4 py-3 text-sm text-danger rounded-[2px]">{error}</div>
        )}

        <div className="grid grid-cols-3 max-md:grid-cols-1 gap-[2px] bg-border-strong border-2 border-border-strong">
          <div className="bg-surface p-7">
            <p className="label-mono text-foreground-subtle mb-3.5">Tỷ lệ lấp sân</p>
            <p className="font-heading text-[42px] leading-none text-foreground mb-2">{stats?.occupancyRate ?? 0}%</p>
            <p className="text-[12.5px] text-foreground-muted">
              {stats?.activeCourts ?? 0}/{stats?.totalCourts ?? 0} sân có lịch hôm nay
            </p>
          </div>

          <div className="bg-surface p-7">
            <p className="label-mono text-foreground-subtle mb-3.5">Kèo đang mở</p>
            <p className="font-heading text-[42px] leading-none text-foreground mb-2">{stats?.activeMatches ?? 0}</p>
            <p className="text-[12.5px] text-foreground-muted">Kèo MatchPro đang hoạt động</p>
          </div>

          <div className="bg-ink p-7">
            <p className="label-mono text-[#9c9c96] mb-3.5">Doanh thu ngày</p>
            <p className="font-heading text-[32px] leading-none text-paper mb-2">{formatVnd(stats?.todayRevenue ?? 0)}</p>
            <p className="text-[12.5px] text-[#9c9c96]">{stats?.todayBookings ?? 0} đơn hôm nay</p>
          </div>
        </div>

        <div>
          <h3 className="font-heading text-base uppercase text-foreground mb-5">Thao tác nhanh</h3>
          <div className="grid grid-cols-5 max-lg:grid-cols-3 max-sm:grid-cols-2 gap-[2px] bg-border-strong border-2 border-border-strong">
            {quickActions.map(action => (
              <Link
                key={action.to}
                to={action.to}
                className="bg-surface hover:bg-surface-hover px-4 py-7 flex flex-col items-center gap-3.5 no-underline text-foreground transition-colors"
              >
                <div className="w-12 h-12 bg-ink text-paper flex items-center justify-center font-extrabold text-lg rounded-[2px]">
                  {action.icon}
                </div>
                <span className="text-xs font-extrabold text-center">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </EliteLayout>
  )
}
