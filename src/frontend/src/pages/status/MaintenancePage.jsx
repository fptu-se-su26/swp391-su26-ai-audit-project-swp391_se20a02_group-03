import ProSportLogo from '../../components/ui/ProSportLogo'

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background-base font-sans">
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="card-base flex flex-col md:flex-row max-w-[900px] w-full overflow-hidden p-0">
          {/* Left Side */}
          <div className="flex-1 p-8 bg-surface flex flex-col">
            <div className="flex-1 rounded-[2px] overflow-hidden relative mb-6 border-2 border-border-strong">
              <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80" alt="Bảo trì máy chủ" className="w-full h-full object-cover min-h-[240px]" />
              <div className="absolute bottom-4 right-4 bg-ink text-paper p-2 px-4 rounded-[2px] label-mono flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                Tinh chỉnh hệ thống
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <div className="bg-surface border-2 border-border-strong rounded-[2px] p-4 min-w-[80px] text-center">
                <span className="block font-heading text-3xl text-accent leading-none mb-1">02</span>
                <span className="label-mono text-foreground-subtle">GIỜ</span>
              </div>
              <span className="font-heading text-2xl text-foreground-subtle">:</span>
              <div className="bg-surface border-2 border-border-strong rounded-[2px] p-4 min-w-[80px] text-center">
                <span className="block font-heading text-3xl text-accent leading-none mb-1">45</span>
                <span className="label-mono text-foreground-subtle">PHÚT</span>
              </div>
              <span className="font-heading text-2xl text-foreground-subtle">:</span>
              <div className="bg-surface border-2 border-border-strong rounded-[2px] p-4 min-w-[80px] text-center">
                <span className="block font-heading text-3xl text-accent leading-none mb-1">12</span>
                <span className="label-mono text-foreground-subtle">GIÂY</span>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex-1 p-12 flex flex-col justify-center">
            <div className="mb-6">
              <ProSportLogo size="md" />
            </div>
            <h2 className="font-heading text-[2.25rem] uppercase text-foreground leading-tight mb-4">Chúng tôi đang nâng cấp hiệu suất.</h2>
            <p className="text-base text-foreground-muted leading-relaxed mb-8">
              PRO-SPORT hiện đang trong quá trình bảo trì định kỳ để mang đến cho bạn những tính năng tinh hoa mới. Đội ngũ của chúng tôi đang tích cực tinh chỉnh hệ thống.
            </p>

            <div>
              <div className="flex items-center bg-surface border-2 border-border-strong rounded-[2px] p-1 pl-4 gap-3 mb-10">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground-subtle"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <input type="email" placeholder="Nhập email để nhận thông báo" className="flex-1 border-none outline-none bg-transparent font-sans text-sm text-foreground placeholder:text-foreground-subtle" />
                <button className="btn-primary">Thông báo cho tôi</button>
              </div>
            </div>

            <div className="flex justify-between items-center border-t-2 border-border-default pt-6">
              <span className="text-sm text-foreground-muted">Theo dõi cập nhật trên các kênh của chúng tôi:</span>
              <div className="flex gap-2">
                <a href="#" className="w-8 h-8 rounded-[2px] border-2 border-border-strong flex items-center justify-center text-foreground-muted transition-colors duration-200 hover:border-accent hover:text-accent">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </a>
                <a href="#" className="w-8 h-8 rounded-[2px] border-2 border-border-strong flex items-center justify-center text-foreground-muted transition-colors duration-200 hover:border-accent hover:text-accent">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

