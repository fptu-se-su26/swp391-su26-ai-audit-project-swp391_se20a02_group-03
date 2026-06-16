import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import MatchProLayout from '../../layouts/MatchProLayout'
import './MatchProNearbyPage.css'

const venues = [
  { id: 1, name: 'Pro-Sport Badminton Center', sport: 'Badminton', distance: '0.4 km', courts: 8, hours: '6am-11pm', rating: 4.8, icon: '🏸', active: 12 },
  { id: 2, name: 'Champions Badminton Hall', sport: 'Badminton', distance: '1.2 km', courts: 6, hours: '7am-10pm', rating: 4.9, icon: '🏸', active: 6 },
  { id: 3, name: 'Quận 7 Pickleball Club', sport: 'Pickleball', distance: '1.8 km', courts: 4, hours: '6am-10pm', rating: 4.7, icon: '🏓', active: 8 },
  { id: 4, name: 'Sài Gòn Pickleball Arena', sport: 'Pickleball', distance: '2.3 km', courts: 6, hours: '7am-11pm', rating: 4.6, icon: '🏓', active: 4 },
  { id: 5, name: 'Downtown Cầu lông Club', sport: 'Badminton', distance: '3.1 km', courts: 12, hours: '6am-10pm', rating: 4.5, icon: '🏸', active: 9 },
]

const nearbyPlayers = [
  { name: 'Marcus T.', sport: 'Badminton', dist: '0.5km', online: true, img: 'https://ui-avatars.com/api/?name=Marcus+T&background=00c8aa&color=fff' },
  { name: 'Elena R.', sport: 'Pickleball', dist: '1.1km', online: true, img: 'https://ui-avatars.com/api/?name=Elena+R&background=0d2d3a&color=fff' },
  { name: 'Jae K.', sport: 'Badminton', dist: '1.5km', online: false, img: 'https://ui-avatars.com/api/?name=Jae+K' },
  { name: 'Mia S.', sport: 'Badminton', dist: '2km', online: true, img: 'https://ui-avatars.com/api/?name=Mia+S&background=f0f7f6&color=00c8aa' },
  { name: 'Chris N.', sport: 'Pickleball', dist: '2.2km', online: false, img: 'https://ui-avatars.com/api/?name=Chris+N' }
]

const sportFilters = ['All', 'Badminton', 'Pickleball']
const distances = ['1km', '5km', '10km', '20km']

