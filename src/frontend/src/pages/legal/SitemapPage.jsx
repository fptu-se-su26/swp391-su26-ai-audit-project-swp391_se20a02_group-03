import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function SitemapPage() {
  const contentRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(contentRef.current.children,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
    )
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Navbar />

      <div className="pt-[140px] pb-[60px] bg-ink text-center px-6">
        <p className="label-mono text-accent mb-4">{'// Điều hướng'}</p>
        <h1 className="font-heading text-[clamp(2rem,4vw,3rem)] uppercase text-paper mb-4">Sơ đồ trang</h1>
        <p className="text-paper/60 max-w-[500px] mx-auto text-sm">Khám phá cấu trúc và các khu vực chính của nền tảng PRO-SPORT</p>
      </div>

      {/* Content */}
      <div className="container max-w-[900px] py-16" ref={contentRef}>

        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Main */}
          <div>
            <h3 className="font-heading text-[1.1rem] uppercase text-foreground mb-4 border-b-2 border-border-default pb-2">Trang chính</h3>
            <ul className="flex flex-col gap-3">
              <li><Link to="/" className="text-foreground-muted hover:text-accent transition-colors">Trang chủ</Link></li>
              <li><Link to="/about" className="text-foreground-muted hover:text-accent transition-colors">Giới thiệu</Link></li>
              <li><Link to="/contact" className="text-foreground-muted hover:text-accent transition-colors">Liên hệ</Link></li>
              <li><Link to="/courts" className="text-foreground-muted hover:text-accent transition-colors">Đặt sân</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-heading text-[1.1rem] uppercase text-foreground mb-4 border-b-2 border-border-default pb-2">Tài khoản</h3>
            <ul className="flex flex-col gap-3">
              <li><Link to="/login" className="text-foreground-muted hover:text-accent transition-colors">Đăng nhập</Link></li>
              <li><Link to="/register" className="text-foreground-muted hover:text-accent transition-colors">Đăng ký</Link></li>
              <li><Link to="/apex/profile" className="text-foreground-muted hover:text-accent transition-colors">Hồ sơ của tôi</Link></li>
              <li><Link to="/apex/bookings" className="text-foreground-muted hover:text-accent transition-colors">Lịch sử đặt sân</Link></li>
            </ul>
          </div>

          {/* MatchPro */}
          <div>
            <h3 className="font-heading text-[1.1rem] uppercase text-foreground mb-4 border-b-2 border-border-default pb-2">MatchPro</h3>
            <ul className="flex flex-col gap-3">
              <li><Link to="/matches" className="text-foreground-muted hover:text-accent transition-colors">Bảng tin kèo</Link></li>
              <li><Link to="/matches/nearby" className="text-foreground-muted hover:text-accent transition-colors">Sân gần bạn</Link></li>
              <li><Link to="/matches/community" className="text-foreground-muted hover:text-accent transition-colors">Cộng đồng</Link></li>
              <li><Link to="/matches/leaderboard" className="text-foreground-muted hover:text-accent transition-colors">Bảng xếp hạng</Link></li>
            </ul>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Gear */}
          <div>
            <h3 className="font-heading text-[1.1rem] uppercase text-foreground mb-4 border-b-2 border-border-default pb-2">Cửa hàng thiết bị</h3>
            <ul className="flex flex-col gap-3">
              <li><Link to="/gear/catalog" className="text-foreground-muted hover:text-accent transition-colors">Danh mục thiết bị</Link></li>
              <li><Link to="/gear/cart" className="text-foreground-muted hover:text-accent transition-colors">Giỏ hàng</Link></li>
              <li><Link to="/gear/support" className="text-foreground-muted hover:text-accent transition-colors">Hỗ trợ thiết bị</Link></li>
              <li><Link to="/gear/privacy" className="text-foreground-muted hover:text-accent transition-colors">Chính sách thuê/mua</Link></li>
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h3 className="font-heading text-[1.1rem] uppercase text-foreground mb-4 border-b-2 border-border-default pb-2">Cổng hệ thống</h3>
            <ul className="flex flex-col gap-3">
              <li><Link to="/apex" className="text-foreground-muted hover:text-accent transition-colors">Cổng Apex</Link></li>
              <li><Link to="/admin/dashboard" className="text-foreground-muted hover:text-accent transition-colors">Quản trị</Link></li>
              <li><Link to="/elite/pos" className="text-foreground-muted hover:text-accent transition-colors">Elite POS</Link></li>
              <li><Link to="/mobile/home" className="text-foreground-muted hover:text-accent transition-colors">Giao diện Mobile</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-heading text-[1.1rem] uppercase text-foreground mb-4 border-b-2 border-border-default pb-2">Pháp lý</h3>
            <ul className="flex flex-col gap-3">
              <li><Link to="/privacy" className="text-foreground-muted hover:text-accent transition-colors">Chính sách bảo mật</Link></li>
              <li><Link to="/terms" className="text-foreground-muted hover:text-accent transition-colors">Điều khoản dịch vụ</Link></li>
              <li><span className="text-accent font-medium">Sơ đồ trang (trang hiện tại)</span></li>
            </ul>
          </div>
        </div>

      </div>

      <Footer variant="dark" />
    </div>
  )
}
