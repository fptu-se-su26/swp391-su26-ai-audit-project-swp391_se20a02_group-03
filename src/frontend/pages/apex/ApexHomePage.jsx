import { Link } from 'react-router-dom'
import ApexLayout from '../../layouts/ApexLayout'
import './ApexHomePage.css'

const bookings = [
  { id: 1, name: 'Indoor Pickleball Court A', time: 'Today, 18:00 - 20:00', status: 'CONFIRMED', icon: '🏸', iconBg: '#0d8a8a' },
  { id: 2, name: 'Main Badminton Arena', time: 'Tomorrow, 10:00 - 11:30', status: 'CONFIRMED', icon: '🏸', iconBg: '#f59e0b' },
]

export default function ApexHomePage() {
  return (
    <ApexLayout title="Home">
      <div className="apex-home">
        {/* Hero */}
        <div className="apex-home__hero">
          <div>
            <h1 className="apex-home__welcome">Welcome back, <span>Alex</span></h1>
            <p className="apex-home__subtitle">You have 2 upcoming bookings and 1 pending match invitation. Ready to hit the court?</p>
            <div className="apex-home__actions">
              <Link to="/apex/booking" className="btn-primary">Book a Court</Link>
              <Link to="/apex/shop" className="btn-outline">Rent Equipment</Link>
            </div>
          </div>
        </div>

        <div className="apex-home__grid">
          {/* Upcoming Bookings */}
          <div className="apex-card">
            <div className="apex-card__header">
              <h2 className="apex-card__title">Upcoming Bookings</h2>
              <Link to="/apex/booking" className="apex-card__link">View All</Link>
            </div>
            {bookings.map(b => (
              <div key={b.id} className="apex-booking-item">
                <div className="apex-booking-item__icon" style={{background: b.iconBg}}>{b.icon}</div>
                <div className="apex-booking-item__info">
                  <p className="apex-booking-item__name">{b.name}</p>
                  <p className="apex-booking-item__time">{b.time}</p>
                </div>
                <span className="apex-booking-item__status">{b.status}</span>
              </div>
            ))}
          </div>

          {/* Active Rentals */}
          <div className="apex-card">
            <h2 className="apex-card__title">Active Rentals</h2>
            <div className="apex-rental-item">
              <div className="apex-rental-item__info">
                <p className="apex-rental-item__name">Pro Pickleball Racket</p>
                <p className="apex-rental-item__due">Due: Today, 20:00</p>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            </div>
            <div className="apex-rental-progress">
              <div className="apex-rental-progress__bar" style={{width: '65%'}} />
            </div>
            <Link to="/apex/shop" className="btn-outline" style={{marginTop: '16px', width: '100%', justifyContent: 'center', display: 'flex'}}>Rent More Gear</Link>
          </div>
        </div>

        {/* Match Invitations */}
        <div className="apex-card" style={{marginTop: '20px'}}>
          <h2 className="apex-card__title">Match Invitations</h2>
          <div className="apex-invite">
            <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80" alt="David K." className="apex-invite__avatar" />
            <div className="apex-invite__info">
              <p className="apex-invite__name">Doubles Match (Intermediate)</p>
              <p className="apex-invite__meta">Hosted by David K.</p>
              <div className="apex-invite__meta-row">
                <span>📍 Lê Văn Lộc</span>
                <span>🏟 Court 8</span>
              </div>
            </div>
            <div className="apex-invite__actions">
              <button className="btn-primary">Join Match</button>
              <button className="btn-outline">Decline</button>
            </div>
          </div>
        </div>
      </div>
    </ApexLayout>
  )
}
