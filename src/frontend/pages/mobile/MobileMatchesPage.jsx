import MobileLayout from '../../layouts/MobileLayout'
import './MobileMatchesPage.css'

export default function MobileMatchesPage() {
  return (
    <MobileLayout title="Matches">
      <div className="mob-matches">
        <div className="mm-pull-refresh">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.92-10.26l5.08 5.08"/></svg>
          <span>Pull to refresh</span>
        </div>

        {/* Filters */}
        <div className="mm-filters">
          <button className="mm-filter-btn active">All Sports</button>
          <button className="mm-filter-btn">Pickleball</button>
          <button className="mm-filter-btn">Pickleball</button>
          <button className="mm-filter-btn">Pickleball</button>
        </div>

        <div className="mm-list">
          {/* Match 1 */}
          <div className="mm-card">
            <div className="mm-card-top">
              <div className="mm-sport-icon bg-cyan">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72"/></svg>
              </div>
              <div style={{ flex: 1 }}>
                <h3 className="mm-title">Mens Doubles</h3>
                <p className="mm-time"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> 18:00 - 20:00</p>
              </div>
              <div className="mm-badges">
                <span className="mm-badge-urgent">Starts in 2h</span>
                <span className="mm-badge-lvl">Lvl 4.5</span>
              </div>
            </div>
            
            <div className="mm-card-mid">
              <div className="mm-players">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&q=80" alt="P" className="mm-p-avatar" />
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&q=80" alt="P" className="mm-p-avatar" />
                <div className="mm-p-spots">1 spot</div>
              </div>
              <button className="btn-mm-join">Join</button>
            </div>

            <div className="mm-card-bot">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Central Court, Area 5
            </div>
          </div>

          {/* Match 2 */}
          <div className="mm-card">
            <div className="mm-card-top">
              <div className="mm-sport-icon bg-cyan">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72"/></svg>
              </div>
              <div style={{ flex: 1 }}>
                <h3 className="mm-title">Pickleball Mixed</h3>
                <p className="mm-time"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Tomorrow, 09:00</p>
              </div>
              <div className="mm-badges">
                <span className="mm-badge-lvl">Lvl 3.0</span>
              </div>
            </div>
            
            <div className="mm-card-mid">
              <div className="mm-players">
                <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=40&q=80" alt="P" className="mm-p-avatar" />
                <div className="mm-p-spots">2 spots</div>
              </div>
              <button className="btn-mm-join">Join</button>
            </div>

            <div className="mm-card-bot">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Westside Pickleball Club
            </div>
          </div>

          {/* Match 3 (Full) */}
          <div className="mm-card full">
            <div className="mm-card-top">
              <div className="mm-sport-icon bg-gray">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72"/></svg>
              </div>
              <div style={{ flex: 1 }}>
                <h3 className="mm-title">Singles Practice</h3>
                <p className="mm-time"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Today, 20:00</p>
              </div>
              <div className="mm-badges">
                <span className="mm-badge-lvl" style={{ background: '#e2e8f0', color: '#64748b' }}>Lvl 5.0</span>
              </div>
            </div>
            
            <div className="mm-card-mid" style={{ justifyContent: 'center', margin: '16px 0' }}>
              <span className="mm-badge-full">Full</span>
            </div>
            
            <div className="mm-card-mid">
              <div className="mm-players">
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&q=80" alt="P" className="mm-p-avatar" />
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&q=80" alt="P" className="mm-p-avatar" />
              </div>
              <button className="btn-mm-join" disabled style={{ background: '#f1f5f9', color: '#94a3b8' }}>Full</button>
            </div>
          </div>
        </div>

        {/* FAB */}
        <button className="mm-fab">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>

      </div>
    </MobileLayout>
  )
}
