import EliteLayout from '../../layouts/EliteLayout'
import './EliteDashboardPage.css'

export default function EliteDashboardPage() {
  return (
    <EliteLayout>
      <div className="elite-dashboard">
        <div className="elite-page-header">
          <h1 className="elite-page-title">Overview</h1>
          <p className="elite-page-subtitle">Today's operational metrics and active tasks.</p>
        </div>

        <div className="ed-grid">
          {/* Stats Cards */}
          <div className="ed-stat-card">
            <div className="ed-stat-bg-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#f1f5f9" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <div className="ed-stat-top">
              <span className="ed-stat-label">COURT OCCUPANCY</span>
              <span className="ed-stat-trend up">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                12%
              </span>
            </div>
            <h2 className="ed-stat-value">84%</h2>
            <p className="ed-stat-sub">11 of 13 courts active</p>
          </div>

          <div className="ed-stat-card">
            <div className="ed-stat-bg-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#f1f5f9" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
            </div>
            <div className="ed-stat-top">
              <span className="ed-stat-label">ACTIVE RENTALS</span>
              <div className="ed-icon-circle bg-blue"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg></div>
            </div>
            <h2 className="ed-stat-value">42</h2>
            <p className="ed-stat-sub">Items currently out</p>
          </div>

          <div className="ed-stat-card">
            <div className="ed-stat-bg-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#f1f5f9" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            </div>
            <div className="ed-stat-top">
              <span className="ed-stat-label">DAILY REVENUE</span>
              <span className="ed-stat-trend up">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                5%
              </span>
            </div>
            <h2 className="ed-stat-value">$4.2k</h2>
            <p className="ed-stat-sub">As of 2:30 PM</p>
          </div>

          {/* Quick Actions */}
          <div className="ed-actions-card">
            <h3 className="ed-actions-title">Quick Actions</h3>
            <div className="ed-actions-grid">
              <button className="ed-action-btn">
                <div className="ed-action-icon" style={{ background: '#00c2ff', color: 'white' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                </div>
                New Booking
              </button>
              <button className="ed-action-btn">
                <div className="ed-action-icon" style={{ background: '#e2e8f0', color: '#64748b' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><rect x="7" y="7" width="10" height="10" rx="1"/></svg>
                </div>
                Scan QR
              </button>
              <button className="ed-action-btn">
                <div className="ed-action-icon" style={{ background: '#f59e0b', color: 'white' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                </div>
                New Rental
              </button>
              <button className="ed-action-btn">
                <div className="ed-action-icon" style={{ background: '#fca5a5', color: '#b91c1c' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/></svg>
                </div>
                Return Equip
              </button>
            </div>
          </div>
        </div>
      </div>
    </EliteLayout>
  )
}
