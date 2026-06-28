import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import MatchProLayout from '../../layouts/MatchProLayout'
import { matchApi } from '../../api/matchApi'
import { courtApi } from '../../api/courtApi'
import PageLoader from '../../components/ui/PageLoader'
import { MapPin, Flame, Zap, Swords, Map } from 'lucide-react'

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80'

// Simple SVG strings for leaflet icons
const swordSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#5E6AD2]"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"></polyline><line x1="13" x2="19" y1="19" y2="13"></line><line x1="16" x2="20" y1="16" y2="20"></line><line x1="19" x2="21" y1="21" y2="19"></line><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"></polyline><line x1="5" x2="9" y1="14" y2="18"></line><line x1="7" x2="4" y1="17" y2="20"></line><line x1="3" x2="5" y1="19" y2="21"></line></svg>`

const iconHtml = `<div class="bg-background-elevated p-2 rounded-xl shadow-lg border border-[#5E6AD2]/50 flex items-center justify-center transition-transform hover:scale-110 shadow-[0_0_15px_rgba(94,106,210,0.4)]"><span class="relative z-10 flex items-center justify-center">${swordSvg}</span><div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#5E6AD2]/80"></div></div>`

// Custom DivIcons
const badmintonIcon = L.divIcon({
  html: iconHtml,
  className: '',
  iconSize: [40, 40],
  iconAnchor: [20, 48],
  popupAnchor: [0, -48]
})

const pickleballIcon = L.divIcon({
  html: iconHtml,
  className: '',
  iconSize: [40, 40],
  iconAnchor: [20, 48],
  popupAnchor: [0, -48]
})

const userIcon = L.divIcon({
  html: `
    <div class="relative flex items-center justify-center w-full h-full">
      <div class="absolute w-12 h-12 bg-[#5E6AD2] rounded-full animate-ping opacity-30" style="animation-duration: 2s;"></div>
      <div class="absolute w-8 h-8 bg-[#5E6AD2] rounded-full animate-ping opacity-40" style="animation-duration: 2s; animation-delay: 0.5s;"></div>
      <div class="relative z-10 w-5 h-5 bg-[#5E6AD2] rounded-full border-[3px] border-[#0a0a0c] shadow-[0_0_10px_rgba(94,106,210,0.8)]"></div>
    </div>
  `,
  className: '',
  iconSize: [48, 48],
  iconAnchor: [24, 24]
})

const USER_POSITION = [15.968, 108.261]

const sportFilters = ['Tất cả', 'Cầu lông', 'Pickleball']

function mapCourtToVenue(court, index) {
  const angle = (index * 0.85) % (2 * Math.PI)
  const lat = USER_POSITION[0] + Math.sin(angle) * 0.012 * (index + 1)
  const lng = USER_POSITION[1] + Math.cos(angle) * 0.012 * (index + 1)
  const sportName = court.courtTypeName || court.type || ''
  const sport = sportName.toLowerCase().includes('pickle') ? 'Pickleball' : 'Badminton'
  const price = court.pricePerHour ?? court.basePrice ?? court.hourlyRate ?? 150000
  return {
    id: court.courtId,
    name: court.name,
    sport,
    distance: `${(0.4 + index * 0.7).toFixed(1)} km`,
    courts: court.numberOfCourts ?? 1,
    hours: '6h – 22h',
    rating: 4.8,
    active: court.status === 'Booked' ? 8 : 4,
    position: [lat, lng],
    price: `${Number(price).toLocaleString('vi-VN')}đ`,
    img: court.imageUrl || FALLBACK_IMG,
  }
}

function MapFlyTo({ selectedPosition }) {
  const map = useMap()
  useEffect(() => {
    if (selectedPosition) {
      map.flyTo(selectedPosition, 15, { duration: 1.2 })
    } else {
      map.flyTo(USER_POSITION, 14, { duration: 1.2 })
    }
  }, [selectedPosition, map])
  return null
}

