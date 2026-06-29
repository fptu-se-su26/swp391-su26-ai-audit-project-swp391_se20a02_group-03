import { Link } from 'react-router-dom'
import MobileLayout from '../../layouts/MobileLayout'
import { useAuth } from '../../context/AuthContext'

export default function MobileDashboardPage() {
  const { user } = useAuth()
  const displayName = user?.fullName?.split(' ')[0] || user?.email?.split('@')[0] || 'bạn'

  return (
    <MobileLayout>
      <div className="font-sans -mx-4 -my-5 pb-24 bg-[#0d161d] text-[var(--theme-primary)] min-h-screen">
        <div className="p-5 pt-8">
          <h1 className="text-lg font-bold text-[var(--theme-primary)]">
            Sẵn sàng cho trận tiếp theo, <span className="text-[#00c2ff]">{displayName}?</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Lịch đặt sân và thống kê của bạn.</p>
        </div>

        <div className="px-5 mb-6">
          <h3 className="text-[0.65rem] font-bold tracking-wider text-slate-500 mb-3 block">LỊCH ĐẶT SÂN</h3>
          <div className="bg-[#13222d] border border-border-default rounded-2xl p-6 flex flex-col items-center text-center gap-3">
            <p className="text-sm text-slate-400">Chưa có lịch đặt sân sắp tới.</p>
            <Link
              to="/apex/booking"
              className="bg-[#00c2ff] text-slate-900 rounded-lg py-2.5 px-5 text-xs font-bold no-underline hover:bg-[#00ace6]"
            >
              Đặt sân ngay
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 px-5 mb-6">
          <Link
            to="/mobile/scanner"
            className="bg-[#13222d] border border-border-default rounded-2xl p-4 flex flex-col items-center justify-center gap-2 no-underline transition-all hover:bg-[#1a2d3b]"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#00c2ff]/10 text-[#00c2ff]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h4v4H4z"/><path d="M16 4h4v4h-4z"/><path d="M4 16h4v4H4z"/><path d="M16 16h4v4h-4z"/><path d="M10 10h4v4h-4z"/></svg>
            </div>
            <span className="text-[0.78rem] font-semibold text-slate-300">Quét QR vào sân</span>
          </Link>
          <Link
            to="/apex/booking"
            className="bg-[#13222d] border border-border-default rounded-2xl p-4 flex flex-col items-center justify-center gap-2 no-underline transition-all hover:bg-[#1a2d3b]"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-yellow-500/10 text-yellow-400">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            </div>
            <span className="text-[0.78rem] font-semibold text-slate-300">Đặt sân</span>
          </Link>
        </div>

        <div className="px-5 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-[0.65rem] font-bold tracking-wider text-slate-500 block">GỢI Ý KÈO</h3>
            <Link to="/mobile/matches" className="text-xs font-semibold text-[#00c2ff] no-underline">Xem tất cả</Link>
          </div>
          <p className="text-sm text-slate-500 bg-[#13222d] border border-dashed border-slate-700 rounded-2xl p-5 text-center">
            Xem các kèo đang mở tại tab <strong className="text-[#00c2ff]">Kèo</strong>.
          </p>
        </div>
      </div>
    </MobileLayout>
  )
}
