import { Link, useLocation } from 'react-router-dom'
import './GearLayout.css'

const navLinks = [
  { path: '/gear/dashboard', label: 'Dashboard' },
  { path: '/gear/rentals', label: 'Rentals' },
  { path: '/gear/catalog', label: 'Catalog' },
]

export default function GearLayout({ children }) {
  const location = useLocation()
  const isActive = (path) => location.pathname.startsWith(path)

  return (
    <div className="gear-layout">
      <header className="gear-header">
        <Link to="/gear/catalog" className="gear-header__logo">
          <span className="gear-logo-pro">PRO</span><span className="gear-logo-dash">-</span><span className="gear-logo-sport">SPORT</span>
        </Link>
        <div className="gear-header__search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Search equipment..." id="gear-search" />
        </div>
        <nav className="gear-header__nav">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path} className={`gear-nav-link ${isActive(link.path) ? 'gear-nav-link--active' : ''}`}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="gear-header__actions">
          <button className="gear-icon-btn" aria-label="Cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </button>
          <button className="gear-icon-btn" aria-label="Notifications">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </button>
          <button className="gear-icon-btn" aria-label="Profile">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </button>
        </div>
      </header>
      <main className="gear-main">{children}</main>
      <footer className="gear-footer">
        <div className="gear-footer__brand">
          <span className="gear-logo-pro">PRO</span><span className="gear-logo-dash">-</span><span className="gear-logo-sport">SPORT</span>
        </div>
        <nav className="gear-footer__links">
          <a href="#">Equipment Catalog</a>
          <a href="#">Rental Terms</a>
          <a href="#">Maintenance Tracking</a>
          <a href="#">Support Hub</a>
          <a href="#">Privacy Policy</a>
        </nav>
        <p className="gear-footer__copy">© 2024 PRO-SPORT Performance Systems. Engineered for Elite Athletes.</p>
      </footer>
    </div>
  )
}
