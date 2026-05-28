import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import MatchProLayout from '../../layouts/MatchProLayout'
import './MatchProFeedPage.css'

const sportFilters = ['All Sports', 'Tennis', 'Padel', 'Basketball', 'Badminton', 'Soccer', 'Squash']

const matches = [
  { id: 1, host: 'Alex Mercer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80', level: 'Intermediate', sport: 'Padel', location: 'Downtown Sports Complex', time: 'Today, 6:00 PM', slots: '2 SLOTS LEFT', slotsColor: '#f59e0b', sport_icon: '🏸' },
  { id: 2, host: 'Sarah Jenkins', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80', level: 'Advanced', sport: 'Tennis', location: 'Westside Club Courts', time: 'Tomorrow, 8:00 AM', slots: '1 SLOT LEFT', slotsColor: '#ef4444', sport_icon: '🎾' },
  { id: 3, host: 'Marcus T.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80', level: 'Beginner', sport: 'Basketball', location: 'City Sports Hub', time: 'Sat, Jun 1 · 3PM', slots: '3 SLOTS LEFT', slotsColor: '#22c55e', sport_icon: '🏀' },
  { id: 4, host: 'Elena R.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80', level: 'Advanced', sport: 'Badminton', location: 'Champions Hall C', time: 'Sun, Jun 2 · 9AM', slots: '1 SLOT LEFT', slotsColor: '#ef4444', sport_icon: '🏸' },
  { id: 5, host: 'James L.', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&q=80', level: 'Pro', sport: 'Squash', location: 'Squash Palace Court 2', time: 'Mon, Jun 3 · 7AM', slots: '1 SLOT LEFT', slotsColor: '#ef4444', sport_icon: '🟡' },
  { id: 6, host: 'Mia S.', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&q=80', level: 'Intermediate', sport: 'Tennis', location: 'Rooftop Courts', time: 'Tue, Jun 4 · 6PM', slots: '2 SLOTS LEFT', slotsColor: '#f59e0b', sport_icon: '🎾' },
]

const nearbyPlayers = [
  { name: 'Marcus T.', dist: '0.5 km', sport: 'Tennis', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80', online: true },
  { name: 'Elena R.', dist: '1.2 km', sport: 'Padel', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80', online: true },
  { name: 'James L.', dist: '2.0 km', sport: 'Squash', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&q=80', online: false },
]

const leaderboard = [
  { rank: 1, name: 'David K.', pts: '2,450 pts', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80' },
  { rank: 2, name: 'Jessica W.', pts: '2,100 pts', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&q=80' },
  { rank: 3, name: 'Marcus T.', pts: '1,980 pts', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80' },
]

export default function MatchProFeedPage() {
  const [activeFilter, setActiveFilter] = useState('All Sports')
  const [joined, setJoined] = useState([])
  const pageRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.mp-feed-banner', { opacity: 0, y: 20, duration: 0.7, ease: 'power3.out' })
      gsap.from('.mp-match-card', { opacity: 0, y: 40, stagger: 0.08, duration: 0.5, ease: 'power2.out', delay: 0.3 })
      gsap.from('.mp-panel-card', { opacity: 0, x: 30, stagger: 0.1, duration: 0.5, ease: 'power2.out', delay: 0.4 })
    }, pageRef)
    return () => ctx.revert()
  }, [])

  const filtered = matches.filter(m => activeFilter === 'All Sports' || m.sport === activeFilter)

  const handleJoin = (id, e) => {
    e.preventDefault()
    if (!joined.includes(id)) {
      setJoined(prev => [...prev, id])
      gsap.from(`#join-btn-${id}`, { scale: 0.8, duration: 0.3, ease: 'back.out(1.7)' })
    }
  }

  return (
    <MatchProLayout>
      <div className="mp-page-with-sidebar" ref={pageRef}>
        {/* Left sidebar */}
        <aside className="mp-sidebar">
          <div className="mp-sidebar__user">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80" alt="You" className="mp-sidebar__avatar" />
            <p className="mp-sidebar__user-name">Pro Matcher</p>
            <p className="mp-sidebar__user-tier">⚡ Elite Rank · 1,540 pts</p>
          </div>
          <div className="mp-sidebar__nav">
            <Link to="/matches" className="mp-sidebar-link mp-sidebar-link--active">
              <span>📈</span><span>Trending Matches</span>
            </Link>
            <Link to="/matches/nearby" className="mp-sidebar-link">
              <span>📍</span><span>Nearby Sports</span>
            </Link>
            <Link to="/matches/community" className="mp-sidebar-link">
              <span>👥</span><span>Community Hub</span>
            </Link>
            <Link to="/matches/leaderboard" className="mp-sidebar-link">
              <span>🏆</span><span>Leaderboards</span>
            </Link>
          </div>
          <Link to="/matches/create" className="mp-create-btn">+ Create Match</Link>
          <div className="mp-sidebar__stats">
            <div className="mp-sidebar__stat"><span>12</span><small>Matches</small></div>
            <div className="mp-sidebar__stat"><span>8</span><small>Won</small></div>
            <div className="mp-sidebar__stat"><span>67%</span><small>Win Rate</small></div>
          </div>
        </aside>

        {/* Main feed */}
        <div className="mp-content">
          {/* Hero banner */}
          <div className="mp-feed-banner">
            <img src="https://images.unsplash.com/photo-1546519638405-a9f1558b3cba?w=900&q=80" alt="Match" className="mp-feed-banner__img" />
            <div className="mp-feed-banner__overlay">
              <span className="mp-feed-banner__tag">● TRENDING NOW</span>
              <h2 className="mp-feed-banner__title">Pro-Am Padel Championship Qualifiers</h2>
              <div className="mp-feed-banner__meta">
                <span>📍 Midtown Court</span>
                <span>🕐 Starts in 2h</span>
                <span>👥 48 registered</span>
              </div>
              <button className="btn-primary mp-feed-banner__cta">View Tournament →</button>
            </div>
          </div>

          {/* Sport filters */}
          <div className="mp-sport-filters">
            {sportFilters.map(f => (
              <button key={f} className={`mp-sport-filter ${activeFilter === f ? 'mp-sport-filter--active' : ''}`} onClick={() => setActiveFilter(f)}>{f}</button>
            ))}
          </div>

          {/* Section header */}
          <div className="mp-section-header">
            <h2 className="mp-section-title">Open Matches</h2>
            <span className="mp-section-count">{filtered.length} available</span>
          </div>

          {/* Match cards */}
          <div className="mp-match-grid">
            {filtered.map(m => (
              <div key={m.id} className="mp-match-card">
                <div className="mp-match-card__sport-bar" />
                <div className="mp-match-card__header">
                  <img src={m.avatar} alt={m.host} className="mp-match-card__avatar" />
                  <div className="mp-match-card__host-info">
                    <p className="mp-match-card__host">{m.host}</p>
                    <p className="mp-match-card__role">Host</p>
                    <p className="mp-match-card__sport">{m.sport_icon} {m.level} · {m.sport}</p>
                  </div>
                  <span className="mp-match-card__slots" style={{ background: m.slotsColor + '22', color: m.slotsColor }}>{m.slots}</span>
                </div>
                <div className="mp-match-card__info">
                  <span>📍 {m.location}</span>
                  <span>🕐 {m.time}</span>
                </div>
                <button
                  id={`join-btn-${m.id}`}
                  className={`mp-match-card__join btn-primary ${joined.includes(m.id) ? 'joined' : ''}`}
                  onClick={(e) => handleJoin(m.id, e)}
                >
                  {joined.includes(m.id) ? '✓ Request Sent' : 'Join Match'}
                </button>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="mp-empty">
              <span>🏃</span>
              <p>No matches available for this sport filter.</p>
              <button className="btn-primary" onClick={() => setActiveFilter('All Sports')}>Show All</button>
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="mp-right-panel">
          <div className="mp-panel-card">
            <div className="mp-panel-card__header">
              <h3>Nearby Players</h3>
              <Link to="/matches/nearby" className="mp-panel-link">View Map →</Link>
            </div>
            {nearbyPlayers.map(p => (
              <div key={p.name} className="mp-nearby-player">
                <div className="mp-nearby-player__avatar-wrap">
                  <img src={p.avatar} alt={p.name} className="mp-nearby-player__avatar" />
                  {p.online && <span className="mp-online-dot" />}
                </div>
                <div className="mp-nearby-player__info">
                  <p className="mp-nearby-player__name">{p.name}</p>
                  <p className="mp-nearby-player__dist">{p.sport} · {p.dist}</p>
                </div>
                <button className="mp-add-btn" aria-label="Challenge">⚡</button>
              </div>
            ))}
          </div>

          <div className="mp-panel-card">
            <div className="mp-panel-card__header">
              <h3>🏆 Top Players</h3>
              <Link to="/matches/leaderboard" className="mp-panel-link">Full Board →</Link>
            </div>
            {leaderboard.map((p, i) => (
              <div key={p.name} className="mp-leaderboard-row">
                <span className="mp-leaderboard-rank" style={{ color: i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : '#cd7c3a' }}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                </span>
                <img src={p.avatar} alt={p.name} className="mp-nearby-player__avatar" />
                <p className="mp-leaderboard-name">{p.name}</p>
                <p className="mp-leaderboard-pts">{p.pts}</p>
              </div>
            ))}
          </div>

          <div className="mp-panel-card mp-quick-links">
            <h3 className="mp-panel-card__small-title">Quick Links</h3>
            <Link to="/matches/community" className="mp-quick-link">👥 Community Hub</Link>
            <Link to="/apex/booking" className="mp-quick-link">📅 Book a Court</Link>
            <Link to="/apex/shop" className="mp-quick-link">🛍️ Gear Shop</Link>
          </div>
        </div>
      </div>
    </MatchProLayout>
  )
}
