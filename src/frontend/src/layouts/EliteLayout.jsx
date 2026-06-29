import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ProSportLogo from '../components/ui/ProSportLogo'

const navLinks = [
  { path: '/elite/dashboard', label: 'Tổng quan', icon: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z' },
  { path: '/elite/bookings', label: 'Đặt sân', icon: 'M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z' },
  { path: '/elite/pos', label: 'Quầy POS', icon: 'M4 6h16v2H4zm2-4h12v2H6zm14 8H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zm0 10H4v-8h16v8zm-2-6H6v2h12v-2z' },
  { path: '/elite/schedule', label: 'Lịch sân', icon: 'M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z' },
  { path: '/elite/equipment', label: 'Thiết bị', icon: 'M20 7h-4V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zm-6 0h-4V5h4v2z' },
  { path: '/elite/scanner', label: 'Quét QR', icon: 'M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 7h10v10H7z' },
  { path: '/mobile/scanner', label: 'Scanner mobile', icon: 'M12 18h.01M8 21h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z' },
  { path: '/gear/maintenance', label: 'Bảo trì gear', icon: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' },
  { path: '/elite/vouchers', label: 'Voucher', icon: 'M21 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm-9 8h2v2h-2v-2zm0-4h2v2h-2V9z' },
  { path: '/elite/disputes', label: 'Khiếu nại', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z' },
]

export default function EliteLayout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isActive = (path) => location.pathname.startsWith(path)

  const displayName = user?.fullName || user?.name || 'Nhân viên'
  const initials = displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-['Inter',sans-serif]">
      {sidebarOpen && (
        <button type="button" className="fixed inset-0 bg-black/40 z-[90] lg:hidden border-none cursor-pointer" onClick={() => setSidebarOpen(false)} aria-label="Đóng menu" />
      )}

      <aside className={`w-[240px] bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0 bottom-0 z-[100] transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center gap-3 pt-8 pb-6 px-6">
          <div className="w-11 h-11 rounded-full bg-[#5E6AD2]/15 text-[#5E6AD2] flex items-center justify-center text-sm font-bold">{initials}</div>
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-[1.2]">{displayName}</h2>
            <p className="text-xs text-slate-500 mt-0.5">EliteSport OS</p>
          </div>
        </div>

        <div className="px-6 pb-6">
          <Link to="/elite/scanner" onClick={() => setSidebarOpen(false)} className="w-full bg-[#5E6AD2] hover:bg-[#4e5bc4] text-white border-none rounded-lg py-3 text-[0.875rem] font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all no-underline">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><rect x="7" y="7" width="10" height="10" rx="1"/></svg>
            Quét nhanh
          </Link>
        </div>

        <nav className="flex-1 flex flex-col">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 py-3 px-6 text-[0.875rem] font-medium no-underline transition-all ${
                isActive(link.path)
                  ? 'bg-[#5E6AD2]/10 text-[#5E6AD2] font-semibold rounded-r-full mr-4'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d={link.icon} /></svg>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="py-6 border-t border-slate-200 space-y-1">
          <Link to="/dashboard/inbox" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 py-3 px-6 text-[0.875rem] font-medium text-slate-500 no-underline hover:bg-slate-50 hover:text-[#5E6AD2]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><polyline points="3 9 12 15 21 9"/></svg>
            <span>ProSport Dash</span>
          </Link>
          <Link to="/contact" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 py-3 px-6 text-[0.875rem] font-medium text-slate-500 no-underline hover:bg-slate-50 hover:text-slate-900">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <span>Hỗ trợ</span>
          </Link>
          <button
            type="button"
            onClick={() => { logout(); navigate('/login') }}
            className="flex items-center gap-3 py-3 px-6 text-[0.875rem] font-medium text-red-600 w-full bg-transparent border-none cursor-pointer hover:bg-red-50"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col lg:ml-[240px] w-full">
        <header className="h-[72px] bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <button type="button" className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 cursor-pointer" onClick={() => setSidebarOpen(true)} aria-label="Mở menu">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            </button>
            <ProSportLogo size="sm" variant="dark" iconOnly className="shrink-0" />
            <div className="font-['Oswald',sans-serif] text-xl md:text-2xl font-bold text-slate-900 tracking-[-0.5px]">EliteSport OS</div>
          </div>
          <Link to="/" className="text-sm font-medium text-slate-500 hover:text-[#5E6AD2] no-underline">← Trang chủ</Link>
        </header>

        <main className="p-4 md:p-8 flex-1">{children}</main>
      </div>
    </div>
  )
}
