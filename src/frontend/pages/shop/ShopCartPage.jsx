import { useState } from 'react'
import { Link } from 'react-router-dom'
import ShopLayout from '../../layouts/ShopLayout'
import './ShopCartPage.css'

const initItems = [
  { id: 1, name: 'AeroSprint Pro Elite', color: 'Crimson/Neon', size: '10.5 US', price: 189.99, qty: 1, img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80' },
  { id: 2, name: 'CoreKnit Performance Tee', color: 'Deep Navy', size: 'L', price: 45.00, qty: 2, img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&q=80' },
]

export default function ShopCartPage() {
  const [items, setItems] = useState(initItems)
  const [promo, setPromo] = useState('')

  const updateQty = (id, delta) => {
    setItems(items.map(item => item.id === id ? {...item, qty: Math.max(1, item.qty + delta)} : item))
  }

  const removeItem = (id) => setItems(items.filter(i => i.id !== id))

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
  const shipping = 15.00
  const tax = 23.10
  const total = subtotal + shipping + tax

  return (
    <ShopLayout>
      <div className="shop-cart-page">
        <h1 className="shop-cart-title">Your Cart</h1>

        <div className="shop-cart-grid">
          {/* Items */}
          <div className="shop-cart-items">
            {items.map(item => (
              <div key={item.id} className="shop-cart-item">
                <img src={item.img} alt={item.name} className="shop-cart-item__img" />
                <div className="shop-cart-item__info">
                  <div className="shop-cart-item__header">
                    <div>
                      <h3 className="shop-cart-item__name">{item.name}</h3>
                      <p className="shop-cart-item__meta">Color: {item.color}</p>
                      <p className="shop-cart-item__meta">Size: {item.size}</p>
                    </div>
                    <span className="shop-cart-item__price">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                  <div className="shop-cart-item__footer">
                    <div className="shop-qty-control">
                      <button onClick={() => updateQty(item.id, -1)} className="shop-qty-btn" aria-label="Decrease">-</button>
                      <span className="shop-qty-val">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="shop-qty-btn" aria-label="Increase">+</button>
                    </div>
                    <div className="shop-cart-item__actions">
                      <button className="shop-cart-save">♡ Save</button>
                      <button className="shop-cart-remove" onClick={() => removeItem(item.id)}>🗑 Remove</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="shop-cart-summary">
            <h2 className="shop-cart-summary__title">Order Summary</h2>
            <div className="shop-cart-summary__rows">
              <div className="shop-summary-row"><span>Subtotal ({items.length} items)</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="shop-summary-row"><span>Estimated Shipping</span><span>${shipping.toFixed(2)}</span></div>
              <div className="shop-summary-row"><span>Estimated Tax</span><span>${tax.toFixed(2)}</span></div>
            </div>
            <div className="shop-summary-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="shop-promo">
              <p className="shop-promo__label">Apply Promo Code</p>
              <div className="shop-promo__row">
                <input type="text" placeholder="Enter code" id="promo-code" value={promo} onChange={e => setPromo(e.target.value)} className="shop-promo__input" />
                <button className="shop-promo__apply">Apply</button>
              </div>
            </div>
            <Link to="/shop/checkout" className="btn-primary shop-checkout-btn">
              Proceed to Checkout →
            </Link>
          </div>
        </div>
      </div>
    </ShopLayout>
  )
}
