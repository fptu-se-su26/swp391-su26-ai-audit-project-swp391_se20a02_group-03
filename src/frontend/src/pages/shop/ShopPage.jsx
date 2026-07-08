import { useState, useEffect, useMemo } from 'react'
import { Plus, Frown, CheckSquare, Square } from 'lucide-react'
import { Link } from 'react-router-dom'
import ShopLayout from '../../layouts/ShopLayout'
import { equipmentApi } from '../../api/equipmentApi'
import PageLoader from '../../components/ui/PageLoader'
import EmptyState from '../../components/ui/EmptyState'

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

  function handleReset() {
    setSelectedCat([])
    setSelectedSport([])
    setPriceRange(maxPrice || 0)
  }

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
    <ShopLayout showFlashBanner>
      <div className="font-sans max-w-[1400px] mx-auto px-5 md:px-10 py-10">

        {/* HEADER */}
        <div className="mb-10 max-w-2xl mx-auto text-center">
          <p className="label-mono text-foreground-muted mb-4">{'// Cửa hàng thiết bị'}</p>
          <h1 className="font-heading text-4xl md:text-5xl uppercase tracking-tight text-foreground mb-4">Cửa hàng thiết bị</h1>
          <p className="text-[15px] text-foreground-muted">Trang bị đồ chơi thể thao chính hãng cho mọi bộ môn.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10 items-start">

          {/* SIDEBAR FILTERS */}
          <aside className="card-base sticky top-24 lg:top-28">
            <h3 className="label-mono text-foreground mb-6">Bộ lọc</h3>

            <div className="mb-7">
              <h4 className="font-sans font-extrabold text-[13px] uppercase text-foreground mb-3">Danh mục</h4>
              <div className="flex flex-col gap-2">
                {categories.length === 0 && <p className="text-xs text-foreground-muted">Không có danh mục.</p>}
                {categories.map(c => (
                  <button
                    key={c}
                    onClick={() => toggle(selectedCat, setSelectedCat, c)}
                    className="flex items-center gap-2.5 text-left font-medium text-sm text-foreground hover:text-accent transition-colors py-1"
                  >
                    {selectedCat.includes(c) ? <CheckSquare className="w-4 h-4 text-accent" /> : <Square className="w-4 h-4 text-foreground-muted" />}
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-7">
              <h4 className="font-sans font-extrabold text-[13px] uppercase text-foreground mb-3">Môn thi đấu</h4>
              <div className="flex flex-wrap gap-2">
                {sports.map(s => (
                  <button
                    key={s}
                    onClick={() => toggle(selectedSport, setSelectedSport, s)}
                    className={`px-3 h-8 text-xs font-extrabold uppercase tracking-[0.04em] rounded-[2px] border-2 transition-colors ${selectedSport.includes(s) ? 'bg-ink text-paper border-ink' : 'bg-transparent text-foreground border-border-hover hover:border-foreground'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-7">
              <h4 className="font-sans font-extrabold text-[13px] uppercase text-foreground mb-3">Giá tối đa</h4>
              <input
                type="range"
                min={0}
                max={maxPrice || 0}
                value={priceRange}
                onChange={e => setPriceRange(Number(e.target.value))}
                className="w-full accent-accent cursor-pointer"
              />
              <div className="flex justify-between label-mono text-foreground-muted mt-2">
                <span>0đ</span>
                <span>{Number(priceRange).toLocaleString('vi-VN')}đ</span>
              </div>
            </div>

            <button onClick={handleReset} className="btn-outline w-full">
              Đặt lại bộ lọc
            </button>
          </aside>

          {/* MAIN PRODUCT GRID */}
          <div className="flex flex-col gap-6">

            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b-2 border-border-strong pb-4">
              <div className="text-sm font-semibold text-foreground">
                {loading ? 'Đang tải...' : (<>Hiển thị <strong>{filtered.length}</strong> sản phẩm</>)}
              </div>

              <div className="flex items-center gap-3">
                <span className="label-mono text-foreground-muted">Sắp xếp</span>
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  className="bg-transparent border-none text-sm font-semibold text-foreground outline-none cursor-pointer hover:text-accent transition-colors"
                >
                  <option value="recommended" className="bg-surface text-foreground">Đề xuất</option>
                  <option value="price-asc" className="bg-surface text-foreground">Giá: thấp → cao</option>
                  <option value="price-desc" className="bg-surface text-foreground">Giá: cao → thấp</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <PageLoader message="Đang tải sản phẩm..." />
            ) : error ? (
              <div className="card-base p-16 text-center">
                <p className="text-danger font-medium">{error}</p>
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={<Frown className="w-7 h-7" />}
                title="Không có sản phẩm phù hợp"
                subtitle="Thử điều chỉnh bộ lọc để xem thêm kết quả."
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map(p => {
                  const price = p.retailPrice || p.price || 0
                  const out = p.stockQuantity <= 0 || p.status !== 'Available'
                  return (
                    <Link to={`/shop/product/${p.equipmentId}`} key={p.equipmentId} className="border-2 border-border-strong bg-surface rounded-[2px] flex flex-col overflow-hidden group">
                      {/* Image Area */}
                      <div className="relative aspect-square border-b-2 border-border-strong overflow-hidden bg-background-base">
                        {out ? (
                          <span className="absolute top-3 left-3 label-mono bg-foreground-muted text-paper px-2.5 py-1 z-10">Hết hàng</span>
                        ) : p.stockQuantity <= 5 && (
                          <span className="absolute top-3 left-3 label-mono bg-warning-bg text-warning border border-warning px-2.5 py-1 z-10">Sắp hết</span>
                        )}
                        <img
                          src={p.imageUrl || FALLBACK_IMG}
                          alt={p.name}
                          className="w-full h-full object-cover"
                          onError={e => { e.currentTarget.src = FALLBACK_IMG }}
                        />
                      </div>

                      {/* Info Area */}
                      <div className="p-5 flex-1 flex flex-col">
                        <p className="label-mono text-foreground-muted mb-2">{p.category} · {p.type}</p>
                        <h3 className="font-sans font-extrabold text-[15px] text-foreground mb-4 flex-1">{p.name}</h3>

                        <div className="flex items-center justify-between">
                          <span className="font-heading text-lg text-foreground">{price.toLocaleString('vi-VN')}đ</span>
                          <span className="label-mono text-foreground-muted">Còn {p.stockQuantity}</span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </ShopLayout>
  )
}
