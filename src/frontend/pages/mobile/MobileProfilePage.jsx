import MobileLayout from '../../layouts/MobileLayout'
import './MobileProfilePage.css'

export default function MobileProfilePage() {
  return (
    <MobileLayout title="Profile">
      <div className="mob-profile">
        {/* Header Profile Info */}
        <div className="mp-header">
          <div className="mp-header-bg">
            <div className="mp-badge-elite">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              Elite Member
            </div>
          </div>
          
          <div className="mp-avatar-container">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" alt="Alex Mercer" className="mp-avatar" />
          </div>

          <h2 className="mp-name">Alex Mercer</h2>
          <p className="mp-location">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            San Francisco, CA
          </p>

          <div className="mp-header-actions">
            <button className="btn-mp-edit">Edit Profile</button>
            <button className="btn-mp-settings">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mp-stats-grid">
          <div className="mp-stat-box">
            <span className="mp-stat-label">MATCHES</span>
            <span className="mp-stat-val">142</span>
          </div>
          <div className="mp-stat-box">
            <span className="mp-stat-label">WIN RATE</span>
            <span className="mp-stat-val">68%</span>
          </div>
          <div className="mp-stat-box highlight-blue">
            <span className="mp-stat-label">SKILL LEVEL</span>
            <span className="mp-stat-val">4.2</span>
          </div>
          <div className="mp-stat-box highlight-gold">
            <span className="mp-stat-label">POINTS</span>
            <span className="mp-stat-val">8.5k</span>
          </div>
        </div>

        {/* Recent Matches */}
        <div className="mp-section">
          <div className="mp-section-header">
            <h3 className="mp-section-title">Recent Matches</h3>
            <span className="mp-link">View All</span>
          </div>

          <div className="mp-matches-list">
            <div className="mp-match-item">
              <div className="mp-match-date">
                <span className="mp-md-m">OCT</span>
                <span className="mp-md-d">24</span>
              </div>
              <div className="mp-match-info">
                <h4 className="mp-match-title">Singles vs. David Kim</h4>
                <p className="mp-match-sub">Downtown Sports Center • Court 2</p>
                <div className="mp-match-result win">W 6-4, 6-2</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </div>

            <div className="mp-match-item">
              <div className="mp-match-date">
                <span className="mp-md-m">OCT</span>
                <span className="mp-md-d">18</span>
              </div>
              <div className="mp-match-info">
                <h4 className="mp-match-title">Doubles Exhibition</h4>
                <p className="mp-match-sub">Bay Area Pickleball Club • Center Court</p>
                <div className="mp-match-result loss">L 4-6, 5-7</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="mp-section">
          <h3 className="mp-section-title">Achievements</h3>
          <div className="mp-ach-scroll">
            <div className="mp-ach-card">
              <div className="mp-ach-icon gold"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c0 0-4 3-4 8 0 2.2 1.8 4 4 4s4-1.8 4-4c0-5-4-8-4-8z"/><path d="M12 14c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg></div>
              <p className="mp-ach-name">10 Win Streak</p>
              <p className="mp-ach-status">UNLOCKED</p>
            </div>
            <div className="mp-ach-card">
              <div className="mp-ach-icon blue"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg></div>
              <p className="mp-ach-name">Tournament Pro</p>
              <p className="mp-ach-status">UNLOCKED</p>
            </div>
            <div className="mp-ach-card">
              <div className="mp-ach-icon gray"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
              <p className="mp-ach-name">Social Butterfly</p>
              <p className="mp-ach-status">UNLOCKED</p>
            </div>
          </div>
        </div>

        {/* Wallet Summary */}
        <div className="mp-wallet-card">
          <div className="mp-wallet-top">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            Wallet
          </div>
          <div className="mp-wallet-balance-box">
            <p className="mp-wb-label">AVAILABLE BALANCE</p>
            <h2 className="mp-wb-val">$240.50</h2>
          </div>
          
          <div className="mp-perks">
            <div className="mp-perk-item">
              <div className="mp-perk-icon gold-bg"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8"/><path d="M8 12h8"/></svg></div>
              <div style={{ flex: 1 }}>
                <p className="mp-perk-title">Pro Shop Discount</p>
                <p className="mp-perk-sub">Expires in 3 days</p>
              </div>
              <span className="mp-perk-val gold-text">-15%</span>
            </div>
            <div className="mp-perk-item">
              <div className="mp-perk-icon cyan-bg"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg></div>
              <div style={{ flex: 1 }}>
                <p className="mp-perk-title">Free Court Hour</p>
                <p className="mp-perk-sub">Valid at Main St. Club</p>
              </div>
              <span className="mp-perk-val cyan-text">1x</span>
            </div>
          </div>
          
          <button className="btn-mp-funds">Add Funds</button>
        </div>

        {/* Menu Items */}
        <div className="mp-menu">
          <div className="mp-menu-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span>Account Details</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
          <div className="mp-menu-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            <span>Payment Methods</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
          <div className="mp-menu-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <span>Notifications</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </div>

      </div>
    </MobileLayout>
  )
}
