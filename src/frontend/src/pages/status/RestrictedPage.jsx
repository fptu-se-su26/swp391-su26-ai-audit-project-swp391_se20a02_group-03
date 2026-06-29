import { Link } from 'react-router-dom'

export default function RestrictedPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-indigo-50 font-sans">
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-[500px] w-full bg-white rounded-2xl shadow-lg p-10">
          <div className="mb-6 flex justify-center">
            <div className="w-24 h-24 rounded-full bg-[#5E6AD2]/10 flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#5E6AD2" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
          </div>

          <h2 className="font-['Oswald',sans-serif] text-3xl font-bold text-slate-900 mb-4">Khu vực hạn chế</h2>
          <p className="text-base text-slate-600 mb-8">
            Tài khoản của bạn không có quyền truy cập khu vực này. Vui lòng liên hệ quản trị viên nếu bạn cần quyền truy cập.
          </p>

          <div className="flex justify-center gap-4 flex-col sm:flex-row">
            <Link to="/" className="flex items-center justify-center gap-2 bg-[#5E6AD2] hover:bg-[#4e5bc4] text-white px-6 py-3 rounded-lg no-underline font-semibold text-sm transition-colors">
              Về trang chủ
            </Link>
            <Link to="/contact" className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-[#5E6AD2] px-6 py-3 rounded-lg font-semibold text-sm border border-[#5E6AD2] no-underline transition-all">
              Liên hệ hỗ trợ
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
