import ShopLayout from '../../layouts/ShopLayout'
import './ShopWishlistPage.css'

const items = [
  {
    id: 1,
    name: 'Aero-Swift Pro Elite Run',
    sub: "Men's Road Racing Shoes",
    price: '$240.00',
    badge: 'IN STOCK',
    badgeColor: '#22c55e',
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
  },
  {
    id: 2,
    name: 'PulseTrack V4 Biometric Watch',
    sub: 'Performance Wearable',
    price: '$299.00',
    oldPrice: '$350.00',
    badge: 'PRICE DROP',
    badgeColor: '#ef4444',
    img: 'https://images.unsplash.com/photo-1523475496153-3d6cc0a9bf63?w=400&q=80',
  },
]

export default function ShopWishlistPage() {
  return (
    <ShopLayout>
      <div className="shop-wishlist-page">
        <div className="shop-wishlist-header">
          <div>
            <h1 className="shop-wishlist-title">My Wishlist</h1>
            <p className="shop-wishlist-sub">{items.length} items saved. Keep track of your elite gear.</p>
          </div>
          <div className="shop-wishlist-actions">
            <button className="btn-outline" style={{display:'flex',gap:'6px',alignItems:'center'}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              Share Wishlist
            </button>
            <button className="btn-primary">Move All to Cart</button>
          </div>
        </div>

        <div className="shop-wishlist-grid">
          {items.map(item => (
            <div key={item.id} className="shop-wishlist-card">
              <div className="shop-wishlist-card__img-wrap">
                <img src={item.img} alt={item.name} className="shop-wishlist-card__img" />
                {item.badge && (
                  <span className="shop-wishlist-badge" style={{background: item.badgeColor + '22', color: item.badgeColor, border: `1px solid ${item.badgeColor}44`}}>
                    {item.badge}
                  </span>
                )}
                <button className="shop-wishlist-remove" aria-label="Remove">×</button>
              </div>
              <div className="shop-wishlist-card__body">
                <h3 className="shop-wishlist-card__name">{item.name}</h3>
                <p className="shop-wishlist-card__sub">{item.sub}</p>
                <div className="shop-wishlist-card__footer">
                  <div>
                    {item.oldPrice && <span className="shop-wishlist-card__old-price">{item.oldPrice}</span>}
                    <span className="shop-wishlist-card__price" style={item.oldPrice ? {color:'#ef4444'} : {}}>{item.price}</span>
                  </div>
                  <button className="shop-wishlist-cart-btn" aria-label="Add to cart">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ShopLayout>
  )
}
