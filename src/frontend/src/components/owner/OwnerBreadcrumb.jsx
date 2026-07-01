import { Link, useLocation } from 'react-router-dom';

const LABELS = {
  '/owner/dashboard': 'Dashboard',
  '/owner/courts': 'Sân',
  '/owner/pricing': 'Giá sân',
  '/owner/bookings': 'Đặt sân',
  '/owner/staff': 'Nhân viên',
  '/owner/complex': 'Tổ hợp',
  '/owner/settings': 'Cài đặt',
};

export default function OwnerBreadcrumb() {
  const { pathname } = useLocation();
  const match = Object.keys(LABELS).find(p => pathname.startsWith(p));
  const current = match ? LABELS[match] : 'Owner';

  return (
    <p className="text-xs text-slate-500">
      <Link to="/owner/dashboard" className="text-slate-500 no-underline hover:text-emerald-700">PRO-SPORT</Link>
      <span className="mx-1">/</span>
      <span className="text-emerald-700 font-medium">{current}</span>
    </p>
  );
}
