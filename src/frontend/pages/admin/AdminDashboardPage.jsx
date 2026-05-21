import AdminLayout from '../../layouts/AdminLayout'
import './AdminDashboardPage.css'

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Dashboard Overview</h1>
            <p className="admin-page-subtitle">Real-time pulse of your sports facility operations.</p>
          </div>
          <div className="admin-header-actions">
            <select className="admin-select-input">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
            <button className="btn-admin-outline">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export Report
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="ad-stats-grid">
          <div className="ad-stat-card">
            <div className="ad-stat-header">
              <div className="ad-stat-icon" style={{ background: '#e0f2fe', color: '#0ea5e9' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
              </div>
              <span className="ad-stat-trend up">+12.4%</span>
            </div>
            <p className="ad-stat-label">Total Revenue</p>
            <p className="ad-stat-val">$248.5k</p>
          </div>
          <div className="ad-stat-card">
            <div className="ad-stat-header">
              <div className="ad-stat-icon" style={{ background: '#f1f5f9', color: '#64748b' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <span className="ad-stat-trend up">+5.2%</span>
            </div>
            <p className="ad-stat-label">Active Bookings</p>
            <p className="ad-stat-val">142</p>
          </div>
          <div className="ad-stat-card">
            <div className="ad-stat-header">
              <div className="ad-stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
              </div>
            </div>
            <p className="ad-stat-label">Live Matches</p>
            <p className="ad-stat-val">18</p>
          </div>
          <div className="ad-stat-card">
            <div className="ad-stat-header">
              <div className="ad-stat-icon" style={{ background: '#f1f5f9', color: '#64748b' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
              </div>
              <span className="ad-stat-badge">89% Utilized</span>
            </div>
            <p className="ad-stat-label">Equipment Out</p>
            <p className="ad-stat-val">54</p>
          </div>
        </div>

        <div className="ad-main-grid">
          <div className="ad-left-col">
            {/* Revenue Trends */}
            <div className="admin-card">
              <div className="ad-card-header">
                <h2 className="ad-card-title">Revenue Trends</h2>
                <button className="ad-card-more">···</button>
              </div>
              <div className="ad-chart-placeholder">
                <div className="ad-bars">
                  <div className="ad-bar" style={{ height: '20%' }}></div>
                  <div className="ad-bar" style={{ height: '35%' }}></div>
                  <div className="ad-bar" style={{ height: '25%' }}></div>
                  <div className="ad-bar" style={{ height: '30%' }}></div>
                  <div className="ad-bar" style={{ height: '40%' }}></div>
                  <div className="ad-bar" style={{ height: '35%' }}></div>
                  <div className="ad-bar" style={{ height: '55%' }}></div>
                  <div className="ad-bar" style={{ height: '80%' }}></div>
                </div>
                <p className="ad-chart-text">[Line Chart Visualization Area]</p>
              </div>
            </div>

            {/* Court Utilization Heatmap */}
            <div className="admin-card" style={{ marginTop: '24px' }}>
              <div className="ad-card-header">
                <h2 className="ad-card-title">Court Utilization Heatmap</h2>
                <div className="ad-heatmap-legend">
                  <div className="ad-heatmap-box" style={{ background: '#e0f2fe' }}></div>
                  <div className="ad-heatmap-box" style={{ background: '#7dd3fc' }}></div>
                  <div className="ad-heatmap-box" style={{ background: '#0284c7' }}></div>
                  <div className="ad-heatmap-box" style={{ background: '#0c4a6e' }}></div>
                </div>
              </div>
              <div className="ad-heatmap">
                <div className="ad-hm-row">
                  <span className="ad-hm-label">Mon</span>
                  <div className="ad-hm-grid">
                    <div className="ad-hm-cell" style={{ background: '#0284c7' }}></div>
                    <div className="ad-hm-cell" style={{ background: '#0c4a6e' }}></div>
                    <div className="ad-hm-cell" style={{ background: '#7dd3fc' }}></div>
                    <div className="ad-hm-cell" style={{ background: '#e0f2fe' }}></div>
                    <div className="ad-hm-cell" style={{ background: '#0284c7' }}></div>
                    <div className="ad-hm-cell" style={{ background: '#0c4a6e' }}></div>
                  </div>
                </div>
                <div className="ad-hm-row">
                  <span className="ad-hm-label">Wed</span>
                  <div className="ad-hm-grid">
                    <div className="ad-hm-cell" style={{ background: '#7dd3fc' }}></div>
                    <div className="ad-hm-cell" style={{ background: '#0c4a6e' }}></div>
                    <div className="ad-hm-cell" style={{ background: '#0284c7' }}></div>
                    <div className="ad-hm-cell" style={{ background: '#e0f2fe' }}></div>
                    <div className="ad-hm-cell" style={{ background: '#0c4a6e' }}></div>
                    <div className="ad-hm-cell" style={{ background: '#0284c7' }}></div>
                  </div>
                </div>
                <div className="ad-hm-row">
                  <span className="ad-hm-label">Fri</span>
                  <div className="ad-hm-grid">
                    <div className="ad-hm-cell" style={{ background: '#e0f2fe' }}></div>
                    <div className="ad-hm-cell" style={{ background: '#0284c7' }}></div>
                    <div className="ad-hm-cell" style={{ background: '#0c4a6e' }}></div>
                    <div className="ad-hm-cell" style={{ background: '#0284c7' }}></div>
                    <div className="ad-hm-cell" style={{ background: '#0c4a6e' }}></div>
                    <div className="ad-hm-cell" style={{ background: '#e0f2fe' }}></div>
                  </div>
                </div>
                <div className="ad-hm-row">
                  <span className="ad-hm-label">Sun</span>
                  <div className="ad-hm-grid">
                    <div className="ad-hm-cell" style={{ background: '#e0f2fe' }}></div>
                    <div className="ad-hm-cell" style={{ background: '#e0f2fe' }}></div>
                    <div className="ad-hm-cell" style={{ background: '#0284c7' }}></div>
                    <div className="ad-hm-cell" style={{ background: '#7dd3fc' }}></div>
                    <div className="ad-hm-cell" style={{ background: '#0c4a6e' }}></div>
                    <div className="ad-hm-cell" style={{ background: '#0284c7' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="ad-right-col">
            <div className="admin-card ad-activity-card">
              <div className="ad-activity-header">
                <h2 className="ad-card-title">Real-time Activity</h2>
                <p className="ad-card-subtitle">System events across all facilities</p>
              </div>
              <div className="ad-timeline">
                <div className="ad-timeline-item">
                  <div className="ad-tl-icon" style={{ color: '#10b981', background: '#d1fae5' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <div className="ad-tl-content">
                    <p className="ad-tl-title">Court 4 Payment Cleared</p>
                    <p className="ad-tl-desc">Booking #B-7829 by Michael T.</p>
                    <p className="ad-tl-time">Just now</p>
                  </div>
                </div>
                <div className="ad-timeline-item">
                  <div className="ad-tl-icon" style={{ color: '#3b82f6', background: '#dbeafe' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </div>
                  <div className="ad-tl-content">
                    <p className="ad-tl-title">New Member Registration</p>
                    <p className="ad-tl-desc">Sarah J. joined Pro Tier.</p>
                    <p className="ad-tl-time">5 mins ago</p>
                  </div>
                </div>
                <div className="ad-timeline-item">
                  <div className="ad-tl-icon" style={{ color: '#f59e0b', background: '#fef3c7' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
                  </div>
                  <div className="ad-tl-content">
                    <p className="ad-tl-title">Match Started: Semi-Finals</p>
                    <p className="ad-tl-desc">Center Court is now live.</p>
                    <p className="ad-tl-time">12 mins ago</p>
                  </div>
                </div>
                <div className="ad-timeline-item">
                  <div className="ad-tl-icon" style={{ color: '#ef4444', background: '#fee2e2' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  </div>
                  <div className="ad-tl-content">
                    <p className="ad-tl-title">Equipment Delay</p>
                    <p className="ad-tl-desc">Racket set #14 late return flagged.</p>
                    <p className="ad-tl-time">28 mins ago</p>
                  </div>
                </div>
                <div className="ad-timeline-item">
                  <div className="ad-tl-icon" style={{ color: '#64748b', background: '#f1f5f9' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                  </div>
                  <div className="ad-tl-content">
                    <p className="ad-tl-title">Booking Cancelled</p>
                    <p className="ad-tl-desc">Court 2 at 18:00 freed up.</p>
                    <p className="ad-tl-time">1 hour ago</p>
                  </div>
                </div>
              </div>
              <div className="ad-activity-footer">
                <a href="#" className="ad-view-all">View All Logs</a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  )
}
