import MobileLayout from '../../layouts/MobileLayout'
import './MobileDashboardPage.css'

export default function MobileDashboardPage() {
  return (
    <MobileLayout>
      <div className="mob-dash-dark">
        
        {/* Welcome */}
        <div className="md-welcome">
          <h1 className="md-title">Ready for your next set, <span className="text-cyan">Alex?</span></h1>
          <p className="md-subtitle">Your upcoming schedule and stats.</p>
        </div>

        {/* Upcoming Booking */}
        <div className="md-section">
          <h3 className="md-section-label">UPCOMING BOOKING</h3>
          <div className="md-booking-card">
            <div className="md-bc-top">
              <div className="md-bc-icon bg-cyan-dark">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00c2ff" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72"/></svg>
              </div>
              <div style={{ flex: 1 }}>
                <h4 className="md-bc-title">Center Court 1</h4>
                <p className="md-bc-time"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Today, 10:00 AM - 11:30 AM</p>
                <p className="md-bc-with"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> w/ Sarah Jenkins</p>
              </div>
              <span className="md-badge-confirmed">CONFIRMED</span>
            </div>
            <div className="md-bc-actions">
              <button className="btn-md-primary">Manage Booking</button>
              <button className="btn-md-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="md-quick-actions">
          <div className="md-qa-card">
            <div className="md-qa-icon-wrap cyan">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h4v4H4z"/><path d="M16 4h4v4h-4z"/><path d="M4 16h4v4H4z"/><path d="M16 16h4v4h-4z"/><path d="M10 10h4v4h-4z"/></svg>
            </div>
            <span className="md-qa-label">Scan QR Access</span>
          </div>
          <div className="md-qa-card">
            <div className="md-qa-icon-wrap gold">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            </div>
            <span className="md-qa-label">Book Court</span>
          </div>
        </div>

        {/* Match Recommendations */}
        <div className="md-section">
          <div className="md-section-header">
            <h3 className="md-section-label">MATCH RECOMMENDATIONS</h3>
            <span className="md-link-cyan">See All</span>
          </div>

          <div className="md-recs-scroll">
            
            <div className="md-rec-card bg-rec-1">
              <div className="md-rec-overlay">
                <span className="md-rec-lvl">Level 3.5 - 4.0</span>
                <h4 className="md-rec-title">Doubles Mixer</h4>
                <p className="md-rec-loc"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> Northside Club</p>
                <div className="md-rec-bot">
                  <div className="md-rec-avatars">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&q=80" alt="P" />
                    <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&q=80" alt="P" />
                    <span className="md-rec-more">+2</span>
                  </div>
                  <button className="md-btn-text">Join</button>
                </div>
              </div>
            </div>

            <div className="md-rec-card bg-rec-2">
              <div className="md-rec-overlay">
                <span className="md-rec-lvl gold">Open Level</span>
                <h4 className="md-rec-title">Padel Practice</h4>
                <p className="md-rec-loc"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> Downtown Arena</p>
                <div className="md-rec-bot">
                  <div className="md-rec-avatars">
                    <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=40&q=80" alt="P" />
                    <span className="md-rec-more">+1</span>
                  </div>
                  <button className="md-btn-text">Join</button>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </MobileLayout>
  )
}
