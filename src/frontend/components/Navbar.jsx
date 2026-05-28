import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import './Navbar.css'

export default function Navbar({ theme = 'light' }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navRef = useRef(null)

  const navLinks = [
    { label: 'Home',      path: '/' },
    { label: 'Courts',    path: '/courts' },
    { label: 'Matches',   path: '/matches' },
    { label: 'Gear',      path: '/gear' },
    { label: 'About',     path: '/about' },
    { label: 'Contact',   path: '/contact' },
  ]

  const isActive = (path) => location.pathname === path

  // GSAP: slide navbar down on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Navbar bar itself
      gsap.from(navRef.current, {
        y: -70,
        opacity: 0,
        duration: 0.65,
        ease: 'power3.out',
      })

      // Stagger each nav link
      gsap.from('.navbar__link', {
        opacity: 0,
        y: -12,
        duration: 0.5,
        stagger: 0.07,
        ease: 'power2.out',
        delay: 0.3,
      })

      // Actions buttons
      gsap.from('.navbar__actions > *', {
        opacity: 0,
        x: 16,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.45,
      })
    }, navRef)

    return () => ctx.revert()
  }, [])

  return (
    <nav ref={navRef} className={`navbar navbar--${theme}`}>
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
