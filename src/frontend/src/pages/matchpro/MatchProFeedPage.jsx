import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import MatchProLayout from '../../layouts/MatchProLayout'
import { matchApi } from '../../api/matchApi'
import { TrendingUp, MapPin, Users, Trophy, Swords, Clock, Calendar, Wallet } from 'lucide-react'
import bannerImage from '../../assets/pickleball_banner.png'

const sidebarLinks = [
  { label: 'Trending Matches', icon: TrendingUp, active: true, path: '/matches' },
  { label: 'Nearby Sports', icon: MapPin, path: '/matches/nearby' },
  { label: 'Community Hub', icon: Users, path: '/matches/community' },
  { label: 'Leaderboards', icon: Trophy, path: '/matches/leaderboard' },
]

const sportFilters = ['Tất cả', 'Cầu lông', 'Pickleball']

const nearbyPlayers = [
  { name: 'David K.', dist: '1.2 km away', avatar: 'https://ui-avatars.com/api/?name=David+K&background=5E6AD2&color=fff', online: true },
  { name: 'Sarah M.', dist: '2.5 km away', avatar: 'https://ui-avatars.com/api/?name=Sarah+M&background=2c2f48&color=5E6AD2', online: false },
  { name: 'Michael T.', dist: '3.1 km away', avatar: 'https://ui-avatars.com/api/?name=Michael+T&background=1a1b26&color=fff', online: true },
]

const leaderboard = [
  { rank: 1, name: 'Alex H.', pts: '2,450', avatar: 'https://ui-avatars.com/api/?name=Alex+H' },
  { rank: 2, name: 'Jordan L.', pts: '2,120', avatar: 'https://ui-avatars.com/api/?name=Jordan+L' },
  { rank: 3, name: 'Taylor S.', pts: '1,980', avatar: 'https://ui-avatars.com/api/?name=Taylor+S' },
]

