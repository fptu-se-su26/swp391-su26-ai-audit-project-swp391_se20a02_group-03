import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-auto bg-neo-secondary text-neo-ink font-sans text-xl border-t-4 border-neo-muted">
      {/* Wave divider from secondary to dark background */}
      <div className="h-4 w-full bg-neo-surface border-b-4 border-neo-muted"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-8 py-16 max-w-7xl mx-auto">
        {/* Brand */}
        <div className="flex flex-col gap-6">
          <div className="font-heading text-sm text-neo-ink flex items-center gap-2">
             <span className="text-neo-accent" style={{ textShadow: '1px 1px 0px var(--color-neo-danger)' }}>❖</span> 
             <span style={{ textShadow: '2px 2px 0px var(--color-neo-danger)' }}>PRO-SPORT</span>
          </div>
          <p className="leading-relaxed font-bold" style={{ textShadow: '1px 1px 0px var(--color-neo-danger)' }}>
            Hệ thống nhà thi đấu và trang bị chất lượng cao, đồng hành cùng bạn trên mọi đấu trường.
          </p>
        </div>

        {/* Modules */}
        <div className="flex flex-col gap-4">
          <h4 className="font-heading text-[10px] text-neo-accent mb-2 uppercase tracking-widest" style={{ textShadow: '1px 1px 0px var(--color-neo-danger)' }}>Khám phá</h4>
          <ul className="flex flex-col gap-3 list-none font-bold">
            <li><Link to="/#discover" className="hover:text-neo-accent transition-colors hover:translate-x-1 inline-block">Cơ sở vật chất</Link></li>
            <li><Link to="/courts" className="hover:text-neo-accent transition-colors hover:translate-x-1 inline-block">Đặt sân</Link></li>
            <li><Link to="/gear/catalog" className="hover:text-neo-accent transition-colors hover:translate-x-1 inline-block">Cửa tiệm</Link></li>
          </ul>
        </div>

        {/* Security */}
        <div className="flex flex-col gap-4">
          <h4 className="font-heading text-[10px] text-neo-accent mb-2 uppercase tracking-widest" style={{ textShadow: '1px 1px 0px var(--color-neo-danger)' }}>Thông tin</h4>
          <ul className="flex flex-col gap-3 list-none font-bold">
            <li><Link to="/privacy" className="hover:text-neo-accent transition-colors hover:translate-x-1 inline-block">Chính sách bảo mật</Link></li>
            <li><Link to="/terms" className="hover:text-neo-accent transition-colors hover:translate-x-1 inline-block">Điều khoản sử dụng</Link></li>
            <li><Link to="/sitemap" className="hover:text-neo-accent transition-colors hover:translate-x-1 inline-block">Bản đồ trang</Link></li>
          </ul>
        </div>

        {/* Comm-Link */}
        <div className="flex flex-col gap-4">
          <h4 className="font-heading text-[10px] text-neo-accent mb-2 uppercase tracking-widest" style={{ textShadow: '1px 1px 0px var(--color-neo-danger)' }}>Liên lạc</h4>
          <div className="flex gap-4 text-2xl">
             <span className="cursor-pointer hover:text-neo-accent hover:-translate-y-1 transition-transform" style={{ textShadow: '1px 1px 0px var(--color-neo-danger)' }}>❖</span>
             <span className="cursor-pointer hover:text-neo-accent hover:-translate-y-1 transition-transform" style={{ textShadow: '1px 1px 0px var(--color-neo-danger)' }}>✦</span>
             <span className="cursor-pointer hover:text-neo-accent hover:-translate-y-1 transition-transform" style={{ textShadow: '1px 1px 0px var(--color-neo-danger)' }}>♥</span>
          </div>
        </div>
      </div>

      <div className="border-t-2 border-neo-muted/30 bg-neo-bg py-6 px-6 text-center text-lg font-bold">
        <span className="text-neo-ink">Gieo hạt từ năm 2024. © Pro-Sport Corp.</span>
      </div>
    </footer>
  )
}