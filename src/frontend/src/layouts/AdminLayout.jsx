import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ProSportLogo from '../components/ui/ProSportLogo'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { useIsDesktop } from '../hooks/useIsDesktop'

const navLinks = [
  { path: '/admin/dashboard', label: 'Tổng quan', icon: 'M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 0h6v6h-6z' },
  { path: '/admin/bookings', label: 'Đặt sân', icon: 'M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z' },
  { path: '/admin/users', label: 'Người dùng', icon: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' },
  { path: '/admin/courts', label: 'Sân', icon: 'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z' },
  { path: '/admin/kyc', label: 'E-KYC', icon: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z' },
  { path: '/admin/pricing', label: 'Bảng giá', icon: 'M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z' },
  { path: '/admin/inventory', label: 'Kho thiết bị', icon: 'M20 2H4c-1 0-2 .9-2 2v3.01c0 .72.43 1.34 1 1.69V20c0 1.1 1.1 2 2 2h14c.9 0 2-1.1 2-2V8.7c.57-.35 1-.97 1-1.69V4c0-1.1-1-2-2-2zm-5 12H9v-2h6v2zm5-7H4V4h16v3z' },
  { path: '/admin/complaints', label: 'Khiếu nại', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z' },
]

export default function AdminLayout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isActive = (path) => location.pathname.startsWith(path)
  const isDesktop = useIsDesktop()
  const asideRef = useRef(null)
  const menuButtonRef = useRef(null)
  // Sidebar "hiển thị" khi đang ở desktop (luôn thấy, bất kể sidebarOpen) HOẶC drawer mobile
  // đang mở. aria-hidden/inert chỉ áp dụng đúng lúc sidebar THỰC SỰ nằm ngoài màn hình.
  const visible = isDesktop || sidebarOpen

  // Chỉ bẫy focus khi đây thực sự là drawer mobile đang mở (không áp dụng trên desktop —
  // nơi sidebar luôn hiển thị tĩnh, không phải overlay cần focus trap).
  useFocusTrap({
    active: sidebarOpen && !isDesktop,
    containerRef: asideRef,
    onEscape: () => setSidebarOpen(false),
    restoreFocusRef: menuButtonRef,
  })

  // Đóng drawer tự động nếu người dùng resize/xoay màn hình sang desktop trong lúc đang mở.
  useEffect(() => {
    if (isDesktop) setSidebarOpen(false)
  }, [isDesktop])

  useEffect(() => {
    if (asideRef.current) asideRef.current.inert = !visible
  }, [visible])

  function handleLogout() {
    logout()
    navigate('/')
  }

  const displayName = user?.fullName || user?.name || 'Quản trị viên'
  const displayEmail = user?.email || 'admin@pro-sport.com'
  const initials = displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="flex min-h-screen bg-background-base font-sans">
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-ink/50 z-[90] lg:hidden border-none cursor-pointer"
          onClick={() => setSidebarOpen(false)}
          aria-label="Đóng menu"
        />
      )}

      <aside
        ref={asideRef}
        aria-hidden={!visible}
        className={`w-[230px] bg-ink flex flex-col fixed left-0 top-0 bottom-0 z-[100] overflow-y-auto transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="px-6 py-6 border-b border-white/10">
          <ProSportLogo size="sm" variant="light" subtitle="Cổng quản trị" />
        </div>

        <div className="px-4 py-4">
          <button
            type="button"
            onClick={() => navigate('/admin/bookings')}
            className="w-full bg-paper hover:bg-accent text-ink border-none rounded-[2px] py-2.5 text-[12px] font-extrabold uppercase tracking-[0.04em] cursor-pointer transition-colors"
          >
            + Đặt sân mới
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-4 flex flex-col gap-0.5">
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

        <div className="flex items-center gap-3 p-5 border-t border-white/10">
          <div className="w-9 h-9 rounded-[2px] bg-paper text-ink flex items-center justify-center font-heading text-xs">{initials}</div>
          <div className="flex flex-col min-w-0">
            <p className="text-sm font-semibold text-paper truncate">{displayName}</p>
            <p className="text-xs text-paper/50 truncate">{displayEmail}</p>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col lg:ml-[230px] w-full">
        <header className="h-16 bg-surface border-b-2 border-border-strong flex items-center justify-between px-4 md:px-8 sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <button
              ref={menuButtonRef}
              type="button"
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-[2px] border-2 border-border-strong bg-surface text-foreground cursor-pointer"
              onClick={() => setSidebarOpen(true)}
              aria-label="Mở menu quản trị"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-surface border-2 border-border-strong rounded-[2px] h-11 px-4 w-[280px] md:w-[360px] focus-within:border-accent">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground-muted shrink-0"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="search" aria-label="Tìm kiếm" placeholder="Tìm người dùng, sân, đặt sân..." className="border-none outline-none bg-transparent w-full text-sm text-foreground placeholder:text-foreground-subtle" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="label-mono text-foreground-muted hover:text-foreground no-underline">← Về trang chủ</Link>
            <button
              onClick={handleLogout}
              className="text-sm font-bold uppercase tracking-[0.04em] text-danger border-2 border-danger px-3 py-1.5 rounded-[2px] transition-colors cursor-pointer bg-transparent hover:bg-danger-bg"
            >
              Đăng xuất
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
