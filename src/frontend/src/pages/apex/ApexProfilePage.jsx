import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ApexLayout from '../../layouts/ApexLayout'
import authApi from '../../api/authApi'
import { bookingApi } from '../../api/bookingApi'
import { useToast } from '../../components/Toast'
import StatusBadge from '../../components/ui/StatusBadge'
import { Mail, Settings, BookOpen, ShoppingBag, LifeBuoy, ChevronRight } from 'lucide-react'

export default function ApexProfilePage() {
  const { addToast } = useToast()
  const [editing, setEditing] = useState(false)
  const [, setProfile] = useState(null)
  const [bookingCount, setBookingCount] = useState(0)
  const [recentBookings, setRecentBookings] = useState([])
  const [form, setForm] = useState({
    name: '', email: '', phone: '', sport: 'Cầu lông', level: 'Trung bình',
    bio: ''
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const [profileRes, bookingsRes] = await Promise.all([
          authApi.getProfile(),
          bookingApi.getMyBookings()
        ])

        if (profileRes?.statusCode === 200 && profileRes.data) {
          const p = profileRes.data
          setProfile(p)
          setForm(prev => ({
            ...prev,
            name: p.fullName || '',
            email: p.email || '',
            phone: p.phoneNumber || prev.phone,
          }))
        }

        if (bookingsRes?.data) {
          const bookings = bookingsRes.data
          setBookingCount(bookings.length)
          // Show 4 most recent bookings as activity
          setRecentBookings(
            bookings
              .sort((a, b) => new Date(b.createdAt || b.bookingDate) - new Date(a.createdAt || a.bookingDate))
              .slice(0, 4)
          )
        }
      } catch (err) {
        console.error("Failed to fetch profile data", err)
      }
    }
    fetchData()
  }, [])

  async function save() {
    try {
      const res = await authApi.updateProfile({ fullName: form.name, phoneNumber: form.phone })
      if (res?.statusCode === 200) {
        addToast('Đã cập nhật hồ sơ.', 'success')
        if (res.data) setProfile(res.data)
        setEditing(false)
      } else {
        addToast(res?.message || 'Cập nhật hồ sơ thất bại.', 'error')
      }
    } catch (err) {
      addToast(typeof err === 'string' ? err : 'Cập nhật hồ sơ thất bại.', 'error')
    }
  }

  return (
    <ApexLayout>
      <div className="max-w-[900px] mx-auto space-y-6 auth-animate-in">

        {/* Profile Header */}
        <div className="card-base flex max-md:flex-col md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80"
                alt={form.name}
                className="w-24 h-24 rounded-full object-cover border-2 border-border-strong"
              />
            </div>
            <div>
              <h1 className="font-heading text-2xl uppercase tracking-[-0.01em] text-foreground">{form.name || 'Người dùng'}</h1>
              <div className="flex items-center gap-3 mt-1.5 mb-2">
                <span className="px-2.5 py-1 border border-accent text-accent label-mono">
                  {form.sport}
                </span>
                <span className="text-sm font-semibold text-foreground-muted">{form.level}</span>
              </div>
              <p className="text-sm text-foreground-muted flex items-center gap-1.5">
                <Mail size={14} />
                {form.email}
              </p>
            </div>
          </div>
          <button
            className={`${editing ? 'btn-primary' : 'btn-outline'} h-10 px-5 shrink-0`}
            onClick={editing ? save : () => setEditing(true)}
          >
            {editing ? 'Lưu thay đổi' : 'Sửa hồ sơ'}
          </button>
        </div>

        {/* Main Content: 2 Column */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Personal Info */}
          <div className="lg:col-span-2">
            <div className="card-base">
              <h2 className="font-heading text-lg uppercase text-foreground mb-5 pb-4 border-b border-border-default">Thông tin cá nhân</h2>

              {editing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: 'Họ và tên', key: 'name', type: 'text' },
                      { label: 'Email', key: 'email', type: 'email' },
                      { label: 'Số điện thoại', key: 'phone', type: 'tel' },
                    ].map(f => (
                      <div key={f.key}>
                        <label htmlFor={`profile-${f.key}`} className="block label-mono text-foreground-muted mb-2">{f.label}</label>
                        <input
                          id={`profile-${f.key}`}
                          type={f.type}
                          value={form[f.key]}
                          onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                          className="input-base h-11"
                        />
                      </div>
                    ))}

                    <div>
                      <label htmlFor="profile-sport" className="block label-mono text-foreground-muted mb-2">Môn thể thao chính</label>
                      <select
                        id="profile-sport"
                        value={form.sport}
                        onChange={e => setForm({ ...form, sport: e.target.value })}
                        className="input-base h-11 cursor-pointer"
                      >
                        {['Cầu lông', 'Pickleball'].map(s => <option key={s} className="bg-surface">{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="profile-level" className="block label-mono text-foreground-muted mb-2">Trình độ</label>
                      <select
                        id="profile-level"
                        value={form.level}
                        onChange={e => setForm({ ...form, level: e.target.value })}
                        className="input-base h-11 cursor-pointer"
                      >
                        {['Người mới', 'Trung bình', 'Nâng cao', 'Chuyên nghiệp'].map(l => <option key={l} className="bg-surface">{l}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="profile-bio" className="block label-mono text-foreground-muted mb-2">Giới thiệu</label>
                    <textarea
                      id="profile-bio"
                      value={form.bio}
                      onChange={e => setForm({ ...form, bio: e.target.value })}
                      className="input-base h-28 py-3 resize-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="flex max-sm:flex-col sm:items-center py-2 border-b border-border-default">
                    <span className="w-40 text-sm font-medium text-foreground-muted">Số điện thoại</span>
                    <strong className="text-sm font-semibold text-foreground">{form.phone || '—'}</strong>
                  </div>
                  <div className="flex max-sm:flex-col sm:items-center py-2 border-b border-border-default">
                    <span className="w-40 text-sm font-medium text-foreground-muted">Môn thể thao chính</span>
                    <strong className="text-sm font-semibold text-foreground">{form.sport}</strong>
                  </div>
                  <div className="flex max-sm:flex-col sm:items-center py-2 border-b border-border-default">
                    <span className="w-40 text-sm font-medium text-foreground-muted">Trình độ</span>
                    <strong className="text-sm font-semibold text-foreground">{form.level}</strong>
                  </div>
                  <div className="flex max-sm:flex-col sm:items-center py-2 border-b border-border-default">
                    <span className="w-40 text-sm font-medium text-foreground-muted">Tổng đặt sân</span>
                    <strong className="text-sm font-semibold text-foreground">{bookingCount} lượt</strong>
                  </div>
                  {form.bio && (
                    <div className="flex max-sm:flex-col py-2">
                      <span className="w-40 text-sm font-medium text-foreground-muted shrink-0 mb-1">Giới thiệu</span>
                      <p className="text-sm text-foreground-muted leading-relaxed">{form.bio}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: Recent Bookings */}
          <div className="space-y-6">
            <div className="card-base">
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-border-default">
                <h2 className="font-heading text-lg uppercase text-foreground">Đặt sân gần đây</h2>
                <Link to="/apex/bookings" className="label-mono text-accent hover:text-accent-bright">Xem tất cả</Link>
              </div>

              {recentBookings.length > 0 ? (
                <div className="space-y-4">
                  {recentBookings.map(b => (
                    <div key={b.bookingId} className="flex gap-3">
                      <span className="w-8 h-8 bg-background-base border border-border-default flex items-center justify-center text-sm shrink-0 mt-0.5">
                        {b.details?.[0]?.courtName?.toLowerCase().includes('pickleball') ? '🏓' : '🏸'}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground leading-snug truncate">{b.details?.[0]?.courtName || 'Sân'}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-foreground-muted font-medium">
                            {new Date(b.details?.[0]?.bookingDate).toLocaleDateString('vi-VN')}
                          </span>
                          <StatusBadge status={b.status} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center">
                  <p className="text-sm text-foreground-muted mb-3">Chưa có lịch đặt sân nào</p>
                  <Link to="/apex/booking" className="text-sm font-semibold text-accent hover:text-accent-bright">Đặt sân ngay →</Link>
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="card-base">
              <h2 className="font-heading text-lg uppercase text-foreground mb-4 pb-4 border-b border-border-default">Liên kết nhanh</h2>
              <div className="space-y-1">
                {[
                  { to: '/apex/settings', label: 'Cài đặt tài khoản', icon: <Settings size={16} /> },
                  { to: '/apex/bookings', label: 'Lịch sử đặt sân', icon: <BookOpen size={16} /> },
                  { to: '/gear/catalog', label: 'Thuê dụng cụ', icon: <ShoppingBag size={16} /> },
                  { to: '/apex/support', label: 'Trung tâm hỗ trợ', icon: <LifeBuoy size={16} /> },
                ].map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="flex items-center gap-3 p-3 text-sm font-medium text-foreground-muted hover:bg-surface-hover hover:text-foreground transition-colors border border-transparent"
                  >
                    <span className="w-7 h-7 bg-background-base flex items-center justify-center border border-border-default text-foreground-muted">{link.icon}</span>
                    {link.label}
                    <ChevronRight size={14} className="ml-auto text-foreground-muted" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ApexLayout>
  )
}
