import { useState } from 'react'
import { Link } from 'react-router-dom'
import GearLayout from '../../layouts/GearLayout'
import './GearCatalogPage.css'

const products = [
  { id: 1, name: 'Pickleball Pro Paddle X1', category: 'PICKLEBALL', badge: 'NEW', price: '$15/hr', deposit: '$50', img: 'https://images.unsplash.com/photo-1617083934551-1af7da84de49?w=400&q=80', type: 'rental' },
  { id: 2, name: 'Pickleball Carbon Elite', category: 'PICKLEBALL', badge: 'PREMIUM', price: '$18/hr', deposit: '$60', img: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80', type: 'rental' },
  { id: 3, name: 'Pickleball Balls (3-Pack)', category: 'PICKLEBALL', badge: 'DEMO', price: '$8/tube', deposit: null, img: 'https://images.unsplash.com/photo-1612452040814-e42b8f2da8ea?w=400&q=80', type: 'purchase', stock: 'Available' },
  { id: 4, name: 'Badminton Racket Pro', category: 'BADMINTON', badge: 'PREMIUM', price: '$45/day', deposit: '$150', img: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=400&q=80', type: 'rental' },
]

const sports = ['Pickleball', 'Pickleball', 'Badminton', 'Pickleball']
const conditions = ['Premium', 'New', 'Demo']

export default function GearCatalogPage() {
  const [selected, setSelected] = useState(['Pickleball', 'Pickleball'])
  const [selectedCond, setSelectedCond] = useState(['Premium'])

  const toggle = (arr, setArr, val) => {
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])
  }

  return (
    <GearLayout>
      <div className="gear-catalog">
        {/* Sidebar filters */}
        <aside className="gear-catalog__filters">
          <div className="gear-filters__header">
            <h3>Filters</h3>
            <button className="gear-filters__reset">Reset</button>
          </div>
          <div className="gear-filter-group">
            <p className="gear-filter-label">SPORT</p>
            {sports.map(s => (
              <label key={s} className="gear-filter-item" htmlFor={`sport-${s}`}>
                <input type="checkbox" id={`sport-${s}`} checked={selected.includes(s)} onChange={() => toggle(selected, setSelected, s)} />
                <span className="gear-checkbox" />
                <span>{s}</span>
              </label>
            ))}
          </div>
          <div className="gear-filter-group">
            <p className="gear-filter-label">CONDITION</p>
            <div className="gear-filter-chips">
              {conditions.map(c => (
                <button key={c} className={`gear-filter-chip ${selectedCond.includes(c) ? 'gear-filter-chip--active' : ''}`}
                  onClick={() => toggle(selectedCond, setSelectedCond, c)}>{c}</button>
              ))}
            </div>
          </div>
          <div className="gear-filter-group">
            <p className="gear-filter-label">PRICE / HOUR</p>
            <div className="gear-price-range">
              <div className="gear-price-input"><span>$</span><input type="number" placeholder="Min" id="price-min" /></div>
              <span>-</span>
              <div className="gear-price-input"><span>$</span><input type="number" placeholder="Max" id="price-max" /></div>
            </div>
          </div>
          <button className="btn-primary" style={{width:'100%', justifyContent:'center', marginTop:'8px'}}>Apply Filters</button>
        </aside>

        {/* Main content */}
        <div className="gear-catalog__main">
          <div className="gear-catalog__header">
            <h1 className="gear-catalog__title">Catalog</h1>
            <div className="gear-catalog__controls">
              <span className="gear-catalog__count">Showing {products.length} available courts</span>
              <div className="gear-view-toggles">
                <button className="gear-view-btn gear-view-btn--active" aria-label="Grid"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="8" height="8"/><rect x="13" y="3" width="8" height="8"/><rect x="3" y="13" width="8" height="8"/><rect x="13" y="13" width="8" height="8"/></svg></button>
                <button className="gear-view-btn" aria-label="List"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg></button>
              </div>
              <select className="gear-sort" id="gear-sort">
                <option>Sort by: Recommended</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
              </select>
            </div>
          </div>

          <div className="gear-product-grid">
            {products.map(p => (
              <Link to={`/gear/catalog/${p.id}`} key={p.id} className="gear-product-card">
                <div className="gear-product-card__img-wrap">
                  <img src={p.img} alt={p.name} className="gear-product-card__img" />
                  {p.badge && <span className={`gear-badge gear-badge--${p.badge.toLowerCase()}`}>{p.badge}</span>}
                  <button className="gear-wishlist-btn" aria-label="Wishlist">♡</button>
                </div>
                <div className="gear-product-card__body">
                  <p className="gear-product-card__category">{p.category}</p>
                  <h3 className="gear-product-card__name">{p.name}</h3>
                  <div className="gear-product-card__pricing">
                    <div>
                      <p className="gear-product-card__price-label">{p.type === 'rental' ? 'Rental Rate' : 'Purchase'}</p>
                      <p className="gear-product-card__price">{p.price}</p>
                    </div>
                    {p.deposit && (
                      <div>
                        <p className="gear-product-card__price-label">Deposit</p>
                        <p className="gear-product-card__deposit">{p.deposit}</p>
                      </div>
                    )}
                    {p.stock && <span className="gear-product-card__stock">{p.stock}</span>}
                  </div>
                  <button className="btn-primary gear-product-card__btn">
                    {p.type === 'rental' ? 'Add to Rental' : 'Add to Cart'}
                  </button>
                </div>
              </Link>
            ))}
          </div>

          <div className="gear-pagination">
            <button className="gear-page-btn">‹</button>
            {[1, 2, 3].map(p => (
              <button key={p} className={`gear-page-btn ${p === 1 ? 'gear-page-btn--active' : ''}`}>{p}</button>
            ))}
            <span>...</span>
            <button className="gear-page-btn">›</button>
          </div>
        </div>
      </div>
    </GearLayout>
  )
}
