import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ApexLayout from '../../layouts/ApexLayout'
import { matchApi } from '../../api/matchApi'
import authApi from '../../api/authApi'
import { Search, ClipboardList, History, Plus, Calendar, MapPin, Wallet } from 'lucide-react'
import { useConfirm } from '../../components/ui/ConfirmDialog'
import { formatSlotTime } from '../../utils/date'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import StatusBadge from '../../components/ui/StatusBadge'
import EmptyState from '../../components/ui/EmptyState'
import {
  translateSport,
  translateLevel,
  translateMatchFormat,
  translateStatus,
} from '../../utils/labels'

// History data is now fetched from the server.

const levels = ['Mọi cấp độ', 'Người mới', 'Trung bình', 'Nâng cao', 'Chuyên nghiệp']
const sports = ['Tất cả', 'Cầu lông', 'Pickleball']

export default function ApexMatchesPage() {
  const navigate = useNavigate()
  const confirm = useConfirm()
  const [tab, setTab] = useState('find')
  const [cancellingId, setCancellingId] = useState(null)
  const [levelFilter, setLevelFilter] = useState('Mọi cấp độ')
  const [sportFilter, setSportFilter] = useState('Tất cả')
  const [joined, setJoined] = useState([])
  const [openMatches, setOpenMatches] = useState([])
  const [historyMatches, setHistoryMatches] = useState([])
  const [, setUserId] = useState(null)
  const [toastMsg, setToastMsg] = useState(null)

  useEffect(() => {
    async function initData() {
      try {
        const [profileRes, matchesRes, historyRes] = await Promise.all([
          authApi.getProfile(),
          matchApi.getOpenMatches(),
          matchApi.getMyMatchHistory()
        ])

        if (profileRes?.data) {
          setUserId(profileRes.data.userId)
        }

        if (matchesRes?.data) {
          const matchList = Array.isArray(matchesRes.data) ? matchesRes.data : []
          const formatted = matchList.map(m => ({
            id: m.matchId,
            sport: translateSport(m.sportType) || 'Thể thao',
            type: translateMatchFormat(m.isCompetitive),
            level: translateLevel(m.levelRequirement || m.skillLevel, 'Trung bình'),
            host: m.hostName,
            hostImg: m.hostAvatarUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(m.hostName || 'Host'),
            court: m.location || m.notes,
            date: dayjs(m.matchDate).locale('vi').format('dddd, DD/MM'),
            // BUG 2: giờ nằm ở field startTime riêng ("HH:mm:ss") — matchDate luôn là 00:00.
            time: formatSlotTime(m.startTime),
            slots: (m.maxParticipants || 0) - (m.currentParticipants || 0),
            maxSlots: m.maxParticipants || 0,
            icon: (m.sportType || '').toLowerCase().includes('pickleball') ? '🏓' : '🏸',
            participants: m.participants || [],
            escrowAmount: m.escrowAmount || 0,
          }))
          setOpenMatches(formatted)

          if (profileRes?.data?.userId) {
            const myJoined = formatted
              .filter(m => m.participants.some(p => p.userId === profileRes.data.userId))
              .map(m => m.id)
            setJoined(myJoined)
          }
        }

        if (historyRes?.data) {
          const historyList = Array.isArray(historyRes.data) ? historyRes.data : []
          const formattedHistory = historyList.map(m => ({
            id: m.matchId,
            sport: translateSport(m.sportType) || 'Thể thao',
            court: m.location || m.notes || 'Chưa có địa điểm',
            date: dayjs(m.matchDate).locale('vi').format('dddd, DD/MM'),
            time: formatSlotTime(m.startTime),
            icon: (m.sportType || '').toLowerCase().includes('pickleball') ? '🏓' : '🏸',
            status: m.status,
            participants: m.participants || []
          }))

          // Separate upcoming "My Matches" and past "History" matches
          // History matches are those that are Completed, Cancelled, or their date has passed
          const now = dayjs()

          const myMatchesHistory = formattedHistory.filter(m => {
            const mDate = dayjs(m.date + ' ' + m.time, 'ddd, MMM D HH:mm')
            return m.status === 'Cancelled' || m.status === 'Completed' || (mDate.isValid() ? mDate.isBefore(now) : false)
          })

          // Add myMatchesUpcoming to joined/open matches to show in "My Matches" tab
          // To keep it simple, we use the original setJoined logic for upcoming matches,
          // but we populate history tab with myMatchesHistory
          setHistoryMatches(myMatchesHistory)
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

  async function handleCancelDeposit(match) {
    const ok = await confirm({
      title: 'Hủy kèo cọc',
      message: `Rút khỏi trận ${match.sport} lúc ${match.time}? Tiền cọc ${match.escrowAmount > 0 ? match.escrowAmount.toLocaleString('vi-VN') + 'đ ' : ''}sẽ được hoàn lại vào ví của bạn.`,
      confirmLabel: 'Hủy kèo cọc',
      cancelLabel: 'Giữ lại',
      variant: 'danger',
    })
    if (!ok) return
    setCancellingId(match.id)
    try {
      await matchApi.leaveMatch(match.id)
      setJoined(prev => prev.filter(id => id !== match.id))
      setOpenMatches(prev => prev.map(m =>
        m.id === match.id ? { ...m, slots: m.slots + 1 } : m
      ))
    } catch (err) {
      const msg = typeof err === 'string' ? err : 'Không thể hủy kèo cọc'
      setToastMsg(msg)
      setTimeout(() => setToastMsg(null), 3000)
    } finally {
      setCancellingId(null)
    }
  }

  async function handleJoin(id) {
    try {
      await matchApi.joinMatch(id)
      setJoined(prev => [...prev, id])
      setOpenMatches(prev => prev.map(m =>
        m.id === id ? { ...m, slots: Math.max(0, m.slots - 1) } : m
      ))
    } catch (err) {
      const msg = typeof err === 'string' ? err : 'Không thể tham gia kèo'
      setToastMsg(msg)
      setTimeout(() => setToastMsg(null), 3000)
    }
  }

  return (
    <ApexLayout>
      {toastMsg && (
        <div className="fixed top-4 right-4 bg-danger text-paper px-5 py-3 z-[9999] text-sm font-semibold border-2 border-danger auth-animate-in">
          {toastMsg}
        </div>
      )}

      <div className="max-w-[1000px] mx-auto auth-animate-in">
        {/* Header */}
        <div className="flex max-sm:flex-col sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl uppercase tracking-[-0.01em] text-foreground">Trung tâm trận đấu</h1>
            <p className="text-sm text-foreground-muted mt-1">Tìm các trận đấu đang mở, thách đấu bạn bè, hoặc tự tạo trận đấu của riêng bạn.</p>
          </div>
          <button onClick={() => navigate('/matches/create')} className="btn-primary shrink-0">
            <Plus size={16} />
            Tạo trận đấu
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-surface border-2 border-border-strong p-1 mb-6 w-fit max-w-full overflow-x-auto">
          {[
            { id: 'find', icon: <Search size={16} />, label: 'Tìm trận đấu' },
            { id: 'my', icon: <ClipboardList size={16} />, label: 'Trận của tôi' },
            { id: 'history', icon: <History size={16} />, label: 'Lịch sử' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2 label-mono whitespace-nowrap transition-colors ${
                tab === t.id
                  ? 'bg-ink text-paper'
                  : 'text-foreground-muted hover:text-foreground'
              }`}
            >
              <span className={tab === t.id ? 'text-accent' : 'text-foreground-muted opacity-80'}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Find Match Tab */}
        {tab === 'find' && (
          <div className="space-y-6 auth-animate-in">
            <div className="flex flex-wrap gap-4">
              <select
                className="input-base w-auto h-10 cursor-pointer"
                value={sportFilter}
                onChange={e => setSportFilter(e.target.value)}
              >
                {sports.map(s => <option key={s} className="bg-surface">{s}</option>)}
              </select>
              <select
                className="input-base w-auto h-10 cursor-pointer"
                value={levelFilter}
                onChange={e => setLevelFilter(e.target.value)}
              >
                {levels.map(l => <option key={l} className="bg-surface">{l}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map(m => (
                <div key={m.id} className="card-base flex flex-col justify-between min-h-[160px] transition-colors hover:border-border-hover">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 bg-background-base border border-border-default flex items-center justify-center shrink-0">{m.icon}</span>
                        <div>
                          <p className="text-[15px] font-semibold text-foreground leading-tight">{m.sport}</p>
                          <p className="text-xs text-foreground-muted mt-0.5">{m.type}</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 border border-accent text-accent label-mono">
                        {m.level || 'Trung bình'}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5 mb-4">
                      <p className="text-[13px] text-foreground-muted flex items-center gap-2">
                        <Calendar size={14} />
                        {m.date} lúc {m.time}
                      </p>
                      <p className="text-[13px] text-foreground-muted flex items-center gap-2">
                        <MapPin size={14} />
                        {m.court}
                      </p>
                      {m.escrowAmount > 0 && (
                        <p className="text-[13px] text-foreground-muted flex items-center gap-2">
                          <Wallet size={14} />
                          Cọc <span className="font-bold text-foreground">{m.escrowAmount.toLocaleString('vi-VN')}đ</span> / người
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border-default mt-auto">
                    <div className="flex items-center gap-2">
                      <img src={m.hostImg} alt={m.host} className="w-6 h-6 rounded-full object-cover border border-border-default" />
                      <span className="text-xs text-foreground-muted">bởi <span className="font-semibold text-foreground">{m.host}</span></span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-foreground-muted"><span className="text-foreground font-bold">{m.slots}</span>/{m.maxSlots} chỗ</span>
                      <button
                        onClick={() => !joined.includes(m.id) && handleJoin(m.id)}
                        disabled={joined.includes(m.id) || m.slots === 0}
                        className={`h-8 px-4 text-xs font-bold uppercase tracking-[0.04em] border-2 transition-colors ${
                          joined.includes(m.id)
                            ? 'text-accent border-accent cursor-default'
                            : m.slots === 0
                            ? 'bg-surface text-foreground-muted cursor-not-allowed border-border-default'
                            : 'bg-accent text-ink border-accent hover:opacity-90'
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
          <div className="auth-animate-in">
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
                  <div key={m.id} className="card-base flex flex-col justify-between transition-colors hover:border-border-hover">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 bg-background-base border border-border-default flex items-center justify-center shrink-0">{m.icon}</span>
                          <div>
                            <p className="text-[15px] font-semibold text-foreground leading-tight">{m.sport}</p>
                            <p className="text-xs text-foreground-muted mt-0.5">{m.type}</p>
                          </div>
                        </div>
                        <StatusBadge status="Confirmed" />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <p className="text-[13px] text-foreground-muted flex items-center gap-2">
                          <Calendar size={14} />
                          {m.date} lúc {m.time}
                        </p>
                        <p className="text-[13px] text-foreground-muted flex items-center gap-2">
                          <MapPin size={14} />
                          {m.court}
                        </p>
                        {m.escrowAmount > 0 && (
                          <p className="text-[13px] text-foreground-muted flex items-center gap-2">
                            <Wallet size={14} />
                            Đã cọc <span className="font-bold text-foreground">{m.escrowAmount.toLocaleString('vi-VN')}đ</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-5 flex gap-2">
                      <button className="btn-outline flex-1 h-9 text-xs" onClick={() => navigate(`/matches/${m.id}`)}>
                        Xem chi tiết
                      </button>
                      <button
                        className="h-9 px-4 text-xs font-bold uppercase tracking-[0.04em] border-2 border-danger text-danger hover:bg-danger-bg transition-colors disabled:opacity-50"
                        disabled={cancellingId === m.id}
                        onClick={() => handleCancelDeposit(m)}
                      >
                        {cancellingId === m.id ? 'Đang hủy...' : 'Hủy kèo cọc'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'history' && (
          <div className="auth-animate-in">
            {historyMatches.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {historyMatches.map(m => (
                  <div key={m.id} className="card-base flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 bg-background-base border border-border-default flex items-center justify-center shrink-0">{m.icon}</span>
                          <div>
                            <p className="text-[15px] font-semibold text-foreground leading-tight">Trận {m.sport}</p>
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 label-mono border ${
                          m.status === 'Completed' ? 'text-accent border-accent' :
                          m.status === 'Cancelled' ? 'text-danger border-danger' :
                          'text-foreground-muted border-border-default'
                        }`}>
                          {translateStatus(m.status, 'Đã kết thúc')}
                        </span>
                      </div>

                      <div className="flex flex-col gap-1.5 mb-4">
                        <p className="text-[13px] text-foreground-muted flex items-center gap-2">
                          <Calendar size={14} />
                          {m.date} lúc {m.time}
                        </p>
                        <p className="text-[13px] text-foreground-muted flex items-center gap-2">
                          <MapPin size={14} />
                          {m.court}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {historyMatches.length === 0 && (
              <EmptyState
                icon="🏆"
                title="Chưa có lịch sử trận đấu"
                subtitle="Khi bạn tham gia và hoàn thành trận đấu, lịch sử sẽ hiển thị ở đây."
                action={
                  <button className="btn-primary text-sm" onClick={() => setTab('find')}>Tìm trận đấu</button>
                }
              />
            )}

            {historyMatches.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="card-base text-center py-4">
                  <span className="block font-heading text-2xl text-foreground">{historyMatches.length}</span>
                  <span className="label-mono text-foreground-muted mt-1">Tổng số</span>
                </div>
                <div className="card-base text-center py-4 !border-accent">
                  <span className="block font-heading text-2xl text-accent">{historyMatches.filter(m => m.status === 'Completed').length}</span>
                  <span className="label-mono text-foreground-muted mt-1">Hoàn thành</span>
                </div>
                <div className="card-base text-center py-4 !border-danger">
                  <span className="block font-heading text-2xl text-danger">{historyMatches.filter(m => m.status === 'Cancelled').length}</span>
                  <span className="label-mono text-foreground-muted mt-1">Đã hủy</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ApexLayout>
  )
}
