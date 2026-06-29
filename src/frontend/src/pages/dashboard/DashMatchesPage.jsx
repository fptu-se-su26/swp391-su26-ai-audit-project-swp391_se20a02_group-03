import { useState, useEffect } from 'react'
import ProSportDashLayout from '../../layouts/ProSportDashLayout'
import { matchApi } from '../../api/matchApi'
import PageLoader from '../../components/ui/PageLoader'
import StatusBadge from '../../components/ui/StatusBadge'

export default function DashMatchesPage() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    matchApi.getOpenMatches()
      .then(res => {
        if (!active) return
        const list = res.data ?? res
        setMatches(Array.isArray(list) ? list : [])
      })
      .catch(err => { if (active) setError(typeof err === 'string' ? err : 'Không tải được kèo.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  return (
    <ProSportDashLayout>
      <div>
        <div className="mb-6">
          <h1 className="dash-page-title">Trận đấu / Kèo mở</h1>
          <p className="dash-page-sub">Theo dõi các kèo MatchPro đang hoạt động tại cơ sở.</p>
        </div>

        {loading && <PageLoader label="Đang tải kèo..." />}
        {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {matches.length === 0 && (
              <p className="text-slate-400 col-span-full py-8 text-center">Không có kèo đang mở.</p>
            )}
            {matches.map(m => (
              <div key={m.matchId} className="bg-white rounded-xl border-[1.5px] border-[#e0ecf0] p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-foreground">Kèo #{m.matchId}</h3>
                  <StatusBadge status={m.status || 'Open'} />
                </div>
                <p className="text-sm text-slate-600 mb-1">{m.title || m.description || 'Kèo xã giao'}</p>
                <p className="text-xs text-slate-400">
                  {m.courtName || m.location || 'Sân'} • Host #{m.hostId ?? m.hostUserId ?? '—'}
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  {m.scheduledDate ? new Date(m.scheduledDate).toLocaleString('vi-VN') : 'Chưa có lịch'}
                </p>
                <p className="text-sm font-semibold text-[#14B8A6] mt-3">
                  {m.currentPlayers ?? m.participantCount ?? 0}/{m.maxPlayers ?? m.capacity ?? '?'} người
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProSportDashLayout>
  )
}
