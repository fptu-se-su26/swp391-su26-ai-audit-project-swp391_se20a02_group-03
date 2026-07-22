import { useState, useRef, useEffect } from 'react'

export default function NotificationMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const notifications = [
    { id: 1, text: 'Đã xác nhận đặt Sân A1', time: '2 phút trước', read: false },
    { id: 2, text: 'Lời mời chơi từ Minh K.', time: '1 giờ trước', read: false },
    { id: 3, text: 'Dụng cụ thuê hết hạn trong 2 giờ', time: '3 giờ trước', read: true },
  ]

  const unread = notifications.filter(n => !n.read).length

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative flex items-center justify-center w-10 h-10 rounded-[2px] text-foreground-muted hover:bg-surface-hover hover:text-foreground transition-colors"
        aria-label="Thông báo"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 bg-danger text-paper w-4 h-4 flex items-center justify-center rounded-full text-[10px] font-bold">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200/60 rounded-[16px] shadow-[0_12px_40px_rgba(0,0,0,0.08)] z-50 overflow-hidden origin-top-right transition-all">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white/50 backdrop-blur-sm">
            <h3 className="font-heading text-[13px] font-bold uppercase tracking-widest text-slate-800 m-0">Thông báo</h3>
            {unread > 0 && (
              <span className="text-[11px] font-bold tracking-widest text-[#14b8a6] uppercase">{unread} mới</span>
            )}
          </div>
          <div className="max-h-[360px] overflow-y-auto bg-white">
            {notifications.map(n => (
              <div key={n.id} className={`px-5 py-3.5 border-b border-slate-50 last:border-b-0 hover:bg-slate-50/80 transition-colors duration-200 cursor-pointer flex items-start gap-3 ${!n.read ? 'bg-teal-50/30' : ''}`}>
                {!n.read ? (
                  <span className="w-2 h-2 rounded-full bg-[#14b8a6] mt-1.5 shrink-0 shadow-[0_0_8px_rgba(20,184,166,0.4)]" />
                ) : (
                  <span className="w-2 h-2 shrink-0" />
                )}
                <div className="flex-1">
                  <p className={`text-[14px] leading-snug mb-1 ${!n.read ? 'font-bold text-slate-800' : 'font-medium text-slate-600'}`}>{n.text}</p>
                  <p className="text-[12px] font-medium text-slate-400">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3.5 border-t border-slate-100 bg-gray-50/50 text-center">
            <button className="text-[12px] font-bold uppercase tracking-widest text-[#14b8a6] hover:text-[#0f9e8c] transition-colors outline-none cursor-pointer bg-transparent border-none">
              Xem tất cả thông báo
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
