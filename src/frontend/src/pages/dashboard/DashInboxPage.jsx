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

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)

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
  const iconBg = category === 'Reports' ? '#ef4444' : category === 'Matches' ? '#14B8A6' : '#f59e0b'
  return {
    id: n.id,
    iconEl: <CalendarIcon />,
    iconBg,
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
            iconEl: <CalendarIcon />,
            iconBg: '#14B8A6',
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
      <div>
        <div className="flex items-start justify-between mb-5">
          <div>
            <h1 className="font-['Oswald'] text-[1.6rem] font-bold text-foreground">Thông báo</h1>
            <p className="text-[0.85rem] text-slate-500 mt-1">Cảnh báo vận hành từ đặt sân, kèo và khiếu nại.</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <div className="flex gap-2 mb-5 flex-wrap">
          {tabs.map(t => (
            <button key={t.key} className={`py-[7px] px-4 rounded-full border-[1.5px] text-[0.82rem] font-medium cursor-pointer font-['Inter'] transition-all hover:border-[#14B8A6] hover:text-[#14B8A6] ${activeTab === t.key ? 'bg-[var(--theme-primary)] border-[#0F172A] text-[var(--theme-primary)]' : 'bg-white border-[#e0ecf0] text-slate-500'}`} onClick={() => setActiveTab(t.key)}>{t.label}</button>
          ))}
        </div>

        {loading && <PageLoader label="Đang tải thông báo..." />}

        <div className="flex flex-col gap-3">
          {!loading && filtered.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-sm">Không có thông báo trong mục này.</div>
          )}
          {filtered.map(n => (
            <div key={n.id} className="flex gap-3.5 bg-white rounded-xl p-[18px] border-[1.5px] border-[#e0ecf0] transition-shadow hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
              <div className="shrink-0">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: n.iconBg }}>
                  {n.iconEl}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[0.75rem] text-slate-400 ml-auto whitespace-nowrap">{n.time}</span>
                </div>
                <h3 className="text-[0.95rem] font-bold text-foreground mb-1.5">{n.title}</h3>
                <p className="text-sm text-slate-500 leading-[1.55]">{n.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProSportDashLayout>
  )
}
