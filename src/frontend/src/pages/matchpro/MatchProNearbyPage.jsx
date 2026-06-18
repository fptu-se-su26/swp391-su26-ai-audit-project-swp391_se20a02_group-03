import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import MatchProLayout from '../../layouts/MatchProLayout'

// Custom DivIcons
const badmintonIcon = L.divIcon({
  html: '<div class="bg-white p-2 rounded-xl shadow-lg text-xl border-2 border-[#00c8aa] flex items-center justify-center transition-transform hover:scale-110"><span class="relative z-10">🏸</span><div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#00c8aa]"></div></div>',
  className: '',
  iconSize: [40, 40],
  iconAnchor: [20, 48],
  popupAnchor: [0, -48]
})

const pickleballIcon = L.divIcon({
  html: '<div class="bg-white p-2 rounded-xl shadow-lg text-xl border-2 border-[#00c8aa] flex items-center justify-center transition-transform hover:scale-110"><span class="relative z-10">🏓</span><div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#00c8aa]"></div></div>',
  className: '',
  iconSize: [40, 40],
  iconAnchor: [20, 48],
  popupAnchor: [0, -48]
})

const userIcon = L.divIcon({
  html: `
    <div class="relative flex items-center justify-center w-full h-full">
      <div class="absolute w-12 h-12 bg-[#0066ff] rounded-full animate-ping opacity-30" style="animation-duration: 2s;"></div>
      <div class="absolute w-8 h-8 bg-[#0066ff] rounded-full animate-ping opacity-40" style="animation-duration: 2s; animation-delay: 0.5s;"></div>
      <div class="relative z-10 w-5 h-5 bg-[#0066ff] rounded-full border-[3px] border-white shadow-md"></div>
    </div>
  `,
  className: '',
  iconSize: [48, 48],
  iconAnchor: [24, 24]
})

const USER_POSITION = [15.968, 108.261] // FPT University Da Nang

