import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ProSportLogo from '../components/ui/ProSportLogo'

const navLinks = [
  {
    path: '/dashboard/inbox', label: 'Hộp thư',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><polyline points="3 9 12 15 21 9"/></svg>
  },
  {
    path: '/dashboard/broadcast', label: 'Phát sóng',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2 11 13"/><path d="M22 2 15 22 11 13 2 9 22 2z"/></svg>
  },
  {
    path: '/dashboard/bookings', label: 'Đặt sân',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
  },
  {
    path: '/dashboard/matches', label: 'Trận đấu',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/></svg>
  },
  {
    path: '/dashboard/payments', label: 'Thanh toán',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
  },
  {
    path: '/dashboard/settings', label: 'Cài đặt',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
  },
]

export default function ProSportDashLayout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const isActive = (path) => location.pathname.startsWith(path)

  return (
    <div className="flex min-h-screen bg-background-base">
      <aside className="w-[230px] bg-ink flex flex-col fixed left-0 top-0 bottom-0 z-[100] overflow-y-auto">
        <div className="px-6 py-6 border-b border-white/10">
          <ProSportLogo size="sm" variant="light" subtitle="Dashboard nhân viên" />
        </div>

        <nav className="flex-1 px-3 py-3 flex flex-col gap-0.5">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-2.5 py-2.5 px-3 rounded-[2px] font-bold text-[12.5px] uppercase tracking-[0.02em] no-underline transition-colors [&_svg]:shrink-0 ${
                isActive(link.path)
                  ? 'bg-paper text-ink'
                  : 'text-paper/50 hover:text-paper'
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            to="/elite/dashboard"
            className="block w-full text-center rounded-[2px] py-2.5 text-[11px] font-bold uppercase tracking-[0.04em] no-underline border-2 border-white/15 text-paper/60 hover:border-paper hover:text-paper transition-colors"
          >
            EliteSport OS →
          </Link>
          <button
            type="button"
            onClick={() => { logout(); navigate('/login') }}
            className="block w-full text-center rounded-[2px] py-2 text-[11px] font-bold uppercase tracking-[0.04em] border-2 border-danger text-danger cursor-pointer"
          >
            Đăng xuất
          </button>
          <p className="text-[11px] text-paper/40 text-center truncate px-1">{user?.fullName || 'Staff'}</p>
        </div>
      </aside>

      <div className="ml-[230px] flex-1 flex flex-col min-h-screen">
        <header className="h-16 bg-surface border-b-2 border-border-strong flex items-center px-6 gap-4 sticky top-0 z-50">
          <div className="flex-1 max-w-[360px] flex items-center gap-2 bg-surface border-2 border-border-strong rounded-[2px] h-10 px-4 focus-within:border-accent transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground-muted shrink-0">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" placeholder="Tìm kiếm..." id="psd-search" className="border-none bg-transparent text-sm text-foreground w-full outline-none placeholder:text-foreground-subtle" />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Link to="/dashboard/inbox" className="w-9 h-9 rounded-[2px] bg-transparent cursor-pointer flex items-center justify-center text-foreground-muted relative transition-colors hover:bg-surface-hover hover:text-foreground no-underline" aria-label="Hộp thư">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </Link>
            <button type="button" onClick={() => { logout(); navigate('/login') }} className="w-9 h-9 rounded-[2px] bg-transparent border-none cursor-pointer flex items-center justify-center text-foreground-muted relative transition-colors hover:bg-surface-hover hover:text-foreground" aria-label="Đăng xuất" title="Đăng xuất">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        </header>
        <main className="flex-1 p-7">{children}</main>
      </div>
    </div>
  )
}
