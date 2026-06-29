import { useState, useEffect, useRef, useMemo } from 'react'
import { gsap } from 'gsap'
import ApexLayout from '../../layouts/ApexLayout'
import { equipmentApi } from '../../api/equipmentApi'
import PageLoader from '../../components/ui/PageLoader'
import './ApexShopPage.css'

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
      <div className="apex-shop" ref={pageRef}>
        <div className="shop-hero">
          <div>
            <h1 className="shop-hero__title">Cửa hàng Pro Gear</h1>
            <p className="shop-hero__sub">Mua hoặc thuê thiết bị cao cấp cho trận đấu tiếp theo của bạn.</p>
          </div>
          <button className="cart-btn btn-outline" onClick={() => setShowCart(!showCart)}>
            🛒 Giỏ hàng
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>
        </div>

        <div className="shop-mode-toggle">
          <button className={`mode-btn ${mode === 'buy' ? 'active' : ''}`} onClick={() => setMode('buy')}>🛍️ Mua</button>
          <button className={`mode-btn ${mode === 'rent' ? 'active' : ''}`} onClick={() => setMode('rent')}>🔄 Thuê</button>
        </div>

        <div className="shop-categories">
          {categories.map(c => (
            <button key={c.key} className={`shop-cat-btn ${category === c.key ? 'active' : ''}`} onClick={() => setCategory(c.key)}>{c.label}</button>
          ))}
        </div>

        {error && <div className="shop-error">{error}</div>}
        {loading && <PageLoader label="Đang tải sản phẩm..." />}

        <div className="shop-layout">
          <div className="products-grid">
            {!loading && filtered.map(p => (
              <div key={p.id} className="product-card">
                <img src={p.img} alt={p.name} className="product-card__img" />
                <div className="product-card__body">
                  <p className="product-card__category">{categoryLabels[p.category] || p.category} · {p.sport}</p>
                  <h3 className="product-card__name">{p.name}</h3>
                  <div className="product-card__footer">
                    <div>
                      {mode === 'rent' && p.rental
                        ? <span className="product-price">{Number(p.rental).toLocaleString('vi-VN')}₫<small>/ngày</small></span>
                        : <span className="product-price">{Number(p.price).toLocaleString('vi-VN')}₫</span>
                      }
                      <span className="product-stock">Còn {p.stock} sản phẩm</span>
                    </div>
                    <button id={`add-btn-${p.id}`} className="btn-primary product-card__add" onClick={() => addToCart(p)} disabled={p.stock <= 0}>
                      + Thêm
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {!loading && filtered.length === 0 && (
              <div className="shop-empty">
                <span>🛍️</span>
                <p>Không có sản phẩm cho thuê trong danh mục này.</p>
              </div>
            )}
          </div>

          {showCart && (
            <div className="cart-panel">
              <h3 className="cart-panel__title">🛒 Giỏ hàng</h3>
              {cart.length === 0 ? (
                <div className="cart-empty"><p>Giỏ hàng trống</p></div>
              ) : (
                <>
                  <div className="cart-items">
                    {cart.map(item => (
                      <div key={item.id} className="cart-item">
                        <div className="cart-item__info">
                          <p className="cart-item__name">{item.name}</p>
                          <p className="cart-item__price">
                            {mode === 'rent' && item.rental ? `${item.rental.toLocaleString('vi-VN')}₫/ngày` : `${item.price.toLocaleString('vi-VN')}₫`} × {item.qty}
                          </p>
                        </div>
                        <button className="cart-item__remove" onClick={() => removeFromCart(item.id)}>✕</button>
                      </div>
                    ))}
                  </div>
                  <div className="cart-panel__total">
                    <span>Tổng cộng</span><strong>{cartTotal.toLocaleString('vi-VN')}₫</strong>
                  </div>
                  <button className="btn-primary cart-panel__checkout">Thanh toán</button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </ApexLayout>
  )
}