export default function MatchProNearbyPage() {
  const [sportFilter, setSportFilter] = useState('Tất cả')
  const [selectedVenue, setSelectedVenue] = useState(null)
  const [openMatches, setOpenMatches] = useState([])
  const [venues, setVenues] = useState([])
  const [loadingCourts, setLoadingCourts] = useState(true)
  const [courtError, setCourtError] = useState(null)
  const pageRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.fade-up', { opacity: 0, y: 40, stagger: 0.1, duration: 0.8, ease: 'power3.out' })
    }, pageRef)
    return () => ctx.revert()
  }, [sportFilter])

  useEffect(() => {
    setLoadingCourts(true)
    courtApi.getAll({ pageSize: 30 })
      .then(res => {
        if (res.statusCode === 200 && res.data) {
          const list = Array.isArray(res.data) ? res.data : (res.data.items || [])
          setVenues(list.map(mapCourtToVenue))
        } else {
          setCourtError(res.message || 'Không tải được danh sách sân.')
        }
      })
      .catch(err => setCourtError(typeof err === 'string' ? err : 'Không tải được danh sách sân.'))
      .finally(() => setLoadingCourts(false))
  }, [])

  useEffect(() => {
    matchApi.getOpenMatches()
      .then(res => { if (res?.data) setOpenMatches(Array.isArray(res.data) ? res.data : []) })
      .catch(() => {})
  }, [])

  const filteredVenues = venues.filter(v =>
    sportFilter === 'Tất cả' ||
    (sportFilter === 'Cầu lông' && v.sport === 'Badminton') ||
    (sportFilter === 'Pickleball' && v.sport === 'Pickleball')
  )
  const activeVenueInfo = venues.find(v => v.id === selectedVenue)

  return (
    <MatchProLayout>
      {/* Standard Layout: Main Content (Left) + Sidebar (Right) */}
      <div className="flex gap-6 max-lg:flex-col items-start w-full max-w-[1400px] mx-auto pb-12 pt-8" ref={pageRef}>
        
        {/* Main Content Area */}
        <div className="flex-1 min-w-0 w-full flex flex-col gap-6">
          
          <div className="fade-up">
            <h1 className="font-['Oswald'] text-3xl font-bold text-[var(--theme-primary)] mb-2 flex items-center gap-2">
              <MapPin className="text-[#5E6AD2]" size={28} /> Bản đồ sân Đà Nẵng
            </h1>
            <p className="text-base text-foreground-muted">Khám phá các sân tập quanh khu vực — dữ liệu từ hệ thống Pro-Sport.</p>
          </div>

          {/* Map Hero Banner */}
          <div className="w-full h-[400px] max-sm:h-[300px] rounded-[2rem] overflow-hidden shadow-2xl border border-border-default fade-up relative z-0">
            
            <div className="absolute top-4 left-4 z-[400] flex gap-2">
              <div className="bg-background-base/90 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-lg border border-border-default flex items-center gap-2">
                 <MapPin size={16} className="text-[#5E6AD2]" />
                 <span className="font-bold text-[var(--theme-primary)] text-sm">Đại học FPT Đà Nẵng</span>
              </div>
            </div>

            {/* Light map tiles via CartoDB Voyager */}
            <MapContainer center={USER_POSITION} zoom={13} scrollWheelZoom={true} className="w-full h-full bg-[#e5e5e5]">
              <TileLayer
                attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />
              <MapFlyTo selectedPosition={activeVenueInfo?.position} />
              <Marker position={USER_POSITION} icon={userIcon} zIndexOffset={1000} />

              {filteredVenues.map(v => (
                <Marker 
                  key={v.id} 
                  position={v.position} 
                  icon={v.sport === 'Badminton' ? badmintonIcon : pickleballIcon}
                  eventHandlers={{
                    click: () => setSelectedVenue(v.id)
                  }}
                >
                  <Popup className="rounded-2xl font-sans overflow-hidden p-0 m-0 custom-dark-popup">
                    <div className="w-[200px] flex flex-col p-0 bg-background-elevated border border-border-default rounded-xl overflow-hidden">
                      <img src={v.img} alt={v.name} className="w-full h-[100px] object-cover" />
                      <div className="p-3">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-[var(--theme-primary)] text-sm leading-tight">{v.name}</h3>
                          <span className="text-xs font-bold text-yellow-500 flex items-center gap-1">★ {v.rating}</span>
                        </div>
                        <p className="text-[0.7rem] text-foreground-muted mb-3">{v.distance} • {v.price}/giờ</p>
                        <button className="w-full bg-[#5E6AD2] hover:bg-[#6872D9] text-[var(--theme-primary)] font-bold text-xs py-2 rounded-lg transition-colors">Chọn sân</button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Filters */}
          <div className="flex gap-3 overflow-x-auto scrollbar-hide py-2 fade-up border-b border-border-default pb-4">
            {sportFilters.map(f => (
              <button 
                key={f} 
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${sportFilter === f ? 'bg-[#5E6AD2] text-[var(--theme-primary)] shadow-[0_4px_12px_rgba(94,106,210,0.3)]' : 'bg-[var(--theme-surface)] text-foreground-muted border border-border-default hover:border-[#5E6AD2]/50 hover:text-[var(--theme-primary)]'}`}
                onClick={() => setSportFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          {loadingCourts ? (
            <PageLoader message="Đang tải sân..." />
          ) : courtError ? (
            <div className="card-base p-10 text-center text-red-400 font-medium">{courtError}</div>
          ) : (
          <>
          {/* Venue Grid */}
          <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-6 mb-8">
            {filteredVenues.map(v => (
              <div 
                key={v.id} 
                className={`fade-up card-base !p-0 rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 group flex flex-col ${selectedVenue === v.id ? 'ring-2 ring-[#5E6AD2] shadow-[0_0_20px_rgba(94,106,210,0.3)] scale-[1.02]' : 'hover:shadow-2xl hover:-translate-y-1.5'}`} 
                onClick={() => setSelectedVenue(v.id)}
              >
                {/* Image Header */}
                <div className="relative w-full h-[180px] overflow-hidden">
                  <div className="absolute top-3 left-3 z-10 bg-background-deep/80 backdrop-blur border border-border-default text-[var(--theme-primary)] text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-sm flex items-center gap-1">
                    <span className="text-yellow-500">★</span> {v.rating}
                  </div>
                  <div className="absolute top-3 right-3 z-10 bg-background-deep/80 backdrop-blur border border-border-default text-[var(--theme-primary)] text-xs font-bold px-2.5 py-1.5 rounded-lg">
                    {v.distance}
                  </div>
                  <img src={v.img} alt={v.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                
                {/* Content */}
                <div className="p-5 flex flex-col flex-1 bg-transparent">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-[var(--theme-primary)] text-lg leading-tight group-hover:text-[#5E6AD2] transition-colors">{v.name}</h3>
                  </div>
                  <p className="text-sm text-foreground-muted mb-4">{v.sport} • {v.courts} Sân • {v.hours}</p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border-default">
                    <div>
                      <span className="text-lg font-black text-[#5E6AD2]">{v.price}</span>
                      <span className="text-xs font-medium text-foreground-muted">/giờ</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                      <span className="text-xs font-bold text-red-400">{v.active} Đang chơi</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredVenues.length === 0 && !loadingCourts && (
            <div className="text-center py-16 card-base flex flex-col items-center justify-center border-dashed border-border-hover fade-up">
              <Map size={48} className="text-[#5E6AD2]/50 mb-4" />
              <p className="text-foreground-muted font-medium text-lg">Không tìm thấy sân {sportFilter !== 'Tất cả' ? sportFilter : ''} nào.</p>
            </div>
          )}
          </>
          )}
        </div>

        {/* Right Sidebar - Sticky */}
        <div className="w-[320px] max-lg:w-full shrink-0 flex flex-col gap-6 sticky top-[100px] fade-up">
          
          {/* Active Players Card */}
          <div className="card-base !p-6">
            <h3 className="text-base font-bold text-[var(--theme-primary)] mb-5 flex items-center gap-2">
               <Flame className="text-orange-500" size={20} /> Người chơi gần bạn
            </h3>
            <p className="text-sm text-foreground-muted text-center py-6">
              Tính năng tìm người chơi theo vị trí đang phát triển.<br />
              <Link to="/matches" className="text-[#5E6AD2] font-semibold no-underline">Xem kèo đang mở →</Link>
            </p>
          </div>

          {/* Pickup Games - kèo mở thật từ API */}
          <div className="card-base !p-6">
            <h3 className="text-base font-bold text-[var(--theme-primary)] mb-5 flex items-center gap-2">
               <Zap className="text-yellow-400" size={20} /> Kèo đang mở
            </h3>
            <div className="flex flex-col gap-3">
              {openMatches.length === 0 ? (
                <p className="text-sm text-foreground-muted text-center py-4">Chưa có kèo nào đang mở.</p>
              ) : openMatches.slice(0, 5).map(m => (
                <Link
                  key={m.matchId}
                  to={`/matches/${m.matchId}`}
                  className="bg-[var(--theme-surface)] rounded-2xl p-3 border border-border-default flex items-center gap-3 hover:border-[#5E6AD2]/50 transition-colors group cursor-pointer no-underline text-inherit"
                >
                  <div className="w-12 h-12 rounded-xl bg-background-elevated border border-border-default flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Swords className="text-[#5E6AD2]" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[var(--theme-primary)] truncate">{m.title}</p>
                    <p className="text-[0.7rem] font-bold text-[#5E6AD2] uppercase mt-1">
                      Còn {m.maxParticipants - m.currentParticipants} slot • {m.escrowAmount?.toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                  <span className="px-3 py-1.5 bg-[var(--theme-surface-hover)] text-[var(--theme-primary)] text-xs font-bold rounded-lg group-hover:bg-[#5E6AD2] transition-colors">Xem</span>
                </Link>
              ))}
            </div>
          </div>

        </div>

      </div>
      
      {/* Global styles for popup */}
      <style dangerouslySetInnerHTML={{__html: `
        .leaflet-popup-content-wrapper { background: transparent !important; padding: 0 !important; border-radius: 12px !important; box-shadow: none !important; }
        .leaflet-popup-content { margin: 0 !important; width: auto !important; }
        .leaflet-popup-tip-container { display: none; }
        .leaflet-popup-close-button { color: white !important; text-shadow: 0 1px 3px rgba(0,0,0,0.8); right: 8px !important; top: 8px !important; font-size: 16px !important; z-index: 10; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </MatchProLayout>
  )
}
