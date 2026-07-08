import { useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { User, ShieldCheck, LogOut, Upload } from 'lucide-react'

export default function CustomerProfilePage() {
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <div className="flex flex-col min-h-screen bg-background-base">
      <Navbar theme="light" />

      <div className="max-w-[1000px] mx-auto px-6 pt-[100px] sm:pt-[130px] pb-20 w-full flex-1">
        <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground mb-8">Tài khoản của tôi</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
          {/* Sidebar */}
          <div className="card-base h-fit">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-3 px-4 py-3 rounded-[2px] text-sm font-bold transition-colors ${activeTab === 'profile' ? 'bg-accent/10 text-accent' : 'text-foreground-muted hover:bg-surface-hover'}`}
              >
                <User size={18} />
                Thông tin cá nhân
              </button>
              <button
                onClick={() => setActiveTab('ekyc')}
                className={`flex items-center gap-3 px-4 py-3 rounded-[2px] text-sm font-bold transition-colors ${activeTab === 'ekyc' ? 'bg-accent/10 text-accent' : 'text-foreground-muted hover:bg-surface-hover'}`}
              >
                <ShieldCheck size={18} />
                Xác thực E-KYC
              </button>
              <div className="h-px bg-border-default my-2"></div>
              <button className="flex items-center gap-3 px-4 py-3 rounded-[2px] text-sm font-bold text-danger hover:bg-danger-bg transition-colors">
                <LogOut size={18} />
                Đăng xuất
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="card-base">
            {activeTab === 'profile' && (
              <div className="auth-animate-fade">
                <h2 className="font-heading text-xl uppercase text-foreground mb-6">Cập nhật hồ sơ</h2>

                <div className="flex items-center gap-6 mb-8">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80" alt="Avatar" className="w-24 h-24 rounded-full object-cover border-2 border-border-strong" />
                  <div>
                    <button className="btn-outline text-xs">Đổi ảnh đại diện</button>
                    <p className="label-mono text-foreground-subtle mt-2">JPG, GIF hoặc PNG. Tối đa 5MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-6 mb-8">
                  <div>
                    <label className="block label-mono text-foreground-muted mb-2">Họ và tên</label>
                    <input type="text" defaultValue="Alex Mercer" className="input-base" />
                  </div>
                  <div>
                    <label className="block label-mono text-foreground-muted mb-2">Số điện thoại</label>
                    <input type="tel" defaultValue="0901234567" className="input-base" />
                  </div>
                  <div className="col-span-full">
                    <label className="block label-mono text-foreground-muted mb-2">Địa chỉ email</label>
                    <input type="email" defaultValue="alex.mercer@example.com" disabled className="input-base bg-surface-hover text-foreground-muted cursor-not-allowed" />
                  </div>
                </div>

                <button className="btn-primary">Lưu thay đổi</button>
              </div>
            )}

            {activeTab === 'ekyc' && (
              <div className="auth-animate-fade">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                  <h2 className="font-heading text-xl uppercase text-foreground">Xác thực danh tính (E-KYC)</h2>
                  <span className="label-mono bg-warning-bg text-warning border border-warning px-3 py-1.5">Chưa xác thực</span>
                </div>

                <div className="border-2 border-border-strong bg-background-base p-4 flex gap-3 mb-8">
                  <ShieldCheck size={20} className="text-accent shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground-muted leading-relaxed">
                    Xác thực E-KYC là bắt buộc để bạn có thể <b className="text-foreground">Tạo kèo</b> và <b className="text-foreground">Sử dụng ví ký quỹ</b>. Thông tin của bạn được mã hóa an toàn.
                  </p>
                </div>

                <div className="space-y-6 mb-8">
                  <div>
                    <label className="block label-mono text-foreground-muted mb-2">Mặt trước CMND / CCCD</label>
                    <div className="border-2 border-dashed border-border-hover h-40 flex flex-col items-center justify-center text-foreground-muted hover:border-accent hover:bg-accent/5 cursor-pointer transition-colors">
                      <Upload size={32} className="mb-2" />
                      <span className="text-sm font-medium">Nhấn để tải ảnh lên</span>
                    </div>
                  </div>
                  <div>
                    <label className="block label-mono text-foreground-muted mb-2">Mặt sau CMND / CCCD</label>
                    <div className="border-2 border-dashed border-border-hover h-40 flex flex-col items-center justify-center text-foreground-muted hover:border-accent hover:bg-accent/5 cursor-pointer transition-colors">
                      <Upload size={32} className="mb-2" />
                      <span className="text-sm font-medium">Nhấn để tải ảnh lên</span>
                    </div>
                  </div>
                </div>

                <button className="btn-primary w-full h-12">Gửi yêu cầu xác thực</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer variant="light" />
    </div>
  )
}
