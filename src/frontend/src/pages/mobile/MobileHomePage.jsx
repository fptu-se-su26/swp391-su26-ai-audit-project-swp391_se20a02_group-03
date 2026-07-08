import { Link } from 'react-router-dom'
import MobileLayout from '../../layouts/MobileLayout'
import EmptyState from '../../components/ui/EmptyState'
import { MessageSquare, Calendar, MapPin, ShoppingBag } from 'lucide-react'

const quickActions = [
  { label: 'Đặt sân', path: '/mobile/booking', icon: Calendar },
  { label: 'Kèo đấu', path: '/mobile/matches', icon: MapPin },
  { label: 'Cửa hàng', path: '/gear/catalog', icon: ShoppingBag },
  { label: 'Nhắn tin', path: '/mobile/chat', icon: MessageSquare },
]

export default function MobileHomePage() {
  return (
    <MobileLayout>
      <div className="font-sans flex flex-col gap-6">
        {/* Hero */}
        <div className="relative h-[170px] overflow-hidden border-2 border-border-strong">
          <img
            src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1600&q=80"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent" />
          <div className="relative z-[1] h-full flex flex-col justify-end p-5">
            <p className="label-mono text-paper/60 mb-1.5">Pro-Sport Mobile</p>
            <h2 className="font-heading text-2xl uppercase text-paper mb-1.5">Chào mừng trở lại</h2>
            <p className="text-sm text-paper/80">Đặt sân, tham gia kèo và mua thiết bị — mọi thứ trong một ứng dụng.</p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-2.5">
          {quickActions.map(({ label, path, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className="bg-surface border-2 border-border-strong p-4 flex flex-col gap-3 no-underline hover:border-accent transition-colors"
            >
              <div className="w-9 h-9 bg-ink text-paper flex items-center justify-center">
                <Icon size={18} />
              </div>
              <span className="text-sm font-bold text-foreground">{label}</span>
            </Link>
          ))}
        </div>

        {/* Groups */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-heading text-[15px] uppercase text-foreground">Hội nhóm</h3>
            <Link to="/matches/community" className="label-mono text-foreground no-underline">Khám phá</Link>
          </div>
          <EmptyState
            title="Chưa tham gia hội nhóm nào"
            subtitle="Vào Cộng đồng MatchPro để kết nối với người chơi cùng sở thích."
            action={<Link to="/matches/community" className="text-sm font-bold text-accent no-underline">Xem cộng đồng →</Link>}
            className="bg-surface py-6"
          />
        </section>

        {/* Nearby players */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-heading text-[15px] uppercase text-foreground">Người chơi gần bạn</h3>
            <Link to="/matches/nearby" className="label-mono text-foreground no-underline">Bản đồ sân</Link>
          </div>
          <EmptyState
            title="Bật vị trí để tìm người chơi"
            subtitle="Tính năng ghép người chơi theo vị trí sẽ sớm ra mắt."
            action={<Link to="/matches" className="text-sm font-bold text-accent no-underline">Xem kèo mở →</Link>}
            className="bg-surface py-6"
          />
        </section>
      </div>
    </MobileLayout>
  )
}