export default function MatchProFeedPage() {
  const [activeFilter, setActiveFilter] = useState('Tất cả')
  const [matches, setMatches] = useState([])

  useEffect(() => {
    matchApi.getOpenMatches()
      .then(res => {
        if(res.data) setMatches(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <MatchProLayout>
      <div className="grid grid-cols-[220px_1fr_300px] max-lg:grid-cols-[200px_1fr] max-md:grid-cols-1 gap-6 items-start w-full max-w-[1400px] mx-auto pb-12 pt-8">
        
        {/* Left sidebar */}
        <aside className="fade-up card-base flex flex-col gap-6 max-md:hidden shrink-0 sticky top-[100px]">
          <div className="border-b border-border-default pb-5">
            <p className="text-base font-bold text-[var(--theme-primary)]">Pro Matcher</p>
            <p className="text-xs font-bold text-[#5E6AD2] bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 w-fit px-2.5 py-1 rounded-md mt-2">Elite Rank</p>
          </div>
          <div className="flex flex-col gap-2">
            {sidebarLinks.map(link => (
              <Link key={link.label} to={link.path} className={`flex items-center gap-3 py-3 px-4 rounded-xl text-[0.95rem] font-semibold text-foreground-muted no-underline transition-all hover:bg-[var(--theme-surface)] hover:text-[var(--theme-primary)] ${link.active ? 'bg-[#5E6AD2]/10 text-[#5E6AD2] hover:bg-[#5E6AD2]/20 hover:text-[#5E6AD2]' : ''}`}>
                <link.icon size={20} />
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
          <Link to="/matches/create" className="btn-primary mt-auto py-3.5 h-auto text-sm no-underline">+ Tạo trận đấu mới</Link>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Hero banner */}
          <div className="fade-up relative rounded-[2rem] overflow-hidden h-[260px] mb-8 cursor-pointer group shadow-2xl border border-border-default">
            <img src={bannerImage} alt="Match" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020203]/90 via-[#020203]/40 to-transparent flex flex-col justify-end px-8 py-8 gap-2">
              <span className="text-xs font-bold text-red-400 tracking-wider flex items-center gap-2 bg-red-500/10 backdrop-blur-md w-fit px-3 py-1.5 rounded-lg border border-red-500/20">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                TRENDING NOW
              </span>
              <h2 className="font-['Oswald'] text-3xl md:text-4xl font-bold text-[var(--theme-primary)] leading-tight mt-2">Giải Đấu Pickleball Mùa Hè Đà Nẵng</h2>
              <div className="flex gap-5 text-sm text-foreground-muted font-medium mt-1">
                <span className="flex items-center gap-1.5"><MapPin size={16} className="text-[#5E6AD2]" /> FPT City Complex</span>
                <span className="flex items-center gap-1.5"><Clock size={16} className="text-[#5E6AD2]" /> Bắt đầu trong 2 giờ</span>
              </div>
            </div>
          </div>

          {/* Sport filters */}
          <div className="fade-up flex gap-3 flex-wrap mb-6" style={{animationDelay: '0.1s'}}>
            {sportFilters.map(f => (
              <button
                key={f}
                className={`px-6 py-2.5 rounded-xl border-2 text-[0.95rem] font-bold transition-all cursor-pointer ${activeFilter === f ? 'bg-[#5E6AD2] border-[#5E6AD2] text-[var(--theme-primary)] shadow-[0_4px_12px_rgba(94,106,210,0.3)]' : 'bg-[var(--theme-surface)] border-border-default text-foreground-muted hover:border-[#5E6AD2]/50 hover:text-[var(--theme-primary)]'}`}
                onClick={() => setActiveFilter(f)}
              >{f}</button>
            ))}
          </div>

          {/* Match cards */}
          <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-5">
            {matches.length === 0 ? (
              <div className="fade-up col-span-full text-center py-16 card-base flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(94,106,210,0.2)]">
                  <Swords size={32} className="text-[#5E6AD2]" />
                </div>
                <p className="text-lg font-bold text-[var(--theme-primary)]">Chưa có kèo nào đang mở</p>
                <p className="text-sm text-foreground-muted mt-2">Hãy là người đầu tiên tạo kèo hôm nay!</p>
              </div>
            ) : matches.map((m, i) => (
              <Link to={`/matches/${m.matchId}`} key={m.matchId} className="fade-up card-base !p-5 flex flex-col gap-4 no-underline text-inherit transition-all relative overflow-hidden group hover:-translate-y-1" style={{animationDelay: `${0.1 + i * 0.1}s`}}>
                {/* Accent Line */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#5E6AD2] group-hover:w-1.5 transition-all"></div>
                
                <div className="flex items-start gap-4 pl-1">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--theme-surface)] border border-border-default flex items-center justify-center font-bold text-[#5E6AD2] text-lg">
                    {m.hostId.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[1.05rem] text-[var(--theme-primary)] truncate group-hover:text-[#5E6AD2] transition-colors">{m.title}</p>
                    <p className="text-[0.8rem] text-foreground-muted mt-1 flex items-center gap-2">
                       <span className="bg-[var(--theme-surface)] border border-border-default px-2 py-0.5 rounded text-foreground-muted font-semibold">{m.skillLevel}</span>
                    </p>
                  </div>
                </div>
                
                <div className="pl-1 flex flex-col gap-2 mt-2">
                  <div className="flex items-center gap-2 text-sm text-foreground-muted font-medium">
                    <Calendar size={14} className="text-[#5E6AD2]" /> {new Date(m.matchDate).toLocaleDateString()} lúc {m.startTime}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground-muted font-medium">
                    <Wallet size={14} className="text-[#5E6AD2]" /> Phí: <span className="text-[#5E6AD2] font-bold">{m.escrowAmount.toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>

                <div className="mt-auto pt-4 flex items-center justify-between pl-1 border-t border-border-default">
                  <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
                    CÒN {m.maxParticipants - m.currentParticipants} SLOT
                  </span>
                  <div className="text-[#5E6AD2] bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-[#5E6AD2] group-hover:text-[var(--theme-primary)] transition-all shadow-[0_0_10px_rgba(94,106,210,0)] group-hover:shadow-[0_0_10px_rgba(94,106,210,0.4)]">
                    →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="w-[300px] flex flex-col gap-6 max-lg:col-span-full max-lg:w-full max-lg:grid max-lg:grid-cols-2 max-md:grid-cols-1 shrink-0 sticky top-[100px]">
          
          <div className="fade-up card-base">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-[var(--theme-primary)]">Người chơi gần đây</h3>
              <button className="text-foreground-muted hover:text-[#5E6AD2] transition-colors"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg></button>
            </div>
            <div className="flex flex-col gap-3">
              {nearbyPlayers.map(p => (
                <div key={p.name} className="flex items-center gap-3 py-2 border-b border-border-default last:border-0 group cursor-pointer">
                  <div className="relative shrink-0">
                    <img src={p.avatar} alt={p.name} className="w-11 h-11 rounded-full object-cover shadow-sm group-hover:ring-2 ring-[#5E6AD2] transition-all" />
                    {p.online && <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-[#0a0a0c] shadow-sm" />}
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm font-bold text-[var(--theme-primary)] group-hover:text-[#5E6AD2] transition-colors">{p.name}</p>
                    <p className="text-[0.7rem] font-medium text-foreground-muted">{p.dist}</p>
                  </div>
                  <button className="ml-auto w-8 h-8 rounded-full bg-[var(--theme-surface)] flex items-center justify-center text-foreground-muted hover:bg-[#5E6AD2] hover:text-[var(--theme-primary)] transition-all border border-border-default hover:border-[#5E6AD2]" aria-label="Add friend">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="fade-up card-base" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-[var(--theme-primary)]">Bảng xếp hạng</h3>
              <Trophy size={20} className="text-[#5E6AD2]" />
            </div>
            <div className="flex flex-col gap-3">
              {leaderboard.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3 py-2 border-b border-border-default last:border-0">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-[var(--theme-primary)] shrink-0 ${i === 0 ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.4)]' : i === 1 ? 'bg-gray-400 shadow-[0_0_10px_rgba(156,163,175,0.4)]' : i === 2 ? 'bg-amber-700 shadow-[0_0_10px_rgba(180,83,9,0.4)]' : 'bg-[var(--theme-surface-hover)]'}`}>
                    {p.rank}
                  </div>
                  <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex flex-col flex-1 min-w-0">
                    <p className="text-[0.85rem] font-bold text-[var(--theme-primary)] truncate">{p.name}</p>
                  </div>
                  <p className="text-[0.85rem] text-[#5E6AD2] font-bold">{p.pts}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Custom Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeUpAnim {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up {
          animation: fadeUpAnim 0.5s ease-out forwards;
          opacity: 0;
        }
      `}} />
    </MatchProLayout>
  )
}
