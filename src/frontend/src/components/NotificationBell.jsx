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
        className="relative p-2 transition-colors outline-none"
        aria-label="Thông báo"
      >
        <Bell size={20} className={open ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 min-w-[18px] h-[18px] px-1 text-[10px] font-bold bg-[#14b8a6] text-white rounded-full flex items-center justify-center shadow-sm">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-[340px] max-h-[480px] flex flex-col bg-white rounded-[12px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 z-[200] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <span className="font-bold text-[14px] text-gray-900 uppercase tracking-wider m-0">Thông báo</span>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && <span className="text-[12px] font-bold tracking-wider text-[#14b8a6] uppercase">{unreadCount} mới</span>}
              {notifications.length > 0 && (
                <button type="button" className="text-[12px] font-medium text-gray-400 hover:text-gray-600 transition-colors" onClick={clear}>
                  Xóa
                </button>
              )}
            </div>
          </div>
          <div className="overflow-auto flex flex-col bg-white">
          {notifications.length === 0 ? (
            <p className="p-8 text-center text-[13px] text-gray-500 m-0">Chưa có thông báo mới</p>
          ) : (
            notifications.map((n, i) => (
              <div key={`${n.type}-${i}`} className="px-5 py-4 border-b border-gray-50 last:border-b-0 text-[14px] hover:bg-gray-50 cursor-pointer transition-colors flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${i < unreadCount ? 'bg-[#14b8a6]' : 'bg-transparent'}`}></div>
                <div className="flex flex-col">
                  <p className="font-medium text-gray-800 m-0">{n.title}</p>
                  <p className="text-gray-500 text-[12px] mt-1 m-0">{n.message}</p>
                </div>
              </div>
            ))
          )}
          </div>
          <div className="px-5 py-4 text-center border-t border-gray-100 bg-white">
             <button className="text-[13px] font-bold uppercase tracking-[0.1em] text-[#14b8a6] hover:text-[#15c3b0] transition-colors outline-none cursor-pointer bg-transparent border-none">
               Xem tất cả thông báo
             </button>
          </div>
        </div>
      )}
    </div>
  );
}
