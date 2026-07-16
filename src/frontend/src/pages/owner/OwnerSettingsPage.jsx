import { Link } from 'react-router-dom';
import { OwnerPageHeader, OwnerCard } from '../../components/owner';
import { Building2, Clock, ShieldCheck, Users, ChevronRight } from 'lucide-react';

export default function OwnerSettingsPage() {
  const links = [
    { 
      to: '/owner/complex', 
      label: 'Thông tin tổ hợp', 
      desc: 'Cập nhật tên, địa chỉ, số điện thoại và email liên hệ của tổ hợp.',
      icon: Building2,
      color: 'text-blue-500',
      bg: 'bg-blue-50'
    },
    { 
      to: '/owner/operating-hours', 
      label: 'Lịch vận hành & Ngày nghỉ', 
      desc: 'Cấu hình giờ mở cửa, độ dài mỗi lượt chơi và các ngày đóng cửa dự kiến.',
      icon: Clock,
      color: 'text-orange-500',
      bg: 'bg-orange-50'
    },
    { 
      to: '/owner/cancellation-policy', 
      label: 'Chính sách hủy sân', 
      desc: 'Thiết lập thời gian cho phép hủy và tỷ lệ hoàn tiền tương ứng cho khách hàng.',
      icon: ShieldCheck,
      color: 'text-[#14b8a6]',
      bg: 'bg-teal-50'
    },
    { 
      to: '/owner/memberships', 
      label: 'Gói hội viên', 
      desc: 'Quản lý danh sách khách hàng thân thiết và các cấp độ giảm giá đặc quyền.',
      icon: Users,
      color: 'text-purple-500',
      bg: 'bg-purple-50'
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 auth-animate-in pb-12">
      <OwnerPageHeader 
        title="Cài đặt tổ hợp" 
        description="Cấu hình các thông số vận hành và chính sách chung cho tổ hợp đang chọn."
      />

      <div className="grid sm:grid-cols-2 gap-4">
        {links.map(({ to, label, desc, icon: Icon, color, bg }) => (
          <Link key={to} to={to} className="block no-underline group">
            <OwnerCard className="h-full flex flex-col hover:border-[#14b8a6] transition-colors relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-gray-50 to-transparent -mr-4 -mt-4 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-[12px] shrink-0 ${bg} ${color}`}>
                  <Icon size={24} strokeWidth={2} />
                </div>
                <div className="flex-1 relative">
                  <h3 className="font-heading text-lg tracking-tight text-[#0f172a] m-0 mb-1.5 group-hover:text-[#14b8a6] transition-colors">
                    {label}
                  </h3>
                  <p className="text-sm text-gray-500 m-0 leading-relaxed pr-6">
                    {desc}
                  </p>
                  <div className="absolute top-0 right-0 text-gray-300 group-hover:text-[#14b8a6] transition-colors group-hover:translate-x-1 duration-300">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </div>
            </OwnerCard>
          </Link>
        ))}
      </div>

      <div className="mt-8 p-6 bg-gray-50 rounded-[16px] border border-gray-100 flex items-start gap-4">
        <div className="p-2 bg-white rounded-full shadow-sm">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
        </div>
        <div>
          <h4 className="font-bold text-[#0f172a] text-sm m-0 mb-1">Ghi chú quan trọng</h4>
          <p className="text-sm text-gray-500 m-0 leading-relaxed">
            Các cài đặt ở đây chỉ áp dụng cho tổ hợp hiện tại đang được chọn ở thanh Sidebar bên trái. Nếu bạn quản lý nhiều tổ hợp, vui lòng chuyển đổi tổ hợp trước khi thay đổi cài đặt. Để tạo tổ hợp mới, vui lòng liên hệ với Admin hệ thống.
          </p>
        </div>
      </div>
    </div>
  );
}
