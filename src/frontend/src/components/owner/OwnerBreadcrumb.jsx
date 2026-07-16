import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const LABELS = {
  '/owner/dashboard': 'Dashboard',
  '/owner/complex': 'Quản lý tổ hợp',
  '/owner/courts/create': 'Tạo sân',
  '/owner/courts': 'Sân',
  '/owner/pricing': 'Bảng giá',
  '/owner/bookings/calendar': 'Lịch Calendar',
  '/owner/bookings/walk-in': 'Đặt sân vãng lai',
  '/owner/bookings': 'Lịch sử đặt sân',
  '/owner/staff': 'Nhân viên',
  '/owner/inventory/products': 'Kho sản phẩm',
  '/owner/vouchers': 'Voucher',
  '/owner/finance': 'Tài chính',
  '/owner/reports': 'Báo cáo',
  '/owner/reviews': 'Đánh giá',
  '/owner/audit-logs': 'Nhật ký',
  '/owner/operating-hours': 'Giờ mở cửa',
  '/owner/cancellation-policy': 'Chính sách hủy',
  '/owner/memberships': 'Hội viên',
  '/owner/settings': 'Cài đặt',
};

export default function OwnerBreadcrumb() {
  const { pathname } = useLocation();

  // Sort paths by length descending to match more specific routes first
  const matchPath = Object.keys(LABELS)
    .sort((a, b) => b.length - a.length)
    .find(p => pathname.startsWith(p));

  const current = matchPath ? LABELS[matchPath] : 'Owner Portal';

  return (
    <div className="flex items-center text-[13px] font-bold uppercase tracking-wider text-gray-500">
      <Link to="/owner/dashboard" className="text-gray-400 hover:text-[#14b8a6] transition-colors no-underline">
        PRO-SPORT
      </Link>
      <ChevronRight size={14} className="mx-2 text-gray-300" />
      <span className="text-[#0f172a]">{current}</span>
    </div>
  );
}
