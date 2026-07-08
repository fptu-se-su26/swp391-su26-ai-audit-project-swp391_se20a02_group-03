import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useToast } from '../components/Toast'

gsap.registerPlugin(ScrollTrigger)

const faqs = [
  { q: 'Làm thế nào để đặt sân?', a: 'Sử dụng nền tảng web hoặc ứng dụng di động của chúng tôi để xem lịch trống theo thời gian thực và đặt sân ngay lập tức. Có thể đặt trước tối đa 7 ngày.' },
  { q: 'Chính sách hủy sân là gì?', a: 'Bạn có thể hủy sân trước 24 giờ để được hoàn tiền toàn bộ. Hủy trễ có thể phải chịu phí 20%.' },
  { q: 'Có các khóa huấn luyện không?', a: 'Có, chúng tôi có danh sách các huấn luyện viên chuyên nghiệp cho các khóa đào tạo cá nhân. Vui lòng liên hệ qua form hoặc phần MatchPro trên ứng dụng.' },
]

const channels = [
  { label: 'Đường dây nóng', value: '1900 6688', sub: 'T2 – T6, 8h – 20h' },
  { label: 'Thư điện tử', value: 'performance@pro-sport.com', sub: 'Phản hồi trong 2 giờ' },
  { label: 'Địa chỉ', value: 'Khu thể thao phức hợp, Phường 22, TP. Hồ Chí Minh', sub: '' },
]

