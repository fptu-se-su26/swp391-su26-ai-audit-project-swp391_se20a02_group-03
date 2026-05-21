import MobileLayout from '../../layouts/MobileLayout'
import './MobileBookingPage.css'

export default function MobileBookingPage() {
  return (
    <MobileLayout hideBottomNav={true} showBack={true} title="">
      <div className="mob-booking">
        
        {/* Progress */}
        <div className="mb-progress-container">
          <div className="mb-progress-bars">
            <div className="mb-bar active"></div>
            <div className="mb-bar"></div>
            <div className="mb-bar"></div>
          </div>
          <span className="mb-step-text">Step 1 of 3</span>
        </div>

        {/* Header */}
        <div className="mb-header">
          <h2 className="mb-title">Select Court</h2>
          <p className="mb-subtitle">Swipe to explore available courts.</p>
        </div>

        {/* Court Card */}
        <div className="mb-court-card">
          <div className="mb-court-img-wrap">
            <img src="https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=600&q=80" alt="Court" className="mb-court-img" />
            <span className="mb-tag-indoor">Indoor</span>
          </div>
          
          <div className="mb-court-info">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 className="mb-court-name">Center Court</h3>
                <p className="mb-court-type">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  Premium Hardcourt
                </p>
              </div>
              <span className="mb-sport-tag">Tennis</span>
            </div>

            <div className="mb-court-bot">
              <div className="mb-price-box">
                <span className="mb-old-price">$45</span>
                <span className="mb-new-price">$35</span>
                <span className="mb-per-hr">/hr</span>
              </div>
              <div className="mb-check-circle">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Slots */}
        <div className="mb-slots-section">
          <p className="mb-slots-label">TODAY'S QUICK SLOTS</p>
          <div className="mb-slots-grid">
            <button className="mb-slot-btn">17:00</button>
            <button className="mb-slot-btn active">18:30</button>
            <button className="mb-slot-btn">20:00</button>
            <button className="mb-slot-btn disabled">21:30</button>
          </div>
        </div>

      </div>

      {/* Sticky Bottom Button */}
      <div className="mb-sticky-btn-wrap">
        <button className="btn-mb-proceed">
          Proceed to Payment
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
      </div>

    </MobileLayout>
  )
}