const venues = [
  { id: 1, name: 'FPT Campus Badminton', sport: 'Badminton', distance: '0.5 km', courts: 4, hours: '6am - 10pm', rating: 4.9, icon: '🏸', active: 16, position: [15.970, 108.258], price: '50K', img: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?w=600&q=80' },
  { id: 2, name: 'FPT City Pickleball Arena', sport: 'Pickleball', distance: '1.2 km', courts: 3, hours: '6am - 11pm', rating: 4.8, icon: '🏓', active: 8, position: [15.980, 108.250], price: '80K', img: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600&q=80' },
  { id: 3, name: 'Hòa Xuân Complex', sport: 'Badminton', distance: '5.2 km', courts: 12, hours: '5am - 10pm', rating: 4.7, icon: '🏸', active: 18, position: [16.002, 108.225], price: '60K', img: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80' },
  { id: 4, name: 'Cung Thể thao Tiên Sơn', sport: 'Badminton', distance: '8.5 km', courts: 10, hours: '5am - 10pm', rating: 4.9, icon: '🏸', active: 24, position: [16.035, 108.232], price: '80K', img: 'https://images.unsplash.com/photo-1572991054320-f56b54133e5c?w=600&q=80' },
  { id: 5, name: 'My Khe Pickleball Resort', sport: 'Pickleball', distance: '12 km', courts: 5, hours: '6am - 11pm', rating: 4.8, icon: '🏓', active: 12, position: [16.060, 108.245], price: '120K', img: 'https://images.unsplash.com/photo-1622618991746-fe6004db3a47?w=600&q=80' },
]

const nearbyPlayers = [
  { name: 'Marcus T.', sport: 'Badminton', dist: '0.2km', online: true, img: 'https://ui-avatars.com/api/?name=Marcus+T&background=00c8aa&color=fff' },
  { name: 'Elena R.', sport: 'Pickleball', dist: '1.5km', online: true, img: 'https://ui-avatars.com/api/?name=Elena+R&background=0d2d3a&color=fff' },
  { name: 'Jae K.', sport: 'Badminton', dist: '2km', online: false, img: 'https://ui-avatars.com/api/?name=Jae+K' },
  { name: 'Mia S.', sport: 'Badminton', dist: '3.5km', online: true, img: 'https://ui-avatars.com/api/?name=Mia+S&background=f0f7f6&color=00c8aa' },
  { name: 'Chris N.', sport: 'Pickleball', dist: '4km', online: false, img: 'https://ui-avatars.com/api/?name=Chris+N' },
  { name: 'Linh P.', sport: 'Badminton', dist: '5km', online: true, img: 'https://ui-avatars.com/api/?name=Linh+P&background=ffb020&color=fff' }
]

const sportFilters = ['All Sports', 'Badminton', 'Pickleball']

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
  const [sportFilter, setSportFilter] = useState('All Sports')
  const [selectedVenue, setSelectedVenue] = useState(null)
  const pageRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.fade-up', { opacity: 0, y: 40, stagger: 0.1, duration: 0.8, ease: 'power3.out' })
    }, pageRef)
    return () => ctx.revert()
  }, [sportFilter])

  const filteredVenues = venues.filter(v => sportFilter === 'All Sports' || v.sport === sportFilter)
  const activeVenueInfo = venues.find(v => v.id === selectedVenue)

  return (
    <MatchProLayout>
      {/* Standard Layout: Main Content (Left) + Sidebar (Right) */}
      <div className="flex gap-6 max-lg:flex-col items-start w-full max-w-[1400px] mx-auto" ref={pageRef}>
        
        {/* Main Content Area */}
        <div className="flex-1 min-w-0 w-full flex flex-col gap-6">
          
          <div className="fade-up">
            <h1 className="font-['Oswald'] text-3xl font-bold text-[#0d2d3a] mb-2">📍 Đà Nẵng Sports Map</h1>
            <p className="text-base text-slate-500">Khám phá các sân tập cao cấp quanh khu vực Đà Nẵng.</p>
          </div>

          {/* Map Hero Banner */}
          <div className="w-full h-[400px] max-sm:h-[300px] rounded-3xl overflow-hidden shadow-md border-4 border-white fade-up relative z-0">
            
            <div className="absolute top-4 left-4 z-[400] flex gap-2">
              <div className="bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-lg border border-slate-100 flex items-center gap-2">
                 <span className="text-lg">📍</span>
                 <span className="font-bold text-[#0d2d3a] text-sm">Đại học FPT Đà Nẵng</span>
              </div>
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
                  <Popup className="rounded-2xl font-sans overflow-hidden p-0 m-0 custom-airbnb-popup">
                    <div className="w-[200px] flex flex-col p-0">
                      <img src={v.img} alt={v.name} className="w-full h-[100px] object-cover rounded-t-xl" />
                      <div className="p-3 bg-white rounded-b-xl">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-[#0d2d3a] text-sm leading-tight">{v.name}</h3>
                          <span className="text-xs font-bold text-[#00c8aa]">⭐{v.rating}</span>
                        </div>
                        <p className="text-[0.7rem] text-slate-500 mb-2">{v.distance} • {v.price}/giờ</p>
                        <button className="w-full bg-[#00c8aa] text-white font-bold text-xs py-1.5 rounded-lg hover:bg-[#009e87] transition-colors">Chọn</button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Filters */}
          <div className="flex gap-3 overflow-x-auto scrollbar-hide py-2 fade-up border-b border-slate-100 pb-4">
            {sportFilters.map(f => (
              <button 
                key={f} 
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${sportFilter === f ? 'bg-[#0d2d3a] text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200 hover:border-[#00c8aa] hover:text-[#00c8aa]'}`}
                onClick={() => setSportFilter(f)}
              >
                {f === 'All Sports' ? 'Tất cả các môn' : f}
              </button>
            ))}
          </div>
          
          {/* Venue Grid */}
          <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-6 mb-8">
            {filteredVenues.map(v => (
              <div 
                key={v.id} 
                className={`fade-up bg-white rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 group ${selectedVenue === v.id ? 'ring-4 ring-[#00c8aa]/30 shadow-xl scale-[1.02] border border-[#00c8aa]/50' : 'border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5'}`} 
                onClick={() => setSelectedVenue(v.id)}
              >
                {/* Image Header */}
                <div className="relative w-full h-[180px] overflow-hidden">
                  <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur text-[#0d2d3a] text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-sm">
                    ⭐ {v.rating}
                  </div>
                  <div className="absolute top-3 right-3 z-10 bg-black/40 backdrop-blur text-white text-xs font-bold px-2.5 py-1.5 rounded-lg border border-white/20">
                    {v.distance}
                  </div>
                  <img src={v.img} alt={v.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                
                {/* Content */}
                <div className="p-5 flex flex-col h-[150px]">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-[#0d2d3a] text-lg leading-tight group-hover:text-[#00c8aa] transition-colors">{v.name}</h3>
                  </div>
                  <p className="text-sm text-slate-500 mb-4">{v.sport} • {v.courts} Sân • {v.hours}</p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                    <div>
                      <span className="text-lg font-black text-[#0d2d3a]">{v.price}</span>
                      <span className="text-xs font-medium text-slate-500">/giờ</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                      <span className="text-xs font-bold text-red-500">{v.active} Đang chơi</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredVenues.length === 0 && (
            <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-300 fade-up">
              <span className="text-4xl opacity-50 mb-2 block">🗺️</span>
              <p className="text-slate-500 font-medium">Không tìm thấy sân {sportFilter} nào.</p>
            </div>
          )}
        </div>

        {/* Right Sidebar - Sticky */}
        <div className="w-[320px] max-lg:w-full shrink-0 flex flex-col gap-6 sticky top-[100px] fade-up">
          
          {/* Active Players Card */}
          <div className="bg-white rounded-3xl border border-[#e0ecf0] p-6 shadow-sm">
            <h3 className="text-base font-bold text-[#0d2d3a] mb-5 flex items-center gap-2">
               🔥 Live Players Nearby
            </h3>
            <div className="flex flex-col gap-2">
              {nearbyPlayers.slice(0, 5).map(p => (
                <div key={p.name} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0 group cursor-pointer">
                  <div className="relative shrink-0">
                    <img src={p.img} alt={p.name} className="w-11 h-11 rounded-full object-cover shadow-sm group-hover:ring-2 ring-[#00c8aa] transition-all" />
                    {p.online && <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white shadow-sm" />}
                  </div>
                  <div className="flex flex-col flex-1">
                    <p className="text-sm font-bold text-[#0d2d3a] group-hover:text-[#00c8aa] transition-colors">{p.name}</p>
                    <p className="text-[0.7rem] font-medium text-slate-500">{p.sport} • {p.dist}</p>
                  </div>
                  <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-[#00c8aa] hover:text-white transition-all shadow-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Pickup Games */}
          <div className="bg-white rounded-3xl border border-[#e0ecf0] p-6 shadow-sm">
            <h3 className="text-base font-bold text-[#0d2d3a] mb-5 flex items-center gap-2">
               ⚡ Pickup Games
            </h3>
            <div className="flex flex-col gap-3">
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 flex items-center gap-3 hover:border-[#00c8aa]/30 transition-colors group cursor-pointer">
                <span className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">🏸</span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-[#0d2d3a]">Cầu lông Đôi Nam</p>
                  <p className="text-[0.7rem] font-bold text-[#00c8aa] uppercase mt-1">Trong 30 phút</p>
                </div>
                <button className="px-3 py-1.5 bg-[#0d2d3a] text-white text-xs font-bold rounded-lg shadow-md group-hover:bg-[#00c8aa] transition-colors">Tham gia</button>
              </div>
              
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 flex items-center gap-3 hover:border-[#00c8aa]/30 transition-colors group cursor-pointer">
                <span className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">🏓</span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-[#0d2d3a]">Pickleball Tự do</p>
                  <p className="text-[0.7rem] font-bold text-[#00c8aa] uppercase mt-1">Lúc 18:00</p>
                </div>
                <button className="px-3 py-1.5 bg-[#0d2d3a] text-white text-xs font-bold rounded-lg shadow-md group-hover:bg-[#00c8aa] transition-colors">Tham gia</button>
              </div>
            </div>
          </div>

        </div>

      </div>
      
      {/* Global styles for popup */}
      <style dangerouslySetInnerHTML={{__html: `
        .leaflet-popup-content-wrapper { padding: 0 !important; border-radius: 12px !important; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.15) !important; }
        .leaflet-popup-content { margin: 0 !important; width: auto !important; }
        .leaflet-popup-close-button { color: white !important; text-shadow: 0 1px 3px rgba(0,0,0,0.8); right: 8px !important; top: 8px !important; font-size: 16px !important; z-index: 10; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </MatchProLayout>
  )
}
