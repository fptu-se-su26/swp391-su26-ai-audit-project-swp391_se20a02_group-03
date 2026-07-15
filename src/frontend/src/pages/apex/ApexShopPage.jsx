import { useState, useEffect, useRef, useMemo } from 'react'
import { gsap } from 'gsap'
import ApexLayout from '../../layouts/ApexLayout'
import { equipmentApi } from '../../api/equipmentApi'
import PageLoader from '../../components/ui/PageLoader'
import EmptyState from '../../components/ui/EmptyState'
import { useToast } from '../../components/Toast'
import { ShoppingCart, X, Frown, RotateCcw, Package } from 'lucide-react'

// Fallback: clean white-bg studio product shot
const FALLBACK_IMG = 'https://images.unsplash.com/photo-1617634974415-8e0c61e4a23b?w=600&q=80'

// Category-specific studio fallback images (isolated products on clean bg)
const CATEGORY_FALLBACKS = {
  Racket: 'https://images.unsplash.com/photo-1617634974415-8e0c61e4a23b?w=600&q=80',
  Footwear: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
  Apparel: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80',
  'Ball / Birdie': 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=600&q=80',
  Accessories: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=600&q=80',
}

const categories = [
  { key: 'All', label: 'Tất cả' },
  { key: 'Racket', label: 'Vợt' },
  { key: 'Footwear', label: 'Giày' },
  { key: 'Apparel', label: 'Trang phục' },
  { key: 'Ball / Birdie', label: 'Cầu / Bóng' },
  { key: 'Accessories', label: 'Phụ kiện' },
]

const categoryLabels = Object.fromEntries(categories.map(c => [c.key, c.label]))

const SPORT_FILTERS = ['Tất cả môn', 'Cầu lông', 'Pickleball']
const STATUS_FILTERS = ['Tất cả', 'Premium', 'New', 'Trial']
const statusDisplay = { Premium: 'Cao cấp', New: 'Mới', Trial: 'Dùng thử' }

