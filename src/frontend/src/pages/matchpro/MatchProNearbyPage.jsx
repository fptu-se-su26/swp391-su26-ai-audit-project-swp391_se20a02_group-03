import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import MatchProLayout from '../../layouts/MatchProLayout'
import { matchApi } from '../../api/matchApi'
import { courtApi } from '../../api/courtApi'
import PageLoader from '../../components/ui/PageLoader'
import EmptyState from '../../components/ui/EmptyState'
import { MapPin, Flame, Zap, Swords, Map, Radar } from 'lucide-react'

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80'

// Modern SVG strings for leaflet icons (Teal accent)
const swordSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"></polyline><line x1="13" x2="19" y1="19" y2="13"></line><line x1="16" x2="20" y1="16" y2="20"></line><line x1="19" x2="21" y1="21" y2="19"></line><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"></polyline><line x1="5" x2="9" y1="14" y2="18"></line><line x1="7" x2="4" y1="17" y2="20"></line><line x1="3" x2="5" y1="19" y2="21"></line></svg>`

const iconHtml = `<div style="background:#14b8a6; padding:8px; border-radius:50%; border:3px solid #ffffff; box-shadow: 0 4px 12px rgba(20,184,166,0.4); display:flex; align-items:center; justify-content:center;">${swordSvg}</div>`

// Custom DivIcons
const badmintonIcon = L.divIcon({
  html: iconHtml,
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 42],
  popupAnchor: [0, -42]
})

const pickleballIcon = L.divIcon({
  html: iconHtml,
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 42],
  popupAnchor: [0, -42]
})

const userIcon = L.divIcon({
  html: `<div style="width:18px; height:18px; background:#111827; border-radius:50%; border:3px solid #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
  className: '',
  iconSize: [24, 24],
  iconAnchor: [12, 12]
})

const USER_POSITION = [15.968, 108.261]

const sportFilters = ['Tất cả', 'Cầu lông', 'Pickleball']

// Strict Content Rule: Force high-quality images based on sport type
const BADMINTON_IMAGES = [
  'https://images.unsplash.com/photo-1589801258579-18e091f4ca26?w=600&q=80',
  'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80',
  'https://images.unsplash.com/photo-1611224885990-ab7363d1f2a9?w=600&q=80'
]
const PICKLEBALL_IMAGES = [
  'https://images.unsplash.com/photo-1679093838274-11855a80d5d5?w=600&q=80',
  'https://images.unsplash.com/photo-1685387402660-f1db30310ce8?w=600&q=80',
  'https://images.unsplash.com/photo-1695420067602-5369bb4dcab3?w=600&q=80'
]

function mapCourtToVenue(court, index) {
  const angle = (index * 0.85) % (2 * Math.PI)
  const lat = USER_POSITION[0] + Math.sin(angle) * 0.012 * (index + 1)
  const lng = USER_POSITION[1] + Math.cos(angle) * 0.012 * (index + 1)
  const sportName = court.courtTypeName || court.type || ''
  const sport = sportName.toLowerCase().includes('pickle') ? 'Pickleball' : 'Badminton'
  const price = court.pricePerHour ?? court.basePrice ?? court.hourlyRate ?? 150000
  
  // Apply Strict Content Rule for Images
  let imgUrl = sport === 'Badminton' 
    ? BADMINTON_IMAGES[index % BADMINTON_IMAGES.length]
    : PICKLEBALL_IMAGES[index % PICKLEBALL_IMAGES.length]

  // Override specifically requested images based on court name
  const courtNameLower = (court.name || '').toLowerCase()
  if (courtNameLower.includes('a1')) {
    imgUrl = '/images/caulong-a1.jpg'
  } else if (courtNameLower.includes('a3')) {
    imgUrl = '/images/caulong-a3.jpg'
  } else if (courtNameLower.includes('p1')) {
    imgUrl = '/images/pickleball-p1.jpg'
  } else if (courtNameLower.includes('p2')) {
    imgUrl = '/images/pickleball-p2.jpg'
  }

  return {
    id: court.courtId,
    name: court.name,
    sport,
    distance: `${(0.4 + index * 0.7).toFixed(1)} KM`,
    courts: court.numberOfCourts ?? 1,
    hours: '6h – 22h',
    rating: 4.8,
    active: court.status === 'Booked' ? 8 : 4,
    position: [lat, lng],
    price: `${Number(price).toLocaleString('vi-VN')}đ`,
    img: imgUrl,
  }
}

function MapFlyTo({ selectedPosition }) {
  const map = useMap()
  useEffect(() => {
    if (selectedPosition) {
      map.flyTo(selectedPosition, 17, { duration: 1.2 })
    } else {
      map.flyTo(USER_POSITION, 16, { duration: 1.2 })
    }
  }, [selectedPosition, map])
  return null
}

