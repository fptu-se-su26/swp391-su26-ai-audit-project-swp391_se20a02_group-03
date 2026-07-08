import { useNavigate } from 'react-router-dom'
import ProSportLogo from '../components/ui/ProSportLogo'
import { useAuth } from '../context/AuthContext'

const roleCardClass =
  'flex items-center gap-4 p-5 bg-surface border-2 border-border-strong rounded-[2px] cursor-pointer transition-colors hover:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40'

function RoleIcon({ className, children }) {
  return (
    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[2px] ${className}`}>
      {children}
    </div>
  )
}

function RoleCard({ icon, title, description, onClick }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() } }}
      className={roleCardClass}
    >
      {icon}
      <div className="flex-1">
        <h3 className="mb-1 text-base font-bold text-foreground">{title}</h3>
        <p className="m-0 text-sm text-foreground-muted">{description}</p>
      </div>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground-subtle" aria-hidden="true">
        <polyline points="9 18 15 12 9 6" />
      </svg>
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
    <div className="min-h-screen flex flex-col bg-background-base font-sans">
      <header className="p-6 flex justify-center">
        <ProSportLogo size="md" />
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="card-base w-full max-w-xl p-10">
          <h2 className="font-heading mb-2 text-3xl uppercase text-foreground">
            Chọn vai trò của bạn
          </h2>
          <p className="mb-8 text-sm text-foreground-muted">
            {isAuthenticated
              ? `Đang đăng nhập: ${user?.fullName || user?.email}. Chọn khu vực phù hợp với vai trò.`
              : 'Chọn cách bạn muốn truy cập — nhân viên và quản trị sẽ được chuyển tới đăng nhập.'}
          </p>

          <div className="flex flex-col gap-4">
            <RoleCard
              title="Người chơi / Thành viên"
              description="Đặt sân, tham gia kèo đấu & kết nối với người chơi khác"
              onClick={goCustomer}
              icon={(
                <RoleIcon className="bg-accent/10 text-accent">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </RoleIcon>
              )}
            />

            <RoleCard
              title="Chủ sân / Chủ tổ hợp"
              description="Dashboard doanh thu, quản lý sân, giá, nhân viên & booking"
              onClick={goOwner}
              icon={(
                <RoleIcon className="bg-accent/10 text-accent">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <path d="M9 22V12h6v10" />
                  </svg>
                </RoleIcon>
              )}
            />

            <RoleCard
              title="Nhân viên / Quản lý cơ sở"
              description="Quản lý lịch đặt, khách lẻ & máy tính tiền POS"
              onClick={goStaff}
              icon={(
                <RoleIcon className="bg-accent/10 text-accent">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </RoleIcon>
              )}
            />

            <RoleCard
              title="Quản trị viên"
              description="Toàn quyền kiểm soát hệ thống, phân tích & cổng quản lý"
              onClick={goAdmin}
              icon={(
                <RoleIcon className="bg-danger-bg text-danger">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                </RoleIcon>
              )}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