export default function ApexShopPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [category, setCategory] = useState('All')
  const [sportFilter, setSportFilter] = useState('Tất cả môn')
  const [statusFilter, setStatusFilter] = useState('Tất cả')
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const { addToast } = useToast()
  const pageRef = useRef(null)

  useEffect(() => {
    let active = true
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const res = await equipmentApi.getAll()
        if (!active) return
        if (res.statusCode === 200 && Array.isArray(res.data)) {
          setProducts(res.data.map(e => ({
            id: e.equipmentId,
            name: e.name,
            category: e.category,
            sport: e.type || e.sportType || 'Multi',
            price: e.retailPrice || e.price,
            stock: e.stockQuantity,
            img: e.imageUrl || CATEGORY_FALLBACKS[e.category] || FALLBACK_IMG,
            status: e.status,
            description: e.description || 'Chưa có thông tin mô tả chi tiết cho sản phẩm này.',
          })))
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

 feat/DE190130_Hoan_Thien_Frontend


  const filtered = useMemo(() => products.filter(p => {
    const catOk = category === 'All' || p.category === category
    const sportOk = sportFilter === 'Tất cả môn' || p.sport === sportFilter
    const statusOk = statusFilter === 'Tất cả' || p.status === statusFilter
    return catOk && sportOk && statusOk && p.status !== 'Discontinued'
  }), [products, category, sportFilter, statusFilter])

  function addToCart(product, qty = 1) {

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.shop-hero', { opacity: 0, y: 24, duration: 0.6, ease: 'power3.out' })
      gsap.from('.product-card', { opacity: 0, y: 40, stagger: 0.07, duration: 0.5, ease: 'power2.out', delay: 0.2 })
    }, pageRef)
    return () => ctx.revert()
  }, [category])

  const filtered = useMemo(() => products.filter(p =>
    (category === 'All' || p.category === category) &&
    p.status !== 'Discontinued'
  ), [products, category])

  function addToCart(product) {
 main
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i)
      return [...prev, { ...product, qty }]
    })
    gsap.from(`#add-btn-${product.id}`, { scale: 0.8, duration: 0.25, ease: 'back.out(2)' })
    addToast(`Đã thêm ${product.name} vào giỏ hàng`, 'success')
    if (selectedProduct) setSelectedProduct(null)
  }

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id))
< feat/DE190130_Hoan_Thien_Frontend
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0)
  const cartCount = cart.reduce((s, i) => s + i.qty, 0)

  const resetFilters = () => { setCategory('All'); setSportFilter('Tất cả môn'); setStatusFilter('Tất cả') }

  return (
    <ApexLayout title="Danh mục thiết bị">
      <div className="bg-[#F6F8FA] min-h-screen" ref={pageRef}>
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 auth-animate-in">

          {/* ── HERO BANNER ── */}
          <div className="shop-hero relative overflow-hidden rounded-[16px] mb-8 bg-[#0f172a] px-8 py-10 flex items-center justify-between gap-6">
            {/* Decorative grid lines */}
            <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px'}} />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#14b8a6] m-0 mb-2">// CỬA HÀNG CHÍNH THỨC</p>
              <h1 className="font-heading text-4xl uppercase tracking-tight text-white m-0 mb-2">DANH MỤC THIẾT BỊ</h1>
              <p className="text-[14px] text-white/60 m-0">Khám phá dụng cụ cao cấp cho cầu lông và pickleball.</p>
            </div>


  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0)
  const cartCount = cart.reduce((s, i) => s + i.qty, 0)

  return (
    <ApexLayout title="Cửa hàng">
      <div className="max-w-[1200px] mx-auto auth-animate-in" ref={pageRef}>
        {/* Hero */}
        <div className="shop-hero flex items-center justify-between gap-4 flex-wrap mb-6 bg-ink text-paper p-7">
          <div>
            <h1 className="font-heading text-2xl uppercase tracking-[-0.01em] text-paper mb-1">Cửa hàng Pro Gear</h1>
            <p className="text-sm text-paper/65">Mua thiết bị cao cấp cho trận đấu tiếp theo của bạn.</p>
          </div>
          <button className="relative btn-outline !border-paper/30 !text-paper hover:!border-accent hover:!text-accent" onClick={() => setShowCart(!showCart)}>
            <ShoppingCart size={16} />
            Giỏ hàng
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-accent text-ink text-[11px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(c => (
 main
            <button
              className="relative flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-2.5 rounded-[8px] text-[13px] font-bold transition-all cursor-pointer shrink-0 backdrop-blur-sm"
              onClick={() => setShowCart(!showCart)}
            >
              <ShoppingCart size={16} />
              Giỏ hàng
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#14b8a6] text-white text-[11px] font-bold flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

 feat/DE190130_Hoan_Thien_Frontend
          {/* ── PILL CATEGORY TABS ── */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(c => (
              <button
                key={c.key}
                onClick={() => setCategory(c.key)}
                className={`px-5 h-9 rounded-full text-[13px] font-bold transition-all cursor-pointer border-0 ${
                  category === c.key
                    ? 'bg-[#0f172a] text-white shadow-[0_4px_12px_rgba(15,23,42,0.2)]'
                    : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {error && <div className="mb-6 p-4 bg-red-50 text-red-600 text-[13px] rounded-[8px] border border-red-200">{error}</div>}
          {loading && <PageLoader message="Đang tải sản phẩm..." />}

          {/* ── MAIN LAYOUT: SIDEBAR + GRID + CART ── */}
          <div className="flex flex-col lg:flex-row gap-6 items-start">

            {/* LEFT SIDEBAR FILTERS */}
            <div className="w-full lg:w-[240px] shrink-0 bg-white rounded-[12px] shadow-[0_2px_12px_rgba(0,0,0,0.05)] border border-gray-100 p-5 lg:sticky lg:top-24">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-[13px] text-gray-900 m-0 uppercase tracking-widest">BỘ LỌC</h3>
                <button
                  className="flex items-center gap-1 bg-transparent border-0 text-[11px] text-gray-400 hover:text-gray-700 cursor-pointer font-medium transition-colors"
                  onClick={resetFilters}
                >
                  <RotateCcw size={11} /> Đặt lại
                </button>
              </div>



              {/* Môn thi đấu */}
              <div className="mb-5 pb-5 border-b border-gray-100">
                <h4 className="text-[11px] font-bold text-gray-400 mb-3 m-0 uppercase tracking-widest">Môn thi đấu</h4>
                <div className="flex flex-col gap-2.5">
                  {SPORT_FILTERS.map(s => (
                    <label key={s} className="flex items-center gap-2.5 cursor-pointer group">
                      <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${sportFilter === s ? 'border-[#14b8a6] bg-[#14b8a6]' : 'border-gray-300 group-hover:border-gray-400'}`}>
                        {sportFilter === s && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                      <span className={`text-[13px] transition-colors ${sportFilter === s ? 'font-bold text-gray-900' : 'text-gray-500 group-hover:text-gray-800'}`}>{s}</span>
                      <input type="radio" className="sr-only" checked={sportFilter === s} onChange={() => setSportFilter(s)} />
                    </label>
                  ))}

        {error && <div className="mb-4 p-4 border-2 border-danger bg-danger-bg text-danger text-sm">{error}</div>}
        {loading && <PageLoader message="Đang tải sản phẩm..." />}

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 w-full">
            {!loading && filtered.map(p => (
              <div key={p.id} className="product-card card-base !p-0 overflow-hidden flex flex-col">
                <img src={p.img} alt={p.name} className="w-full h-40 object-cover border-b-2 border-border-strong" />
                <div className="p-4 flex-1 flex flex-col">
                  <p className="label-mono text-foreground-subtle mb-1">{categoryLabels[p.category] || p.category} · {p.sport}</p>
                  <h3 className="font-sans font-extrabold text-[15px] text-foreground mb-3 flex-1">{p.name}</h3>
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="block font-heading text-lg text-foreground">{Number(p.price).toLocaleString('vi-VN')}₫</span>
                      <span className="label-mono text-foreground-subtle">Còn {p.stock} sản phẩm</span>
                    </div>
                    <button id={`add-btn-${p.id}`} className="btn-primary !h-9 !px-4 text-xs" onClick={() => addToCart(p)} disabled={p.stock <= 0}>
                      + Thêm
                    </button>
                  </div>
 main
                </div>
              </div>

              {/* Tình trạng */}
              <div>
                <h4 className="text-[11px] font-bold text-gray-400 mb-3 m-0 uppercase tracking-widest">Tình trạng</h4>
                <div className="flex flex-col gap-2.5">
                  {STATUS_FILTERS.map(s => (
                    <label key={s} className="flex items-center gap-2.5 cursor-pointer group">
                      <span className={`w-4 h-4 rounded-[4px] border-2 flex items-center justify-center shrink-0 transition-colors ${statusFilter === s ? 'border-[#14b8a6] bg-[#14b8a6]' : 'border-gray-300 group-hover:border-gray-400'}`}>
                        {statusFilter === s && (
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 4L3 6L7 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        )}
                      </span>
                      <span className={`text-[13px] transition-colors ${statusFilter === s ? 'font-bold text-gray-900' : 'text-gray-500 group-hover:text-gray-800'}`}>
                        {s === 'Tất cả' ? 'Tất cả' : statusDisplay[s] || s}
                      </span>
                      <input type="checkbox" className="sr-only" checked={statusFilter === s} onChange={() => setStatusFilter(s)} />
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* PRODUCT GRID */}
            <div className="flex-1 min-w-0">
              <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {!loading && filtered.map(p => (
                  <div 
                    key={p.id} 
                    className="product-card bg-white rounded-[12px] shadow-[0_2px_12px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden flex flex-col transition-all hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,0,0,0.10)] relative group cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-500"
                    onClick={() => { setSelectedProduct(p); setQuantity(1); }}
                  >

                    {/* Status badge */}
                    {(p.status === 'New' || p.status === 'Premium') && (
                      <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider z-10 ${
                        p.status === 'New'
                          ? 'bg-teal-50 text-[#14b8a6] border border-teal-100'
                          : 'bg-teal-50 text-[#14b8a6] border border-teal-100'
                      }`}>
                        {p.status === 'New' ? 'Mới' : 'Cao Cấp'}
                      </span>
                    )}

                    {/* Product image — studio style */}
                    <div className="w-full h-52 bg-gray-50 flex items-center justify-center p-6 relative overflow-hidden">
                      <img
                        src={p.img}
                        alt={p.name}
                        className="max-w-full max-h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                        onError={e => { e.target.src = CATEGORY_FALLBACKS[p.category] || FALLBACK_IMG }}
                      />
                    </div>

                    {/* Card body */}
                    <div className="p-5 flex-1 flex flex-col border-t border-gray-50">
                      <p className="text-[10px] font-bold uppercase text-gray-400 m-0 mb-1.5 tracking-[0.12em]">
                        {categoryLabels[p.category] || p.category} · {p.sport}
                      </p>
                      <h3 className="font-bold text-[14px] text-gray-900 m-0 mb-4 flex-1 leading-snug">{p.name}</h3>

                      <div className="flex justify-between items-end mt-auto">
                        <div>
 feat/DE190130_Hoan_Thien_Frontend
                          <span className="text-lg font-bold text-gray-800 block">{Number(p.price).toLocaleString('vi-VN')}₫</span>
                          <span className="text-xs text-gray-500 mt-1 block">Còn {p.stock} sản phẩm</span>

                          <p className="text-[13px] font-semibold text-foreground mb-0.5">{item.name}</p>
                          <p className="text-xs text-foreground-muted">
                            {item.price.toLocaleString('vi-VN')}₫ × {item.qty}
                          </p>
 main
                        </div>

                        <button
                          id={`add-btn-${p.id}`}
                          className="w-10 h-10 rounded-full bg-white text-teal-500 border border-teal-500 flex items-center justify-center hover:bg-teal-500 hover:text-white transition-all duration-300 cursor-pointer disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-400"
                          onClick={(e) => { e.stopPropagation(); addToCart(p, 1); }}
                          disabled={p.stock <= 0}
                          title="Thêm vào giỏ"
                        >
                          <ShoppingCart size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {!loading && filtered.length === 0 && (
                  <div className="col-span-full">
                    <EmptyState
                      icon={<Package className="w-8 h-8 text-gray-300" />}
                      title="Không có sản phẩm"
                      subtitle="Thử điều chỉnh bộ lọc hoặc chọn danh mục khác."
                      action={
                        <button
                          className="bg-[#14b8a6] text-white px-5 py-2 rounded-[8px] text-[13px] font-bold cursor-pointer border-0 hover:bg-[#0f9e8c] transition-colors"
                          onClick={resetFilters}
                        >
                          Xóa bộ lọc
                        </button>
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CART DRAWER */}
      <div 
        className={`fixed inset-0 z-[999] transition-opacity duration-300 ${showCart ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div 
          className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
          onClick={() => setShowCart(false)} 
        />
        <div 
          className={`absolute top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${showCart ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white relative z-10">
            <h3 className="font-heading text-lg uppercase tracking-wider text-gray-900 m-0">Giỏ hàng ({cartCount})</h3>
            <button className="bg-gray-100 border-0 text-gray-500 hover:text-gray-900 hover:bg-gray-200 cursor-pointer p-2 rounded-full transition-colors" onClick={() => setShowCart(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide bg-gray-50/50">
            {cart.length === 0 ? (
              <div className="text-center py-20 text-gray-400 text-[14px]">
                <ShoppingCart size={48} className="mx-auto mb-4 opacity-20" />
                Giỏ hàng của bạn đang trống
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {cart.map(item => (
                  <div key={item.id} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                    <img src={item.img} alt={item.name} className="w-20 h-20 object-contain bg-gray-50 rounded-lg p-2 border border-gray-100 shrink-0" />
                    <div className="flex-1 min-w-0 py-1">
                      <p className="text-[13px] font-bold text-gray-900 m-0 mb-1 leading-tight">{item.name}</p>
                      <p className="text-[12px] text-gray-500 font-medium m-0 mb-3">
                        {item.price.toLocaleString('vi-VN')}₫
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#14b8a6] bg-teal-50 px-2.5 py-1 rounded-md">SL: {item.qty}</span>
                        <button className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer bg-transparent border-0 p-1 rounded hover:bg-red-50" onClick={() => removeFromCart(item.id)}>
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-white relative z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between mb-5">
                <span className="text-[13px] font-bold uppercase tracking-wider text-gray-500">Tổng thanh toán</span>
                <strong className="text-[24px] font-bold text-gray-900">{cartTotal.toLocaleString('vi-VN')}₫</strong>
              </div>
              <button className="w-full h-12 bg-[#14b8a6] hover:bg-[#0f9e8c] text-white rounded-xl text-[14px] font-bold uppercase tracking-wide transition-colors shadow-lg shadow-[#14b8a6]/30 cursor-pointer border-0">
                Thanh toán ngay
              </button>
            </div>
          )}
        </div>
      </div>

      {/* QUICK VIEW MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[#0d1b2a]/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-8 relative">
              <img src={selectedProduct.img} alt={selectedProduct.name} className="w-full h-auto max-h-[300px] object-contain mix-blend-multiply" />
            </div>
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[#14b8a6] mb-1">{categoryLabels[selectedProduct.category] || selectedProduct.category} · {selectedProduct.sport}</p>
                  <h2 className="text-xl font-bold text-gray-900 leading-tight m-0">{selectedProduct.name}</h2>
                </div>
                <button className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 transition-colors border-0 cursor-pointer" onClick={() => setSelectedProduct(null)}>
                  <X size={18} />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-[13px] text-gray-600 leading-relaxed bg-[#F8F9FA] p-3.5 rounded-[12px] max-h-[110px] overflow-y-auto border border-gray-100 m-0">
                  {selectedProduct.description}
                </p>
              </div>

              <div className="mb-6">
                <span className="text-2xl font-bold text-gray-900">{Number(selectedProduct.price).toLocaleString('vi-VN')}₫</span>
                <p className="text-sm text-gray-500 mt-1 m-0">Còn {selectedProduct.stock} sản phẩm trong kho</p>
              </div>

              <div className="mt-auto">
                <label className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider mb-2">Số lượng</label>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 p-1">
                    <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50 cursor-pointer border-0 bg-transparent" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>-</button>
                    <input type="number" className="w-12 h-8 text-center bg-transparent font-bold text-gray-900 focus:outline-none border-0" value={quantity} readOnly />
                    <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50 cursor-pointer border-0 bg-transparent" onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))} disabled={quantity >= selectedProduct.stock}>+</button>
                  </div>
                </div>

                <button
                  className="w-full bg-[#14b8a6] hover:bg-[#0f9e8c] text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-[#14b8a6]/30 flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:shadow-none border-0 cursor-pointer"
                  disabled={selectedProduct.stock <= 0}
                  onClick={() => addToCart(selectedProduct, quantity)}
                >
                  <ShoppingCart size={18} />
                  {selectedProduct.stock <= 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ApexLayout>
  )
}
