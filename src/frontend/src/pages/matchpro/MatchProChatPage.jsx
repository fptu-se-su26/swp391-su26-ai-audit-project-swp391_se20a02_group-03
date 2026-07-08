import { useState, useEffect } from 'react'
import { Swords, MapPin } from 'lucide-react'
import MatchProLayout from '../../layouts/MatchProLayout'
import { matchApi } from '../../api/matchApi'
import { useAuth } from '../../context/AuthContext'
import PageLoader from '../../components/ui/PageLoader'

function formatTime(ts) {
  if (!ts) return ''
  const [h, m] = String(ts).split(':')
  return `${h}:${m?.slice(0, 2) ?? '00'}`
}

function formatMatchDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('vi-VN')
}

export default function MatchProChatPage() {
  const { user } = useAuth()
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [active, setActive] = useState(null)
  const [input, setInput] = useState('')

  useEffect(() => {
    let alive = true
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const res = await matchApi.getMyMatchHistory()
        if (!alive) return
        if (res.statusCode === 200 && Array.isArray(res.data)) {
          setMatches(res.data)
          if (res.data.length > 0) setActive(res.data[0].matchId)
        } else {
          setError(res.message || 'Không tải được lịch sử kèo.')
        }
      } catch (err) {
        if (alive) setError(typeof err === 'string' ? err : 'Không tải được lịch sử kèo.')
      } finally {
        if (alive) setLoading(false)
      }
    }
    load()
    return () => { alive = false }
  }, [])

  const activeMatch = matches.find(m => m.matchId === active)

  return (
    <MatchProLayout>
      <div className="flex h-[calc(100vh-60px)] font-sans bg-background-base">
        {/* Match list sidebar */}
        <div className="w-[280px] shrink-0 bg-surface border-r-2 border-border-strong py-5 flex flex-col gap-1 overflow-y-auto">
          <h2 className="font-heading text-xl uppercase tracking-tight text-foreground px-5 mb-3">Kèo của tôi</h2>

          {loading && <PageLoader label="Đang tải..." />}
          {error && <p className="px-5 text-sm text-danger">{error}</p>}

          {!loading && matches.length === 0 && (
            <p className="px-5 text-sm text-foreground-muted">Bạn chưa tham gia kèo nào. Tìm kèo mở tại trang Cộng đồng hoặc Gần bạn.</p>
          )}

          {matches.map(m => (
            <button
              key={m.matchId}
              type="button"
              className={`flex items-center gap-3 py-3 px-5 bg-transparent border-none cursor-pointer text-left transition-colors hover:bg-surface-hover ${active === m.matchId ? 'bg-surface-hover border-l-4 border-accent' : 'border-l-4 border-transparent'}`}
              onClick={() => setActive(m.matchId)}
            >
              <div className="w-10 h-10 flex items-center justify-center shrink-0 bg-ink text-paper">
                <Swords size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-extrabold text-foreground whitespace-nowrap overflow-hidden text-ellipsis">
                  {m.courtName || `Kèo #${m.matchId}`}
                </p>
                <p className="label-mono text-foreground-muted whitespace-nowrap overflow-hidden text-ellipsis mt-0.5 normal-case font-normal tracking-normal">
                  {m.hostName} · {m.status}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Conversation panel */}
        <div className="flex-1 flex flex-col bg-background-base">
          {!activeMatch ? (
            <div className="flex-1 flex items-center justify-center text-foreground-muted text-sm">Chọn một kèo để xem thông tin</div>
          ) : (
            <>
              <div className="flex items-center gap-3.5 px-6 py-4 border-b-2 border-border-strong bg-surface">
                <div className="w-11 h-11 flex items-center justify-center bg-ink text-paper shrink-0">
                  <Swords size={20} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-foreground">{activeMatch.courtName || `Kèo #${activeMatch.matchId}`}</h3>
                  <p className="text-xs text-foreground-muted mt-0.5 flex items-center gap-1">
                    <MapPin size={12} /> {activeMatch.sportType || 'Thể thao'} · {activeMatch.currentParticipants}/{activeMatch.maxParticipants} người
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <p className="label-mono text-foreground-subtle">Trạng thái</p>
                  <p className="font-heading text-lg text-accent">{activeMatch.status}</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2 self-center border-2 border-border-strong bg-surface px-4 py-1.5 label-mono text-foreground-muted normal-case font-normal tracking-normal">
                  Host: {activeMatch.hostName || '—'} · {formatMatchDate(activeMatch.matchDate)} {formatTime(activeMatch.startTime)}–{formatTime(activeMatch.endTime)}
                </div>
                {activeMatch.notes && (
                  <div className="max-w-[70%] border-2 border-border-strong bg-surface px-4 py-3 text-sm text-foreground leading-6">
                    {activeMatch.notes}
                  </div>
                )}
                <div className="flex items-center gap-2 self-center border-2 border-warning bg-warning-bg px-4 py-1.5 text-sm text-warning">
                  Chat trực tiếp đang phát triển — liên hệ host qua thông tin kèo.
                </div>
              </div>

              <div className="flex items-center gap-2.5 px-6 py-3.5 border-t-2 border-border-strong bg-surface opacity-60">
                <input
                  type="text"
                  placeholder="Tính năng nhắn tin sắp ra mắt..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  disabled
                  className="input-base flex-1 h-11"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </MatchProLayout>
  )
}
