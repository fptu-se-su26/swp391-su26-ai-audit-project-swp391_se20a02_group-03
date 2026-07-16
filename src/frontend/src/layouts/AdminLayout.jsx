import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ProSportLogo from '../components/ui/ProSportLogo'
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Building2,
  ShieldCheck,
  BadgeDollarSign,
  Package,
  MessageSquareWarning,
  LogOut,
  Menu,
  Home,
  X,
} from 'lucide-react'

/* ─── Navigation Config ─── */
const NAV_GROUPS = [
  {
    label: 'Tổng quan',
    links: [
      { path: '/admin/dashboard', label: 'Bảng điều khiển', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Quản lý nghiệp vụ',
    links: [
      { path: '/admin/bookings',   label: 'Đặt sân',       icon: CalendarDays },
      { path: '/admin/users',      label: 'Người dùng',    icon: Users },
      { path: '/admin/courts',     label: 'Sân thể thao',  icon: Building2 },
      { path: '/admin/kyc',        label: 'E-KYC',         icon: ShieldCheck },
      { path: '/admin/complaints', label: 'Khiếu nại',     icon: MessageSquareWarning },
    ],
  },
  {
    label: 'Cấu hình',
    links: [
      { path: '/admin/pricing',   label: 'Bảng giá',      icon: BadgeDollarSign },
      { path: '/admin/inventory', label: 'Kho thiết bị',  icon: Package },
    ],
  },
]

/* ─── Sidebar Nav Item ─── */
function NavItem({ link, isActive, onClick }) {
  const Icon = link.icon
  return (
    <Link
      to={link.path}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-[10px] mx-3 rounded-[8px] text-[13px] font-semibold tracking-[0.01em] no-underline transition-all duration-150 ease-in-out ${
        isActive
          ? 'bg-white/12 text-white'
          : 'text-white/50 hover:text-white hover:bg-white/6'
      }`}
    >
      <Icon size={16} className={`shrink-0 transition-colors ${isActive ? 'text-[#14b8a6]' : ''}`} />
      <span>{link.label}</span>
    </Link>
  )
}

/* ─── Group Label ─── */
function GroupLabel({ children }) {
  return (
    <p className="px-7 pt-5 pb-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-white/30 m-0">
      {children}
    </p>
  )
}

/* ─── Layout ─── */
export default function AdminLayout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const closeRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined

    const media = window.matchMedia('(max-width: 1023px)')
    setIsMobile(media.matches)
    const listener = () => setIsMobile(media.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [])

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  // Escape key closes mobile sidebar
  useEffect(() => {
    if (!sidebarOpen) return
    function onKey(e) {
      if (e.key === 'Escape') {
        setSidebarOpen(false)
        closeRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [sidebarOpen])

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

  function handleLogout() {
    logout()
    navigate('/')
  }

  function isActive(path) {
    return location.pathname.startsWith(path)
  }

  const displayName = user?.fullName || user?.name || 'Quản trị viên'
  const displayEmail = user?.email || ''
  const initials = displayName
    .trim()
    .split(/\s+/)
    .map(w => w[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="flex min-h-screen bg-[#F6F8FA] font-sans text-gray-900">

      {/* ─── Mobile Backdrop ─── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/60 z-[198] lg:hidden"
          onClick={() => { setSidebarOpen(false); closeRef.current?.focus() }}
          aria-hidden="true"
        />
      )}

      {/* ─── Sidebar ─── */}
      <aside
        id="admin-sidebar"
        aria-label="Điều hướng quản trị"
        aria-hidden={isMobile && !sidebarOpen}
        inert={isMobile && !sidebarOpen ? '' : undefined}
        className={`
          w-[256px] bg-[#0d1b2a] flex flex-col fixed left-0 top-0 bottom-0 z-[199]
          transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/8 shrink-0">
          <ProSportLogo size="sm" variant="light" subtitle="Quản trị" />
          <button
            type="button"
            onClick={() => { setSidebarOpen(false); closeRef.current?.focus() }}
            aria-label="Đóng menu"
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-[8px] text-white/40 hover:text-white hover:bg-white/8 border-0 bg-transparent cursor-pointer transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Quick action */}
        <div className="px-4 pt-4 pb-2">
          <button
            type="button"
            onClick={() => navigate('/admin/bookings')}
            className="w-full bg-[#14b8a6] hover:bg-[#0f9e8c] active:scale-[0.98] text-white border-none rounded-[8px] py-2.5 text-[12px] font-bold uppercase tracking-[0.05em] cursor-pointer transition-all shadow-sm"
          >
            + Đặt sân mới
          </button>
        </div>

        {/* Nav groups */}
        <nav className="flex-1 overflow-y-auto py-1 scrollbar-hide flex flex-col">
          {NAV_GROUPS.map(group => (
            <div key={group.label}>
              <GroupLabel>{group.label}</GroupLabel>
              <div className="flex flex-col gap-0.5">
                {group.links.map(link => (
                  <NavItem
                    key={link.path}
                    link={link}
                    isActive={isActive(link.path)}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Spacer */}
          <div className="flex-1 min-h-8" />

          {/* Bottom section */}
          <div className="border-t border-white/8 py-3 flex flex-col gap-0.5">
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-[10px] mx-3 rounded-[8px] text-[13px] font-semibold text-red-400 hover:text-red-300 hover:bg-white/6 text-left border-0 bg-transparent cursor-pointer transition-all duration-150"
            >
              <LogOut size={16} className="shrink-0" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </nav>

        {/* User card */}
        <div className="flex items-center gap-3 px-4 py-4 border-t border-white/8 bg-black/20 shrink-0">
          <div className="w-8 h-8 rounded-full bg-white/10 text-white border border-white/20 flex items-center justify-center text-[11px] font-bold shrink-0">
            {initials}
          </div>
          <div className="flex flex-col min-w-0">
            <p className="text-[13px] font-semibold text-white truncate m-0">{displayName}</p>
            {displayEmail && (
              <p className="text-[11px] text-white/40 truncate m-0">{displayEmail}</p>
            )}
          </div>
        </div>
      </aside>

      {/* ─── Main Content Area ─── */}
      <div 
        className="flex-1 flex flex-col lg:ml-[256px] w-full min-h-screen"
        aria-hidden={isMobile && sidebarOpen}
        inert={isMobile && sidebarOpen ? '' : undefined}
      >

        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 md:px-6 sticky top-0 z-[100] shadow-[0_1px_4px_rgba(0,0,0,0.04)] gap-3">

          {/* Mobile hamburger */}
          <button
            ref={closeRef}
            type="button"
            aria-label="Mở menu quản trị"
            aria-controls="admin-sidebar"
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-[8px] text-gray-500 hover:bg-teal-50 hover:text-[#14b8a6] border-0 bg-transparent cursor-pointer transition-colors"
          >
            <Menu size={20} />
          </button>

          {/* Desktop breadcrumb / page title area — empty but keeps spacing */}
          <div className="flex-1" />

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Link
              to="/"
              title="Về trang chủ"
              aria-label="Về trang chủ"
              className="flex items-center justify-center w-9 h-9 rounded-[8px] text-gray-500 hover:bg-teal-50 hover:text-[#14b8a6] no-underline transition-colors"
            >
              <Home size={18} />
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-[1280px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
