import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ApexLayout from '../../layouts/ApexLayout'
import { matchApi } from '../../api/matchApi'
import authApi from '../../api/authApi'
import { Search, ClipboardList, History } from 'lucide-react'
import dayjs from 'dayjs'
import StatusBadge from '../../components/ui/StatusBadge'
import EmptyState from '../../components/ui/EmptyState'


const levels = ['Mọi cấp độ', 'Người mới', 'Trung bình', 'Nâng cao', 'Chuyên nghiệp']
const sports = ['Tất cả', 'Cầu lông', 'Pickleball']

export default function ApexMatchesPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('find')
  const [levelFilter, setLevelFilter] = useState('Mọi cấp độ')
  const [sportFilter, setSportFilter] = useState('Tất cả')
  const [joined, setJoined] = useState([])
  const [openMatches, setOpenMatches] = useState([])
  const [userId, setUserId] = useState(null)
  const [toastMsg, setToastMsg] = useState(null)

  useEffect(() => {
    async function initData() {
      try {
        const [profileRes, matchesRes] = await Promise.all([
          authApi.getProfile(),
          matchApi.getOpenMatches()
        ])
        
        if (profileRes?.data) {
          setUserId(profileRes.data.userId)
        }
        
        if (matchesRes?.data) {
          const matchList = Array.isArray(matchesRes.data) ? matchesRes.data : []
          const formatted = matchList.map(m => ({
            id: m.matchId,
            sport: m.sportType === 'Badminton' ? 'Cầu lông' : m.sportType,
            type: m.isCompetitive ? 'Cạnh tranh' : 'Giao hữu',
            level: m.levelRequirement || m.skillLevel,
            host: m.hostName,
            hostImg: m.hostAvatarUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(m.hostName || 'Host'),
            court: m.location || m.notes,
            date: dayjs(m.matchDate || m.startTime).format('ddd, MMM D'),
            time: dayjs(m.matchDate || m.startTime).format('HH:mm'),
            slots: (m.maxParticipants || 0) - (m.currentParticipants || 0),
            maxSlots: m.maxParticipants || 0,
            icon: (m.sportType || '').toLowerCase().includes('pickleball') ? '🏓' : '🏸',
            participants: m.participants || []
          }))
          setOpenMatches(formatted)
          
          if (profileRes?.data?.userId) {
            const myJoined = formatted
              .filter(m => m.participants.some(p => p.userId === profileRes.data.userId))
              .map(m => m.id)
            setJoined(myJoined)
          }
        }
      } catch (err) {
        console.error("Failed to load matches", err)
      }
    }
    initData()
  }, [])

  const filtered = openMatches.filter(m =>
    (levelFilter === 'Mọi cấp độ' || m.level === levelFilter) &&
    (sportFilter === 'Tất cả' || m.sport === sportFilter || (sportFilter === 'Cầu lông' && m.sport === 'Badminton'))
  )

  async function handleJoin(id) {
    try {
      await matchApi.joinMatch(id)
      setJoined(prev => [...prev, id])
      setOpenMatches(prev => prev.map(m =>
        m.id === id ? { ...m, slots: Math.max(0, m.slots - 1) } : m
      ))
    } catch (err) {
      const msg = typeof err === 'string' ? err : 'Failed to join match'
      setToastMsg(msg)
      setTimeout(() => setToastMsg(null), 3000)
    }
  }

  return (
    <ApexLayout>
      {toastMsg && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-5 py-3 rounded-xl z-[9999] text-sm font-semibold shadow-lg animate-fade-up">
          {toastMsg}
        </div>
      )}

      <div className="max-w-[1000px] mx-auto animate-fade-up">
        {/* Header */}
        <div className="flex max-sm:flex-col sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[var(--theme-primary)] tracking-tight">Trung tâm trận đấu</h1>
            <p className="text-sm text-foreground-muted mt-1">Tìm các trận đấu đang mở, thách đấu bạn bè, hoặc tự tạo trận đấu của riêng bạn.</p>
          </div>
          <button onClick={() => navigate('/matches/create')} className="btn-primary shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Tạo trận đấu
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-[var(--theme-surface)] border border-border-default p-1 rounded-xl mb-6 w-fit max-w-full overflow-x-auto shadow-[0_0_15px_rgba(255,255,255,0.02)]">
          {[
            { id: 'find', icon: <Search size={16} />, label: 'Tìm trận đấu' },
            { id: 'my', icon: <ClipboardList size={16} />, label: 'Trận của tôi' },
            { id: 'history', icon: <History size={16} />, label: 'Lịch sử' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 whitespace-nowrap ${
                tab === t.id
                  ? 'bg-[var(--theme-surface-hover)] text-[var(--theme-primary)] shadow-sm ring-1 ring-white/20'
                  : 'text-foreground-muted hover:text-[var(--theme-primary)] hover:bg-[var(--theme-surface)]'
              }`}
            >
              <span className={tab === t.id ? 'text-accent' : 'text-foreground-muted opacity-80'}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Find Match Tab */}
        {tab === 'find' && (
          <div className="space-y-6 animate-fade-up">
            <div className="flex gap-4">
              <select 
                className="h-10 px-3 bg-[var(--theme-surface)] border border-border-default rounded-xl text-sm text-[var(--theme-primary)] font-medium focus:border-accent focus:ring-1 focus:ring-accent/20 outline-none transition-all cursor-pointer shadow-sm"
                value={sportFilter} 
                onChange={e => setSportFilter(e.target.value)}
              >
                {sports.map(s => <option key={s} className="bg-background-base">{s}</option>)}
              </select>
              <select 
                className="h-10 px-3 bg-[var(--theme-surface)] border border-border-default rounded-xl text-sm text-[var(--theme-primary)] font-medium focus:border-accent focus:ring-1 focus:ring-accent/20 outline-none transition-all cursor-pointer shadow-sm"
                value={levelFilter} 
                onChange={e => setLevelFilter(e.target.value)}
              >
                {levels.map(l => <option key={l} className="bg-background-base">{l}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map(m => (
                <div key={m.id} className="card-base hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[160px] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[var(--theme-surface)] border border-border-default flex items-center justify-center shrink-0">{m.icon}</span>
                        <div>
                          <p className="text-[15px] font-semibold text-[var(--theme-primary)] leading-tight">{m.sport}</p>
                          <p className="text-xs text-foreground-muted mt-0.5">{m.type}</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-accent/10 text-accent border border-accent/20 text-[10px] font-bold uppercase tracking-wider rounded-md">
                        {m.level || 'Trung bình'}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5 mb-4">
                      <p className="text-[13px] text-foreground-muted flex items-center gap-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--theme-primary)]/20"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        {m.date} lúc {m.time}
                      </p>
                      <p className="text-[13px] text-foreground-muted flex items-center gap-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--theme-primary)]/20"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        {m.court}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border-default mt-auto">
                    <div className="flex items-center gap-2">
                      <img src={m.hostImg} alt={m.host} className="w-6 h-6 rounded-full object-cover border border-border-default" />
                      <span className="text-xs text-foreground-muted">bởi <span className="font-semibold text-[var(--theme-primary)]">{m.host}</span></span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-foreground-muted"><span className="text-[var(--theme-primary)] font-bold">{m.slots}</span>/{m.maxSlots} chỗ</span>
                      <button
                        onClick={() => !joined.includes(m.id) && handleJoin(m.id)}
                        disabled={joined.includes(m.id) || m.slots === 0}
                        className={`h-8 px-4 rounded-lg text-xs font-semibold transition-all duration-200 ${
                          joined.includes(m.id)
                            ? 'bg-accent/10 text-accent cursor-default border border-accent/20'
                            : m.slots === 0
                            ? 'bg-[var(--theme-surface)] text-foreground-muted cursor-not-allowed border border-border-default'
                            : 'bg-accent text-white hover:bg-accent-bright active:scale-95 shadow-[0_0_15px_rgba(94,106,210,0.4)]'
                        }`}
                      >
                        {joined.includes(m.id) ? 'Đã tham gia' : m.slots === 0 ? 'Đã đầy' : 'Tham gia'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <EmptyState 
                icon="🏃" 
                title="Không tìm thấy trận đấu nào" 
                subtitle="Thử điều chỉnh bộ lọc để xem thêm các trận đấu đang mở." 
                action={<button className="btn-outline text-sm" onClick={() => { setSportFilter('Tất cả'); setLevelFilter('Mọi cấp độ') }}>Xóa bộ lọc</button>}
              />
            )}
          </div>
        )}

        {/* My Matches Tab */}
        {tab === 'my' && (
          <div className="animate-fade-up">
            {joined.length === 0 ? (
              <EmptyState 
                icon="📋" 
                title="Chưa tham gia trận nào" 
                subtitle="Bạn chưa tham gia trận đấu nào." 
                action={<button className="btn-primary text-sm" onClick={() => setTab('find')}>Tìm trận đấu</button>}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {openMatches.filter(m => joined.includes(m.id)).map(m => (
                  <div key={m.id} className="card-base hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-lg bg-[var(--theme-surface)] border border-border-default flex items-center justify-center shrink-0">{m.icon}</span>
                          <div>
                            <p className="text-[15px] font-semibold text-[var(--theme-primary)] leading-tight">{m.sport}</p>
                            <p className="text-xs text-foreground-muted mt-0.5">{m.type}</p>
                          </div>
                        </div>
                        <StatusBadge status="Confirmed" />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <p className="text-[13px] text-foreground-muted flex items-center gap-2">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--theme-primary)]/20"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                          {m.date} lúc {m.time}
                        </p>
                        <p className="text-[13px] text-foreground-muted flex items-center gap-2">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--theme-primary)]/20"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                          {m.court}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-5">
                      <button className="btn-outline w-full h-9 text-xs" onClick={() => navigate(`/matches/${m.id}`)}>
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'history' && (
          <div className="animate-fade-up">
            <EmptyState
              icon="🏆"
              title="Chưa có lịch sử trận đấu"
              subtitle="Khi bạn tham gia và hoàn thành trận đấu, lịch sử sẽ hiển thị ở đây."
              action={
                <button className="btn-primary text-sm" onClick={() => setTab('find')}>Tìm trận đấu</button>
              }
            />
          </div>
        )}
      </div>
    </ApexLayout>
  )
}
