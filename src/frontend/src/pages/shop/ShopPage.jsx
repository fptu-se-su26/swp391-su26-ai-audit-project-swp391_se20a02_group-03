import { useState, useEffect, useMemo } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import ShopLayout from '../../layouts/ShopLayout'
import { equipmentApi } from '../../api/equipmentApi'

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80'

export default function ShopPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCat, setSelectedCat] = useState([])
  const [selectedSport, setSelectedSport] = useState([])
  const [priceRange, setPriceRange] = useState(0)
  const [sort, setSort] = useState('recommended')

  useEffect(() => {
    let active = true
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const res = await equipmentApi.getAll()
        if (!active) return
        if (res.statusCode === 200 && Array.isArray(res.data)) {
          setItems(res.data)
          const max = res.data.reduce((m, e) => Math.max(m, e.retailPrice || e.price || 0), 0)
          setPriceRange(Math.ceil(max) || 0)
        } else {
          setError(res.message || 'Không tải được sản phẩm.')
        }
      } catch (err) {
        if (active) setError(typeof err === 'string' ? err : 'Không tải được sản phẩm.')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [])

  const categories = useMemo(() => [...new Set(items.map(i => i.category).filter(Boolean))], [items])
  const sports = useMemo(() => [...new Set(items.map(i => i.type).filter(Boolean))], [items])
  const maxPrice = useMemo(() => items.reduce((m, e) => Math.max(m, e.retailPrice || e.price || 0), 0), [items])

  const toggle = (arr, setArr, val) => setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])

  const filtered = useMemo(() => {
    let list = items.filter(p => {
      const price = p.retailPrice || p.price || 0
      if (selectedCat.length && !selectedCat.includes(p.category)) return false
      if (selectedSport.length && !selectedSport.includes(p.type)) return false
      if (priceRange && price > priceRange) return false
      return true
    })
    if (sort === 'price-asc') list = [...list].sort((a, b) => (a.retailPrice || a.price) - (b.retailPrice || b.price))
    if (sort === 'price-desc') list = [...list].sort((a, b) => (b.retailPrice || b.price) - (a.retailPrice || a.price))
    return list
  }, [items, selectedCat, selectedSport, priceRange, sort])

  return (
    <ShopLayout showFlashBanner darkHeader>
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-96px)]">
        <aside className="w-full md:w-[200px] shrink-0 p-6 md:py-6 md:px-5 bg-[#0d1a24] border-b md:border-b-0 md:border-r border-white/6 flex flex-col gap-6">
          <div className="flex flex-col">
            <p className="text-[0.7rem] font-bold tracking-[0.12em] uppercase text-white/40 mb-3">DANH MỤC</p>
            {categories.length === 0 && <p className="text-xs text-white/30">—</p>}
            {categories.map(c => (
              <label key={c} className="flex items-center gap-2 cursor-pointer text-sm text-white/70 py-1 select-none">
                <input type="checkbox" className="hidden" checked={selectedCat.includes(c)} onChange={() => toggle(selectedCat, setSelectedCat, c)} />
                <span className={`w-4 h-4 border-[1.5px] border-white/25 rounded shrink-0 flex items-center justify-center ${selectedCat.includes(c) ? 'bg-[#14B8A6] border-[#14B8A6]' : ''}`}>
                  {selectedCat.includes(c) && <Check size={12} className="text-white" />}
                </span>
                <span>{c}</span>
              </label>
            ))}
          </div>

          <div className="flex flex-col">
            <p className="text-[0.7rem] font-bold tracking-[0.12em] uppercase text-white/40 mb-3">MÔN</p>
            <div className="flex flex-wrap gap-1.5">
              {sports.map(s => (
                <button key={s} onClick={() => toggle(selectedSport, setSelectedSport, s)} className={`px-2.5 py-1 rounded-full border-[1.5px] text-xs font-medium cursor-pointer transition-all ${selectedSport.includes(s) ? 'bg-[#14B8A6] border-[#14B8A6] text-white' : 'border-white/15 bg-transparent text-white/60 hover:border-[#14B8A6] hover:text-[#0fc8b5]'}`}>{s}</button>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <p className="text-[0.7rem] font-bold tracking-[0.12em] uppercase text-white/40 mb-3">GIÁ TỐI ĐA</p>
            <input type="range" min={0} max={maxPrice || 0} value={priceRange} onChange={e => setPriceRange(Number(e.target.value))} className="w-full accent-[#14B8A6] cursor-pointer" />
            <div className="flex justify-between text-[0.78rem] text-white/50 mt-1.5"><span>0₫</span><span>{Number(priceRange).toLocaleString('vi-VN')}₫</span></div>
          </div>
        </aside>

        <div className="flex-1 p-7 md:p-8 bg-[#0d1a24]">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="font-oswald text-2xl font-bold text-white">Cửa hàng thiết bị</h1>
              <p className="text-[0.82rem] text-white/45 mt-1">{loading ? 'Đang tải...' : `${filtered.length} sản phẩm`}</p>
            </div>
            <div className="flex items-center gap-2 text-[0.82rem] text-white/55">
              <span>Sắp xếp:</span>
              <select value={sort} onChange={e => setSort(e.target.value)} className="bg-white/6 border border-white/12 rounded-lg text-white px-2.5 py-1.5 text-[0.82rem] outline-none cursor-pointer">
                <option value="recommended">Đề xuất</option>
                <option value="price-asc">Giá: Thấp → Cao</option>
                <option value="price-desc">Giá: Cao → Thấp</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center text-white/50"><Loader2 className="inline animate-spin mr-2" size={20} /> Đang tải sản phẩm...</div>
          ) : error ? (
            <div className="py-20 text-center text-red-400">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center text-white/40">Không có sản phẩm phù hợp.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(p => {
                const price = p.retailPrice || p.price || 0
                const out = p.stockQuantity <= 0 || p.status !== 'Available'
                return (
                  <Link to={`/shop/product/${p.equipmentId}`} key={p.equipmentId} className="group bg-white/4 rounded-[14px] border border-white/8 overflow-hidden no-underline text-inherit transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:border-[#0fc8b5]/30">
                    <div className="relative h-[200px] overflow-hidden bg-white/5">
                      <img src={p.imageUrl || FALLBACK_IMG} alt={p.name} className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105" onError={e => { e.currentTarget.src = FALLBACK_IMG }} />
                      {out
                        ? <span className="absolute top-2.5 left-2.5 text-[0.65rem] font-bold tracking-wider px-2 py-0.5 rounded bg-slate-600 text-white">HẾT HÀNG</span>
                        : p.stockQuantity <= 5 && <span className="absolute top-2.5 left-2.5 text-[0.65rem] font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500 text-white">SẮP HẾT</span>}
                    </div>
                    <div className="p-3.5">
                      <p className="text-[0.68rem] font-bold tracking-widest uppercase text-white/35 mb-1">{p.category} • {p.type}</p>
                      <h3 className="text-sm font-bold text-white mb-2.5 line-clamp-2">{p.name}</h3>
                      <div className="flex items-center justify-between">
                        <p className="text-[0.95rem] font-bold text-[#0fc8b5]">{price.toLocaleString('vi-VN')}₫</p>
                        <span className="text-[0.72rem] text-white/40">Còn {p.stockQuantity}</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </ShopLayout>
  )
}
