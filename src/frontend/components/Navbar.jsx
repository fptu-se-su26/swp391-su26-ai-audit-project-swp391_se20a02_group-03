import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

export default function Navbar({ theme = 'light' }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { label: 'Home',      path: '/' },
    { label: 'Courts',    path: '/courts' },
    { label: 'Matches',   path: '/matches' },
    { label: 'Gear',      path: '/gear' },
    { label: 'About',     path: '/about' },
    { label: 'Contact',   path: '/contact' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className={`navbar navbar--${theme}`}>
      <div className="navbar__inner container">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <span className="logo-pro">PRO</span>
          <span className="logo-dash">-</span>
          <span className="logo-sport">SPORT</span>
        </Link>

        {/* Links */}
        <ul className={`navbar__links ${menuOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`navbar__link ${isActive(link.path) ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="navbar__actions">
          <Link to="/login" className="navbar__login">Login</Link>
          <Link to="/register" className="btn-primary navbar__cta">Join Pro</Link>
        </div>

        {/* Hamburger */}
        <button
          className={`navbar__hamburger ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  )
}
