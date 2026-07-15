import { useState, useEffect } from 'react'
import ApexLayout from '../../layouts/ApexLayout'
import { useTheme } from '../../context/ThemeContext'
import authApi from '../../api/authApi'
import EkycPanel from '../../components/kyc/EkycPanel'
import { User, ShieldCheck, Bell, Lock, CreditCard, Sun, Plus, AlertTriangle, Save, CheckCircle2 } from 'lucide-react'

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-[#14b8a6]/20 border-0 cursor-pointer shadow-inner ${
        checked ? 'bg-[#14b8a6]' : 'bg-gray-200'
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

  async function handleSave() {
    try {
      const res = await authApi.updateProfile({
        fullName: accountForm.name,
        phoneNumber: accountForm.phone,
      })
      if (res?.statusCode === 200) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } catch {
      // giữ nút ở trạng thái thường nếu lưu thất bại
    }
  }

  const inputClasses = "w-full px-4 h-12 bg-[#F8F9FA] border border-gray-200 rounded-[12px] text-[14px] text-gray-700 focus:bg-white focus:border-[#14b8a6] focus:ring-4 focus:ring-[#14b8a6]/10 transition-all outline-none"

  return (
    <ApexLayout>
      <div className="font-sans max-w-[1000px] mx-auto auth-animate-in pb-20">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-[#0f172a] m-0 mb-2">Cài đặt</h1>
          <p className="text-[14px] text-gray-500 m-0">Quản lý tùy chọn và cài đặt tài khoản của bạn.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">

          {/* Sidebar Nav */}
          <div className="w-full md:w-[240px] shrink-0">
            <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 hide-scrollbar">
              {sections.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-[12px] text-[14px] font-bold transition-all border-0 cursor-pointer whitespace-nowrap ${
                    activeSection === s.id
                      ? 'bg-[#14b8a6] text-white shadow-md'
                      : 'bg-transparent text-gray-500 hover:bg-[#F8F9FA] hover:text-[#0f172a]'
                  }`}
                >
                  <span className={activeSection === s.id ? 'text-white' : 'text-gray-400'}>{s.icon}</span>
                  {s.id}
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 space-y-6">

            {/* Account Panel */}
            {activeSection === 'Tài khoản' && (
              <div className="bg-white rounded-[20px] shadow-[0_2px_16px_rgba(0,0,0,0.04)] border border-gray-100 p-8 auth-animate-fade">
                <h2 className="font-bold text-[18px] text-[#0f172a] m-0 mb-6 pb-4 border-b border-gray-100">Cài đặt tài khoản</h2>

                <div className="space-y-5 max-w-[500px]">
                  {[
                    { label: 'Họ và tên', id: 'set-name', type: 'text', key: 'name' },
                    { label: 'Địa chỉ Email', id: 'set-email', type: 'email', key: 'email' },
                    { label: 'Số điện thoại', id: 'set-phone', type: 'tel', key: 'phone' },
                  ].map(f => (
                    <div key={f.id}>
                      <label htmlFor={f.id} className="block text-[13px] font-bold text-gray-600 mb-2">{f.label}</label>
                      <input
                        id={f.id}
                        type={f.type}
                        value={accountForm[f.key]}
                        onChange={e => setAccountForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                        className={inputClasses}
                        disabled={f.key === 'email'} // Usually email is disabled in standard settings if no flow is provided
                      />
                    </div>
                  ))}

                  <div className="pt-6 mt-6 border-t border-gray-100 space-y-5">
                    <div>
                      <label htmlFor="set-password" className="block text-[13px] font-bold text-gray-600 mb-2">Mật khẩu mới</label>
                      <input id="set-password" type="password" placeholder="Để trống nếu không muốn đổi" className={inputClasses} />
                    </div>
                    <div>
                      <label htmlFor="set-confirm" className="block text-[13px] font-bold text-gray-600 mb-2">Xác nhận mật khẩu</label>
                      <input id="set-confirm" type="password" placeholder="Xác nhận mật khẩu mới" className={inputClasses} />
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-6 border-t border-red-100 max-w-[500px] bg-red-50/50 p-6 rounded-[16px]">
                  <div className="flex items-center gap-2 text-red-600 mb-2">
                    <AlertTriangle size={18} />
                    <h3 className="text-[14px] font-bold m-0">Khu vực nguy hiểm</h3>
                  </div>
                  <p className="text-[13px] text-gray-500 mb-5 m-0 leading-relaxed">Sau khi bạn xóa tài khoản, mọi dữ liệu sẽ bị xóa vĩnh viễn và không thể khôi phục lại. Vui lòng cân nhắc kỹ.</p>
                  <button className="h-10 px-5 rounded-[8px] border border-red-200 text-red-600 bg-white hover:bg-red-50 text-[12px] font-bold uppercase tracking-wide transition-colors cursor-pointer shadow-sm">
                    Xóa tài khoản
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Panel */}
            {activeSection === 'Thông báo' && (
              <div className="bg-white rounded-[20px] shadow-[0_2px_16px_rgba(0,0,0,0.04)] border border-gray-100 p-8 auth-animate-fade">
                <h2 className="font-bold text-[18px] text-[#0f172a] m-0 mb-6 pb-4 border-b border-gray-100">Tùy chọn thông báo</h2>
                <div className="space-y-6">
                  {[
                    { key: 'bookingReminder', label: 'Nhắc nhở đặt sân', desc: 'Nhận nhắc nhở 2 giờ trước phiên đặt sân của bạn.' },
                    { key: 'matchInvite', label: 'Lời mời thi đấu', desc: 'Nhận thông báo khi có lời mời thi đấu từ người chơi khác.' },
                    { key: 'payments', label: 'Biên lai thanh toán', desc: 'Nhận biên lai cho mọi giao dịch thanh toán và hoàn tiền.' },
                    { key: 'email', label: 'Thông báo qua Email', desc: 'Nhận các cập nhật quan trọng qua email.' },
                    { key: 'sms', label: 'Cảnh báo SMS', desc: 'Nhận các cảnh báo quan trọng qua SMS.' },
                    { key: 'marketing', label: 'Khuyến mãi & Ưu đãi', desc: 'Nhận email khuyến mãi và ưu đãi đặc biệt.' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between gap-6 p-4 rounded-[12px] border border-gray-100 hover:border-teal-100 hover:bg-teal-50/30 transition-colors">
                      <div className="flex-1">
                        <p className="text-[14.5px] font-bold text-[#0f172a] m-0 mb-1">{item.label}</p>
                        <p className="text-[13px] text-gray-500 m-0">{item.desc}</p>
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
              <div className="bg-white rounded-[20px] shadow-[0_2px_16px_rgba(0,0,0,0.04)] border border-gray-100 p-8 auth-animate-fade">
                <h2 className="font-bold text-[18px] text-[#0f172a] m-0 mb-6 pb-4 border-b border-gray-100">Cài đặt quyền riêng tư</h2>
                <div className="space-y-6">
                  {[
                    { key: 'publicProfile', label: 'Hồ sơ công khai', desc: 'Cho phép người chơi khác xem chi tiết hồ sơ của bạn.' },
                    { key: 'showActivity', label: 'Hiển thị hoạt động', desc: 'Hiển thị lịch sử đặt sân và thi đấu gần đây trên hồ sơ của bạn.' },
                    { key: 'showMatches', label: 'Hiển thị kết quả thi đấu', desc: 'Để người khác xem thành tích thắng/thua của bạn.' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between gap-6 p-4 rounded-[12px] border border-gray-100 hover:border-teal-100 hover:bg-teal-50/30 transition-colors">
                      <div className="flex-1">
                        <p className="text-[14.5px] font-bold text-[#0f172a] m-0 mb-1">{item.label}</p>
                        <p className="text-[13px] text-gray-500 m-0">{item.desc}</p>
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
              <div className="bg-white rounded-[20px] shadow-[0_2px_16px_rgba(0,0,0,0.04)] border border-gray-100 p-8 auth-animate-fade">
                <h2 className="font-bold text-[18px] text-[#0f172a] m-0 mb-6 pb-4 border-b border-gray-100">Phương thức thanh toán</h2>

                <div className="space-y-4 mb-10">
                  <div className="flex items-center justify-between p-5 rounded-[12px] border border-gray-200 bg-[#F8F9FA]">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-white rounded-[6px] shadow-sm flex items-center justify-center border border-gray-100">
                        <span className="text-[11px] font-black text-[#0f172a] italic tracking-tighter">VISA</span>
                      </div>
                      <div>
                        <p className="text-[14px] font-bold text-[#0f172a] m-0 mb-0.5">Visa kết thúc bằng 4242</p>
                        <p className="text-[12px] text-gray-500 m-0">Hết hạn 08/26</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-[11px] font-bold uppercase tracking-wider text-gray-500 shadow-sm">Mặc định</span>
                  </div>
                  <button className="flex items-center justify-center gap-2 w-full h-12 rounded-[12px] border-2 border-dashed border-gray-200 bg-transparent text-[13px] font-bold text-gray-500 hover:border-[#14b8a6] hover:text-[#14b8a6] hover:bg-teal-50/30 transition-all cursor-pointer">
                    <Plus size={18} />
                    Thêm phương thức thanh toán
                  </button>
                </div>

                <h2 className="font-bold text-[18px] text-[#0f172a] m-0 mb-6 pb-4 border-b border-gray-100">Số dư ví Pro-Sport</h2>
                <div className="flex items-center justify-between p-8 rounded-[16px] bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                  <div className="relative z-10">
                    <p className="text-[13px] font-medium text-white/60 m-0 mb-2 uppercase tracking-wider">Số dư khả dụng</p>
                    <p className="font-heading text-4xl m-0">120,000 đ</p>
                  </div>
                  <button className="relative z-10 h-11 px-6 rounded-full bg-white text-[#0f172a] text-[13px] font-bold uppercase tracking-wide hover:bg-gray-100 transition-colors shadow-md border-0 cursor-pointer">
                    Nạp tiền ngay
                  </button>
                </div>
              </div>
            )}

            {/* E-KYC Panel */}
            {activeSection === 'Xác thực E-KYC' && (
              <div className="bg-white rounded-[20px] shadow-[0_2px_16px_rgba(0,0,0,0.04)] border border-gray-100 p-8 auth-animate-fade">
                <EkycPanel />
              </div>
            )}

            {/* Appearance Panel */}
            {activeSection === 'Giao diện' && (
              <div className="bg-white rounded-[20px] shadow-[0_2px_16px_rgba(0,0,0,0.04)] border border-gray-100 p-8 auth-animate-fade">
                <h2 className="font-bold text-[18px] text-[#0f172a] m-0 mb-6 pb-4 border-b border-gray-100">Cài đặt giao diện</h2>
                <div className="flex items-center justify-between gap-6 p-4 rounded-[12px] border border-gray-100 hover:border-teal-100 hover:bg-teal-50/30 transition-colors">
                  <div className="flex-1">
                    <p className="text-[14.5px] font-bold text-[#0f172a] m-0 mb-1">Chế độ tối (Dark Mode)</p>
                    <p className="text-[13px] text-gray-500 m-0">Bật giao diện màu tối để bảo vệ mắt khi sử dụng vào ban đêm.</p>
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
                className={`h-12 px-8 rounded-full text-[13px] font-bold uppercase tracking-wide transition-all border-0 cursor-pointer flex items-center gap-2 shadow-sm ${
                  saved
                    ? 'bg-green-500 text-white shadow-[0_4px_12px_rgba(34,197,94,0.3)]'
                    : 'bg-[#14b8a6] hover:bg-[#0f9e8c] text-white shadow-[0_4px_12px_rgba(20,184,166,0.25)]'
                }`}
              >
                {saved ? <CheckCircle2 size={18} /> : <Save size={18} />}
                {saved ? 'Đã lưu cài đặt' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ApexLayout>
  )
}
