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
      <div className="flex h-[calc(100vh-60px)] bg-[#f0f7fa]">
        <div className="w-[260px] shrink-0 bg-white border-r border-[#e0ecf0] py-5 flex flex-col gap-1 overflow-y-auto">
          <h2 className="font-['Oswald'] text-[1.2rem] font-bold text-foreground px-4 mb-3">Kèo của tôi</h2>

          {loading && <PageLoader label="Đang tải..." />}
          {error && <p className="px-4 text-sm text-red-600">{error}</p>}

          {!loading && matches.length === 0 && (
            <p className="px-4 text-sm text-slate-500">Bạn chưa tham gia kèo nào. Tìm kèo mở tại trang Cộng đồng hoặc Gần bạn.</p>
          )}

          {matches.map(m => (
            <button
              key={m.matchId}
              type="button"
              className={`flex items-center gap-3 py-[11px] px-4 bg-transparent border-none cursor-pointer text-left transition-all font-['Inter'] hover:bg-[#f0f7fa] ${active === m.matchId ? 'bg-[rgba(13,138,138,0.08)]' : ''}`}
              onClick={() => setActive(m.matchId)}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-[1.1rem] shrink-0 bg-[#14B8A6] text-white">
                <Swords size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground whitespace-nowrap overflow-hidden text-ellipsis">
                  {m.courtName || `Kèo #${m.matchId}`}
                </p>
                <p className="text-[0.78rem] text-slate-400 whitespace-nowrap overflow-hidden text-ellipsis mt-0.5">
                  {m.hostName} · {m.status}
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className="flex-1 flex flex-col bg-white border-l border-[#e0ecf0]">
          {!activeMatch ? (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">Chọn một kèo để xem thông tin</div>
          ) : (
            <>
              <div className="flex items-center gap-3.5 px-6 py-4 border-b border-[#e0ecf0] bg-white">
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-white bg-[#14B8A6]">
                  <Swords size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">{activeMatch.courtName || `Kèo #${activeMatch.matchId}`}</h3>
                  <p className="text-[0.78rem] text-slate-400 mt-0.5 flex items-center gap-1">
                    <MapPin size={12} /> {activeMatch.sportType || 'Thể thao'} · {activeMatch.currentParticipants}/{activeMatch.maxParticipants} người
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-[0.68rem] font-bold tracking-[0.1em] text-slate-400 uppercase">TRẠNG THÁI</p>
                  <p className="font-['Oswald'] text-[1.1rem] font-bold text-[#14B8A6]">{activeMatch.status}</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2 self-center bg-[#f0f7fa] rounded-full px-3.5 py-1.5 text-[0.8rem] text-slate-500">
                  Host: {activeMatch.hostName || '—'} · {formatMatchDate(activeMatch.matchDate)} {formatTime(activeMatch.startTime)}–{formatTime(activeMatch.endTime)}
                </div>
                {activeMatch.notes && (
                  <div className="max-w-[70%] bg-[#f0f7fa] rounded-[0_14px_14px_14px] px-4 py-3 text-sm text-foreground leading-6">
                    {activeMatch.notes}
                  </div>
                )}
                <div className="flex items-center gap-2 self-center bg-amber-50 rounded-full px-3.5 py-1.5 text-[0.8rem] text-amber-700">
                  Chat trực tiếp đang phát triển — liên hệ host qua thông tin kèo.
                </div>
              </div>

              <div className="flex items-center gap-2.5 px-6 py-3.5 border-t border-[#e0ecf0] bg-white opacity-60">
                <input
                  type="text"
                  placeholder="Tính năng nhắn tin sắp ra mắt..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  disabled
                  className="flex-1 border-[1.5px] border-[#e0ecf0] rounded-full px-[18px] py-2.5 font-['Inter'] text-[0.9rem] text-foreground outline-none placeholder:text-slate-400"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </MatchProLayout>
  )
}
