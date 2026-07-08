import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MapPin, Clock, Star, Loader2 } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { matchApi } from '../../api/matchApi'
import { ratingApi } from '../../api/ratingApi'
import authApi from '../../api/authApi'
import { useToast } from '../../components/Toast'

// Hàng sao chọn điểm (1-5). readOnly = chỉ hiển thị.
function StarRow({ value, onChange, size = 18, readOnly = false }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          onClick={() => onChange && onChange(n)}
          className={readOnly ? 'cursor-default' : 'cursor-pointer'}
        >
          <Star
            size={size}
            className={n <= value ? 'text-warning' : 'text-foreground-subtle'}
            fill={n <= value ? 'currentColor' : 'none'}
          />
        </button>
      ))}
    </div>
  )
}

// Badge điểm tín nhiệm.
function TrustBadge({ score }) {
  if (!score || score.totalRatings === 0) {
    return <span className="text-xs text-foreground-subtle">Chưa có đánh giá</span>
  }
  return (
    <span className="label-mono text-warning flex items-center gap-1 normal-case tracking-normal">
      <Star size={12} fill="currentColor" /> {Number(score.trustScore).toFixed(1)} ({score.totalRatings} đánh giá)
    </span>
  )
}

export default function MatchDetailPage() {
  const { id } = useParams()
  const { addToast } = useToast()
  const [match, setMatch] = useState(null)
  const [joined, setJoined] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentUserId, setCurrentUserId] = useState(null)
  const [trustScores, setTrustScores] = useState({})
  const [ratingTarget, setRatingTarget] = useState(null)
  const [ratingScore, setRatingScore] = useState(5)
  const [ratingComment, setRatingComment] = useState('')
  const [submittingRating, setSubmittingRating] = useState(false)

  useEffect(() => {
    loadMatch()
  }, [id])

  useEffect(() => {
    authApi.getProfile()
      .then(r => { if (r?.statusCode === 200 && r.data) setCurrentUserId(r.data.userId) })
      .catch(() => {})
  }, [])

  function loadMatch() {
    matchApi.getMatchById(id)
      .then(res => { if (res.data) setMatch(res.data) })
      .catch(err => console.error(err))
  }

  // Lấy Trust Score cho host + người tham gia (TK-035).
  useEffect(() => {
    if (!match) return
    const ids = new Set()
    if (match.hostId) ids.add(match.hostId)
    ;(match.participants || []).forEach(p => ids.add(p.userId))
    ids.forEach(uid => {
      ratingApi.getTrustScore(uid)
        .then(r => { if (r?.statusCode === 200 && r.data) setTrustScores(prev => ({ ...prev, [uid]: r.data })) })
        .catch(() => {})
    })
  }, [match])

  async function handleJoin() {
    setIsLoading(true)
    try {
      const res = await matchApi.joinMatch(id)
      if (res.statusCode === 200 || res.statusCode === 201) {
        addToast('Tham gia thành công, đã khóa tiền ký quỹ!', 'success')
        setJoined(true)
        loadMatch()
      } else {
        addToast(res.message || 'Không thể tham gia kèo', 'error')
      }
    } catch (err) {
      addToast(err || 'Lỗi tham gia', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  async function submitRating() {
    if (!ratingTarget) return
    try {
      setSubmittingRating(true)
      const res = await ratingApi.createRating({
        ratedUserId: ratingTarget,
        matchId: Number(id),
        score: ratingScore,
        comment: ratingComment || null,
      })
      if (res.statusCode === 200 || res.statusCode === 201) {
        addToast('Đã gửi đánh giá người chơi!', 'success')
        ratingApi.getTrustScore(ratingTarget)
          .then(r => { if (r?.data) setTrustScores(prev => ({ ...prev, [ratingTarget]: r.data })) })
          .catch(() => {})
        setRatingTarget(null)
        setRatingScore(5)
        setRatingComment('')
      } else {
        addToast(res.message || 'Gửi đánh giá thất bại', 'error')
      }
    } catch (err) {
      addToast(typeof err === 'string' ? err : 'Gửi đánh giá thất bại', 'error')
    } finally {
      setSubmittingRating(false)
    }
  }

  if (!match) return <div className="p-10 text-center text-foreground-muted label-mono">Đang tải...</div>

  // Danh sách người có thể đánh giá (host + participants, trừ chính mình).
  const ratablePlayers = []
  const seen = new Set()
  if (match.hostId) { ratablePlayers.push({ userId: match.hostId, isHost: true }); seen.add(match.hostId) }
  ;(match.participants || []).forEach(p => {
    if (!seen.has(p.userId)) { ratablePlayers.push({ userId: p.userId, isHost: false }); seen.add(p.userId) }
  })
  const othersToRate = currentUserId ? ratablePlayers.filter(p => p.userId !== currentUserId) : []

  return (
    <div className="flex flex-col min-h-screen bg-background-base">
      <Navbar />

      <div className="max-w-[1100px] mx-auto px-4 md:px-10 pt-[110px] pb-20 w-full flex-1">
        <Link to="/matches" className="text-foreground-muted text-sm font-bold hover:text-accent mb-6 inline-flex items-center gap-1.5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Danh sách kèo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 lg:gap-12 items-start">
          <div className="flex flex-col gap-6">
            <div className="border-2 border-border-strong bg-surface p-6 md:p-8">
              <div className="flex gap-2 mb-5 flex-wrap">
                <span className="label-mono bg-ink text-paper px-3 py-1.5 rounded-[2px]">Cầu Lông</span>
                <span className="label-mono border border-border-strong text-foreground px-3 py-1.5 rounded-[2px]">{match.skillLevel}</span>
              </div>
              <h1 className="font-heading text-2xl md:text-3xl uppercase tracking-tight text-foreground mb-7">{match.title}</h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-7">
                <div>
                  <p className="label-mono text-foreground-subtle mb-1.5">Địa điểm</p>
                  <p className="text-sm font-extrabold text-foreground flex items-center gap-2"><MapPin size={16} className="text-accent shrink-0" /> {match.location}</p>
                </div>
                <div>
                  <p className="label-mono text-foreground-subtle mb-1.5">Thời gian</p>
                  <p className="text-sm font-extrabold text-foreground flex items-center gap-2"><Clock size={16} className="text-accent shrink-0" /> {new Date(match.matchDate).toLocaleDateString()} • {match.startTime}</p>
                </div>
              </div>

              <div className="bg-background-base border border-border-default p-4 rounded-[2px]">
                <p className="text-sm font-bold text-foreground mb-2">Ghi chú của chủ kèo</p>
                <p className="text-sm text-foreground-muted leading-relaxed">{match.notes || `Mã đặt sân: ${match.bookingId}`}</p>
              </div>
            </div>

            <div className="border-2 border-border-strong bg-surface p-6 md:p-8">
              <h2 className="font-heading text-lg uppercase text-foreground mb-6">Người tham gia ({match.currentParticipants}/{match.maxParticipants})</h2>
              <div className="flex flex-col gap-4">
                {match.participants && match.participants.map(p => (
                  <div key={p.id ?? p.userId} className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-[2px] bg-ink text-paper flex items-center justify-center font-heading text-sm shrink-0">
                      {p.userId}
                    </div>
                    <div>
                      <p className="font-extrabold text-foreground text-sm">Người chơi #{p.userId}</p>
                      <TrustBadge score={trustScores[p.userId]} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TK-035: Đánh giá người chơi sau trận */}
            {othersToRate.length > 0 && (
              <div className="border-2 border-border-strong bg-surface p-6 md:p-8">
                <h2 className="font-heading text-lg uppercase text-foreground mb-1">Đánh giá người chơi</h2>
                <p className="text-sm text-foreground-muted mb-5">Chấm điểm uy tín cho những người chơi cùng kèo (1–5 sao).</p>
                <div className="flex flex-col gap-3">
                  {othersToRate.map(pl => (
                    <div key={pl.userId} className="border border-border-default rounded-[2px] p-4">
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-[2px] bg-ink text-paper flex items-center justify-center font-heading text-sm shrink-0">{pl.userId}</div>
                          <div>
                            <p className="font-bold text-foreground text-sm">Người chơi #{pl.userId} {pl.isHost && <span className="text-accent text-xs">(Chủ kèo)</span>}</p>
                            <TrustBadge score={trustScores[pl.userId]} />
                          </div>
                        </div>
                        {ratingTarget !== pl.userId && (
                          <button
                            onClick={() => { setRatingTarget(pl.userId); setRatingScore(5); setRatingComment('') }}
                            className="text-xs font-bold uppercase tracking-wide text-foreground border-2 border-border-strong hover:bg-surface-hover px-3.5 py-2 rounded-[2px] transition-colors"
                          >
                            Đánh giá
                          </button>
                        )}
                      </div>

                      {ratingTarget === pl.userId && (
                        <div className="mt-4 pt-4 border-t border-border-default flex flex-col gap-3">
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-foreground-muted">Điểm:</span>
                            <StarRow value={ratingScore} onChange={setRatingScore} size={22} />
                          </div>
                          <textarea
                            value={ratingComment}
                            onChange={e => setRatingComment(e.target.value)}
                            rows={2}
                            maxLength={1000}
                            placeholder="Nhận xét (không bắt buộc)..."
                            className="w-full border-2 border-border-strong rounded-[2px] px-3 py-2 text-sm outline-none focus:border-accent resize-none bg-background-base text-foreground"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={submitRating}
                              disabled={submittingRating}
                              className="btn-primary text-xs disabled:opacity-60"
                            >
                              {submittingRating && <Loader2 size={14} className="animate-spin" />}
                              Gửi đánh giá
                            </button>
                            <button
                              onClick={() => setRatingTarget(null)}
                              className="text-xs font-bold uppercase tracking-wide text-foreground-muted px-4 py-2.5 rounded-[2px] hover:bg-surface-hover"
                            >
                              Hủy
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-28">
            <div className="border-2 border-border-strong bg-surface p-6 md:p-8">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b-2 border-border-strong">
                <div className="w-14 h-14 rounded-[2px] bg-ink text-paper flex items-center justify-center font-heading text-xl shrink-0">
                  {match.hostId}
                </div>
                <div>
                  <p className="label-mono text-foreground-subtle mb-1">Chủ kèo</p>
                  <p className="font-extrabold text-foreground">Người chơi #{match.hostId}</p>
                  <div className="mt-1"><TrustBadge score={trustScores[match.hostId]} /></div>
                </div>
              </div>

              <div className="flex justify-between items-center mb-7">
                <div>
                  <p className="label-mono text-foreground-subtle mb-1.5">Chi phí / chỗ</p>
                  <p className="font-heading text-2xl text-foreground">
                    {match.escrowAmount.toLocaleString('vi-VN')} <span className="text-sm font-sans font-normal text-foreground-subtle">VNĐ</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="label-mono text-foreground-subtle mb-1.5">Chỗ còn trống</p>
                  <p className="font-heading text-2xl text-foreground">{match.maxParticipants - match.currentParticipants}</p>
                </div>
              </div>

              {!joined ? (
                <>
                  <button onClick={handleJoin} disabled={isLoading} className="btn-primary w-full h-14 text-[13px] tracking-[0.06em] mb-4 disabled:opacity-70">
                    {isLoading ? 'Đang xử lý...' : 'Tham gia & Ký quỹ'}
                  </button>
                  <p className="text-[11.5px] text-foreground-subtle text-center leading-relaxed">
                    Hệ thống sẽ trừ <strong className="text-foreground">{match.escrowAmount.toLocaleString('vi-VN')} VNĐ</strong> từ ví ký quỹ. Sẽ hoàn lại 100% nếu bạn hủy trước 24h.
                  </p>
                </>
              ) : (
                <>
                  <button disabled className="w-full h-14 bg-transparent text-foreground font-extrabold text-[13px] uppercase tracking-[0.06em] rounded-[2px] cursor-not-allowed mb-3 border-2 border-border-strong flex items-center justify-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                    Đã tham gia
                  </button>
                  <button onClick={() => setJoined(false)} className="w-full h-12 bg-transparent text-danger font-bold text-[13px] uppercase tracking-[0.04em] rounded-[2px] border-2 border-danger hover:bg-danger-bg transition-colors">
                    Rút khỏi kèo
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
