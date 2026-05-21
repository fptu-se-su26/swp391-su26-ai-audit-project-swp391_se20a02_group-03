import { useState } from 'react'
import { Link } from 'react-router-dom'
import './ShopCheckoutPage.css'

const steps = ['Shipping', 'Payment', 'Review']
const payMethods = ['Card', 'VNPay', 'MoMo', 'Wallet']

export default function ShopCheckoutPage() {
  const [step] = useState(0)
  const [delivery, setDelivery] = useState('express')
  const [payMethod, setPayMethod] = useState('Card')

  return (
    <div className="checkout-page">
      {/* Mini header */}
      <header className="checkout-header">
        <Link to="/shop" className="checkout-header__logo">PRO-SPORT</Link>
      </header>

      <div className="checkout-content">
        <div className="checkout-main">
          {/* Steps */}
          <div className="checkout-steps">
            {steps.map((s, i) => (
              <div key={s} className={`checkout-step ${i <= step ? 'checkout-step--active' : ''}`}>
                <div className="checkout-step__num">{i + 1}</div>
                <span className="checkout-step__label">{s}</span>
                {i < steps.length - 1 && <div className={`checkout-step__line ${i < step ? 'checkout-step__line--done' : ''}`} />}
              </div>
            ))}
          </div>

          {/* Shipping Info */}
          <div className="checkout-section">
            <h2 className="checkout-section__title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              Shipping Information
            </h2>
            <div className="checkout-form-grid">
              <div className="checkout-field">
                <label className="checkout-label" htmlFor="s-fname">First Name</label>
                <input id="s-fname" type="text" defaultValue="John" className="checkout-input" />
              </div>
              <div className="checkout-field">
                <label className="checkout-label" htmlFor="s-lname">Last Name</label>
                <input id="s-lname" type="text" defaultValue="Doe" className="checkout-input" />
              </div>
              <div className="checkout-field checkout-field--full">
                <label className="checkout-label" htmlFor="s-email">Email Address</label>
                <input id="s-email" type="email" defaultValue="john.doe@example.com" className="checkout-input" />
              </div>
              <div className="checkout-field checkout-field--full">
                <label className="checkout-label" htmlFor="s-address">Street Address</label>
                <input id="s-address" type="text" defaultValue="123 Performance Way" className="checkout-input" />
              </div>
              <div className="checkout-field">
                <label className="checkout-label" htmlFor="s-city">City</label>
                <input id="s-city" type="text" defaultValue="Athletica" className="checkout-input" />
              </div>
              <div className="checkout-field">
                <label className="checkout-label" htmlFor="s-zip">Postal Code</label>
                <input id="s-zip" type="text" defaultValue="10000" className="checkout-input" />
              </div>
            </div>
          </div>

          {/* Delivery */}
          <div className="checkout-section">
            <h2 className="checkout-section__title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Delivery Method
            </h2>
            {[{id:'express',label:'Express Delivery',sub:'1-2 Business Days',price:'$15.00'},{id:'standard',label:'Standard Delivery',sub:'3-5 Business Days',price:'Free'}].map(d => (
              <label key={d.id} className={`checkout-delivery-option ${delivery === d.id ? 'checkout-delivery-option--active' : ''}`} htmlFor={`del-${d.id}`}>
                <input type="radio" id={`del-${d.id}`} name="delivery" value={d.id} checked={delivery === d.id} onChange={() => setDelivery(d.id)} />
                <div>
                  <p className="checkout-delivery-label">{d.label}</p>
                  <p className="checkout-delivery-sub">{d.sub}</p>
                </div>
                <span className="checkout-delivery-price">{d.price}</span>
              </label>
            ))}
          </div>

          {/* Payment */}
          <div className="checkout-section">
            <h2 className="checkout-section__title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
              Payment Method
            </h2>
            <div className="checkout-pay-methods">
              {payMethods.map(m => (
                <button key={m} className={`checkout-pay-method ${payMethod === m ? 'checkout-pay-method--active' : ''}`} onClick={() => setPayMethod(m)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                  <span>{m}</span>
                </button>
              ))}
            </div>
            {payMethod === 'Card' && (
              <div className="checkout-card-form">
                <div className="checkout-field checkout-field--full">
                  <label className="checkout-label" htmlFor="card-num">Card Number</label>
                  <div className="checkout-card-input">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                    <input id="card-num" type="text" placeholder="0000 0000 0000 0000" className="checkout-input" />
                  </div>
                </div>
                <div className="checkout-form-grid">
                  <div className="checkout-field">
                    <label className="checkout-label" htmlFor="expiry">Expiry Date</label>
                    <input id="expiry" type="text" placeholder="MM/YY" className="checkout-input" />
                  </div>
                  <div className="checkout-field">
                    <label className="checkout-label" htmlFor="cvc">CVC</label>
                    <input id="cvc" type="text" placeholder="123" className="checkout-input" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="checkout-summary">
          <h2 className="checkout-summary__title">Order Summary</h2>
          {[{name:'Aero-Dash Elite 2.0',meta:'Size: 10 | Color: Neon',price:'$185.00',img:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80'},{name:'Compression Pro Tights',meta:'Size: M | Color: Obsidian',price:'$75.00',img:'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=100&q=80'}].map(item => (
            <div key={item.name} className="checkout-summary-item">
              <img src={item.img} alt={item.name} className="checkout-summary-item__img" />
              <div>
                <p className="checkout-summary-item__name">{item.name}</p>
                <p className="checkout-summary-item__meta">{item.meta}</p>
              </div>
              <span className="checkout-summary-item__price">{item.price}</span>
            </div>
          ))}
          <div className="checkout-summary-rows">
            <div className="checkout-summary-row"><span>Subtotal</span><span>$260.00</span></div>
            <div className="checkout-summary-row"><span>Shipping (Express)</span><span>$15.00</span></div>
            <div className="checkout-summary-row"><span>Tax</span><span>$22.00</span></div>
          </div>
          <div className="checkout-summary-total"><span>Total</span><span>$297.00</span></div>
          <button className="btn-primary checkout-confirm-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Confirm Purchase
          </button>
          <p className="checkout-secure-label">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Secure SSL Encrypted Checkout
          </p>
        </div>
      </div>

      <footer className="checkout-footer">
        <span className="checkout-footer__logo">PRO-SPORT</span>
        <p>© 2024 PRO-SPORT. Engineered for Elite Performance.</p>
        <div><a href="#">Privacy</a> <a href="#">Terms</a></div>
      </footer>
    </div>
  )
}
