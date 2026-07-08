import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Link, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const brands = ['APEXGEAR', 'NEXUSCOURTS', 'VELOCITYATHLETICS', 'PRIMEFIT']
// Marquee cần 2 nửa giống hệt nhau để translateX(-50%) nối vòng không giật
const marqueeHalf = [...brands, ...brands]

const heroLines = ['Hiệu suất', 'mượt mà.', 'Kiểm soát', 'đỉnh cao.']

const facilities = [
  {
    id: 1,
    name: 'The Apex Pavilion',
    sub: 'Tổ Hợp Cầu Lông • 4 Sân',
    tag: 'OPEN',
    image: 'https://images.unsplash.com/photo-1626926938421-90124a4b83fa?w=800&q=80',
    large: true,
  },
  {
    id: 2,
    name: 'Summit Arena',
    sub: 'Sân Pickleball Tiêu Chuẩn',
    image: 'https://images.unsplash.com/photo-1693142518820-78d7a05f1546?w=600&q=80',
    large: false,
  },
  {
    id: 3,
    name: 'Xem toàn bộ 42 cơ sở',
    sub: 'Khám phá toàn bộ hệ thống',
    isViewAll: true,
    image: 'https://images.unsplash.com/photo-1734161081396-0f0572a16bf6?w=600&q=80',
    large: false,
  },
]

const features = [
  {
    num: '01',
    title: 'Lưới sân thời gian thực',
    desc: 'Ma trận trạng thái trống trên tất cả các sân. Không còn cần gọi điện hoặc đặt trùng.',
  },
  {
    num: '02',
    title: 'Ghép đội thông minh',
    desc: 'Tính năng ghép đội AI theo kỹ năng, lịch trình và vị trí ưa thích.',
  },
  {
    num: '03',
    title: 'Ví điện tử trung gian',
    desc: 'Hệ thống cọc an toàn loại bỏ tình trạng không đến. Tiền được giữ đến khi hoàn thành.',
  },
  {
    num: '04',
    title: 'Trợ lý Chatbot AI',
    desc: 'Tìm kiếm sân và trận đấu bằng ngôn ngữ tự nhiên. Hỏi là tìm thấy ngay.',
    dark: true,
  },
]

const steps = [
  { num: '01', title: 'Tạo tài khoản', desc: 'Đăng ký trong vài giây. Hoàn tất e-KYC để truy cập đầy đủ tính năng.' },
  { num: '02', title: 'Tìm & Đặt sân', desc: 'Duyệt tìm sân trống hoặc tham gia các trận mở trong khu vực của bạn.' },
  { num: '03', title: 'Chơi & Kết nối', desc: 'Quét QR vào sân, tham gia thi đấu và xây dựng điểm uy tín của bạn.' },
]

const stats = [
  { end: 42, suffix: '+', label: 'Cơ sở vật chất cao cấp' },
  { end: 2.4, decimals: 1, suffix: 'K', label: 'Vận động viên tích cực' },
  { end: 98, suffix: '%', label: 'Tỷ lệ hài lòng' },
  { end: 15, suffix: 'K+', label: 'Kèo đấu hoàn thành' },
]

const formatStat = (s) => s.end.toFixed(s.decimals || 0) + s.suffix

