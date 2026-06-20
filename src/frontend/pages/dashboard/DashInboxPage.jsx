import { useState } from 'react'
import ProSportDashLayout from '../../layouts/ProSportDashLayout'
import './DashInboxPage.css'

const tabs = ['All', 'Unread', 'Bookings', 'Matches', 'Rentals']

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
const BagIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
)
const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const notifications = [
  {
    id: 1,
    iconEl: <CalendarIcon />,
    iconBg: '#ef4444',
    tags: ['URGENT', 'PRO'],
    title: 'Center Court Elite Booking',
    body: 'Your reserved court time begins tomorrow at 10:00 AM. Please arrive 15 minutes early to finalize check-in at the front desk.',
    time: '10 mins ago',
    actions: [{ label: 'View Booking', variant: 'primary' }],
  },
  {
    id: 2,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80',
    tags: ['NEW'],
    title: 'Match Invitation: Alex Mercer',
    body: 'Alex has invited you to a Competitive Singles match on Friday evening. Do you accept the challenge?',
    time: '2 hours ago',
    actions: [{ label: 'Join Match', variant: 'primary' }, { label: 'Decline', variant: 'outline' }],
  },
  {
    id: 3,
    iconEl: <BagIcon />,
    iconBg: '#f59e0b',
    tags: [],
    title: 'Rental Return Reminder',
    body: "Your rental for the 'Premium Carbon Racket' is due back today by 5:00 PM. Please return it to the pro shop.",
    time: '4 hours ago',
    actions: [{ label: 'Extend Rental', variant: 'dark' }],
  },
  {
    id: 4,
    iconEl: <CheckIcon />,
    iconBg: '#0d8a8a',
    tags: [],
    title: 'Payment Successful',
    body: "Your recent purchase for 'Pro Gear Pack V2' was successful. A receipt has been sent to your email.",
    time: 'Yesterday',
    actions: [],
  },
]

export default function DashInboxPage() {
  const [activeTab, setActiveTab] = useState('All')

  return (
    <ProSportDashLayout>
      <div className="dash-inbox">
        <div className="dash-inbox__header">
          <div>
            <h1 className="dash-inbox__title">Notifications</h1>
            <p className="dash-inbox__sub">Manage your alerts and stay ahead of the game.</p>
          </div>
          <button className="dash-inbox__mark-all">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Mark all as read
          </button>
        </div>

        <div className="dash-inbox__tabs">
          {tabs.map(t => (
            <button key={t} className={`dash-tab ${activeTab === t ? 'dash-tab--active' : ''}`} onClick={() => setActiveTab(t)}>{t}</button>
          ))}
        </div>

        <div className="dash-inbox__list">
          {notifications.map(n => (
            <div key={n.id} className="dash-notif-card">
              <div className="dash-notif-card__icon">
                {n.avatar ? (
                  <img src={n.avatar} alt="" className="dash-notif-card__avatar" />
                ) : (
                  <div className="dash-notif-card__icon-bg" style={{ background: n.iconBg }}>
                    {n.iconEl}
                  </div>
                )}
              </div>
              <div className="dash-notif-card__content">
                <div className="dash-notif-card__top">
                  <div className="dash-notif-card__tags">
                    {n.tags.map(tag => (
                      <span key={tag} className={`dash-tag dash-tag--${tag.toLowerCase()}`}>{tag}</span>
                    ))}
                  </div>
                  <span className="dash-notif-card__time">{n.time}</span>
                </div>
                <h3 className="dash-notif-card__title">{n.title}</h3>
                <p className="dash-notif-card__body">{n.body}</p>
                {n.actions.length > 0 && (
                  <div className="dash-notif-card__actions">
                    {n.actions.map(a => (
                      <button key={a.label} className={`dash-action-btn--${a.variant}`}>{a.label}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProSportDashLayout>
  )
}
