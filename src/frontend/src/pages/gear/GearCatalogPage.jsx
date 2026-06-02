import { useState } from 'react'
import { Link } from 'react-router-dom'
import GearLayout from '../../layouts/GearLayout'

const products = [
  { id: 1,  name: 'Wilson Pro Staff RF97',      sport: 'Badminton',  itemType: 'Racket',      badge: 'NEW',     price: 15, priceLabel: '$15/hr',  deposit: '$50', img: 'https://images.unsplash.com/photo-1617083934551-1af7da84de49?w=400&q=80', type: 'rental' },
  { id: 2,  name: 'Babolat Technical Viper',    sport: 'Pickleball', itemType: 'Racket',      badge: 'PREMIUM', price: 18, priceLabel: '$18/hr',  deposit: '$60', img: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80', type: 'rental' },
  { id: 3,  name: 'Yonex Astrox 100 ZZ',       sport: 'Badminton',  itemType: 'Racket',      badge: 'PREMIUM', price: 20, priceLabel: '$20/hr',  deposit: '$80', img: 'https://images.unsplash.com/photo-1617083934551-1af7da84de49?w=400&q=80', type: 'rental' },
  { id: 4,  name: 'Pickleball Paddle Pro Set',  sport: 'Pickleball', itemType: 'Racket',      badge: 'NEW',     price: 20, priceLabel: '$20/hr',  deposit: '$70', img: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80', type: 'rental' },
  { id: 5,  name: 'Mavis 350 Shuttlecock',      sport: 'Badminton',  itemType: 'Ball / Birdie', badge: 'DEMO',  price: 5,  priceLabel: '$5/tube', deposit: null,  img: 'https://images.unsplash.com/photo-1612452040814-e42b8f2da8ea?w=400&q=80', type: 'purchase', stock: 'Available' },
  { id: 6,  name: 'Pickleball Ball Set (6)',     sport: 'Pickleball', itemType: 'Ball / Birdie', badge: null,   price: 4,  priceLabel: '$4/set',  deposit: null,  img: 'https://images.unsplash.com/photo-1612452040814-e42b8f2da8ea?w=400&q=80', type: 'purchase', stock: 'Available' },
  { id: 7,  name: 'Nike Court Lite 3',          sport: 'Badminton',  itemType: 'Footwear',    badge: 'NEW',     price: 10, priceLabel: '$10/hr',  deposit: '$40', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80', type: 'rental' },
  { id: 8,  name: 'K-Swiss Express Light',       sport: 'Pickleball', itemType: 'Footwear',    badge: 'PREMIUM', price: 12, priceLabel: '$12/hr',  deposit: '$45', img: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&q=80', type: 'rental' },
  { id: 9,  name: 'Dry-Fit Badminton Polo',     sport: 'Badminton',  itemType: 'Apparel',     badge: 'NEW',     price: 5,  priceLabel: '$5/hr',   deposit: '$15', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80', type: 'rental' },
  { id: 10, name: 'Pickleball Sport Shorts',    sport: 'Pickleball', itemType: 'Apparel',     badge: null,      price: 4,  priceLabel: '$4/hr',   deposit: '$10', img: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&q=80', type: 'rental' },
  { id: 11, name: 'Elbow Support Sleeve',        sport: 'Badminton',  itemType: 'Protection',  badge: 'NEW',     price: 3,  priceLabel: '$3/hr',   deposit: '$10', img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80', type: 'rental' },
  { id: 12, name: 'Wrist Guard Pro',             sport: 'Pickleball', itemType: 'Protection',  badge: null,      price: 3,  priceLabel: '$3/hr',   deposit: '$10', img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80', type: 'rental' },
  { id: 13, name: 'Racket Bag Yonex',            sport: 'Badminton',  itemType: 'Accessories', badge: null,      price: 5,  priceLabel: '$5/hr',   deposit: '$20', img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80', type: 'rental' },
  { id: 14, name: 'Pickleball Carry Bag',        sport: 'Pickleball', itemType: 'Accessories', badge: 'NEW',     price: 4,  priceLabel: '$4/hr',   deposit: '$15', img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80', type: 'rental' },
]

const itemTypeIcons = {
  'Racket':       '🏸',
  'Footwear':     '👟',
  'Apparel':      '👕',
  'Ball / Birdie':'🎾',
  'Accessories':  '🎒',
  'Protection':   '🦺',
}

const sports    = ['Badminton', 'Pickleball']
const itemTypes = ['Racket', 'Footwear', 'Apparel', 'Ball / Birdie', 'Accessories', 'Protection']
const conditions = ['Premium', 'New', 'Demo']

const badgeStyles = {
  new:     'bg-green-500 text-white',
  premium: 'bg-amber-500 text-white',
  demo:    'bg-indigo-500 text-white',
}

const DEFAULT_SPORTS    = sports
const DEFAULT_ITEMS     = itemTypes
const DEFAULT_CONDS     = []
const DEFAULT_PRICE_MIN = ''
const DEFAULT_PRICE_MAX = ''

export default function GearCatalogPage() {
  const [selectedSports,  setSelectedSports]  = useState(DEFAULT_SPORTS)
  const [selectedItems,   setSelectedItems]   = useState(DEFAULT_ITEMS)
  const [selectedConds,   setSelectedConds]   = useState(DEFAULT_CONDS)
  const [priceMin,        setPriceMin]        = useState(DEFAULT_PRICE_MIN)
  const [priceMax,        setPriceMax]        = useState(DEFAULT_PRICE_MAX)
  const [viewMode,        setViewMode]        = useState('grid') // 'grid' | 'list'
  const [sort,            setSort]            = useState('recommended')
  const [applied,         setApplied]         = useState({ sports: DEFAULT_SPORTS, items: DEFAULT_ITEMS, conds: DEFAULT_CONDS, min: '', max: '' })

  const toggle = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])

  const handleReset = () => {
    setSelectedSports(DEFAULT_SPORTS)
    setSelectedItems(DEFAULT_ITEMS)
    setSelectedConds(DEFAULT_CONDS)
    setPriceMin(DEFAULT_PRICE_MIN)
    setPriceMax(DEFAULT_PRICE_MAX)
    setApplied({ sports: DEFAULT_SPORTS, items: DEFAULT_ITEMS, conds: DEFAULT_CONDS, min: '', max: '' })
  }

  const handleApply = () => {
    setApplied({ sports: selectedSports, items: selectedItems, conds: selectedConds, min: priceMin, max: priceMax })
  }

  // Count active filters
  const activeFilterCount =
    (applied.sports.length < sports.length ? 1 : 0) +
    (applied.items.length  < itemTypes.length ? 1 : 0) +
    (applied.conds.length  > 0 ? 1 : 0) +
    (applied.min || applied.max ? 1 : 0)

  // Filter + sort
  let filtered = products.filter(p => {
    const matchSport = applied.sports.includes(p.sport)
    const matchItem  = applied.items.includes(p.itemType)
    const matchCond  = applied.conds.length === 0 || (p.badge && applied.conds.map(c => c.toUpperCase()).includes(p.badge))
    const matchMin   = applied.min === '' || p.price >= Number(applied.min)
    const matchMax   = applied.max === '' || p.price <= Number(applied.max)
    return matchSport && matchItem && matchCond && matchMin && matchMax
  })

  if (sort === 'price-asc')  filtered = [...filtered].sort((a,b) => a.price - b.price)
  if (sort === 'price-desc') filtered = [...filtered].sort((a,b) => b.price - a.price)
  if (sort === 'newest')     filtered = [...filtered].sort((a,b) => b.id - a.id)

  return (
    <GearLayout>
      <div className="flex gap-0 min-h-[calc(100vh-56px-80px)] max-[700px]:flex-col">

        {/* ── Sidebar ─────────────────────────────────────────────── */}
        <aside className="w-[240px] max-[700px]:w-full shrink-0 px-5 py-6 bg-white border-r border-[#e0ecf0] max-[700px]:border-r-0 max-[700px]:border-b">

          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#0d2d3a]">Filters</h3>
              {activeFilterCount > 0 && (
                <span className="bg-[#0d8a8a] text-white text-[0.65rem] font-bold rounded-full w-4 h-4 flex items-center justify-center">{activeFilterCount}</span>
              )}
            </div>
            <button onClick={handleReset} className="text-[0.8rem] text-[#0d8a8a] bg-transparent border-none cursor-pointer font-['Inter'] hover:underline">Reset all</button>
          </div>

          {/* ── ITEM TYPE ──────────────────────────────── */}
          <div className="mb-5 pb-5 border-b border-[#f0f4f8]">
            <p className="text-[0.7rem] font-bold tracking-[0.1em] uppercase text-slate-400 mb-3">Item Type</p>
            <div className="flex flex-col gap-1">
              {itemTypes.map(it => (
                <label key={it} className="flex items-center gap-2.5 cursor-pointer py-[4px] select-none group" htmlFor={`item-${it}`}>
                  <input type="checkbox" id={`item-${it}`} checked={selectedItems.includes(it)} onChange={() => toggle(selectedItems, setSelectedItems, it)} className="hidden" />
                  <span className={`w-4 h-4 border-[1.5px] rounded shrink-0 transition-all flex items-center justify-center text-[0.65rem] font-bold ${selectedItems.includes(it) ? 'bg-[#0d8a8a] border-[#0d8a8a] text-white' : 'border-[#e0ecf0] group-hover:border-[#0d8a8a]'}`}>
                    {selectedItems.includes(it) && '✓'}
                  </span>
                  <span className="text-[0.85rem] text-[#0d2d3a] flex-1">{itemTypeIcons[it]} {it}</span>
                  <span className="text-[0.68rem] text-slate-400 ml-auto">
                    {products.filter(p => p.itemType === it).length}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* ── SPORT ─────────────────────────────────── */}
          <div className="mb-5 pb-5 border-b border-[#f0f4f8]">
            <p className="text-[0.7rem] font-bold tracking-[0.1em] uppercase text-slate-400 mb-3">Sport</p>
            <div className="flex flex-col gap-1">
              {sports.map(s => (
                <label key={s} className="flex items-center gap-2.5 cursor-pointer py-[4px] select-none group" htmlFor={`sport-${s}`}>
                  <input type="checkbox" id={`sport-${s}`} checked={selectedSports.includes(s)} onChange={() => toggle(selectedSports, setSelectedSports, s)} className="hidden" />
                  <span className={`w-4 h-4 border-[1.5px] rounded shrink-0 transition-all flex items-center justify-center text-[0.65rem] font-bold ${selectedSports.includes(s) ? 'bg-[#0d8a8a] border-[#0d8a8a] text-white' : 'border-[#e0ecf0] group-hover:border-[#0d8a8a]'}`}>
                    {selectedSports.includes(s) && '✓'}
                  </span>
                  <span className="text-[0.85rem] text-[#0d2d3a] flex-1">{s}</span>
                  <span className="text-[0.68rem] text-slate-400 ml-auto">
                    {products.filter(p => p.sport === s).length}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* ── CONDITION ─────────────────────────────── */}
          <div className="mb-5 pb-5 border-b border-[#f0f4f8]">
            <p className="text-[0.7rem] font-bold tracking-[0.1em] uppercase text-slate-400 mb-3">Condition</p>
            <div className="flex flex-wrap gap-1.5">
              {conditions.map(c => (
                <button key={c}
                  className={`px-3 py-[5px] rounded-full border-[1.5px] text-[0.78rem] font-medium cursor-pointer font-['Inter'] transition-all hover:border-[#0d8a8a] hover:text-[#0d8a8a] ${selectedConds.includes(c) ? 'bg-[#0d8a8a] border-[#0d8a8a] text-white' : 'bg-white border-[#e0ecf0] text-slate-500'}`}
                  onClick={() => toggle(selectedConds, setSelectedConds, c)}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* ── PRICE ─────────────────────────────────── */}
          <div className="mb-5 pb-5 border-b border-[#f0f4f8]">
            <p className="text-[0.7rem] font-bold tracking-[0.1em] uppercase text-slate-400 mb-3">Rental Price ($/hr)</p>
            <div className="flex items-center gap-2">
              <div className="flex items-center border-[1.5px] border-[#e0ecf0] rounded-lg px-2.5 py-1.5 gap-1 text-[0.82rem] text-slate-500 flex-1 focus-within:border-[#0d8a8a] transition-colors">
                <span>$</span>
                <input type="number" placeholder="Min" id="price-min" value={priceMin} onChange={e => setPriceMin(e.target.value)}
                  className="w-full border-none outline-none font-['Inter'] text-[0.82rem] bg-transparent" />
              </div>
              <span className="text-slate-300">—</span>
              <div className="flex items-center border-[1.5px] border-[#e0ecf0] rounded-lg px-2.5 py-1.5 gap-1 text-[0.82rem] text-slate-500 flex-1 focus-within:border-[#0d8a8a] transition-colors">
                <span>$</span>
                <input type="number" placeholder="Max" id="price-max" value={priceMax} onChange={e => setPriceMax(e.target.value)}
                  className="w-full border-none outline-none font-['Inter'] text-[0.82rem] bg-transparent" />
              </div>
            </div>
          </div>

          <button onClick={handleApply} className="btn-primary w-full justify-center mt-1">
            Apply Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
        </aside>

        {/* ── Main Content ──────────────────────────────────────────── */}
        <div className="flex-1 px-7 py-6">

          {/* Title + Controls */}
          <div className="mb-5">
            <h1 className="font-['Oswald'] text-2xl font-bold text-[#0d2d3a] mb-3">Catalog</h1>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[0.82rem] text-slate-500 flex-1">
                Showing <strong>{filtered.length}</strong> items
              </span>
              <div className="flex gap-1">
                <button onClick={() => setViewMode('grid')}
                  className={`w-8 h-8 rounded-lg border-[1.5px] cursor-pointer flex items-center justify-center transition-all ${viewMode === 'grid' ? 'border-[#0d8a8a] bg-[#0d8a8a] text-white' : 'border-[#e0ecf0] bg-white text-slate-400 hover:border-[#0d8a8a] hover:text-[#0d8a8a]'}`}
                  aria-label="Grid view">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="8" height="8"/><rect x="13" y="3" width="8" height="8"/><rect x="3" y="13" width="8" height="8"/><rect x="13" y="13" width="8" height="8"/></svg>
                </button>
                <button onClick={() => setViewMode('list')}
                  className={`w-8 h-8 rounded-lg border-[1.5px] cursor-pointer flex items-center justify-center transition-all ${viewMode === 'list' ? 'border-[#0d8a8a] bg-[#0d8a8a] text-white' : 'border-[#e0ecf0] bg-white text-slate-400 hover:border-[#0d8a8a] hover:text-[#0d8a8a]'}`}
                  aria-label="List view">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                </button>
              </div>
              <select value={sort} onChange={e => setSort(e.target.value)}
                className="py-[7px] px-3 border-[1.5px] border-[#e0ecf0] rounded-lg font-['Inter'] text-[0.82rem] text-[#0d2d3a] outline-none cursor-pointer hover:border-[#0d8a8a] transition-colors" id="gear-sort">
                <option value="recommended">Sort: Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          {/* Active filter tags */}
          {(applied.sports.length < sports.length || applied.items.length < itemTypes.length || applied.conds.length > 0 || applied.min || applied.max) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {applied.items.length < itemTypes.length && applied.items.map(it => (
                <span key={it} className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0d8a8a]/10 text-[#0d8a8a] rounded-full text-[0.75rem] font-medium">
                  {itemTypeIcons[it]} {it}
                  <button onClick={() => { const n = applied.items.filter(x => x !== it); setSelectedItems(n); setApplied(a => ({...a, items: n})) }} className="text-[#0d8a8a] hover:text-red-500 bg-transparent border-none cursor-pointer text-xs leading-none">✕</button>
                </span>
              ))}
              {applied.conds.map(c => (
                <span key={c} className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-[0.75rem] font-medium">
                  {c}
                  <button onClick={() => { const n = applied.conds.filter(x => x !== c); setSelectedConds(n); setApplied(a => ({...a, conds: n})) }} className="text-amber-600 hover:text-red-500 bg-transparent border-none cursor-pointer text-xs">✕</button>
                </span>
              ))}
              {(applied.min || applied.max) && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[0.75rem] font-medium">
                  ${applied.min || '0'} – ${applied.max || '∞'}
                  <button onClick={() => { setPriceMin(''); setPriceMax(''); setApplied(a => ({...a, min: '', max: ''})) }} className="text-indigo-600 hover:text-red-500 bg-transparent border-none cursor-pointer text-xs">✕</button>
                </span>
              )}
            </div>
          )}

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="py-20 text-center text-slate-400 bg-white rounded-2xl border border-[#e0ecf0]">
              <p className="text-3xl mb-3">🔍</p>
              <p className="font-semibold text-[#0d2d3a] mb-1">No items found</p>
              <p className="text-sm">Try adjusting your filters or <button onClick={handleReset} className="text-[#0d8a8a] bg-transparent border-none cursor-pointer font-semibold hover:underline">Reset all</button></p>
            </div>
          )}

          {/* Grid view */}
          {viewMode === 'grid' && filtered.length > 0 && (
            <div className="grid grid-cols-3 max-[1100px]:grid-cols-2 max-[700px]:grid-cols-1 gap-5 mb-7">
              {filtered.map(p => (
                <Link to={`/gear/catalog/${p.id}`} key={p.id} className="bg-white rounded-[14px] border-[1.5px] border-[#e0ecf0] overflow-hidden no-underline text-inherit transition-all flex flex-col hover:shadow-[0_6px_20px_rgba(0,0,0,0.09)] hover:-translate-y-[3px] group">
                  <div className="relative h-[180px] overflow-hidden">
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-[1.04]" />
                    {p.badge && <span className={`absolute top-2.5 right-2.5 text-[0.68rem] font-bold tracking-[0.06em] px-2 py-[3px] rounded-full ${badgeStyles[p.badge.toLowerCase()] || ''}`}>{p.badge}</span>}
                    <button className="absolute top-2 left-2.5 w-7 h-7 rounded-full bg-white/90 border-none cursor-pointer text-base flex items-center justify-center text-slate-400 transition-colors hover:text-red-500" aria-label="Wishlist">♡</button>
                  </div>
                  <div className="p-3.5 flex-1 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <p className="text-[0.68rem] font-bold tracking-[0.1em] uppercase text-slate-400">{p.sport}</p>
                      <span className="text-[0.72rem] bg-[#f0f9f9] text-[#0d8a8a] rounded-full px-2 py-[2px] font-medium">{itemTypeIcons[p.itemType]} {p.itemType}</span>
                    </div>
                    <h3 className="text-[0.95rem] font-bold text-[#0d2d3a] leading-snug">{p.name}</h3>
                    <div className="flex gap-4 items-end">
                      <div>
                        <p className="text-[0.68rem] text-slate-400">{p.type === 'rental' ? 'Rental Rate' : 'Purchase'}</p>
                        <p className="text-[0.95rem] font-bold text-[#0d8a8a]">{p.priceLabel}</p>
                      </div>
                      {p.deposit && <div><p className="text-[0.68rem] text-slate-400">Deposit</p><p className="text-[0.82rem] text-slate-500 font-medium">{p.deposit}</p></div>}
                      {p.stock && <span className="text-[0.72rem] bg-green-500/10 text-green-500 rounded-full px-2 py-[3px] font-semibold">{p.stock}</span>}
                    </div>
                    <button className="btn-primary w-full justify-center py-2.5 text-[0.85rem] mt-auto">
                      {p.type === 'rental' ? 'Add to Rental' : 'Add to Cart'}
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* List view */}
          {viewMode === 'list' && filtered.length > 0 && (
            <div className="flex flex-col gap-3 mb-7">
              {filtered.map(p => (
                <Link to={`/gear/catalog/${p.id}`} key={p.id} className="bg-white rounded-xl border-[1.5px] border-[#e0ecf0] overflow-hidden no-underline text-inherit transition-all flex hover:shadow-md hover:-translate-y-[2px] group">
                  <img src={p.img} alt={p.name} className="w-28 h-28 object-cover shrink-0" />
                  <div className="p-4 flex-1 flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[0.68rem] font-bold text-slate-400 uppercase">{p.sport}</span>
                        <span className="text-[0.72rem] bg-[#f0f9f9] text-[#0d8a8a] rounded-full px-2 py-[1px] font-medium">{itemTypeIcons[p.itemType]} {p.itemType}</span>
                        {p.badge && <span className={`text-[0.65rem] font-bold px-2 py-[2px] rounded-full ${badgeStyles[p.badge.toLowerCase()]}`}>{p.badge}</span>}
                      </div>
                      <h3 className="text-[0.95rem] font-bold text-[#0d2d3a]">{p.name}</h3>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[0.68rem] text-slate-400 mb-0.5">{p.type === 'rental' ? 'Rental Rate' : 'Purchase'}</p>
                      <p className="text-lg font-bold text-[#0d8a8a]">{p.priceLabel}</p>
                      {p.deposit && <p className="text-[0.72rem] text-slate-400">Deposit: {p.deposit}</p>}
                    </div>
                    <button className="btn-primary text-[0.85rem] py-2 px-4 shrink-0">
                      {p.type === 'rental' ? 'Rent' : 'Buy'}
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {filtered.length > 0 && (
            <div className="flex items-center gap-1.5 justify-center">
              <button className="w-[34px] h-[34px] rounded-lg border-[1.5px] border-[#e0ecf0] bg-white text-sm text-slate-500 cursor-pointer font-['Inter'] transition-all hover:border-[#0d8a8a] hover:text-[#0d8a8a]">‹</button>
              {[1, 2, 3].map(pg => (
                <button key={pg} className={`w-[34px] h-[34px] rounded-lg border-[1.5px] text-sm cursor-pointer font-['Inter'] transition-all ${pg === 1 ? 'bg-[#0d8a8a] border-[#0d8a8a] text-white' : 'border-[#e0ecf0] bg-white text-slate-500 hover:border-[#0d8a8a] hover:text-[#0d8a8a]'}`}>{pg}</button>
              ))}
              <span className="text-slate-300">...</span>
              <button className="w-[34px] h-[34px] rounded-lg border-[1.5px] border-[#e0ecf0] bg-white text-sm text-slate-500 cursor-pointer font-['Inter'] transition-all hover:border-[#0d8a8a] hover:text-[#0d8a8a]">›</button>
            </div>
          )}
        </div>
      </div>
    </GearLayout>
  )
}
