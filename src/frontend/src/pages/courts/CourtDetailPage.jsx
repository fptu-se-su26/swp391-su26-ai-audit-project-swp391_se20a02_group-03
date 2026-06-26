import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { MapPin, Wifi, Car, Shirt, Wind, ShoppingBag, Droplets, Star, ChevronRight } from 'lucide-react'

const court = {
  id: 1,
  name: 'Infinity Court – Level 1',
  sport: 'Badminton / Pickleball',
  type: 'Premium Indoor Court',
  address: 'Le Van Loc, District 7, HCMC',
  rating: 4.9,
  reviews: 124,
  pricePerSlot: 120000,
  images: [
    'https://images.unsplash.com/photo-1544919982-b61976f0ba43?w=900&q=80',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
    'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&q=80',
    'https://images.unsplash.com/photo-1551958219-acbc595b39c6?w=600&q=80',
  ],
  amenities: [
    { label: 'Free High-Speed Wi-Fi', icon: <Wifi className="w-5 h-5" /> },
    { label: 'Secure Parking', icon: <Car className="w-5 h-5" /> },
    { label: 'Locker Rooms', icon: <Shirt className="w-5 h-5" /> },
    { label: 'Air Conditioning', icon: <Wind className="w-5 h-5" /> },
    { label: 'Equipment Rental', icon: <ShoppingBag className="w-5 h-5" /> },
    { label: 'Water Station', icon: <Droplets className="w-5 h-5" /> },
  ],
  description: 'Premium indoor court equipped with top-tier flooring, anti-glare lighting, and full climate control. Ideal for competitive matches and professional training sessions. Includes access to all premium amenities and equipment rental services.',
}

const HOURS = ['07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00']
const BOOKED = ['09:00','10:00','14:00','15:00','20:00']

