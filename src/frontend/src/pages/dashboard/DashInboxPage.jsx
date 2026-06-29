import { useState } from 'react'
import ProSportDashLayout from '../../layouts/ProSportDashLayout'

const tabs = [
  { key: 'All', label: 'Tất cả' },
  { key: 'Unread', label: 'Chưa đọc' },
  { key: 'Bookings', label: 'Đặt sân' },
  { key: 'Matches', label: 'Trận đấu' },
  { key: 'Rentals', label: 'Thuê thiết bị' },
]

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
const BagIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
)
const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const tagStyles = {
  urgent: 'bg-red-500/[0.12] text-red-500',
  pro: 'bg-[rgba(13,138,138,0.12)] text-[#14B8A6]',
  new: 'bg-green-500/[0.12] text-green-500',
}

const notifications = [
  {
    id: 1,
    iconEl: <CalendarIcon />,
    iconBg: '#ef4444',
    tags: ['KHẨN', 'PRO'],
    title: 'Đặt sân Center Court Elite',
    body: 'Giờ sân bạn đặt bắt đầu vào 10:00 sáng mai. Vui lòng đến trước 15 phút để hoàn tất nhận sân tại quầy lễ tân.',
    time: '10 phút trước',
    actions: [{ label: 'Xem đặt sân', variant: 'primary' }],
  },
  {
    id: 2,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80',
    tags: ['MỚI'],
    title: 'Lời mời trận đấu: Alex Mercer',
    body: 'Alex đã mời bạn tham gia trận đơn cạnh tranh vào tối thứ Sáu. Bạn có chấp nhận thử thách không?',
    time: '2 giờ trước',
    actions: [{ label: 'Tham gia', variant: 'primary' }, { label: 'Từ chối', variant: 'outline' }],
  },
  {
    id: 3,
    iconEl: <BagIcon />,
    iconBg: '#f59e0b',
    tags: [],
    title: 'Nhắc trả thiết bị thuê',
    body: "Thiết bị thuê 'Premium Carbon Racket' cần được trả hôm nay trước 17:00. Vui lòng mang về pro shop.",
    time: '4 giờ trước',
    actions: [{ label: 'Gia hạn thuê', variant: 'dark' }],
  },
  {
    id: 4,
    iconEl: <CheckIcon />,
    iconBg: '#14B8A6',
    tags: [],
    title: 'Thanh toán thành công',
    body: "Giao dịch mua 'Pro Gear Pack V2' đã hoàn tất. Biên lai đã được gửi đến email của bạn.",
    time: 'Hôm qua',
    actions: [],
  },
]

const actionBtnStyles = {
  primary: 'bg-[#14B8A6] text-[var(--theme-primary)] border-none rounded-lg px-[18px] py-2 text-[0.82rem] font-bold cursor-pointer font-[\'Inter\'] transition-colors hover:bg-[var(--theme-primary)]',
  dark: 'bg-[var(--theme-primary)] text-[var(--theme-primary)] border-none rounded-lg px-[18px] py-2 text-[0.82rem] font-bold cursor-pointer font-[\'Inter\'] transition-colors hover:bg-[#14B8A6]',
  outline: 'bg-white text-foreground border-[1.5px] border-[#e0ecf0] rounded-lg px-[18px] py-2 text-[0.82rem] font-semibold cursor-pointer font-[\'Inter\'] transition-all hover:border-[#14B8A6] hover:text-[#14B8A6]',
}

export default function DashInboxPage() {
  const [activeTab, setActiveTab] = useState('All')

  return (
    <ProSportDashLayout>
      <div>
        <div className="flex items-start justify-between mb-5">
          <div>
            <h1 className="font-['Oswald'] text-[1.6rem] font-bold text-foreground">Thông báo</h1>
            <p className="text-[0.85rem] text-slate-500 mt-1">Quản lý cảnh báo và luôn cập nhật thông tin mới nhất.</p>
          </div>
          <button className="flex items-center gap-1.5 bg-transparent border-[1.5px] border-[#e0ecf0] rounded-full px-3.5 py-[7px] text-[0.82rem] font-semibold text-[#14B8A6] cursor-pointer font-['Inter'] transition-all whitespace-nowrap hover:bg-[rgba(13,138,138,0.07)] hover:border-[#14B8A6]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Đánh dấu đã đọc tất cả
          </button>
        </div>

        <div className="flex gap-2 mb-5 flex-wrap">
          {tabs.map(t => (
            <button key={t.key} className={`py-[7px] px-4 rounded-full border-[1.5px] text-[0.82rem] font-medium cursor-pointer font-['Inter'] transition-all hover:border-[#14B8A6] hover:text-[#14B8A6] ${activeTab === t.key ? 'bg-[var(--theme-primary)] border-[#0F172A] text-[var(--theme-primary)]' : 'bg-white border-[#e0ecf0] text-slate-500'}`} onClick={() => setActiveTab(t.key)}>{t.label}</button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {notifications.map(n => (
            <div key={n.id} className="flex gap-3.5 bg-white rounded-xl p-[18px] border-[1.5px] border-[#e0ecf0] transition-shadow hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
              <div className="shrink-0">
                {n.avatar ? (
                  <img src={n.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: n.iconBg }}>
                    {n.iconEl}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="flex gap-1.5">
                    {n.tags.map(tag => (
                      <span key={tag} className={`text-[0.65rem] font-bold tracking-[0.06em] px-[7px] py-0.5 rounded uppercase ${tagStyles[tag.toLowerCase()] || ''}`}>{tag}</span>
                    ))}
                  </div>
                  <span className="text-[0.75rem] text-slate-400 ml-auto whitespace-nowrap">{n.time}</span>
                </div>
                <h3 className="text-[0.95rem] font-bold text-foreground mb-1.5">{n.title}</h3>
                <p className="text-sm text-slate-500 leading-[1.55]">{n.body}</p>
                {n.actions.length > 0 && (
                  <div className="flex gap-2.5 mt-3">
                    {n.actions.map(a => (
                      <button key={a.label} className={actionBtnStyles[a.variant]}>{a.label}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProSportDashLayout>
  )
}
