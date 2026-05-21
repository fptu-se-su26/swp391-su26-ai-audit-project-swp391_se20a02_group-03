import { useState } from 'react'
import ApexLayout from '../../layouts/ApexLayout'
import './ApexActivityPage.css'

const tabs = ['All', 'Booking Reminders', 'Match Invitations', 'Payments', 'System']

const notifications = [
  {
    id: 1,
    type: 'match',
    icon: '🏸',
    iconBg: '#0d8a8a',
    title: 'Match Invitation',
    body: 'Sarah J. invited you to a Padel doubles match at Grand Slam Center.',
    time: '2m ago',
    unread: true,
    extra: { date: 'Tomorrow, 18:00 PM - Court 3' },
    actions: ['Accept', 'Decline'],
  },
  {
    id: 2,
    type: 'booking',
    icon: '⏰',
    iconBg: '#f59e0b',
    title: 'Upcoming Booking',
    body: 'Your indoor tennis session starts in 2 hours.',
    time: '1h ago',
    unread: false,
    link: 'View Details →',
  },
  {
    id: 3,
    type: 'payment',
    icon: '💳',
    iconBg: '#94a3b8',
    title: 'Payment Successful',
    body: 'Receipt for Court 6 booking ($45.00) has been generated.',
    time: 'Yesterday',
    unread: false,
    link: 'Download Receipt',
  },
  {
    id: 4,
    type: 'system',
    icon: '🔔',
    iconBg: '#6366f1',
    title: 'System Update',
    body: 'New court surfaces added! Check out the newly renovated outdoor hard courts available for booking next week.',
    time: '2 days ago',
    unread: false,
    actions: ['Explore Courts'],
  },
]

export default function ApexActivityPage() {
  const [activeTab, setActiveTab] = useState('All')

  return (
    <ApexLayout title="Activity">
      <div className="apex-activity">
        <div className="apex-activity__header">
          <h1 className="apex-activity__title">Notifications</h1>
          <button className="apex-activity__mark-all">Mark all as read</button>
        </div>

        <div className="apex-activity__tabs">
          {tabs.map(t => (
            <button
              key={t}
              className={`apex-tab ${activeTab === t ? 'apex-tab--active' : ''}`}
              onClick={() => setActiveTab(t)}
            >{t}</button>
          ))}
        </div>

        <div className="apex-activity__list">
          {notifications.map(n => (
            <div key={n.id} className={`apex-notif ${n.unread ? 'apex-notif--unread' : ''}`}>
              <div className="apex-notif__icon" style={{background: n.iconBg}}>{n.icon}</div>
              <div className="apex-notif__content">
                <div className="apex-notif__top">
                  <p className="apex-notif__title">{n.title}</p>
                  <span className="apex-notif__time">{n.time}</span>
                  {n.unread && <span className="apex-notif__dot" />}
                </div>
                <p className="apex-notif__body">{n.body}</p>
                {n.extra && (
                  <div className="apex-notif__extra">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <span>{n.extra.date}</span>
                  </div>
                )}
                {n.actions && (
                  <div className="apex-notif__actions">
                    {n.actions.map((a, i) => (
                      <button key={a} className={i === 0 ? 'btn-primary apex-notif__btn' : 'btn-outline apex-notif__btn'}>{a}</button>
                    ))}
                  </div>
                )}
                {n.link && <a href="#" className="apex-notif__link">{n.link}</a>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ApexLayout>
  )
}
