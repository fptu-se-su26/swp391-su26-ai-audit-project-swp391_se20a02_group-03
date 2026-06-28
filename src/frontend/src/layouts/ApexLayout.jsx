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
  ArrowLeft
} from 'lucide-react'

/* ─── Navigation Config ─── */
const mainNav = [
  {
    path: '/apex',
    label: 'Tổng quan',
    icon: <Home className="w-5 h-5" />,
    exact: true,
  },
  {
    path: '/apex/booking',
    label: 'Đặt sân',
    icon: <Calendar className="w-5 h-5" />,
  },
  {
    path: '/apex/matches',
    label: 'Kèo đấu',
    icon: <Swords className="w-5 h-5" />,
  },
  {
    path: '/gear/catalog',
    label: 'Cửa hàng',
    icon: <ShoppingBag className="w-5 h-5" />,
  },
  {
    path: '/apex/bookings',
    label: 'Lịch sử',
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    path: '/apex/activity',
    label: 'Hoạt động',
    icon: <Activity className="w-5 h-5" />,
  },
]

const accountNav = [
  {
    path: '/apex/profile',
    label: 'Hồ sơ',
    icon: <User className="w-5 h-5" />,
  },
  {
    path: '/apex/settings',
    label: 'Cài đặt',
    icon: <Settings className="w-5 h-5" />,
  },
]

const supportNav = [
  {
    path: '/apex/support',
    label: 'Hỗ trợ',
    icon: <LifeBuoy className="w-5 h-5" />,
  },
]