export default function CourtDetailPage() {
  const { id } = useParams()
  const [activeImg, setActiveImg] = useState(0)
  const [selectedSlot, setSelectedSlot] = useState(null)

  return (
    <div className="flex flex-col min-h-screen bg-background-base font-sans text-foreground relative overflow-hidden">
      {/* ─── Ambient Background System ─── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#0a0a0f_0%,#050506_50%,#020203_100%)]" />
        <div className="absolute inset-0 bg-noise" />
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-[#5E6AD2]/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
      </div>

      <Navbar />

      <main className="flex-1 max-w-[1200px] mx-auto px-6 pt-28 pb-24 w-full relative z-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm font-medium tracking-wide text-foreground-muted mb-8">
          <Link to="/" className="hover:text-[var(--theme-primary)] transition-colors duration-200">Home</Link>
          <ChevronRight className="w-4 h-4 text-[var(--theme-primary)]/[0.1]" />
          <Link to="/courts" className="hover:text-[var(--theme-primary)] transition-colors duration-200">Courts</Link>
          <ChevronRight className="w-4 h-4 text-[var(--theme-primary)]/[0.1]" />
          <span className="text-[var(--theme-primary)]">{court.name}</span>
        </nav>

        {/* ── BENTO GALLERY ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 mb-14 h-[460px]">
          {/* Main Large Image */}
          <div className="relative overflow-hidden rounded-2xl bg-white/[0.02] border border-border-default shadow-[0_8px_32px_rgba(0,0,0,0.4)] group">
            <img 
              src={court.images[activeImg]} 
              alt={court.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050506]/80 via-transparent to-transparent pointer-events-none" />
            <span className="absolute top-5 left-5 bg-black/40 backdrop-blur-md text-[var(--theme-primary)] font-mono text-xs tracking-widest uppercase px-3 py-1.5 border border-border-default rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.5)] z-10">
              AVAILABLE NOW
            </span>
          </div>
          
          {/* Side Thumbnails */}
          <div className="hidden lg:grid grid-rows-3 gap-4 h-full">
            {court.images.slice(1, 4).map((img, i) => {
              const realIndex = i + 1;
              const isActive = activeImg === realIndex;
              return (
                <button 
                  key={img} 
                  onClick={() => setActiveImg(realIndex)}
                  className={`relative overflow-hidden rounded-xl border transition-all duration-300 h-full w-full group ${isActive ? 'border-[#5E6AD2] shadow-[0_0_15px_rgba(94,106,210,0.3)]' : 'border-border-default hover:border-border-hover'}`}
                >
                  <img src={img} alt="" className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${!isActive && 'opacity-60 grayscale-[30%]'}`} />
                  {isActive && <div className="absolute inset-0 bg-[#5E6AD2]/10 mix-blend-overlay" />}
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 lg:gap-14 items-start">
          {/* ── LEFT CONTENT ── */}
          <div className="flex flex-col gap-10">
            {/* Header & Meta */}
            <div className="card-base p-8">
              <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-2">{court.name}</h1>
                  <p className="text-foreground-muted font-medium flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5E6AD2] shadow-[0_0_8px_rgba(94,106,210,0.8)]" />
                    {court.sport}
                    <span className="text-[var(--theme-primary)]/[0.1] mx-1">|</span>
                    {court.type}
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-[var(--theme-surface)] border border-border-default rounded-full px-4 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500/30" />
                  <span className="font-semibold text-[var(--theme-primary)]">{court.rating}</span>
                  <span className="text-foreground-muted text-sm ml-1">({court.reviews} reviews)</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2.5 text-foreground-muted font-medium mb-8 pb-8 border-b border-border-default">
                <MapPin className="w-5 h-5 text-[#5E6AD2]" />
                {court.address}
              </div>

              <p className="text-foreground-muted text-base leading-relaxed">{court.description}</p>
            </div>

            {/* Amenities Grid */}
            <div className="card-base p-8">
              <h2 className="text-xl font-semibold text-foreground tracking-tight mb-6 flex items-center gap-3">
                <div className="w-1.5 h-6 bg-white/[0.1] rounded-full" />
                Amenities
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {court.amenities.map(a => (
                  <div key={a.label} className="group flex items-center gap-3 bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl hover:bg-white/[0.05] hover:border-white/[0.1] transition-all duration-200 cursor-default">
                    <div className="w-10 h-10 bg-[var(--theme-surface)] rounded-lg border border-white/[0.05] flex items-center justify-center shrink-0 text-foreground-muted group-hover:text-[#5E6AD2] group-hover:bg-[#5E6AD2]/10 transition-colors">
                      {a.icon}
                    </div>
                    <span className="text-sm font-medium text-foreground-muted group-hover:text-[var(--theme-primary)] transition-colors">{a.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Slot Picker */}
            <div className="card-base p-8">
              <div className="flex items-end justify-between mb-8 border-b border-border-default pb-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground tracking-tight mb-1 flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-[#5E6AD2] rounded-full shadow-[0_0_10px_rgba(94,106,210,0.8)]" />
                    Available Schedule
                  </h2>
                  <p className="text-foreground-muted text-sm ml-4.5">Select a time slot for today</p>
                </div>
                {/* Legend */}
                <div className="hidden sm:flex gap-5 text-sm font-medium text-foreground-muted">
                  <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[var(--theme-surface)] border border-border-default"/> Available</span>
                  <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/30"/> Booked</span>
                  <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#5E6AD2] shadow-[0_0_8px_rgba(94,106,210,0.6)]"/> Selected</span>
                </div>
              </div>
              
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                {HOURS.map(h => {
                  const booked = BOOKED.includes(h)
                  const selected = selectedSlot === h
                  return (
                    <button key={h} disabled={booked}
                      onClick={() => setSelectedSlot(h)}
                      className={`py-3 text-sm font-mono tracking-wider font-semibold transition-all duration-200 rounded-xl border
                        ${booked ? 'bg-red-500/5 text-red-500/40 border-red-500/10 cursor-not-allowed' :
                          selected ? 'bg-[#5E6AD2] text-white border-[#5E6AD2] shadow-[0_4px_15px_rgba(94,106,210,0.4)] scale-[1.02]' :
                          'bg-[var(--theme-surface)] text-foreground-muted border-border-default hover:bg-[var(--theme-surface-hover)] hover:border-border-hover hover:text-foreground'}`}>
                      {h}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL (Booking Widget) ── */}
          <div className="lg:sticky lg:top-28">
            <div className="card-base p-8 relative">
              
              <div className="mb-8">
                <p className="text-foreground-muted font-medium text-sm mb-2 uppercase tracking-widest">Rate per hour</p>
                <p className="text-4xl font-semibold text-foreground tracking-tight flex items-baseline gap-2">
                  {court.pricePerSlot.toLocaleString('vi-VN')} 
                  <span className="text-lg font-medium text-foreground-muted tracking-normal">VND</span>
                </p>
              </div>

              {/* Selected state info */}
              <div className={`transition-all duration-300 overflow-hidden ${selectedSlot ? 'max-h-40 opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'}`}>
                <div className="bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 p-5 rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                  <p className="text-xs font-mono tracking-wider uppercase text-[#5E6AD2] mb-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5E6AD2] shadow-[0_0_5px_rgba(94,106,210,0.8)] animate-pulse" />
                    Selected Time
                  </p>
                  <p className="text-2xl font-semibold text-[var(--theme-primary)] mb-1 tracking-tight">{selectedSlot} – {HOURS[HOURS.indexOf(selectedSlot) + 1] || '22:00'}</p>
                  <p className="text-foreground-muted text-sm font-medium">Today • {court.name}</p>
                </div>
              </div>

              {/* Placeholder when unselected */}
              <div className={`transition-all duration-300 overflow-hidden ${!selectedSlot ? 'max-h-16 opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'}`}>
                <div className="bg-white/[0.02] border border-border-default py-4 text-center rounded-xl border-dashed">
                  <p className="text-foreground-muted font-medium text-sm">Please select a time slot</p>
                </div>
              </div>

              {/* Book Button */}
              <Link
                to={selectedSlot ? `/courts/${id}/book?slot=${selectedSlot}` : '#'}
                onClick={e => !selectedSlot && e.preventDefault()}
                className={`w-full flex items-center justify-center h-12 rounded-xl font-semibold text-sm transition-all duration-200
                  ${selectedSlot ? 'bg-[#EDEDEF] text-[#050506] hover:bg-white shadow-[0_4px_14px_rgba(255,255,255,0.15)] active:scale-[0.98]' : 'bg-[var(--theme-surface)] text-foreground-muted border border-border-default cursor-not-allowed'}`}>
                {selectedSlot ? 'Confirm Booking' : 'Select Time Slot'}
              </Link>

              <p className="text-center text-foreground-muted text-xs font-medium mt-6">
                Payments secured by VNPay & Stripe
              </p>

              {/* Receipt / Invoice Preview */}
              <div className={`transition-all duration-500 ease-in-out overflow-hidden border-t border-border-default ${selectedSlot ? 'max-h-64 mt-6 pt-6 opacity-100' : 'max-h-0 mt-0 pt-0 opacity-0'}`}>
                <div className="space-y-4 text-sm font-medium">
                  <div className="flex justify-between items-center text-foreground-muted">
                    <span>Court Rental (1 hour)</span>
                    <span>{court.pricePerSlot.toLocaleString('vi-VN')}</span>
                  </div>
                  <div className="flex justify-between items-center text-foreground-muted">
                    <span className="flex items-center gap-2">
                      Platform Fee 
                      <span className="bg-white/[0.06] text-foreground-muted border border-border-default px-1.5 py-0.5 rounded text-[10px] font-mono">5%</span>
                    </span>
                    <span>{(court.pricePerSlot * 0.05).toLocaleString('vi-VN')}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-border-default pt-4 mt-2">
                    <span className="font-semibold text-[var(--theme-primary)] text-base">Total</span>
                    <span className="text-xl font-semibold text-[var(--theme-primary)] tracking-tight">
                      {(court.pricePerSlot * 1.05).toLocaleString('vi-VN')} <span className="text-sm font-medium text-foreground-muted">VND</span>
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
