import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ApexLayout from '../../layouts/ApexLayout'
import authApi from '../../api/authApi'
import { bookingApi } from '../../api/bookingApi'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import { Clock, MapPin, ChevronRight, Calendar } from 'lucide-react'

import PageLoader from '../../components/ui/PageLoader'

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
      <div className="animate-fade-up">
        {/* Compact Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight gradient-text mb-3">
            {greeting}, {firstName}
          </h1>
          <p className="text-foreground-muted font-mono text-sm tracking-widest uppercase">
            Hôm nay, {dayjs().locale('vi').format('dddd, D MMMM YYYY')}
          </p>
        </div>

        {/* Asymmetric Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
          
          {/* ─── LEFT COLUMN: Main Stage ─── */}
          <div className="space-y-10">
            
            {/* 1. Next Game Hero */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-6 bg-[#5E6AD2] rounded-full shadow-[0_0_10px_rgba(94,106,210,0.8)]" />
                <h2 className="text-xl font-semibold tracking-tight text-foreground">Sự kiện sắp tới</h2>
              </div>
              
              {nextGame ? (
                <div className="card-base group overflow-hidden !p-0">
                  <div className="relative h-[200px] overflow-hidden border-b border-border-default">
                    <img 
                      src={nextGame.imageUrl} 
                      alt={nextGame.name} 
                      className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050506] via-[#050506]/60 to-transparent" />
                    
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-black/40 backdrop-blur-md border border-border-default rounded-full text-xs font-mono tracking-widest text-[var(--theme-primary)] shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                        {nextGame.status === 'Confirmed' ? 'ĐÃ XÁC NHẬN' : 'CHỜ XÁC NHẬN'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-8 relative">
                    <div className="absolute -top-12 left-8 w-24 h-24 bg-[#5E6AD2]/20 blur-[30px] rounded-full" />
                    
                    <p className="text-[#5E6AD2] font-mono text-xs tracking-widest uppercase mb-3 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" /> Bắt đầu sau 2 giờ
                    </p>
                    <h3 className="text-3xl font-semibold tracking-tight text-foreground mb-2 leading-tight">
                      {nextGame.name}
                    </h3>
                    <p className="text-foreground-muted mb-8 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {dayjs(nextGame.date).locale('vi').format('dddd, DD/MM')} • {nextGame.startTime} – {nextGame.endTime}
                    </p>
                    <div className="flex gap-4">
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
                <div className="card-base text-center flex flex-col items-center py-16">
                  <div className="w-16 h-16 bg-[var(--theme-surface)] border border-border-default rounded-2xl flex items-center justify-center mb-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                    <Calendar className="w-8 h-8 text-foreground-muted" />
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground mb-2 tracking-tight">Chưa có lịch đặt sân</h3>
                  <p className="text-foreground-muted mb-8 max-w-sm">Đặt sân ngay để duy trì phong độ và theo dõi lịch tập của bạn.</p>
                  <Link to="/apex/booking" className="btn-primary">
                    Đặt sân
                  </Link>
                </div>
              )}
            </section>

            {/* 2. Timeline Feed */}
            {timelineEvents.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-6 bg-white/[0.1] rounded-full" />
                  <h2 className="text-xl font-semibold tracking-tight text-foreground">Lịch trình</h2>
                </div>
                
                <div className="card-base !py-4">
                  <div className="relative pl-6 space-y-8 my-4 before:absolute before:inset-0 before:ml-[7px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/[0.06] before:to-transparent">
                    {timelineEvents.map((event, i) => (
                      <div key={i} className="relative group">
                        {/* Timeline Node */}
                        <div className="absolute -left-[27px] w-3 h-3 bg-background-base border-2 border-[#5E6AD2] rounded-full shadow-[0_0_10px_rgba(94,106,210,0.5)] z-10" />
                        
                        {/* Content */}
                        <div className="pl-4">
                          <p className="text-base font-semibold text-foreground leading-tight mb-1">{event.title}</p>
                          <p className="text-sm text-foreground-muted font-mono">{event.subtitle}</p>
                          
                          {event.type === 'booking' && (
                            <div className="mt-3">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                Đã xác nhận
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* ─── RIGHT COLUMN: Side Actions ─── */}
          <div className="space-y-10">
            
            {/* 3. Action Required: Match Invites */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-orange-500/80 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.6)]" />
                  <h2 className="text-xl font-semibold tracking-tight text-foreground">Cần xử lý</h2>
                </div>
                <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-mono flex items-center justify-center">0</span>
              </div>
              
              <div className="card-base p-6 text-center text-foreground-muted text-sm">
                <p className="mb-1 font-medium text-foreground">Chưa có lời mời kèo</p>
                <p>Tính năng mời kèo trực tiếp đang được phát triển.</p>
              </div>
            </section>

            {/* 4. Active Gear */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-white/[0.1] rounded-full" />
                  <h2 className="text-xl font-semibold tracking-tight text-foreground">Thuê đồ đang dùng</h2>
                </div>
                <Link to="/gear/catalog" className="text-xs font-mono text-[#5E6AD2] hover:text-[#6872D9] transition-colors flex items-center gap-1">
                  Cửa hàng <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="card-base p-6 text-center text-foreground-muted text-sm">
                Bạn chưa thuê thiết bị nào. <Link to="/gear/catalog" className="text-[#5E6AD2] no-underline font-medium">Khám phá cửa hàng →</Link>
              </div>
            </section>

          </div>
        </div>
      </div>
    </ApexLayout>
  )
}
