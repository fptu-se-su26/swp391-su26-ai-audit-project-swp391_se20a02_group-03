import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import authApi from '../api/authApi'
import SearchBar from '../components/ui/SearchBar'
import ProfileDropdown from '../components/ui/ProfileDropdown'
import NotificationMenu from '../components/ui/NotificationMenu'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import ProSportLogo from '../components/ui/ProSportLogo'
import {
  Home,
  Calendar,
  Swords,
  ShoppingBag,
  BookOpen,
  Activity,
  User,
  Settings,
  LifeBuoy,
  LogOut,
  Menu,
  X,
} from 'lucide-react'

/* ─── Navigation Config ─── */
const mainNav = [
  {
    path: '/apex',
    label: 'Tổng quan',
    icon: <Home className="w-4 h-4" />,
    exact: true,
  },
  {
    path: '/apex/booking',
    label: 'Đặt sân',
    icon: <Calendar className="w-4 h-4" />,
  },
  {
    path: '/apex/matches',
    label: 'Kèo đấu',
    icon: <Swords className="w-4 h-4" />,
  },
  {
    path: '/gear/catalog',
    label: 'Cửa hàng',
    icon: <ShoppingBag className="w-4 h-4" />,
  },
  {
    path: '/apex/bookings',
    label: 'Lịch sử',
    icon: <BookOpen className="w-4 h-4" />,
  },
  {
    path: '/apex/activity',
    label: 'Hoạt động',
    icon: <Activity className="w-4 h-4" />,
  },
]

const accountNav = [
  {
    path: '/apex/profile',
    label: 'Hồ sơ',
    icon: <User className="w-4 h-4" />,
  },
  {
    path: '/apex/settings',
    label: 'Cài đặt',
    icon: <Settings className="w-4 h-4" />,
  },
]

const supportNav = [
  {
    path: '/apex/support',
    label: 'Hỗ trợ',
    icon: <LifeBuoy className="w-4 h-4" />,
  },
]

/* ─── Sidebar Nav Item ─── */
function NavItem({ link, isActive, onClick }) {
  return (
    <Link
      to={link.path}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-[2px] font-bold text-[13px] uppercase tracking-[0.02em] transition-colors no-underline ${
        isActive
          ? 'bg-paper text-ink'
          : 'text-paper/50 hover:text-paper'
      }`}
    >
      <span className="shrink-0">{link.icon}</span>
      <span>{link.label}</span>
    </Link>
  )
}

/* ─── Group Label ─── */
function GroupLabel({ children }) {
  return (
    <p className="label-mono px-3 pt-5 pb-2 text-paper/40">
      {children}
    </p>
  )
}

/* ─── Layout ─── */
export default function ApexLayout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false)
  const [userProfile, setUserProfile] = useState(null)
  const { cartCount } = useCart()
  const { logout } = useAuth()

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await authApi.getProfile()
        if (res?.data) setUserProfile(res.data)
      } catch (err) {
        console.error("Failed to fetch profile", err)
      }
    }
    fetchProfile()
  }, [])

  function handleLogout() {
    logout()
    navigate('/login')
  }

  function isActive(link) {
    if (link.exact) return location.pathname === link.path
    return location.pathname.startsWith(link.path)
  }

  return (
    <div className="flex min-h-screen bg-background-base font-sans text-foreground">
      {/* ─── Sidebar ─── */}
      <aside className={`w-[260px] h-screen bg-ink flex flex-col fixed left-0 top-0 bottom-0 z-[200] transition-transform duration-200 ${desktopSidebarCollapsed ? '-translate-x-full' : 'translate-x-0'} ${mobileSidebarOpen ? 'max-[900px]:!translate-x-0' : 'max-[900px]:!-translate-x-full'}`}>
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 h-16 border-b border-white/10 shrink-0">
          <ProSportLogo size="sm" variant="light" />
        </div>

        {/* Nav groups */}
        <nav className="flex-1 px-3 py-4 flex flex-col overflow-y-auto">
          <GroupLabel>Chính</GroupLabel>
          <div className="flex flex-col gap-0.5">
            {mainNav.map(link => (
              <NavItem key={link.path} link={link} isActive={isActive(link)} onClick={() => setMobileSidebarOpen(false)} />
            ))}
          </div>

          <GroupLabel>Tài khoản</GroupLabel>
          <div className="flex flex-col gap-0.5">
            {accountNav.map(link => (
              <NavItem key={link.path} link={link} isActive={isActive(link)} onClick={() => setMobileSidebarOpen(false)} />
            ))}
          </div>

          {/* Spacer */}
          <div className="flex-1 min-h-[40px]" />

          {/* Support group */}
          <div className="border-t border-white/10 pt-4 pb-4 flex flex-col gap-0.5">
            {supportNav.map(link => (
              <NavItem key={link.path} link={link} isActive={isActive(link)} onClick={() => setMobileSidebarOpen(false)} />
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-[2px] font-bold text-[13px] uppercase tracking-[0.02em] transition-colors text-danger hover:bg-white/5 text-left w-full"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* ─── Main content ─── */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-200 ${desktopSidebarCollapsed ? 'ml-0' : 'ml-[260px]'} max-[900px]:!ml-0`}>
        {/* Top bar */}
        <header className="h-16 bg-surface border-b-2 border-border-strong flex items-center gap-4 px-8 sticky top-0 z-[100]">
          {/* Mobile hamburger */}
          <button
            className="hidden max-[900px]:flex items-center justify-center w-10 h-10 rounded-[2px] text-foreground-muted hover:bg-surface-hover hover:text-foreground transition-colors"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            aria-label="Mở menu"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Desktop sidebar toggle */}
          <button
            className="max-[900px]:hidden flex items-center justify-center w-10 h-10 rounded-[2px] text-foreground-muted hover:bg-surface-hover hover:text-foreground transition-colors"
            onClick={() => setDesktopSidebarCollapsed(!desktopSidebarCollapsed)}
            aria-label="Thu gọn menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Back to Home Button */}
          <button
            className="flex items-center justify-center w-10 h-10 rounded-[2px] text-foreground-muted hover:bg-surface-hover hover:text-foreground transition-colors sm:ml-2"
            onClick={() => navigate('/')}
            title="Quay về trang chính"
            aria-label="Về trang chủ"
          >
            <Home className="w-5 h-5" />
          </button>

          <div className="flex-1 max-w-[400px] ml-2 sm:ml-4">
            <SearchBar className="w-full h-9" />
          </div>

          <div className="flex items-center gap-4 ml-auto">
            {/* Cart */}
            <Link to="/gear/cart" className="relative flex items-center justify-center w-10 h-10 rounded-[2px] text-foreground-muted hover:bg-surface-hover hover:text-foreground transition-colors" title="Giỏ hàng">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-accent text-ink w-4 h-4 flex items-center justify-center rounded-full text-[10px] font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            <NotificationMenu />
            <ProfileDropdown user={userProfile} />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-8 max-[900px]:p-5 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile sidebar backdrop */}
      {mobileSidebarOpen && (
        <div
          className="hidden max-[900px]:block fixed inset-0 bg-ink/60 z-[199]"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
    </div>
  )
}
