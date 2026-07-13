import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const principles = [
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
    title: 'Đổi mới',
    desc: 'Tiên phong trong công nghệ sân thông minh và huấn luyện dựa trên dữ liệu để đẩy lùi giới hạn hiệu suất thể thao.',
    stat: '12+',
    statLabel: 'Bằng sáng chế',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    title: 'Cộng đồng',
    desc: 'Xây dựng một hệ sinh thái phát triển, nơi các vận động viên, huấn luyện viên và chuyên gia kết nối, cạnh tranh và cùng phát triển.',
    stat: '500K+',
    statLabel: 'Vận động viên',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    title: 'Hiệu suất',
    desc: 'Mang lại kết quả đo lường được thông qua cơ sở vật chất cao cấp, phân tích chuyên sâu và kế hoạch huấn luyện cá nhân hóa.',
    stat: '2M+',
    statLabel: 'Lượt đặt sân',
  },
]

const milestones = [
  { year: '2020', title: 'Thành lập tại TP.Hồ Chí Minh', desc: 'Bắt đầu với tầm nhìn số hóa quản lý cơ sở thể thao trên toàn Đông Nam Á.' },
  { year: '2021', title: '50 Cơ sở đầu tiên', desc: 'Hợp tác với các câu lạc bộ cầu lông, sân pickleball và khu liên hợp thể thao tại Việt Nam.' },
  { year: '2022', title: 'Ra mắt MatchPro', desc: 'Ra mắt hệ thống ghép kèo tích hợp AI, kết nối vận động viên theo kỹ năng và khu vực.' },
  { year: '2023', title: 'Gọi vốn Series A', desc: 'Gọi vốn 5 triệu USD để mở rộng công nghệ sân thông minh và nền tảng di động.' },
  { year: '2024', title: 'Mở rộng khu vực', desc: 'Mở rộng hoạt động sang Thái Lan, Singapore và Philippines với hơn 200 cơ sở đối tác.' },
  { year: '2025', title: 'Pro-Sport 2.0', desc: 'Ra mắt nền tảng thế hệ mới với phân tích theo thời gian thực, cho thuê thiết bị và quản lý giải đấu.' },
]

