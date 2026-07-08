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
        <div className="absolute right-0 top-full mt-2 w-80 bg-surface border-2 border-border-strong rounded-[2px] z-50">
          <div className="px-4 py-3 border-b border-border-default flex items-center justify-between">
            <h3 className="font-heading text-sm uppercase text-foreground">Thông báo</h3>
            {unread > 0 && (
              <span className="label-mono text-accent">{unread} mới</span>
            )}
          </div>
          <div className="max-h-[320px] overflow-y-auto">
            {notifications.map(n => (
              <div key={n.id} className={`px-4 py-3 border-b border-border-default last:border-b-0 hover:bg-surface-hover transition-colors duration-150 cursor-pointer ${!n.read ? 'bg-accent/5' : ''}`}>
                <div className="flex items-start gap-3">
                  {!n.read && <span className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />}
                  <div className={!n.read ? '' : 'ml-5'}>
                    <p className="text-sm text-foreground">{n.text}</p>
                    <p className="text-xs text-foreground-subtle mt-0.5">{n.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-2.5 border-t border-border-default">
            <button className="label-mono text-accent hover:underline w-full text-center">
              Xem tất cả thông báo
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