export default function MatchProNearbyPage() {
  const [distanceFilter, setDistanceFilter] = useState('5km')
  const [sportFilter, setSportFilter] = useState('All')
  const [selectedVenue, setSelectedVenue] = useState(null)
  const pageRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.fade-up', { opacity: 0, y: 30, stagger: 0.1, duration: 0.6, ease: 'power3.out' })
    }, pageRef)
    return () => ctx.revert()
  }, [sportFilter, distanceFilter])

  const filteredVenues = venues.filter(v => sportFilter === 'All' || v.sport === sportFilter)

  return (
    <MatchProLayout>
      <div className="grid grid-cols-[1fr_280px] max-lg:grid-cols-1 gap-6 items-start" ref={pageRef}>
        
        {/* Main Content */}
        <div className="flex flex-col min-w-0">
          <div className="mb-5 fade-up">
            <h1 className="font-['Oswald'] text-2xl font-bold text-[#0d2d3a] mb-1">📍 Nearby Sports</h1>
            <p className="text-sm text-slate-500">Find premium venues and active players around you.</p>
          </div>

          {/* Luxury Map Placeholder */}
          <div className="relative w-full h-[320px] rounded-2xl overflow-hidden shadow-sm mb-6 border border-[#e0ecf0] fade-up group cursor-pointer">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200')" }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d2d3a]/80 via-transparent to-[#0d2d3a]/20 pointer-events-none"></div>
            
            {/* Overlay Search */}
            <div className="absolute top-4 left-4 right-4 z-10 flex gap-2 max-sm:flex-col bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20">
              <input type="text" placeholder="Search premium venues..." className="flex-1 bg-white/90 px-4 py-2.5 rounded-lg text-sm outline-none text-[#0d2d3a] font-medium placeholder:text-slate-500 shadow-inner" />
              <select className="bg-white/90 px-4 py-2.5 rounded-lg text-sm outline-none text-[#0d2d3a] font-medium cursor-pointer" value={distanceFilter} onChange={e => setDistanceFilter(e.target.value)}>
                {distances.map(d => <option key={d} value={d}>Within {d}</option>)}
              </select>
              <button className="bg-[#00c8aa] hover:bg-[#009e87] text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-lg">Explore</button>
            </div>

            {/* Simulated Map Markers */}
            <div className="absolute top-[40%] left-[30%] -translate-x-1/2 -translate-y-full flex flex-col items-center animate-bounce">
              <div className="bg-white p-2 rounded-xl shadow-xl text-xl border-2 border-[#00c8aa]">🏸</div>
              <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#00c8aa]"></div>
            </div>
            
            <div className="absolute top-[60%] left-[65%] -translate-x-1/2 -translate-y-full flex flex-col items-center animate-bounce" style={{ animationDelay: '0.2s' }}>
              <div className="bg-white p-2 rounded-xl shadow-xl text-xl border-2 border-[#00c8aa]">🏓</div>
              <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#00c8aa]"></div>
            </div>

            <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full border-2 border-white shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              📍 You Are Here
            </div>
            
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-[#0d2d3a] text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm border border-white/50">
              Interactive Map Coming Soon
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap mb-6 fade-up">
            {sportFilters.map(f => (
              <button 
                key={f} 
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${sportFilter === f ? 'bg-[#00c8aa] text-white shadow-md' : 'bg-white text-slate-500 border border-[#e0ecf0] hover:border-[#00c8aa] hover:text-[#00c8aa]'}`}
                onClick={() => setSportFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          <h2 className="font-['Oswald'] text-xl font-bold text-[#0d2d3a] mb-4 fade-up">Premium Venues</h2>
          
          {/* Venues Grid */}
          <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4 mb-8">
            {filteredVenues.map(v => (
              <div key={v.id} className={`fade-up bg-white rounded-2xl border-[1.5px] p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 ${selectedVenue === v.id ? 'border-[#00c8aa] shadow-[0_8px_24px_rgba(0,200,170,0.15)] ring-2 ring-[#00c8aa]/20' : 'border-[#e0ecf0] hover:border-[#00c8aa]/50 hover:shadow-lg'}`} onClick={() => setSelectedVenue(v.id)}>
                <div className="flex items-start gap-3.5 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-2xl shrink-0 shadow-sm border border-slate-100">
                    {v.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0d2d3a] leading-tight">{v.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{v.sport} • <span className="font-semibold text-[#00c8aa]">{v.distance}</span></p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2.5 py-1 bg-slate-50 text-slate-600 text-xs font-semibold rounded-md border border-slate-100">🎾 {v.courts} Courts</span>
                  <span className="px-2.5 py-1 bg-slate-50 text-slate-600 text-xs font-semibold rounded-md border border-slate-100">🕒 {v.hours}</span>
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-md border border-amber-100">⭐ {v.rating}</span>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-xs font-semibold text-red-500 flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    {v.active} active players
                  </span>
                  <button className="text-xs font-bold text-[#00c8aa] bg-[#00c8aa]/10 hover:bg-[#00c8aa] hover:text-white px-3 py-1.5 rounded-lg transition-colors">Book Now</button>
                </div>
              </div>
            ))}
          </div>
          
          {filteredVenues.length === 0 && (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300 fade-up">
              <span className="text-4xl opacity-50 mb-2 block">🗺️</span>
              <p className="text-slate-500 font-medium">No venues found for {sportFilter} within {distanceFilter}.</p>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="flex flex-col gap-5 shrink-0 fade-up">
          {/* Active Players Card */}
          <div className="bg-white rounded-2xl border border-[#e0ecf0] p-5 shadow-sm">
            <h3 className="text-[0.95rem] font-bold text-[#0d2d3a] mb-4">Live Players Nearby</h3>
            <div className="flex flex-col gap-1">
              {nearbyPlayers.map(p => (
                <div key={p.name} className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0 group cursor-pointer">
                  <div className="relative shrink-0">
                    <img src={p.img} alt={p.name} className="w-10 h-10 rounded-full object-cover shadow-sm group-hover:ring-2 ring-[#00c8aa] transition-all" />
                    {p.online && <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow-sm" />}
                  </div>
                  <div className="flex flex-col flex-1">
                    <p className="text-[0.85rem] font-bold text-[#0d2d3a] group-hover:text-[#00c8aa] transition-colors">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.sport} • {p.dist}</p>
                  </div>
                  <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-[#00c8aa] hover:text-white transition-all shadow-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Match / Pickup Games Card */}
          <div className="bg-white rounded-2xl border border-[#e0ecf0] p-5 shadow-sm">
            <h3 className="text-[0.95rem] font-bold text-[#0d2d3a] mb-4">Pickup Games (Starting Soon)</h3>
            <div className="flex flex-col gap-3">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center gap-3 hover:border-[#00c8aa]/30 transition-colors">
                <span className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-xl shrink-0">🏸</span>
                <div className="flex-1">
                  <p className="text-[0.85rem] font-bold text-[#0d2d3a]">Men's Doubles</p>
                  <p className="text-xs text-slate-500 mt-0.5">Pro-Sport Center • In 30 mins</p>
                </div>
                <button className="px-3 py-1.5 bg-[#00c8aa] text-white text-xs font-bold rounded-lg shadow-md hover:-translate-y-0.5 transition-all">Join</button>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center gap-3 hover:border-[#00c8aa]/30 transition-colors">
                <span className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-xl shrink-0">🏓</span>
                <div className="flex-1">
                  <p className="text-[0.85rem] font-bold text-[#0d2d3a]">Pickleball Open</p>
                  <p className="text-xs text-slate-500 mt-0.5">Q7 Club • 6:00 PM</p>
                </div>
                <button className="px-3 py-1.5 bg-[#00c8aa] text-white text-xs font-bold rounded-lg shadow-md hover:-translate-y-0.5 transition-all">Join</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </MatchProLayout>
  )
}
