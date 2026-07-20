import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { useAuth } from '../context/AuthContext'
import ProSportLogo from '../components/ui/ProSportLogo'

const navLinks = [
  { path: '/matches', label: 'Bảng tin' },
  { path: '/matches/leaderboard', label: 'Xếp hạng' },
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
    <div className="min-h-screen bg-background-base flex flex-col text-foreground">
      <header ref={headerRef} className="h-[76px] bg-ink border-b border-white/10 flex items-center px-4 md:px-10 gap-4 sticky top-0 z-[200]">
        <ProSportLogo size="sm" variant="light" className="shrink-0" />

        <nav className="hidden lg:flex gap-1 flex-1 justify-center">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`py-2 px-4 font-bold text-[13px] uppercase tracking-[0.06em] no-underline transition-colors ${
                isActive(link.path)
                  ? 'text-paper border-b-2 border-paper'
                  : 'text-paper/50 hover:text-paper'
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
            className="hidden sm:flex w-9 h-9 rounded-[2px] bg-transparent items-center justify-center text-paper/60 border-none cursor-pointer transition-colors hover:text-paper"
            aria-label="Hồ sơ"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </button>
          <button
            type="button"
            className="lg:hidden w-9 h-9 rounded-[2px] bg-transparent flex items-center justify-center text-paper/60 border-none cursor-pointer transition-colors hover:text-paper"
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
        <nav className="lg:hidden bg-ink border-b border-white/10 px-4 py-3 flex flex-col gap-1 z-[199]">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`py-2.5 px-4 rounded-[2px] font-bold text-[12.5px] uppercase tracking-[0.02em] no-underline ${
                isActive(link.path) ? 'bg-paper text-ink' : 'text-paper/50'
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
