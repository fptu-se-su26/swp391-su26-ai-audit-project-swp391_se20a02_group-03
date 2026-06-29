import { Link } from 'react-router-dom'
import ProSportLogo from '../../components/ui/ProSportLogo'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-indigo-50 font-sans">
      <header className="p-6 flex justify-center">
        <ProSportLogo size="md" />
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.05)] p-12 text-center max-w-[540px] w-full">
          <div className="mb-8 flex justify-center">
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[#5E6AD2] to-indigo-700 flex items-center justify-center relative overflow-hidden shadow-lg">
              <span className="text-5xl font-bold text-white">404</span>
            </div>
          </div>

          <h2 className="font-['Oswald',sans-serif] text-4xl font-bold text-slate-900 leading-none mb-4">Không tìm thấy trang</h2>
          <p className="text-[0.95rem] text-slate-500 leading-relaxed mb-8">
            Trang bạn đang tìm không tồn tại hoặc đã được di chuyển. Hãy quay lại trang chủ hoặc tìm sân gần bạn.
          </p>

          <div className="flex justify-center gap-4 flex-col sm:flex-row">
            <Link to="/" className="flex items-center justify-center gap-2 bg-[#5E6AD2] hover:bg-[#4e5bc4] text-white px-6 py-3 rounded-lg no-underline font-semibold text-sm transition-colors">
              Về trang chủ
            </Link>
            <Link to="/matches/nearby" className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-[#5E6AD2] px-6 py-3 rounded-lg font-semibold text-sm border border-[#5E6AD2] no-underline transition-all">
              Sân gần bạn
            </Link>
          </div>
        </div>
      </main>

      <footer className="text-center p-6 text-[0.75rem] text-slate-400">
        <p>© {new Date().getFullYear()} Quản lý Tổ hợp PRO-SPORT</p>
      </footer>
    </div>
  )
}
