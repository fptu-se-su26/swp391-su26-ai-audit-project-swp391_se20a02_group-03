import MobileLayout from '../../layouts/MobileLayout'
import './MobileHomePage.css'

export default function MobileHomePage() {
  return (
    <MobileLayout>
      <div className="mob-home">
        
        {/* Hero Banner */}
        <div className="mh-hero">
          <div className="mh-hero-img-wrap">
            <img src="https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=600&q=80" alt="Tennis Court" className="mh-hero-img" />
            <div className="mh-hero-overlay">
              <span className="mh-live-badge">LIVE NOW</span>
              <span className="mh-event-name">City Open 2024</span>
              <h2 className="mh-hero-title">Quarter Finals</h2>
              <p className="mh-hero-sub">Watch live or join the conversation.</p>
            </div>
          </div>
        </div>

        <div className="mh-content">
          {/* Search */}
          <div className="mh-search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Find players, groups, or courts..." />
          </div>

          {/* Filters */}
          <div className="mh-filters">
            <button className="mh-filter-btn active">Padel</button>
            <button className="mh-filter-btn">Tennis</button>
            <button className="mh-filter-btn">Squash</button>
            <button className="mh-filter-btn">Golf</button>
          </div>

          {/* Active Groups */}
          <section className="mh-section">
            <div className="mh-section-header">
              <h3 className="mh-section-title">Active Groups</h3>
              <span className="mh-view-all">View All</span>
            </div>
            
            <div className="mh-group-list">
              <div className="mh-group-card">
                <img src="https://images.unsplash.com/photo-1622227432807-91eb590c31ab?w=100&q=80" alt="Group" className="mh-group-img" />
                <div className="mh-group-info">
                  <h4 className="mh-group-name">Northside Padel Pros</h4>
                  <p className="mh-group-sub">42 members • Advanced</p>
                  <div className="mh-group-avatars">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&q=80" alt="A" className="mh-g-avatar" />
                    <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&q=80" alt="A" className="mh-g-avatar" />
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&q=80" alt="A" className="mh-g-avatar" />
                    <span className="mh-g-more">+39</span>
                  </div>
                </div>
                <div className="mh-group-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>

              <div className="mh-group-card">
                <img src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=100&q=80" alt="Group" className="mh-group-img" />
                <div className="mh-group-info">
                  <h4 className="mh-group-name">Downtown Tennis Club</h4>
                  <p className="mh-group-sub">128 members • All Levels</p>
                  <div className="mh-group-avatars">
                    <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=40&q=80" alt="A" className="mh-g-avatar" />
                    <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&q=80" alt="A" className="mh-g-avatar" />
                    <span className="mh-g-more">+126</span>
                  </div>
                </div>
                <div className="mh-group-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              </div>
            </div>
          </section>

          {/* Nearby Players */}
          <section className="mh-section">
            <div className="mh-section-header">
              <h3 className="mh-section-title">Nearby Players</h3>
              <span className="mh-distance"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> 5km</span>
            </div>

            <div className="mh-players-scroll">
              <div className="mh-player-card">
                <div className="mh-player-avatar-wrap">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" alt="Alex" className="mh-player-avatar" />
                  <span className="mh-status online"></span>
                </div>
                <h4 className="mh-player-name">Alex Mercer</h4>
                <p className="mh-player-level">Padel • Level 4.5</p>
                <p className="mh-player-bio">Looking for a match this weekend. Usually plays at Northside.</p>
                <div className="mh-player-actions">
                  <button className="btn-mob-primary">Connect</button>
                  <button className="btn-mob-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></button>
                </div>
              </div>

              <div className="mh-player-card">
                <div className="mh-player-avatar-wrap">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" alt="Sarah" className="mh-player-avatar" />
                  <span className="mh-status offline"></span>
                </div>
                <h4 className="mh-player-name">Sarah Jenkins</h4>
                <p className="mh-player-level">Tennis • Casual</p>
                <p className="mh-player-bio">Casual hitter. Free on weekday evenings.</p>
                <div className="mh-player-actions">
                  <button className="btn-mob-primary">Connect</button>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </MobileLayout>
  )
}
