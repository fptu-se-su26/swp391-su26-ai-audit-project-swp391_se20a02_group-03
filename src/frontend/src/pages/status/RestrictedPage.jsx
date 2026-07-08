import { Link, useLocation } from 'react-router-dom'

export default function RestrictedPage() {
  const location = useLocation()
  const reason = location.state?.reason

  return (
    <div className="min-h-screen flex flex-col bg-background-base font-sans">
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="card-base text-center max-w-[500px] w-full p-10">
          <div className="mb-6 flex justify-center">
            <div className="w-24 h-24 rounded-[2px] bg-danger-bg flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-danger"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
          </div>

          <h2 className="font-heading text-3xl uppercase text-foreground mb-4">Khu vực hạn chế</h2>
          <p className="text-base text-foreground-muted mb-8">
            {reason || 'Tài khoản của bạn không có quyền truy cập khu vực này. Vui lòng liên hệ quản trị viên nếu bạn cần quyền truy cập.'}
          </p>

          <div className="flex justify-center gap-4 flex-col sm:flex-row">
            <Link to="/role-selection" className="btn-primary">
              Chọn vai trò khác
            </Link>
            <Link to="/" className="btn-outline">
              Về trang chủ
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
