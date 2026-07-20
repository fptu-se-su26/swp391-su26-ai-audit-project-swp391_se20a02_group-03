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
    name: 'Velocity Court',
    sub: 'Sân Cầu Lông Trong Nhà • 6 Sân',
    tag: 'HOT',
    image: 'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=600&q=80',
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

      // Hero — ảnh nền blurred zoom-out lúc vào trang + parallax nhẹ khi cuộn
      gsap.fromTo(heroImgRef.current,
        { scale: 1.14 },
        { scale: 1.08, duration: 1.8, ease: 'power2.out' }
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
          HERO — 3D BREAKOUT (4 Layers)
          ═══════════════════════════════════════════ */}
      <section ref={heroSectionRef} className="relative min-h-screen overflow-hidden" style={{paddingTop:'76px', backgroundColor:'#050810'}}>

        {/* ── LAYER 1: Background — blurred dark court (── */}
        <div className="absolute inset-0 z-0">
          <img
            ref={heroImgRef}
            src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1920&q=80"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover will-change-transform"
            style={{ filter: 'blur(5px) brightness(0.28)', transform: 'scale(1.08)' }}
          />
          {/* Dual gradient vignette for depth */}
          <div className="absolute inset-0" style={{background: 'linear-gradient(to bottom, rgba(5,8,16,0.5) 0%, transparent 40%, rgba(5,8,16,0.75) 100%)'}} />
          <div className="absolute inset-0" style={{background: 'linear-gradient(to right, rgba(5,8,16,0.85) 0%, rgba(5,8,16,0.3) 50%, transparent 100%)'}} />
        </div>

        {/* ── LAYER 2: Athlete body BEHIND text (bottom 58%, z=2) ── */}
        <div
          className="absolute inset-0 z-[2] pointer-events-none"
          style={{ clipPath: 'inset(42% 0 0 0)' }}
        >
          <img
            src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1920&q=80"
            alt="Vận động viên cầu lông"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: '62% center' }}
          />
          <div className="absolute inset-0" style={{background: 'linear-gradient(to right, rgba(5,8,16,0.90) 0%, rgba(5,8,16,0.25) 45%, transparent 100%)'}} />
          <div className="absolute inset-0" style={{background: 'linear-gradient(to top, rgba(5,8,16,0.7) 0%, transparent 40%)'}} />
        </div>

        {/* ── LAYER 3: Giant typography backdrop — hollow text-stroke (── */}
        <div
          className="absolute inset-0 z-[3] flex items-center pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          <div
            className="w-full pl-[4%] sm:pl-[6%] uppercase select-none"
            style={{
              fontFamily: "'Montserrat', 'Be Vietnam Pro', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(5.5rem, 14vw, 17rem)',
              lineHeight: 0.88,
              letterSpacing: '-0.02em',
            }}
          >
            {[['HIỆU', false], ['SUẤT', false], ['ĐỈNH', true], ['CAO', true]].map(([word, teal]) => (
              <div
                key={word}
                style={{
                  WebkitTextStroke: teal
                    ? '1px rgba(20,184,166,0.08)'
                    : '1px rgba(255,255,255,0.05)',
                  color: teal ? 'rgba(20,184,166,0.03)' : 'transparent',
                }}
              >
                {word}
              </div>
            ))}
          </div>
        </div>

        {/* ── LAYER 4: Athlete upper-body IN FRONT of text (top 42%, z=4) ── */}
        <div
          className="absolute inset-0 z-[4] pointer-events-none"
          style={{ clipPath: 'inset(0 0 58% 0)' }}
        >
          <img
            src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1920&q=80"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: '62% center' }}
          />
        </div>

        {/* ── LAYER 5: Foreground UI — bottom-left (── */}
        <div
          ref={heroRef}
          className="relative z-[5] flex flex-col justify-end min-h-[calc(100vh-76px)] max-w-[1400px] mx-auto px-6 sm:px-10 pb-14 sm:pb-20"
        >
          <div style={{ maxWidth: '500px' }}>
            <p className="hero-fade label-mono mb-5">
              Cầu lông & Pickleball chuyên nghiệp
            </p>
            <h1
              className="hero-fade uppercase mb-5"
              style={{
                fontFamily: "'Montserrat', 'Be Vietnam Pro', sans-serif",
                fontSize: 'clamp(1.9rem, 3.8vw, 3.2rem)',
                fontWeight: 900,
                lineHeight: 1.18,
                letterSpacing: '0.025em',
                color: '#F5F5F5',
              }}
            >
              <span className="block overflow-hidden"><span className="hero-line block will-change-transform">Mượt mà.</span></span>
              <span className="block overflow-hidden"><span className="hero-line block will-change-transform">Kiểm soát.</span></span>
              <span className="block overflow-hidden"><span className="hero-line block will-change-transform" style={{ color: '#14b8a6' }}>Chính xác.</span></span>
            </h1>
            <p
              className="hero-fade leading-[1.7] mb-9"
              style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1rem', maxWidth: '420px' }}
            >
              Nền tảng đặt sân cầu lông & pickleball hàng đầu —
              đặt sân, ghép trận và thuê thiết bị chuyên nghiệp một cách liền mạch.
            </p>
            <div className="hero-fade flex gap-4 flex-wrap">
              <Link
                to="/register"
                className="inline-flex items-center justify-center h-[54px] px-9 text-sm font-extrabold uppercase tracking-[0.06em] rounded-[2px] no-underline transition-all duration-200"
                style={{ backgroundColor: '#14b8a6', color: '#050810' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor='#17cdbe'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor='#14b8a6'}
              >
                Bắt đầu miễn phí
              </Link>
              <Link
                to="/courts"
                className="inline-flex items-center justify-center h-[54px] px-9 text-sm font-extrabold uppercase tracking-[0.06em] rounded-[2px] no-underline transition-all duration-200"
                style={{ border: '2px solid rgba(255,255,255,0.35)', color: '#F5F5F5' }}
                onMouseEnter={e => e.currentTarget.style.borderColor='rgba(255,255,255,0.75)'}
                onMouseLeave={e => e.currentTarget.style.borderColor='rgba(255,255,255,0.35)'}
              >
                Xem demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TRUSTED BY — Infinite Brand Marquee
          ═══════════════════════════════════════════ */}
      <section className="bg-ink border-b border-white/10 py-9 px-6 sm:px-10">
        <div className="max-w-[1400px] mx-auto flex items-center gap-10">
          <span className="label-mono shrink-0">Đối tác & thương hiệu</span>
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
              <p className="label-mono mb-4">Cơ sở nổi bật</p>
              <h2
                className="uppercase leading-[1.05] tracking-[-0.01em] mb-0"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 900,
                  fontSize: 'clamp(2rem,5vw,4.2rem)',
                  color: '#111827',
                }}
              >
                Sân đấu đẳng cấp.<br />Sẵn sàng mỗi ngày.
              </h2>
            </div>
            <Link to="/courts" className="inline-flex items-center justify-center h-[52px] px-8 text-sm font-extrabold uppercase tracking-[0.06em] rounded-[2px] no-underline transition-colors duration-200" style={{backgroundColor:'#14b8a6', color:'#0a121e'}}>
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
                  {/* Mandatory bottom gradient for white text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  {f.tag && (
                    <span
                      className="absolute top-5 left-5 rounded-[2px] bg-accent text-[#050810]"
                      style={{
                        fontFamily:"'JetBrains Mono',monospace",
                        fontSize:'11px',
                        fontWeight:700,
                        textTransform:'uppercase',
                        letterSpacing:'0.14em',
                        padding:'4px 10px',
                      }}
                    >{f.tag}</span>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-7">
                    <h3 className="uppercase text-paper mb-2" style={{fontFamily:"'Montserrat',sans-serif",fontWeight:900,fontSize:'clamp(1.1rem,2vw,1.4rem)',letterSpacing:'0.01em'}}>{f.name}</h3>
                    <p className="label-mono" style={{color:'rgba(255,255,255,0.65)'}}>{f.sub}</p>
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
            <p className="label-mono mb-4">Tính năng hệ thống</p>
            <h2
              className="uppercase leading-[1.05] tracking-[-0.01em]"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 900,
                fontSize: 'clamp(2rem,5vw,4.2rem)',
                color: '#111827',
              }}
            >
              Mọi thứ bạn cần.<br />Không thừa thãi.
            </h2>
          </div>

          <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[2px] bg-ink border-2 border-ink">
            {features.map((f) => (
              <article
                key={f.num}
                className={`flex flex-col gap-6 transition-colors duration-300 ${f.dark ? 'bg-ink' : 'bg-paper hover:bg-[#eceae2]'}`}
                style={{padding: '52px'}}
              >
                <span
                  className={`leading-none ${f.dark ? 'text-paper/15' : 'text-ink/15'}`}
                  style={{fontFamily:"'Montserrat',sans-serif",fontWeight:900,fontSize:'3rem'}}
                >{f.num}</span>
                <div>
                  <h3
                    className={`uppercase tracking-[0.02em] mb-2.5 ${f.dark ? 'text-paper' : 'text-ink'}`}
                    style={{fontFamily:"'Montserrat',sans-serif",fontWeight:900,fontSize:'1rem'}}
                  >{f.title}</h3>
                  <p className={`text-sm leading-[1.65] ${f.dark ? 'text-paper/60' : ''}`} style={!f.dark ? {color:'#4A4A4A'} : {}}>{f.desc}</p>
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
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-12 lg:gap-20 lg:items-center">
          <div className="flex flex-col justify-center">
            <p className="label-mono mb-4">Cách hoạt động</p>
            <h2
              className="uppercase leading-[1.05] tracking-[-0.01em] mb-6"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 900,
                fontSize: 'clamp(1.7rem,4vw,3.2rem)',
                color: '#111827',
              }}
            >
              Từ đăng ký<br />đến ngày ra sân.
            </h2>
            <p className="text-ink/70 text-[15px] leading-[1.7] max-w-[360px] mb-9">
              3 bước đơn giản để thay đổi cách bạn đặt sân, tìm đối thủ và quản lý thể thao.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center justify-center h-[54px] px-9 text-sm font-extrabold uppercase tracking-[0.06em] rounded-[2px] no-underline transition-all duration-200 self-start"
              style={{backgroundColor:'#14b8a6', color:'#050810'}}
              onMouseEnter={e => e.currentTarget.style.backgroundColor='#17cdbe'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor='#14b8a6'}
            >
              Bắt đầu ngay
            </Link>
          </div>

          <div ref={stepsRef} className="flex flex-col">
            {steps.map((s, i) => (
              <article key={i} className={`flex gap-8 py-9 items-center border-t-2 border-ink ${i === steps.length - 1 ? 'border-b-2' : ''}`}>
                <span
                  className="leading-none shrink-0"
                  style={{fontFamily:"'Montserrat',sans-serif",fontWeight:900,fontSize:'2.5rem',color:'#111827'}}
                >{s.num}</span>
                <div>
                  <h3 className="uppercase text-ink mb-2" style={{fontFamily:"'Montserrat',sans-serif",fontWeight:900,fontSize:'1.05rem',letterSpacing:'0.02em'}}>{s.title}</h3>
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
              <p className="font-heading text-[clamp(2rem,5vw,4.2rem)] text-paper mb-3 leading-none">
                <span data-counter data-end={s.end} data-decimals={s.decimals || 0} data-suffix={s.suffix}>
                  {formatStat(s)}
                </span>
              </p>
              <p className="font-mono uppercase text-[#a0a09a] tracking-[0.12em]" style={{fontSize:'13px'}}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA — Final Conversion Section
          ═══════════════════════════════════════════ */}
      <section className="py-24 sm:py-[140px] px-6 sm:px-10 bg-paper text-center">
        <div ref={ctaRef} className="max-w-[960px] mx-auto">
          <p className="label-mono mb-5">Sẵn sàng ra sân?</p>
          <h2
            className="uppercase leading-[1.08] tracking-[-0.01em] mb-7"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(1.6rem,4.5vw,3.75rem)',
              color: '#111827',
            }}
          >
            Tham gia mạng lưới Pro-Sport<br />ngay hôm nay.
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
