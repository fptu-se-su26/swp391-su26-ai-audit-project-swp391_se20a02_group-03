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
  { path: '/owner/audit-logs', label: 'Audit Log' },
  { path: '/owner/staff', label: 'Nhân viên' },
  { path: '/owner/complex', label: 'Tổ hợp' },
  { path: '/owner/settings', label: 'Cài đặt' },
];

export default function OwnerSidebar({ open, onClose, displayName, onLogout }) {
  const location = useLocation();
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <aside className={`w-64 bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0 bottom-0 z-50 transition-transform ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      <div className="p-5 border-b border-slate-100">
        <Link to="/owner/dashboard" className="inline-block no-underline" onClick={onClose}>
          <ProSportLogo size="sm" variant="dark" />
        </Link>
        <p className="text-xs text-emerald-700 font-semibold mt-2 uppercase tracking-wide">Owner Portal</p>
      </div>

      <div className="px-4 py-3 border-b border-slate-100">
        <ComplexSelector />
      </div>

      <nav className="flex-1 py-2 overflow-y-auto">
        {NAV.map(link => (
          <Link
            key={link.path}
            to={link.path}
            onClick={onClose}
            className={`block px-5 py-2.5 text-sm no-underline transition-colors ${
              isActive(link.path)
                ? 'bg-emerald-50 text-emerald-800 font-semibold border-r-4 border-emerald-600'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <p className="text-sm font-medium text-slate-800 truncate">{displayName}</p>
        <button
          type="button"
          onClick={onLogout}
          className="mt-2 text-sm text-red-600 hover:underline bg-transparent border-none cursor-pointer p-0"
        >
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
