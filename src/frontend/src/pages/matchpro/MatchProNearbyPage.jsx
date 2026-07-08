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
import { MapPin, Flame, Zap, Swords, Map } from 'lucide-react'

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80'

// Simple SVG strings for leaflet icons
const swordSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f3f2ee" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"></polyline><line x1="13" x2="19" y1="19" y2="13"></line><line x1="16" x2="20" y1="16" y2="20"></line><line x1="19" x2="21" y1="21" y2="19"></line><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"></polyline><line x1="5" x2="9" y1="14" y2="18"></line><line x1="7" x2="4" y1="17" y2="20"></line><line x1="3" x2="5" y1="19" y2="21"></line></svg>`

const iconHtml = `<div style="background:#0d1b2a; padding:8px; border-radius:2px; border:2px solid #0d1b2a; display:flex; align-items:center; justify-content:center;">${swordSvg}</div>`

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
  html: `<div style="width:16px; height:16px; background:#14b8a6; border-radius:50%; border:3px solid #0d1b2a;"></div>`,
  className: '',
  iconSize: [22, 22],
  iconAnchor: [11, 11]
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
      <div className="flex gap-8 max-lg:flex-col items-start w-full max-w-[1440px] mx-auto px-4 md:px-10 pb-16 pt-8">

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 w-full flex flex-col gap-6">

          <div>
            <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground mb-2 flex items-center gap-2">
              <MapPin size={26} /> Bản đồ sân Đà Nẵng
            </h1>
            <p className="text-sm text-foreground-muted">Khám phá các sân tập quanh khu vực — dữ liệu từ hệ thống Pro-Sport.</p>
          </div>

          {/* Map Hero Banner */}
          <div className="w-full h-[340px] max-sm:h-[260px] border-2 border-border-strong overflow-hidden relative z-0">

            <div className="absolute top-4 left-4 z-[400]">
              <span className="label-mono bg-ink text-paper px-4 py-2 flex items-center gap-2">
                <MapPin size={14} /> Đại học FPT Đà Nẵng
              </span>
            </div>

            <MapContainer center={USER_POSITION} zoom={13} scrollWheelZoom={true} className="w-full h-full">
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
                  <Popup className="mp-popup-flat">
                    <div className="w-[200px] flex flex-col bg-surface border-2 border-border-strong">
                      <img src={v.img} alt={v.name} className="w-full h-[100px] object-cover" />
                      <div className="p-3">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-foreground text-sm leading-tight">{v.name}</h3>
                          <span className="text-xs font-bold text-foreground flex items-center gap-1">★ {v.rating}</span>
                        </div>
                        <p className="text-[11px] text-foreground-muted mb-3">{v.distance} • {v.price}/giờ</p>
                        <button className="w-full bg-ink text-paper font-bold text-xs py-2 rounded-[2px]">Chọn sân</button>
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
                className={`px-6 py-2.5 rounded-[2px] border-2 text-xs font-extrabold uppercase tracking-[0.04em] transition-colors cursor-pointer ${
                  sportFilter === f
                    ? 'bg-ink border-ink text-paper'
                    : 'bg-transparent border-border-hover text-foreground-muted hover:border-foreground hover:text-foreground'
                }`}
                onClick={() => setSportFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          {loadingCourts ? (
            <PageLoader message="Đang tải sân..." />
          ) : courtError ? (
            <div className="card-base text-center text-danger font-medium">{courtError}</div>
          ) : (
          <>
          {/* Venue Grid */}
          <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-5">
            {filteredVenues.map(v => (
              <div
                key={v.id}
                className={`card-base !p-0 overflow-hidden cursor-pointer transition-colors flex flex-col ${selectedVenue === v.id ? 'border-accent' : ''}`}
                onClick={() => setSelectedVenue(v.id)}
              >
                {/* Image Header */}
                <div className="relative w-full h-[150px] border-b-2 border-border-strong overflow-hidden">
                  <span className="absolute top-2.5 left-2.5 label-mono bg-paper text-ink px-2 py-1">★ {v.rating}</span>
                  <span className="absolute top-2.5 right-2.5 label-mono bg-ink text-paper px-2 py-1">{v.distance}</span>
                  <img src={v.img} alt={v.name} className="w-full h-full object-cover" />
                </div>

                {/* Content */}
                <div className="p-[18px] flex flex-col flex-1">
                  <h3 className="font-bold text-foreground text-sm mb-1.5">{v.name}</h3>
                  <p className="text-xs text-foreground-muted mb-3.5">{v.sport === 'Badminton' ? 'Cầu lông' : 'Pickleball'} • {v.courts} Sân • {v.hours}</p>

                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-border-default">
                    <span className="font-heading text-base text-foreground">
                      {v.price}<span className="font-sans text-[10px] text-foreground-subtle">/giờ</span>
                    </span>
                    <span className="label-mono text-danger">● {v.active} đang chơi</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredVenues.length === 0 && !loadingCourts && (
            <EmptyState
              icon={<Map size={28} />}
              title={`Không tìm thấy sân ${sportFilter !== 'Tất cả' ? sportFilter : ''}`}
            />
          )}
          </>
          )}
        </div>

        {/* Right Sidebar - Sticky */}
        <div className="w-[320px] max-lg:w-full shrink-0 flex flex-col gap-5 sticky top-[100px]">

          {/* Active Players Card */}
          <div className="card-base">
            <h3 className="font-heading text-[15px] uppercase text-foreground mb-4 flex items-center gap-2">
               <Flame size={18} /> Người chơi gần bạn
            </h3>
            <p className="text-[13px] text-foreground-muted text-center py-4">
              Đang phát triển.<br />
              <Link to="/matches" className="text-foreground font-bold underline">Xem kèo đang mở →</Link>
            </p>
          </div>

          {/* Pickup Games - kèo mở thật từ API */}
          <div className="card-base">
            <h3 className="font-heading text-[15px] uppercase text-foreground mb-4 flex items-center gap-2">
               <Zap size={18} /> Kèo đang mở
            </h3>
            <div className="flex flex-col gap-2.5">
              {openMatches.length === 0 ? (
                <p className="text-[13px] text-foreground-muted text-center py-4">Chưa có kèo nào đang mở.</p>
              ) : openMatches.slice(0, 5).map(m => (
                <Link
                  key={m.matchId}
                  to={`/matches/${m.matchId}`}
                  className="border-2 border-border-strong p-3.5 flex items-center gap-3 hover:border-accent transition-colors no-underline text-inherit"
                >
                  <div className="w-11 h-11 rounded-[2px] bg-ink flex items-center justify-center shrink-0">
                    <Swords className="text-paper" size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-foreground truncate">{m.title}</p>
                    <p className="label-mono text-foreground-subtle mt-1">
                      Còn {m.maxParticipants - m.currentParticipants} chỗ • {m.escrowAmount?.toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Popup flat style override */}
      <style dangerouslySetInnerHTML={{__html: `
        .mp-popup-flat .leaflet-popup-content-wrapper { background: transparent !important; padding: 0 !important; border-radius: 0 !important; box-shadow: none !important; }
        .mp-popup-flat .leaflet-popup-content { margin: 0 !important; width: auto !important; }
        .mp-popup-flat .leaflet-popup-tip-container { display: none; }
      `}} />
    </MatchProLayout>
  )
}
