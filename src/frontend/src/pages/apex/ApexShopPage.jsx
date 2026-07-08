import { useState, useEffect, useRef, useMemo } from 'react'
import { gsap } from 'gsap'
import ApexLayout from '../../layouts/ApexLayout'
import { equipmentApi } from '../../api/equipmentApi'
import PageLoader from '../../components/ui/PageLoader'
import EmptyState from '../../components/ui/EmptyState'
import { ShoppingCart, X, Frown } from 'lucide-react'

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80'

const categories = [
  { key: 'All', label: 'Tất cả' },
  { key: 'Racket', label: 'Vợt' },
  { key: 'Footwear', label: 'Giày' },
  { key: 'Apparel', label: 'Trang phục' },
  { key: 'Ball / Birdie', label: 'Cầu / Bóng' },
  { key: 'Accessories', label: 'Phụ kiện' },
]

const categoryLabels = Object.fromEntries(categories.map(c => [c.key, c.label]))

export default function ApexShopPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [category, setCategory] = useState('All')
  const [cart, setCart] = useState([])
  const [mode, setMode] = useState('buy')
  const [showCart, setShowCart] = useState(false)
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
            rental: e.price !== e.retailPrice ? e.price : null,
            stock: e.stockQuantity,
            img: e.imageUrl || FALLBACK_IMG,
            status: e.status,
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

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.shop-hero', { opacity: 0, y: 24, duration: 0.6, ease: 'power3.out' })
      gsap.from('.product-card', { opacity: 0, y: 40, stagger: 0.07, duration: 0.5, ease: 'power2.out', delay: 0.2 })
    }, pageRef)
    return () => ctx.revert()
  }, [category])

  const filtered = useMemo(() => products.filter(p =>
    (category === 'All' || p.category === category) &&
    (mode === 'buy' || p.rental !== null) &&
    p.status !== 'Discontinued'
  ), [products, category, mode])

  function addToCart(product) {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...product, qty: 1 }]
    })
    gsap.from(`#add-btn-${product.id}`, { scale: 0.85, duration: 0.25, ease: 'back.out(1.7)' })
  }

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id))

  const cartTotal = cart.reduce((sum, i) => sum + (mode === 'rent' && i.rental ? i.rental : i.price) * i.qty, 0)
  const cartCount = cart.reduce((s, i) => s + i.qty, 0)

  return (
    <ApexLayout title="Cửa hàng">
      <div className="max-w-[1200px] mx-auto auth-animate-in" ref={pageRef}>
        {/* Hero */}
        <div className="shop-hero flex items-center justify-between gap-4 flex-wrap mb-6 bg-ink text-paper p-7">
          <div>
            <h1 className="font-heading text-2xl uppercase tracking-[-0.01em] text-paper mb-1">Cửa hàng Pro Gear</h1>
            <p className="text-sm text-paper/65">Mua hoặc thuê thiết bị cao cấp cho trận đấu tiếp theo của bạn.</p>
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

        {/* Mode toggle */}
        <div className="flex gap-1 bg-surface border-2 border-border-strong p-1 w-fit mb-4">
          <button className={`px-6 h-9 label-mono transition-colors ${mode === 'buy' ? 'bg-ink text-paper' : 'text-foreground-muted hover:text-foreground'}`} onClick={() => setMode('buy')}>Mua</button>
          <button className={`px-6 h-9 label-mono transition-colors ${mode === 'rent' ? 'bg-ink text-paper' : 'text-foreground-muted hover:text-foreground'}`} onClick={() => setMode('rent')}>Thuê</button>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(c => (
            <button
              key={c.key}
              className={`px-4 h-9 label-mono border-2 transition-colors ${
                category === c.key
                  ? 'bg-accent text-ink border-accent'
                  : 'bg-surface border-border-default text-foreground-muted hover:border-border-hover hover:text-foreground'
              }`}
              onClick={() => setCategory(c.key)}
            >
              {c.label}
            </button>
          ))}
        </div>

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
                      {mode === 'rent' && p.rental
                        ? <span className="block font-heading text-lg text-foreground">{Number(p.rental).toLocaleString('vi-VN')}₫<small className="font-sans text-xs text-foreground-muted font-normal">/ngày</small></span>
                        : <span className="block font-heading text-lg text-foreground">{Number(p.price).toLocaleString('vi-VN')}₫</span>
                      }
                      <span className="label-mono text-foreground-subtle">Còn {p.stock} sản phẩm</span>
                    </div>
                    <button id={`add-btn-${p.id}`} className="btn-primary !h-9 !px-4 text-xs" onClick={() => addToCart(p)} disabled={p.stock <= 0}>
                      + Thêm
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {!loading && filtered.length === 0 && (
              <div className="col-span-full">
                <EmptyState
                  icon={<Frown className="w-7 h-7" />}
                  title="Không có sản phẩm"
                  subtitle="Không có sản phẩm cho thuê trong danh mục này."
                />
              </div>
            )}
          </div>

          {showCart && (
            <div className="w-full lg:w-[280px] shrink-0 card-base lg:sticky lg:top-24">
              <h3 className="font-heading text-lg uppercase text-foreground mb-4">Giỏ hàng</h3>
              {cart.length === 0 ? (
                <div className="text-center py-5 text-foreground-muted text-sm">Giỏ hàng trống</div>
              ) : (
                <>
                  <div className="flex flex-col gap-2.5 mb-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-start justify-between gap-2.5 p-2.5 bg-background-base border border-border-default">
                        <div>
                          <p className="text-[13px] font-semibold text-foreground mb-0.5">{item.name}</p>
                          <p className="text-xs text-foreground-muted">
                            {mode === 'rent' && item.rental ? `${item.rental.toLocaleString('vi-VN')}₫/ngày` : `${item.price.toLocaleString('vi-VN')}₫`} × {item.qty}
                          </p>
                        </div>
                        <button className="text-foreground-muted hover:text-danger transition-colors shrink-0" onClick={() => removeFromCart(item.id)}>
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between font-heading text-base text-foreground mb-3.5 border-t border-border-default pt-3">
                    <span>Tổng cộng</span><strong>{cartTotal.toLocaleString('vi-VN')}₫</strong>
                  </div>
                  <button className="btn-primary w-full justify-center">Thanh toán</button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </ApexLayout>
  )
}
