import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useNavbarEntrance } from '../hooks/useNavbarEntrance'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const navRef = useNavbarEntrance()

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [location])

  function handleLogout() {
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
    setIsLoggedIn(false)
    navigate('/')
  }

  const navLinks = [
    { label: 'Trang chủ',      path: '/' },
    { label: 'Nhà thi đấu',    path: '/courts' },
    { label: 'Bảng tin',   path: '/matches' },
    { label: 'Cửa tiệm',    path: '/gear/catalog' },
    { label: 'Bản đồ',     path: '/about' },
  ]

  const isActive = (path) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path))

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-[100] h-16 bg-background-base/80 backdrop-blur-md border-b border-border-default font-sans">
      <div className="flex items-center h-full gap-6 max-w-7xl mx-auto px-6">
        {/* Logo */}
        <Link to="/" className="font-heading text-lg font-bold tracking-tight text-[var(--theme-primary)] flex items-center gap-1.5 shrink-0 hover:opacity-80 transition-opacity">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#5E6AD2] to-indigo-600 flex items-center justify-center shadow-[0_0_10px_rgba(94,106,210,0.4)]">
            <span className="text-[var(--theme-primary)] text-xs font-bold">P</span>
          </div>
          <span>PRO-SPORT</span>
        </Link>

        {/* Links */}
        <ul className={`lg:flex items-center gap-1 list-none ml-auto ${menuOpen ? 'flex flex-col absolute top-16 left-0 right-0 p-6 gap-2 bg-background-base border-b border-border-default' : 'hidden'}`}>
          {navLinks.map((link) => (
            <li key={link.path} className="w-full lg:w-auto">
              <Link
                to={link.path}
                className={`block w-full lg:inline-flex items-center justify-center px-4 py-2 transition-all rounded-lg font-medium text-sm
                  ${isActive(link.path) 
                    ? 'text-[var(--theme-primary)] bg-[var(--theme-surface-hover)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.2)]'
                    : 'text-foreground-muted hover:text-[var(--theme-primary)] hover:bg-[var(--theme-surface)]'
                  }`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-4 shrink-0 ml-2">
          {isLoggedIn ? (
            <button 
              onClick={handleLogout}
              className="text-foreground-muted hover:text-[var(--theme-primary)] transition-colors font-medium text-sm px-2"
            >
              Thoát
            </button>
          ) : (
            <>
              <Link to="/login" className="text-foreground-muted hover:text-[var(--theme-primary)] transition-colors font-medium text-sm px-2">Đăng nhập</Link>
              <Link to="/register" className="btn-primary">Tham gia</Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-foreground-muted hover:bg-[var(--theme-surface)] hover:text-[var(--theme-primary)] transition-colors ml-auto"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {menuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>
    </nav>
  )
}
