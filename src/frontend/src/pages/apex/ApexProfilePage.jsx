import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ApexLayout from '../../layouts/ApexLayout'
import authApi from '../../api/authApi'
import { bookingApi } from '../../api/bookingApi'

export default function ApexProfilePage() {
  const [editing, setEditing] = useState(false)
  const [profile, setProfile] = useState(null)
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

        if (profileRes?.data?.data) {
          const p = profileRes.data.data
          setProfile(p)
          setForm({
            name: p.fullName || '',
            email: p.email || '',
            phone: p.phone || '',
            sport: p.sportPreference || 'Cầu lông',
            level: p.skillLevel || 'Trung bình',
            bio: p.bio || ''
          })
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

  function save() {
    setEditing(false)
    // TODO: Wire to authApi.updateProfile()
  }

  const statusLabels = {
    Confirmed: 'Đã xác nhận',
    Pending: 'Chờ thanh toán',
    Completed: 'Đã hoàn thành',
    Cancelled: 'Đã hủy',
  }

  return (
    <ApexLayout>
      <div className="max-w-[900px] mx-auto space-y-6 animate-fade-up">

        {/* Profile Header */}
        <div className="card-base p-6 md:p-8 flex max-md:flex-col md:items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80"
                alt={form.name}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-white/5"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--theme-primary)] tracking-tight">{form.name || 'Người dùng'}</h1>
              <div className="flex items-center gap-3 mt-1.5 mb-2">
                <span className="px-2.5 py-1 bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-wider rounded-md">
                  {form.sport}
                </span>
                <span className="text-sm font-semibold text-foreground-muted">{form.level}</span>
              </div>
              <p className="text-sm text-foreground-muted flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                {form.email}
              </p>
            </div>
          </div>
          <button
            className={`${editing ? 'btn-primary' : 'btn-outline'} h-10 px-5 shrink-0`}
            onClick={editing ? save : () => setEditing(true)}
          >
            {editing ? '✓ Lưu thay đổi' : 'Sửa hồ sơ'}
          </button>
        </div>

        {/* Main Content: 2 Column */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Personal Info */}
          <div className="lg:col-span-2">
            <div className="card-base p-6 shadow-sm">
              <h2 className="text-[15px] font-bold text-[var(--theme-primary)] mb-5 pb-4 border-b border-border-default">Thông tin cá nhân</h2>

              {editing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: 'Họ và tên', key: 'name', type: 'text' },
                      { label: 'Email', key: 'email', type: 'email' },
                      { label: 'Số điện thoại', key: 'phone', type: 'tel' },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="block text-xs font-bold text-foreground-muted uppercase tracking-wider mb-2">{f.label}</label>
                        <input
                          type={f.type}
                          value={form[f.key]}
                          onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                          className="w-full h-11 px-4 bg-[var(--theme-surface)] border border-border-default rounded-xl text-sm text-[var(--theme-primary)] font-medium focus:border-accent focus:ring-1 focus:ring-accent/20 outline-none transition-all shadow-sm"
                        />
                      </div>
                    ))}

                    <div>
                      <label className="block text-xs font-bold text-foreground-muted uppercase tracking-wider mb-2">Môn thể thao chính</label>
                      <select
                        value={form.sport}
                        onChange={e => setForm({ ...form, sport: e.target.value })}
                        className="w-full h-11 px-4 bg-[var(--theme-surface)] border border-border-default rounded-xl text-sm text-[var(--theme-primary)] font-medium focus:border-accent focus:ring-1 focus:ring-accent/20 outline-none transition-all shadow-sm cursor-pointer"
                      >
                        {['Cầu lông', 'Pickleball'].map(s => <option key={s} className="bg-background-base">{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-foreground-muted uppercase tracking-wider mb-2">Trình độ</label>
                      <select
                        value={form.level}
                        onChange={e => setForm({ ...form, level: e.target.value })}
                        className="w-full h-11 px-4 bg-[var(--theme-surface)] border border-border-default rounded-xl text-sm text-[var(--theme-primary)] font-medium focus:border-accent focus:ring-1 focus:ring-accent/20 outline-none transition-all shadow-sm cursor-pointer"
                      >
                        {['Người mới', 'Trung bình', 'Nâng cao', 'Chuyên nghiệp'].map(l => <option key={l} className="bg-background-base">{l}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground-muted uppercase tracking-wider mb-2">Giới thiệu</label>
                    <textarea
                      value={form.bio}
                      onChange={e => setForm({ ...form, bio: e.target.value })}
                      className="w-full p-4 bg-[var(--theme-surface)] border border-border-default rounded-xl text-sm text-[var(--theme-primary)] font-medium focus:border-accent focus:ring-1 focus:ring-accent/20 outline-none transition-all shadow-sm resize-none h-28"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="flex max-sm:flex-col sm:items-center py-2 border-b border-border-default">
                    <span className="w-40 text-sm font-medium text-foreground-muted">Số điện thoại</span>
                    <strong className="text-sm font-semibold text-[var(--theme-primary)]">{form.phone || '—'}</strong>
                  </div>
                  <div className="flex max-sm:flex-col sm:items-center py-2 border-b border-border-default">
                    <span className="w-40 text-sm font-medium text-foreground-muted">Môn thể thao chính</span>
                    <strong className="text-sm font-semibold text-[var(--theme-primary)]">{form.sport}</strong>
                  </div>
                  <div className="flex max-sm:flex-col sm:items-center py-2 border-b border-border-default">
                    <span className="w-40 text-sm font-medium text-foreground-muted">Trình độ</span>
                    <strong className="text-sm font-semibold text-[var(--theme-primary)]">{form.level}</strong>
                  </div>
                  <div className="flex max-sm:flex-col sm:items-center py-2 border-b border-border-default">
                    <span className="w-40 text-sm font-medium text-foreground-muted">Tổng đặt sân</span>
                    <strong className="text-sm font-semibold text-[var(--theme-primary)]">{bookingCount} lượt</strong>
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
            <div className="card-base p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-border-default">
                <h2 className="text-[15px] font-bold text-[var(--theme-primary)]">Đặt sân gần đây</h2>
                <Link to="/apex/bookings" className="text-xs font-semibold text-accent hover:text-accent-bright">Xem tất cả</Link>
              </div>

              {recentBookings.length > 0 ? (
                <div className="space-y-4">
                  {recentBookings.map(b => (
                    <div key={b.bookingId} className="flex gap-3">
                      <span className="w-8 h-8 rounded-lg bg-[var(--theme-surface)] border border-border-default flex items-center justify-center text-sm shrink-0 mt-0.5">
                        {b.details?.[0]?.courtName?.toLowerCase().includes('pickleball') ? '🏓' : '🏸'}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-[var(--theme-primary)] leading-snug truncate">{b.details?.[0]?.courtName || 'Sân'}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-foreground-muted font-medium">
                            {new Date(b.details?.[0]?.bookingDate).toLocaleDateString('vi-VN')}
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                            b.status === 'Confirmed' ? 'bg-accent/10 text-accent border-accent/20' :
                            b.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            b.status === 'Cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                            'bg-[var(--theme-surface)] text-foreground-muted border-border-default'
                          }`}>
                            {statusLabels[b.status] || b.status}
                          </span>
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
            <div className="card-base p-6 shadow-sm">
              <h2 className="text-[15px] font-bold text-[var(--theme-primary)] mb-4 pb-4 border-b border-border-default">Liên kết nhanh</h2>
              <div className="space-y-2">
                {[
                  { to: '/apex/settings', label: 'Cài đặt tài khoản', icon: '⚙️' },
                  { to: '/apex/bookings', label: 'Lịch sử đặt sân', icon: '📅' },
                  { to: '/gear/catalog', label: 'Thuê dụng cụ', icon: '🎾' },
                  { to: '/apex/support', label: 'Trung tâm hỗ trợ', icon: '💬' },
                ].map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="flex items-center gap-3 p-3 rounded-xl text-sm font-medium text-foreground-muted hover:bg-[var(--theme-surface)] hover:text-[var(--theme-primary)] transition-colors border border-transparent hover:border-border-default"
                  >
                    <span className="w-7 h-7 rounded-lg bg-[var(--theme-surface)] flex items-center justify-center text-sm border border-border-default">{link.icon}</span>
                    {link.label}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-auto text-[var(--theme-primary)]/20"><polyline points="9 18 15 12 9 6"/></svg>
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
