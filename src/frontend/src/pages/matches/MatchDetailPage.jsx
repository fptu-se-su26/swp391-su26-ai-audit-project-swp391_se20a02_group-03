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
            className={n <= value ? 'text-amber-400' : 'text-slate-300'}
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
    return <span className="text-xs text-slate-400">Chưa có đánh giá</span>
  }
  return (
    <span className="text-xs font-semibold text-amber-500 flex items-center gap-1">
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

  if (!match) return <div className="p-10 text-center">Đang tải...</div>

  // Danh sách người có thể đánh giá (host + participants, trừ chính mình).
  const ratablePlayers = []
  const seen = new Set()
  if (match.hostId) { ratablePlayers.push({ userId: match.hostId, isHost: true }); seen.add(match.hostId) }
  ;(match.participants || []).forEach(p => {
    if (!seen.has(p.userId)) { ratablePlayers.push({ userId: p.userId, isHost: false }); seen.add(p.userId) }
  })
  const othersToRate = currentUserId ? ratablePlayers.filter(p => p.userId !== currentUserId) : []

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f9fb]">
      <Navbar theme="light" />

      <div className="max-w-[1000px] mx-auto px-6 pt-[90px] pb-20 w-full flex-1">
        <Link to="/matches" className="text-slate-400 text-sm hover:text-[#14B8A6] mb-6 inline-block flex items-center gap-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Danh sách kèo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex gap-2 mb-4">
                <span className="bg-[#14B8A6]/10 text-[#14B8A6] text-xs font-bold px-2.5 py-1 rounded-full uppercase">Cầu Lông</span>
                <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2.5 py-1 rounded-full uppercase">{match.skillLevel}</span>
              </div>
              <h1 className="font-['Oswald'] text-2xl font-bold text-slate-900 mb-6">{match.title}</h1>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0"><MapPin size={20} className="text-[#14B8A6]" /></div>
                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">Địa điểm</p>
                    <p className="text-sm font-semibold text-slate-800">{match.location}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0"><Clock size={20} className="text-[#14B8A6]" /></div>
                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">Thời gian</p>
                    <p className="text-sm font-semibold text-slate-800">{new Date(match.matchDate).toLocaleDateString()} • {match.startTime}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-sm font-semibold text-slate-900 mb-2">Ghi chú của chủ kèo</p>
                <p className="text-sm text-slate-600 leading-relaxed">{match.notes || `Mã đặt sân: ${match.bookingId}`}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-slate-900">Người tham gia ({match.currentParticipants}/{match.maxParticipants})</h2>
              </div>
              <div className="space-y-4">
                {match.participants && match.participants.map(p => (
                  <div key={p.id ?? p.userId} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[#14B8A6]">
                      {p.userId}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">Người chơi #{p.userId}</p>
                      <TrustBadge score={trustScores[p.userId]} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TK-035: Đánh giá người chơi sau trận */}
            {othersToRate.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-1">Đánh giá người chơi</h2>
                <p className="text-sm text-slate-500 mb-5">Chấm điểm uy tín cho những người chơi cùng kèo (1–5 sao).</p>
                <div className="space-y-3">
                  {othersToRate.map(pl => (
                    <div key={pl.userId} className="border border-slate-100 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[#14B8A6]">{pl.userId}</div>
                          <div>
                            <p className="font-semibold text-slate-900 text-sm">Người chơi #{pl.userId} {pl.isHost && <span className="text-[#14B8A6] text-xs">(Chủ kèo)</span>}</p>
                            <TrustBadge score={trustScores[pl.userId]} />
                          </div>
                        </div>
                        {ratingTarget !== pl.userId && (
                          <button
                            onClick={() => { setRatingTarget(pl.userId); setRatingScore(5); setRatingComment('') }}
                            className="text-sm font-semibold text-[#14B8A6] hover:bg-[#14B8A6]/10 px-3 py-1.5 rounded-lg"
                          >
                            Đánh giá
                          </button>
                        )}
                      </div>

                      {ratingTarget === pl.userId && (
                        <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-slate-600">Điểm:</span>
                            <StarRow value={ratingScore} onChange={setRatingScore} size={22} />
                          </div>
                          <textarea
                            value={ratingComment}
                            onChange={e => setRatingComment(e.target.value)}
                            rows={2}
                            maxLength={1000}
                            placeholder="Nhận xét (không bắt buộc)..."
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#14B8A6] resize-none"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={submitRating}
                              disabled={submittingRating}
                              className="bg-[#14B8A6] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#0D9488] flex items-center gap-2 disabled:opacity-60"
                            >
                              {submittingRating && <Loader2 size={14} className="animate-spin" />}
                              Gửi đánh giá
                            </button>
                            <button
                              onClick={() => setRatingTarget(null)}
                              className="text-sm font-semibold text-slate-500 px-4 py-2 rounded-lg hover:bg-slate-100"
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

          <div className="sticky top-24 h-fit">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[#14B8A6] text-xl">
                  {match.hostId}
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Chủ kèo</p>
                  <p className="font-bold text-slate-900">Người chơi #{match.hostId}</p>
                  <div className="mt-0.5"><TrustBadge score={trustScores[match.hostId]} /></div>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Chi phí / chỗ</p>
                  <p className="font-['Oswald'] text-2xl font-bold text-[#14B8A6]">
                    {match.escrowAmount.toLocaleString('vi-VN')} <span className="text-sm font-normal text-slate-400">VNĐ</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-sm mb-1">Chỗ còn trống</p>
                  <p className="font-['Oswald'] text-2xl font-bold text-slate-900">{match.maxParticipants - match.currentParticipants}</p>
                </div>
              </div>

              {!joined ? (
                <>
                  <button onClick={handleJoin} disabled={isLoading} className="w-full bg-[#14B8A6] text-[var(--theme-primary)] font-bold py-3.5 rounded-xl hover:bg-[#0D9488] transition-colors shadow-md shadow-[#14B8A6]/20 flex items-center justify-center gap-2 mb-3 disabled:opacity-70">
                    {isLoading ? 'Đang xử lý...' : 'Tham gia & Ký quỹ'}
                  </button>
                  <p className="text-xs text-slate-400 text-center leading-relaxed">
                    Hệ thống sẽ trừ <b>{match.escrowAmount.toLocaleString('vi-VN')} VNĐ</b> từ ví ký quỹ. Sẽ hoàn lại 100% nếu bạn hủy trước 24h.
                  </p>
                </>
              ) : (
                <>
                  <button disabled className="w-full bg-green-50 text-green-600 font-bold py-3.5 rounded-xl cursor-not-allowed mb-3 border border-green-200 flex items-center justify-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                    Đã tham gia
                  </button>
                  <button onClick={() => setJoined(false)} className="w-full bg-white text-red-500 font-bold py-3 rounded-xl border border-red-200 hover:bg-red-50 transition-colors">
                    Rút khỏi kèo
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer variant="light" />
    </div>
  )
}
