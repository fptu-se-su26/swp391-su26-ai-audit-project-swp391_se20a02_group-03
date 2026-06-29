import { Link } from 'react-router-dom'
import MobileLayout from '../../layouts/MobileLayout'
import { useAuth } from '../../context/AuthContext'
import { translateRole } from '../../utils/labels'

const MENU_ITEMS = [
  { label: 'Thông tin tài khoản', icon: 'user' },
  { label: 'Phương thức thanh toán', icon: 'card' },
  { label: 'Thông báo', icon: 'bell' },
]

export default function MobileProfilePage() {
  const { user } = useAuth()
  const displayName = user?.fullName || 'Người dùng'
  const email = user?.email || ''
  const avatarUrl = user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=006070&color=fff`

  return (
    <MobileLayout title="Hồ sơ">
      <div className="font-sans pb-12 flex flex-col gap-8">
        <div className="pt-6 px-4 text-center flex flex-col items-center">
          <div className="relative w-24 h-24 mb-4">
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-full h-full object-cover rounded-2xl shadow-sm border border-slate-200/50"
            />
            {user && (
              <div className="absolute -bottom-2 -right-2 bg-slate-900 text-[var(--theme-primary)] text-[10px] font-bold px-2 py-1 rounded-lg border-2 border-white flex items-center gap-1 shadow-sm">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                {translateRole(user.role)}
              </div>
            )}
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900">{displayName}</h2>
          <p className="text-sm text-slate-500 mt-1.5">{email || 'Đà Nẵng, Việt Nam'}</p>

          {!user ? (
            <Link
              to="/login"
              className="mt-5 w-full bg-slate-900 text-white text-sm font-semibold py-3 rounded-xl no-underline text-center"
            >
              Đăng nhập để xem hồ sơ
            </Link>
          ) : (
            <div className="flex gap-3 mt-5 w-full">
              <button type="button" className="flex-1 bg-slate-900 text-[var(--theme-primary)] text-sm font-semibold py-3 rounded-xl transition-all active:scale-[0.98]">
                Chỉnh sửa hồ sơ
              </button>
              <button type="button" className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 text-slate-700 rounded-xl transition-all active:bg-slate-50" aria-label="Cài đặt">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              </button>
            </div>
          )}
        </div>

        <div className="px-4">
          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-6 text-center">
            <p className="text-sm font-semibold text-slate-700 mb-1">Thống kê cá nhân</p>
            <p className="text-xs text-slate-500 mb-4">
              Số kèo, tỷ lệ thắng và điểm xếp hạng sẽ hiển thị khi bạn tham gia trận đấu trên hệ thống.
            </p>
            <Link to="/mobile/matches" className="text-xs font-semibold text-[#008ba3] no-underline">
              Xem kèo đang mở →
            </Link>
          </div>
        </div>

        <div className="px-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold tracking-tight text-slate-900">Trận gần đây</h3>
          </div>
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-6 text-center">
            <p className="text-sm text-slate-500">Chưa có lịch sử trận đấu.</p>
            <Link to="/matches" className="inline-block mt-3 text-xs font-semibold text-[#008ba3] no-underline">
              Khám phá kèo MatchPro →
            </Link>
          </div>
        </div>

        <div className="px-4">
          <h3 className="text-base font-bold tracking-tight text-slate-900 mb-3">Thành tích</h3>
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-6 text-center">
            <p className="text-sm text-slate-500">Huy hiệu và thành tích sẽ được mở khóa sau các trận đấu.</p>
          </div>
        </div>

        <div className="px-4">
          <div className="bg-slate-950 rounded-3xl p-6 text-[var(--theme-primary)] shadow-xl relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-slate-800 rounded-full blur-3xl opacity-50" />
            <div className="relative z-10 flex items-center gap-2 text-sm font-medium text-slate-400 mb-4">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="3"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
              Ví ký quỹ
            </div>
            <p className="relative z-10 text-sm text-slate-400 mb-5">
              Quản lý số dư và giao dịch trên trang ví chuyên dụng.
            </p>
            <Link
              to="/mobile/wallet"
              className="relative z-10 block w-full bg-white text-slate-950 py-3.5 rounded-xl text-sm font-bold text-center no-underline transition-all active:scale-[0.98]"
            >
              Mở ví
            </Link>
          </div>
        </div>

        <div className="px-4 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
            {MENU_ITEMS.map((item, i) => (
              <div key={item.label} className="flex items-center gap-4 p-4 cursor-pointer hover:bg-slate-50 transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-white group-hover:border-slate-200 transition-colors">
                  {i === 0 && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
                  {i === 1 && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>}
                  {i === 2 && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>}
                </div>
                <span className="flex-1 text-sm font-semibold text-slate-700">{item.label}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400 group-hover:translate-x-0.5 transition-transform"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  )
}
