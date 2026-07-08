import { useState } from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../hooks/useNotifications';

export default function NotificationBell() {
  const { isAuthenticated } = useAuth();
  const { notifications, unreadCount, clear } = useNotifications(isAuthenticated);
  const [open, setOpen] = useState(false);

  if (!isAuthenticated) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 text-foreground-muted hover:text-foreground transition-colors"
        aria-label="Thông báo"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 min-w-[18px] h-[18px] px-1 text-[10px] font-bold bg-danger text-paper rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-auto bg-surface border-2 border-border-strong rounded-[2px] z-[200]">
          <div className="flex items-center justify-between px-3 py-2 border-b border-border-default">
            <span className="font-heading text-sm uppercase">Thông báo</span>
            <button type="button" className="label-mono text-accent" onClick={clear}>
              Xóa
            </button>
          </div>
          {notifications.length === 0 ? (
            <p className="p-4 text-sm text-foreground-muted">Chưa có thông báo mới</p>
          ) : (
            notifications.map((n, i) => (
              <div key={`${n.type}-${i}`} className="px-3 py-2 border-b border-border-default text-sm">
                <p className="font-medium">{n.title}</p>
                <p className="text-foreground-muted text-xs mt-0.5">{n.message}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
