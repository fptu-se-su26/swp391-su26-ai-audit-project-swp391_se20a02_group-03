import { useState, useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import PageLoader from '../../components/ui/PageLoader'
import { bookingApi } from '../../api/bookingApi'
import { formatLocalDate, addMinutesToTimeLabel } from '../../utils/date'
import { MapPin, Wifi, Car, Shirt, Wind, ShoppingBag, Droplets, Star } from 'lucide-react'

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
        <main className="flex-1 flex items-center justify-center px-6 pt-[76px]">
          <div className="text-center space-y-4">
            <p className="text-danger">{error || 'Không tìm thấy sân.'}</p>
            <Link to="/apex/booking" className="text-accent font-bold hover:underline">Quay lại danh sách sân</Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-base font-sans text-foreground">
      <Navbar />

      <main className="flex-1 max-w-[1300px] mx-auto px-6 sm:px-10 pt-[100px] sm:pt-[130px] pb-24 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2.5 label-mono text-foreground-subtle mb-8">
          <Link to="/" className="hover:text-foreground transition-colors duration-200">Trang chủ</Link>
          <span>/</span>
          <Link to="/courts" className="hover:text-foreground transition-colors duration-200">Sân</Link>
          <span>/</span>
          <span className="text-foreground normal-case">{court.name}</span>
        </nav>

        {/* ── BENTO GALLERY ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-3 mb-14 lg:h-[440px]">
          {/* Main Large Image */}
          <div className="relative overflow-hidden border-2 border-border-strong h-[280px] lg:h-full">
            <img
              src={court.images[activeImg]}
              alt={court.name}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-5 left-5 label-mono bg-ink text-paper px-4 py-2">
              CÒN TRỐNG
            </span>
          </div>

          {/* Side Thumbnails */}
          <div className="hidden lg:grid grid-rows-3 gap-3 h-full">
            {court.images.slice(1, 4).map((img, i) => {
              const realIndex = i + 1;
              const isActive = activeImg === realIndex;
              return (
                <button
                  key={img}
                  onClick={() => setActiveImg(realIndex)}
                  className={`relative overflow-hidden border-2 transition-colors duration-200 h-full w-full ${isActive ? 'border-accent' : 'border-border-default hover:border-border-hover'}`}
                >
                  <img src={img} alt="" className={`w-full h-full object-cover ${!isActive && 'opacity-60'}`} />
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 lg:gap-14 items-start">
          {/* ── LEFT CONTENT ── */}
          <div className="flex flex-col gap-8">
            {/* Header & Meta */}
            <div className="card-base p-7 sm:p-8">
              <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
                <div>
                  <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground mb-2">{court.name}</h1>
                  <p className="text-foreground-muted font-medium flex items-center gap-2 flex-wrap">
                    {court.sport}
                    <span className="text-foreground-subtle">|</span>
                    {court.type}
                  </p>
                </div>
                <div className="flex items-center gap-2 border-2 border-border-strong px-4 py-2">
                  <Star className="w-4 h-4 text-warning fill-warning/30" />
                  <span className="font-bold text-foreground">{court.rating}</span>
                  <span className="text-foreground-muted text-sm ml-1">({court.reviews} đánh giá)</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-foreground-muted font-medium mb-8 pb-8 border-b border-border-default">
                <MapPin className="w-5 h-5 text-accent" />
                {court.address}
              </div>

              <p className="text-foreground-muted text-base leading-relaxed">{court.description}</p>
            </div>

            {/* Amenities Grid */}
            <div className="card-base p-7 sm:p-8">
              <h2 className="font-heading text-xl uppercase text-foreground mb-6">Tiện ích</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[2px] bg-border-default border-2 border-border-default">
                {court.amenities.map(a => (
                  <div key={a.label} className="flex items-center gap-3 bg-surface p-4">
                    <div className="w-10 h-10 border border-border-default flex items-center justify-center shrink-0 text-foreground-muted">
                      {a.icon}
                    </div>
                    <span className="text-sm font-medium text-foreground-muted">{a.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Slot Picker */}
            <div className="card-base p-7 sm:p-8">
              <div className="flex items-end justify-between mb-7 border-b border-border-default pb-6 flex-wrap gap-4">
                <div>
                  <h2 className="font-heading text-xl uppercase text-foreground mb-1.5">Lịch trống</h2>
                  <p className="text-foreground-muted text-sm">Chọn khung giờ cho hôm nay</p>
                </div>
                {/* Legend */}
                <div className="flex gap-5 label-mono text-foreground-muted">
                  <span className="flex items-center gap-2"><span className="w-3 h-3 border border-border-strong bg-surface"/> Trống</span>
                  <span className="flex items-center gap-2"><span className="w-3 h-3 border border-danger/40 bg-danger-bg"/> Đã đặt</span>
                  <span className="flex items-center gap-2"><span className="w-3 h-3 bg-accent"/> Đã chọn</span>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
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
                      className={`py-3 text-sm font-mono tracking-wider font-bold transition-colors duration-150 border-2
                        ${isBooked ? 'bg-danger-bg text-danger/50 border-danger/20 cursor-not-allowed line-through' :
                          selected ? 'bg-accent text-ink border-accent' :
                          'bg-surface text-foreground-muted border-border-default hover:border-border-hover hover:text-foreground'}`}>
                      {h}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL (Booking Widget) ── */}
          <div className="lg:sticky lg:top-28">
            <div className="card-base p-7 sm:p-8">

              <div className="mb-7">
                <p className="label-mono text-foreground-subtle mb-2">Giá theo giờ</p>
                <p className="font-heading text-4xl text-foreground flex items-baseline gap-2">
                  {court.pricePerSlot.toLocaleString('vi-VN')}
                  <span className="text-base font-sans font-medium text-foreground-muted">VND</span>
                </p>
              </div>

              {/* Selected state info */}
              {selectedSlot ? (
                <div className="bg-ink p-5 mb-6">
                  <p className="label-mono text-paper/60 mb-2">Khung giờ đã chọn</p>
                  <p className="font-heading text-xl text-paper mb-1">
                    {selectedSlot} – {addMinutesToTimeLabel(selectedSlot, slotDurationMinutes) || '—'}
                  </p>
                  <p className="text-paper/60 text-sm font-medium">Hôm nay • {court.name}</p>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border-hover py-4 text-center mb-6">
                  <p className="text-foreground-muted font-medium text-sm">Vui lòng chọn khung giờ</p>
                </div>
              )}

              {/* Book Button */}
              <Link
                to={selectedSlot ? `/courts/${id}/book?slot=${selectedSlot}&date=${today}` : '#'}
                onClick={e => !selectedSlot && e.preventDefault()}
                className={`w-full flex items-center justify-center h-[52px] font-bold text-sm uppercase tracking-[0.04em] transition-colors duration-150
                  ${selectedSlot ? 'bg-ink text-paper hover:bg-accent hover:text-ink' : 'bg-surface text-foreground-muted border-2 border-border-default cursor-not-allowed'}`}>
                {selectedSlot ? 'Xác nhận đặt sân' : 'Chọn khung giờ'}
              </Link>

              <p className="text-center label-mono text-foreground-subtle mt-6">
                Thanh toán bảo mật qua VNPay & Stripe
              </p>

              {/* Receipt / Invoice Preview */}
              {selectedSlot && (
                <div className="border-t border-border-default mt-6 pt-6 space-y-3 text-sm font-medium">
                  <div className="flex justify-between items-center text-foreground-muted">
                    <span>Thuê sân (1 giờ)</span>
                    <span>{court.pricePerSlot.toLocaleString('vi-VN')}</span>
                  </div>
                  <div className="flex justify-between items-center text-foreground-muted">
                    <span className="flex items-center gap-2">
                      Phí nền tảng
                      <span className="bg-surface-hover text-foreground-muted border border-border-default px-1.5 py-0.5 text-[10px] font-mono">5%</span>
                    </span>
                    <span>{(court.pricePerSlot * 0.05).toLocaleString('vi-VN')}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-border-default pt-4 mt-2">
                    <span className="font-bold text-foreground text-base">Tổng cộng</span>
                    <span className="font-heading text-xl text-foreground">
                      {(court.pricePerSlot * 1.05).toLocaleString('vi-VN')} <span className="text-sm font-sans font-medium text-foreground-muted">VND</span>
                    </span>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
