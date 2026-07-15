import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import MatchProLayout from '../../layouts/MatchProLayout'
import { matchApi } from '../../api/matchApi'
import PageLoader from '../../components/ui/PageLoader'
import EmptyState from '../../components/ui/EmptyState'
import { TrendingUp, MapPin, Users, Trophy, Swords, Clock, Calendar, Wallet, Radar } from 'lucide-react'
import bannerImage from '../../assets/pickleball_banner.png'

const sidebarLinks = [
  { label: 'Bảng tin kèo', icon: TrendingUp, active: true, path: '/matches' },
  { label: 'Sân gần bạn', icon: MapPin, path: '/matches/nearby' },
  { label: 'Cộng đồng', icon: Users, path: '/matches/community' },
  { label: 'Xếp hạng', icon: Trophy, path: '/matches/leaderboard' },
]

const sportFilters = ['Tất cả', 'Cầu lông', 'Pickleball']

const levelLabels = {
  Pro: 'Chuyên nghiệp',
  Advanced: 'Nâng cao',
  Intermediate: 'Trung bình',
  Beginner: 'Người mới',
}

const nearbyPlayers = [] // Keeps it empty to trigger empty state

// Dummy data for top 3 leaderboard
const leaderboard = [
  { rank: 1, name: 'Nguyễn Văn A', pts: '2400 MATCHPRO', avatar: 'https://i.pravatar.cc/150?u=a' },
  { rank: 2, name: 'Trần Thị B', pts: '2150 MATCHPRO', avatar: 'https://i.pravatar.cc/150?u=b' },
  { rank: 3, name: 'Lê Hoàng C', pts: '1900 MATCHPRO', avatar: 'https://i.pravatar.cc/150?u=c' },
]

// Common modern card style
const modernCardClass = "bg-white rounded-[12px] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] border border-gray-100"

