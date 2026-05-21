import { Link } from 'react-router-dom'
import './NotFoundPage.css'

export default function NotFoundPage() {
  return (
    <div className="status-page-layout">
      <header className="status-header">
        <h1 className="status-logo">PRO-SPORT</h1>
      </header>

      <main className="status-main">
        <div className="status-card not-found-card">
          <div className="nf-graphic">
            <div className="nf-circle">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#00c2ff" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            </div>
          </div>
          
          <h2 className="nf-code">404</h2>
          <h3 className="nf-title">Page Not Found. Looks like you've wandered off the court.</h3>
          <p className="nf-desc">
            The strategic play you are looking for doesn't exist or has been moved to a different playbook. Let's get you back in the game.
          </p>

          <div className="nf-actions">
            <Link to="/" className="btn-status-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              Back to Dashboard
            </Link>
            <button className="btn-status-outline">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              Search Facility
            </button>
          </div>
        </div>
      </main>

      <footer className="status-footer">
        <p>© 2024 PRO-SPORT Management. Powered by FluidGrid Engine.</p>
      </footer>
    </div>
  )
}
