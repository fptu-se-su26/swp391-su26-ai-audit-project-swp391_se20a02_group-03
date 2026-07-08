import { useState, useEffect, useMemo } from 'react'
import ProSportDashLayout from '../../layouts/ProSportDashLayout'
import { dashboardApi } from '../../api/dashboardApi'
import PageLoader from '../../components/ui/PageLoader'

const tabs = [
  { key: 'All', label: 'Tất cả' },
  { key: 'Unread', label: 'Chưa đọc' },
  { key: 'Bookings', label: 'Đặt sân' },
  { key: 'Matches', label: 'Trận đấu' },
  { key: 'Reports', label: 'Khiếu nại' },
]

function formatRelativeTime(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${Math.max(1, mins)} phút trước`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} giờ trước`
  return new Date(dateStr).toLocaleDateString('vi-VN')
}

function mapNotification(n) {
  const category = n.category || 'All'
  return {
    id: n.id,
    tags: n.isRead ? [] : ['MỚI'],
    title: n.title,
    body: n.body,
    time: formatRelativeTime(n.time),
    category,
    isRead: n.isRead,
    actions: [],
  }
}

export default function DashInboxPage() {
  const [activeTab, setActiveTab] = useState('All')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const res = await dashboardApi.getStaffOverview()
        if (!active) return
        if (res.statusCode === 200 && res.data) {
          const fromNotifs = (res.data.notifications ?? []).map(mapNotification)
          const fromActivity = (res.data.recentActivity ?? []).map((a, i) => ({
            id: 1000 + i,
            tags: [],
            title: a.title,
            body: a.description,
            time: formatRelativeTime(a.time),
            category: 'Bookings',
            isRead: true,
            actions: [],
          }))
          setItems([...fromNotifs, ...fromActivity])
        } else {
          setError(res.message || 'Không tải được thông báo.')
        }
      } catch (err) {
        if (active) setError(typeof err === 'string' ? err : 'Không tải được thông báo.')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [])

  const filtered = useMemo(() => {
    if (activeTab === 'All') return items
    if (activeTab === 'Unread') return items.filter(n => !n.isRead)
    if (activeTab === 'Bookings') return items.filter(n => n.category === 'Bookings')
    if (activeTab === 'Matches') return items.filter(n => n.category === 'Matches')
    if (activeTab === 'Reports') return items.filter(n => n.category === 'Reports')
    return items
  }, [activeTab, items])

  return (
    <ProSportDashLayout>
      <div className="max-w-[900px]">
        <div className="mb-7">
          <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground mb-2">Thông báo</h1>
          <p className="text-[13px] text-foreground-muted">Cảnh báo vận hành từ đặt sân, kèo và khiếu nại.</p>
        </div>

        {error && (
          <div className="mb-4 border-2 border-danger bg-danger-bg px-4 py-3 text-sm text-danger rounded-[2px]">{error}</div>
        )}

        <div className="flex gap-2.5 mb-6 flex-wrap">
          {tabs.map(t => (
            <button
              key={t.key}
              className={`px-5 py-2.5 font-bold text-xs uppercase tracking-[0.02em] border-2 rounded-[2px] cursor-pointer transition-colors ${activeTab === t.key ? 'bg-[var(--theme-primary)] text-[var(--theme-secondary)] border-[var(--theme-primary)]' : 'bg-transparent border-border-hover text-foreground-muted'}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading && <PageLoader label="Đang tải thông báo..." />}

        <div className="flex flex-col gap-0.5 bg-border-strong border-2 border-border-strong">
          {!loading && filtered.length === 0 && (
            <div className="bg-surface py-12 text-center text-foreground-subtle text-sm">Không có thông báo trong mục này.</div>
          )}
          {filtered.map(n => (
            <div key={n.id} className="bg-surface px-6 py-5 flex gap-4 items-start">
              {n.tags.length > 0 ? (
                <span className="label-mono bg-ink text-paper px-2 py-1 mt-0.5 shrink-0">{n.tags[0]}</span>
              ) : (
                <span className="w-10 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-extrabold text-foreground mb-1">{n.title}</h3>
                <p className="text-[13px] text-foreground-muted">{n.body}</p>
              </div>
              <span className="font-mono text-[10px] text-foreground-subtle shrink-0">{n.time}</span>
            </div>
          ))}
        </div>
      </div>
    </ProSportDashLayout>
  )
}
