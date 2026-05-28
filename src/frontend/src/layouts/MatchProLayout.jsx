import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import './MatchProLayout.css'

const navLinks = [
  { path: '/matches', label: '📈 Trending', exact: true },
  { path: '/matches/nearby', label: '📍 Nearby Sports' },
  { path: '/matches/community', label: '👥 Community' },
  { path: '/matches/leaderboard', label: '🏆 Leaderboard' },
]

export default function MatchProLayout({ children }) {
  const location = useLocation()
  const headerRef = useRef(null)

  const isActive = (path, exact) => {
    if (exact) return location.pathname === path
    return location.pathname.startsWith(path)
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, { y: -60, opacity: 0, duration: 0.6, ease: 'power3.out' })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="mp-layout">
      <header className="mp-header" ref={headerRef}>
        <Link to="/matches" className="mp-header__logo">
          <span className="mp-logo-icon">⚡</span>
          MatchPro
        </Link>
        <nav className="mp-header__nav">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`mp-nav-link ${isActive(link.path, link.exact) ? 'mp-nav-link--active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mp-header__actions">
          <Link to="/matches/create" className="mp-create-match-btn">+ Create Match</Link>
          <button className="mp-icon-btn" aria-label="Notifications">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <span className="mp-notif-badge">3</span>
          </button>
          <Link to="/apex/profile">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80" alt="Profile" className="mp-header__avatar" />
          </Link>
        </div>
      </header>
      <main className="mp-main">{children}</main>
    </div>
  )
}
