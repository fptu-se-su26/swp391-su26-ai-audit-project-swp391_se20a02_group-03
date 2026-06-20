import AdminLayout from '../../layouts/AdminLayout'
import './AdminCourtsPage.css'

export default function AdminCourtsPage() {
  return (
    <AdminLayout>
      <div className="admin-courts">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Court Management</h1>
            <p className="admin-page-subtitle">Overview and scheduling of all facilities.</p>
          </div>
          <div className="admin-header-actions">
            <button className="btn-admin-outline">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Schedule Maintenance
            </button>
            <button className="btn-admin-outline">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              Edit Pricing
            </button>
            <button className="btn-admin-primary" style={{ background: '#0ea5e9' }}>
              + Add New Court
            </button>
          </div>
        </div>

        <div className="ac-main-grid">
          {/* Filters Sidebar */}
          <div className="ac-filters">
            <div className="admin-card">
              <h3 className="ac-filter-title">SPORT TYPE</h3>
              <div className="ac-filter-group">
                <label className="ac-checkbox-label">
                  <input type="checkbox" defaultChecked className="ac-checkbox" />
                  Pickleball
                </label>
                <label className="ac-checkbox-label">
                  <input type="checkbox" defaultChecked className="ac-checkbox" />
                  Pickleball
                </label>
                <label className="ac-checkbox-label">
                  <input type="checkbox" className="ac-checkbox" />
                  Pickleball
                </label>
                <label className="ac-checkbox-label">
                  <input type="checkbox" className="ac-checkbox" />
                  Pickleball
                </label>
              </div>
            </div>

            <div className="admin-card" style={{ marginTop: '16px' }}>
              <h3 className="ac-filter-title">STATUS</h3>
              <div className="ac-filter-group">
                <label className="ac-checkbox-label">
                  <input type="checkbox" defaultChecked className="ac-checkbox" />
                  <span className="ac-dot" style={{ background: '#22c55e' }}></span>
                  Available
                </label>
                <label className="ac-checkbox-label">
                  <input type="checkbox" defaultChecked className="ac-checkbox" />
                  <span className="ac-dot" style={{ background: '#0f172a' }}></span>
                  Booked
                </label>
                <label className="ac-checkbox-label">
                  <input type="checkbox" defaultChecked className="ac-checkbox" />
                  <span className="ac-dot" style={{ background: '#f59e0b' }}></span>
                  Maintenance
                </label>
                <label className="ac-checkbox-label">
                  <input type="checkbox" defaultChecked className="ac-checkbox" />
                  <span className="ac-dot" style={{ background: '#ef4444' }}></span>
                  Closed
                </label>
              </div>
            </div>
          </div>

          {/* Courts Grid */}
          <div className="ac-courts-grid">
            {/* Card 1 */}
            <div className="ac-court-card">
              <div className="ac-court-img-wrap">
                <img src="https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=600&q=80" alt="Pickleball Court" className="ac-court-img" />
                <div className="ac-court-tags">
                  <span className="ac-tag ac-tag--sport"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72"/></svg>PICKLEBALL</span>
                  <span className="ac-tag ac-tag--available">AVAILABLE</span>
                </div>
              </div>
              <div className="ac-court-info">
                <h2 className="ac-court-name">Center Court 1</h2>
                <p className="ac-court-loc"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>Main Pavilion, East Wing</p>
                
                <div className="ac-court-schedule">
                  <div className="ac-schedule-header">
                    <span className="ac-schedule-label">Next Booking</span>
                    <span className="ac-schedule-time">14:00 - 15:30</span>
                  </div>
                  <div className="ac-progress-bar"><div className="ac-progress-fill" style={{ width: '30%', background: '#0ea5e9' }}></div></div>
                </div>

                <button className="ac-card-btn ac-card-btn--primary">Quick Book</button>
              </div>
            </div>

            {/* Card 2 */}
            <div className="ac-court-card">
              <div className="ac-court-img-wrap">
                <img src="https://images.unsplash.com/photo-1622227432807-91eb590c31ab?w=600&q=80" alt="Pickleball Court" className="ac-court-img" />
                <div className="ac-court-tags">
                  <span className="ac-tag ac-tag--sport"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72"/></svg>PICKLEBALL</span>
                  <span className="ac-tag ac-tag--booked">BOOKED</span>
                </div>
              </div>
              <div className="ac-court-info">
                <h2 className="ac-court-name">Pickleball Court A</h2>
                <p className="ac-court-loc"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>Indoor Complex, Sector 2</p>
                
                <div className="ac-court-schedule">
                  <div className="ac-schedule-header">
                    <span className="ac-schedule-label">Current Session</span>
                    <span className="ac-schedule-time">09:00 - 11:00</span>
                  </div>
                  <div className="ac-progress-bar"><div className="ac-progress-fill" style={{ width: '60%', background: '#0f172a' }}></div></div>
                </div>

                <div className="ac-court-user">
                  <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80" alt="Sarah" className="ac-cu-avatar" />
                  <div>
                    <p className="ac-cu-name">Sarah Jenkins</p>
                    <p className="ac-cu-sub">Pro Member</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="ac-court-card">
              <div className="ac-court-img-wrap">
                <img src="https://images.unsplash.com/photo-1542144610-092591748259?w=600&q=80" alt="Clay Court" className="ac-court-img" />
                <div className="ac-court-tags">
                  <span className="ac-tag ac-tag--sport"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72"/></svg>PICKLEBALL</span>
                  <span className="ac-tag ac-tag--maint">MAINTENANCE</span>
                </div>
              </div>
              <div className="ac-court-info">
                <h2 className="ac-court-name">Clay Court 2</h2>
                <p className="ac-court-loc"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>South Gardens</p>
                
                <div className="ac-court-task">
                  <div className="ac-task-row">
                    <span className="ac-task-label">Task</span>
                    <span className="ac-task-val">Surface Reshaping</span>
                  </div>
                  <div className="ac-task-row">
                    <span className="ac-task-label">Est. Completion</span>
                    <span className="ac-task-val" style={{ color: '#d97706', fontWeight: 600 }}>Today, 17:00</span>
                  </div>
                </div>

                <button className="ac-card-btn ac-card-btn--outline">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 2v6h6"/><path d="M21 12A9 9 0 0 0 6 5.3L3 8"/><path d="M21 22v-6h-6"/><path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"/></svg>
                  Update Status
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
