import { useState, useEffect } from 'react'
import ApexLayout from '../../layouts/ApexLayout'
import { useTheme } from '../../context/ThemeContext'
import authApi from '../../api/authApi'

function Toggle({ checked, onChange }) {
  return (
    <button
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--theme-bg)] focus:ring-accent ${
        checked ? 'bg-accent' : 'bg-gray-400/20'
      }`}
      onClick={onChange}
    >
      <span
        className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 shadow-sm ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

const sections = [
  { id: 'Tài khoản', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  { id: 'Xác thực E-KYC', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
  { id: 'Thông báo', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> },
  { id: 'Quyền riêng tư', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> },
  { id: 'Thanh toán', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
  { id: 'Giao diện', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg> },
]

export default function ApexSettingsPage() {
  const [activeSection, setActiveSection] = useState('Tài khoản')
  const [accountForm, setAccountForm] = useState({ name: '', email: '', phone: '' })
  const [notifs, setNotifs] = useState({ bookingReminder: true, matchInvite: true, payments: true, marketing: false, sms: false, email: true })
  const [privacy, setPrivacy] = useState({ publicProfile: true, showActivity: true, showMatches: false })
  const [saved, setSaved] = useState(false)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    authApi.getProfile()
      .then(res => {
        if (res?.statusCode === 200 && res.data) {
          setAccountForm({
            name: res.data.fullName || '',
            email: res.data.email || '',
            phone: res.data.phoneNumber || '',
          })
        }
      })
      .catch(() => {})
  }, [])

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <ApexLayout>
      <div className="max-w-[1000px] mx-auto animate-fade-up">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--theme-primary)] tracking-tight">Cài đặt</h1>
          <p className="text-sm text-foreground-muted mt-1">Quản lý tùy chọn và cài đặt tài khoản của bạn.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Nav */}
          <div className="w-full md:w-64 shrink-0">
            <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0">
              {sections.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                    activeSection === s.id
                      ? 'bg-accent/10 text-accent border border-accent/20'
                      : 'text-foreground-muted hover:bg-[var(--theme-surface)] hover:text-foreground border border-transparent'
                  }`}
                >
                  <span className={`${activeSection === s.id ? 'text-accent' : 'text-foreground-muted'}`}>{s.icon}</span>
                  {s.id}
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 space-y-6">
            
            {/* Account Panel */}
            {activeSection === 'Tài khoản' && (
              <div className="card-base p-6 shadow-sm animate-fade-in">
                <h2 className="text-[15px] font-bold text-[var(--theme-primary)] mb-5 pb-4 border-b border-border-default">Cài đặt tài khoản</h2>
                
                <div className="space-y-4 max-w-[480px]">
                  {[
                    { label: 'Họ và tên', id: 'set-name', type: 'text', key: 'name' },
                    { label: 'Địa chỉ Email', id: 'set-email', type: 'email', key: 'email' },
                    { label: 'Số điện thoại', id: 'set-phone', type: 'tel', key: 'phone' },
                  ].map(f => (
                    <div key={f.id}>
                      <label htmlFor={f.id} className="block text-xs font-bold text-foreground-muted uppercase tracking-wider mb-2">{f.label}</label>
                      <input
                        id={f.id}
                        type={f.type}
                        value={accountForm[f.key]}
                        onChange={e => setAccountForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                        className="w-full h-11 px-4 bg-[var(--theme-surface)] border border-border-default rounded-xl text-sm text-[var(--theme-primary)] font-medium focus:border-accent focus:ring-1 focus:ring-accent/20 outline-none transition-all shadow-sm"
                      />
                    </div>
                  ))}
                  
                  <div className="pt-4 mt-4 border-t border-border-default">
                    <div className="mb-4">
                      <label htmlFor="set-password" className="block text-xs font-bold text-foreground-muted uppercase tracking-wider mb-2">Mật khẩu mới</label>
                      <input id="set-password" type="password" placeholder="Để trống nếu không muốn đổi" className="w-full h-11 px-4 bg-[var(--theme-surface)] border border-border-default rounded-xl text-sm text-[var(--theme-primary)] font-medium focus:border-accent focus:ring-1 focus:ring-accent/20 outline-none transition-all shadow-sm placeholder:text-gray-600" />
                    </div>
                    <div>
                      <label htmlFor="set-confirm" className="block text-xs font-bold text-foreground-muted uppercase tracking-wider mb-2">Xác nhận mật khẩu</label>
                      <input id="set-confirm" type="password" placeholder="Xác nhận mật khẩu mới" className="w-full h-11 px-4 bg-[var(--theme-surface)] border border-border-default rounded-xl text-sm text-[var(--theme-primary)] font-medium focus:border-accent focus:ring-1 focus:ring-accent/20 outline-none transition-all shadow-sm placeholder:text-gray-600" />
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-red-500/20 max-w-[480px]">
                  <h3 className="text-sm font-bold text-red-500 mb-2">Khu vực nguy hiểm</h3>
                  <p className="text-xs text-foreground-muted mb-4">Sau khi bạn xóa tài khoản, không thể khôi phục lại. Vui lòng cân nhắc kỹ.</p>
                  <button className="h-10 px-5 rounded-xl border border-red-500/20 text-red-400 bg-red-500/10 text-sm font-semibold hover:bg-red-500/20 transition-colors">
                    Xóa tài khoản
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Panel */}
            {activeSection === 'Thông báo' && (
              <div className="card-base p-6 shadow-sm animate-fade-in">
                <h2 className="text-[15px] font-bold text-[var(--theme-primary)] mb-5 pb-4 border-b border-border-default">Tùy chọn thông báo</h2>
                <div className="space-y-6">
                  {[
                    { key: 'bookingReminder', label: 'Nhắc nhở đặt sân', desc: 'Nhận nhắc nhở 2 giờ trước phiên đặt sân của bạn.' },
                    { key: 'matchInvite', label: 'Lời mời thi đấu', desc: 'Nhận thông báo khi có lời mời thi đấu từ người chơi khác.' },
                    { key: 'payments', label: 'Biên lai thanh toán', desc: 'Nhận biên lai cho mọi giao dịch thanh toán và hoàn tiền.' },
                    { key: 'email', label: 'Thông báo qua Email', desc: 'Nhận các cập nhật quan trọng qua email.' },
                    { key: 'sms', label: 'Cảnh báo SMS', desc: 'Nhận các cảnh báo quan trọng qua SMS.' },
                    { key: 'marketing', label: 'Khuyến mãi & Ưu đãi', desc: 'Nhận email khuyến mãi và ưu đãi đặc biệt.' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[var(--theme-primary)]">{item.label}</p>
                        <p className="text-xs text-foreground-muted mt-0.5">{item.desc}</p>
                      </div>
                      <Toggle 
                        checked={notifs[item.key]} 
                        onChange={() => setNotifs(p => ({ ...p, [item.key]: !p[item.key] }))} 
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Privacy Panel */}
            {activeSection === 'Quyền riêng tư' && (
              <div className="card-base p-6 shadow-sm animate-fade-in">
                <h2 className="text-[15px] font-bold text-[var(--theme-primary)] mb-5 pb-4 border-b border-border-default">Cài đặt quyền riêng tư</h2>
                <div className="space-y-6">
                  {[
                    { key: 'publicProfile', label: 'Hồ sơ công khai', desc: 'Cho phép người chơi khác xem chi tiết hồ sơ của bạn.' },
                    { key: 'showActivity', label: 'Hiển thị hoạt động', desc: 'Hiển thị lịch sử đặt sân và thi đấu gần đây trên hồ sơ của bạn.' },
                    { key: 'showMatches', label: 'Hiển thị kết quả thi đấu', desc: 'Để người khác xem thành tích thắng/thua của bạn.' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[var(--theme-primary)]">{item.label}</p>
                        <p className="text-xs text-foreground-muted mt-0.5">{item.desc}</p>
                      </div>
                      <Toggle 
                        checked={privacy[item.key]} 
                        onChange={() => setPrivacy(p => ({ ...p, [item.key]: !p[item.key] }))} 
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payments Panel */}
            {activeSection === 'Thanh toán' && (
              <div className="card-base p-6 shadow-sm animate-fade-in">
                <h2 className="text-[15px] font-bold text-[var(--theme-primary)] mb-5 pb-4 border-b border-border-default">Phương thức thanh toán</h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between p-4 border border-border-default bg-[var(--theme-surface)] rounded-xl hover:border-border-hover transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-6 bg-[var(--theme-surface-hover)] rounded flex items-center justify-center border border-border-default">
                        <span className="text-[10px] font-bold text-[var(--theme-primary)]">VISA</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--theme-primary)]">Visa kết thúc bằng 4242</p>
                        <p className="text-xs text-foreground-muted">Hết hạn 08/26</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-[var(--theme-surface-hover)] text-foreground-muted rounded-lg">Mặc định</span>
                  </div>
                  <button className="flex items-center justify-center gap-2 w-full h-12 border-2 border-dashed border-border-hover rounded-xl text-sm font-semibold text-foreground-muted hover:border-accent hover:text-accent hover:bg-accent/10 transition-all duration-200">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Thêm phương thức thanh toán
                  </button>
                </div>

                <h2 className="text-[15px] font-bold text-[var(--theme-primary)] mb-4 pb-4 border-b border-border-default">Số dư ví</h2>
                <div className="flex items-center justify-between p-5 bg-gradient-to-br from-accent/20 to-purple-500/20 border border-border-default rounded-xl text-[var(--theme-primary)] shadow-md">
                  <div>
                    <p className="text-xs font-semibold text-[var(--theme-primary)]/70 mb-1 uppercase tracking-wider">Số dư khả dụng</p>
                    <p className="text-3xl font-bold tracking-tight text-[var(--theme-primary)]">120,000đ</p>
                  </div>
                  <button className="h-10 px-5 rounded-lg bg-[var(--theme-surface-hover)] border border-border-hover text-[var(--theme-primary)] text-sm font-bold shadow-sm hover:bg-white/20 transition-colors">
                    Nạp tiền
                  </button>
                </div>
              </div>
            )}

            {/* E-KYC Panel */}
            {activeSection === 'Xác thực E-KYC' && (
              <div className="card-base p-6 shadow-sm animate-fade-in">
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-border-default">
                  <h2 className="text-[15px] font-bold text-[var(--theme-primary)]">Xác thực danh tính (E-KYC)</h2>
                  <span className="bg-amber-500/10 text-amber-400 text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border border-amber-500/20">Chưa xác thực</span>
                </div>

                <div className="flex items-start gap-3 mb-6 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                  <p className="text-sm text-blue-200 leading-relaxed">
                    Xác thực E-KYC là bắt buộc để bạn có thể <strong>Tạo kèo</strong> và <strong>Sử dụng ví ký quỹ</strong>. Thông tin của bạn được mã hóa an toàn.
                  </p>
                </div>

                <div className="space-y-5 max-w-[480px]">
                  <div>
                    <label className="block text-xs font-bold text-foreground-muted uppercase tracking-wider mb-2">Mặt trước CMND / CCCD</label>
                    <div className="border-2 border-dashed border-border-hover rounded-2xl h-36 flex flex-col items-center justify-center text-foreground-muted hover:border-accent hover:bg-accent/10 cursor-pointer transition-all">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      <span className="text-sm font-medium">Nhấn để tải ảnh lên</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground-muted uppercase tracking-wider mb-2">Mặt sau CMND / CCCD</label>
                    <div className="border-2 border-dashed border-border-hover rounded-2xl h-36 flex flex-col items-center justify-center text-foreground-muted hover:border-accent hover:bg-accent/10 cursor-pointer transition-all">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      <span className="text-sm font-medium">Nhấn để tải ảnh lên</span>
                    </div>
                  </div>
                </div>

                <button className="mt-6 w-full max-w-[480px] h-11 btn-primary">
                  Gửi yêu cầu xác thực
                </button>
              </div>
            )}

            {/* Appearance Panel */}
            {activeSection === 'Giao diện' && (
              <div className="card-base p-6 shadow-sm animate-fade-in">
                <h2 className="text-[15px] font-bold text-[var(--theme-primary)] mb-5 pb-4 border-b border-border-default">Cài đặt giao diện</h2>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[var(--theme-primary)]">Chế độ tối</p>
                    <p className="text-xs text-foreground-muted mt-0.5">Bật giao diện màu tối để bảo vệ mắt.</p>
                  </div>
                  <Toggle 
                    checked={theme === 'dark'} 
                    onChange={toggleTheme} 
                  />
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <button 
                onClick={handleSave}
                className={`h-11 px-6 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm ${
                  saved 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'btn-primary'
                }`}
              >
                {saved ? '✓ Đã lưu cài đặt' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ApexLayout>
  )
}
