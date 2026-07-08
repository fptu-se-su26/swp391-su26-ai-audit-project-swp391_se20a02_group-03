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
    <div className="flex min-h-screen bg-background-base font-sans">
      {sidebarOpen && (
        <button type="button" className="fixed inset-0 bg-ink/50 z-[90] lg:hidden border-none cursor-pointer" onClick={() => setSidebarOpen(false)} aria-label="Đóng menu" />
      )}

      <aside className={`w-[230px] bg-ink flex flex-col fixed left-0 top-0 bottom-0 z-[100] overflow-y-auto transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
          <div className="w-10 h-10 rounded-[2px] bg-paper text-ink flex items-center justify-center font-heading text-sm">{initials}</div>
          <div>
            <h2 className="text-sm font-semibold text-paper leading-tight">{displayName}</h2>
            <p className="label-mono text-paper/40 mt-0.5">EliteSport OS</p>
          </div>
        </div>

        <div className="px-4 py-4">
          <Link to="/elite/scanner" onClick={() => setSidebarOpen(false)} className="w-full bg-paper hover:bg-accent text-ink border-none rounded-[2px] py-2.5 text-[12px] font-extrabold uppercase tracking-[0.04em] cursor-pointer flex items-center justify-center gap-2 transition-colors no-underline">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><rect x="7" y="7" width="10" height="10" rx="1"/></svg>
            Quét nhanh
          </Link>
        </div>

        <nav className="flex-1 px-3 flex flex-col gap-0.5 overflow-y-auto">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 py-2.5 px-3 rounded-[2px] font-bold text-[12.5px] uppercase tracking-[0.02em] no-underline transition-colors ${
                isActive(link.path)
                  ? 'bg-paper text-ink'
                  : 'text-paper/50 hover:text-paper'
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="shrink-0"><path d={link.icon} /></svg>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="py-4 px-3 border-t border-white/10 flex flex-col gap-0.5">
          <Link to="/dashboard/inbox" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 py-2.5 px-3 rounded-[2px] font-bold text-[12.5px] uppercase tracking-[0.02em] text-paper/50 no-underline hover:text-paper">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><polyline points="3 9 12 15 21 9"/></svg>
            <span>ProSport Dash</span>
          </Link>
          <Link to="/contact" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 py-2.5 px-3 rounded-[2px] font-bold text-[12.5px] uppercase tracking-[0.02em] text-paper/50 no-underline hover:text-paper">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <span>Hỗ trợ</span>
          </Link>
          <button
            type="button"
            onClick={() => { logout(); navigate('/login') }}
            className="flex items-center gap-3 py-2.5 px-3 rounded-[2px] font-bold text-[12.5px] uppercase tracking-[0.02em] text-danger w-full bg-transparent border-none cursor-pointer hover:bg-white/5 text-left"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col lg:ml-[230px] w-full">
        <header className="h-16 bg-surface border-b-2 border-border-strong flex items-center justify-between px-4 md:px-8 sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <button type="button" className="lg:hidden w-10 h-10 flex items-center justify-center rounded-[2px] border-2 border-border-strong bg-surface text-foreground cursor-pointer" onClick={() => setSidebarOpen(true)} aria-label="Mở menu">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            </button>
            <ProSportLogo size="sm" iconOnly className="shrink-0" />
            <div className="font-heading text-xl md:text-2xl uppercase tracking-tight text-foreground">EliteSport OS</div>
          </div>
          <Link to="/" className="label-mono text-foreground-muted hover:text-foreground no-underline">← Trang chủ</Link>
        </header>

        <main className="p-4 md:p-8 flex-1">{children}</main>
      </div>
    </div>
  )
}