export default function MatchProFeedPage() {
  const [activeFilter, setActiveFilter] = useState('Tất cả')
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    matchApi.getOpenMatches()
      .then(res => {
        if (res.data) setMatches(Array.isArray(res.data) ? res.data : [])
      })
      .catch(err => setError(typeof err === 'string' ? err : 'Không tải được danh sách kèo'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <MatchProLayout>
      <div className="grid grid-cols-[240px_1fr_320px] max-lg:grid-cols-[220px_1fr] max-md:grid-cols-1 gap-6 items-start w-full max-w-[1440px] mx-auto px-4 md:px-8 pb-16 pt-8 font-sans">

        {/* ── CỘT TRÁI (Sidebar Điều hướng) ── */}
        <aside className="flex flex-col gap-6 max-md:hidden shrink-0 sticky top-[100px]">
          {/* Nút CTA nổi bật lên đầu với Hover/Active states */}
          <Link 
            to="/matches/create" 
            className="flex items-center justify-center w-full bg-[#14b8a6] hover:bg-[#15c3b0] text-white py-4 px-4 rounded-[12px] text-[14px] font-bold uppercase tracking-wider transition-all duration-300 shadow-[0_4px_14px_rgba(20,184,166,0.3)] hover:shadow-[0_6px_20px_rgba(20,184,166,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_2px_8px_rgba(20,184,166,0.3)] no-underline"
          >
            + Tạo trận đấu mới
          </Link>

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

        {/* ── CỘT GIỮA (Nội dung cốt lõi) ── */}
        <div className="flex flex-col min-w-0 gap-6">

          {/* Hero banner (Bo góc 12px mềm mại) */}
          <div className="relative h-[240px] rounded-[12px] overflow-hidden flex flex-col justify-end p-8 shadow-sm">
            <img src={bannerImage} alt="Giải đấu Pickleball" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-transparent" />
            <div className="relative flex flex-col gap-3">
              <span className="w-fit px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-wider border border-white/20">
                ● Đang hot
              </span>
              <h2 className="font-heading text-3xl md:text-4xl uppercase text-white leading-tight m-0">
                Giải đấu Pickleball<br />Mùa hè Đà Nẵng
              </h2>
              <div className="flex gap-6 text-[13px] text-gray-200 font-medium">
                <span className="flex items-center gap-1.5"><MapPin size={16} /> FPT City Complex</span>
                <span className="flex items-center gap-1.5"><Clock size={16} /> Bắt đầu trong 2 giờ</span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3 flex-wrap">
            {sportFilters.map(f => (
              <button
                key={f}
                className={`px-5 py-2 rounded-full text-[13px] font-bold transition-all cursor-pointer outline-none ${
                  activeFilter === f
                    ? 'bg-gray-900 text-white shadow-md border-transparent'
                    : 'bg-white text-gray-500 border border-gray-300 hover:border-gray-400 hover:text-gray-900'
                }`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Match cards */}
          <div className="flex flex-col gap-4">
            {loading ? (
              <div className="col-span-full py-10"><PageLoader message="Đang tải kèo..." /></div>
            ) : error ? (
              <div className={`col-span-full text-center p-8 ${modernCardClass}`}>
                <p className="text-red-500 font-medium">{error}</p>
              </div>
            ) : matches.length === 0 ? (
              <div className={`col-span-full p-10 ${modernCardClass}`}>
                <EmptyState
                  icon={<Swords size={32} className="text-gray-300" />}
                  title="Chưa có kèo nào đang mở"
                  subtitle="Hãy là người đầu tiên tạo kèo hôm nay!"
                />
              </div>
            ) : matches.map(m => {
               // Default mock data for UI visual if real data is sparse
               const sport = m.sportType || 'Badminton' 
               const title = m.title || `Kèo ${sport} giao lưu`
               const hostName = m.hostName || 'Thảo Nguyên'
               const isFriend = hostName === 'Thảo Nguyên'
               const courtName = m.courtName || 'Sân Pro-Sport'
               const fee = m.escrowAmount || 50000
               const max = m.maxParticipants || 4
               const current = m.currentParticipants || 1

               // Logic: Past Matches check
               let matchDateTime = new Date(m.matchDate)
               if (m.startTime) {
                 const [hours, minutes] = m.startTime.split(':')
                 matchDateTime.setHours(parseInt(hours, 10) || 0, parseInt(minutes, 10) || 0, 0, 0)
               }
               const isExpired = matchDateTime < new Date()

               return (
                <div key={m.matchId} className={`p-4 flex flex-col gap-2.5 transition-all duration-300 ${isExpired ? 'opacity-60 grayscale-[40%]' : 'hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 cursor-pointer'} ${modernCardClass}`}>
                  
                  {/* Dòng 1 (Tags) */}
                  <div className="flex items-center gap-2">
                    <span className="bg-[#14b8a6]/10 text-[#14b8a6] px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
                      {sport}
                    </span>
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
                      Trình độ: {levelLabels[m.skillLevel] || m.skillLevel || 'Mọi trình độ'}
                    </span>
                  </div>

                  {/* Dòng 2 (Tiêu đề chính & Host) */}
                  <div className="flex flex-col gap-1.5">
                    <Link to={`/matches/${m.matchId}`} className={`no-underline ${isExpired ? 'pointer-events-none' : ''}`}>
                      <h3 className={`font-bold text-lg m-0 transition-colors line-clamp-1 ${isExpired ? 'text-gray-500' : 'text-gray-900 hover:text-[#14b8a6]'}`}>
                        {title}
                      </h3>
                    </Link>
                    
                    {/* Dòng 2.5: Host Info & Friend Badge */}
                    <div className="flex items-center gap-2">
                      <img src={`https://i.pravatar.cc/100?u=${hostName}`} alt={hostName} className="w-5 h-5 rounded-full object-cover" />
                      <span className="text-[13px] text-gray-500 font-medium">Host: <strong className={isExpired ? 'text-gray-500' : 'text-gray-900'}>{hostName}</strong></span>
                      {isFriend && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full ml-1">
                          <Users size={12} /> Bạn bè
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Dòng 3 (Thông tin chi tiết) */}
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-[13px] text-gray-500 mt-0.5">
                    <span className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400 shrink-0" />
                      <span className="truncate">{new Date(m.matchDate).toLocaleDateString('vi-VN')} lúc {m.startTime?.substring(0, 5) || '19:00'}</span>
                    </span>
                    <span className="flex items-center gap-2 truncate">
                      <MapPin size={16} className="text-gray-400 shrink-0" />
                      <span className="truncate">{courtName}</span>
                    </span>
                    <span className="flex items-center gap-2 col-span-2">
                      <Wallet size={16} className="text-[#14b8a6] shrink-0" />
                      Phí tham gia: <strong className="text-gray-900 ml-1">{fee.toLocaleString('vi-VN')}đ</strong>
                    </span>
                  </div>

                  {/* Dòng 4 (Tương tác) */}
                  <div className="flex items-center justify-between mt-1 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      {/* Avatar group stack */}
                      <div className="flex -space-x-2">
                        {[...Array(Math.min(current, 3))].map((_, i) => (
                          <img key={i} className="w-8 h-8 rounded-full border-2 border-white object-cover bg-gray-100" src={`https://i.pravatar.cc/100?img=${m.matchId || 10}${i}`} alt="Avatar" />
                        ))}
                      </div>
                      <span className="text-[13px] font-medium text-gray-600">
                        <strong className={isExpired ? 'text-gray-500' : 'text-gray-900'}>{current}/{max}</strong> slot
                      </span>
                    </div>
                    {isExpired ? (
                      <button disabled className="bg-gray-200 text-gray-500 px-5 py-2 rounded-[8px] text-[13px] font-bold uppercase tracking-wide cursor-not-allowed">
                        Đã kết thúc
                      </button>
                    ) : (
                      <Link to={`/matches/${m.matchId}`} className="bg-[#14b8a6] hover:bg-[#15c3b0] text-white px-5 py-2 rounded-[8px] text-[13px] font-bold uppercase tracking-wide transition-all no-underline shadow-sm hover:shadow-[0_4px_12px_rgba(20,184,166,0.3)] hover:-translate-y-px">
                        Tham gia
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── CỘT PHẢI (Tiện ích & Trạng thái trống) ── */}
        <div className="flex flex-col gap-6 max-lg:col-span-full max-lg:grid max-lg:grid-cols-2 max-md:grid-cols-1 shrink-0 sticky top-[100px]">

          {/* Khối: Người chơi gần đây */}
          <div className={`p-5 flex flex-col ${modernCardClass}`}>
            <h3 className="text-[14px] font-bold uppercase tracking-wider text-gray-900 mb-4 m-0">Người chơi gần đây</h3>
            {nearbyPlayers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center text-[#14b8a6] mb-1">
                  <Radar size={32} />
                </div>
                <div className="space-y-1">
                  <p className="text-[14px] font-bold text-gray-900 m-0">Khu vực đang vắng</p>
                  <p className="text-[13px] text-gray-500 px-2 m-0">Kéo thêm bạn bè vào chơi cùng để trận đấu thêm vui!</p>
                </div>
                <button className="mt-2 w-full py-2.5 rounded-[8px] border border-gray-200 bg-white text-[13px] font-bold text-gray-600 hover:border-[#14b8a6] hover:text-[#14b8a6] hover:bg-teal-50 transition-colors cursor-pointer outline-none">
                  Mời bạn bè tham gia ngay
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {/* Fallback structure */}
              </div>
            )}
          </div>

          {/* Khối: Bảng xếp hạng */}
          <div className={`p-5 flex flex-col ${modernCardClass}`}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-[14px] font-bold uppercase tracking-wider text-gray-900 m-0">Bảng xếp hạng</h3>
              <span className="text-[11px] font-bold tracking-wider text-[#14b8a6] bg-[#14b8a6]/10 px-2.5 py-1 rounded-full">TOP 3</span>
            </div>
            
            <div className="flex flex-col gap-4">
              {leaderboard.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3.5 relative group">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 z-10 shadow-sm
                    ${i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-gray-100 text-gray-600' : 'bg-orange-100 text-orange-700'}`}>
                    {p.rank}
                  </div>
                  <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-full object-cover shadow-sm border border-gray-100" />
                  <div className="flex flex-col flex-1 min-w-0">
                    <p className="text-[14px] font-bold text-gray-900 truncate group-hover:text-[#14b8a6] transition-colors cursor-pointer m-0">{p.name}</p>
                    <p className="text-[12px] font-semibold text-gray-500 mt-0.5 m-0">{p.pts}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Link to="/matches/leaderboard" className="mt-6 text-center text-[13px] font-bold text-[#14b8a6] hover:underline no-underline">
              Xem toàn bộ bảng xếp hạng →
            </Link>
          </div>

        </div>

      </div>
    </MatchProLayout>
  )
}
