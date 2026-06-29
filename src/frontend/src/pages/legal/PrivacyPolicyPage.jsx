import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function PrivacyPolicyPage() {
  const contentRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(contentRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    )
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar theme="light" />
      
      <div className="pt-[140px] pb-[60px] bg-gradient-to-br from-[#f0f7f6] via-[#e8f4f8] to-[#dceef8] text-center px-6">
        <h1 className="font-['Oswald'] text-[clamp(2rem,4vw,3rem)] font-bold text-[#0a0e1a] mb-4">Chính sách bảo mật</h1>
        <p className="text-slate-500 max-w-[500px] mx-auto text-[0.95rem]">Cập nhật lần cuối: 4 tháng 6, 2026</p>
      </div>

      <div className="container max-w-[800px] py-16" ref={contentRef}>
        <div className="prose prose-slate max-w-none">
          <p className="text-[1.05rem] text-slate-700 leading-[1.75] mb-8">
            Tại PRO-SPORT, chúng tôi coi trọng quyền riêng tư của bạn. Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng, tiết lộ và bảo vệ thông tin khi bạn truy cập website và sử dụng ứng dụng của chúng tôi.
          </p>

          <h2 className="font-['Oswald'] text-[1.4rem] font-bold text-[#0a0e1a] mt-10 mb-4">1. Thông tin chúng tôi thu thập</h2>
          <p className="text-slate-600 mb-4 leading-[1.7]">
            Chúng tôi thu thập thông tin bạn cung cấp trực tiếp khi:
          </p>
          <ul className="list-disc pl-5 mb-8 text-slate-600 space-y-2">
            <li>Đăng ký tài khoản (họ tên, email, số điện thoại)</li>
            <li>Đặt sân hoặc tham gia kèo đấu</li>
            <li>Hoàn thiện hồ sơ vận động viên (trình độ, môn thể thao yêu thích)</li>
            <li>Liên hệ bộ phận hỗ trợ khách hàng</li>
          </ul>

          <h2 className="font-['Oswald'] text-[1.4rem] font-bold text-[#0a0e1a] mt-10 mb-4">2. Cách chúng tôi sử dụng thông tin</h2>
          <p className="text-slate-600 mb-4 leading-[1.7]">
            Chúng tôi sử dụng thông tin thu thập để:
          </p>
          <ul className="list-disc pl-5 mb-8 text-slate-600 space-y-2">
            <li>Cung cấp, duy trì và cải thiện dịch vụ</li>
            <li>Xử lý đặt sân và thanh toán</li>
            <li>Ghép bạn với người chơi có trình độ tương đương (tính năng MatchPro)</li>
            <li>Gửi thông báo kỹ thuật, cập nhật, cảnh báo bảo mật và tin nhắn hỗ trợ</li>
          </ul>

          <h2 className="font-['Oswald'] text-[1.4rem] font-bold text-[#0a0e1a] mt-10 mb-4">3. Bảo mật dữ liệu</h2>
          <p className="text-slate-600 mb-8 leading-[1.7]">
            Chúng tôi áp dụng các biện pháp bảo mật hành chính, kỹ thuật và vật lý để bảo vệ thông tin cá nhân của bạn. Dù đã nỗ lực hợp lý, không có biện pháp bảo mật nào là hoàn hảo hay không thể xâm phạm.
          </p>

          <h2 className="font-['Oswald'] text-[1.4rem] font-bold text-[#0a0e1a] mt-10 mb-4">4. Liên hệ</h2>
          <p className="text-slate-600 mb-8 leading-[1.7]">
            Nếu bạn có câu hỏi về Chính sách bảo mật này, vui lòng liên hệ: <a href="mailto:privacy@pro-sport.com" className="text-[#14B8A6] hover:underline">privacy@pro-sport.com</a>
          </p>
        </div>
      </div>

      <Footer variant="dark" />
    </div>
  )
}
