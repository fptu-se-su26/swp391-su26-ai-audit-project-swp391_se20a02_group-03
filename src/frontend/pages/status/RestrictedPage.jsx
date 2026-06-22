import { Link } from 'react-router-dom'
import './RestrictedPage.css'

export default function RestrictedPage() {
  return (
    <div className="status-page-layout">
      <main className="status-main">
        <div className="restricted-content">
          <div className="res-graphic">
            <div className="res-circle">
              <img src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200&q=80" alt="Referee Red Card" className="res-img" />
              <div className="res-overlay">lock</div>
            </div>
          </div>
          
          <h2 className="res-title">Restricted Area</h2>
          <p className="res-desc">
            Your current role does not have permission to view this section.
          </p>

          <div className="res-actions">
            <Link to="/" className="btn-status-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Return to Safety
            </Link>
            <button className="btn-status-outline">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Request Access from Admin
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
