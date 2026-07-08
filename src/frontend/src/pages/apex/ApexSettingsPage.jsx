import { useState, useEffect } from 'react'
import ApexLayout from '../../layouts/ApexLayout'
import { useTheme } from '../../context/ThemeContext'
import authApi from '../../api/authApi'
import { User, ShieldCheck, Bell, Lock, CreditCard, Sun, Plus, Upload, Info } from 'lucide-react'

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      className={`relative w-11 h-6 rounded-full transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-base focus:ring-accent ${
        checked ? 'bg-accent' : 'bg-border-hover'
      }`}
      onClick={onChange}
    >
      <span
        className={`absolute top-1 left-1 bg-paper w-4 h-4 rounded-full transition-transform duration-150 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

const sections = [
  { id: 'Tài khoản', icon: <User size={18} /> },
  { id: 'Xác thực E-KYC', icon: <ShieldCheck size={18} /> },
  { id: 'Thông báo', icon: <Bell size={18} /> },
  { id: 'Quyền riêng tư', icon: <Lock size={18} /> },
  { id: 'Thanh toán', icon: <CreditCard size={18} /> },
  { id: 'Giao diện', icon: <Sun size={18} /> },
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
      <div className="max-w-[1000px] mx-auto auth-animate-in">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl uppercase tracking-[-0.01em] text-foreground">Cài đặt</h1>
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
                  className={`flex items-center gap-3 px-4 py-2.5 label-mono whitespace-nowrap transition-colors border-2 ${
                    activeSection === s.id
                      ? 'border-accent text-accent'
                      : 'border-transparent text-foreground-muted hover:bg-surface hover:text-foreground'
                  }`}
                >
                  <span className={activeSection === s.id ? 'text-accent' : 'text-foreground-muted'}>{s.icon}</span>
                  {s.id}
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 space-y-6">

            {/* Account Panel */}
            {activeSection === 'Tài khoản' && (
              <div className="card-base auth-animate-fade">
                <h2 className="font-heading text-lg uppercase text-foreground mb-5 pb-4 border-b border-border-default">Cài đặt tài khoản</h2>

                <div className="space-y-4 max-w-[480px]">
                  {[
                    { label: 'Họ và tên', id: 'set-name', type: 'text', key: 'name' },
                    { label: 'Địa chỉ Email', id: 'set-email', type: 'email', key: 'email' },
                    { label: 'Số điện thoại', id: 'set-phone', type: 'tel', key: 'phone' },
                  ].map(f => (
                    <div key={f.id}>
                      <label htmlFor={f.id} className="block label-mono text-foreground-muted mb-2">{f.label}</label>
                      <input
                        id={f.id}
                        type={f.type}
                        value={accountForm[f.key]}
                        onChange={e => setAccountForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                        className="input-base h-11"
                      />
                    </div>
                  ))}

                  <div className="pt-4 mt-4 border-t border-border-default">
                    <div className="mb-4">
                      <label htmlFor="set-password" className="block label-mono text-foreground-muted mb-2">Mật khẩu mới</label>
                      <input id="set-password" type="password" placeholder="Để trống nếu không muốn đổi" className="input-base h-11" />
                    </div>
                    <div>
                      <label htmlFor="set-confirm" className="block label-mono text-foreground-muted mb-2">Xác nhận mật khẩu</label>
                      <input id="set-confirm" type="password" placeholder="Xác nhận mật khẩu mới" className="input-base h-11" />
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t-2 border-danger/30 max-w-[480px]">
                  <h3 className="text-sm font-bold text-danger mb-2">Khu vực nguy hiểm</h3>
                  <p className="text-xs text-foreground-muted mb-4">Sau khi bạn xóa tài khoản, không thể khôi phục lại. Vui lòng cân nhắc kỹ.</p>
                  <button className="h-10 px-5 border-2 border-danger text-danger bg-transparent text-sm font-bold uppercase tracking-[0.04em] hover:bg-danger-bg transition-colors">
                    Xóa tài khoản
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Panel */}
            {activeSection === 'Thông báo' && (
              <div className="card-base auth-animate-fade">
                <h2 className="font-heading text-lg uppercase text-foreground mb-5 pb-4 border-b border-border-default">Tùy chọn thông báo</h2>
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
                        <p className="text-sm font-semibold text-foreground">{item.label}</p>
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
              <div className="card-base auth-animate-fade">
                <h2 className="font-heading text-lg uppercase text-foreground mb-5 pb-4 border-b border-border-default">Cài đặt quyền riêng tư</h2>
                <div className="space-y-6">
                  {[
                    { key: 'publicProfile', label: 'Hồ sơ công khai', desc: 'Cho phép người chơi khác xem chi tiết hồ sơ của bạn.' },
                    { key: 'showActivity', label: 'Hiển thị hoạt động', desc: 'Hiển thị lịch sử đặt sân và thi đấu gần đây trên hồ sơ của bạn.' },
                    { key: 'showMatches', label: 'Hiển thị kết quả thi đấu', desc: 'Để người khác xem thành tích thắng/thua của bạn.' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">{item.label}</p>
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
              <div className="card-base auth-animate-fade">
                <h2 className="font-heading text-lg uppercase text-foreground mb-5 pb-4 border-b border-border-default">Phương thức thanh toán</h2>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between p-4 border-2 border-border-default bg-background-base hover:border-border-hover transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-6 bg-surface-hover flex items-center justify-center border border-border-default">
                        <span className="text-[10px] font-bold text-foreground">VISA</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">Visa kết thúc bằng 4242</p>
                        <p className="text-xs text-foreground-muted">Hết hạn 08/26</p>
                      </div>
                    </div>
                    <span className="label-mono px-2.5 py-1 bg-surface-hover text-foreground-muted">Mặc định</span>
                  </div>
                  <button className="flex items-center justify-center gap-2 w-full h-12 border-2 border-dashed border-border-hover text-sm font-semibold text-foreground-muted hover:border-accent hover:text-accent transition-colors">
                    <Plus size={16} />
                    Thêm phương thức thanh toán
                  </button>
                </div>

                <h2 className="font-heading text-lg uppercase text-foreground mb-4 pb-4 border-b border-border-default">Số dư ví</h2>
                <div className="flex items-center justify-between p-5 bg-ink text-paper border-2 border-border-strong">
                  <div>
                    <p className="label-mono text-paper/70 mb-1">Số dư khả dụng</p>
                    <p className="font-heading text-3xl text-paper">120,000đ</p>
                  </div>
                  <button className="h-10 px-5 border-2 border-paper/30 text-paper text-sm font-bold uppercase tracking-[0.04em] hover:border-accent hover:text-accent transition-colors">
                    Nạp tiền
                  </button>
                </div>
              </div>
            )}

            {/* E-KYC Panel */}
            {activeSection === 'Xác thực E-KYC' && (
              <div className="card-base auth-animate-fade">
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-border-default">
                  <h2 className="font-heading text-lg uppercase text-foreground">Xác thực danh tính (E-KYC)</h2>
                  <span className="bg-warning-bg text-warning label-mono px-3 py-1.5 border border-warning">Chưa xác thực</span>
                </div>

                <div className="flex items-start gap-3 mb-6 border-2 border-border-default bg-background-base p-4">
                  <Info size={18} className="shrink-0 mt-0.5 text-accent" />
                  <p className="text-sm text-foreground-muted leading-relaxed">
                    Xác thực E-KYC là bắt buộc để bạn có thể <strong className="text-foreground">Tạo kèo</strong> và <strong className="text-foreground">Sử dụng ví ký quỹ</strong>. Thông tin của bạn được mã hóa an toàn.
                  </p>
                </div>

                <div className="space-y-5 max-w-[480px]">
                  <div>
                    <label className="block label-mono text-foreground-muted mb-2">Mặt trước CMND / CCCD</label>
                    <div className="border-2 border-dashed border-border-hover h-36 flex flex-col items-center justify-center text-foreground-muted hover:border-accent hover:text-accent cursor-pointer transition-colors">
                      <Upload size={24} className="mb-2" />
                      <span className="text-sm font-medium">Nhấn để tải ảnh lên</span>
                    </div>
                  </div>
                  <div>
                    <label className="block label-mono text-foreground-muted mb-2">Mặt sau CMND / CCCD</label>
                    <div className="border-2 border-dashed border-border-hover h-36 flex flex-col items-center justify-center text-foreground-muted hover:border-accent hover:text-accent cursor-pointer transition-colors">
                      <Upload size={24} className="mb-2" />
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
              <div className="card-base auth-animate-fade">
                <h2 className="font-heading text-lg uppercase text-foreground mb-5 pb-4 border-b border-border-default">Cài đặt giao diện</h2>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">Chế độ tối</p>
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
                className={`h-11 px-6 text-sm font-bold uppercase tracking-[0.04em] border-2 transition-colors ${
                  saved
                    ? 'border-accent text-accent'
                    : 'btn-primary'
                }`}
              >
                {saved ? 'Đã lưu cài đặt' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ApexLayout>
  )
}
