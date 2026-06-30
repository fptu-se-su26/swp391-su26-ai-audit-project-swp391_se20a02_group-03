import { Link } from 'react-router-dom';

export default function OwnerSettingsPage() {
  const links = [
    { to: '/owner/complex', label: 'Thông tin tổ hợp', desc: 'Tên, địa chỉ, liên hệ' },
    { to: '/owner/operating-hours', label: 'Giờ mở cửa & ngày nghỉ', desc: 'Lịch tuần, đóng cửa, bảo trì' },
    { to: '/owner/cancellation-policy', label: 'Chính sách hủy', desc: 'Quy tắc hoàn tiền khi khách hủy' },
    { to: '/owner/memberships', label: 'Gói hội viên', desc: 'Giảm giá cho khách quen' },
  ];

  return (
    <div className="max-w-xl space-y-4">
      <div className="bg-white rounded-2xl border p-6 space-y-2">
        <h2 className="text-xl font-bold text-slate-900">Cài đặt Owner</h2>
        <p className="text-sm text-slate-600">Chọn tổ hợp mặc định qua dropdown sidebar. Liên hệ Admin để thêm tổ hợp mới.</p>
      </div>
      <ul className="space-y-2">
        {links.map(item => (
          <li key={item.to}>
            <Link to={item.to} className="block bg-white rounded-xl border p-4 no-underline hover:border-emerald-300 transition-colors">
              <span className="font-semibold text-emerald-800">{item.label}</span>
              <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
