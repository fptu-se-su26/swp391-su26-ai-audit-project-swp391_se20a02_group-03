import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { useAuth } from '../context/AuthContext'
import ProSportLogo from '../components/ui/ProSportLogo'

const navLinks = [
  { path: '/matches', label: 'Bảng tin' },
  { path: '/matches/nearby', label: 'Sân gần bạn' },
  { path: '/matches/community', label: 'Cộng đồng' },
  { path: '/matches/leaderboard', label: 'Xếp hạng' },
  { path: '/matches/create', label: 'Tạo trận' },
]

export default function MatchProLayout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef(null)
  const contentRef = useRef(null)

  function isActive(path) {
    if (path === '/matches') return location.pathname === '/matches'
    return location.pathname.startsWith(path)
  }

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(headerRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' })
    }
    if (contentRef.current) {
      gsap.fromTo(contentRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6, delay: 0.2, ease: 'power2.out' })
    }
  }, [])

  function handleProfile() {
    if (isAuthenticated) navigate('/apex/profile')
    else navigate('/login')
  }

  return (
    <div className="min-h-screen bg-background-deep flex flex-col text-[var(--theme-primary)]">
      <header ref={headerRef} className="h-[60px] bg-background-base/80 backdrop-blur-md border-b border-border-default flex items-center px-4 md:px-8 gap-4 sticky top-0 z-[200]">
        <ProSportLogo size="sm" className="shrink-0" />

        <nav className="hidden lg:flex gap-1 flex-1 justify-center">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`py-1.5 px-[18px] text-[0.88rem] font-medium rounded-full no-underline transition-all relative ${
                isActive(link.path)
                  ? 'text-[#5E6AD2] font-semibold after:content-[""] after:absolute after:-bottom-4 after:left-1/2 after:-translate-x-1/2 after:w-[60%] after:h-0.5 after:bg-[#5E6AD2] after:rounded-sm'
                  : 'text-foreground-muted hover:text-[var(--theme-primary)] hover:bg-[var(--theme-surface)]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={handleProfile}
            className="hidden sm:flex w-9 h-9 rounded-full bg-transparent items-center justify-center text-foreground-muted border-none cursor-pointer transition-all hover:bg-[var(--theme-surface-hover)] hover:text-[var(--theme-primary)]"
            aria-label="Hồ sơ"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </button>
          <button
            type="button"
            className="lg:hidden w-9 h-9 rounded-full bg-transparent flex items-center justify-center text-foreground-muted border-none cursor-pointer transition-all hover:bg-[var(--theme-surface-hover)]"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Mở menu MatchPro"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? (
                <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
              ) : (
                <><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></>
              )}
            </svg>
          </button>
        </div>
      </header>

      {menuOpen && (
        <nav className="lg:hidden bg-background-base border-b border-border-default px-4 py-3 flex flex-col gap-1 z-[199]">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`py-2.5 px-4 rounded-xl text-sm font-medium no-underline ${
                isActive(link.path) ? 'bg-[#5E6AD2]/15 text-[#5E6AD2]' : 'text-foreground-muted'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}

      <main ref={contentRef} className="flex-1">{children}</main>
    </div>
  )
}
