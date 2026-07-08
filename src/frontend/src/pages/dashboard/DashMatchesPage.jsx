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
        <div className="mb-7">
          <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground mb-2">Trận đấu / Kèo mở</h1>
          <p className="text-[13px] text-foreground-muted">Theo dõi các kèo MatchPro đang hoạt động tại cơ sở.</p>
        </div>

        {loading && <PageLoader label="Đang tải kèo..." />}
        {error && <div className="border-2 border-danger bg-danger-bg px-4 py-3 text-sm text-danger rounded-[2px]">{error}</div>}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {matches.length === 0 && (
              <p className="text-foreground-subtle col-span-full py-8 text-center">Không có kèo đang mở.</p>
            )}
            {matches.map(m => (
              <div key={m.matchId} className="border-2 border-border-strong bg-surface p-5.5 rounded-[2px]">
                <div className="flex justify-between items-start mb-2.5">
                  <h3 className="font-heading text-base uppercase tracking-tight text-foreground">Kèo #{m.matchId}</h3>
                  <StatusBadge status={m.status || 'Open'} />
                </div>
                <p className="text-sm text-foreground mb-1.5">{m.title || m.description || 'Kèo xã giao'}</p>
                <p className="font-mono text-[10.5px] text-foreground-subtle mb-3">
                  {m.courtName || m.location || 'Sân'} • Host #{m.hostId ?? m.hostUserId ?? '—'}
                </p>
                <p className="text-xs text-foreground-subtle mt-2">
                  {m.scheduledDate ? new Date(m.scheduledDate).toLocaleString('vi-VN') : 'Chưa có lịch'}
                </p>
                <p className="text-sm font-extrabold text-foreground mt-3">
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
