import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './ShopLayout.css'

const navLinks = [
  { path: '/shop', label: 'Shop' },
  { path: '/shop/performance', label: 'Performance' },
  { path: '/shop/collections', label: 'Collections' },
  { path: '/shop/new', label: 'New Arrivals' },
]

export default function ShopLayout({ children, showFlashBanner = false, darkHeader = false }) {
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [cartCount] = useState(2)
  const isActive = (path) => path === '/shop' ? location.pathname === '/shop' : location.pathname.startsWith(path)

  return (
    <div className={`shop-layout ${darkHeader ? 'shop-layout--dark' : ''}`}>
      {showFlashBanner && (
        <div className="shop-flash-banner">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          <span>FLASH SALE: Up to 40% off Elite Performance Gear. Ends in <strong>04:23:59</strong>.</span>
          <a href="#" className="shop-flash-banner__link">Shop Now</a>
        </div>
      )}
      <header className={`shop-header ${darkHeader ? 'shop-header--dark' : ''}`}>
        <Link to="/shop" className="shop-header__logo">
          <span className={`shop-logo-pro ${darkHeader ? 'shop-logo-pro--dark' : ''}`}>PRO</span>
          <span className="shop-logo-dash">-</span>
          <span className={`shop-logo-sport ${darkHeader ? 'shop-logo-sport--dark' : ''}`}>SPORT</span>
        </Link>
        <nav className="shop-header__nav">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path} className={`shop-nav-link ${darkHeader ? 'shop-nav-link--dark' : ''} ${isActive(link.path) ? 'shop-nav-link--active' : ''}`}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="shop-header__search-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Search gear..." id="shop-search" value={search} onChange={e => setSearch(e.target.value)} className="shop-header__search" />
        </div>
        <div className="shop-header__actions">
          <button className={`shop-icon-btn ${darkHeader ? 'shop-icon-btn--dark' : ''}`} aria-label="Wishlist">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
          <Link to="/shop/cart" className={`shop-icon-btn ${darkHeader ? 'shop-icon-btn--dark' : ''}`} aria-label="Cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            {cartCount > 0 && <span className="shop-cart-badge">{cartCount}</span>}
          </Link>
          <button className={`shop-icon-btn ${darkHeader ? 'shop-icon-btn--dark' : ''}`} aria-label="Account">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </button>
          <Link to="/shop/cart" className={`shop-cart-btn ${darkHeader ? 'shop-cart-btn--dark' : ''}`}>Cart</Link>
          {!darkHeader && <Link to="/login" className="shop-signin-btn">Sign In</Link>}
        </div>
      </header>
      <main className="shop-main">{children}</main>
      <footer className={`shop-footer ${darkHeader ? 'shop-footer--dark' : ''}`}>
        <div className="shop-footer__brand">
          <div className="shop-footer__logo">PRO-SPORT</div>
          <p className="shop-footer__tagline">Engineered for Elite Performance. Pushing the boundaries of athletic technology.</p>
        </div>
        <div className="shop-footer__col">
          <p className="shop-footer__col-title">COMPANY</p>
          <a href="#">About Us</a><a href="#">Find a Store</a><a href="#">Careers</a>
        </div>
        <div className="shop-footer__col">
          <p className="shop-footer__col-title">SUPPORT</p>
          <a href="#">Help Center</a><a href="#">Shipping &amp; Returns</a><a href="#">Contact Us</a>
        </div>
        <div className="shop-footer__col">
          <p className="shop-footer__col-title">LEGAL</p>
          <a href="#">Privacy Policy</a><a href="#">Terms of Service</a>
        </div>
        <div className="shop-footer__bottom">
          <p>© 2024 PRO-SPORT. Engineered for Elite Performance.</p>
          <div className="shop-footer__social">
            <a href="#">Twitter</a><a href="#">Instagram</a><a href="#">YouTube</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
