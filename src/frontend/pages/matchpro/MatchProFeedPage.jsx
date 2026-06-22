import { useState } from 'react'
import { Link } from 'react-router-dom'
import MatchProLayout from '../../layouts/MatchProLayout'
import './MatchProFeedPage.css'

const sidebarLinks = [
  { label: 'Trending Matches', icon: '📈', active: true },
  { label: 'Nearby Sports', icon: '📍' },
  { label: 'Community Hub', icon: '👥' },
  { label: 'Leaderboards', icon: '🏆' },
  { label: 'Settings', icon: '⚙️' },
]

const sportFilters = ['All Sports', 'Pickleball', 'Pickleball', 'Badminton', 'Pickleball']

const matches = [
  {
    id: 1,
    host: 'Alex Mercer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80',
    level: 'Intermediate',
    sport: 'Pickleball',
    location: 'Downtown Sports Complex',
    time: 'Today, 6:00 PM',
    slots: '2 SLOTS LEFT',
    slotsColor: '#f59e0b',
  },
  {
    id: 2,
    host: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80',
    level: 'Advanced',
    sport: 'Pickleball',
    location: 'Westside Club Courts',
    time: 'Tomorrow, 8:00 AM',
    slots: '1 SLOT LEFT',
    slotsColor: '#ef4444',
  },
]

const nearbyPlayers = [
  { name: 'Marcus T.', dist: '0.5 miles away', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80', online: true },
  { name: 'Elena R.', dist: '1.2 miles away', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80', online: true },
]

const leaderboard = [
  { rank: 1, name: 'David K.', pts: '2,450 pts', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80' },
  { rank: 2, name: 'Jessica W.', pts: '2,100 pts', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&q=80' },
]

export default function MatchProFeedPage() {
  const [activeFilter, setActiveFilter] = useState('All Sports')

  return (
    <MatchProLayout>
      <div className="mp-page-with-sidebar">
        {/* Left sidebar */}
        <aside className="mp-sidebar">
          <div className="mp-sidebar__user">
            <p className="mp-sidebar__user-name">Pro Matcher</p>
            <p className="mp-sidebar__user-tier">Elite Rank</p>
          </div>
          <div className="mp-sidebar__nav">
            {sidebarLinks.map(link => (
              <a key={link.label} href="#" className={`mp-sidebar-link ${link.active ? 'mp-sidebar-link--active' : ''}`}>
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </a>
            ))}
          </div>
          <Link to="/matchpro/match/create" className="mp-create-btn">+ Create Match</Link>
        </aside>

        {/* Main content */}
        <div className="mp-content">
          {/* Hero banner */}
          <div className="mp-feed-banner">
            <img src="https://images.unsplash.com/photo-1546519638405-a9f1558b3cba?w=900&q=80" alt="Match" className="mp-feed-banner__img" />
            <div className="mp-feed-banner__overlay">
              <span className="mp-feed-banner__tag">● TRENDING NOW</span>
              <h2 className="mp-feed-banner__title">Pro-Am Pickleball Championship Qualifiers</h2>
              <div className="mp-feed-banner__meta">
                <span>📍 Midtown Court</span>
                <span>🕐 Starts in 2h</span>
              </div>
            </div>
          </div>

          {/* Sport filters */}
          <div className="mp-sport-filters">
            {sportFilters.map(f => (
              <button
                key={f}
                className={`mp-sport-filter ${activeFilter === f ? 'mp-sport-filter--active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >{f}</button>
            ))}
          </div>

          {/* Match cards */}
          <div className="mp-match-grid">
            {matches.map(m => (
              <Link to={`/matchpro/match/${m.id}`} key={m.id} className="mp-match-card">
                <div className="mp-match-card__header">
                  <img src={m.avatar} alt={m.host} className="mp-match-card__avatar" />
                  <div>
                    <p className="mp-match-card__host">{m.host}</p>
                    <p className="mp-match-card__role">Host</p>
                    <p className="mp-match-card__sport">{m.level} • {m.sport}</p>
                  </div>
                  <span className="mp-match-card__slots" style={{background: m.slotsColor + '22', color: m.slotsColor}}>{m.slots}</span>
                </div>
                <div className="mp-match-card__info">
                  <span>📍 {m.location}</span>
                  <span>🕐 {m.time}</span>
                </div>
                <button className="mp-match-card__join btn-primary">Join Match</button>
              </Link>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="mp-right-panel">
          <div className="mp-panel-card">
            <div className="mp-panel-card__header">
              <h3>Nearby Players</h3>
              <button className="mp-icon-btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg></button>
            </div>
            {nearbyPlayers.map(p => (
              <div key={p.name} className="mp-nearby-player">
                <div className="mp-nearby-player__avatar-wrap">
                  <img src={p.avatar} alt={p.name} className="mp-nearby-player__avatar" />
                  {p.online && <span className="mp-online-dot" />}
                </div>
                <div className="mp-nearby-player__info">
                  <p className="mp-nearby-player__name">{p.name}</p>
                  <p className="mp-nearby-player__dist">{p.dist}</p>
                </div>
                <button className="mp-add-btn" aria-label="Add friend">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                </button>
              </div>
            ))}
          </div>

          <div className="mp-panel-card" style={{marginTop: '16px'}}>
            <div className="mp-panel-card__header">
              <h3>Leaderboard</h3>
              <span>🏆</span>
            </div>
            {leaderboard.map((p, i) => (
              <div key={p.name} className="mp-leaderboard-row">
                <span className="mp-leaderboard-rank" style={{color: i === 0 ? '#f59e0b' : '#64748b'}}>{p.rank}</span>
                <img src={p.avatar} alt={p.name} className="mp-nearby-player__avatar" />
                <p className="mp-leaderboard-name">{p.name}</p>
                <p className="mp-leaderboard-pts">{p.pts}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MatchProLayout>
  )
}
