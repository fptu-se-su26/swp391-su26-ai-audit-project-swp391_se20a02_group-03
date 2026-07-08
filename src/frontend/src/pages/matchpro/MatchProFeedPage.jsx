import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import MatchProLayout from '../../layouts/MatchProLayout'
import { matchApi } from '../../api/matchApi'
import PageLoader from '../../components/ui/PageLoader'
import EmptyState from '../../components/ui/EmptyState'
import { TrendingUp, MapPin, Users, Trophy, Swords, Clock, Calendar, Wallet } from 'lucide-react'
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

const nearbyPlayers = []

const leaderboard = []

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
      <div className="grid grid-cols-[220px_1fr_300px] max-lg:grid-cols-[200px_1fr] max-md:grid-cols-1 gap-8 items-start w-full max-w-[1440px] mx-auto px-4 md:px-10 pb-16 pt-8">

        {/* Left sidebar */}
        <aside className="flex flex-col gap-6 max-md:hidden shrink-0 sticky top-[100px]">
          <div className="card-base !p-5 bg-surface">
            <p className="font-heading text-lg uppercase text-foreground">MatchPro</p>
            <span className="label-mono inline-block mt-2 px-2.5 py-1 bg-ink text-paper rounded-[2px]">Hạng cao cấp</span>
          </div>
          <nav className="flex flex-col gap-1">
            {sidebarLinks.map(link => (
              <Link
                key={link.label}
                to={link.path}
                className={`flex items-center gap-3 py-3.5 px-4 rounded-[2px] text-[13px] font-bold uppercase tracking-[0.03em] no-underline transition-colors ${
                  link.active ? 'bg-ink text-paper' : 'text-foreground-muted hover:text-foreground'
                }`}
              >
                <link.icon size={16} />
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
          <Link to="/matches/create" className="btn-primary text-center py-4 h-auto text-[13px]">+ Tạo trận đấu mới</Link>
        </aside>

        {/* Main content */}
        <div className="flex flex-col min-w-0">

          {/* Hero banner */}
          <div className="relative border-2 border-border-strong h-[260px] mb-8 overflow-hidden flex flex-col justify-end p-8">
            <img src={bannerImage} alt="Giải đấu Pickleball" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent" />
            <div className="relative flex flex-col gap-3">
              <span className="label-mono w-fit px-3.5 py-1.5 bg-paper text-ink">● Đang hot</span>
              <h2 className="font-heading text-3xl md:text-4xl uppercase text-paper leading-none">Giải đấu Pickleball<br />Mùa hè Đà Nẵng</h2>
              <div className="flex gap-6 text-[13px] text-paper/70 font-semibold">
                <span className="flex items-center gap-1.5"><MapPin size={14} /> FPT City Complex</span>
                <span className="flex items-center gap-1.5"><Clock size={14} /> Bắt đầu trong 2 giờ</span>
              </div>
            </div>
          </div>

          {/* Sport filters */}
          <div className="flex gap-3 flex-wrap mb-6">
            {sportFilters.map(f => (
              <button
                key={f}
                className={`px-6 py-2.5 rounded-[2px] border-2 text-xs font-extrabold uppercase tracking-[0.04em] transition-colors cursor-pointer ${
                  activeFilter === f
                    ? 'bg-ink border-ink text-paper'
                    : 'bg-transparent border-border-hover text-foreground-muted hover:border-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveFilter(f)}
              >{f}</button>
            ))}
          </div>

          {/* Match cards */}
          <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4">
            {loading ? (
              <div className="col-span-full"><PageLoader message="Đang tải kèo..." /></div>
            ) : error ? (
              <div className="col-span-full card-base text-center">
                <p className="text-danger font-medium">{error}</p>
              </div>
            ) : matches.length === 0 ? (
              <div className="col-span-full">
                <EmptyState
                  icon={<Swords size={28} />}
                  title="Chưa có kèo nào đang mở"
                  subtitle="Hãy là người đầu tiên tạo kèo hôm nay!"
                />
              </div>
            ) : matches.map(m => (
              <Link to={`/matches/${m.matchId}`} key={m.matchId} className="card-base !p-6 flex flex-col gap-4 no-underline text-inherit transition-colors hover:border-accent">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-[2px] bg-ink text-paper flex items-center justify-center font-heading text-base shrink-0">
                    {String(m.hostId ?? '').slice(0, 2).toUpperCase() || '#'}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-[15px] text-foreground truncate">{m.title}</p>
                    <span className="label-mono inline-block mt-1 px-2 py-0.5 bg-background-base border border-border-strong text-foreground">
                      {levelLabels[m.skillLevel] || m.skillLevel}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 text-[13px] text-foreground-muted">
                  <span className="flex items-center gap-2"><Calendar size={14} /> {new Date(m.matchDate).toLocaleDateString()} lúc {m.startTime}</span>
                  <span className="flex items-center gap-2"><Wallet size={14} /> Phí: <strong className="text-foreground">{m.escrowAmount.toLocaleString('vi-VN')}đ</strong></span>
                </div>

                <div className="flex items-center justify-between border-t border-border-default pt-3.5">
                  <span className="label-mono px-2.5 py-1.5 bg-ink text-paper">Còn {m.maxParticipants - m.currentParticipants} chỗ</span>
                  <span className="font-heading text-base text-foreground">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-6 max-lg:col-span-full max-lg:grid max-lg:grid-cols-2 max-md:grid-cols-1 shrink-0 sticky top-[100px]">

          <div className="card-base">
            <h3 className="font-heading text-base uppercase text-foreground mb-4">Người chơi gần đây</h3>
            {nearbyPlayers.length === 0 ? (
              <p className="text-[13px] text-foreground-muted text-center py-5">
                Chưa có người chơi gần bạn.<br />
                <Link to="/matches/nearby" className="text-foreground font-bold underline">Khám phá sân →</Link>
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {nearbyPlayers.map(p => (
                  <div key={p.name} className="flex items-center gap-3 py-2 border-b border-border-default last:border-0">
                    <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{p.name}</p>
                      <p className="text-xs text-foreground-muted">{p.dist}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card-base">
            <h3 className="font-heading text-base uppercase text-foreground mb-4">Bảng xếp hạng</h3>
            {leaderboard.length === 0 ? (
              <p className="text-[13px] text-foreground-muted text-center py-5">
                <Link to="/matches/leaderboard" className="text-foreground font-bold underline">Xem bảng xếp hạng đầy đủ →</Link>
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {leaderboard.map((p, i) => (
                  <div key={p.name} className="flex items-center gap-3 py-2 border-b border-border-default last:border-0">
                    <div className="w-6 h-6 rounded-full bg-ink text-paper flex items-center justify-center text-xs font-bold shrink-0">{p.rank}</div>
                    <img src={p.avatar} alt={p.name} className="w-9 h-9 rounded-full object-cover" />
                    <div className="flex flex-col flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-foreground truncate">{p.name}</p>
                    </div>
                    <p className="text-[13px] text-accent font-bold">{p.pts}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </MatchProLayout>
  )
}
