import MobileLayout from '../../layouts/MobileLayout'
import './MobileScannerPage.css'

export default function MobileScannerPage() {
  return (
    <div className="mobile-app-container">
      <div className="mobile-app-wrapper" style={{ background: '#0f172a' }}>
        
        {/* Scanner Topbar */}
        <div className="ms-topbar">
          <button className="ms-icon-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <h1 className="mt-brand" style={{ color: 'white' }}>PRO-SPORT</h1>
          <button className="ms-icon-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg> {/* Flashlight equivalent */}
          </button>
        </div>

        {/* Scanner Area */}
        <div className="ms-camera-area">
          <div className="ms-camera-bg"></div> {/* Simulated camera feed */}
          
          <div className="ms-overlay">
            <div className="ms-hint-pill">Position QR code within the frame</div>
            
            <div className="ms-scan-frame">
              {/* Corner brackets */}
              <div className="ms-corner tl"></div>
              <div className="ms-corner tr"></div>
              <div className="ms-corner bl"></div>
              <div className="ms-corner br"></div>
              
              {/* Scan line animation */}
              <div className="ms-scan-line"></div>
            </div>

            <button className="ms-manual-btn">Enter Court ID Manually</button>
          </div>
        </div>

        {/* Success Bottom Sheet */}
        <div className="ms-bottom-sheet">
          <div className="ms-sheet-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div className="ms-sheet-content">
            <span className="ms-sheet-label">Scan Successful</span>
            <h3 className="ms-sheet-title">Court 04 Check-in</h3>
            <p className="ms-sheet-desc">Booking verified for 14:00</p>
          </div>
          <button className="btn-ms-enter">Enter Court</button>
        </div>

      </div>
    </div>
  )
}
