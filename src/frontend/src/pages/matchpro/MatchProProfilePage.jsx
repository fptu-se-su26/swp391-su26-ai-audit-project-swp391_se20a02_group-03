import { Link } from 'react-router-dom'
import { Trophy, Flame, Swords, MapPin, BarChart2, Target, RefreshCw, Star, UserPlus, MessageSquare } from 'lucide-react'
import MatchProLayout from '../../layouts/MatchProLayout'

const metrics = [
  { label: 'TỶ LỆ THẮNG', value: '68%' },
  { label: 'TRẬN ĐẤU', value: '142' },
  { label: 'ĐÁNH GIÁ', value: '4.9★' },
  { label: 'MVP', value: '24' },
]

const specialties = ['Cầu lông', 'Pickleball']

const achievements = [
  { icon: <Trophy size={18} className="text-warning" />, title: 'Vô địch giải', sub: "Summer Open '23" },
  { icon: <Flame size={18} className="text-danger" />, title: 'Chuỗi 10 trận', sub: "Đạt tháng 11 '23" },
]

const activity = [
  {
    id: 1,
    icon: <Swords size={18} />,
    title: 'Thắng trận cầu lông đơn',
    sub: 'vs. Jordan Lee • 6-4, 7-5',
    time: '2 ngày trước',
    review: {
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80',
      text: '"Trận đấu tuyệt vời! Alex có cú giao bóng cực mạnh. Rất mong được đối đầu lại."',
      stars: 5,
    },
  },
  {
    id: 2,
    icon: <Swords size={18} />,
    title: 'Chơi Pickleball đôi',
    sub: 'tại Downtown Rec Center',
    time: '5 ngày trước',
    tags: ['MVP đội', '12 điểm'],
  },
]

export default function MatchProProfilePage() {
  return (
    <MatchProLayout>
      <div className="font-sans max-w-[900px] mx-auto px-4 md:px-0 py-8">
        {/* Hero */}
        <div className="bg-ink text-paper p-6 md:p-9 flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-6 border-2 border-ink">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" alt="Alex" className="w-20 h-20 rounded-full object-cover border-2 border-paper/40 shrink-0" />
          <div>
            <h1 className="font-heading text-2xl md:text-3xl uppercase tracking-tight">Alex Rivers</h1>
            <p className="text-sm text-paper/70 mt-1.5 flex items-center gap-1.5"><MapPin size={14} /> Seattle, WA • Hạng cao cấp</p>
          </div>
          <div className="flex gap-2.5 sm:ml-auto w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 border-2 border-paper/40 text-paper px-4 h-10 label-mono normal-case font-bold tracking-normal hover:bg-paper/10 transition-colors">
              <UserPlus size={14} />
              Kết bạn
            </button>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-accent text-ink px-4 h-10 label-mono normal-case font-bold tracking-normal hover:bg-accent-bright transition-colors">
              <MessageSquare size={14} />
              Nhắn tin
            </button>
          </div>
        </div>

        {/* Performance & Specialties */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="card-base">
            <h3 className="font-heading text-base uppercase text-foreground mb-4 flex items-center gap-2"><BarChart2 size={18} className="text-accent" /> Chỉ số thi đấu</h3>
            <div className="grid grid-cols-2 gap-5">
              {metrics.map(m => (
                <div key={m.label}>
                  <p className="label-mono text-foreground-subtle">{m.label}</p>
                  <p className="font-heading text-2xl text-foreground mt-1">{m.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card-base">
            <h3 className="font-heading text-base uppercase text-foreground mb-4 flex items-center gap-2"><Target size={18} className="text-accent" /> Chuyên môn</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {specialties.map(s => (
                <span key={s} className="label-mono border-2 border-border-strong text-foreground px-3 py-1.5 normal-case font-bold tracking-normal">{s}</span>
              ))}
            </div>
            <p className="label-mono text-foreground-subtle mt-4 mb-2.5">Thành tích</p>
            {achievements.map(a => (
              <div key={a.title} className="flex items-center gap-2.5 py-2 border-b border-border-default last:border-b-0">
                <span>{a.icon}</span>
                <div>
                  <p className="text-sm font-extrabold text-foreground">{a.title}</p>
                  <p className="text-xs text-foreground-muted">{a.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card-base mt-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-base uppercase text-foreground flex items-center gap-2"><RefreshCw size={18} className="text-accent" /> Hoạt động gần đây</h3>
            <a href="#" className="text-sm text-accent font-bold hover:underline">Xem tất cả</a>
          </div>
          {activity.map(a => (
            <div key={a.id} className="flex items-start gap-3.5 py-4 border-b border-border-default last:border-b-0">
              <div className="w-10 h-10 flex items-center justify-center shrink-0 bg-ink text-paper">{a.icon}</div>
              <div className="flex-1">
                <p className="text-sm font-extrabold text-foreground">{a.title}</p>
                <p className="text-xs text-foreground-muted mt-0.5">{a.sub}</p>
                {a.tags && (
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {a.tags.map(t => <span key={t} className="label-mono border border-border-strong text-foreground-muted px-2 py-1 normal-case font-normal tracking-normal">{t}</span>)}
                  </div>
                )}
                {a.review && (
                  <div className="flex gap-2.5 mt-2.5 border-2 border-border-default p-3 items-start">
                    <img src={a.review.avatar} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
                    <div>
                      <div className="flex gap-[1px] mb-1">{[...Array(a.review.stars)].map((_, i) => <Star key={i} size={12} fill="currentColor" className="text-warning" />)}</div>
                      <p className="text-xs text-foreground-muted italic">{a.review.text}</p>
                    </div>
                  </div>
                )}
              </div>
              <span className="text-xs text-foreground-subtle ml-auto shrink-0">{a.time}</span>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Link to="/matchpro/match/create" className="btn-primary w-full sm:w-auto">+ Tạo trận đấu</Link>
        </div>
      </div>
    </MatchProLayout>
  )
}
