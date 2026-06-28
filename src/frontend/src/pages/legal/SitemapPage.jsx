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
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <div className="pt-[140px] pb-[60px] bg-gradient-to-br from-[#f0f7f6] via-[#e8f4f8] to-[#dceef8] text-center px-6">
        <h1 className="font-['Oswald'] text-[clamp(2rem,4vw,3rem)] font-bold text-[#0a0e1a] mb-4">Sơ đồ trang</h1>
        <p className="text-slate-500 max-w-[500px] mx-auto text-[0.95rem]">Khám phá cấu trúc và các khu vực chính của nền tảng PRO-SPORT</p>
      </div>

      {/* Content */}
      <div className="container max-w-[900px] py-16" ref={contentRef}>
        
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Main */}
          <div>
            <h3 className="font-['Oswald'] text-[1.1rem] font-bold text-[#0a0e1a] mb-4 border-b-[1.5px] border-slate-100 pb-2">Trang chính</h3>
            <ul className="flex flex-col gap-3">
              <li><Link to="/" className="text-slate-600 hover:text-[#5E6AD2] transition-colors">Trang chủ</Link></li>
              <li><Link to="/about" className="text-slate-600 hover:text-[#5E6AD2] transition-colors">Giới thiệu</Link></li>
              <li><Link to="/contact" className="text-slate-600 hover:text-[#5E6AD2] transition-colors">Liên hệ</Link></li>
              <li><Link to="/courts" className="text-slate-600 hover:text-[#5E6AD2] transition-colors">Đặt sân</Link></li>
            </ul>
          </div>
          
          {/* Account */}
          <div>
            <h3 className="font-['Oswald'] text-[1.1rem] font-bold text-[#0a0e1a] mb-4 border-b-[1.5px] border-slate-100 pb-2">Tài khoản</h3>
            <ul className="flex flex-col gap-3">
              <li><Link to="/login" className="text-slate-600 hover:text-[#5E6AD2] transition-colors">Đăng nhập</Link></li>
              <li><Link to="/register" className="text-slate-600 hover:text-[#5E6AD2] transition-colors">Đăng ký</Link></li>
              <li><Link to="/apex/profile" className="text-slate-600 hover:text-[#5E6AD2] transition-colors">Hồ sơ của tôi</Link></li>
              <li><Link to="/apex/bookings" className="text-slate-600 hover:text-[#5E6AD2] transition-colors">Lịch sử đặt sân</Link></li>
            </ul>
          </div>
          
          {/* MatchPro */}
          <div>
            <h3 className="font-['Oswald'] text-[1.1rem] font-bold text-[#0a0e1a] mb-4 border-b-[1.5px] border-slate-100 pb-2">MatchPro</h3>
            <ul className="flex flex-col gap-3">
              <li><Link to="/matches" className="text-slate-600 hover:text-[#5E6AD2] transition-colors">Bảng tin kèo</Link></li>
              <li><Link to="/matches/nearby" className="text-slate-600 hover:text-[#5E6AD2] transition-colors">Sân gần bạn</Link></li>
              <li><Link to="/matches/community" className="text-slate-600 hover:text-[#5E6AD2] transition-colors">Cộng đồng</Link></li>
              <li><Link to="/matches/leaderboard" className="text-slate-600 hover:text-[#5E6AD2] transition-colors">Bảng xếp hạng</Link></li>
            </ul>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Gear */}
          <div>
            <h3 className="font-['Oswald'] text-[1.1rem] font-bold text-[#0a0e1a] mb-4 border-b-[1.5px] border-slate-100 pb-2">Cửa hàng thiết bị</h3>
            <ul className="flex flex-col gap-3">
              <li><Link to="/gear/catalog" className="text-slate-600 hover:text-[#5E6AD2] transition-colors">Danh mục thiết bị</Link></li>
              <li><Link to="/gear/cart" className="text-slate-600 hover:text-[#5E6AD2] transition-colors">Giỏ hàng</Link></li>
              <li><Link to="/gear/support" className="text-slate-600 hover:text-[#5E6AD2] transition-colors">Hỗ trợ thiết bị</Link></li>
              <li><Link to="/gear/privacy" className="text-slate-600 hover:text-[#5E6AD2] transition-colors">Chính sách thuê/mua</Link></li>
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h3 className="font-['Oswald'] text-[1.1rem] font-bold text-[#0a0e1a] mb-4 border-b-[1.5px] border-slate-100 pb-2">Cổng hệ thống</h3>
            <ul className="flex flex-col gap-3">
              <li><Link to="/apex" className="text-slate-600 hover:text-[#5E6AD2] transition-colors">Cổng Apex</Link></li>
              <li><Link to="/admin/dashboard" className="text-slate-600 hover:text-[#5E6AD2] transition-colors">Quản trị</Link></li>
              <li><Link to="/elite/pos" className="text-slate-600 hover:text-[#5E6AD2] transition-colors">Elite POS</Link></li>
              <li><Link to="/mobile/home" className="text-slate-600 hover:text-[#5E6AD2] transition-colors">Giao diện Mobile</Link></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="font-['Oswald'] text-[1.1rem] font-bold text-[#0a0e1a] mb-4 border-b-[1.5px] border-slate-100 pb-2">Pháp lý</h3>
            <ul className="flex flex-col gap-3">
              <li><Link to="/privacy" className="text-slate-600 hover:text-[#5E6AD2] transition-colors">Chính sách bảo mật</Link></li>
              <li><Link to="/terms" className="text-slate-600 hover:text-[#5E6AD2] transition-colors">Điều khoản dịch vụ</Link></li>
              <li><span className="text-[#5E6AD2] font-medium">Sơ đồ trang (trang hiện tại)</span></li>
            </ul>
          </div>
        </div>

      </div>

      <Footer variant="dark" />
    </div>
  )
}
