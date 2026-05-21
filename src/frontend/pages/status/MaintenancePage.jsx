import './MaintenancePage.css'

export default function MaintenancePage() {
  return (
    <div className="status-page-layout">
      <main className="status-main">
        <div className="maint-card">
          {/* Left Side */}
          <div className="maint-left">
            <div className="maint-img-wrap">
              <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80" alt="Server Maintenance" className="maint-img" />
              <div className="maint-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                System Tune-up
              </div>
            </div>
            
            <div className="maint-timer">
              <div className="timer-box">
                <span className="t-val">02</span>
                <span className="t-label">HOURS</span>
              </div>
              <span className="t-sep">:</span>
              <div className="timer-box">
                <span className="t-val">45</span>
                <span className="t-label">MINS</span>
              </div>
              <span className="t-sep">:</span>
              <div className="timer-box">
                <span className="t-val">12</span>
                <span className="t-label">SECS</span>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="maint-right">
            <h1 className="status-logo" style={{ textAlign: 'left', marginBottom: '24px' }}>PRO-SPORT</h1>
            <h2 className="maint-title">We're upgrading our performance.</h2>
            <p className="maint-desc">
              PRO-SPORT is currently undergoing scheduled maintenance to bring you new elite features. Our team is actively fine-tuning the engine.
            </p>

            <div className="maint-notify">
              <div className="maint-input-group">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <input type="email" placeholder="Enter your email to be notified" />
                <button className="btn-maint-submit">Notify Me</button>
              </div>
            </div>

            <div className="maint-social">
              <span className="ms-label">Follow updates on our channels:</span>
              <div className="ms-icons">
                <a href="#" className="ms-icon-link">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </a>
                <a href="#" className="ms-icon-link">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
