import { useState, useEffect } from 'react'
import ProSportDashLayout from '../../layouts/ProSportDashLayout'
import { useToast } from '../../components/Toast'

const NOTIF_SETTINGS_KEY = 'prosport_staff_notif_settings'

const topics = [
  { id: 'bookings', emoji: '📅', iconBg: '#6366f1', label: 'Đặt sân',    desc: 'Xác nhận, hủy và nhắc lịch đặt sân sắp tới.', push: true,  email: true,  sms: false },
  { id: 'matches',  emoji: '🎾', iconBg: '#22c55e', label: 'Trận xã giao',    desc: 'Lời mời, kết quả trận và cảnh báo đối tác sẵn sàng.',         push: true,  email: false, sms: false },
  { id: 'payments', emoji: '💳', iconBg: '#ef4444', label: 'Thanh toán & hóa đơn',desc: 'Hóa đơn, giao dịch thành công và thanh toán thất bại.',             push: true,  email: true,  sms: false },
]

function Toggle({ checked, onChange, id }) {
  return (
    <button role="switch" aria-checked={checked} id={id} onClick={onChange}
      className={`w-9 h-5 rounded-full border-none cursor-pointer p-0.5 flex items-center transition-colors duration-[200ms] shrink-0 ${checked ? 'bg-ink' : 'bg-border-default'}`}>
      <span className={`w-4 h-4 rounded-full bg-paper pointer-events-none transition-transform duration-[200ms] ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
    </button>
  )
}

export default function DashNotifSettingsPage() {
  const { addToast } = useToast()
  const [topicState, setTopicState] = useState(topics)
  const [masterPush,  setMasterPush]  = useState(true)
  const [masterEmail, setMasterEmail] = useState(true)
  const [masterSms,   setMasterSms]   = useState(false)
  const [quietHours,  setQuietHours]  = useState(true)
  const [quietStart, setQuietStart] = useState('22:00')
  const [quietEnd, setQuietEnd] = useState('07:00')
  const [timezone, setTimezone] = useState('UTC+7 (Hồ Chí Minh)')

  useEffect(() => {
    try {
      const raw = localStorage.getItem(NOTIF_SETTINGS_KEY)
      if (!raw) return
      const saved = JSON.parse(raw)
      if (saved.topicState) setTopicState(saved.topicState)
      if (typeof saved.masterPush === 'boolean') setMasterPush(saved.masterPush)
      if (typeof saved.masterEmail === 'boolean') setMasterEmail(saved.masterEmail)
      if (typeof saved.masterSms === 'boolean') setMasterSms(saved.masterSms)
      if (typeof saved.quietHours === 'boolean') setQuietHours(saved.quietHours)
      if (saved.quietStart) setQuietStart(saved.quietStart)
      if (saved.quietEnd) setQuietEnd(saved.quietEnd)
      if (saved.timezone) setTimezone(saved.timezone)
    } catch { /* ignore */ }
  }, [])

  function saveSettings() {
    localStorage.setItem(NOTIF_SETTINGS_KEY, JSON.stringify({
      topicState, masterPush, masterEmail, masterSms, quietHours, quietStart, quietEnd, timezone,
    }))
    addToast('Đã lưu tùy chọn trên thiết bị này (demo — chưa đồng bộ server)', 'success')
  }

  function resetSettings() {
    setTopicState(topics)
    setMasterPush(true)
    setMasterEmail(true)
    setMasterSms(false)
    setQuietHours(true)
    setQuietStart('22:00')
    setQuietEnd('07:00')
    setTimezone('UTC+7 (Hồ Chí Minh)')
    localStorage.removeItem(NOTIF_SETTINGS_KEY)
    addToast('Đã khôi phục mặc định', 'info')
  }

  const toggleChannel = (id, ch) =>
    setTopicState(topicState.map(t => t.id === id ? { ...t, [ch]: !t[ch] } : t))

  return (
    <ProSportDashLayout>
      <div>
        <div className="mb-6">
          <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground mb-2">Thông báo</h1>
          <p className="text-[13px] text-foreground-muted max-w-[560px]">Cấu hình cách và thời điểm bạn muốn nhận cảnh báo về hoạt động thể thao, đặt sân và cập nhật tài khoản.</p>
          <p className="text-xs text-warning border-2 border-warning bg-warning-bg px-4 py-3 mt-3 max-w-[560px] rounded-[2px]">
            Demo: cài đặt lưu trên trình duyệt. API thông báo thật sẽ có ở phiên bản sau.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5 items-start">
          {/* Topics */}
          <div className="border-2 border-border-strong bg-surface p-5.5 rounded-[2px]">
            <div className="flex items-center gap-2 font-heading text-base uppercase tracking-tight text-foreground mb-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
                <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
              Chủ đề thông báo
            </div>
            <p className="text-xs text-accent mb-4">Tùy chỉnh cảnh báo theo từng kênh liên lạc.</p>

            <div className="flex items-center justify-between py-3 border-b-2 border-border-strong mb-1 flex-wrap gap-2">
              <div className="label-mono text-foreground-subtle flex-1 min-w-[80px]">Chủ đề</div>
              <div className="flex gap-4 sm:gap-6">
                <span className="label-mono text-foreground-subtle w-9 text-center">Đẩy</span>
                <span className="label-mono text-foreground-subtle w-9 text-center">Thư</span>
                <span className="label-mono text-foreground-subtle w-9 text-center">SMS</span>
              </div>
            </div>

            {topicState.map(t => (
              <div key={t.id} className="flex items-center justify-between py-3.5 border-b border-border-default last:border-b-0 flex-wrap gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-[180px]">
                  <div className="w-9 h-9 rounded-[2px] flex items-center justify-center text-base shrink-0 border-2 border-border-strong" style={{ background: t.iconBg }}>{t.emoji}</div>
                  <div>
                    <p className="text-sm font-extrabold text-foreground">{t.label}</p>
                    <p className="text-[11.5px] text-foreground-subtle mt-0.5 leading-snug max-w-[260px]">{t.desc}</p>
                  </div>
                </div>
                <div className="flex gap-4 sm:gap-6">
                  <span className="w-9 flex justify-center"><Toggle checked={t.push}  onChange={() => toggleChannel(t.id, 'push')}  id={`${t.id}-push`} /></span>
                  <span className="w-9 flex justify-center"><Toggle checked={t.email} onChange={() => toggleChannel(t.id, 'email')} id={`${t.id}-email`} /></span>
                  <span className="w-9 flex justify-center"><Toggle checked={t.sms}   onChange={() => toggleChannel(t.id, 'sms')}   id={`${t.id}-sms`} /></span>
                </div>
              </div>
            ))}
          </div>

          {/* Right panel */}
          <div className="flex flex-col gap-4">
            {/* Master Channels */}
            <div className="border-2 border-border-strong bg-surface p-5.5 rounded-[2px]">
              <p className="font-heading text-sm uppercase tracking-tight text-foreground mb-1">Kênh chính</p>
              <p className="text-xs text-foreground-subtle mb-3.5 leading-normal">Tắt nhanh tất cả thông báo theo từng phương thức.</p>
              {[
                { label: 'Thông báo đẩy', emoji: '📱', val: masterPush,  set: setMasterPush,  id: 'master-push'  },
                { label: 'Cảnh báo email',        emoji: '✉️', val: masterEmail, set: setMasterEmail, id: 'master-email' },
                { label: 'Tin nhắn SMS',   emoji: '💬', val: masterSms,   set: setMasterSms,   id: 'master-sms'   },
              ].map(m => (
                <div key={m.label} className="flex items-center gap-2.5 py-2.5 border-b border-border-default last:border-b-0">
                  <span className="text-base w-7 text-center">{m.emoji}</span>
                  <span className="text-[13px] text-foreground font-medium flex-1">{m.label}</span>
                  <Toggle checked={m.val} onChange={() => m.set(!m.val)} id={m.id} />
                </div>
              ))}
            </div>

            {/* Quiet Hours */}
            <div className="border-2 border-border-strong bg-surface p-5.5 rounded-[2px]">
              <div className="flex items-center justify-between mb-1.5">
                <p className="font-heading text-sm uppercase tracking-tight text-foreground">🌙 Giờ yên lặng</p>
                <Toggle checked={quietHours} onChange={() => setQuietHours(!quietHours)} id="quiet-hours" />
              </div>
              <p className="text-xs text-foreground-subtle mb-3.5 leading-normal">Tắt tiếng mọi thông báo không khẩn cấp trong khung giờ này.</p>
              <div className="grid grid-cols-2 gap-3 mt-2.5">
                <div>
                  <label className="label-mono text-foreground-subtle mb-1.5 block" htmlFor="quiet-start">Từ</label>
                  <input
                    id="quiet-start"
                    type="time"
                    value={quietStart}
                    onChange={e => setQuietStart(e.target.value)}
                    className="input-base w-full text-[13px]"
                  />
                </div>
                <div>
                  <label className="label-mono text-foreground-subtle mb-1.5 block" htmlFor="quiet-end">Đến</label>
                  <input
                    id="quiet-end"
                    type="time"
                    value={quietEnd}
                    onChange={e => setQuietEnd(e.target.value)}
                    className="input-base w-full text-[13px]"
                  />
                </div>
              </div>
              <div className="mt-3">
                <p className="label-mono text-foreground-subtle mb-1.5">Múi giờ</p>
                <select id="tz-select" value={timezone} onChange={e => setTimezone(e.target.value)} className="input-base w-full text-[13px] cursor-pointer">
                  <option>UTC+7 (Hồ Chí Minh)</option>
                  <option>Giờ Thái Bình Dương (Mỹ & Canada)</option>
                  <option>Giờ miền Đông (Mỹ & Canada)</option>
                </select>
              </div>
            </div>

            {/* Desktop Preview */}
            <div className="border-2 border-border-default bg-background-base p-4 rounded-[2px]">
              <p className="label-mono text-foreground-subtle mb-3">Xem trước desktop</p>
              <div className="flex items-start gap-2.5 bg-surface rounded-[2px] p-3 border-2 border-border-strong">
                <span className="text-xl shrink-0">🏟️</span>
                <div>
                  <p className="text-[13px] font-extrabold text-foreground">Đặt sân thành công</p>
                  <p className="text-xs text-foreground-subtle mt-0.5">Sân 4 đã được giữ vào thứ Ba lúc 18:00.</p>
                </div>
                <button type="button" className="bg-transparent border-none cursor-pointer text-foreground-subtle text-base ml-auto shrink-0 leading-none">&times;</button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-5 border-t-2 border-border-strong">
          <button type="button" className="btn-outline" onClick={resetSettings}>Hủy thay đổi</button>
          <button type="button" className="btn-primary" onClick={saveSettings}>Lưu tùy chọn</button>
        </div>
      </div>
    </ProSportDashLayout>
  )
}
