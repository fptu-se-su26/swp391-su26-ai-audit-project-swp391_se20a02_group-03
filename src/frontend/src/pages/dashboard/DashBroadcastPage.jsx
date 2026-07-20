import { useState, useEffect } from 'react'
import ProSportDashLayout from '../../layouts/ProSportDashLayout'
import { dashboardApi } from '../../api/dashboardApi'
import PageLoader from '../../components/ui/PageLoader'
import { useToast } from '../../components/Toast'

const DRAFT_KEY = 'prosport_broadcast_draft'

const audiences = ['Tất cả', 'Cầu lông', 'Pickleball', 'Người dùng không hoạt động', '+ Phân khúc tùy chỉnh']

function formatRelativeTime(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${Math.max(1, mins)} phút trước`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} giờ trước`
  return new Date(dateStr).toLocaleDateString('vi-VN')
}

export default function DashBroadcastPage() {
  const { addToast } = useToast()
  const [campName, setCampName] = useState('')
  const [msgBody, setMsgBody] = useState('')
  const [selectedAud, setSelectedAud] = useState(['Tất cả'])
  const [msgType, setMsgType] = useState('push')
  const [overview, setOverview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sentHistory, setSentHistory] = useState([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY)
      if (raw) {
        const draft = JSON.parse(raw)
        if (draft.campName) setCampName(draft.campName)
        if (draft.msgBody) setMsgBody(draft.msgBody)
        if (draft.selectedAud?.length) setSelectedAud(draft.selectedAud)
        if (draft.msgType) setMsgType(draft.msgType)
      }
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    let active = true
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const res = await dashboardApi.getStaffOverview()
        if (!active) return
        if (res.statusCode === 200 && res.data) setOverview(res.data)
        else setError(res.message || 'Không tải được dữ liệu vận hành.')
      } catch (err) {
        if (active) setError(typeof err === 'string' ? err : 'Không tải được dữ liệu vận hành.')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [])

  const stats = [
    { label: 'ĐƠN HÔM NAY', value: String(overview?.todayBookings ?? 0), trend: `${overview?.openMatches ?? 0} kèo đang mở`, trendUp: true },
    { label: 'KHIẾU NẠI CHỜ', value: String(overview?.pendingReports ?? 0), bar: true },
    { label: 'NGƯỜI DÙNG', value: String(overview?.totalUsers ?? 0), bars: [20, 35, 40, 50, 55, 60, overview?.totalUsers ? Math.min(80, overview.totalUsers) : 30] },
    { label: 'HOẠT ĐỘNG', value: String(overview?.recentActivity?.length ?? 0), trend: 'Từ API vận hành thực', trendUp: null },
  ]

  const recentBroadcasts = [
    ...sentHistory,
    ...(overview?.recentActivity ?? []).slice(0, 3).map(a => ({
      status: 'HOẠT ĐỘNG',
      statusColor: '#22c55e',
      date: formatRelativeTime(a.time),
      title: a.title,
      meta: a.description,
    })),
  ].slice(0, 5)

  const toggleAud = (a) =>
    setSelectedAud(selectedAud.includes(a) ? selectedAud.filter(x => x !== a) : [...selectedAud, a])

  function saveDraft() {
    const draft = { campName, msgBody, selectedAud, msgType, savedAt: new Date().toISOString() }
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
    addToast('Đã lưu nháp chiến dịch trên thiết bị này', 'success')
  }

  function sendNow() {
    if (!msgBody.trim()) {
      addToast('Nhập nội dung tin nhắn trước khi gửi', 'warning')
      return
    }
    const entry = {
      title: campName.trim() || 'Chiến dịch không tên',
      meta: `${msgType === 'push' ? 'Push' : 'Email'} · ${selectedAud.join(', ')} · ${msgBody.slice(0, 80)}${msgBody.length > 80 ? '…' : ''}`,
      date: 'Vừa gửi',
      status: 'ĐÃ GỬI',
      statusColor: '#14B8A6',
    }
    setSentHistory(prev => [entry, ...prev].slice(0, 5))
    localStorage.removeItem(DRAFT_KEY)
    addToast(`Đã ghi nhận phát sóng tới ${selectedAud.length} nhóm đối tượng (demo nội bộ)`, 'success')
    setMsgBody('')
    setCampName('')
  }

  return (
    <ProSportDashLayout>
      <div>
        <div className="flex flex-wrap items-end justify-between gap-5 mb-3">
          <div>
            <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground mb-2">Quản lý phát sóng</h1>
            <p className="text-[13px] text-foreground-muted">Thiết kế, lên lịch và phân tích thông điệp theo đối tượng.</p>
          </div>
          <button
            type="button"
            className="btn-primary text-xs"
            onClick={() => document.getElementById('camp-name')?.focus()}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
            Phát sóng mới
          </button>
        </div>

        {error && (
          <div className="my-5 border-2 border-danger bg-danger-bg px-4 py-3 text-sm text-danger rounded-[2px]">{error}</div>
        )}
        <div className="my-5 border-2 border-warning bg-warning-bg px-4.5 py-3.5 text-[12.5px] text-foreground rounded-[2px]">
          <strong>Chế độ demo:</strong> Phát sóng push/email chưa kết nối backend. «Gửi ngay» ghi nhận nội bộ trên thiết bị; «Lưu nháp» lưu localStorage.
        </div>
        {loading && <PageLoader label="Đang tải dữ liệu..." />}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0.5 bg-border-strong border-2 border-border-strong mb-7">
          {stats.map((s, i) => {
            const isLast = i === stats.length - 1
            return (
              <div key={s.label} className={isLast ? 'bg-ink p-5.5' : 'bg-surface p-5.5'}>
                <p className={`label-mono mb-2 ${isLast ? 'text-paper/60' : 'text-foreground-subtle'}`}>{s.label}</p>
                <p className={`font-heading text-[26px] leading-none ${isLast ? 'text-paper' : 'text-foreground'}`}>{s.value}</p>
                {s.trend && <p className={`text-[0.78rem] mt-2 ${s.trendUp ? 'text-accent' : 'text-foreground-muted'}`}>{s.trend}</p>}
                {s.bar && <div className="h-1.5 bg-border-default rounded-[2px] overflow-hidden mt-2"><div className="w-[99%] h-full bg-accent" /></div>}
                {s.bars && (
                  <div className="flex items-end gap-[3px] h-10 mt-2">
                    {s.bars.map((h, idx) => (
                      <div key={idx} className={`flex-1 ${idx === s.bars.length - 1 ? 'bg-accent' : 'bg-accent/50'}`} style={{ height: `${h}%` }} />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
          {/* Create Campaign */}
          <div className="border-2 border-border-strong bg-surface p-7 rounded-[2px]">
            <h2 className="font-heading text-base uppercase tracking-tight text-foreground mb-5">Tạo chiến dịch</h2>

            <div className="mb-[18px]">
              <label className="label-mono block mb-2 text-foreground-muted" htmlFor="camp-name">Tên nội bộ chiến dịch</label>
              <input id="camp-name" type="text" value={campName} onChange={e => setCampName(e.target.value)} placeholder="VD: Khuyến mãi giải cầu lông mùa hè" className="input-base" />
            </div>

            <div className="mb-[18px]">
              <label className="label-mono block mb-2 text-foreground-muted">Đối tượng nhận</label>
              <div className="flex flex-wrap gap-2">
                {audiences.map(a => (
                  <button key={a} className={`px-4 py-2 font-bold text-[11.5px] uppercase tracking-[0.02em] border-2 rounded-[2px] cursor-pointer transition-colors ${selectedAud.includes(a) ? 'bg-[var(--theme-primary)] text-[var(--theme-secondary)] border-[var(--theme-primary)]' : 'bg-transparent border-border-hover text-foreground-muted'}`} onClick={() => toggleAud(a)}>{a}</button>
                ))}
              </div>
            </div>

            <div className="mb-[18px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button className={`text-left p-3.5 border-2 rounded-[2px] cursor-pointer transition-colors ${msgType === 'push' ? 'border-accent bg-accent/5' : 'border-border-hover bg-surface'}`} onClick={() => setMsgType('push')}>
                  <p className="text-sm font-bold text-foreground">Thông báo đẩy</p>
                  <p className="text-[11px] text-foreground-muted mt-1">Ưu tiên cao, gửi tức thì</p>
                </button>
                <button className={`text-left p-3.5 border-2 rounded-[2px] cursor-pointer transition-colors ${msgType === 'email' ? 'border-accent bg-accent/5' : 'border-border-hover bg-surface'}`} onClick={() => setMsgType('email')}>
                  <p className="text-sm font-bold text-foreground">Bản tin email</p>
                  <p className="text-[11px] text-foreground-muted mt-1">Nội dung phong phú, cập nhật chi tiết</p>
                </button>
              </div>
            </div>

            <div className="mb-[18px]">
              <label className="label-mono block mb-2 text-foreground-muted" htmlFor="msg-body">Nội dung tin nhắn</label>
              <textarea
                id="msg-body"
                value={msgBody}
                onChange={e => setMsgBody(e.target.value.slice(0, 250))}
                placeholder="Nhập nội dung tin nhắn... Dùng {first_name} để cá nhân hóa."
                className="input-base h-auto py-3 resize-y"
                rows={5}
              />
              <p className="text-[11px] text-foreground-subtle text-right mt-1">{msgBody.length} / 250 ký tự</p>
            </div>

            <div className="flex items-center justify-between mt-1">
              <button
                type="button"
                disabled
                title="Lên lịch gửi sau chưa được hỗ trợ ở chế độ demo"
                className="flex items-center gap-1.5 bg-transparent border-none text-[0.82rem] text-foreground-subtle cursor-not-allowed opacity-60"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                Lên lịch gửi sau
              </button>
              <div className="flex gap-2.5">
                <button type="button" className="btn-outline text-xs" onClick={saveDraft}>Lưu nháp</button>
                <button type="button" className="btn-primary text-xs" onClick={sendNow}>Gửi ngay</button>
              </div>
            </div>
          </div>

          {/* Recent Broadcasts */}
          <div className="border-2 border-border-strong bg-surface p-6 rounded-[2px]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-[15px] uppercase tracking-tight text-foreground">Phát sóng gần đây</h2>
            </div>
            {recentBroadcasts.length === 0 && !loading && (
              <p className="text-sm text-foreground-subtle py-4">Chưa có hoạt động gần đây.</p>
            )}
            {recentBroadcasts.map((b, idx) => (
              <div key={`${b.title}-${idx}`} className="py-3.5 border-b border-border-default last:border-b-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="label-mono px-2 py-[3px] rounded-[2px] bg-ink text-paper">{b.status}</span>
                  <span className="text-[11px] text-foreground-subtle">{b.date}</span>
                </div>
                <p className="text-sm font-bold text-foreground mb-1">{b.title}</p>
                {b.meta  && <p className="text-[11px] text-foreground-subtle font-mono">{b.meta}</p>}
                {b.open  && <div className="flex gap-2.5 text-[11px] text-foreground-muted mt-1.5"><span>👁 {b.open}</span><span>🔗 {b.click}</span></div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProSportDashLayout>
  )
}
