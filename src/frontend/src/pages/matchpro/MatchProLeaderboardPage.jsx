import { useState, useEffect } from 'react'
import MatchProLayout from '../../layouts/MatchProLayout'
import { useAuth } from '../../context/AuthContext'
import { ratingApi } from '../../api/ratingApi'
import PageLoader from '../../components/ui/PageLoader'
import EmptyState from '../../components/ui/EmptyState'
import { Trophy } from 'lucide-react'

function avatarUrl(entry) {
  return entry.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.fullName || 'Player')}&background=0d1b2a&color=f3f2ee`
}

export default function MatchProLeaderboardPage() {
  const { user } = useAuth()
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [myRank, setMyRank] = useState(null)

  useEffect(() => {
    let active = true
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const res = await ratingApi.getLeaderboard(20)
        if (!active) return
        if (res.statusCode === 200 && Array.isArray(res.data)) {
          setPlayers(res.data)
          if (user?.userId) {
            const mine = res.data.find(p => p.userId === user.userId)
            setMyRank(mine ?? null)
          }
        } else {
          setError(res.message || 'Không tải được bảng xếp hạng.')
        }
      } catch (err) {
        if (active) setError(typeof err === 'string' ? err : 'Không tải được bảng xếp hạng.')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [user?.userId])

  const top3 = players.slice(0, 3)
  const rest = players.slice(3)

  return (
    <MatchProLayout>
      <div className="max-w-[1100px] mx-auto px-4 md:px-10 pb-16 pt-8">
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl md:text-5xl uppercase tracking-tight text-foreground mb-3">Bảng xếp hạng</h1>
          <p className="text-sm text-foreground-muted">Xếp hạng theo điểm tín nhiệm và số trận đã tham gia.</p>
        </div>

        {error && (
          <div className="border-2 border-danger bg-danger-bg px-4 py-3 text-sm text-danger mb-4">{error}</div>
        )}

        {loading ? (
          <PageLoader label="Đang tải bảng xếp hạng..." />
        ) : players.length === 0 ? (
          <EmptyState
            icon={<Trophy size={28} />}
            title="Chưa có đánh giá nào"
            subtitle="Hãy tham gia kèo và nhận đánh giá từ đồng đội!"
          />
        ) : (
          <>
            {players.length >= 3 && (
              <div className="grid grid-cols-[1fr_1.2fr_1fr] gap-4 items-end mb-12">
                {/* #2 */}
                <div className="text-center">
                  <img src={avatarUrl(top3[1])} alt={top3[1].fullName} className="w-16 h-16 rounded-full object-cover mx-auto mb-3 border-2 border-border-strong" />
                  <p className="font-extrabold text-sm text-foreground mb-1 truncate">{top3[1].fullName}</p>
                  <p className="font-heading text-xl text-foreground mb-3">{top3[1].points.toLocaleString()}</p>
                  <div className="h-[100px] bg-ink flex items-start justify-center pt-2">
                    <span className="font-heading text-2xl text-paper">2</span>
                  </div>
                </div>
                {/* #1 */}
                <div className="text-center">
                  <img src={avatarUrl(top3[0])} alt={top3[0].fullName} className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-[3px] border-accent" />
                  <p className="font-extrabold text-base text-foreground mb-1 truncate">{top3[0].fullName}</p>
                  <p className="font-heading text-2xl text-foreground mb-3">{top3[0].points.toLocaleString()}</p>
                  <div className="h-[140px] bg-ink flex items-start justify-center pt-2">
                    <span className="font-heading text-3xl text-paper">1</span>
                  </div>
                </div>
                {/* #3 */}
                <div className="text-center">
                  <img src={avatarUrl(top3[2])} alt={top3[2].fullName} className="w-14 h-14 rounded-full object-cover mx-auto mb-3 border-2 border-border-strong" />
                  <p className="font-extrabold text-[13px] text-foreground mb-1 truncate">{top3[2].fullName}</p>
                  <p className="font-heading text-lg text-foreground mb-3">{top3[2].points.toLocaleString()}</p>
                  <div className="h-[76px] bg-background-elevated border-2 border-border-strong flex items-start justify-center pt-2">
                    <span className="font-heading text-xl text-foreground">3</span>
                  </div>
                </div>
              </div>
            )}

            <div className="border-2 border-border-strong bg-surface">
              <div className="grid grid-cols-[60px_1fr_100px_80px_100px] max-sm:grid-cols-[40px_1fr_70px_70px] px-6 py-3.5 bg-ink text-paper label-mono">
                <span>Hạng</span>
                <span>Người chơi</span>
                <span>Điểm TN</span>
                <span className="max-sm:hidden">Trận</span>
                <span>Điểm</span>
              </div>
              {rest.map(p => (
                <div key={p.userId} className="grid grid-cols-[60px_1fr_100px_80px_100px] max-sm:grid-cols-[40px_1fr_70px_70px] items-center px-6 py-4 border-t border-border-default text-[13px]">
                  <span className="font-extrabold text-foreground">{p.rank}</span>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={avatarUrl(p)} alt={p.fullName} className="w-8 h-8 rounded-full object-cover shrink-0" />
                    <span className="font-bold text-foreground truncate">{p.fullName}</span>
                  </div>
                  <span className="text-foreground-muted">{p.trustScore}/5</span>
                  <span className="text-foreground-muted max-sm:hidden">{p.matchCount}</span>
                  <span className="font-extrabold text-foreground">{p.points.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="border-2 border-ink bg-ink text-paper p-6 mt-5 flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={user?.avatarUrl || avatarUrl({ fullName: user?.fullName || 'Ban' })}
              alt={user?.fullName || 'Bạn'}
              className="w-11 h-11 rounded-full object-cover"
            />
            <div>
              <p className="font-extrabold text-[13px]">
                {user?.fullName || 'Bạn'} <span className="label-mono bg-paper text-ink px-2 py-0.5 ml-1.5">Bạn</span>
              </p>
              <p className="label-mono text-foreground-subtle mt-1">
                {myRank ? `Hạng #${myRank.rank} · ${myRank.points} điểm` : 'Tham gia kèo và nhận đánh giá để lên bảng xếp hạng'}
              </p>
            </div>
          </div>
          {myRank && (
            <div className="flex-1 min-w-[200px]">
              <p className="label-mono text-foreground-subtle mb-2">Trust Score: {myRank.trustScore}/5 · {myRank.matchCount} trận</p>
              <div className="h-2 bg-paper/20 rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${Math.min(100, (myRank.trustScore / 5) * 100)}%` }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </MatchProLayout>
  )
}