const modernCardClass = "bg-white rounded-[12px] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] border border-gray-100"

export default function MatchProNearbyPage() {
  const [sportFilter, setSportFilter] = useState('Tất cả')
  const [selectedVenue, setSelectedVenue] = useState(null)
  const [openMatches, setOpenMatches] = useState([])
  const [venues, setVenues] = useState([])
  const [loadingCourts, setLoadingCourts] = useState(true)
  const [courtError, setCourtError] = useState(null)

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
      <div className="bg-[#F5F5F5] min-h-screen">
        <div className="flex gap-8 max-lg:flex-col items-start w-full max-w-[1440px] mx-auto px-4 md:px-10 pb-16 pt-8 font-sans">

          {/* Main Content Area */}
          <div className="flex-1 min-w-0 w-full flex flex-col gap-6">

            <div>
              <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-gray-900 mb-2 flex items-center gap-2 m-0">
                <MapPin size={32} className="text-[#14b8a6]" /> Bản đồ sân Đà Nẵng
              </h1>
              <p className="text-[14px] text-gray-500 mt-1 m-0">Khám phá các sân tập quanh khu vực — dữ liệu trực tuyến từ hệ thống Pro-Sport.</p>
            </div>

            {/* Map Hero Banner */}
            <div className={`w-full h-[340px] max-sm:h-[260px] overflow-hidden relative z-0 ${modernCardClass}`}>
              <div className="absolute top-4 left-4 z-[400]">
                <span className="bg-white/90 backdrop-blur text-[#14b8a6] px-4 py-2 rounded-full flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider shadow-sm">
                  <MapPin size={14} /> FPT City Complex
                </span>
              </div>

              <MapContainer center={USER_POSITION} zoom={16} scrollWheelZoom={true} className="w-full h-full z-0">
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
                    <Popup className="mp-popup-modern">
                      <div className="w-[220px] flex flex-col bg-white rounded-[12px] overflow-hidden shadow-xl">
                        <img src={v.img} alt={v.name} className="w-full h-[110px] object-cover" />
                        <div className="p-3">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-bold text-gray-900 text-[14px] leading-tight m-0">{v.name}</h3>
                          </div>
                          <p className="text-[12px] text-gray-500 mb-3 m-0">{v.distance} • <strong className="text-gray-900">{v.price}</strong>/giờ</p>
                          <button className="w-full bg-[#14b8a6] hover:bg-[#15c3b0] text-white font-bold text-[12px] uppercase tracking-wide py-2.5 rounded-[8px] transition-colors cursor-pointer outline-none">Chọn sân</button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            {/* Filters */}
            <div className="flex gap-3 flex-wrap">
              {sportFilters.map(f => (
                <button
                  key={f}
                  className={`px-5 py-2 rounded-full text-[13px] font-bold transition-all cursor-pointer outline-none ${
                    sportFilter === f
                      ? 'bg-[#14b8a6] text-white shadow-md border-transparent'
                      : 'bg-white text-gray-600 border border-gray-300 hover:border-gray-400 hover:text-gray-900'
                  }`}
                  onClick={() => setSportFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>

            {loadingCourts ? (
              <div className="py-10"><PageLoader message="Đang tải sân..." /></div>
            ) : courtError ? (
              <div className={`p-8 text-center text-red-500 font-medium ${modernCardClass}`}>{courtError}</div>
            ) : (
            <>
            {/* Venue Grid */}
            <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-5">
              {filteredVenues.map(v => (
                <div
                  key={v.id}
                  className={`overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 flex flex-col ${modernCardClass} ${selectedVenue === v.id ? 'ring-2 ring-[#14b8a6]' : ''}`}
                  onClick={() => setSelectedVenue(v.id)}
                >
                  {/* Image Header */}
                  <div className="relative w-full h-[160px] overflow-hidden">
                    {/* Glassmorphism Pills */}
                    <span className="absolute top-3 left-3 bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-full text-[11px] font-bold tracking-wider">
                      ★ {v.rating}
                    </span>
                    <span className="absolute top-3 right-3 bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-full text-[11px] font-bold tracking-wider">
                      {v.distance}
                    </span>
                    <img src={v.img} alt={v.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-gray-900 text-[16px] mb-1.5 m-0 line-clamp-1">{v.name}</h3>
                    <p className="text-[13px] text-gray-500 mb-2 m-0 font-medium">
                      {v.sport === 'Badminton' ? 'Cầu lông' : 'Pickleball'} • {v.courts} Sân • {v.hours}
                    </p>
                    
                    {/* Teal Dot UI for active players moved up */}
                    <span className="flex items-center gap-1.5 text-[12px] font-medium text-gray-600 mb-4">
                      <div className="w-2 h-2 rounded-full bg-[#14b8a6]"></div>
                      {v.active} người đang chơi
                    </span>

                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 group">
                      <span className="font-bold text-[16px] text-gray-900">
                        {v.price}<span className="font-normal text-[12px] text-gray-500 ml-0.5">/giờ</span>
                      </span>
                      <span className="text-[13px] font-bold text-[#14b8a6] flex items-center gap-1 group-hover:underline">
                        Xem chi tiết <span className="text-[14px]">➔</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredVenues.length === 0 && !loadingCourts && (
              <div className={`p-10 ${modernCardClass}`}>
                <EmptyState
                  icon={<Map size={32} className="text-gray-300" />}
                  title={`Không tìm thấy sân ${sportFilter !== 'Tất cả' ? sportFilter : ''}`}
                />
              </div>
            )}
            </>
            )}
          </div>

          {/* Right Sidebar - Widgets */}
          <div className="w-[320px] max-lg:w-full shrink-0 flex flex-col gap-6 sticky top-[100px]">

            {/* Active Players Card */}
            <div className={`p-5 flex flex-col ${modernCardClass}`}>
              <h3 className="text-[14px] font-bold uppercase tracking-wider text-[#14b8a6] mb-5 m-0 flex items-center gap-2">
                 <Flame size={18} /> Người chơi gần bạn
              </h3>
              
              <div className="flex flex-col items-center justify-center py-4 gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center text-[#14b8a6] mb-1">
                  <Radar size={32} />
                </div>
                <div className="space-y-1">
                  <p className="text-[14px] font-bold text-gray-900 m-0">Đang tìm kiếm quanh bạn</p>
                  <p className="text-[13px] text-gray-500 px-2 m-0">Hệ thống đang quét các người chơi ở gần khu vực này.</p>
                </div>
                <Link to="/matches" className="mt-3 w-full bg-[#14b8a6] hover:bg-[#15c3b0] text-white py-2.5 rounded-[8px] text-[13px] font-bold uppercase tracking-wide transition-colors cursor-pointer outline-none no-underline text-center shadow-sm">
                  Xem kèo đang mở
                </Link>
              </div>
            </div>

            {/* Pickup Games (Mini-cards) */}
            <div className={`p-5 flex flex-col ${modernCardClass}`}>
              <h3 className="text-[14px] font-bold uppercase tracking-wider text-[#14b8a6] mb-4 m-0 flex items-center gap-2">
                 <Zap size={18} /> Kèo đang mở
              </h3>
              <div className="flex flex-col gap-3">
                {openMatches.length === 0 ? (
                  <p className="text-[13px] text-gray-500 text-center py-4 m-0">Chưa có kèo nào đang mở.</p>
                ) : openMatches.slice(0, 5).map(m => {
                  const sport = m.sportType || 'Badminton' 
                  const title = m.title || `Kèo ${sport}`
                  return (
                    <Link
                      key={m.matchId}
                      to={`/matches/${m.matchId}`}
                      className="group flex flex-col gap-2 p-3 rounded-[10px] border border-gray-100 bg-gray-50 hover:bg-white hover:border-[#14b8a6]/30 hover:shadow-[0_4px_12px_rgba(20,184,166,0.08)] transition-all no-underline"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center shrink-0 text-[#14b8a6]">
                          <Swords size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-bold text-gray-900 truncate group-hover:text-[#14b8a6] transition-colors m-0">{title}</p>
                          <p className="text-[11px] font-medium text-gray-500 mt-1 m-0">
                            Còn {m.maxParticipants - m.currentParticipants} chỗ • {m.escrowAmount?.toLocaleString('vi-VN')}đ
                          </p>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
              <Link to="/matches" className="mt-4 text-center text-[13px] font-bold text-gray-500 hover:text-[#14b8a6] hover:underline no-underline">
                Xem tất cả kèo →
              </Link>
            </div>

          </div>

        </div>
      </div>

      {/* Popup modern style override */}
      <style dangerouslySetInnerHTML={{__html: `
        .mp-popup-modern .leaflet-popup-content-wrapper { background: transparent !important; padding: 0 !important; border-radius: 0 !important; box-shadow: none !important; }
        .mp-popup-modern .leaflet-popup-content { margin: 0 !important; width: auto !important; }
        .mp-popup-modern .leaflet-popup-tip-container { display: none; }
      `}} />
    </MatchProLayout>
  )
}
