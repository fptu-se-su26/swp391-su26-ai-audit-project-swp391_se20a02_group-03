import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer({ variant = 'light' }) {
  return (
    <footer className={`footer footer--${variant}`}>
      <div className="footer__top container">
        {/* Brand */}
        <div className="footer__brand">
          <div className="footer__logo">
            <span className="logo-pro">PRO</span><span className="logo-dash">-</span><span className="logo-sport">SPORT</span>
          </div>
          <p className="footer__tagline">
            Elevating athletic achievement<br />
            through precision engineering and<br />
            border-defying settings.
          </p>
        </div>

        {/* Platform */}
        <div className="footer__col">
          <h4 className="footer__col-title">PLATFORM</h4>
          <ul>
            <li><Link to="/">Discover</Link></li>
            <li><Link to="/about">Brand Mission</Link></li>
            <li><Link to="/courts">Country</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div className="footer__col">
          <h4 className="footer__col-title">LEGAL</h4>
          <ul>
            <li><Link to="#">Privacy Policy</Link></li>
            <li><Link to="#">Terms of Service</Link></li>
            <li><Link to="#">Sitemap</Link></li>
          </ul>
        </div>

        {/* Connect */}
        <div className="footer__col">
          <h4 className="footer__col-title">CONNECT</h4>
          <ul className="footer__social">
            <li>
              <a href="#" aria-label="Twitter" className="footer__social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
              </a>
            </li>
            <li>
              <a href="#" aria-label="Instagram" className="footer__social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
            </li>
            <li>
              <a href="#" aria-label="LinkedIn" className="footer__social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </li>
          </ul>
          {variant === 'dark' && (
            <div className="footer__newsletter">
              <input type="email" placeholder="Email" id="newsletter-email" />
              <button className="btn-primary" aria-label="Subscribe">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="footer__bottom container">
        <p>© 2024 PRO-SPORT COMPLEX. Engineered for Elite Performance.</p>
        {variant === 'light' && (
          <div className="footer__bottom-links">
            <Link to="#">About Us</Link>
            <Link to="#">Terms of Service</Link>
            <Link to="#">Privacy Policy</Link>
            <Link to="/contact">Contact Support</Link>
            <Link to="#">Partner Program</Link>
          </div>
        )}
      </div>
    </footer>
  )
}
