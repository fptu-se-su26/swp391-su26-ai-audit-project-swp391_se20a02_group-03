import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const values = [
  {
    title: 'Đổi mới không ngừng',
    desc: 'Chúng tôi liên tục thách thức hiện tại, ứng dụng AI và phân tích dữ liệu nâng cao để cung cấp hệ thống ghép kèo và quản lý cơ sở vật chất chính xác nhất trong ngành.',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
  },
  {
    title: 'Thể thao cho mọi người',
    desc: 'Chúng tôi tin rằng thể thao là dành cho tất cả. Nền tảng của chúng tôi phá vỡ mọi rào cản, giúp cả người mới lẫn dân chuyên dễ dàng tìm sân, thuê đồ và đối thủ.',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  },
  {
    title: 'Hiệu suất đỉnh cao',
    desc: 'Chúng tôi không chấp nhận gì ngoài sự xuất sắc. Từ chất lượng của các cơ sở đối tác đến tốc độ của ứng dụng, hiệu suất là trọng tâm trong mọi việc chúng tôi làm.',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
  }
]

export default function BrandMissionPage() {
  const heroRef = useRef(null)
  const statementRef = useRef(null)
  const valuesRef = useRef(null)

  useEffect(() => {
    // Hero Animation
    gsap.fromTo(heroRef.current, 
      { opacity: 0, y: 50 }, 
      { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
    )

    // Statement Animation
    if (statementRef.current) {
      gsap.fromTo(statementRef.current.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power2.out',
          scrollTrigger: { trigger: statementRef.current, start: 'top 80%' } }
      )
    }

    // Values Animation
    if (valuesRef.current) {
      gsap.fromTo(valuesRef.current.children,
        { opacity: 0, scale: 0.95, y: 40 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'back.out(1.2)',
          scrollTrigger: { trigger: valuesRef.current, start: 'top 75%' } }
      )
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar theme="dark" />
      
      {/* ── Hero ── */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-[#0a0e1a] px-6">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1600&q=80')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a]/80 via-transparent to-[#0a0e1a]" />
        
        <div ref={heroRef} className="relative z-10 text-center max-w-[800px] mx-auto mt-16">
          <span className="inline-block text-[0.8rem] font-bold tracking-[0.2em] uppercase text-[#14B8A6] mb-6 border border-[#14B8A6]/30 px-5 py-2 rounded-full bg-[#14B8A6]/10 backdrop-blur-sm">Sứ mệnh Thương hiệu</span>
          <h1 className="font-['Oswald'] text-[clamp(2.5rem,5vw,4.5rem)] font-bold text-[var(--theme-primary)] leading-[1.1] mb-6">
            Truyền cảm hứng để Thế giới<br />chơi thể thao nhiều hơn.
          </h1>
          <p className="text-[1.1rem] text-[var(--theme-primary)]/70 leading-[1.6] max-w-[600px] mx-auto">
            Chúng tôi đang xây dựng hạ tầng kỹ thuật số cho thế giới thể thao thực tế. Kết nối vận động viên, cơ sở và cộng đồng trên toàn cầu.
          </p>
        </div>
      </section>

      {/* ── The Statement ── */}
      <section className="py-[100px] bg-white">
        <div className="container max-w-[900px] mx-auto text-center" ref={statementRef}>
          <svg className="w-12 h-12 text-[#14B8A6] mx-auto mb-8 opacity-40" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
          <h2 className="font-['Oswald'] text-[clamp(1.8rem,3vw,2.5rem)] font-bold text-[#0a0e1a] leading-[1.3] mb-8">
            "Chúng tôi hướng đến một thế giới nơi việc tìm sân, tham gia kèo đấu hay thuê đồ dễ dàng như việc gọi một ly cà phê. PRO-SPORT chính là nhịp cầu nối khát vọng con người với thành tích thể thao."
          </h2>
          <div className="w-[60px] h-[3px] bg-[#14B8A6] mx-auto mb-6" />
          <p className="text-[0.95rem] font-bold text-slate-900 tracking-wide uppercase">Đội ngũ sáng lập PRO-SPORT</p>
        </div>
      </section>

      {/* ── Core Values ── */}
      <section className="py-[100px] bg-[#f8fafb] border-y border-slate-200">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="font-['Oswald'] text-[2.2rem] font-bold text-[#0a0e1a] mb-4">Động lực của chúng tôi</h2>
            <p className="text-slate-500 max-w-[500px] mx-auto">Những nguyên tắc cốt lõi dẫn dắt mọi tính năng chúng tôi xây dựng và mọi mối quan hệ hợp tác.</p>
          </div>
          
          <div ref={valuesRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <div key={i} className="bg-white p-10 rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border-[1.5px] border-transparent hover:border-[#14B8A6] transition-all duration-300 hover:-translate-y-2 group">
                <div className="w-[60px] h-[60px] rounded-2xl bg-[rgba(0,200,170,0.1)] text-[#14B8A6] flex items-center justify-center mb-6 group-hover:bg-[#14B8A6] group-hover:text-[var(--theme-primary)] transition-colors duration-300">
                  {v.icon}
                </div>
                <h3 className="font-['Oswald'] text-[1.4rem] font-bold text-[#0a0e1a] mb-4">{v.title}</h3>
                <p className="text-slate-500 leading-[1.7]">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Visual Impact ── */}
      <section className="py-[120px] bg-white overflow-hidden">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1526676037777-05a232554f77?w=800&q=80" alt="Athletes" className="rounded-[24px] shadow-2xl relative z-10" />
            <div className="absolute -top-8 -right-8 w-full h-full border-2 border-[#14B8A6] rounded-[24px] -z-0 max-md:hidden" />
          </div>
          <div className="pr-4">
            <h2 className="font-['Oswald'] text-[2.4rem] font-bold text-[#0a0e1a] leading-[1.2] mb-6">
              Building a Community of Champions
            </h2>
            <p className="text-slate-600 leading-[1.8] mb-6 text-[1.05rem]">
              Sứ mệnh của chúng tôi vượt xa khỏi ranh giới phần mềm. Chúng tôi tích cực bồi dưỡng một cộng đồng những người đam mê thể thao toàn cầu. Thông qua nền tảng này, chúng tôi tạo điều kiện cho các giải đấu địa phương, tài trợ các vận động viên phong trào, và cung cấp công cụ cho các huấn luyện viên độc lập phát triển.
            </p>
            <p className="text-slate-600 leading-[1.8] mb-8 text-[1.05rem]">
              Khi bạn sử dụng PRO-SPORT, bạn không chỉ đang đặt sân—bạn đang tham gia vào một phong trào cống hiến vì sức khỏe, sự cạnh tranh và đam mê chung.
            </p>
            <Link to="/register" className="inline-flex items-center justify-center bg-[#14B8A6] text-[var(--theme-primary)] px-8 py-4 rounded-full font-bold text-[0.95rem] hover:bg-[#00b095] hover:shadow-[0_8px_20px_rgba(0,200,170,0.3)] transition-all duration-300 hover:-translate-y-1">
              Join Our Mission →
            </Link>
          </div>
        </div>
      </section>

      <Footer variant="dark" />
    </div>
  )
}