export default function ContactPage() {
  const { addToast } = useToast()
  const [openFaq, setOpenFaq] = useState(null)
  const [formSent, setFormSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: 'Hỏi đáp chung', message: '' })

  const heroRef    = useRef(null)
  const formRef    = useRef(null)
  const detailsRef = useRef(null)
  const faqRef     = useRef(null)

  useEffect(() => {
    // Hero entrance
    gsap.fromTo(heroRef.current,
      { opacity: 0, y: 32 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }
    )
    // Form card slides in from left
    if (formRef.current) {
      gsap.fromTo(formRef.current,
        { opacity: 0, x: -28 },
        { opacity: 1, x: 0, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: formRef.current, start: 'top 82%' } }
      )
    }
    // Contact detail items stagger from right
    if (detailsRef.current) {
      gsap.fromTo(detailsRef.current.children,
        { opacity: 0, x: 28 },
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out',
          scrollTrigger: { trigger: detailsRef.current, start: 'top 82%' } }
      )
    }
    // FAQ items fade up
    if (faqRef.current) {
      gsap.fromTo(faqRef.current.children,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: faqRef.current, start: 'top 85%' } }
      )
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Navbar />

      {/* ── Hero ── */}
      <section className="pt-[76px] bg-ink text-center">
        <div ref={heroRef} className="max-w-[900px] mx-auto px-6 py-16 sm:py-[100px_70px]">
          <p className="label-mono text-paper mb-5">// Liên hệ</p>
          <h1 className="font-heading text-[clamp(2.2rem,5vw,4.4rem)] uppercase tracking-[-0.01em] text-paper mb-5">Kết nối cùng sự hoàn hảo</h1>
          <p className="text-paper/65 text-[15px] leading-[1.7] max-w-[520px] mx-auto">
            Dù bạn đang đặt sân hay tham gia giải đấu, đội ngũ của chúng tôi luôn ở đây để đảm bảo trải nghiệm của bạn đạt được mục tiêu tốt nhất.
          </p>
        </div>
      </section>

      {/* ── Main content ── */}
      <section className="py-16 sm:py-24 px-6 sm:px-10 bg-paper">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* Left: Form */}
          <div ref={formRef} className="card-base p-8 sm:p-10 bg-surface">
            <h2 className="font-heading text-2xl uppercase text-foreground mb-8">Liên hệ với chúng tôi</h2>

            {formSent ? (
              <div className="flex flex-col items-center gap-4 py-12 text-center auth-animate-fade">
                <div className="w-16 h-16 rounded-[2px] bg-accent/10 border-2 border-accent flex items-center justify-center text-accent">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h3 className="font-heading text-xl uppercase text-foreground">Đã gửi tin nhắn!</h3>
                <p className="text-foreground-muted text-sm leading-relaxed max-w-xs">Đội ngũ của chúng tôi sẽ phản hồi lại trong vòng 2 giờ.</p>
                <button onClick={() => setFormSent(false)} className="mt-2 text-sm text-accent font-bold hover:underline transition-colors">
                  Gửi tin nhắn khác →
                </button>
              </div>
            ) : (
              <form className="flex flex-col gap-5" onSubmit={e => {
                e.preventDefault()
                if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
                  addToast('Vui lòng điền đầy đủ thông tin bắt buộc', 'error')
                  return
                }
                setFormSent(true)
                addToast('Tin nhắn đã được ghi nhận. Chúng tôi sẽ phản hồi sớm!', 'success')
              }}>
                <div className="flex flex-col gap-2">
                  <label htmlFor="c-name" className="text-sm font-bold uppercase tracking-[0.05em] text-foreground">Họ và tên</label>
                  <input id="c-name" type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nguyễn Văn A" className="contact-input" required />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="c-email" className="text-sm font-bold uppercase tracking-[0.05em] text-foreground">Thư điện tử</label>
                  <input id="c-email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="ban@email.com" className="contact-input" required />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="c-subject" className="text-sm font-bold uppercase tracking-[0.05em] text-foreground">Chủ đề</label>
                  <select id="c-subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="contact-input">
                    <option>Hỏi đáp chung</option>
                    <option>Đặt sân</option>
                    <option>Hỗ trợ kỹ thuật</option>
                    <option>Hợp tác</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="c-message" className="text-sm font-bold uppercase tracking-[0.05em] text-foreground">Nội dung</label>
                  <textarea id="c-message" rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Chúng tôi có thể giúp gì cho bạn hôm nay?" className="contact-input resize-y min-h-[120px] py-3" required />
                </div>
                <button type="submit" className="btn-primary mt-2 h-[52px]">Gửi tin nhắn</button>
              </form>
            )}
          </div>

          {/* Right: Details */}
          <div className="flex flex-col gap-8">
            <h2 className="font-heading text-2xl uppercase text-foreground mb-1">Thông tin liên hệ</h2>

            <div ref={detailsRef} className="flex flex-col">
              {channels.map((c, i) => (
                <div key={i} className={`py-5 ${i < channels.length - 1 ? 'border-b border-border-default' : ''}`}>
                  <p className="label-mono text-foreground-subtle mb-1.5">{c.label}</p>
                  <p className="text-lg font-bold text-foreground">{c.value}</p>
                  {c.sub && <p className="text-xs text-foreground-muted mt-1">{c.sub}</p>}
                </div>
              ))}
            </div>

            {/* Social */}
            <div className="pt-8 border-t border-border-default">
              <p className="text-sm font-bold text-foreground mb-4">Theo dõi chúng tôi</p>
              <div className="flex gap-3">
                {['twitter', 'instagram', 'linkedin', 'youtube'].map(s => (
                  <a key={s} href="#" aria-label={s} className="w-10 h-10 rounded-[2px] border-2 border-border-strong flex items-center justify-center text-foreground-muted hover:text-accent hover:border-accent transition-all duration-300">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Live Support */}
            <div className="bg-ink text-paper p-7 flex items-center justify-between gap-4">
              <div>
                <p className="font-heading text-lg uppercase text-paper">Hỗ trợ trực tuyến</p>
                <p className="text-sm text-paper/60 mt-1">Nhân viên hỗ trợ 24/7 cho các HLV cao cấp.</p>
              </div>
              <button className="w-11 h-11 shrink-0 flex items-center justify-center border-2 border-paper/30 text-paper hover:border-accent hover:text-accent transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Facility Image */}
      <section className="relative h-[400px] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1400&q=80" alt="Cơ sở thể thao cao cấp" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-ink/20 mix-blend-multiply" />
        <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 bg-ink/90 p-6 max-w-sm flex flex-col gap-3 border-2 border-ink">
          <div className="label-mono text-accent">Cơ sở vật chất hiện đại</div>
          <p className="text-sm text-paper/80 leading-relaxed">Tọa lạc tại vị trí trung tâm thể thao dễ dàng di chuyển.</p>
          <Link to="/matches/nearby" className="text-sm text-accent font-bold hover:underline transition-colors no-underline">Xem sân gần bạn →</Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-24 px-6 sm:px-10 bg-paper">
        <div className="max-w-[760px] mx-auto">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
            <h2 className="font-heading text-2xl sm:text-3xl uppercase text-foreground">Câu hỏi thường gặp</h2>
            <a href="#" className="text-sm text-accent font-bold hover:underline">Xem thêm FAQ →</a>
          </div>
          <div ref={faqRef} className="flex flex-col gap-4">
            {faqs.map((f, i) => (
              <div key={f.q} className={`border-2 transition-colors duration-300 bg-surface ${openFaq === i ? 'border-accent' : 'border-border-strong'}`}>
                <button
                  className="w-full flex items-center justify-between gap-4 p-5 text-left text-base font-bold text-foreground cursor-pointer outline-none"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{f.q}</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    className={`text-foreground-muted transition-transform duration-300 shrink-0 ${openFaq === i ? 'rotate-180 text-accent' : ''}`}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 auth-animate-fade">
                    <div className="pt-4 border-t border-border-default text-sm text-foreground-muted leading-relaxed">
                      {f.a}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
