import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'
import './AboutPage.css'

const principles = [
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
    title: 'Innovation',
    desc: 'Pursuing smart court technology and scientific training to open the boundaries of training.',
    stat: '12+',
    statLabel: 'Patents Enrolled',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    title: 'Community',
    desc: 'Building an ecosystem where athletes and professionals connect, compete and elevate each other.',
    stat: '500k',
    statLabel: 'Active Athletes',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    title: 'Performance',
    desc: 'Delivering measurable results through premium facilities designed for optimal athletic output.',
    stat: '2M+',
    statLabel: 'Premium Logins',
  },
]

const journey = [
  { label: 'World-Class Venues', tag: 'VENUES', image: 'https://images.unsplash.com/photo-1544919982-b61976f0ba43?w=800&q=80', large: true },
  { label: 'Data-Driven Excellence', tag: 'TECH', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80', large: false },
  { label: 'Global Tournaments', tag: 'EVENTS', image: 'https://images.unsplash.com/photo-1540747913346-19212a4f5db4?w=600&q=80', large: false },
]

export default function AboutPage() {
  return (
    <div className="about-page">
      <Navbar theme="dark" />

      {/* ── Hero ── */}
      <section className="about-hero">
        <div className="about-hero__bg" />
        <div className="about-hero__content container animate-fade-up">
          <h1 className="about-hero__title">
            Redefining the Future of<br />Athletic Performance.
          </h1>
          <p className="about-hero__subtitle">
            We bridge the gap between human potential and technological precision,
            engineering environments where elite athletes are forged.
          </p>
        </div>
      </section>

      {/* ── Our Journey ── */}
      <section className="journey">
        <div className="container">
          <h2 className="section-title journey__title">Our Journey</h2>
          <div className="journey__grid">
            {journey.map((item) => (
              <div key={item.label} className={`journey-card ${item.large ? 'journey-card--large' : ''}`}>
                <img src={item.image} alt={item.label} className="journey-card__img" />
                <div className="journey-card__overlay">
                  <span className="journey-card__tag">{item.tag}</span>
                  <p className="journey-card__label">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Core Principles ── */}
      <section className="principles">
        <div className="container">
          <div className="principles__header">
            <h2 className="section-title">Core Principles</h2>
            <p className="section-subtitle">The foundations that drive our commitment to athletic supremacy.</p>
          </div>
          <div className="principles__grid">
            {principles.map((p) => (
              <div key={p.title} className="principle-card">
                <div className="principle-card__icon">{p.icon}</div>
                <h3 className="principle-card__title">{p.title}</h3>
                <p className="principle-card__desc">{p.desc}</p>
                <div className="principle-card__stat">
                  <span className="principle-card__stat-num">{p.stat}</span>
                  <span className="principle-card__stat-label">{p.statLabel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Global Operations ── */}
      <section className="global-ops">
        <div className="container">
          <h2 className="global-ops__title">Global Operations</h2>
          <p className="global-ops__subtitle">Operating across 14 countries, delivering consistent, elite-tier athletic infrastructure worldwide.</p>
          <div className="global-ops__map">
            <div className="global-ops__network-text">NETWORK ACTIVE</div>
            <div className="global-ops__dots">
              {[...Array(40)].map((_, i) => (
                <div key={i} className="global-dot" style={{ animationDelay: `${i * 0.08}s` }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer variant="dark" />
    </div>
  )
}
