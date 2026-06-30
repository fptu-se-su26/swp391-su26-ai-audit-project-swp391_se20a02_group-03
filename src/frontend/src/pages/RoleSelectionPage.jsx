import { useNavigate } from 'react-router-dom'
import ProSportLogo from '../components/ui/ProSportLogo'
import { useAuth } from '../context/AuthContext'

const cardStyle = {
  background: '#f8fafc',
  border: '2px solid #e2e8f0',
  borderRadius: '12px',
  padding: '20px',
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  cursor: 'pointer',
  transition: 'border-color 0.2s, box-shadow 0.2s',
}

function RoleCard({ icon, title, description, onClick }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() } }}
      style={cardStyle}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#94a3b8' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0' }}
    >
      {icon}
      <div style={{ flex: 1 }}>
        <h3 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px', fontSize: '1rem' }}>{title}</h3>
        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>{description}</p>
      </div>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
    </div>
  )
}

export default function RoleSelectionPage() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()

  function goCustomer() {
    if (isAuthenticated && (user?.role === 'Staff' || user?.role === 'Admin')) {
      navigate('/403', { state: { reason: 'Tài khoản nhân viên/quản trị không dùng cổng người chơi tại đây.' } })
      return
    }
    navigate(isAuthenticated ? '/' : '/mobile/home')
  }

  function goOwner() {
    const target = '/owner/dashboard'
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(target)}`)
      return
    }
    if (user?.role === 'CourtOwner' || user?.role === 'Admin') {
      navigate(target)
      return
    }
    navigate('/403', { state: { reason: 'Chỉ tài khoản Chủ sân hoặc Quản trị mới truy cập Owner Portal.' } })
  }

  function goStaff() {
    const target = '/elite/dashboard'
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(target)}`)
      return
    }
    if (user?.role === 'Staff') {
      navigate(target)
      return
    }
    if (user?.role === 'Admin') {
      navigate('/admin/dashboard')
      return
    }
    navigate('/403', { state: { reason: 'Chỉ tài khoản Nhân viên hoặc Quản trị mới truy cập được EliteSport OS.' } })
  }

  function goAdmin() {
    const target = '/admin/dashboard'
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(target)}`)
      return
    }
    if (user?.role === 'Admin') {
      navigate(target)
      return
    }
    navigate('/403', { state: { reason: 'Chỉ tài khoản Quản trị viên mới truy cập được cổng Admin.' } })
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-sky-100 font-sans">
      <header className="p-6 flex justify-center">
        <ProSportLogo size="md" variant="dark" />
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '40px',
          maxWidth: '560px',
          width: '100%',
          boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
        }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
            Chọn vai trò của bạn
          </h2>
          <p style={{ color: '#64748b', marginBottom: '32px', fontSize: '0.9375rem' }}>
            {isAuthenticated
              ? `Đang đăng nhập: ${user?.fullName || user?.email}. Chọn khu vực phù hợp với vai trò.`
              : 'Chọn cách bạn muốn truy cập — nhân viên và quản trị sẽ được chuyển tới đăng nhập.'}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <RoleCard
              title="Người chơi / Thành viên"
              description="Đặt sân, tham gia kèo đấu & kết nối với người chơi khác"
              onClick={goCustomer}
              icon={(
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#008ba3" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
              )}
            />

            <RoleCard
              title="Chủ sân / Chủ tổ hợp"
              description="Dashboard doanh thu, quản lý sân, giá, nhân viên & booking"
              onClick={goOwner}
              icon={(
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>
                </div>
              )}
            />

            <RoleCard
              title="Nhân viên / Quản lý cơ sở"
              description="Quản lý lịch đặt, khách lẻ & máy tính tiền POS"
              onClick={goStaff}
              icon={(
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#cffafe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0891b2" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                </div>
              )}
            />

            <RoleCard
              title="Quản trị viên"
              description="Toàn quyền kiểm soát hệ thống, phân tích & cổng quản lý"
              onClick={goAdmin}
              icon={(
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                </div>
              )}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
