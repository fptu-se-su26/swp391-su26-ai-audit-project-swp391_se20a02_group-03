import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ProSportLogo from '../components/ui/ProSportLogo'

const navLinks = [
  { path: '/shop', label: 'Cửa hàng' },
  { path: '/shop/performance', label: 'Hiệu suất' },
  { path: '/shop/collections', label: 'Bộ sưu tập' },
  { path: '/shop/new', label: 'Hàng mới' },
]

export default function ShopLayout({ children, showFlashBanner = false }) {
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [cartCount] = useState(2)
  const isActive = (path) => path === '/shop' ? location.pathname === '/shop' : location.pathname.startsWith(path)

  return (
    <div className="min-h-screen flex flex-col bg-background-base">
      {showFlashBanner && (
        <div className="bg-accent text-ink flex items-center justify-center gap-2.5 py-2 px-6 text-[13px] font-semibold">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="shrink-0"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          <span>FLASH SALE: Giảm đến 40% thiết bị hiệu suất cao cấp. Kết thúc sau <strong>04:23:59</strong>.</span>
          <a href="#" className="font-extrabold ml-2 underline">Mua ngay</a>
        </div>
      )}
      <header className="h-[76px] bg-ink border-b border-white/10 flex items-center px-6 md:px-10 gap-6 sticky top-0 z-[100]">
        <ProSportLogo size="sm" variant="light" className="shrink-0" />
        <nav className="hidden md:flex gap-1">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path} className={`py-2 px-3 font-bold text-[12.5px] uppercase tracking-[0.04em] no-underline transition-colors ${
              isActive(link.path) ? 'text-paper border-b-2 border-paper pb-1.5' : 'text-paper/50 hover:text-paper'
            }`}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 border-2 border-white/15 rounded-[2px] h-10 px-4 flex-1 max-w-[320px] focus-within:border-accent transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-paper/50 shrink-0"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Tìm thiết bị..." id="shop-search" value={search} onChange={e => setSearch(e.target.value)} className="border-none bg-transparent text-sm w-full outline-none placeholder:text-paper/40 text-paper" />
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <button className="w-9 h-9 rounded-[2px] bg-transparent border-none cursor-pointer flex items-center justify-center relative transition-colors text-paper/60 hover:text-paper" aria-label="Yêu thích">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
          <Link to="/shop/cart" className="w-9 h-9 rounded-[2px] bg-transparent flex items-center justify-center relative transition-colors text-paper/60 hover:text-paper" aria-label="Giỏ hàng">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            {cartCount > 0 && <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-accent text-ink text-[10px] font-bold flex items-center justify-center">{cartCount}</span>}
          </Link>
          <Link to="/login" className="text-[12px] font-bold uppercase tracking-[0.04em] text-paper/70 hover:text-paper no-underline py-2 px-3">Đăng nhập</Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-ink text-paper/70 pt-10 px-10 pb-6 grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-8 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
        <div>
          <ProSportLogo size="sm" variant="light" />
          <p className="text-sm text-paper/50 leading-relaxed mt-3">Thiết kế cho hiệu suất đỉnh cao. Vượt giới hạn công nghệ thể thao.</p>
        </div>
        <div className="flex flex-col gap-2.5">
          <p className="label-mono text-paper/40 mb-1">Công ty</p>
          <a href="#" className="text-sm text-paper/60 no-underline hover:text-accent">Về chúng tôi</a>
          <a href="#" className="text-sm text-paper/60 no-underline hover:text-accent">Tìm cửa hàng</a>
          <a href="#" className="text-sm text-paper/60 no-underline hover:text-accent">Tuyển dụng</a>
        </div>
        <div className="flex flex-col gap-2.5">
          <p className="label-mono text-paper/40 mb-1">Hỗ trợ</p>
          <a href="#" className="text-sm text-paper/60 no-underline hover:text-accent">Trung tâm trợ giúp</a>
          <a href="#" className="text-sm text-paper/60 no-underline hover:text-accent">Giao hàng &amp; đổi trả</a>
          <a href="#" className="text-sm text-paper/60 no-underline hover:text-accent">Liên hệ</a>
        </div>
        <div className="flex flex-col gap-2.5">
          <p className="label-mono text-paper/40 mb-1">Pháp lý</p>
          <a href="#" className="text-sm text-paper/60 no-underline hover:text-accent">Chính sách bảo mật</a>
          <a href="#" className="text-sm text-paper/60 no-underline hover:text-accent">Điều khoản dịch vụ</a>
        </div>
        <div className="col-span-full border-t border-white/10 pt-5 flex justify-between items-center">
          <p className="text-xs text-paper/35">© 2026 PRO-SPORT. Thiết kế cho hiệu suất đỉnh cao.</p>
        </div>
      </footer>
    </div>
  )
}
