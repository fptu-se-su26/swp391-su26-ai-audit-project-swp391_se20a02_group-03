import { Link } from 'react-router-dom'
import MatchProLayout from '../../layouts/MatchProLayout'
import './MatchProProfilePage.css'

const metrics = [
  { label: 'WIN RATE', value: '68%', color: '#0d8a8a' },
  { label: 'MATCHES', value: '142', color: '#0d2d3a' },
  { label: 'RATING', value: '4.9★', color: '#f59e0b' },
  { label: 'MVP', value: '24', color: '#0d2d3a' },
]

const specialties = ['Tennis', 'Basketball', 'Swimming']

const achievements = [
  { icon: '🏆', title: "Tournament Champ", sub: "Summer Open '23" },
  { icon: '🔥', title: '10 Match Streak', sub: "Achieved Nov '23" },
]

const activity = [
  {
    id: 1,
    icon: '🎾',
    iconBg: '#0d8a8a',
    title: 'Won Tennis Singles Match',
    sub: 'vs. Jordan Lee • 6-4, 7-5',
    time: '2d ago',
    review: {
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80',
      text: '"Great match! Alex has an incredible serve. Looking forward to a rematch."',
      stars: 5,
    },
  },
  {
    id: 2,
    icon: '🏀',
    iconBg: '#f59e0b',
    title: 'Played 3v3 Basketball Pickup',
    sub: 'at Downtown Rec Center',
    time: '5d ago',
    tags: ['Team MVP', '12 Pts'],
  },
]

export default function MatchProProfilePage() {
  return (
    <MatchProLayout>
      <div className="mp-profile-page">
        {/* Left sidebar */}
        <aside className="mp-sidebar">
          <div className="mp-sidebar__nav">
            {[{l:'Trending Matches',i:'📈'},{l:'Nearby Sports',i:'📍'},{l:'Community Hub',i:'👥'},{l:'Leaderboards',i:'🏆'}].map(item=>(
              <a key={item.l} href="#" className="mp-sidebar-link">
                <span>{item.i}</span><span>{item.l}</span>
              </a>
            ))}
            <p className="mp-sidebar__section-label">ACCOUNT</p>
            <a href="#" className="mp-sidebar-link mp-sidebar-link--active">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span>Profile</span>
            </a>
            <a href="#" className="mp-sidebar-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
              <span>Settings</span>
            </a>
          </div>
          <Link to="/matchpro/match/create" className="mp-create-btn">+ Create Match</Link>
        </aside>

        {/* Main */}
        <div className="mp-profile-content">
          {/* Hero */}
          <div className="mp-profile-hero">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" alt="Alex" className="mp-profile-hero__avatar" />
            <div className="mp-profile-hero__info">
              <h1 className="mp-profile-hero__name">Alex Rivers</h1>
              <p className="mp-profile-hero__meta">📍 Seattle, WA • Elite Rank</p>
            </div>
            <div className="mp-profile-hero__actions">
              <button className="mp-add-friend-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                Add Friend
              </button>
              <button className="mp-msg-friend-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Message
              </button>
            </div>
          </div>

          {/* Performance & Specialties */}
          <div className="mp-profile-grid">
            <div className="mp-profile-card">
              <h3 className="mp-profile-card__title">📊 Performance Metrics</h3>
              <div className="mp-metrics-grid">
                {metrics.map(m => (
                  <div key={m.label} className="mp-metric">
                    <p className="mp-metric__label">{m.label}</p>
                    <p className="mp-metric__value" style={{color: m.color}}>{m.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mp-profile-card">
              <h3 className="mp-profile-card__title">🎯 Specialties</h3>
              <div className="mp-specialties">
                {specialties.map(s => (
                  <span key={s} className="mp-specialty-tag">{s}</span>
                ))}
              </div>
              <p className="mp-profile-card__sub">ACHIEVEMENTS</p>
              {achievements.map(a => (
                <div key={a.title} className="mp-achievement">
                  <span className="mp-achievement__icon">{a.icon}</span>
                  <div>
                    <p className="mp-achievement__title">{a.title}</p>
                    <p className="mp-achievement__sub">{a.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mp-profile-card" style={{marginTop: '20px'}}>
            <div className="mp-profile-card__header">
              <h3 className="mp-profile-card__title">🔄 Recent Activity</h3>
              <a href="#" className="mp-view-all">View All</a>
            </div>
            {activity.map(a => (
              <div key={a.id} className="mp-activity-item">
                <div className="mp-activity-icon" style={{background: a.iconBg}}>{a.icon}</div>
                <div className="mp-activity-info">
                  <p className="mp-activity-title">{a.title}</p>
                  <p className="mp-activity-sub">{a.sub}</p>
                  {a.tags && (
                    <div className="mp-activity-tags">
                      {a.tags.map(t => <span key={t} className="mp-activity-tag">{t}</span>)}
                    </div>
                  )}
                  {a.review && (
                    <div className="mp-activity-review">
                      <img src={a.review.avatar} alt="" className="mp-activity-review__avatar" />
                      <div>
                        <div className="mp-stars">{[...Array(a.review.stars)].map((_,i) => <span key={i}>⭐</span>)}</div>
                        <p className="mp-activity-review__text">{a.review.text}</p>
                      </div>
                    </div>
                  )}
                </div>
                <span className="mp-activity-time">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MatchProLayout>
  )
}
