import { useState, useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import PageLoader from '../../components/ui/PageLoader'
import { bookingApi } from '../../api/bookingApi'
import { formatLocalDate, addMinutesToTimeLabel } from '../../utils/date'
import { MapPin, Wifi, Car, Shirt, Wind, ShoppingBag, Droplets, Star, ChevronRight } from 'lucide-react'

const DEFAULT_AMENITIES = [
  { label: 'Wi-Fi tốc độ cao', icon: <Wifi className="w-5 h-5" /> },
  { label: 'Bãi đỗ xe an toàn', icon: <Car className="w-5 h-5" /> },
  { label: 'Phòng thay đồ', icon: <Shirt className="w-5 h-5" /> },
  { label: 'Điều hòa', icon: <Wind className="w-5 h-5" /> },
  { label: 'Cho thuê dụng cụ', icon: <ShoppingBag className="w-5 h-5" /> },
  { label: 'Trạm nước uống', icon: <Droplets className="w-5 h-5" /> },
]

function normalizeSlot(value) {
  if (!value) return null
  const text = String(value)
  return text.length >= 5 ? text.slice(0, 5) : text
}

export default function CourtDetailPage() {
  const { id } = useParams()
  const [activeImg, setActiveImg] = useState(0)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [court, setCourt] = useState(null)
  const [slots, setSlots] = useState([])
  const [booked, setBooked] = useState([])
  const [slotDurationMinutes, setSlotDurationMinutes] = useState(60)
  const [isClosedToday, setIsClosedToday] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const today = useMemo(() => formatLocalDate(), [])

  useEffect(() => {
    if (!id) return
    let cancelled = false
    setLoading(true)
    setError(null)

    Promise.all([
      bookingApi.getCourtById(id),
      bookingApi.getCourtAvailability(id, today),
    ])
      .then(([courtRes, availabilityRes]) => {
        if (cancelled) return
        if (courtRes.statusCode !== 200 || !courtRes.data) {
          setError(courtRes.message || 'Không tìm thấy sân.')
          setCourt(null)
          return
        }
        const data = courtRes.data
        setCourt({
          id: data.courtId,
          name: data.name,
          sport: data.courtTypeName || 'Thể thao',
          type: data.status || 'Sân',
          address: data.description || '',
          rating: 4.8,
          reviews: 0,
          pricePerSlot: data.pricePerHour > 0 ? data.pricePerHour : 120000,
          images: data.imageUrl
            ? [data.imageUrl, data.imageUrl, data.imageUrl, data.imageUrl]
            : [
                'https://images.unsplash.com/photo-1544919982-b61976f0ba43?w=900&q=80',
                'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
              ],
          amenities: DEFAULT_AMENITIES,
          description: data.description || 'Sân thể thao trên hệ thống ProSport.',
        })

        if (availabilityRes.statusCode === 200 && availabilityRes.data) {
          const availability = availabilityRes.data
          setIsClosedToday(Boolean(availability.isClosed))
          setSlotDurationMinutes(availability.slotDurationMinutes || 60)
          setSlots(Array.isArray(availability.slots) ? availability.slots.map(normalizeSlot).filter(Boolean) : [])
          setBooked(Array.isArray(availability.bookedSlots)
            ? availability.bookedSlots.map(normalizeSlot).filter(Boolean)
            : [])
        } else {
          setSlots([])
          setBooked([])
        }
      })
      .catch(err => {
        if (!cancelled) setError(typeof err === 'string' ? err : 'Không tải được thông tin sân.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [id, today])

  if (loading) {
    return (
      <div className="min-h-screen bg-background-base">
        <Navbar />
        <PageLoader message="Đang tải thông tin sân..." />
      </div>
    )
  }

  if (error || !court) {
    return (
      <div className="min-h-screen bg-background-base flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="text-center space-y-4">
            <p className="text-red-400">{error || 'Không tìm thấy sân.'}</p>
            <Link to="/apex/booking" className="text-[var(--theme-primary)] underline">Quay lại danh sách sân</Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

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
          <Link to="/" className="hover:text-[var(--theme-primary)] transition-colors duration-200">Trang chủ</Link>
          <ChevronRight className="w-4 h-4 text-[var(--theme-primary)]/[0.1]" />
          <Link to="/courts" className="hover:text-[var(--theme-primary)] transition-colors duration-200">Sân</Link>
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
              CÒN TRỐNG
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
                  <span className="text-foreground-muted text-sm ml-1">({court.reviews} đánh giá)</span>
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
                Tiện ích
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
                    Lịch trống
                  </h2>
                  <p className="text-foreground-muted text-sm ml-4.5">Chọn khung giờ cho hôm nay</p>
                </div>
                {/* Legend */}
                <div className="hidden sm:flex gap-5 text-sm font-medium text-foreground-muted">
                  <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[var(--theme-surface)] border border-border-default"/> Trống</span>
                  <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/30"/> Đã đặt</span>
                  <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#5E6AD2] shadow-[0_0_8px_rgba(94,106,210,0.6)]"/> Đã chọn</span>
                </div>
              </div>
              
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                {isClosedToday ? (
                  <p className="col-span-full text-sm text-foreground-muted">Tổ hợp đóng cửa hôm nay.</p>
                ) : slots.length === 0 ? (
                  <p className="col-span-full text-sm text-foreground-muted">Không có khung giờ khả dụng.</p>
                ) : slots.map(h => {
                  const isBooked = booked.includes(h)
                  const selected = selectedSlot === h
                  return (
                    <button key={h} disabled={isBooked}
                      onClick={() => setSelectedSlot(h)}
                      className={`py-3 text-sm font-mono tracking-wider font-semibold transition-all duration-200 rounded-xl border
                        ${isBooked ? 'bg-red-500/5 text-red-500/40 border-red-500/10 cursor-not-allowed' :
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
                <p className="text-foreground-muted font-medium text-sm mb-2 uppercase tracking-widest">Giá theo giờ</p>
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
                    Khung giờ đã chọn
                  </p>
                  <p className="text-2xl font-semibold text-[var(--theme-primary)] mb-1 tracking-tight">
                    {selectedSlot} – {addMinutesToTimeLabel(selectedSlot, slotDurationMinutes) || '—'}
                  </p>
                  <p className="text-foreground-muted text-sm font-medium">Hôm nay • {court.name}</p>
                </div>
              </div>

              {/* Placeholder when unselected */}
              <div className={`transition-all duration-300 overflow-hidden ${!selectedSlot ? 'max-h-16 opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'}`}>
                <div className="bg-white/[0.02] border border-border-default py-4 text-center rounded-xl border-dashed">
                  <p className="text-foreground-muted font-medium text-sm">Vui lòng chọn khung giờ</p>
                </div>
              </div>

              {/* Book Button */}
              <Link
                to={selectedSlot ? `/courts/${id}/book?slot=${selectedSlot}&date=${today}` : '#'}
                onClick={e => !selectedSlot && e.preventDefault()}
                className={`w-full flex items-center justify-center h-12 rounded-xl font-semibold text-sm transition-all duration-200
                  ${selectedSlot ? 'bg-[#EDEDEF] text-[#050506] hover:bg-white shadow-[0_4px_14px_rgba(255,255,255,0.15)] active:scale-[0.98]' : 'bg-[var(--theme-surface)] text-foreground-muted border border-border-default cursor-not-allowed'}`}>
                {selectedSlot ? 'Xác nhận đặt sân' : 'Chọn khung giờ'}
              </Link>

              <p className="text-center text-foreground-muted text-xs font-medium mt-6">
                Thanh toán bảo mật qua VNPay & Stripe
              </p>

              {/* Receipt / Invoice Preview */}
              <div className={`transition-all duration-500 ease-in-out overflow-hidden border-t border-border-default ${selectedSlot ? 'max-h-64 mt-6 pt-6 opacity-100' : 'max-h-0 mt-0 pt-0 opacity-0'}`}>
                <div className="space-y-4 text-sm font-medium">
                  <div className="flex justify-between items-center text-foreground-muted">
                    <span>Thuê sân (1 giờ)</span>
                    <span>{court.pricePerSlot.toLocaleString('vi-VN')}</span>
                  </div>
                  <div className="flex justify-between items-center text-foreground-muted">
                    <span className="flex items-center gap-2">
                      Phí nền tảng 
                      <span className="bg-white/[0.06] text-foreground-muted border border-border-default px-1.5 py-0.5 rounded text-[10px] font-mono">5%</span>
                    </span>
                    <span>{(court.pricePerSlot * 0.05).toLocaleString('vi-VN')}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-border-default pt-4 mt-2">
                    <span className="font-semibold text-[var(--theme-primary)] text-base">Tổng cộng</span>
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
