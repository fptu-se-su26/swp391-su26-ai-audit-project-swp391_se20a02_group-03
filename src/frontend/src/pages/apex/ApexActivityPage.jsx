import { useState } from 'react'
import { Swords, Clock, CreditCard, Bell, Calendar, CheckCircle2 } from 'lucide-react'
import ApexLayout from '../../layouts/ApexLayout'

const tabs = ['Tất cả', 'Nhắc nhở đặt sân', 'Lời mời thi đấu', 'Thanh toán', 'Hệ thống']

const notifications = [
  {
    id: 1,
    type: 'match',
    icon: <Swords size={20} />,
    iconBg: 'bg-indigo-50 text-indigo-500',
    title: 'Lời mời thi đấu',
    body: 'Lan J. đã mời bạn tham gia trận đánh đôi Pickleball tại Trung tâm Grand Slam.',
    time: '2 phút trước',
    unread: true,
    extra: { date: 'Ngày mai, 18:00 - Sân 3' },
    actions: ['Chấp nhận', 'Từ chối'],
  },
  {
    id: 2,
    type: 'booking',
    icon: <Clock size={20} />,
    iconBg: 'bg-orange-50 text-orange-500',
    title: 'Sắp diễn ra',
    body: 'Trận cầu lông trong nhà của bạn sẽ bắt đầu sau 2 giờ.',
    time: '1 giờ trước',
    unread: false,
    link: 'Xem chi tiết →',
  },
  {
    id: 3,
    type: 'payment',
    icon: <CreditCard size={20} />,
    iconBg: 'bg-teal-50 text-[#14b8a6]',
    title: 'Thanh toán thành công',
    body: 'Hóa đơn cho lượt đặt Sân 6 (45.000 đ) đã được tạo.',
    time: 'Hôm qua',
    unread: false,
    link: 'Tải biên lai',
  },
  {
    id: 4,
    type: 'system',
    icon: <Bell size={20} />,
    iconBg: 'bg-blue-50 text-blue-500',
    title: 'Cập nhật hệ thống',
    body: 'Đã thêm sân mới! Hãy xem các sân ngoài trời vừa được cải tạo có thể đặt từ tuần tới.',
    time: '2 ngày trước',
    unread: false,
    actions: ['Khám phá sân'],
  },
]

export default function ApexActivityPage() {
  const [activeTab, setActiveTab] = useState('Tất cả')

  return (
    <ApexLayout>
      <div className="font-sans max-w-[800px] mx-auto auth-animate-in pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-[#0f172a] m-0">Thông báo</h1>
          <button className="flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-wider text-[#14b8a6] hover:text-[#0f9e8c] transition-colors bg-transparent border-0 cursor-pointer">
            <CheckCircle2 size={16} />
            Đánh dấu tất cả là đã đọc
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-3 mb-10 bg-white p-2 rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 w-fit">
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`h-9 px-5 rounded-full text-[13px] font-bold transition-all border-0 cursor-pointer flex items-center gap-2 ${
                  activeTab === t 
                  ? 'bg-[#14b8a6] text-white shadow-sm' 
                  : 'bg-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Timeline List */}
        <div className="space-y-4">
          {notifications.map(n => (
            <div
              key={n.id}
              className={`relative flex gap-5 p-6 bg-white rounded-[16px] border transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] ${
                n.unread 
                  ? 'border-[#14b8a6]/30 shadow-[0_4px_16px_rgba(20,184,166,0.08)]' 
                  : 'border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)]'
              }`}
            >
              {/* Unread Indicator */}
              {n.unread && (
                <div className="absolute top-1/2 -translate-y-1/2 -left-[1.5px] w-[3px] h-10 bg-[#14b8a6] rounded-r-full" />
              )}

              {/* Icon */}
              <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center shrink-0 ${n.iconBg}`}>
                {n.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={`font-bold text-[16px] m-0 ${n.unread ? 'text-[#0f172a]' : 'text-gray-700'}`}>
                      {n.title}
                    </h3>
                    {n.unread && <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.1)]" />}
                  </div>
                  <span className="text-[12px] font-bold uppercase tracking-wider text-gray-400 shrink-0 mt-0.5">{n.time}</span>
                </div>

                <p className="text-[14.5px] text-gray-500 leading-relaxed mb-4 max-w-[600px] m-0">
                  {n.body}
                </p>

                {/* Extra info box */}
                {n.extra && (
                  <div className="flex items-center gap-2.5 mb-5 bg-[#F8F9FA] rounded-[8px] px-4 py-2.5 w-fit border border-gray-100">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-[13px] font-medium text-gray-600">{n.extra.date}</span>
                  </div>
                )}

                {/* Actions */}
                {n.actions && (
                  <div className="flex gap-3">
                    {n.actions.map((a, i) => (
                      <button
                        key={a}
                        className={`h-10 px-5 rounded-[8px] text-[12px] font-bold uppercase tracking-wide transition-colors cursor-pointer border-0 ${
                          i === 0
                            ? 'bg-[#14b8a6] hover:bg-[#0f9e8c] text-white shadow-sm'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                )}

                {/* Link */}
                {n.link && (
                  <button className="text-[13px] font-bold text-[#14b8a6] hover:text-[#0f9e8c] transition-colors bg-transparent border-0 cursor-pointer p-0">
                    {n.link}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ApexLayout>
  )
}
