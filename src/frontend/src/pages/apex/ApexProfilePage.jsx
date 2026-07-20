import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ApexLayout from '../../layouts/ApexLayout'
import authApi from '../../api/authApi'
import { bookingApi } from '../../api/bookingApi'
import { useToast } from '../../components/Toast'
import StatusBadge from '../../components/ui/StatusBadge'
import { Mail, Settings, BookOpen, ShoppingBag, LifeBuoy, ChevronRight, Edit2 } from 'lucide-react'

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

  const inputClasses = "w-full px-4 h-12 bg-[#F8F9FA] border border-gray-200 rounded-[12px] text-[14px] text-gray-700 focus:bg-white focus:border-[#14b8a6] focus:ring-4 focus:ring-[#14b8a6]/10 transition-all outline-none"

  return (
    <ApexLayout>
      <div className="font-sans max-w-[1000px] mx-auto space-y-6 auth-animate-in pb-20">

        {/* Profile Header Card */}
        <div className="bg-white rounded-[20px] shadow-[0_2px_16px_rgba(0,0,0,0.04)] border border-gray-100 p-8 flex max-md:flex-col md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80"
                alt={form.name}
                className="w-24 h-24 rounded-full object-cover shadow-sm ring-4 ring-white"
              />
            </div>
            <div>
              <h1 className="font-bold text-2xl tracking-tight text-[#0f172a] m-0 mb-2">{form.name || 'Người dùng'}</h1>
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-teal-50 text-[#14b8a6] rounded-full text-[12px] font-bold uppercase tracking-wider">
                  {form.sport}
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <span className="text-[14px] font-medium text-gray-500">{form.level}</span>
              </div>
              <p className="text-[14px] text-gray-500 flex items-center gap-2 m-0">
                <Mail size={16} className="text-gray-400" />
                {form.email}
              </p>
            </div>
          </div>
          <button
            className={`h-11 px-6 rounded-full text-[13px] font-bold uppercase tracking-wide transition-all border-0 cursor-pointer flex items-center gap-2 shrink-0 ${
                editing 
                ? 'bg-[#14b8a6] hover:bg-[#0f9e8c] text-white shadow-[0_4px_12px_rgba(20,184,166,0.25)]' 
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm'
            }`}
            onClick={editing ? save : () => setEditing(true)}
          >
            {!editing && <Edit2 size={16} />}
            {editing ? 'Lưu thay đổi' : 'Sửa hồ sơ'}
          </button>
        </div>

        {/* Main Content: 2 Column */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Personal Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[20px] shadow-[0_2px_16px_rgba(0,0,0,0.04)] border border-gray-100 p-8 h-full">
              <h2 className="font-bold text-[18px] text-[#0f172a] mb-6 pb-4 border-b border-gray-100 m-0">Thông tin cá nhân</h2>

              {editing ? (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[
                      { label: 'Họ và tên', key: 'name', type: 'text' },
                      { label: 'Email', key: 'email', type: 'email' },
                      { label: 'Số điện thoại', key: 'phone', type: 'tel' },
                    ].map(f => (
                      <div key={f.key}>
                        <label htmlFor={`profile-${f.key}`} className="block text-[13px] font-bold text-gray-600 mb-2">{f.label}</label>
                        <input
                          id={`profile-${f.key}`}
                          type={f.type}
                          value={form[f.key]}
                          onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                          className={inputClasses}
                        />
                      </div>
                    ))}

                    <div>
                      <label htmlFor="profile-sport" className="block text-[13px] font-bold text-gray-600 mb-2">Môn thể thao chính</label>
                      <select
                        id="profile-sport"
                        value={form.sport}
                        onChange={e => setForm({ ...form, sport: e.target.value })}
                        className={`${inputClasses} cursor-pointer appearance-none bg-no-repeat bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_1rem_center] bg-[length:1.2em_1.2em] pr-10`}
                      >
                        {['Cầu lông', 'Pickleball'].map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="profile-level" className="block text-[13px] font-bold text-gray-600 mb-2">Trình độ</label>
                      <select
                        id="profile-level"
                        value={form.level}
                        onChange={e => setForm({ ...form, level: e.target.value })}
                        className={`${inputClasses} cursor-pointer appearance-none bg-no-repeat bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_1rem_center] bg-[length:1.2em_1.2em] pr-10`}
                      >
                        {['Người mới', 'Trung bình', 'Nâng cao', 'Chuyên nghiệp'].map(l => <option key={l}>{l}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="profile-bio" className="block text-[13px] font-bold text-gray-600 mb-2">Giới thiệu bản thân</label>
                    <textarea
                      id="profile-bio"
                      value={form.bio}
                      onChange={e => setForm({ ...form, bio: e.target.value })}
                      className={`${inputClasses} h-28 py-3 resize-none`}
                      placeholder="Viết một chút về phong cách chơi của bạn..."
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex max-sm:flex-col sm:items-center py-2 border-b border-gray-100">
                    <span className="w-48 text-[14px] font-medium text-gray-500">Số điện thoại</span>
                    <strong className="text-[15px] font-semibold text-[#0f172a]">{form.phone || '—'}</strong>
                  </div>
                  <div className="flex max-sm:flex-col sm:items-center py-2 border-b border-gray-100">
                    <span className="w-48 text-[14px] font-medium text-gray-500">Môn thể thao chính</span>
                    <strong className="text-[15px] font-semibold text-[#0f172a]">{form.sport}</strong>
                  </div>
                  <div className="flex max-sm:flex-col sm:items-center py-2 border-b border-gray-100">
                    <span className="w-48 text-[14px] font-medium text-gray-500">Trình độ kỹ năng</span>
                    <strong className="text-[15px] font-semibold text-[#0f172a]">{form.level}</strong>
                  </div>
                  <div className="flex max-sm:flex-col sm:items-center py-2 border-b border-gray-100">
                    <span className="w-48 text-[14px] font-medium text-gray-500">Tổng đặt sân</span>
                    <strong className="text-[15px] font-semibold text-[#0f172a]">{bookingCount} lượt</strong>
                  </div>
                  {form.bio && (
                    <div className="flex max-sm:flex-col py-2">
                      <span className="w-48 text-[14px] font-medium text-gray-500 shrink-0 mb-2">Giới thiệu</span>
                      <p className="text-[14.5px] text-gray-600 leading-relaxed m-0">{form.bio}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Widgets */}
          <div className="space-y-6">
            
            {/* Recent Bookings */}
            <div className="bg-white rounded-[20px] shadow-[0_2px_16px_rgba(0,0,0,0.04)] border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
                <h2 className="font-bold text-[15px] text-[#0f172a] m-0">Đặt sân gần đây</h2>
                <Link to="/apex/bookings" className="text-[13px] font-bold text-[#14b8a6] hover:text-[#0f9e8c] transition-colors no-underline">Tất cả</Link>
              </div>

              {recentBookings.length > 0 ? (
                <div className="space-y-5">
                  {recentBookings.map(b => (
                    <div key={b.bookingId} className="flex gap-4 items-center">
                      <div className="w-10 h-10 rounded-[10px] bg-[#F8F9FA] border border-gray-100 flex items-center justify-center text-[16px] shrink-0">
                        {b.details?.[0]?.courtName?.toLowerCase().includes('pickleball') ? '🏓' : '🏸'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[14px] font-bold text-[#0f172a] mb-1 truncate m-0">{b.details?.[0]?.courtName || 'Sân'}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] text-gray-500">
                            {new Date(b.details?.[0]?.bookingDate).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center bg-[#F8F9FA] rounded-[12px] border border-gray-100 border-dashed">
                  <p className="text-[13px] text-gray-500 mb-3 m-0">Chưa có lịch đặt sân nào</p>
                  <Link to="/apex/booking" className="text-[13px] font-bold text-[#14b8a6] hover:text-[#0f9e8c] no-underline">Đặt sân ngay →</Link>
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-[20px] shadow-[0_2px_16px_rgba(0,0,0,0.04)] border border-gray-100 p-6">
              <h2 className="font-bold text-[15px] text-[#0f172a] mb-4 pb-4 border-b border-gray-100 m-0">Lối tắt</h2>
              <div className="flex flex-col gap-1">
                {[
                  { to: '/apex/settings', label: 'Cài đặt tài khoản', icon: <Settings size={18} /> },
                  { to: '/apex/bookings', label: 'Lịch sử đặt sân', icon: <BookOpen size={18} /> },
                  { to: '/gear/catalog', label: 'Thuê dụng cụ', icon: <ShoppingBag size={18} /> },
                  { to: '/apex/support', label: 'Trung tâm hỗ trợ', icon: <LifeBuoy size={18} /> },
                ].map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="group flex items-center gap-3 p-3 rounded-[12px] text-[14px] font-medium text-gray-600 hover:bg-[#F8F9FA] hover:text-[#0f172a] transition-all no-underline"
                  >
                    <div className="w-8 h-8 rounded-[8px] bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-[#14b8a6] group-hover:border-[#14b8a6]/30 transition-colors">
                        {link.icon}
                    </div>
                    {link.label}
                    <ChevronRight size={16} className="ml-auto text-gray-300 group-hover:text-[#14b8a6] transition-colors" />
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
