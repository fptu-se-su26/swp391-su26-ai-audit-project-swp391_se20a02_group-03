import { Link } from 'react-router-dom'
import ProSportLogo from '../../components/ui/ProSportLogo'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background-base font-sans">
      <header className="p-6 flex justify-center">
        <ProSportLogo size="md" />
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="card-base p-12 text-center max-w-[540px] w-full">
          <div className="mb-8 flex justify-center">
            <div className="w-40 h-40 rounded-[2px] bg-ink flex items-center justify-center relative overflow-hidden">
              <span className="font-heading text-5xl text-paper">404</span>
            </div>
          </div>

          <h2 className="font-heading text-4xl uppercase text-foreground leading-none mb-4">Không tìm thấy trang</h2>
          <p className="text-sm text-foreground-muted leading-relaxed mb-8">
            Trang bạn đang tìm không tồn tại hoặc đã được di chuyển. Hãy quay lại trang chủ hoặc tìm sân gần bạn.
          </p>

          <div className="flex justify-center gap-4 flex-col sm:flex-row">
            <Link to="/" className="btn-primary">
              Về trang chủ
            </Link>
            <Link to="/matches/nearby" className="btn-outline">
              Sân gần bạn
            </Link>
          </div>
        </div>
      </main>

      <footer className="text-center p-6 text-xs text-foreground-subtle">
        <p>© {new Date().getFullYear()} Quản lý Tổ hợp PRO-SPORT</p>
      </footer>
    </div>
  )
}
