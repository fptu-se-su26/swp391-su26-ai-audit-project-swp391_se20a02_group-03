import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import MatchProLayout from '../../layouts/MatchProLayout'
import { useAuth } from '../../context/AuthContext'
import { ratingApi } from '../../api/ratingApi'
import PageLoader from '../../components/ui/PageLoader'
import EmptyState from '../../components/ui/EmptyState'
import { Trophy, TrendingUp, MapPin, Users, Medal, Star, ShieldCheck } from 'lucide-react'

const sidebarLinks = [
  { label: 'Bảng tin kèo', icon: TrendingUp, path: '/matches' },
  { label: 'Xếp hạng', icon: Trophy, active: true, path: '/matches/leaderboard' },
]

const modernCardClass = "bg-white rounded-[12px] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] border border-gray-100"

function avatarUrl(entry) {
  return entry.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.fullName || 'Player')}&background=14b8a6&color=ffffff`
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
      <div className="grid grid-cols-[240px_1fr_320px] max-lg:grid-cols-[220px_1fr] max-md:grid-cols-1 gap-6 items-start w-full max-w-[1440px] mx-auto px-4 md:px-8 pb-16 pt-8 font-sans">
        
        {/* ── CỘT TRÁI (Sidebar Điều hướng) ── */}
        <aside className="flex flex-col gap-6 max-md:hidden shrink-0 sticky top-[100px]">

          <nav className={`flex flex-col gap-2 p-4 ${modernCardClass}`}>
            {sidebarLinks.map(link => (
              <Link
                key={link.label}
                to={link.path}
                className={`flex items-center gap-3 py-3 px-4 rounded-[8px] text-[14px] font-semibold transition-colors no-underline ${
                  link.active 
                    ? 'bg-[#14b8a6]/10 text-[#14b8a6]' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <link.icon size={20} strokeWidth={link.active ? 2.5 : 2} />
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* ── CỘT GIỮA (Nội dung chính) ── */}
        <div className="flex flex-col min-w-0 gap-6">
          
          <div className={`p-8 flex flex-col items-center text-center bg-gradient-to-br from-white to-gray-50 ${modernCardClass}`}>
            <div className="w-16 h-16 bg-teal-50 text-[#14b8a6] rounded-full flex items-center justify-center mb-4 shadow-sm border border-teal-100">
              <Trophy size={32} />
            </div>
            <h1 className="font-heading text-3xl uppercase tracking-tight text-gray-900 mb-2 m-0">
              Bảng Xếp Hạng
            </h1>
            <p className="text-gray-500 text-[14px] m-0">
              Xếp hạng theo điểm tín nhiệm và số trận đã tham gia.
            </p>
          </div>

          {error && (
            <div className="border border-red-200 bg-red-50 px-4 py-3 rounded-[12px] text-sm text-red-600 mb-2">
              {error}
            </div>
          )}

          {loading ? (
            <div className={`py-12 ${modernCardClass}`}><PageLoader label="Đang tải bảng xếp hạng..." /></div>
          ) : players.length === 0 ? (
            <div className={`py-12 ${modernCardClass}`}>
              <EmptyState
                icon={<Trophy size={32} className="text-gray-300" />}
                title="Chưa có đánh giá nào"
                subtitle="Hãy tham gia kèo và nhận đánh giá từ đồng đội!"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              
              {/* TOP 3 PODIUM */}
              {players.length >= 3 && (
                <div className={`p-8 pb-0 pt-10 overflow-hidden ${modernCardClass}`}>
                  <div className="grid grid-cols-3 gap-2 items-end h-[280px]">
                    {/* Hạng 2 */}
                    <div className="flex flex-col items-center relative group z-10">
                      <div className="absolute -top-6 bg-gray-100 text-gray-600 font-bold text-[12px] px-2.5 py-1 rounded-full border border-gray-200 opacity-0 group-hover:opacity-100 transition-all -translate-y-2 group-hover:-translate-y-4">
                        {top3[1].trustScore}/5 TN
                      </div>
                      <img src={avatarUrl(top3[1])} alt={top3[1].fullName} className="w-16 h-16 rounded-full object-cover mb-3 border-4 border-white shadow-md relative z-20" />
                      <p className="font-bold text-[14px] text-gray-900 mb-0.5 truncate w-full text-center px-1 m-0">{top3[1].fullName}</p>
                      <p className="text-[13px] font-semibold text-[#14b8a6] mb-4 m-0">{top3[1].points.toLocaleString()} pts</p>
                      <div className="w-full bg-gradient-to-t from-gray-200 to-gray-100 h-[100px] rounded-t-xl border-t border-x border-gray-200 flex flex-col items-center pt-3 relative overflow-hidden shadow-inner">
                        <span className="font-heading text-4xl text-gray-400 opacity-50 relative z-10">2</span>
                      </div>
                    </div>

                    {/* Hạng 1 */}
                    <div className="flex flex-col items-center relative group z-20 -mx-2">
                      <div className="absolute -top-8 bg-amber-100 text-amber-700 font-bold text-[12px] px-2.5 py-1 rounded-full border border-amber-200 opacity-0 group-hover:opacity-100 transition-all -translate-y-2 group-hover:-translate-y-4 shadow-sm z-30">
                        {top3[0].trustScore}/5 TN
                      </div>
                      <div className="relative mb-3">
                        <div className="absolute -top-3 -right-2 text-amber-400 rotate-[15deg] z-30 drop-shadow-md">
                          <Trophy size={20} className="fill-amber-400" />
                        </div>
                        <img src={avatarUrl(top3[0])} alt={top3[0].fullName} className="w-20 h-20 rounded-full object-cover border-4 border-amber-400 shadow-lg relative z-20" />
                        <div className="absolute inset-0 rounded-full bg-amber-400 blur-md opacity-30 z-10 scale-110"></div>
                      </div>
                      <p className="font-bold text-[15px] text-gray-900 mb-0.5 truncate w-full text-center px-1 m-0">{top3[0].fullName}</p>
                      <p className="text-[14px] font-bold text-amber-500 mb-3 m-0 drop-shadow-sm">{top3[0].points.toLocaleString()} pts</p>
                      <div className="w-full bg-gradient-to-t from-amber-200 to-amber-100 h-[140px] rounded-t-2xl border-t-2 border-x-2 border-amber-300 flex flex-col items-center pt-4 relative overflow-hidden shadow-[0_-5px_15px_rgba(251,191,36,0.3)]">
                        <span className="font-heading text-5xl text-amber-500 opacity-60 drop-shadow-sm relative z-10">1</span>
                      </div>
                    </div>

                    {/* Hạng 3 */}
                    <div className="flex flex-col items-center relative group z-10">
                      <div className="absolute -top-6 bg-orange-100 text-orange-700 font-bold text-[12px] px-2.5 py-1 rounded-full border border-orange-200 opacity-0 group-hover:opacity-100 transition-all -translate-y-2 group-hover:-translate-y-4">
                        {top3[2].trustScore}/5 TN
                      </div>
                      <img src={avatarUrl(top3[2])} alt={top3[2].fullName} className="w-14 h-14 rounded-full object-cover mb-3 border-4 border-white shadow-md relative z-20" />
                      <p className="font-bold text-[13px] text-gray-900 mb-0.5 truncate w-full text-center px-1 m-0">{top3[2].fullName}</p>
                      <p className="text-[12px] font-semibold text-orange-500 mb-4 m-0">{top3[2].points.toLocaleString()} pts</p>
                      <div className="w-full bg-gradient-to-t from-orange-100 to-orange-50 h-[80px] rounded-t-lg border-t border-x border-orange-200 flex flex-col items-center pt-2 relative overflow-hidden shadow-inner">
                        <span className="font-heading text-3xl text-orange-400 opacity-50 relative z-10">3</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* LIST HẠNG CÒN LẠI */}
              <div className={`overflow-hidden flex flex-col ${modernCardClass}`}>
                <div className="grid grid-cols-[60px_1fr_100px_80px_100px] max-sm:grid-cols-[50px_1fr_70px_80px] px-6 py-4 bg-gray-50 border-b border-gray-100 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
                  <span>Hạng</span>
                  <span>Người chơi</span>
                  <span className="text-center">Tín nhiệm</span>
                  <span className="max-sm:hidden text-center">Trận</span>
                  <span className="text-right">Điểm</span>
                </div>
                <div className="flex flex-col">
                  {rest.map(p => (
                    <div key={p.userId} className="grid grid-cols-[60px_1fr_100px_80px_100px] max-sm:grid-cols-[50px_1fr_70px_80px] items-center px-6 py-4 border-b border-gray-50 last:border-0 text-[14px] hover:bg-gray-50/50 transition-colors">
                      <span className="font-bold text-gray-400 pl-2">{p.rank}</span>
                      <div className="flex items-center gap-3 min-w-0 pr-4">
                        <img src={avatarUrl(p)} alt={p.fullName} className="w-9 h-9 rounded-full object-cover shrink-0 border border-gray-100 shadow-sm" />
                        <span className="font-bold text-gray-900 truncate">{p.fullName}</span>
                      </div>
                      <div className="flex justify-center">
                        <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-[12px] font-bold border border-green-100 flex items-center gap-1">
                          <ShieldCheck size={12} /> {p.trustScore}
                        </span>
                      </div>
                      <span className="text-gray-500 max-sm:hidden text-center font-medium">{p.matchCount}</span>
                      <span className="font-bold text-[#14b8a6] text-right">{p.points.toLocaleString()}</span>
                    </div>
                  ))}
                  {rest.length === 0 && players.length > 0 && players.length < 4 && (
                     <div className="py-8 text-center text-[13px] text-gray-400">
                        Chưa có người chơi xếp hạng ở vị trí này.
                     </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── CỘT PHẢI (Sidebar Widgets) ── */}
        <div className="flex flex-col gap-6 max-lg:col-span-full max-lg:grid max-lg:grid-cols-2 max-md:grid-cols-1 shrink-0 sticky top-[100px]">

          {/* Thành tích cá nhân */}
          <div className={`p-5 flex flex-col ${modernCardClass}`}>
             <h3 className="text-[14px] font-bold uppercase tracking-wider text-gray-900 mb-5 flex items-center gap-2 m-0 pb-3 border-b border-gray-100">
               <Medal size={16} className="text-[#14b8a6]" /> Thành tích của bạn
            </h3>
            
            <div className="flex items-center gap-3 mb-5">
              <img
                src={user?.avatarUrl || avatarUrl({ fullName: user?.fullName || 'Ban' })}
                alt={user?.fullName || 'Bạn'}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-100 shadow-sm"
              />
              <div className="flex flex-col">
                <p className="font-bold text-[14px] text-gray-900 m-0">
                  {user?.fullName || 'Tài khoản của bạn'} 
                </p>
                {myRank ? (
                   <p className="text-[13px] text-[#14b8a6] font-semibold m-0 mt-0.5">
                     Hạng #{myRank.rank} <span className="text-gray-300 mx-1">|</span> {myRank.points.toLocaleString()} pts
                   </p>
                ) : (
                   <p className="text-[12px] text-gray-500 m-0 mt-0.5">Chưa xếp hạng</p>
                )}
              </div>
            </div>

            {myRank ? (
               <div className="flex flex-col gap-4 bg-gray-50 rounded-[8px] p-4 border border-gray-100">
                  <div className="flex flex-col gap-1.5">
                     <div className="flex justify-between items-center text-[12px]">
                        <span className="text-gray-500 font-medium">Độ uy tín (Trust Score)</span>
                        <span className="font-bold text-green-600">{myRank.trustScore}/5.0</span>
                     </div>
                     <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${Math.min(100, (myRank.trustScore / 5) * 100)}%` }} />
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200">
                     <div className="flex flex-col">
                        <span className="text-[11px] text-gray-500 uppercase tracking-wider">Số trận</span>
                        <span className="font-bold text-gray-900 text-[14px]">{myRank.matchCount}</span>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[11px] text-gray-500 uppercase tracking-wider">Tỷ lệ hủy</span>
                        <span className="font-bold text-gray-900 text-[14px]">0%</span>
                     </div>
                  </div>
               </div>
            ) : (
               <div className="text-center p-4 bg-gray-50 rounded-[8px] border border-gray-100">
                  <Star size={24} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-[12px] text-gray-500 m-0 leading-relaxed">
                     Tham gia kèo mở và nhận đánh giá từ đồng đội để bắt đầu tích lũy điểm xếp hạng.
                  </p>
               </div>
            )}
          </div>
        </div>

      </div>
    </MatchProLayout>
  )
}
