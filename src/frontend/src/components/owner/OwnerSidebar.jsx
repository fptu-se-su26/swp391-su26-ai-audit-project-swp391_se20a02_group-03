import { Link, useLocation } from 'react-router-dom';
import ProSportLogo from '../ui/ProSportLogo';
import {
  LayoutDashboard,
  Building2,
  Map,
  Clock,
  CalendarDays,
  Calendar,
  CircleDollarSign,
  Package,
  Ticket,
  Users,
  UserCheck,
  MessageSquare,
  BarChart3,
  LineChart,
  History,
  Settings,
  ShieldAlert,
  LogOut,
  X
} from 'lucide-react';

const navGroups = [
  {
    label: 'Tổng quan',
    items: [
      { path: '/owner/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    ]
  },
  {
    label: 'Vận hành sân',
    items: [
      { path: '/owner/complex', label: 'Tổ hợp', icon: <Building2 size={18} /> },
      { path: '/owner/courts', label: 'Sân', icon: <Map size={18} /> },
      { path: '/owner/operating-hours', label: 'Giờ mở cửa', icon: <Clock size={18} /> },
    ]
  },
  {
    label: 'Booking',
    items: [
      { path: '/owner/bookings/calendar', label: 'Lịch Calendar', icon: <CalendarDays size={18} /> },
      { path: '/owner/bookings', label: 'Lịch sử đặt sân', icon: <Calendar size={18} /> },
    ]
  },
  {
    label: 'Sản phẩm & Khuyến mãi',
    items: [
      { path: '/owner/pricing', label: 'Bảng giá', icon: <CircleDollarSign size={18} /> },
      { path: '/owner/inventory/products', label: 'Kho sản phẩm', icon: <Package size={18} /> },
      { path: '/owner/vouchers', label: 'Voucher', icon: <Ticket size={18} /> },
    ]
  },
  {
    label: 'Khách hàng & Nhân sự',
    items: [
      { path: '/owner/staff', label: 'Nhân viên', icon: <UserCheck size={18} /> },
      { path: '/owner/memberships', label: 'Hội viên', icon: <Users size={18} /> },
      { path: '/owner/reviews', label: 'Đánh giá', icon: <MessageSquare size={18} /> },
    ]
  },
  {
    label: 'Tài chính & Báo cáo',
    items: [
      { path: '/owner/finance', label: 'Tài chính', icon: <LineChart size={18} /> },
      { path: '/owner/reports', label: 'Báo cáo', icon: <BarChart3 size={18} /> },
    ]
  },
  {
    label: 'Hệ thống',
    items: [
      { path: '/owner/cancellation-policy', label: 'Chính sách hủy', icon: <ShieldAlert size={18} /> },
      { path: '/owner/audit-logs', label: 'Nhật ký', icon: <History size={18} /> },
      { path: '/owner/settings', label: 'Cài đặt', icon: <Settings size={18} /> },
    ]
  }
];

function GroupLabel({ children }) {
  return (
    <p className="px-8 pt-6 pb-2 text-[10px] font-bold uppercase tracking-widest text-white/40 m-0">
      {children}
    </p>
  );
}

function NavItem({ link, isActive, onClick }) {
  return (
    <Link
      to={link.path}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 mx-4 rounded-[8px] font-bold text-[13px] uppercase tracking-[0.02em] transition-all duration-200 ease-in-out no-underline ${
        isActive
          ? 'bg-white/10 text-white shadow-sm'
          : 'text-white/50 hover:text-white hover:bg-white/5'
      }`}
    >
      <span className={`shrink-0 ${isActive ? 'text-[#14b8a6]' : ''}`}>{link.icon}</span>
      <span>{link.label}</span>
    </Link>
  );
}

export default function OwnerSidebar({ open, collapsed, isHidden, asideRef, onClose, displayName, onLogout }) {
  const location = useLocation();
  
  // Exact match for dashboard to prevent matching everything
  const isActive = (path) => {
    if (path === '/owner' || path === '/owner/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside 
      id="owner-sidebar"
      ref={asideRef}
      aria-label="Sidebar navigation"
      aria-hidden={isHidden ? 'true' : undefined}
      inert={isHidden ? '' : undefined}
      className={`w-[260px] h-screen bg-ink flex flex-col fixed left-0 top-0 bottom-0 z-[200] transition-transform duration-200 ${
        collapsed ? '-translate-x-full' : 'translate-x-0'
      } ${
        open ? 'max-[900px]:!translate-x-0' : 'max-[900px]:!-translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between px-6 h-16 border-b border-white/10 shrink-0">
        <ProSportLogo size="sm" variant="light" to="/owner/dashboard" onClick={onClose} />
        <button
          type="button"
          data-owner-sidebar-close
          onClick={onClose}
          aria-label="Đóng menu"
          className="hidden max-[900px]:flex items-center justify-center w-11 h-11 rounded-full text-white/50 hover:text-white hover:bg-white/10 bg-transparent border-0 cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 py-4 flex flex-col overflow-y-auto scrollbar-hide">
        {navGroups.map((group, idx) => (
          <div key={idx}>
            <GroupLabel>{group.label}</GroupLabel>
            <div className="flex flex-col gap-0.5">
              {group.items.map(link => (
                <NavItem 
                  key={link.path} 
                  link={link} 
                  isActive={isActive(link.path)} 
                  onClick={onClose} 
                />
              ))}
            </div>
          </div>
        ))}

        <div className="flex-1 min-h-[40px]" />

        <div className="border-t border-white/10 pt-4 pb-4 flex flex-col gap-0.5">
          <div className="px-8 pb-4">
            <p className="text-[12px] font-bold text-white/50 uppercase tracking-widest m-0 mb-1">Tài khoản</p>
            <p className="text-sm font-semibold text-white truncate m-0">{displayName}</p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-3 mx-4 rounded-[8px] font-bold text-[13px] uppercase tracking-[0.02em] transition-all duration-200 ease-in-out text-red-400 hover:text-red-300 hover:bg-white/5 text-left border-0 cursor-pointer bg-transparent"
          >
            <LogOut size={18} className="shrink-0" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}
