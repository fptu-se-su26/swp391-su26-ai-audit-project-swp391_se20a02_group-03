import { useState } from 'react'
import { Swords, Clock, CreditCard, Bell } from 'lucide-react'
import ApexLayout from '../../layouts/ApexLayout'

const tabs = ['Tất cả', 'Nhắc nhở đặt sân', 'Lời mời thi đấu', 'Thanh toán', 'Hệ thống']

const notifications = [
  {
    id: 1,
    type: 'match',
    icon: <Swords size={20} />,
    iconBg: '#14B8A6',
    title: 'Lời mời thi đấu',
    body: 'Sarah J. đã mời bạn tham gia trận đánh đôi Pickleball tại Grand Slam Center.',
    time: '2 phút trước',
    unread: true,
    extra: { date: 'Ngày mai, 18:00 - Sân 3' },
    actions: ['Chấp nhận', 'Từ chối'],
  },
  {
    id: 2,
    type: 'booking',
    icon: <Clock size={20} />,
    iconBg: '#F59E0B',
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
    iconBg: '#64748B',
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
    iconBg: '#6366f1',
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
      <div className="max-w-[800px] mx-auto animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-[var(--theme-primary)] tracking-tight">Thông báo</h1>
          <button className="text-sm text-accent font-semibold hover:text-accent-bright">Đánh dấu tất cả là đã đọc</button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map(t => (
            <button
              key={t}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === t 
                  ? 'bg-accent text-white shadow-[0_0_15px_rgba(94,106,210,0.4)]' 
                  : 'bg-[var(--theme-surface)] border border-border-default text-foreground-muted hover:border-border-hover hover:text-foreground'
              }`}
              onClick={() => setActiveTab(t)}
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
              className={`flex gap-4 p-5 card-base transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:-translate-y-1 relative overflow-hidden ${
                n.unread ? 'border-l-4 border-l-accent bg-[var(--theme-surface)]' : ''
              }`}
            >
              {/* Icon */}
              <div 
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-sm border border-border-default" 
                style={{ background: `${n.iconBg}15`, color: n.iconBg }}
              >
                {n.icon}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-[15px] font-bold text-[var(--theme-primary)]">{n.title}</h3>
                    {n.unread && <span className="w-2 h-2 rounded-full bg-accent" />}
                  </div>
                  <span className="text-xs text-foreground-muted shrink-0 font-medium">{n.time}</span>
                </div>
                
                <p className="text-sm text-foreground-muted leading-relaxed mb-3 max-w-[600px]">{n.body}</p>
                
                {/* Extra info box */}
                {n.extra && (
                  <div className="flex items-center gap-2 mb-3 bg-[var(--theme-surface)] border border-border-default rounded-lg px-3.5 py-2 w-fit">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--theme-primary)]/20"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <span className="text-xs font-semibold text-foreground-muted">{n.extra.date}</span>
                  </div>
                )}
                
                {/* Actions */}
                {n.actions && (
                  <div className="flex gap-2">
                    {n.actions.map((a, i) => (
                      <button 
                        key={a} 
                        className={`h-9 px-4 text-xs font-semibold rounded-lg transition-all duration-200 ${
                          i === 0 
                            ? 'btn-primary' 
                            : 'btn-outline'
                        }`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Link */}
                {n.link && (
                  <button className="text-xs font-semibold text-accent hover:text-accent-bright transition-colors group flex items-center gap-1">
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
