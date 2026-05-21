import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'
import './HomePage.css'

const brands = ['APEXGEAR', 'NEXUSCOURTS', 'VELOCITYATHLETICS', 'PRIMEFIT']

const facilities = [
  {
    id: 1,
    name: 'The Apex Pavilion',
    sub: 'Multi-Sport Complex • 4 Courts',
    tag: 'OPEN',
    image: 'https://images.unsplash.com/photo-1544919982-b61976f0ba43?w=800&q=80',
    large: true,
  },
  {
    id: 2,
    name: 'Summit Arena',
    sub: 'Featured Pro',
    image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=600&q=80',
    large: false,
  },
  {
    id: 3,
    name: 'View All 42 Facilities',
    sub: 'Explore the full network',
    isViewAll: true,
    image: 'https://images.unsplash.com/photo-1551958219-acbc595b39c6?w=600&q=80',
    large: false,
  },
]

export default function HomePage() {
  return (
    <div className="home">
      <Navbar theme="light" />

      {/* ── Hero ── */}
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__content animate-fade-up">
            <p className="hero__eyebrow">Elevating Athletic Performance</p>
            <h1 className="hero__title">
              FLUID<br />PERFORMANCE.<br />ELITE CONTROL.
            </h1>
            <p className="hero__desc">
              The premier management platform for athletes and facilities.
              Book courts, schedule matches, and access pro-tier gear with
              seamless precision.
            </p>
            <div className="hero__actions">
              <Link to="/register" className="btn-primary hero__btn-main">
                Start Free Journey →
              </Link>
              <Link to="/courts" className="btn-outline hero__btn-alt">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                Watch Platform Demo
              </Link>
            </div>
          </div>

          <div className="hero__visual animate-fade">
            <div className="hero__img-wrap">
              <img
                src="https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&q=80"
                alt="Pro tennis player"
                className="hero__img"
              />
              {/* Card overlay */}
              <div className="hero__card">
                <div className="hero__card-left">
                  <span className="hero__card-dot" />
                  <div>
                    <p className="hero__card-name">Pro Arena Alpha</p>
                    <p className="hero__card-meta">4.9 ★ · 11 Reviews</p>
                  </div>
                </div>
                <Link to="/courts" className="btn-primary hero__card-btn">Available Now</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trusted By ── */}
      <section className="trusted">
        <div className="container">
          <p className="trusted__label">TRUSTED BY ELITE FACILITIES & BRANDS</p>
          <div className="trusted__logos">
            {brands.map(b => (
              <span key={b} className="trusted__brand">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Elite Facilities ── */}
      <section className="facilities">
        <div className="container">
          <div className="facilities__header">
            <div>
              <h2 className="section-title">Elite Facilities</h2>
              <p className="section-subtitle">Book premium courts across the network.</p>
            </div>
            <div className="facilities__nav">
              <button className="facilities__nav-btn" aria-label="Previous">‹</button>
              <button className="facilities__nav-btn" aria-label="Next">›</button>
            </div>
          </div>

          <div className="facilities__grid">
            {facilities.map(f => (
              <div key={f.id} className={`facility-card ${f.large ? 'facility-card--large' : ''} ${f.isViewAll ? 'facility-card--viewall' : ''}`}>
                <img src={f.image} alt={f.name} className="facility-card__img" />
                <div className="facility-card__overlay">
                  {f.tag && <span className="facility-card__tag">{f.tag}</span>}
                  <div>
                    <p className="facility-card__name">{f.name}</p>
                    <p className="facility-card__sub">{f.sub}</p>
                  </div>
                  {f.large && (
                    <Link to="/courts" className="btn-primary facility-card__btn">Book Now</Link>
                  )}
                  {f.isViewAll && (
                    <Link to="/courts" className="facility-card__viewall-link">
                      Explore the network →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer variant="light" />
    </div>
  )
}
