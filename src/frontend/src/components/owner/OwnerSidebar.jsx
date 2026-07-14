import { Link, useLocation } from 'react-router-dom';
import ProSportLogo from '../ui/ProSportLogo';
import ComplexSelector from './ComplexSelector';

const NAV = [
  { path: '/owner/dashboard', label: 'Dashboard' },
  { path: '/owner/courts', label: 'Sân' },
  { path: '/owner/pricing', label: 'Giá sân' },
  { path: '/owner/bookings', label: 'Đặt sân' },
  { path: '/owner/bookings/calendar', label: 'Lịch calendar' },
  { path: '/owner/memberships', label: 'Hội viên' },
  { path: '/owner/operating-hours', label: 'Giờ mở cửa' },
  { path: '/owner/cancellation-policy', label: 'Chính sách hủy' },
  { path: '/owner/inventory/products', label: 'Kho SP' },
  { path: '/owner/inventory/rental-assets', label: 'Thiết bị thuê' },
  { path: '/owner/rentals', label: 'Phiên thuê' },
  { path: '/owner/vouchers', label: 'Voucher' },
  { path: '/owner/finance', label: 'Tài chính' },
  { path: '/owner/reports', label: 'Báo cáo' },
  { path: '/owner/reviews', label: 'Đánh giá' },
  { path: '/owner/audit-logs', label: 'Nhật ký' },
  { path: '/owner/staff', label: 'Nhân viên' },
  { path: '/owner/complex', label: 'Tổ hợp' },
  { path: '/owner/settings', label: 'Cài đặt' },
];

export default function OwnerSidebar({ open, onClose, displayName, onLogout }) {
  const location = useLocation();
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <aside className={`w-[230px] bg-ink flex flex-col fixed left-0 top-0 bottom-0 z-50 overflow-y-auto transition-transform ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      <div className="px-6 py-6 border-b border-white/10">
        <ProSportLogo size="sm" variant="light" to="/owner/dashboard" onClick={onClose} />
        <p className="label-mono text-paper/40 mt-1.5">Cổng chủ sân</p>
      </div>

      <div className="px-4 py-3 border-b border-white/10">
        <ComplexSelector />
      </div>

      <nav className="flex-1 py-3 px-3 overflow-y-auto flex flex-col gap-0.5">
        {NAV.map(link => (
          <Link
            key={link.path}
            to={link.path}
            onClick={onClose}
            className={`block px-3 py-2.5 rounded-[2px] font-bold text-[12.5px] uppercase tracking-[0.02em] no-underline transition-colors ${
              isActive(link.path)
                ? 'bg-paper text-ink'
                : 'text-paper/50 hover:text-paper'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="p-5 border-t border-white/10">
        <p className="text-sm font-semibold text-paper truncate">{displayName}</p>
        <button
          type="button"
          onClick={onLogout}
          className="mt-2 label-mono text-paper/50 hover:text-danger bg-transparent border-none cursor-pointer p-0"
        >
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
