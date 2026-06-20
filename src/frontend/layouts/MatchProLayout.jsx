import { Link, useLocation } from 'react-router-dom'
import './MatchProLayout.css'

const navLinks = [
  { path: '/matchpro/feed', label: 'Feed' },
  { path: '/matchpro/explore', label: 'Explore' },
  { path: '/matchpro/match', label: 'Match' },
  { path: '/matchpro/chats', label: 'Chats' },
  { path: '/matchpro/profile', label: 'Profile' },
]

export default function MatchProLayout({ children }) {
  const location = useLocation()
  const isActive = (path) => location.pathname.startsWith(path)

  return (
    <div className="mp-layout">
      <header className="mp-header">
        <Link to="/matchpro/feed" className="mp-header__logo">MatchPro</Link>
        <nav className="mp-header__nav">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`mp-nav-link ${isActive(link.path) ? 'mp-nav-link--active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mp-header__actions">
          <button className="mp-icon-btn" aria-label="Notifications">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </button>
          <button className="mp-icon-btn" aria-label="Messages">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </button>
          <button className="mp-icon-btn" aria-label="Profile">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </button>
        </div>
      </header>
      <main className="mp-main">{children}</main>
    </div>
  )
}
