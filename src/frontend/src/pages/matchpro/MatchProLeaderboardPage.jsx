import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import MatchProLayout from '../../layouts/MatchProLayout'
import { useAuth } from '../../context/AuthContext'
import { ratingApi } from '../../api/ratingApi'
import PageLoader from '../../components/ui/PageLoader'
import './MatchProLeaderboardPage.css'

const sportColors = { Badminton: '#22c55e', Pickleball: '#6366f1', All: '#5E6AD2' }

function avatarUrl(entry) {
  return entry.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.fullName || 'Player')}&background=5E6AD2&color=fff`
}

export default function MatchProLeaderboardPage() {
  const { user } = useAuth()
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [myRank, setMyRank] = useState(null)
  const pageRef = useRef(null)

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

  useEffect(() => {
    if (loading) return
    const ctx = gsap.context(() => {
      gsap.from('.lb-hero', { opacity: 0, y: 24, duration: 0.6, ease: 'power3.out' })
      gsap.from('.lb-podium__place', { opacity: 0, y: 40, duration: 0.6, stagger: 0.12, ease: 'back.out(1.5)', delay: 0.3 })
      gsap.from('.lb-row', { opacity: 0, x: -30, duration: 0.4, stagger: 0.06, ease: 'power2.out', delay: 0.5 })
    }, pageRef)
    return () => ctx.revert()
  }, [loading, players.length])

  const top3 = players.slice(0, 3)
  const rest = players.slice(3)

  return (
    <MatchProLayout>
      <div className="mp-lb-page" ref={pageRef}>
        <div className="lb-hero">
          <div>
            <h1 className="lb-hero__title">Bảng xếp hạng</h1>
            <p className="lb-hero__sub">Xếp hạng theo điểm tín nhiệm và số trận đã tham gia.</p>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 mb-4">{error}</div>
        )}

        {loading ? (
          <PageLoader label="Đang tải bảng xếp hạng..." />
        ) : players.length === 0 ? (
          <div className="text-center py-16 text-foreground-muted">Chưa có đánh giá nào. Hãy tham gia kèo và nhận đánh giá từ đồng đội!</div>
        ) : (
          <>
            {players.length >= 3 && (
              <div className="lb-podium">
                <div className="lb-podium__place lb-podium__place--2">
                  <img src={avatarUrl(top3[1])} alt={top3[1].fullName} className="lb-podium__avatar" />
                  <div className="lb-podium__medal lb-podium__medal--silver"></div>
                  <p className="lb-podium__name">{top3[1].fullName}</p>
                  <p className="lb-podium__pts">{top3[1].points.toLocaleString()}</p>
                  <div className="lb-podium__bar lb-podium__bar--2" />
                </div>
                <div className="lb-podium__place lb-podium__place--1">
                  <div className="lb-podium__crown"></div>
                  <img src={avatarUrl(top3[0])} alt={top3[0].fullName} className="lb-podium__avatar lb-podium__avatar--1" />
                  <div className="lb-podium__medal lb-podium__medal--gold"></div>
                  <p className="lb-podium__name">{top3[0].fullName}</p>
                  <p className="lb-podium__pts">{top3[0].points.toLocaleString()}</p>
                  <div className="lb-podium__bar lb-podium__bar--1" />
                </div>
                <div className="lb-podium__place lb-podium__place--3">
                  <img src={avatarUrl(top3[2])} alt={top3[2].fullName} className="lb-podium__avatar" />
                  <div className="lb-podium__medal lb-podium__medal--bronze"></div>
                  <p className="lb-podium__name">{top3[2].fullName}</p>
                  <p className="lb-podium__pts">{top3[2].points.toLocaleString()}</p>
                  <div className="lb-podium__bar lb-podium__bar--3" />
                </div>
              </div>
            )}

            <div className="lb-table">
              <div className="lb-table__header">
                <span className="lb-col-rank">Hạng</span>
                <span className="lb-col-player">Người chơi</span>
                <span className="lb-col-sport">Điểm TN</span>
                <span className="lb-col-wins">Trận</span>
                <span className="lb-col-pts">Điểm</span>
                <span className="lb-col-change">Đánh giá</span>
              </div>
              {rest.map((p, i) => (
                <div key={p.userId} className={`lb-row ${i % 2 === 0 ? 'lb-row--alt' : ''}`}>
                  <span className="lb-col-rank lb-rank-num">{p.rank}</span>
                  <div className="lb-col-player lb-player">
                    <img src={avatarUrl(p)} alt={p.fullName} className="lb-player__avatar" />
                    <div>
                      <p className="lb-player__name">{p.fullName}</p>
                      <p className="lb-player__level">{p.trustScore}/5 sao</p>
                    </div>
                  </div>
                  <span className="lb-col-sport">
                    <span className="lb-sport-dot" style={{ background: sportColors.All }} />
                    {p.trustScore}
                  </span>
                  <span className="lb-col-wins">{p.matchCount}</span>
                  <span className="lb-col-pts lb-pts">{p.points.toLocaleString()}</span>
                  <span className="lb-col-change lb-change lb-change--same">{p.totalRatings}</span>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="lb-my-rank">
          <div className="lb-my-rank__left">
            <img
              src={user?.avatarUrl || avatarUrl({ fullName: user?.fullName || 'Ban' })}
              alt={user?.fullName || 'Bạn'}
              className="lb-player__avatar"
            />
            <div>
              <p className="lb-player__name">
                {user?.fullName || 'Bạn'} <span className="lb-you-badge">BẠN</span>
              </p>
              <p className="lb-player__level">
                {myRank ? `Hạng #${myRank.rank} · ${myRank.points} điểm` : 'Tham gia kèo và nhận đánh giá để lên bảng xếp hạng'}
              </p>
            </div>
          </div>
          {myRank && (
            <div className="lb-my-rank__progress">
              <p className="lb-my-rank__label">Trust Score: {myRank.trustScore}/5 · {myRank.matchCount} trận</p>
              <div className="lb-my-rank__bar">
                <div className="lb-my-rank__fill" style={{ width: `${Math.min(100, (myRank.trustScore / 5) * 100)}%` }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </MatchProLayout>
  )
}
