import { Link } from 'react-router-dom'
import ProSportLogo from './ui/ProSportLogo'

export default function Footer() {
  return (
    <footer className="mt-auto bg-ink text-paper font-sans border-t border-white/10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-8 py-16 max-w-[1400px] mx-auto">
        {/* Brand */}
        <div className="flex flex-col gap-6">
          <ProSportLogo size="sm" variant="light" />
          <p className="text-sm leading-relaxed text-paper/60">
            Hệ thống nhà thi đấu và trang bị chất lượng cao, đồng hành cùng bạn trên mọi đấu trường.
          </p>
        </div>

        {/* Modules */}
        <div className="flex flex-col gap-4">
          <h4 className="label-mono text-paper/40">Khám phá</h4>
          <ul className="flex flex-col gap-3 list-none text-sm font-medium">
            <li><Link to="/#discover" className="text-paper/70 hover:text-accent transition-colors">Cơ sở vật chất</Link></li>
            <li><Link to="/courts" className="text-paper/70 hover:text-accent transition-colors">Đặt sân</Link></li>
            <li><Link to="/gear/catalog" className="text-paper/70 hover:text-accent transition-colors">Cửa tiệm</Link></li>
          </ul>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          <h4 className="label-mono text-paper/40">Thông tin</h4>
          <ul className="flex flex-col gap-3 list-none text-sm font-medium">
            <li><Link to="/privacy" className="text-paper/70 hover:text-accent transition-colors">Chính sách bảo mật</Link></li>
            <li><Link to="/terms" className="text-paper/70 hover:text-accent transition-colors">Điều khoản sử dụng</Link></li>
            <li><Link to="/sitemap" className="text-paper/70 hover:text-accent transition-colors">Bản đồ trang</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-4">
          <h4 className="label-mono text-paper/40">Liên lạc</h4>
          <p className="text-sm text-paper/70">support@pro-sport.vn</p>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 px-6 text-center">
        <span className="label-mono text-paper/40">© 2026 Pro-Sport Corp.</span>
      </div>
    </footer>
  )
}
