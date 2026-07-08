import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProfileDropdown({ user }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()
  const { logout } = useAuth()

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const defaultAvatar = "https://ui-avatars.com/api/?name=" + (user?.fullName || 'Nguoi dung') + "&background=0d1b2a&color=f3f2ee&size=80"

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full transition-all duration-150 hover:ring-2 hover:ring-accent/30"
        aria-label="Menu hồ sơ"
      >
        <img
          src={user?.avatarUrl || defaultAvatar}
          alt={user?.fullName || 'Người dùng'}
          className="w-8 h-8 rounded-full object-cover"
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-surface border-2 border-border-strong rounded-[2px] py-1.5 z-50">
          <div className="px-4 py-3 border-b border-border-default">
            <p className="text-sm font-semibold text-foreground truncate">{user?.fullName || 'Người dùng'}</p>
            <p className="text-xs text-foreground-muted truncate">{user?.email || ''}</p>
          </div>
          <div className="py-1">
            <Link to="/apex/profile" onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-foreground-muted hover:bg-surface-hover hover:text-foreground transition-colors duration-150">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Hồ sơ
            </Link>
            <Link to="/apex/settings" onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-foreground-muted hover:bg-surface-hover hover:text-foreground transition-colors duration-150">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              Cài đặt
            </Link>
          </div>
          <div className="border-t border-border-default py-1">
            <button onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-danger hover:bg-danger-bg transition-colors duration-150 text-left">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