export default function HomePage() {
  const location = useLocation()
  const heroRef = useRef(null)
  const heroImgRef = useRef(null)
  const heroSectionRef = useRef(null)
  const facilitiesRef = useRef(null)
  const featuresRef = useRef(null)
  const stepsRef = useRef(null)
  const statsRef = useRef(null)
  const ctaRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      // Hero — headline reveal từng dòng + fade các phần phụ
      gsap.fromTo('.hero-line',
        { yPercent: 110 },
        { yPercent: 0, duration: 0.9, stagger: 0.09, ease: 'power4.out', delay: 0.15 }
      )
      gsap.fromTo('.hero-fade',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out', delay: 0.5 }
      )

      // Hero — ảnh nền zoom-out lúc vào trang + parallax nhẹ khi cuộn
      gsap.fromTo(heroImgRef.current,
        { scale: 1.12 },
        { scale: 1, duration: 1.8, ease: 'power2.out' }
      )
      gsap.to(heroImgRef.current, {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: heroSectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      // Facilities Stagger
      gsap.fromTo(facilitiesRef.current.children,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: facilitiesRef.current, start: 'top 82%' }
        }
      )

      // Features Stagger
      gsap.fromTo(featuresRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out',
          scrollTrigger: { trigger: featuresRef.current, start: 'top 80%' }
        }
      )

      // Steps Stagger
      gsap.fromTo(stepsRef.current.children,
        { opacity: 0, x: -30 },
        {
          opacity: 1, x: 0, duration: 0.7, stagger: 0.2, ease: 'power2.out',
          scrollTrigger: { trigger: stepsRef.current, start: 'top 80%' }
        }
      )

      // Stats — đếm số động khi cuộn tới
      statsRef.current.querySelectorAll('[data-counter]').forEach((el) => {
        const end = parseFloat(el.dataset.end)
        const decimals = parseInt(el.dataset.decimals, 10) || 0
        const suffix = el.dataset.suffix || ''
        const state = { v: 0 }
        el.textContent = (0).toFixed(decimals) + suffix
        gsap.to(state, {
          v: end,
          duration: 1.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: statsRef.current, start: 'top 85%' },
          onUpdate: () => { el.textContent = state.v.toFixed(decimals) + suffix },
        })
      })

      // CTA section
      gsap.fromTo(ctaRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: ctaRef.current, start: 'top 85%' }
        }
      )
    })

    return () => ctx.revert()
  }, [])

  // Hash scrolling logic for Discover section
  useEffect(() => {
    if (location.hash === '#discover') {
      setTimeout(() => {
        document.getElementById('discover')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [location.hash])

  return (
    <div className="flex flex-col min-h-screen bg-paper">
      <Navbar />

      {/* ═══════════════════════════════════════════
          HERO — Dark, Bold, Premium
          ═══════════════════════════════════════════ */}
      <section ref={heroSectionRef} className="relative pt-[76px] min-h-screen overflow-hidden bg-ink">
        {/* Background court image */}
        <img
          ref={heroImgRef}
          src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1920&q=80"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover will-change-transform"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/55 to-ink" />

        <div ref={heroRef} className="relative z-10 flex flex-col justify-end h-full min-h-[calc(100vh-76px)] max-w-[1400px] mx-auto px-6 sm:px-10 pb-16 sm:pb-24">
          <p className="hero-fade label-mono text-paper mb-5">// Cầu lông & Pickleball chuyên nghiệp</p>
          <h1 className="font-heading text-[clamp(2.6rem,9vw,9rem)] leading-[0.92] tracking-[-0.01em] text-paper uppercase mb-8 max-w-[1100px]">
            {heroLines.map((line) => (
              <span key={line} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
                <span className="hero-line block will-change-transform">{line}</span>
              </span>
            ))}
          </h1>
          <p className="hero-fade text-paper/70 text-base sm:text-lg leading-[1.7] max-w-[520px] mb-11">
            Nền tảng đặt sân cầu lông & pickleball hàng đầu —
            đặt sân, ghép trận và thuê thiết bị chuyên nghiệp một cách liền mạch.
          </p>
          <div className="hero-fade flex gap-4 flex-wrap">
            <Link to="/register" className="btn-primary h-[58px] px-10 text-sm bg-accent border-accent text-ink hover:bg-accent-bright hover:border-accent-bright">
              Bắt đầu miễn phí
            </Link>
            <Link to="/courts" className="btn-outline h-[58px] px-10 text-sm text-paper border-paper/40 hover:border-paper">
              Xem demo
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TRUSTED BY — Infinite Brand Marquee
          ═══════════════════════════════════════════ */}
      <section className="bg-ink border-b border-white/10 py-9 px-6 sm:px-10">
        <div className="max-w-[1400px] mx-auto flex items-center gap-10">
          <span className="label-mono text-[#6b6b6b] shrink-0">Đối tác & thương hiệu</span>
          <div className="marquee flex-1 min-w-0">
            <div className="marquee-track items-center">
              {marqueeHalf.map((b, i) => (
                <span key={`a-${i}`} className="font-heading text-lg tracking-[0.04em] text-[#8a8a84] transition-colors duration-300 hover:text-accent cursor-default select-none pr-14 whitespace-nowrap">{b}</span>
              ))}
              {marqueeHalf.map((b, i) => (
                <span key={`b-${i}`} aria-hidden="true" className="font-heading text-lg tracking-[0.04em] text-[#8a8a84] transition-colors duration-300 hover:text-accent cursor-default select-none pr-14 whitespace-nowrap">{b}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FACILITIES — Featured Venues Showcase
          ═══════════════════════════════════════════ */}
      <section className="py-24 sm:py-[140px] px-6 sm:px-10 bg-paper">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between flex-wrap gap-8 mb-14">
            <div>
              <p className="label-mono text-ink mb-4">// Cơ sở nổi bật</p>
              <h2 className="font-heading text-[clamp(2rem,5vw,4.5rem)] leading-[0.95] tracking-[-0.01em] uppercase text-ink">
                Sân đấu đẳng cấp.<br />Sẵn sàng mỗi ngày.
              </h2>
            </div>
            <Link to="/courts" className="btn-outline h-[52px] px-8 text-sm text-ink border-ink/30 hover:border-ink">
              Xem tất cả
            </Link>
          </div>

          <div ref={facilitiesRef} className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {facilities.map((f) => (
              <Link
                to="/courts"
                key={f.id}
                className={`group relative block border-2 border-ink rounded-[2px] card-lift img-zoom ${f.large ? 'lg:col-span-2' : ''}`}
              >
                <div className="relative h-[300px] sm:h-[400px]">
                  <img
                    src={f.image}
                    alt={f.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-transparent" />
                  {f.tag && (
                    <span className="absolute top-5 left-5 label-mono bg-accent text-ink px-3 py-1.5 rounded-[2px]">{f.tag}</span>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-7 flex items-end justify-between gap-4">
                    <div>
                      <h3 className="font-heading text-xl sm:text-2xl uppercase text-paper mb-1.5">{f.name}</h3>
                      <p className="label-mono text-paper/60">{f.sub}</p>
                    </div>
                    {f.isViewAll && (
                      <span className="shrink-0 w-11 h-11 border-2 border-paper/50 rounded-[2px] flex items-center justify-center text-paper transition-colors duration-300 group-hover:bg-accent group-hover:border-accent group-hover:text-ink" aria-hidden="true">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="7" y1="17" x2="17" y2="7" />
                          <polyline points="7 7 17 7 17 17" />
                        </svg>
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURES — Why Pro-Sport
          ═══════════════════════════════════════════ */}
      <section id="discover" className="pb-24 sm:pb-[140px] px-6 sm:px-10 bg-paper">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-16 sm:mb-[72px]">
            <p className="label-mono text-ink mb-4">// Tính năng hệ thống</p>
            <h2 className="font-heading text-[clamp(2rem,5vw,4.5rem)] leading-[0.95] tracking-[-0.01em] uppercase text-ink">
              Mọi thứ bạn cần.<br />Không thừa thãi.
            </h2>
          </div>

          <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[2px] bg-ink border-2 border-ink">
            {features.map((f) => (
              <article
                key={f.num}
                className={`p-11 sm:p-11 flex flex-col gap-6 transition-colors duration-300 ${f.dark ? 'bg-ink' : 'bg-paper hover:bg-[#eceae2]'}`}
              >
                <span className={`font-heading text-5xl leading-none ${f.dark ? 'text-paper/15' : 'text-ink/15'}`}>{f.num}</span>
                <div>
                  <h3 className={`font-heading text-lg uppercase tracking-[0.01em] mb-2.5 ${f.dark ? 'text-paper' : 'text-ink'}`}>{f.title}</h3>
                  <p className={`text-sm leading-[1.65] ${f.dark ? 'text-paper/60' : 'text-ink/70'}`}>{f.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS — 3 Steps
          ═══════════════════════════════════════════ */}
      <section className="pb-24 sm:pb-[140px] px-6 sm:px-10 bg-paper">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-12 lg:gap-20">
          <div>
            <p className="label-mono text-ink mb-4">// Cách hoạt động</p>
            <h2 className="font-heading text-[clamp(1.7rem,4vw,3.2rem)] leading-[0.98] uppercase tracking-[-0.01em] text-ink mb-6">
              Từ đăng ký<br />đến ngày ra sân.
            </h2>
            <p className="text-ink/70 text-[15px] leading-[1.7] max-w-[360px] mb-9">
              3 bước đơn giản để thay đổi cách bạn đặt sân, tìm đối thủ và quản lý thể thao.
            </p>
            <Link to="/register" className="btn-primary h-[54px] px-9 text-sm">
              Bắt đầu ngay
            </Link>
          </div>

          <div ref={stepsRef} className="flex flex-col">
            {steps.map((s, i) => (
              <article key={i} className={`flex gap-8 py-9 border-t-2 border-ink ${i === steps.length - 1 ? 'border-b-2' : ''}`}>
                <span className="font-heading text-4xl text-ink leading-none shrink-0">{s.num}</span>
                <div>
                  <h3 className="font-heading text-xl uppercase text-ink mb-2">{s.title}</h3>
                  <p className="text-sm text-ink/70 leading-[1.65]">{s.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STATS — Dark Counter Strip
          ═══════════════════════════════════════════ */}
      <section className="py-20 sm:py-[100px] px-6 sm:px-10 bg-ink">
        <div ref={statsRef} className="max-w-[1400px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {stats.map((s, i) => (
            <div key={i}>
              <p className="font-heading text-[clamp(2rem,5vw,4.2rem)] text-paper mb-2 leading-none">
                <span data-counter data-end={s.end} data-decimals={s.decimals || 0} data-suffix={s.suffix}>
                  {formatStat(s)}
                </span>
              </p>
              <p className="label-mono text-[#8a8a84]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA — Final Conversion Section
          ═══════════════════════════════════════════ */}
      <section className="py-24 sm:py-[140px] px-6 sm:px-10 bg-paper text-center">
        <div ref={ctaRef} className="max-w-[680px] mx-auto">
          <p className="label-mono text-ink mb-5">// Sẵn sàng ra sân?</p>
          <h2 className="font-heading text-[clamp(2rem,6vw,5.5rem)] leading-[0.95] uppercase tracking-[-0.01em] text-ink mb-7">
            Tham gia mạng lưới<br />Pro-Sport ngay hôm nay.
          </h2>
          <p className="text-ink/70 text-base leading-[1.7] max-w-[480px] mx-auto mb-11">
            Bắt đầu đặt sân, tìm đối thủ và nâng tầm trận đấu của bạn. Tham gia miễn phí, không ràng buộc.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Link to="/register" className="btn-primary h-[58px] px-10 text-sm">
              Tạo tài khoản miễn phí
            </Link>
            <Link to="/courts" className="btn-outline h-[58px] px-10 text-sm text-ink border-ink/30 hover:border-ink">
              Duyệt danh sách sân
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
