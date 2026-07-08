import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useNavbarEntrance } from '../hooks/useNavbarEntrance'
import { useAuth } from '../context/AuthContext'
import ProSportLogo from './ui/ProSportLogo'
import NotificationBell from './NotificationBell'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { isAuthenticated, logout, user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const navRef = useNavbarEntrance()

  function handleLogout() {
    logout()
    navigate('/')
  }

  const navLinks = [
    { label: 'Trang chủ', path: '/' },
    { label: 'Nhà thi đấu', path: '/courts' },
    { label: 'Bảng tin', path: '/matches' },
    { label: 'Cửa tiệm', path: '/gear/catalog' },
    { label: 'Sân gần bạn', path: '/matches/nearby' },
  ]

  const isActive = (path) =>
    location.pathname === path || (path !== '/' && location.pathname.startsWith(path))

  const portalLinks = (() => {
    if (user?.role === 'Admin') {
      return [
        { to: '/admin', label: 'Quản trị viên' },
        { to: '/owner/dashboard', label: 'Dashboard' },
        { to: '/owner/courts', label: 'Quản lý sân' },
        { to: '/owner/bookings', label: 'Lịch đặt sân' },
      ]
    }
    if (user?.role === 'CourtOwner') {
      return [
        { to: '/owner/dashboard', label: 'Dashboard' },
        { to: '/owner/courts', label: 'Quản lý sân' },
        { to: '/owner/bookings', label: 'Lịch đặt sân' },
      ]
    }
    if (user?.role === 'Staff') {
      return [{ to: '/apex', label: 'Cổng Apex' }]
    }
    return [{ to: '/apex', label: 'Cổng Apex' }]
  })()

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-[100] h-[76px] bg-ink/90 backdrop-blur-md border-b border-white/10 font-sans">
      <div className="flex items-center h-full gap-6 max-w-[1400px] mx-auto px-6 lg:px-10">
        <ProSportLogo size="sm" variant="light" />

        <ul className={`lg:flex items-center gap-1 list-none ml-auto ${menuOpen ? 'flex flex-col absolute top-[76px] left-0 right-0 p-6 gap-2 bg-ink border-b border-white/10' : 'hidden'}`}>
          {navLinks.map((link) => (
            <li key={link.path} className="w-full lg:w-auto">
              <Link
                to={link.path}
                className={`block w-full lg:inline-flex items-center justify-center px-3 py-2 transition-colors font-bold text-[13px] uppercase tracking-[0.06em]
                  ${isActive(link.path)
                    ? 'text-paper border-b-2 border-paper'
                    : 'text-paper/50 hover:text-paper'
                  }`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="w-full lg:hidden pt-2 border-t border-white/10 mt-2">
            {isAuthenticated ? (
              <div className="flex flex-col gap-2">
                {portalLinks.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className="w-full text-left px-4 py-2 text-paper/60 hover:text-paper font-bold text-[13px] uppercase tracking-[0.06em]"
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false) }}
                  className="w-full text-left px-4 py-2 text-paper/60 hover:text-paper font-bold text-[13px] uppercase tracking-[0.06em]"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 px-4">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="text-paper/70 font-bold text-[13px] uppercase tracking-[0.06em]">Đăng nhập</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="inline-flex items-center justify-center px-6 py-3 bg-accent text-ink font-extrabold text-[13px] uppercase tracking-[0.06em] rounded-[2px] no-underline text-center">Tham gia</Link>
              </div>
            )}
          </li>
        </ul>

        <div className="hidden lg:flex items-center gap-4 shrink-0 ml-2">
          {isAuthenticated && <NotificationBell />}
          {isAuthenticated ? (
            <>
              {portalLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-paper/60 hover:text-paper transition-colors font-bold text-[13px] uppercase tracking-[0.06em] px-2"
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="text-paper/60 hover:text-paper transition-colors font-bold text-[13px] uppercase tracking-[0.06em] px-2"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-paper font-bold text-[13px] uppercase tracking-[0.06em] px-2">Đăng nhập</Link>
              <Link to="/register" className="inline-flex items-center justify-center px-6 h-11 bg-accent text-ink font-extrabold text-[13px] uppercase tracking-[0.06em] rounded-[2px] no-underline">Tham gia</Link>
            </>
          )}
        </div>

        <button
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-[2px] text-paper/70 hover:bg-white/5 hover:text-paper transition-colors ml-auto"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Mở menu"
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
