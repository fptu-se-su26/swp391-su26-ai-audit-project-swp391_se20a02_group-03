import { Link } from 'react-router-dom'
import MobileLayout from '../../layouts/MobileLayout'
import EmptyState from '../../components/ui/EmptyState'
import { MessageSquare, Calendar, MapPin, ShoppingBag } from 'lucide-react'

const quickActions = [
  { label: 'Đặt sân', path: '/mobile/booking', icon: Calendar, color: 'bg-[#5E6AD2]/10 text-[#5E6AD2]' },
  { label: 'Kèo đấu', path: '/mobile/matches', icon: MapPin, color: 'bg-emerald-500/10 text-emerald-600' },
  { label: 'Cửa hàng', path: '/gear/catalog', icon: ShoppingBag, color: 'bg-orange-500/10 text-orange-600' },
  { label: 'Nhắn tin', path: '/mobile/chat', icon: MessageSquare, color: 'bg-violet-500/10 text-violet-600' },
]

export default function MobileHomePage() {
  return (
    <MobileLayout>
      <div className="font-sans pb-12 flex flex-col gap-8">
        <div className="px-4 pt-4">
          <div className="relative rounded-3xl overflow-hidden h-[180px] border border-slate-200/50 bg-gradient-to-br from-[#5E6AD2] to-indigo-800">
            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
              <span className="text-xs font-semibold text-white/80 mb-1">PRO-SPORT Mobile</span>
              <h2 className="text-2xl font-bold tracking-tight mb-1">Chào mừng trở lại</h2>
              <p className="text-sm text-white/90">Đặt sân, tham gia kèo và mua thiết bị — mọi thứ trong một ứng dụng.</p>
            </div>
          </div>
        </div>

        <div className="px-4">
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map(({ label, path, icon: Icon, color }) => (
              <Link
                key={path}
                to={path}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col gap-3 no-underline hover:border-[#5E6AD2]/30 transition-colors"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                  <Icon size={20} />
                </div>
                <span className="text-sm font-bold text-slate-900">{label}</span>
              </Link>
            ))}
          </div>
        </div>

        <section className="px-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-slate-900">Hội nhóm</h3>
            <Link to="/matches/community" className="text-sm font-semibold text-[#5E6AD2] no-underline">Khám phá</Link>
          </div>
          <EmptyState
            title="Chưa tham gia hội nhóm nào"
            subtitle="Vào Cộng đồng MatchPro để kết nối với người chơi cùng sở thích."
            action={<Link to="/matches/community" className="text-sm font-semibold text-[#5E6AD2] no-underline">Xem cộng đồng →</Link>}
            className="bg-white rounded-2xl border border-slate-200 py-8"
          />
        </section>

        <section className="px-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-slate-900">Người chơi gần bạn</h3>
            <Link to="/matches/nearby" className="text-sm font-semibold text-[#5E6AD2] no-underline">Bản đồ sân</Link>
          </div>
          <EmptyState
            title="Bật vị trí để tìm người chơi"
            subtitle="Tính năng ghép người chơi theo vị trí sẽ sớm ra mắt."
            action={<Link to="/matches" className="text-sm font-semibold text-[#5E6AD2] no-underline">Xem kèo mở →</Link>}
            className="bg-white rounded-2xl border border-slate-200 py-8"
          />
        </section>
      </div>
    </MobileLayout>
  )
}
