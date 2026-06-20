import { useState } from 'react'
import { Link } from 'react-router-dom'
import ShopLayout from '../../layouts/ShopLayout'
import './ShopPage.css'

const categories = ['Equipment', 'Apparel', 'Shoes']
const sports = ['Running', 'Training', 'Pickleball', 'Badminton']

const products = [
  { id: 1, name: 'Aero Sprint Pro X', brand: 'VELOCITY', price: '$189.00', rating: 4.9, badge: 'NEW', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80' },
  { id: 2, name: 'Therma-Shield Jacket', brand: 'CORETECH', price: '$145.00', rating: 4.7, img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80' },
  { id: 3, name: 'Elite Stride Shorts', brand: 'VELOCITY', price: '$65.00', rating: 4.9, badge: 'TRENDING', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80' },
]

export default function ShopPage() {
  const [selectedCat, setSelectedCat] = useState(['Apparel'])
  const [selectedSport, setSelectedSport] = useState(['Running', 'Training', 'Pickleball'])
  const [priceRange, setPriceRange] = useState(250)

  const toggle = (arr, setArr, val) => setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])

  return (
    <ShopLayout showFlashBanner darkHeader>
      <div className="shop-page">
        {/* Left Sidebar */}
        <aside className="shop-sidebar">
          <div className="shop-sidebar__section">
            <p className="shop-sidebar__label">CATEGORIES</p>
            {categories.map(c => (
              <label key={c} className="shop-sidebar__check" htmlFor={`cat-${c}`}>
                <input type="checkbox" id={`cat-${c}`} checked={selectedCat.includes(c)} onChange={() => toggle(selectedCat, setSelectedCat, c)} />
                <span className="shop-check-box" />
                <span>{c}</span>
              </label>
            ))}
          </div>

          <div className="shop-sidebar__section">
            <p className="shop-sidebar__label">SPORT</p>
            <div className="shop-sport-chips">
              {sports.map(s => (
                <button key={s} className={`shop-sport-chip ${selectedSport.includes(s) ? 'active' : ''}`} onClick={() => toggle(selectedSport, setSelectedSport, s)}>{s}</button>
              ))}
            </div>
          </div>

          <div className="shop-sidebar__section">
            <p className="shop-sidebar__label">PRICE</p>
            <input type="range" min={0} max={500} value={priceRange} onChange={e => setPriceRange(e.target.value)} className="shop-range" id="price-range" />
            <div className="shop-range-labels"><span>$0</span><span>${priceRange}</span></div>
          </div>
        </aside>

        {/* Main */}
        <div className="shop-main-content">
          <div className="shop-page-header">
            <div>
              <h1 className="shop-page-title">Elite Apparel</h1>
              <p className="shop-page-sub">Showing 124 results for high-performance gear.</p>
            </div>
            <div className="shop-page-sort">
              <span>Sort by:</span>
              <select id="shop-sort" className="shop-sort-select">
                <option>Recommended</option>
                <option>Price: Low to High</option>
                <option>Newest</option>
              </select>
            </div>
          </div>

          <div className="shop-product-grid">
            {products.map(p => (
              <Link to={`/shop/product/${p.id}`} key={p.id} className="shop-product-card">
                <div className="shop-product-card__img-wrap">
                  <img src={`https://images.unsplash.com/photo-${p.id === 1 ? '1542291026-7eec264c27ff' : p.id === 2 ? '1591047139829-d91aecb6caea' : '1506629082955-511b1aa562c8'}?w=600&q=80`} alt={p.name} className="shop-product-card__img" />
                  {p.badge && <span className={`shop-product-badge ${p.badge === 'TRENDING' ? 'shop-product-badge--trending' : 'shop-product-badge--new'}`}>{p.badge}</span>}
                  <button className="shop-wishlist-heart" aria-label="Wishlist">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  </button>
                </div>
                <div className="shop-product-card__body">
                  <p className="shop-product-card__brand">{p.brand}</p>
                  <h3 className="shop-product-card__name">{p.name}</h3>
                  <div className="shop-product-card__footer">
                    <p className="shop-product-card__price">{p.price}</p>
                    <span className="shop-product-card__rating">★ {p.rating}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div style={{textAlign:'center', marginTop:'32px'}}>
            <button className="btn-outline shop-load-more">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-6.06"/></svg>
              Load More Gear
            </button>
          </div>
        </div>
      </div>
    </ShopLayout>
  )
}
