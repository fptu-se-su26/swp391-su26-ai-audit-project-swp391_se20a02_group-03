import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ApexLayout from '../../layouts/ApexLayout'
import authApi from '../../api/authApi'
import { bookingApi } from '../../api/bookingApi'
import dayjs from 'dayjs'
import { Clock, MapPin, ChevronRight, Check, X, ShieldAlert, Calendar } from 'lucide-react'

export default function ApexHomePage() {
  const [userProfile, setUserProfile] = useState(null)
  const [upcomingBookings, setUpcomingBookings] = useState([])
  const [nextGame, setNextGame] = useState(null)
  const [timelineEvents, setTimelineEvents] = useState([])

  useEffect(() => {
    async function fetchData() {
      try {
        const [profileRes, bookingsRes] = await Promise.all([
          authApi.getProfile(),
          bookingApi.getMyBookings()
        ])

        if (profileRes?.data?.data) setUserProfile(profileRes.data.data)

        if (bookingsRes?.data?.data) {
          const upcoming = bookingsRes.data.data
            .filter(b => b.status === 'Confirmed' || b.status === 'Pending')
            .flatMap(b => b.bookingDetails.map(d => ({
              id: d.bookingDetailId,
              name: d.courtName,
              date: d.bookingDate,
              startTime: d.startTime,
              endTime: d.endTime,
              status: b.status,
              type: 'booking',
              // Use sleek architecture images for courts
              imageUrl: d.courtName?.toLowerCase().includes('pickleball') 
                ? 'https://images.unsplash.com/photo-1629851606775-9e6e1e63a8a0?w=800&q=80' 
                : 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80'
            })))
            .sort((a, b) => new Date(`${a.date}T${a.startTime}`) - new Date(`${b.date}T${b.startTime}`))

          setUpcomingBookings(upcoming)
          
          if (upcoming.length > 0) {
            setNextGame(upcoming[0])
            
            // Generate timeline for remaining items
            const remaining = upcoming.slice(1).map(b => ({
              ...b,
              title: `Match at ${b.name}`,
              subtitle: `${dayjs(b.date).format('MMM D')} · ${b.startTime.slice(0,5)} - ${b.endTime.slice(0,5)}`,
            }))
            
            setTimelineEvents(remaining)
          }
        }
      } catch (err) {
        console.error("Failed to fetch home data", err)
      }
    }
    fetchData()
  }, [])

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good Morning'
    if (h < 17) return 'Good Afternoon'
    return 'Good Evening'
  })()

  const firstName = userProfile?.fullName?.split(' ').pop() || 'User'

  return (
    <ApexLayout>
      <div className="animate-fade-up">
        {/* Compact Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight gradient-text mb-3">
            {greeting}, {firstName}
          </h1>
          <p className="text-foreground-muted font-mono text-sm tracking-widest uppercase">
            Today is {dayjs().format('dddd, MMMM D')}
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
                <h2 className="text-xl font-semibold tracking-tight text-foreground">Upcoming Event</h2>
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
                        {nextGame.status === 'Confirmed' ? 'CONFIRMED' : 'PENDING'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-8 relative">
                    <div className="absolute -top-12 left-8 w-24 h-24 bg-[#5E6AD2]/20 blur-[30px] rounded-full" />
                    
                    <p className="text-[#5E6AD2] font-mono text-xs tracking-widest uppercase mb-3 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" /> Starts in 2 hours
                    </p>
                    <h3 className="text-3xl font-semibold tracking-tight text-foreground mb-2 leading-tight">
                      {nextGame.name}
                    </h3>
                    <p className="text-foreground-muted mb-8 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {dayjs(nextGame.date).format('dddd, MMM D')} • {nextGame.startTime.slice(0,5)} – {nextGame.endTime.slice(0,5)}
                    </p>
                    <div className="flex gap-4">
                      <Link to="/apex/booking" className="btn-primary">
                        View Details
                      </Link>
                      <button className="btn-outline">
                        Get Directions
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card-base text-center flex flex-col items-center py-16">
                  <div className="w-16 h-16 bg-[var(--theme-surface)] border border-border-default rounded-2xl flex items-center justify-center mb-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                    <Calendar className="w-8 h-8 text-foreground-muted" />
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground mb-2 tracking-tight">No upcoming bookings</h3>
                  <p className="text-foreground-muted mb-8 max-w-sm">Schedule your next session to keep your streak alive and maintain your fitness goals.</p>
                  <Link to="/apex/booking" className="btn-primary">
                    Book a Court
                  </Link>
                </div>
              )}
            </section>

            {/* 2. Timeline Feed */}
            {timelineEvents.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-6 bg-white/[0.1] rounded-full" />
                  <h2 className="text-xl font-semibold tracking-tight text-foreground">Schedule</h2>
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
                                Confirmed
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
                  <h2 className="text-xl font-semibold tracking-tight text-foreground">Action Required</h2>
                </div>
                <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-mono flex items-center justify-center">1</span>
              </div>
              
              <div className="space-y-4">
                <div className="card-base group flex flex-col gap-5 hover:-translate-y-1 transition-transform">
                  <div className="flex items-start gap-4">
                    <img 
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80" 
                      alt="David K." 
                      className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/10"
                    />
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className="text-base font-medium text-foreground truncate">David Kim</p>
                      <p className="text-sm text-foreground-muted truncate mt-0.5">Invite: Doubles Match</p>
                      <p className="text-xs font-mono text-[#5E6AD2] mt-2 flex items-center gap-1.5">
                        <Clock className="w-3 h-3" /> Jun 25 • 18:00 • Court 8
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4 border-t border-border-default">
                    <button className="flex-1 h-9 bg-[#5E6AD2]/10 text-[#5E6AD2] text-xs font-semibold uppercase tracking-wider rounded-lg border border-[#5E6AD2]/20 hover:bg-[#5E6AD2]/20 transition-colors flex items-center justify-center gap-1.5">
                      <Check className="w-3.5 h-3.5" /> Accept
                    </button>
                    <button className="flex-1 h-9 bg-[var(--theme-surface)] text-foreground-muted text-xs font-semibold uppercase tracking-wider rounded-lg border border-border-default hover:bg-white/[0.06] transition-colors flex items-center justify-center gap-1.5">
                      <X className="w-3.5 h-3.5" /> Decline
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Active Gear */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-white/[0.1] rounded-full" />
                  <h2 className="text-xl font-semibold tracking-tight text-foreground">Active Rentals</h2>
                </div>
                <Link to="/gear/catalog" className="text-xs font-mono text-[#5E6AD2] hover:text-[#6872D9] transition-colors flex items-center gap-1">
                  View Store <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-4">
                <div className="card-base flex items-center gap-4 hover:-translate-y-1 transition-transform">
                  <div className="w-12 h-12 bg-[var(--theme-surface)] border border-border-default rounded-xl flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-6 h-6 text-foreground-muted" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1.5">
                      <p className="text-sm font-medium text-foreground truncate">Pro Staff 97 V13</p>
                      <span className="text-xs font-mono text-foreground-muted">Due 20:00</span>
                    </div>
                    <div className="h-1.5 bg-background-deep rounded-full overflow-hidden border border-border-default">
                      <div className="h-full bg-[#5E6AD2] w-[80%] shadow-[0_0_8px_rgba(94,106,210,0.8)] rounded-full" />
                    </div>
                    <p className="text-[10px] text-foreground-muted font-mono uppercase tracking-widest mt-2">Returns in 2 hours</p>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </ApexLayout>
  )
}
