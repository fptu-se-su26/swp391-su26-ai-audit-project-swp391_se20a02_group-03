import EliteLayout from '../../layouts/EliteLayout'
import './ElitePosWalkInPage.css'

export default function ElitePosWalkInPage() {
  return (
    <EliteLayout>
      <div className="elite-pos">
        <div className="ep-header">
          <div>
            <h1 className="elite-page-title">Walk-in Booking</h1>
            <p className="elite-page-subtitle">Select court and complete checkout immediately.</p>
          </div>
          <div className="ep-sports-toggle">
            <button className="ep-sport-btn active">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72"/></svg>
              Padel
            </button>
            <button className="ep-sport-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              Tennis
            </button>
            <button className="ep-sport-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="21.17" y1="8" x2="12" y2="8"/><line x1="3.95" y1="6.06" x2="8.54" y2="14"/><line x1="10.88" y1="21.94" x2="15.46" y2="14"/></svg>
              Multi-Sport
            </button>
          </div>
        </div>

        <div className="ep-grid">
          {/* Left Column - Courts */}
          <div className="ep-courts-area">
            <div className="ep-courts-header">
              <h2 className="ep-section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Available Now & Next
              </h2>
              <div className="ep-legend">
                <span className="ep-legend-item"><span className="ep-dot available"></span> Available</span>
                <span className="ep-legend-item"><span className="ep-dot booked"></span> Booked</span>
              </div>
            </div>

            <div className="ep-courts-grid">
              {/* Court 1 */}
              <div className="ep-court-card active">
                <div className="ep-court-card-top">
                  <div>
                    <h3 className="ep-court-name">Padel Court 1</h3>
                    <p className="ep-court-type">Indoor • Panorama</p>
                  </div>
                  <span className="ep-badge-selected">SELECTED</span>
                </div>
                <div className="ep-slots">
                  <button className="ep-slot-btn selected">
                    <span className="ep-slot-time">10:00 - 11:30</span>
                    <span className="ep-slot-price">$45</span>
                  </button>
                  <button className="ep-slot-btn available">
                    <span className="ep-slot-time">11:30 - 13:00</span>
                    <span className="ep-slot-price">$45</span>
                  </button>
                </div>
              </div>

              {/* Court 2 */}
              <div className="ep-court-card">
                <div className="ep-court-card-top">
                  <div>
                    <h3 className="ep-court-name">Padel Court 2</h3>
                    <p className="ep-court-type">Indoor • Standard</p>
                  </div>
                </div>
                <div className="ep-slots">
                  <button className="ep-slot-btn available">
                    <span className="ep-slot-time">10:30 - 12:00</span>
                    <span className="ep-slot-price">$40</span>
                  </button>
                  <button className="ep-slot-btn available">
                    <span className="ep-slot-time">12:00 - 13:30</span>
                    <span className="ep-slot-price">$40</span>
                  </button>
                </div>
              </div>

              {/* Court 3 */}
              <div className="ep-court-card">
                <div className="ep-court-card-top">
                  <div>
                    <h3 className="ep-court-name">Padel Court 3</h3>
                    <p className="ep-court-type">Outdoor • Premium</p>
                  </div>
                </div>
                <div className="ep-slots">
                  <button className="ep-slot-btn booked" disabled>
                    <span className="ep-slot-time">10:00 - 11:30</span>
                    <span className="ep-slot-price">BOOKED</span>
                  </button>
                  <button className="ep-slot-btn available">
                    <span className="ep-slot-time">11:30 - 13:00</span>
                    <span className="ep-slot-price">$50</span>
                  </button>
                </div>
              </div>

              {/* Court 4 */}
              <div className="ep-court-card">
                <div className="ep-court-card-top">
                  <div>
                    <h3 className="ep-court-name">Padel Court 4</h3>
                    <p className="ep-court-type">Outdoor • Standard</p>
                  </div>
                </div>
                <div className="ep-slots">
                  <button className="ep-slot-btn available">
                    <span className="ep-slot-time">10:00 - 11:30</span>
                    <span className="ep-slot-price">$40</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Checkout */}
          <div className="ep-checkout-area">
            {/* Player Details */}
            <div className="ep-checkout-card">
              <div className="ep-card-header">
                <h3 className="ep-section-title">Player Details</h3>
                <span className="ep-link-text">Walk-in Guest</span>
              </div>
              <div className="ep-search-bar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input type="text" placeholder="Search member name or phone..." />
              </div>
            </div>

            {/* Current Order */}
            <div className="ep-checkout-card ep-order-card">
              <h3 className="ep-section-title">Current Order</h3>
              
              <div className="ep-order-item">
                <div className="ep-order-item-top">
                  <div>
                    <p className="ep-order-item-name">Padel Court 1</p>
                    <p className="ep-order-item-sub">Today, 10:00 - 11:30</p>
                  </div>
                  <button className="ep-remove-btn">&times;</button>
                </div>
                <div className="ep-order-item-price-row">
                  <span>Court Fee</span>
                  <span>$45.00</span>
                </div>
              </div>

              <div className="ep-order-summary">
                <div className="ep-summary-row">
                  <span>Subtotal</span>
                  <span>$45.00</span>
                </div>
                <div className="ep-summary-row">
                  <span>Tax (10%)</span>
                  <span>$4.50</span>
                </div>
                <div className="ep-summary-row ep-total-row">
                  <span>Total</span>
                  <span className="ep-total-price">$49.50</span>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="ep-checkout-card">
              <p className="ep-label-small">QUICK PAY</p>
              <div className="ep-pay-methods">
                <button className="ep-pay-btn">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
                  Cash
                </button>
                <button className="ep-pay-btn active">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                  Card
                </button>
                <button className="ep-pay-btn">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                  QR Pay
                </button>
              </div>

              <button className="ep-complete-btn">
                Complete Booking
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </button>
            </div>

          </div>
        </div>
      </div>
    </EliteLayout>
  )
}
