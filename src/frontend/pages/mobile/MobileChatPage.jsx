import MobileLayout from '../../layouts/MobileLayout'
import './MobileChatPage.css'

export default function MobileChatPage() {
  return (
    <MobileLayout hideBottomNav={true} showBack={true} title={
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Saturday Night Doubles</h2>
        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'normal' }}>4 Participants</span>
      </div>
    }>
      <div className="mob-chat">
        
        <div className="mc-date-divider">
          <span>Today</span>
        </div>

        {/* Message 1 */}
        <div className="mc-msg-row left">
          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&q=80" alt="Sarah" className="mc-avatar" />
          <div className="mc-msg-content">
            <span className="mc-sender-name">Sarah Jenkins</span>
            <div className="mc-bubble">
              Hey team! Are we still on for 7 PM at Court 2? 🎾
            </div>
            <span className="mc-time">10:12 AM</span>
          </div>
        </div>

        {/* Message 2 */}
        <div className="mc-msg-row left">
          <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&q=80" alt="Mike" className="mc-avatar" />
          <div className="mc-msg-content">
            <span className="mc-sender-name">Mike Davis</span>
            <div className="mc-bubble">
              Yep, I'll be there a bit early to warm up.
            </div>
            <span className="mc-time">10:15 AM</span>
          </div>
        </div>

        {/* My Message */}
        <div className="mc-msg-row right">
          <div className="mc-msg-content">
            <div className="mc-bubble my-msg">
              Awesome. I brought extra tennis balls just in case.
            </div>
            <span className="mc-time">10:50 AM <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00c2ff" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg></span>
          </div>
        </div>

        {/* System Alert */}
        <div className="mc-sys-alert">
          <p className="mc-alert-title">Court Change Alert</p>
          <p className="mc-alert-desc">We've been moved to Court 4 due to maintenance.</p>
        </div>

        {/* Image Message */}
        <div className="mc-msg-row right">
          <div className="mc-msg-content">
            <img src="https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=300&q=80" alt="Court" className="mc-img-msg" />
          </div>
        </div>

      </div>

      {/* Chat Input */}
      <div className="mc-input-area">
        <button className="mc-icon-btn"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg></button>
        <div className="mc-input-box">
          <input type="text" placeholder="Type a message..." />
          <button className="mc-emoji-btn"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg></button>
        </div>
        <button className="mc-send-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </MobileLayout>
  )
}
