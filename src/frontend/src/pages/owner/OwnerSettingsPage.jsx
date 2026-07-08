import { Link } from 'react-router-dom';

export default function OwnerSettingsPage() {
  const links = [
    { to: '/owner/complex', label: 'Thông tin tổ hợp', desc: 'Tên, địa chỉ, liên hệ' },
    { to: '/owner/operating-hours', label: 'Giờ mở cửa & ngày nghỉ', desc: 'Lịch tuần, đóng cửa, bảo trì' },
    { to: '/owner/cancellation-policy', label: 'Chính sách hủy', desc: 'Quy tắc hoàn tiền khi khách hủy' },
    { to: '/owner/memberships', label: 'Gói hội viên', desc: 'Giảm giá cho khách quen' },
  ];

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground mb-2">Cài đặt Owner</h1>
        <p className="text-sm text-foreground-muted">Chọn tổ hợp mặc định qua dropdown sidebar. Liên hệ Admin để thêm tổ hợp mới.</p>
      </div>
      <div className="flex flex-col gap-[2px] bg-[var(--theme-border-strong)] border-2 border-border-strong">
        {links.map(item => (
          <Link key={item.to} to={item.to} className="bg-surface hover:bg-surface-hover px-6 py-5 no-underline text-foreground transition-colors">
            <span className="font-extrabold text-sm text-foreground">{item.label}</span>
            <p className="text-xs text-foreground-subtle mt-1.5">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
