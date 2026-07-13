import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function TermsOfServicePage() {
  const contentRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(contentRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    )
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Navbar theme="light" />

      <div className="pt-[140px] pb-[60px] bg-ink text-center px-6">
        <p className="label-mono text-accent mb-4">{'// Pháp lý'}</p>
        <h1 className="font-heading text-[clamp(2rem,4vw,3rem)] uppercase text-paper mb-4">Điều khoản dịch vụ</h1>
        <p className="text-paper/60 max-w-[500px] mx-auto text-sm">Có hiệu lực từ: 4 tháng 6, 2026</p>
      </div>

      <div className="container max-w-[800px] py-16" ref={contentRef}>
        <div className="prose max-w-none">
          <p className="text-[1.05rem] text-foreground leading-[1.75] mb-8">
            Chào mừng bạn đến với PRO-SPORT. Khi truy cập hoặc sử dụng website, ứng dụng di động hoặc các dịch vụ của chúng tôi (gọi chung là &quot;Dịch vụ&quot;), bạn đồng ý tuân thủ các Điều khoản dịch vụ này.
          </p>

          <h2 className="font-heading text-[1.4rem] uppercase text-foreground mt-10 mb-4">1. Chấp nhận điều khoản</h2>
          <p className="text-foreground-muted mb-8 leading-[1.7]">
            Khi tạo tài khoản, đặt sân hoặc sử dụng Dịch vụ theo bất kỳ hình thức nào, bạn xác nhận đã đọc, hiểu và đồng ý với các Điều khoản này. Nếu không đồng ý, bạn không được truy cập hoặc sử dụng Dịch vụ.
          </p>

          <h2 className="font-heading text-[1.4rem] uppercase text-foreground mt-10 mb-4">2. Quy định đặt sân</h2>
          <ul className="list-disc pl-5 mb-8 text-foreground-muted space-y-2">
            <li>Lượt đặt chỉ được xác nhận khi thanh toán thành công.</li>
            <li>Người dùng phải đến đúng giờ; đến muộn không được gia hạn thời gian đặt sân.</li>
            <li>Bắt buộc trang phục thể thao phù hợp và giày không để vết trên mọi sân.</li>
            <li>Mọi thiệt hại đối với cơ sở hoặc thiết bị sẽ do người đặt sân chịu trách nhiệm.</li>
          </ul>

          <h2 className="font-heading text-[1.4rem] uppercase text-foreground mt-10 mb-4">3. Chính sách hủy</h2>
          <p className="text-foreground-muted mb-8 leading-[1.7]">
            Hủy trước hơn 24 giờ so với giờ đặt sân: hoàn tiền 100%. Hủy trong khoảng 12–24 giờ: phí hủy 50%. Hủy dưới 12 giờ hoặc không đến: không hoàn tiền.
          </p>

          <h2 className="font-heading text-[1.4rem] uppercase text-foreground mt-10 mb-4">4. Ứng xử người dùng</h2>
          <p className="text-foreground-muted mb-8 leading-[1.7]">
            Bạn cam kết sử dụng Dịch vụ một cách tôn trọng. Quấy rối, lạm dụng hoặc hành vi không phù hợp đối với nhân viên, đối tác sân hoặc vận động viên khác (kể cả trong cộng đồng MatchPro) sẽ dẫn đến khóa tài khoản ngay lập tức.
          </p>

          <h2 className="font-heading text-[1.4rem] uppercase text-foreground mt-10 mb-4">5. Thông tin liên hệ</h2>
          <p className="text-foreground-muted mb-8 leading-[1.7]">
            Mọi thắc mắc về Điều khoản này, vui lòng liên hệ: <a href="mailto:legal@pro-sport.com" className="text-accent hover:underline">legal@pro-sport.com</a>
          </p>
        </div>
      </div>

      <Footer variant="dark" />
    </div>
  )
}
