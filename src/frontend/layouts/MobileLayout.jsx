import { Link, useLocation } from 'react-router-dom'
import './MobileLayout.css'

export default function MobileLayout({ children, hideBottomNav = false, title = null, showBack = false }) {
  const location = useLocation()
  
  return (
    <div className="mobile-app-container">
      <div className="mobile-app-wrapper">
        
        {/* Topbar */}
        <header className="mobile-topbar">
          <div className="mt-left">
            {showBack ? (
              <Link to="/mobile/home" className="mt-icon-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              </Link>
            ) : (
              <button className="mt-icon-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              </button>
            )}
          </div>
          
          <div className="mt-center">
            {title ? (
              <span className="mt-title">{title}</span>
            ) : (
              <h1 className="mt-brand">PRO-SPORT</h1>
            )}
          </div>
          
          <div className="mt-right">
            {!showBack && (
              <button className="mt-icon-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16v16H4z"/><path d="M4 9h16"/><path d="M9 4v16"/></svg>
              </button>
            )}
            {showBack && (
              <button className="mt-icon-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
              </button>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="mobile-main" style={{ position: 'relative' }}>
          {children}
        </main>

        {/* Bottom Nav */}
        {!hideBottomNav && (
          <nav className="mobile-bottom-nav">
            <Link to="/mobile/home" className={`mb-nav-item ${location.pathname.includes('/mobile/home') ? 'active' : ''}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill={location.pathname.includes('/mobile/home') ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              <span>Home</span>
            </Link>
            <Link to="/mobile/booking" className={`mb-nav-item ${location.pathname.includes('/mobile/booking') ? 'active' : ''}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span>Booking</span>
            </Link>
            <Link to="/mobile/matches" className={`mb-nav-item ${location.pathname.includes('/mobile/matches') ? 'active' : ''}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span>Matches</span>
            </Link>
            <Link to="/mobile/wallet" className={`mb-nav-item ${location.pathname.includes('/mobile/wallet') ? 'active' : ''}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              <span>Shop</span>
            </Link>
            <Link to="/mobile/profile" className={`mb-nav-item ${location.pathname.includes('/mobile/profile') ? 'active' : ''}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill={location.pathname.includes('/mobile/profile') ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span>Profile</span>
            </Link>
          </nav>
        )}
      </div>
    </div>
  )
}
