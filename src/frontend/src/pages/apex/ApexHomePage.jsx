import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ApexLayout from '../../layouts/ApexLayout'
import authApi from '../../api/authApi'
import { bookingApi } from '../../api/bookingApi'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import { Clock, MapPin, ChevronRight, Calendar } from 'lucide-react'

import PageLoader from '../../components/ui/PageLoader'
import { formatTimeUntil, isEventFinished } from '../../utils/date'

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
            // BUG 3: chỉ giữ trận CHƯA kết thúc — booking quá khứ không phải "sự kiện sắp tới"
            .filter(b => !isEventFinished(b))
            .sort((a, b) => new Date(`${a.date}T${a.startTime}`) - new Date(`${b.date}T${b.startTime}`))

          setUpcomingBookings(upcoming)

          if (upcoming.length > 0) {
            setNextGame(upcoming[0])

            // Generate timeline for remaining items
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
      <div className="auth-animate-in">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-heading text-3xl sm:text-4xl uppercase tracking-[-0.01em] text-foreground mb-3">
            {greeting}, {firstName}
          </h1>
          <p className="label-mono text-foreground-subtle">
            Hôm nay, {dayjs().locale('vi').format('dddd, D MMMM YYYY')}
          </p>
        </div>

        {/* Asymmetric Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">

          {/* ─── LEFT COLUMN: Main Stage ─── */}
          <div className="flex flex-col gap-8">

            {/* 1. Next Game Hero */}
            <section>
              <h2 className="font-heading text-lg uppercase text-foreground mb-4 border-b-2 border-border-strong pb-3">Sự kiện sắp tới</h2>

              {nextGame ? (
                <div className="card-base !p-0 overflow-hidden">
                  <div className="relative h-[200px] border-b-2 border-border-strong">
                    <img
                      src={nextGame.imageUrl}
                      alt={nextGame.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-4 right-4 label-mono bg-ink text-paper px-3 py-1.5">
                      {nextGame.status === 'Confirmed' ? 'ĐÃ XÁC NHẬN' : 'CHỜ XÁC NHẬN'}
                    </span>
                  </div>

                  <div className="p-7">
                    <p className="label-mono text-foreground-subtle mb-2.5 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" /> {formatTimeUntil(nextGame)}
                    </p>
                    <h3 className="font-heading text-2xl uppercase text-foreground mb-2.5">
                      {nextGame.name}
                    </h3>
                    <p className="text-foreground-muted mb-7 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {dayjs(nextGame.date).locale('vi').format('dddd, DD/MM')} • {nextGame.startTime} – {nextGame.endTime}
                    </p>
                    <div className="flex gap-3.5 flex-wrap">
                      <Link to="/apex/booking" className="btn-primary">
                        Xem chi tiết
                      </Link>
                      <button className="btn-outline">
                        Chỉ đường
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card-base text-center flex flex-col items-center py-14">
                  <div className="w-14 h-14 border-2 border-border-strong flex items-center justify-center mb-5">
                    <Calendar className="w-7 h-7 text-foreground-muted" />
                  </div>
                  <h3 className="font-heading text-xl uppercase text-foreground mb-2">Chưa có lịch đặt sân</h3>
                  <p className="text-foreground-muted mb-7 max-w-sm text-sm">Đặt sân ngay để duy trì phong độ và theo dõi lịch tập của bạn.</p>
                  <Link to="/apex/booking" className="btn-primary">
                    Đặt sân
                  </Link>
                </div>
              )}
            </section>

            {/* 2. Timeline Feed */}
            {timelineEvents.length > 0 && (
              <section>
                <h2 className="font-heading text-lg uppercase text-foreground mb-4 border-b-2 border-border-strong pb-3">Lịch trình</h2>

                <div className="card-base flex flex-col gap-5">
                  {timelineEvents.map((event, i) => (
                    <div key={i} className={`flex justify-between items-center gap-4 flex-wrap ${i < timelineEvents.length - 1 ? 'pb-5 border-b border-border-default' : ''}`}>
                      <div>
                        <p className="text-sm font-bold text-foreground mb-1">{event.title}</p>
                        <p className="label-mono text-foreground-subtle">{event.subtitle}</p>
                      </div>
                      {event.type === 'booking' && (
                        <span className="label-mono bg-surface border border-border-strong px-2.5 py-1">
                          Đã xác nhận
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ─── RIGHT COLUMN: Side Actions ─── */}
          <div className="flex flex-col gap-8">

            {/* 3. Action Required: Match Invites */}
            <section>
              <div className="flex items-center justify-between mb-4 border-b-2 border-border-strong pb-3">
                <h2 className="font-heading text-lg uppercase text-foreground">Cần xử lý</h2>
                <span className="w-6 h-6 rounded-full bg-ink text-paper text-xs font-mono flex items-center justify-center">0</span>
              </div>

              <div className="card-base text-center text-sm">
                <p className="mb-1 font-bold text-foreground">Chưa có lời mời kèo</p>
                <p className="text-foreground-muted">Tính năng mời kèo trực tiếp đang được phát triển.</p>
              </div>
            </section>

            {/* 4. Active Gear */}
            <section>
              <div className="flex items-center justify-between mb-4 border-b-2 border-border-strong pb-3">
                <h2 className="font-heading text-lg uppercase text-foreground">Thuê đồ đang dùng</h2>
                <Link to="/gear/catalog" className="label-mono text-foreground hover:text-accent transition-colors flex items-center gap-1">
                  Cửa hàng <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="card-base text-center text-sm text-foreground-muted">
                Bạn chưa thuê thiết bị nào. <Link to="/gear/catalog" className="text-accent no-underline font-bold">Khám phá cửa hàng →</Link>
              </div>
            </section>

          </div>
        </div>
      </div>
    </ApexLayout>
  )
}
