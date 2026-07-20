import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ApexLayout from '../../layouts/ApexLayout'
import authApi from '../../api/authApi'
import { bookingApi } from '../../api/bookingApi'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import { Clock, MapPin, ChevronRight, Calendar, UserPlus, PackageSearch } from 'lucide-react'

import PageLoader from '../../components/ui/PageLoader'
import { formatTimeUntil, isEventFinished } from '../../utils/date'

const modernCardClass = "bg-white rounded-[12px] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] border border-gray-100"

export default function ApexHomePage() {
  const [userProfile, setUserProfile] = useState(null)
  const [upcomingBookings, setUpcomingBookings] = useState([])
  const [nextGame, setNextGame] = useState(null)
  const [timelineEvents, setTimelineEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [profileRes, bookingsRes] = await Promise.all([
          authApi.getProfile(),
          bookingApi.getMyBookings()
        ])

        if (profileRes?.statusCode === 200 && profileRes.data) {
          setUserProfile(profileRes.data)
        }

        const bookings = Array.isArray(bookingsRes?.data) ? bookingsRes.data : []
        if (bookingsRes?.statusCode === 200 && bookings.length > 0) {
          const upcoming = bookings
            .filter(b => b.status === 'Confirmed' || b.status === 'Pending')
            .flatMap(b => (b.details || []).map(d => {
              const start = String(d.startTime || '').slice(0, 5)
              const end = String(d.endTime || '').slice(0, 5)
              return {
                id: `${b.bookingId}-${d.courtId}-${start}`,
                name: d.courtName,
                date: d.bookingDate,
                startTime: start,
                endTime: end,
                status: b.status,
                type: 'booking',
                imageUrl: d.courtName?.toLowerCase?.().includes('pickleball')
                  ? 'https://images.unsplash.com/photo-1629851606775-9e6e1e63a8a0?w=800&q=80'
                  : 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80',
              }
            }))
            .filter(b => !isEventFinished(b))
            .sort((a, b) => new Date(`${a.date}T${a.startTime}`) - new Date(`${b.date}T${b.startTime}`))

          setUpcomingBookings(upcoming)

          if (upcoming.length > 0) {
            setNextGame(upcoming[0])

            const remaining = upcoming.slice(1).map(b => ({
              ...b,
              title: `Trận tại ${b.name}`,
              subtitle: `${dayjs(b.date).locale('vi').format('DD/MM')} · ${b.startTime} – ${b.endTime}`,
            }))

            setTimelineEvents(remaining)
          }
        }
      } catch (err) {
        console.error("Failed to fetch home data", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Chào buổi sáng'
    if (h < 17) return 'Chào buổi chiều'
    return 'Chào buổi tối'
  })()

  const firstName = userProfile?.fullName?.split(' ').pop() || 'bạn'

  if (loading) {
    return (
      <ApexLayout>
        <PageLoader message="Đang tải bảng điều khiển..." />
      </ApexLayout>
    )
  }

  return (
    <ApexLayout>
      <div className="bg-[#F6F8FA] min-h-screen">
      <div className="auth-animate-in max-w-[1200px] mx-auto px-4 md:px-8 py-8 font-sans">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-heading text-3xl sm:text-4xl uppercase tracking-wider text-gray-900 mb-2 m-0">
            {greeting}, {firstName}
          </h1>
          <p className="text-[14px] text-gray-500 m-0">
            Hôm nay, {dayjs().locale('vi').format('dddd, D MMMM YYYY')}
          </p>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">

          {/* LEFT COLUMN: Main Stage */}
          <div className="flex flex-col gap-8">

            {/* Next Game Hero */}
            <section>
              <h2 className="font-heading text-[18px] uppercase tracking-wider text-gray-900 mb-4 m-0 flex items-center gap-2">
                <span className="w-2 h-6 bg-[#14b8a6] rounded-[4px] block"></span> Sự kiện sắp tới
              </h2>

              {nextGame ? (
                <div className={`overflow-hidden ${modernCardClass}`}>
                  <div className="relative h-[120px]">
                    <img
                      src={nextGame.imageUrl}
                      alt={nextGame.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-4 right-4 bg-white/90 backdrop-blur text-[#14b8a6] px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm">
                      {nextGame.status === 'Confirmed' ? 'Đã xác nhận' : 'Chờ xác nhận'}
                    </span>
                  </div>

                  <div className="p-6">
                    <p className="text-[12px] font-bold text-[#14b8a6] mb-2 m-0 flex items-center gap-1.5 uppercase tracking-wide">
                      <Clock size={14} /> {formatTimeUntil(nextGame)}
                    </p>
                    <h3 className="font-heading text-xl uppercase text-gray-900 mb-2 m-0">
                      {nextGame.name}
                    </h3>
                    <p className="text-gray-500 text-[13.5px] mb-6 flex items-center gap-2 font-medium m-0">
                      <MapPin size={16} />
                      {dayjs(nextGame.date).locale('vi').format('dddd, DD/MM')} • {nextGame.startTime} – {nextGame.endTime}
                    </p>
                    <div className="flex gap-3 flex-wrap">
                      <Link to="/apex/booking" className="bg-[#14b8a6] hover:bg-[#15c3b0] text-white px-6 py-2.5 rounded-[8px] text-[13px] font-bold uppercase tracking-wide transition-colors no-underline cursor-pointer">
                        Xem chi tiết
                      </Link>
                      <button className="bg-white text-gray-700 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 px-6 py-2.5 rounded-[8px] text-[13px] font-bold uppercase tracking-wide transition-colors cursor-pointer">
                        Chỉ đường
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`text-center flex flex-col items-center py-16 px-6 ${modernCardClass}`}>
                  <div className="w-16 h-16 rounded-full bg-teal-50 text-[#14b8a6] flex items-center justify-center mb-5">
                    <Calendar size={32} />
                  </div>
                  <h3 className="font-bold text-[18px] text-gray-900 mb-2 m-0">Chưa có lịch đặt sân</h3>
                  <p className="text-gray-500 mb-8 max-w-sm text-[14px] m-0">Đặt sân ngay để duy trì phong độ và theo dõi lịch tập của bạn trên hệ thống.</p>
                  <Link to="/apex/booking" className="bg-[#14b8a6] hover:bg-[#15c3b0] text-white px-8 py-3 rounded-[8px] text-[14px] font-bold uppercase tracking-wide transition-colors shadow-[0_4px_12px_rgba(20,184,166,0.3)] no-underline">
                    Đặt sân ngay
                  </Link>
                </div>
              )}
            </section>

            {/* Timeline Feed */}
            {timelineEvents.length > 0 && (
              <section>
                <h2 className="font-heading text-[18px] uppercase tracking-wider text-gray-900 mb-4 m-0 flex items-center gap-2">
                  <span className="w-2 h-6 bg-[#14b8a6] rounded-[4px] block"></span> Lịch trình tiếp theo
                </h2>

                <div className={`p-6 flex flex-col gap-6 ${modernCardClass}`}>
                  {timelineEvents.map((event, i) => (
                    <div key={i} className={`flex justify-between items-center gap-4 flex-wrap ${i < timelineEvents.length - 1 ? 'pb-6 border-b border-gray-100' : ''}`}>
                      <div>
                        <p className="text-[15px] font-bold text-gray-900 mb-1.5 m-0">{event.title}</p>
                        <p className="text-[13px] text-gray-500 m-0 font-medium">{event.subtitle}</p>
                      </div>
                      {event.type === 'booking' && (
                        <span className="bg-teal-50 text-teal-600 px-3 py-1 rounded-full text-[12px] font-bold">
                          Đã xác nhận
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* RIGHT COLUMN: Side Actions */}
          <div className="flex flex-col gap-8">

            {/* Action Required: Match Invites */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-[18px] uppercase tracking-wider text-gray-900 m-0 flex items-center gap-2">
                  <span className="w-2 h-6 bg-[#14b8a6] rounded-[4px] block"></span> Cần xử lý
                </h2>
                <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 text-[11px] font-bold flex items-center justify-center">0</span>
              </div>

              <div className={`p-8 text-center flex flex-col items-center justify-center ${modernCardClass}`}>
                <div className="w-12 h-12 rounded-full bg-teal-50 text-[#14b8a6] flex items-center justify-center mb-4">
                  <UserPlus size={24} />
                </div>
                <p className="mb-2 font-bold text-[14px] text-gray-900 m-0">Chưa có lời mời kèo</p>
                <p className="text-[13px] text-gray-500 m-0">Bạn hiện không có lời mời tham gia trận đấu nào.</p>
              </div>
            </section>



          </div>
        </div>
      </div>
      </div>
    </ApexLayout>
  )
}
