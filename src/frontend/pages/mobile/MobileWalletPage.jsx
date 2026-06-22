import MobileLayout from '../../layouts/MobileLayout'
import './MobileWalletPage.css'

export default function MobileWalletPage() {
  return (
    <MobileLayout>
      <div className="mob-wallet">
        
        {/* Balance */}
        <div className="mw-balance-header">
          <div>
            <p className="mw-bal-label">AVAILABLE BALANCE</p>
            <h1 className="mw-bal-val">$4,850.00</h1>
          </div>
          <button className="mw-icon-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          </button>
        </div>

        {/* Card Scroll */}
        <div className="mw-cards-scroll">
          <div className="mw-credit-card primary">
            <div className="mw-cc-top">
              <h3 className="mw-cc-brand">PRO-SPORT</h3>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72"/></svg>
            </div>
            <p className="mw-cc-label">CARD NUMBER</p>
            <p className="mw-cc-number">**** **** **** 4928</p>
            <div className="mw-cc-bot">
              <div>
                <p className="mw-cc-label">CARDHOLDER</p>
                <p className="mw-cc-val">Alex Mercer</p>
              </div>
              <div>
                <p className="mw-cc-label">EXP</p>
                <p className="mw-cc-val">12/28</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Funds Button */}
        <div className="mw-actions">
          <button className="btn-mw-add">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            Add Funds
          </button>
        </div>

        {/* Transactions */}
        <div className="mw-section">
          <div className="mw-section-header">
            <h3 className="mw-section-title">Recent Transactions</h3>
            <span className="mw-link">View All</span>
          </div>

          <div className="mw-tx-list">
            
            <div className="mw-tx-item">
              <div className="mw-tx-icon bg-blue">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72"/></svg>
              </div>
              <div className="mw-tx-info">
                <h4 className="mw-tx-title">Court Booking - Elite Arena</h4>
                <p className="mw-tx-date">Today, 14:30</p>
              </div>
              <div className="mw-tx-amt-box">
                <p className="mw-tx-amt negative">-$45.00</p>
                <span className="mw-badge-success">SUCCESS</span>
              </div>
            </div>

            <div className="mw-tx-item">
              <div className="mw-tx-icon bg-orange">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              </div>
              <div className="mw-tx-info">
                <h4 className="mw-tx-title">Pro Shop - Pickleball Balls</h4>
                <p className="mw-tx-date">Yesterday, 09:15</p>
              </div>
              <div className="mw-tx-amt-box">
                <p className="mw-tx-amt negative">-$12.50</p>
                <span className="mw-badge-pending">PENDING</span>
              </div>
            </div>

            <div className="mw-tx-item">
              <div className="mw-tx-icon bg-cyan">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 19 19 12"/></svg>
              </div>
              <div className="mw-tx-info">
                <h4 className="mw-tx-title">Top Up - VNPay</h4>
                <p className="mw-tx-date">Oct 12, 18:00</p>
              </div>
              <div className="mw-tx-amt-box">
                <p className="mw-tx-amt positive">+$150.00</p>
                <span className="mw-badge-success">SUCCESS</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </MobileLayout>
  )
}