const team = [
  { name: 'David Nguyen', role: 'CEO & Đồng sáng lập', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80', quote: 'Công nghệ nên tiếp sức cho vận động viên, chứ không làm phức tạp hóa cuộc chơi của họ.' },
  { name: 'Sarah Chen', role: 'CTO', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80', quote: 'Chúng tôi xây dựng hệ thống tư duy như huấn luyện viên và biểu diễn như nhà vô địch.' },
  { name: 'Marcus Tran', role: 'Giám đốc Sản phẩm', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80', quote: 'Mọi tính năng đều được kiểm thử trên sân thực tế, không chỉ trong phòng thí nghiệm.' },
  { name: 'Elena Park', role: 'Phó giám đốc Vận hành', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80', quote: 'Cơ sở của chúng tôi thiết lập tiêu chuẩn cho các khu thể thao hiện đại.' },
]

const partners = ['APEXGEAR', 'NEXUSCOURTS', 'VELOCITYATHLETICS', 'PRIMEFIT', 'ELITEPRO', 'SPORTZONE']

const journey = [
  { label: 'Cơ sở vật chất đẳng cấp', tag: 'CƠ SỞ', image: 'https://images.unsplash.com/photo-1544919982-b61976f0ba43?w=800&q=80', large: true },
  { label: 'Sự xuất sắc từ dữ liệu', tag: 'CÔNG NGHỆ', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80', large: false },
  { label: 'Giải đấu toàn cầu', tag: 'SỰ KIỆN', image: 'https://images.unsplash.com/photo-1540747913346-19212a4f5db4?w=600&q=80', large: false },
]

const stats = [
  { value: '200+', label: 'Cơ sở đối tác' },
  { value: '500K', label: 'Vận động viên hoạt động' },
  { value: '2M+', label: 'Trận đấu diễn ra' },
  { value: '14', label: 'Thành phố phủ sóng' },
]

export default function AboutPage() {
  const heroRef = useRef(null)
  const missionRef = useRef(null)
  const journeyRef = useRef(null)
  const principlesRef = useRef(null)
  const timelineRef = useRef(null)
  const teamRef = useRef(null)
  const statsRef = useRef(null)

  useEffect(() => {
    // Hero
    gsap.fromTo(heroRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })

    // Mission
    if (missionRef.current) {
      gsap.fromTo(missionRef.current.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power2.out',
          scrollTrigger: { trigger: missionRef.current, start: 'top 80%' } }
      )
    }

    // Journey images
    if (journeyRef.current) {
      gsap.fromTo(journeyRef.current.children,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: 'power2.out',
          scrollTrigger: { trigger: journeyRef.current, start: 'top 80%' } }
      )
    }

    // Principles cards
    if (principlesRef.current) {
      gsap.fromTo(principlesRef.current.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out',
          scrollTrigger: { trigger: principlesRef.current, start: 'top 80%' } }
      )
    }

    // Timeline
    if (timelineRef.current) {
      gsap.fromTo(timelineRef.current.querySelectorAll('.timeline-item'),
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: timelineRef.current, start: 'top 80%' } }
      )
    }

    // Team
    if (teamRef.current) {
      gsap.fromTo(teamRef.current.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out',
          scrollTrigger: { trigger: teamRef.current, start: 'top 80%' } }
      )
    }

    // Stats counter
    if (statsRef.current) {
      gsap.fromTo(statsRef.current.children,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.7)',
          scrollTrigger: { trigger: statsRef.current, start: 'top 85%' } }
      )
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative pt-[76px] bg-ink text-center overflow-hidden">
        <div className="absolute inset-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=1400&q=70')] bg-cover bg-center" />
        <div ref={heroRef} className="relative z-[1] max-w-[900px] mx-auto px-6 py-24 sm:py-[100px]">
          <p className="label-mono text-paper mb-5">{'// Về Pro-Sport'}</p>
          <h1 className="font-heading text-[clamp(2.2rem,6vw,5.4rem)] leading-[0.96] uppercase tracking-[-0.01em] text-paper mb-6">
            Định hình lại tương lai<br />hiệu suất thể thao.
          </h1>
          <p className="text-paper/65 text-base sm:text-[17px] leading-[1.75] max-w-[560px] mx-auto mb-9">
            Chúng tôi thu hẹp khoảng cách giữa tiềm năng con người và độ chính xác của công nghệ,
            xây dựng môi trường nơi các vận động viên tinh hoa được rèn giũa.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/courts" className="btn-primary h-[54px] px-9 text-sm bg-accent border-accent text-ink hover:bg-accent-bright hover:border-accent-bright">
              Khám phá cơ sở
            </Link>
            <Link to="/contact" className="btn-outline h-[54px] px-9 text-sm text-paper border-paper/40 hover:border-paper">
              Liên hệ
            </Link>
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="py-20 sm:py-[120px] px-6 sm:px-10 bg-paper">
        <div ref={missionRef} className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="label-mono text-ink mb-4">{'// Sứ mệnh'}</p>
            <h2 className="font-heading text-[clamp(1.6rem,3.6vw,3rem)] leading-[1.02] uppercase tracking-[-0.01em] text-ink mb-7">
              Tiếp sức vận động viên qua công nghệ &amp; cơ sở vật chất cao cấp
            </h2>
            <p className="text-ink/70 text-[15px] leading-[1.8] mb-5">
              PRO-SPORT ra đời từ một niềm tin đơn giản: mọi vận động viên đều xứng đáng tiếp cận cơ sở vật chất đẳng cấp thế giới và các công cụ thông minh giúp họ đạt hiệu suất đỉnh cao.
            </p>
            <p className="text-ink/70 text-[15px] leading-[1.8] mb-8">
              Nền tảng của chúng tôi kết nối <strong className="text-ink">200+ cơ sở</strong>, <strong className="text-ink">500.000+ vận động viên</strong> và các chương trình huấn luyện chuyên nghiệp vào một trải nghiệm liền mạch.
            </p>
            <div className="flex gap-7 flex-wrap">
              <span className="font-bold text-[13px] uppercase tracking-[0.04em] text-ink border-b-2 border-ink pb-1.5">Đặt sân thông minh</span>
              <span className="font-bold text-[13px] uppercase tracking-[0.04em] text-ink border-b-2 border-ink pb-1.5">Ghép kèo AI</span>
              <span className="font-bold text-[13px] uppercase tracking-[0.04em] text-ink border-b-2 border-ink pb-1.5">Phân tích thời gian thực</span>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] bg-[url('https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80')] bg-cover bg-center border-2 border-ink" />
            <div className="absolute -bottom-6 -left-6 bg-ink text-paper px-7 py-6 max-w-[220px]">
              <p className="font-heading text-3xl leading-none">5+</p>
              <p className="text-xs text-paper/60 mt-1.5">Năm xuất sắc trong công nghệ thể thao</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Banner ── */}
      <section className="py-16 sm:py-[90px] px-6 sm:px-10 bg-ink">
        <div ref={statsRef} className="max-w-[1400px] mx-auto flex justify-center gap-12 sm:gap-20 flex-wrap text-center">
          {stats.map(s => (
            <div key={s.label}>
              <p className="font-heading text-[44px] text-paper mb-2 leading-none">{s.value}</p>
              <p className="label-mono text-[#8a8a84]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Our Journey ── */}
      <section className="py-20 sm:py-[120px] px-6 sm:px-10 bg-paper">
        <div className="max-w-[1400px] mx-auto">
          <p className="label-mono text-ink mb-4">{'// Chúng tôi làm gì'}</p>
          <h2 className="font-heading text-[clamp(1.8rem,4vw,3.2rem)] uppercase tracking-[-0.01em] text-ink mb-12">Hành trình</h2>
          <div ref={journeyRef} className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] md:grid-rows-2 gap-4 md:h-[480px]">
            {journey.map((item) => (
              <div
                key={item.label}
                className={`relative overflow-hidden border-2 border-ink flex items-end p-6 sm:p-7 group h-[220px] md:h-auto ${item.large ? 'md:row-span-2' : ''}`}
              >
                <img src={item.image} alt={item.label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
                <div className="relative z-[1]">
                  <span className="label-mono bg-ink text-paper px-3 py-1.5 inline-block mb-3">{item.tag}</span>
                  <p className="font-heading text-lg sm:text-xl uppercase text-paper">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Core Principles ── */}
      <section className="py-20 sm:py-[120px] px-6 sm:px-10 bg-ink">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <p className="label-mono text-paper mb-4">{'// Tại sao chọn chúng tôi'}</p>
            <h2 className="font-heading text-[clamp(1.8rem,4vw,3.2rem)] uppercase tracking-[-0.01em] text-paper">Nguyên tắc cốt lõi</h2>
          </div>
          <div ref={principlesRef} className="grid grid-cols-1 md:grid-cols-3 gap-[2px] bg-white/15">
            {principles.map((p) => (
              <div key={p.title} className="bg-ink p-9">
                <div className="text-paper mb-4">{p.icon}</div>
                <h3 className="font-heading text-xl uppercase text-paper mb-3.5">{p.title}</h3>
                <p className="text-sm leading-[1.7] text-paper/60 mb-6">{p.desc}</p>
                <div className="border-t border-white/15 pt-4">
                  <p className="font-heading text-[30px] text-paper leading-none">{p.stat}</p>
                  <p className="label-mono text-[#6b6b6b] mt-1">{p.statLabel}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="py-20 sm:py-[120px] px-6 sm:px-10 bg-paper">
        <div className="max-w-[760px] mx-auto">
          <div className="text-center mb-16">
            <p className="label-mono text-ink mb-4">{'// Câu chuyện'}</p>
            <h2 className="font-heading text-[clamp(1.8rem,4vw,3.2rem)] uppercase tracking-[-0.01em] text-ink">Từ tầm nhìn đến hiện thực</h2>
          </div>
          <div ref={timelineRef}>
            {milestones.map((m, i) => (
              <div key={m.year} className={`timeline-item flex gap-7 py-7 border-t-2 border-ink ${i === milestones.length - 1 ? 'border-b-2' : ''}`}>
                <span className="font-heading text-[26px] text-ink w-[90px] shrink-0">{m.year}</span>
                <div>
                  <h3 className="font-bold text-base text-ink mb-1.5">{m.title}</h3>
                  <p className="text-[13.5px] leading-[1.6] text-ink/70">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Leadership Team ── */}
      <section className="py-20 sm:py-[120px] px-6 sm:px-10 bg-ink">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <p className="label-mono text-paper mb-4">{'// Con người'}</p>
            <h2 className="font-heading text-[clamp(1.8rem,4vw,3.2rem)] uppercase tracking-[-0.01em] text-paper">Ban lãnh đạo</h2>
          </div>
          <div ref={teamRef} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map(t => (
              <div key={t.name}>
                <div className="aspect-[3/4] bg-cover bg-center border border-white/15 mb-4" style={{ backgroundImage: `url('${t.avatar}')` }} />
                <h3 className="font-bold text-[15px] text-paper mb-1">{t.name}</h3>
                <p className="label-mono text-[#8a8a84]">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Partners ── */}
      <section className="py-14 px-6 sm:px-10 bg-paper border-y border-border-default">
        <p className="text-center label-mono text-foreground-subtle mb-8">Đối tác & thương hiệu tin cậy</p>
        <div className="flex justify-center items-center gap-10 sm:gap-[52px] flex-wrap">
          {partners.map(b => (
            <span key={b} className="font-heading text-lg tracking-[0.08em] text-foreground-subtle transition-colors hover:text-accent cursor-default">{b}</span>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 sm:py-[140px] px-6 sm:px-10 bg-paper text-center">
        <h2 className="font-heading text-[clamp(2rem,4.5vw,4rem)] leading-none uppercase tracking-[-0.01em] text-ink mb-6">Sẵn sàng nâng tầm trận đấu?</h2>
        <p className="text-ink/70 text-[15px] leading-[1.7] max-w-[480px] mx-auto mb-10">
          Tham gia cùng hơn 500.000 vận động viên tin tưởng PRO-SPORT cho tập luyện, kèo đấu và hành trình thi đấu.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/register" className="btn-primary h-[54px] px-9 text-sm">
            Bắt đầu miễn phí
          </Link>
          <Link to="/contact" className="btn-outline h-[54px] px-9 text-sm text-ink border-ink/30 hover:border-ink">
            Liên hệ kinh doanh
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
