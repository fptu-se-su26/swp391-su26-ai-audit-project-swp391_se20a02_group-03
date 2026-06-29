import { useState } from 'react'
import ProSportDashLayout from '../../layouts/ProSportDashLayout'

const topics = [
  { id: 'bookings', emoji: '📅', iconBg: '#6366f1', label: 'Đặt sân',    desc: 'Xác nhận, hủy và nhắc lịch đặt sân sắp tới.', push: true,  email: true,  sms: false },
  { id: 'matches',  emoji: '🎾', iconBg: '#22c55e', label: 'Trận xã giao',    desc: 'Lời mời, kết quả trận và cảnh báo đối tác sẵn sàng.',         push: true,  email: false, sms: false },
  { id: 'rentals',  emoji: '📦', iconBg: '#64748b', label: 'Thuê thiết bị', desc: 'Giờ nhận, hạn trả và thông báo quá hạn.',             push: false, email: true,  sms: true  },
  { id: 'payments', emoji: '💳', iconBg: '#ef4444', label: 'Thanh toán & hóa đơn',desc: 'Hóa đơn, giao dịch thành công và thanh toán thất bại.',             push: true,  email: true,  sms: false },
]

function Toggle({ checked, onChange, id }) {
  return (
    <button role="switch" aria-checked={checked} id={id} onClick={onChange}
      className={`w-11 h-6 rounded-full border-none cursor-pointer p-0.5 flex items-center transition-colors duration-[250ms] shrink-0 ${checked ? 'bg-[#14B8A6]' : 'bg-[#e0ecf0]'}`}>
      <span className={`w-5 h-5 rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.15)] pointer-events-none transition-transform duration-[250ms] ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  )
}

export default function DashNotifSettingsPage() {
  const [topicState, setTopicState] = useState(topics)
  const [masterPush,  setMasterPush]  = useState(true)
  const [masterEmail, setMasterEmail] = useState(true)
  const [masterSms,   setMasterSms]   = useState(false)
  const [quietHours,  setQuietHours]  = useState(true)

  const toggleChannel = (id, ch) =>
    setTopicState(topicState.map(t => t.id === id ? { ...t, [ch]: !t[ch] } : t))

  return (
    <ProSportDashLayout>
      <div>
        <div className="mb-6">
          <h1 className="font-['Oswald'] text-[1.6rem] font-bold text-foreground">Thông báo</h1>
          <p className="text-[0.85rem] text-slate-500 mt-1 max-w-[520px] leading-relaxed">Cấu hình cách và thời điểm bạn muốn nhận cảnh báo về hoạt động thể thao, đặt sân và cập nhật tài khoản.</p>
        </div>

        <div className="grid grid-cols-[1fr_280px] max-[900px]:grid-cols-1 gap-5 items-start">
          {/* Topics */}
          <div className="bg-white rounded-[14px] p-[22px] border-[1.5px] border-[#e0ecf0]">
            <div className="flex items-center gap-2 text-[0.95rem] font-bold text-foreground mb-1.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
                <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
              Chủ đề thông báo
            </div>
            <p className="text-[0.78rem] text-[#14B8A6] mb-5">Tùy chỉnh cảnh báo theo từng kênh liên lạc.</p>

            <div className="flex items-center justify-between py-2 border-b border-[#f0f5f9] mb-2">
              <div className="text-[0.68rem] font-bold tracking-[0.1em] text-slate-400 flex-1">CHỦ ĐỀ</div>
              <div className="flex gap-5">
                <span className="text-[0.68rem] font-bold tracking-[0.1em] text-slate-400 w-11 text-center">ĐẨY</span>
                <span className="text-[0.68rem] font-bold tracking-[0.1em] text-slate-400 w-11 text-center">THƯ</span>
                <span className="text-[0.68rem] font-bold tracking-[0.1em] text-slate-400 w-11 text-center">SMS</span>
              </div>
            </div>

            {topicState.map(t => (
              <div key={t.id} className="flex items-center justify-between py-3.5 border-b border-[#f0f5f9] last:border-b-0">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-9 h-9 rounded-[10px] flex items-center justify-center text-base shrink-0" style={{ background: t.iconBg }}>{t.emoji}</div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{t.label}</p>
                    <p className="text-[0.75rem] text-slate-400 mt-0.5 leading-snug max-w-[260px]">{t.desc}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Toggle checked={t.push}  onChange={() => toggleChannel(t.id, 'push')}  id={`${t.id}-push`} />
                  <Toggle checked={t.email} onChange={() => toggleChannel(t.id, 'email')} id={`${t.id}-email`} />
                  <Toggle checked={t.sms}   onChange={() => toggleChannel(t.id, 'sms')}   id={`${t.id}-sms`} />
                </div>
              </div>
            ))}
          </div>

          {/* Right panel */}
          <div>
            {/* Master Channels */}
            <div className="bg-white rounded-[14px] p-[22px] border-[1.5px] border-[#e0ecf0]">
              <p className="text-[0.95rem] font-bold text-foreground mb-1">Kênh chính</p>
              <p className="text-[0.78rem] text-slate-400 mb-3.5 leading-normal">Tắt nhanh tất cả thông báo theo từng phương thức.</p>
              {[
                { label: 'Thông báo đẩy', emoji: '📱', val: masterPush,  set: setMasterPush,  id: 'master-push'  },
                { label: 'Cảnh báo email',        emoji: '✉️', val: masterEmail, set: setMasterEmail, id: 'master-email' },
                { label: 'Tin nhắn SMS',   emoji: '💬', val: masterSms,   set: setMasterSms,   id: 'master-sms'   },
              ].map(m => (
                <div key={m.label} className="flex items-center gap-2.5 py-2.5 border-b border-[#f0f5f9] last:border-b-0">
                  <span className="text-base w-7 text-center">{m.emoji}</span>
                  <span className="text-[0.85rem] text-foreground font-medium flex-1">{m.label}</span>
                  <Toggle checked={m.val} onChange={() => m.set(!m.val)} id={m.id} />
                </div>
              ))}
            </div>

            {/* Quiet Hours */}
            <div className="bg-white rounded-[14px] p-[22px] border-[1.5px] border-[#e0ecf0] mt-4">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[0.95rem] font-bold text-foreground">🌙 Giờ yên lặng</p>
                <Toggle checked={quietHours} onChange={() => setQuietHours(!quietHours)} id="quiet-hours" />
              </div>
              <p className="text-[0.78rem] text-slate-400 mb-3.5 leading-normal">Tắt tiếng mọi thông báo không khẩn cấp trong khung giờ này.</p>
              <div className="grid grid-cols-2 gap-3 mt-2.5">
                <div>
                  <p className="text-[0.68rem] font-bold tracking-[0.1em] uppercase text-slate-400 mb-1.5">TỪ</p>
                  <div className="flex items-center gap-1.5 border-[1.5px] border-[#e0ecf0] rounded-lg px-2.5 py-2 text-[0.82rem] text-foreground font-medium cursor-pointer">
                    22:00
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-[0.68rem] font-bold tracking-[0.1em] uppercase text-slate-400 mb-1.5">ĐẾN</p>
                  <div className="flex items-center gap-1.5 border-[1.5px] border-[#e0ecf0] rounded-lg px-2.5 py-2 text-[0.82rem] text-foreground font-medium cursor-pointer">
                    07:00
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-[0.68rem] font-bold tracking-[0.1em] uppercase text-slate-400 mb-1.5">MÚI GIỜ</p>
                <select id="tz-select" className="w-full border-[1.5px] border-[#e0ecf0] rounded-lg px-2.5 py-2 text-[0.82rem] text-foreground outline-none font-['Inter'] cursor-pointer">
                  <option>Giờ Thái Bình Dương (Mỹ & Canada)</option>
                  <option>Giờ miền Đông (Mỹ & Canada)</option>
                  <option>UTC+7 (Hồ Chí Minh)</option>
                </select>
              </div>
            </div>

            {/* Desktop Preview */}
            <div className="bg-[#f0f7fa] rounded-xl p-4 border border-[#e0ecf0] mt-4">
              <p className="text-[0.68rem] font-bold tracking-[0.1em] uppercase text-slate-400 mb-3">XEM TRƯỚC DESKTOP</p>
              <div className="flex items-start gap-2.5 bg-white rounded-[10px] p-3 border border-[#e0ecf0] shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                <span className="text-[1.2rem] shrink-0">🏟️</span>
                <div>
                  <p className="text-[0.82rem] font-bold text-foreground">Đặt sân thành công</p>
                  <p className="text-[0.75rem] text-slate-400 mt-0.5">Sân 4 đã được giữ vào thứ Ba lúc 18:00.</p>
                </div>
                <button className="bg-transparent border-none cursor-pointer text-slate-400 text-base ml-auto shrink-0 leading-none">&times;</button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-[#e0ecf0]">
          <button className="btn-outline">Hủy thay đổi</button>
          <button className="btn-primary">Lưu tùy chọn</button>
        </div>
      </div>
    </ProSportDashLayout>
  )
}