/* ─── Sidebar Nav Item ─── */
function NavItem({ link, isActive, onClick }) {
  return (
    <Link
      to={link.path}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden ${
        isActive
          ? 'bg-[var(--theme-surface-hover)] text-[var(--theme-primary)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.2)]'
          : 'text-foreground-muted hover:bg-[var(--theme-surface)] hover:text-[var(--theme-primary)]'
      }`}
    >
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-[#5E6AD2] rounded-r-full shadow-[0_0_10px_rgba(94,106,210,0.8)]" />
      )}
      <span className={`shrink-0 transition-colors duration-200 ${isActive ? 'text-[#5E6AD2]' : 'text-foreground-muted group-hover:text-foreground-muted'}`}>
        {link.icon}
      </span>
      <span>{link.label}</span>
    </Link>
  )
}

/* ─── Group Label ─── */
function GroupLabel({ children }) {
  return (
    <p className="px-3 pt-5 pb-2 text-xs font-mono tracking-wider uppercase text-foreground-muted">
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
    <div className="flex min-h-screen bg-background-base font-sans text-foreground relative overflow-hidden">
      {/* ─── Ambient Background System ─── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--theme-bg-elevated)_0%,var(--theme-bg-base)_50%,var(--theme-bg-deep)_100%)]" />
        <div className="absolute inset-0 bg-noise" />
        {/* Animated Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#5E6AD2]/10 blur-[120px] rounded-full animate-blob" style={{ animationDuration: '15s' }} />
        <div className="absolute top-1/4 -left-[200px] w-[600px] h-[600px] bg-purple-500/10 blur-[120px] rounded-full animate-blob" style={{ animationDuration: '20s', animationDelay: '2s' }} />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-blue-500/10 blur-[150px] rounded-full animate-blob" style={{ animationDuration: '18s', animationDelay: '5s' }} />
      </div>

      {/* ─── Sidebar ─── */}
      <aside className={`w-[280px] h-screen bg-background-deep/80 backdrop-blur-xl border-r border-border-default flex flex-col fixed left-0 top-0 bottom-0 z-[200] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${desktopSidebarCollapsed ? '-translate-x-full' : 'translate-x-0'} ${mobileSidebarOpen ? 'max-[900px]:!translate-x-0' : 'max-[900px]:!-translate-x-full'}`}>
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 h-16 border-b border-border-default shrink-0">
          <ProSportLogo size="sm" />
        </div>

        {/* Nav groups */}
        <nav className="flex-1 px-3 py-4 flex flex-col overflow-y-auto">
          <GroupLabel>Chính</GroupLabel>
          <div className="flex flex-col gap-1">
            {mainNav.map(link => (
              <NavItem key={link.path} link={link} isActive={isActive(link)} onClick={() => setMobileSidebarOpen(false)} />
            ))}
          </div>

          <GroupLabel>Tài khoản</GroupLabel>
          <div className="flex flex-col gap-1">
            {accountNav.map(link => (
              <NavItem key={link.path} link={link} isActive={isActive(link)} onClick={() => setMobileSidebarOpen(false)} />
            ))}
          </div>

          {/* Spacer */}
          <div className="flex-1 min-h-[40px]" />

          {/* Support group */}
          <div className="border-t border-border-default pt-4 pb-4 flex flex-col gap-1">
            {supportNav.map(link => (
              <NavItem key={link.path} link={link} isActive={isActive(link)} onClick={() => setMobileSidebarOpen(false)} />
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-foreground-muted hover:bg-red-500/10 hover:text-red-400 text-left w-full"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* ─── Main content ─── */}
      <div className={`flex-1 flex flex-col min-h-screen relative z-10 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${desktopSidebarCollapsed ? 'ml-0' : 'ml-[280px]'} max-[900px]:!ml-0`}>
        {/* Top bar */}
        <header className="h-16 bg-background-base/50 backdrop-blur-md border-b border-border-default flex items-center gap-4 px-8 sticky top-0 z-[100]">
          {/* Mobile hamburger */}
          <button
            className="hidden max-[900px]:flex items-center justify-center w-10 h-10 rounded-lg text-foreground-muted hover:bg-[var(--theme-surface)] hover:text-[var(--theme-primary)] transition-colors"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            aria-label="Mở menu"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Desktop sidebar toggle */}
          <button
            className="max-[900px]:hidden flex items-center justify-center w-10 h-10 rounded-lg text-foreground-muted hover:bg-[var(--theme-surface)] hover:text-[var(--theme-primary)] transition-colors"
            onClick={() => setDesktopSidebarCollapsed(!desktopSidebarCollapsed)}
            aria-label="Thu gọn menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Back to Home Button */}
          <button
            className="flex items-center justify-center w-10 h-10 rounded-lg text-foreground-muted hover:bg-[var(--theme-surface)] hover:text-[var(--theme-primary)] transition-colors sm:ml-2"
            onClick={() => navigate('/')}
            title="Quay về trang chính"
            aria-label="Về trang chủ"
          >
            <Home className="w-5 h-5" />
          </button>

          <div className="flex-1 max-w-[400px] ml-2 sm:ml-4">
            <SearchBar className="w-full h-9 bg-[var(--theme-surface)] border-border-default focus:border-[#5E6AD2] focus:ring-1 focus:ring-[#5E6AD2]/50 text-sm rounded-lg" />
          </div>

          <div className="flex items-center gap-4 ml-auto">
            {/* Cart */}
            <Link to="/gear/cart" className="relative flex items-center justify-center w-10 h-10 rounded-lg text-foreground-muted hover:bg-[var(--theme-surface)] hover:text-[var(--theme-primary)] transition-colors" title="Giỏ hàng">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-[#5E6AD2] text-[var(--theme-primary)] w-4 h-4 flex items-center justify-center rounded-full text-[10px] font-bold shadow-[0_0_8px_rgba(94,106,210,0.6)]">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="text-foreground-muted hover:text-[var(--theme-primary)] transition-colors cursor-pointer">
              <NotificationMenu />
            </div>
            <div className="cursor-pointer">
              <ProfileDropdown user={userProfile} />
            </div>
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
          className="hidden max-[900px]:block fixed inset-0 bg-background-deep/80 z-[199] backdrop-blur-sm transition-opacity"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
    </div>
  )
}
