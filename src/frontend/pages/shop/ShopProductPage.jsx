import { useState } from 'react'
import ShopLayout from '../../layouts/ShopLayout'
import './ShopProductPage.css'

const colors = [
  { name: 'Neon Blue / Ice White', hex: '#00b4d8' },
  { name: 'Midnight Black', hex: '#1a1a2e' },
  { name: 'Coral Orange', hex: '#f4845f' },
]

const sizes = [8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5]

const specs = [
  { label: 'Weight', value: '210g (Size 9)' },
  { label: 'Drop', value: '8mm' },
  { label: 'Cushioning', value: 'Max - React Foam+', highlight: true },
  { label: 'Plate', value: 'Full-length Carbon Fiber', highlight: true },
]

const thumbs = [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80',
  'https://images.unsplash.com/photo-1608231387042-66d1773d3028?w=200&q=80',
  'https://images.unsplash.com/photo-1556906781-9a412961a28c?w=200&q=80',
]

export default function ShopProductPage() {
  const [selectedColor, setSelectedColor] = useState(0)
  const [selectedSize, setSelectedSize] = useState(9.5)
  const [activeThumb, setActiveThumb] = useState(0)
  const [specsOpen, setSpecsOpen] = useState(true)

  return (
    <ShopLayout>
      <div className="shop-product-page">
        {/* Breadcrumb */}
        <div className="shop-breadcrumb">
          <a href="#">Home</a> › <a href="#">Shoes</a> › <span>AeroPulse Elite X</span>
        </div>

        <div className="shop-product-page__grid">
          {/* Gallery */}
          <div className="shop-product-gallery">
            <div className="shop-product-gallery__main">
              <img src={thumbs[activeThumb]} alt="Product" className="shop-product-gallery__img" />
              <button className="shop-wishlist-fab" aria-label="Save">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              </button>
            </div>
            <div className="shop-product-gallery__thumbs">
              {thumbs.map((t, i) => (
                <button key={i} className={`shop-product-gallery__thumb ${activeThumb === i ? 'active' : ''}`} onClick={() => setActiveThumb(i)}>
                  <img src={t} alt={`View ${i + 1}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="shop-product-details">
            <h1 className="shop-product-details__name">AeroPulse Elite X</h1>
            <p className="shop-product-details__sub">Professional Grade Marathon Footwear</p>
            <div className="shop-product-details__price-row">
              <span className="shop-product-details__price">$249.99</span>
              <span className="shop-product-details__rating">★ 4.9 (128 Reviews)</span>
            </div>

            {/* Color */}
            <div className="shop-product-option">
              <p className="shop-product-option__label">Color: <span>{colors[selectedColor].name}</span></p>
              <div className="shop-color-swatches">
                {colors.map((c, i) => (
                  <button
                    key={i}
                    className={`shop-color-swatch ${selectedColor === i ? 'active' : ''}`}
                    style={{background: c.hex}}
                    onClick={() => setSelectedColor(i)}
                    aria-label={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="shop-product-option">
              <div className="shop-product-option__header">
                <p className="shop-product-option__label">Size (US Men's)</p>
                <a href="#" className="shop-size-guide">Size Guide</a>
              </div>
              <div className="shop-size-grid">
                {sizes.map(s => (
                  <button
                    key={s}
                    className={`shop-size-btn ${selectedSize === s ? 'active' : ''} ${s === 11 ? 'disabled' : ''}`}
                    onClick={() => s !== 11 && setSelectedSize(s)}
                    disabled={s === 11}
                  >{s}</button>
                ))}
              </div>
              <p className="shop-in-stock">
                <span className="shop-in-stock__dot" />
                In Stock & Ready to Ship
              </p>
            </div>

            {/* CTAs */}
            <button className="btn-primary shop-add-to-cart">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              Add to Cart
            </button>
            <button className="shop-fastpay-btn">Buy Now with FastPay</button>

            {/* Specs */}
            <div className="shop-specs">
              <button className="shop-specs__toggle" onClick={() => setSpecsOpen(!specsOpen)}>
                <span>Technical Specifications</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{transform: specsOpen ? 'rotate(180deg)' : 'none', transition: '0.2s'}}><polyline points="18 15 12 9 6 15"/></svg>
              </button>
              {specsOpen && (
                <div className="shop-specs__table">
                  {specs.map(s => (
                    <div key={s.label} className="shop-spec-row">
                      <span className="shop-spec-label">{s.label}</span>
                      <span className={`shop-spec-value ${s.highlight ? 'shop-spec-value--highlight' : ''}`}>{s.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ShopLayout>
  )
}
