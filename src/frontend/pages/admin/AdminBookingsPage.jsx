import AdminLayout from '../../layouts/AdminLayout'
import './AdminBookingsPage.css'

const bookings = [
  { id: '#BKG-8401', customer: { initials: 'MJ', name: 'Marcus Johnson', sub: '+1 (555) 019-2834', color: '#0ea5e9' }, court: { name: 'Center Court', sub: 'Hardcourt' }, date: 'Oct 24, 2023', time: '10:00 AM - 11:30 AM', payment: 'PAID', status: 'CONFIRMED' },
  { id: '#BKG-8402', customer: { initials: 'SW', name: 'Sarah Williams', sub: 'sarah.w@example.com', color: '#64748b' }, court: { name: 'Court 2', sub: 'Clay' }, date: 'Oct 24, 2023', time: '12:00 PM - 02:00 PM', payment: 'PENDING', status: 'CONFIRMED' },
  { id: '#BKG-8403', customer: { initials: 'DT', name: 'David Torres', sub: 'Member: Gold', color: '#d97706' }, court: { name: 'Court 1', sub: 'Hardcourt' }, date: 'Oct 24, 2023', time: '08:00 AM - 09:30 AM', payment: 'PAID', status: 'CHECKED-IN' },
  { id: '#BKG-8399', customer: { initials: 'EL', name: 'Elena Lopez', sub: 'Guest', color: '#cbd5e1' }, court: { name: 'Center Court', sub: '' }, date: 'Oct 23, 2023', time: '06:00 PM - 08:00 PM', payment: 'REFUNDED', status: 'CANCELLED' },
]

export default function AdminBookingsPage() {
  return (
    <AdminLayout>
      <div className="admin-bookings">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Booking Management</h1>
            <p className="admin-page-subtitle">Manage court reservations, monitor statuses, and process payments.</p>
          </div>
          <div className="admin-header-actions">
            <div className="ab-view-toggle">
              <button className="ab-view-btn active">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                List
              </button>
              <button className="ab-view-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Timeline
              </button>
            </div>
            <button className="btn-admin-primary">
              + Manual Booking
            </button>
          </div>
        </div>

        {/* Top Stats */}
        <div className="ab-stats-grid">
          <div className="ab-stat-card">
            <div className="ab-stat-icon-wrap">
              <div className="ab-stat-icon" style={{ background: '#e0f2fe', color: '#0ea5e9' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <span className="ab-stat-badge">Today</span>
            </div>
            <p className="ab-stat-val">42</p>
            <p className="ab-stat-label">Total Active Bookings</p>
          </div>
          <div className="ab-stat-card">
            <div className="ab-stat-icon-wrap">
              <div className="ab-stat-icon" style={{ background: '#f1f5f9', color: '#64748b' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
            </div>
            <p className="ab-stat-val">85<span style={{ fontSize: '1.25rem' }}>%</span></p>
            <p className="ab-stat-label">Peak Court Utilization</p>
          </div>
          <div className="ab-stat-card">
            <div className="ab-stat-icon-wrap">
              <div className="ab-stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
              </div>
            </div>
            <p className="ab-stat-val">8</p>
            <p className="ab-stat-label">Pending Payments Action Required</p>
          </div>
        </div>

        {/* Table Area */}
        <div className="admin-table-container">
          <div className="ab-table-toolbar">
            <div className="ab-filters">
              <select className="ab-filter-select">
                <option>All Courts</option>
              </select>
              <div className="ab-date-picker">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <input type="text" placeholder="mm/dd/yyyy" />
              </div>
            </div>
            <button className="ab-export-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export CSV
            </button>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Court</th>
                <th>Date & Time</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600, color: '#64748b' }}>{b.id}</td>
                  <td>
                    <div className="ab-customer">
                      <div className="ab-avatar" style={{ background: b.customer.color }}>{b.customer.initials}</div>
                      <div>
                        <p className="ab-cust-name">{b.customer.name}</p>
                        <p className="ab-cust-sub">{b.customer.sub}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="ab-court-name">{b.court.name}</p>
                    {b.court.sub && <p className="ab-court-sub">{b.court.sub}</p>}
                  </td>
                  <td>
                    <p className="ab-date">{b.date}</p>
                    <p className="ab-time">{b.time}</p>
                  </td>
                  <td>
                    <span className={`ab-pay-badge pay-${b.payment.toLowerCase()}`}>{b.payment}</span>
                  </td>
                  <td>
                    <span className={`ab-status-badge status-${b.status.toLowerCase()}`}>{b.status}</span>
                  </td>
                  <td>
                    <button className="ab-action-icon">...</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="ab-pagination">
            <span className="ab-page-info">Showing 1 to 4 of 42 entries</span>
            <div className="ab-page-controls">
              <button className="ab-page-btn">&lt;</button>
              <button className="ab-page-btn active">1</button>
              <button className="ab-page-btn">2</button>
              <button className="ab-page-btn">3</button>
              <span className="ab-page-dots">...</span>
              <button className="ab-page-btn">&gt;</button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
