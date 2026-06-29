import { Link } from 'react-router-dom'
import MobileLayout from '../../layouts/MobileLayout'

export default function MobileBookingPage() {
  return (
    <MobileLayout hideBottomNav={true} showBack={true} title="Đặt sân">
      <div className="font-sans -mx-4 -my-5 pb-24 flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#00c2ff]/10 flex items-center justify-center mb-5">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00c2ff" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-2">Đặt sân trên Apex</h2>
        <p className="text-sm text-slate-500 mb-6 max-w-xs">
          Luồng đặt sân đầy đủ (chọn sân, khung giờ, thanh toán) nằm trên phiên bản Apex.
        </p>
        <Link
          to="/apex/booking"
          className="w-full max-w-xs bg-[#00c2ff] hover:bg-[#00ace6] text-slate-900 py-3.5 rounded-xl text-sm font-bold no-underline shadow-md transition-all"
        >
          Mở trang đặt sân
        </Link>
      </div>
    </MobileLayout>
  )
}
