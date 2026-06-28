import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import MobileLayout from '../../layouts/MobileLayout'
import { matchApi } from '../../api/matchApi'
import PageLoader from '../../components/ui/PageLoader'
import EmptyState from '../../components/ui/EmptyState'
import { Swords, MapPin, Clock } from 'lucide-react'

export default function MobileMatchesPage() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    matchApi.getOpenMatches()
      .then(res => setMatches(Array.isArray(res?.data) ? res.data : []))
      .catch(err => setError(typeof err === 'string' ? err : 'Không tải được kèo'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <MobileLayout title="Kèo đấu">
      <div className="font-sans -mx-4 -my-5 pb-24">
        {loading ? (
          <PageLoader message="Đang tải kèo..." />
        ) : error ? (
          <div className="px-4 py-8 text-center text-red-500 text-sm font-medium">{error}</div>
        ) : matches.length === 0 ? (
          <div className="px-4">
            <EmptyState
              icon={<Swords size={28} />}
              title="Chưa có kèo mở"
              subtitle="Hãy tạo kèo mới hoặc xem trên bảng tin MatchPro."
              action={<Link to="/matches/create" className="btn-primary no-underline text-sm px-6 py-2.5">Tạo kèo</Link>}
            />
          </div>
        ) : (
          <div className="px-4 flex flex-col gap-4">
            {matches.map(m => (
              <Link
                key={m.matchId}
                to={`/matches/${m.matchId}`}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col gap-3 no-underline text-inherit"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#5E6AD2]/10 text-[#5E6AD2] shrink-0">
                    <Swords size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{m.title}</h3>
                    <p className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                      <Clock size={12} /> {new Date(m.matchDate).toLocaleDateString('vi-VN')} • {m.startTime?.slice?.(0, 5) || m.startTime}
                    </p>
                  </div>
                  <span className="bg-orange-100 text-orange-700 text-[0.65rem] font-bold px-2 py-1 rounded-full whitespace-nowrap">
                    Còn {m.maxParticipants - m.currentParticipants} slot
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-dashed border-slate-100">
                  <span className="text-xs text-slate-500 flex items-center gap-1"><MapPin size={12} /> {m.skillLevel}</span>
                  <span className="text-sm font-bold text-[#5E6AD2]">{m.escrowAmount?.toLocaleString('vi-VN')}đ</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </MobileLayout>
  )
}
