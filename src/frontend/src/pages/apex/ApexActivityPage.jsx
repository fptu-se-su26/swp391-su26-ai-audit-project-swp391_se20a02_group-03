import { useState } from 'react'
import { Swords, Clock, CreditCard, Bell, Calendar } from 'lucide-react'
import ApexLayout from '../../layouts/ApexLayout'

const tabs = ['Tất cả', 'Nhắc nhở đặt sân', 'Lời mời thi đấu', 'Thanh toán', 'Hệ thống']

const notifications = [
  {
    id: 1,
    type: 'match',
    icon: <Swords size={18} />,
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
    icon: <Clock size={18} />,
    title: 'Sắp diễn ra',
    body: 'Trận cầu lông trong nhà của bạn sẽ bắt đầu sau 2 giờ.',
    time: '1 giờ trước',
    unread: false,
    link: 'Xem chi tiết →',
  },
  {
    id: 3,
    type: 'payment',
    icon: <CreditCard size={18} />,
    title: 'Thanh toán thành công',
    body: 'Hóa đơn cho lượt đặt Sân 6 (45.000 đ) đã được tạo.',
    time: 'Hôm qua',
    unread: false,
    link: 'Tải biên lai',
  },
  {
    id: 4,
    type: 'system',
    icon: <Bell size={18} />,
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
      <div className="max-w-[800px] mx-auto auth-animate-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading text-3xl uppercase tracking-[-0.01em] text-foreground">Thông báo</h1>
          <button className="label-mono text-accent hover:text-accent-bright">Đánh dấu tất cả là đã đọc</button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map(t => (
            <button
              key={t}
              className={`px-4 h-9 label-mono border-2 transition-colors ${
                activeTab === t
                  ? 'bg-accent text-ink border-accent'
                  : 'bg-surface border-border-default text-foreground-muted hover:border-border-hover hover:text-foreground'
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
              className={`flex gap-4 p-5 card-base transition-colors ${
                n.unread ? 'border-l-4 !border-l-accent' : ''
              }`}
            >
              {/* Icon */}
              <div className="w-11 h-11 border-2 border-border-default flex items-center justify-center shrink-0 text-foreground">
                {n.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-heading text-base uppercase text-foreground">{n.title}</h3>
                    {n.unread && <span className="w-2 h-2 rounded-full bg-accent" />}
                  </div>
                  <span className="label-mono text-foreground-muted shrink-0">{n.time}</span>
                </div>

                <p className="text-sm text-foreground-muted leading-relaxed mb-3 max-w-[600px]">{n.body}</p>

                {/* Extra info box */}
                {n.extra && (
                  <div className="flex items-center gap-2 mb-3 bg-background-base border border-border-default px-3.5 py-2 w-fit">
                    <Calendar size={14} className="text-foreground-muted" />
                    <span className="text-xs font-semibold text-foreground-muted">{n.extra.date}</span>
                  </div>
                )}

                {/* Actions */}
                {n.actions && (
                  <div className="flex gap-2">
                    {n.actions.map((a, i) => (
                      <button
                        key={a}
                        className={`h-9 px-4 text-xs font-bold uppercase tracking-[0.04em] transition-colors ${
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
                  <button className="text-xs font-bold text-accent hover:text-accent-bright transition-colors">
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
