import AdminLayout from '../../layouts/AdminLayout'
import './AdminUsersPage.css'

const users = [
  { avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80', name: 'Sarah Jenkins', email: 'sarah.j@pro-sport.com', role: 'ADMIN', roleColor: '#818cf8', verified: true, active: 'Just now' },
  { initials: 'MR', color: '#f59e0b', name: 'Marcus Rodriguez', email: 'm.rodriguez@example.com', role: 'CUSTOMER', roleColor: '#94a3b8', verified: true, active: '2 hours ago' },
  { avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80', name: 'David Chen', email: 'david.chen@pro-sport.staff', role: 'STAFF', roleColor: '#0ea5e9', verified: false, active: 'Yesterday' },
  { initials: 'EL', color: '#cbd5e1', name: 'Emma Larson', email: 'emma.l@guest.com', role: 'GUEST', roleColor: '#94a3b8', verified: true, active: 'Oct 12, 2023' },
]

export default function AdminUsersPage() {
  return (
    <AdminLayout>
      <div className="admin-users">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">User Management</h1>
            <p className="admin-page-subtitle">Manage accounts, roles, and verification status across the platform.</p>
          </div>
          <div className="admin-header-actions">
            <button className="btn-admin-outline">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export
            </button>
            <button className="btn-admin-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
              Create New User
            </button>
          </div>
        </div>

        <div className="admin-table-container">
          <div className="au-table-toolbar">
            <div className="au-search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" placeholder="Search by name or email..." />
            </div>
            <div className="au-tabs">
              <button className="au-tab active">All Users</button>
              <button className="au-tab">Admin</button>
              <button className="au-tab">Staff</button>
              <button className="au-tab">Customer</button>
            </div>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Verification</th>
                <th>Last Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={i}>
                  <td>
                    <div className="au-user-cell">
                      {u.avatar ? (
                        <img src={u.avatar} alt={u.name} className="au-avatar" />
                      ) : (
                        <div className="au-avatar-placeholder" style={{ background: u.color }}>{u.initials}</div>
                      )}
                      <div>
                        <p className="au-name">{u.name}</p>
                        <p className="au-email">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="au-role-badge" style={{ background: u.roleColor + '20', color: u.roleColor === '#94a3b8' ? '#64748b' : u.roleColor }}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <div className="au-verify-cell">
                      <span className="au-dot" style={{ background: u.verified ? '#22c55e' : '#f59e0b' }}></span>
                      <span className="au-verify-text">{u.verified ? 'Verified' : 'Pending'}</span>
                    </div>
                  </td>
                  <td>
                    <span className="au-active-text">{u.active}</span>
                  </td>
                  <td>
                    <div className="au-actions">
                      <button className="au-action-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      </button>
                      <button className="au-action-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="au-pagination">
            <span className="au-page-info">Showing 1 to 4 of 1,248 users</span>
            <div className="au-page-controls">
              <button className="au-page-btn">&lt;</button>
              <button className="au-page-btn active">1</button>
              <button className="au-page-btn">2</button>
              <button className="au-page-btn">3</button>
              <span className="au-page-dots">...</span>
              <button className="au-page-btn">&gt;</button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
