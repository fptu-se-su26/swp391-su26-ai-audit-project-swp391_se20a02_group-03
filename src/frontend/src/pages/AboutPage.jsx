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
  { year: '2021', title: '50 Cơ sở đầu tiên', desc: 'Hợp tác với các câu lạc bộ tennis, sân cầu lông và khu liên hợp thể thao tại Việt Nam.' },
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
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar theme="dark" />

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-[68px] px-6 pb-[60px] bg-[#0a0e1a] after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-t after:from-[rgba(10,14,26,0.95)] after:via-[rgba(10,14,26,0.4)] after:to-transparent">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=1400&q=70')] bg-cover bg-center opacity-[0.22]" />
        <div ref={heroRef} className="relative z-[1] text-center max-w-[780px] container">
          <span className="inline-block text-[0.72rem] font-bold tracking-[0.15em] uppercase text-[#14B8A6] mb-5 px-4 py-1.5 rounded-full border border-[#14B8A6]/30 bg-[#14B8A6]/10">Về PRO-SPORT</span>
          <h1 className="font-['Oswald'] text-[clamp(2rem,4.5vw,3.5rem)] font-bold text-[var(--theme-primary)] leading-[1.1] tracking-[-0.01em] mb-[22px]">
            Định hình lại Tương lai<br />Hiệu suất Thể thao.
          </h1>
          <p className="text-[1.05rem] text-[var(--theme-primary)]/65 leading-[1.7] max-w-[540px] mx-auto mb-8">
            Chúng tôi thu hẹp khoảng cách giữa tiềm năng con người và độ chính xác của công nghệ,
            xây dựng môi trường nơi các vận động viên tinh hoa được rèn giũa.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/courts" className="bg-[#14B8A6] hover:bg-[#0D9488] hover:shadow-[0_0_24px_rgba(0,200,170,0.25)] hover:-translate-y-[1px] text-[var(--theme-primary)] rounded-full font-semibold tracking-[0.03em] transition-all inline-flex items-center gap-2 px-[26px] py-[13px] text-[0.95rem]">
              Khám phá cơ sở →
            </Link>
            <Link to="/contact" className="bg-transparent text-[var(--theme-primary)] border-[1.5px] border-white/25 rounded-full font-medium transition-all hover:border-[#14B8A6] hover:text-[#14B8A6] hover:bg-[#14B8A6]/5 inline-flex items-center gap-2 px-[22px] py-[13px] text-[0.95rem]">
              Liên hệ
            </Link>
          </div>
        </div>
      </section>

      {/* ── Brvà Mission ── */}
      <section className="py-20 bg-white">
        <div ref={missionRef} className="container grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-[0.72rem] font-bold tracking-[0.15em] uppercase text-[#14B8A6] mb-4 block">Sứ mệnh</span>
            <h2 className="font-['Oswald'] text-[clamp(1.6rem,3vw,2.4rem)] font-bold text-slate-900 leading-[1.15] mb-6">
              Tiếp sức Vận động viên qua<br />Công nghệ & Cơ sở vật chất Cao cấp
            </h2>
            <p className="text-[0.95rem] text-slate-500 leading-[1.75] mb-6">
              PRO-SPORT ra đời từ một niềm tin đơn giản: mọi vận động viên đều xứng đáng tiếp cận cơ sở vật chất đẳng cấp thế giới và các công cụ thông minh giúp họ đạt hiệu suất đỉnh cao. Chúng tôi kết hợp công nghệ tiên tiến với các địa điểm cao cấp để tạo ra một hệ sinh thái nơi vận động viên mọi cấp độ có thể rèn luyện, thi đấu và phát triển.: 
            </p>
            <p className="text-[0.95rem] text-slate-500 leading-[1.75] mb-8">
              Nền tảng của chúng tôi kết nối <strong className="text-slate-800">200+ cơ sở</strong>, <strong className="text-slate-800">500,000+ vận động viên</strong>, và <strong className="text-slate-800">các chương trình huấn luyện chuyên nghiệp</strong> vào một trải nghiệm liền mạch — từ việc đặt sân đến tìm kèo đấu hoàn hảo.
            </p>
            <div className="flex gap-6 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#14B8A6]/10 flex items-center justify-center text-[#14B8A6]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <span className="text-[0.88rem] font-medium text-slate-700">Hệ thống Đặt sân Thông minh</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#14B8A6]/10 flex items-center justify-center text-[#14B8A6]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <span className="text-[0.88rem] font-medium text-slate-700">Ghép kèo AI</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#14B8A6]/10 flex items-center justify-center text-[#14B8A6]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <span className="text-[0.88rem] font-medium text-slate-700">Phân tích Thời gian thực</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=700&q=80" alt="Huấn luyện thể thao" className="w-full h-[420px] object-cover rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.12)]" />
            <div className="absolute -bottom-5 -left-5 bg-[#0a0e1a] text-[var(--theme-primary)] rounded-xl px-6 py-4 shadow-lg max-w-[220px]">
              <p className="font-['Oswald'] text-[2rem] font-bold text-[#14B8A6] leading-none">5+</p>
              <p className="text-[0.82rem] text-[var(--theme-primary)]/60 mt-1">Năm xuất sắc trong Công nghệ Thể thao</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Banner ── */}
      <section className="py-14 bg-[#0a0e1a]">
        <div ref={statsRef} className="container flex justify-center gap-16 flex-wrap">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <p className="font-['Oswald'] text-[2.2rem] font-bold text-[#14B8A6] leading-none">{s.value}</p>
              <p className="text-[0.82rem] text-[var(--theme-primary)]/50 mt-2 tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Our Journey ── */}
      <section className="py-20 bg-white">
        <div className="container">
          <span className="text-[0.72rem] font-bold tracking-[0.15em] uppercase text-[#14B8A6] mb-3 block">Chúng tôi làm gì</span>
          <h2 className="section-title mb-9 after:content-[''] after:block after:w-12 after:h-[3px] after:bg-[#14B8A6] after:mt-[10px]">Hành trình</h2>
          <div ref={journeyRef} className="grid grid-cols-[1.3fr_1fr] grid-rows-[220px_220px] gap-4 max-md:grid-cols-1 max-md:grid-rows-[240px_180px_180px]">
            {journey.map((item) => (
              <div key={item.label} className={`relative rounded-[16px] overflow-hidden cursor-pointer group ${item.large ? 'row-span-2 max-md:row-span-1' : ''}`}>
                <img src={item.image} alt={item.label} className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/[0.72] to-transparent flex flex-col justify-end p-5 gap-[6px]">
                  <span className="text-[0.68rem] font-bold tracking-[0.12em] text-[#14B8A6] uppercase">{item.tag}</span>
                  <p className="font-['Oswald'] text-[1.05rem] font-bold text-[var(--theme-primary)]">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Core Principles ── */}
      <section className="py-20 bg-[var(--color-bg)]">
        <div className="container">
          <div className="text-center mb-[52px]">
            <span className="text-[0.72rem] font-bold tracking-[0.15em] uppercase text-[#14B8A6] mb-3 block">Tại sao chọn chúng tôi</span>
            <h2 className="section-title">Nguyên tắc Cốt lõi</h2>
            <p className="section-subtitle">Nền tảng thúc đẩy cam kết của chúng tôi đối với sự xuất sắc trong thể thao.</p>
          </div>
          <div ref={principlesRef} className="grid grid-cols-3 gap-6 max-md:grid-cols-1">
            {principles.map((p) => (
              <div key={p.title} className="bg-white rounded-[16px] px-7 py-9 border-[1.5px] border-slate-200 transition-all hover:shadow-md hover:-translate-y-1 hover:border-[#14B8A6] group">
                <div className="w-12 h-12 rounded-xl bg-[rgba(0,200,170,0.1)] flex items-center justify-center text-[#14B8A6] mb-[18px] transition-all group-hover:bg-[#14B8A6] group-hover:text-[var(--theme-primary)]">{p.icon}</div>
                <h3 className="font-['Oswald'] text-[1.2rem] font-bold text-[#0a0e1a] mb-[10px]">{p.title}</h3>
                <p className="text-sm text-slate-500 leading-[1.65] mb-5">{p.desc}</p>
                <div className="flex flex-col gap-[2px] border-t border-slate-200 pt-4">
                  <span className="font-['Oswald'] text-[1.6rem] font-bold text-[#14B8A6]">{p.stat}</span>
                  <span className="text-[0.78rem] text-slate-400">{p.statLabel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-14">
            <span className="text-[0.72rem] font-bold tracking-[0.15em] uppercase text-[#14B8A6] mb-3 block">Câu chuyện</span>
            <h2 className="section-title">Từ Tầm nhìn đến Hiện thực</h2>
            <p className="section-subtitle">Những cột mốc quan trọng trong hành trình thay đổi quản lý thể thao.</p>
          </div>
          <div ref={timelineRef} className="relative max-w-[700px] mx-auto">
            {/* Timeline line */}
            <div className="absolute left-[22px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#14B8A6] via-[#14B8A6]/40 to-transparent max-md:left-[18px]" />
            {milestones.map((m, i) => (
              <div key={m.year} className="timeline-item relative flex gap-6 mb-8 last:mb-0 pl-[52px] max-md:pl-[44px]">
                {/* Dot */}
                <div className={`absolute left-[14px] top-1 w-[18px] h-[18px] rounded-full border-[3px] ${i === milestones.length - 1 ? 'border-[#14B8A6] bg-[#14B8A6] shadow-[0_0_12px_rgba(0,200,170,0.4)]' : 'border-[#14B8A6] bg-white'} max-md:left-[10px]`} />
                <div className="bg-[#f8fafb] border border-slate-200 rounded-xl px-6 py-5 flex-1 transition-all hover:shadow-md hover:border-[#14B8A6]/40">
                  <span className="text-[0.72rem] font-bold tracking-[0.1em] text-[#14B8A6] uppercase">{m.year}</span>
                  <h3 className="font-['Oswald'] text-[1.05rem] font-bold text-slate-900 mt-1 mb-1.5">{m.title}</h3>
                  <p className="text-[0.85rem] text-slate-500 leading-[1.65]">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Leadership Team ── */}
      <section className="py-20 bg-[var(--color-bg)]">
        <div className="container">
          <div className="text-center mb-14">
            <span className="text-[0.72rem] font-bold tracking-[0.15em] uppercase text-[#14B8A6] mb-3 block">Con người</span>
            <h2 className="section-title">Ban Lãnh đạo</h2>
            <p className="section-subtitle">Những người có tầm nhìn thúc đẩy sứ mệnh của PRO-SPORT.</p>
          </div>
          <div ref={teamRef} className="grid grid-cols-4 gap-6 max-lg:grid-cols-2 max-md:grid-cols-1">
            {team.map(t => (
              <div key={t.name} className="bg-white rounded-[16px] border-[1.5px] border-slate-200 overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 hover:border-[#14B8A6] group">
                <div className="relative h-[220px] overflow-hidden">
                  <img src={t.avatar} alt={t.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <p className="text-[0.78rem] text-[var(--theme-primary)]/90 italic leading-[1.5]">"{t.quote}"</p>
                  </div>
                </div>
                <div className="px-5 py-4">
                  <h3 className="font-['Oswald'] text-[1.05rem] font-bold text-slate-900">{t.name}</h3>
                  <p className="text-[0.82rem] text-[#14B8A6] font-medium mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Partners ── */}
      <section className="py-14 bg-white border-y border-slate-200">
        <div className="container">
          <p className="text-center text-[0.72rem] font-bold tracking-[0.15em] text-slate-400 uppercase mb-8">Đối tác & thương hiệu tin cậy</p>
          <div className="flex justify-center items-center gap-[52px] flex-wrap">
            {partners.map(b => (
              <span key={b} className="font-['Oswald'] text-[1.1rem] font-bold tracking-[0.08em] text-slate-400 transition-colors hover:text-[#14B8A6] cursor-default">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Global Operations ── */}
      <section className="pt-20 pb-[100px] bg-[#0a0e1a] text-[var(--theme-primary)] text-center overflow-hidden">
        <div className="container">
          <span className="text-[0.72rem] font-bold tracking-[0.15em] uppercase text-[#14B8A6] mb-4 block">Hiện diện Toàn cầu</span>
          <h2 className="font-['Oswald'] text-[2rem] font-bold mb-3">Hoạt động Toàn cầu</h2>
          <p className="text-[0.9rem] text-[var(--theme-primary)]/55 max-w-[500px] mx-auto mb-[52px] leading-[1.65]">Hoạt động tại 14 thành phố, mang hạ tầng thể thao đẳng cấp nhất quán khắp Đông Nam Á và xa hơn nữa.</p>
          <div className="relative flex items-center justify-center min-h-[160px]">
            <div className="font-['Oswald'] text-[clamp(2rem,6vw,5rem)] font-bold tracking-[0.15em] text-[#14B8A6] opacity-25 select-none">MẠNG LƯỚI ĐANG HOẠT ĐỘNG</div>
            <div className="absolute inset-0 flex flex-wrap gap-[18px] justify-center items-center pointer-events-none">
              {[...Array(40)].map((_, i) => (
                <div key={i} className="w-1 h-1 rounded-full bg-[#14B8A6] opacity-40 animate-[pulse-glow_2.5s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.08}s` }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-20 bg-gradient-to-br from-[#f0f7f6] via-[#e8f4f8] to-[#dceef8]">
        <div className="container text-center">
          <h2 className="font-['Oswald'] text-[clamp(1.6rem,3vw,2.4rem)] font-bold text-slate-900 leading-[1.15] mb-4">
            Sẵn sàng nâng tầm trận đấu?
          </h2>
          <p className="text-[0.95rem] text-slate-500 max-w-[480px] mx-auto leading-[1.7] mb-8">
            Tham gia cùng hơn 500.000 vận động viên tin tưởng PRO-SPORT cho tập luyện, kèo đấu và hành trình thi đấu.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/register" className="bg-[#14B8A6] hover:bg-[#0D9488] hover:shadow-[0_0_24px_rgba(0,200,170,0.25)] hover:-translate-y-[1px] text-[var(--theme-primary)] rounded-full font-semibold tracking-[0.03em] transition-all inline-flex items-center gap-2 px-[28px] py-[14px] text-[0.95rem]">
              Bắt đầu miễn phí →
            </Link>
            <Link to="/contact" className="bg-transparent text-slate-900 border-[1.5px] border-slate-200 rounded-full font-medium transition-all hover:border-[#14B8A6] hover:text-[#14B8A6] hover:bg-[#14B8A6]/5 inline-flex items-center gap-2 px-[24px] py-[14px] text-[0.95rem]">
              Liên hệ kinh doanh
            </Link>
          </div>
        </div>
      </section>

      <Footer variant="dark" />
    </div>
  )
}
