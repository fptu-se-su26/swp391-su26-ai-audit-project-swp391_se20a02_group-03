import { useState } from 'react'
import ProSportDashLayout from '../../layouts/ProSportDashLayout'
import './DashNotifSettingsPage.css'

const topics = [
  { id: 'bookings', emoji: '📅', iconBg: '#6366f1', label: 'Court Bookings',    desc: 'Confirmations, cancellations, and upcoming reservation reminders.', push: true,  email: true,  sms: false },
  { id: 'matches',  emoji: '🏸', iconBg: '#22c55e', label: 'Social Matches',    desc: 'Invites, match results, and partner availability alerts.',         push: true,  email: false, sms: false },
  { id: 'rentals',  emoji: '📦', iconBg: '#64748b', label: 'Equipment Rentals', desc: 'Pickup times, return deadlines, and overdue notices.',             push: false, email: true,  sms: true  },
  { id: 'payments', emoji: '💳', iconBg: '#ef4444', label: 'Payments & Billing',desc: 'Invoices, successful charges, and payment failures.',             push: true,  email: true,  sms: false },
]

function Toggle({ checked, onChange, id }) {
  return (
    <button role="switch" aria-checked={checked} id={id} onClick={onChange}
      className={`psd-toggle ${checked ? 'psd-toggle--on' : ''}`}>
      <span className="psd-toggle__thumb" />
    </button>
  )
}

export default function DashNotifSettingsPage() {
  const [topicState, setTopicState] = useState(topics)
  const [masterPush,  setMasterPush]  = useState(true)
  const [masterEmail, setMasterEmail] = useState(true)
  const [masterSms,   setMasterSms]   = useState(false)
  const [quietHours,  setQuietHours]  = useState(true)

  const toggleChannel = (id, ch) =>
    setTopicState(topicState.map(t => t.id === id ? { ...t, [ch]: !t[ch] } : t))

  return (
    <ProSportDashLayout>
      <div className="dash-ns">
        <div className="dash-ns__header">
          <h1 className="dash-page-title">Notifications</h1>
          <p className="dash-page-sub">Configure how and when you want to be alerted about your athletic activities, bookings, and account updates.</p>
        </div>

        <div className="dns-grid">
          {/* Topics */}
          <div className="dns-card">
            <div className="dns-card__title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
                <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
              Notification Topics
            </div>
            <p className="dns-card__sub">Fine-tune your alerts across different communication channels.</p>

            <div className="dns-topic-header">
              <div className="dns-topic-header__info">TOPIC</div>
              <div className="dns-topic-header__channels">
                <span>PUSH</span><span>EMAIL</span><span>SMS</span>
              </div>
            </div>

            {topicState.map(t => (
              <div key={t.id} className="dns-topic-row">
                <div className="dns-topic-row__info">
                  <div className="dns-topic-icon" style={{ background: t.iconBg }}>{t.emoji}</div>
                  <div>
                    <p className="dns-topic-label">{t.label}</p>
                    <p className="dns-topic-desc">{t.desc}</p>
                  </div>
                </div>
                <div className="dns-topic-toggles">
                  <Toggle checked={t.push}  onChange={() => toggleChannel(t.id, 'push')}  id={`${t.id}-push`} />
                  <Toggle checked={t.email} onChange={() => toggleChannel(t.id, 'email')} id={`${t.id}-email`} />
                  <Toggle checked={t.sms}   onChange={() => toggleChannel(t.id, 'sms')}   id={`${t.id}-sms`} />
                </div>
              </div>
            ))}
          </div>

          {/* Right panel */}
          <div className="dns-right">
            {/* Master Channels */}
            <div className="dns-card">
              <p className="dns-card__title-sm">Master Channels</p>
              <p className="dns-card__hint">Quickly disable all notifications for a specific medium.</p>
              {[
                { label: 'Push Notifications', emoji: '📱', val: masterPush,  set: setMasterPush,  id: 'master-push'  },
                { label: 'Email Alerts',        emoji: '✉️', val: masterEmail, set: setMasterEmail, id: 'master-email' },
                { label: 'SMS Text Messages',   emoji: '💬', val: masterSms,   set: setMasterSms,   id: 'master-sms'   },
              ].map(m => (
                <div key={m.label} className="dns-master-row">
                  <span className="dns-master-icon">{m.emoji}</span>
                  <span className="dns-master-label">{m.label}</span>
                  <Toggle checked={m.val} onChange={() => m.set(!m.val)} id={m.id} />
                </div>
              ))}
            </div>

            {/* Quiet Hours */}
            <div className="dns-card dns-card--mt">
              <div className="dns-quiet-header">
                <p className="dns-card__title-sm">🌙 Quiet Hours</p>
                <Toggle checked={quietHours} onChange={() => setQuietHours(!quietHours)} id="quiet-hours" />
              </div>
              <p className="dns-card__hint">Mute all non-critical notifications during these hours.</p>
              <div className="dns-quiet-times">
                <div>
                  <p className="dns-quiet-label">FROM</p>
                  <div className="dns-time-input">
                    10:00 PM
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="dns-quiet-label">TO</p>
                  <div className="dns-time-input">
                    07:00 AM
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '12px' }}>
                <p className="dns-quiet-label">TIMEZONE</p>
                <select id="tz-select" className="dns-timezone-select">
                  <option>Pacific Time (US & Canada)</option>
                  <option>Eastern Time (US & Canada)</option>
                  <option>UTC+7 (Ho Chi Minh)</option>
                </select>
              </div>
            </div>

            {/* Desktop Preview */}
            <div className="dns-preview-card">
              <p className="dns-preview-label">DESKTOP PREVIEW</p>
              <div className="dns-preview-notif">
                <span className="dns-preview-notif__icon">🏟️</span>
                <div>
                  <p className="dns-preview-notif__title">Booking Confirmed</p>
                  <p className="dns-preview-notif__sub">Court 4 is reserved for Tuesday at 18:00.</p>
                </div>
                <button className="dns-preview-close">&times;</button>
              </div>
            </div>
          </div>
        </div>

        <div className="dns-footer-actions">
          <button className="btn-outline">Discard Changes</button>
          <button className="btn-primary">Save Preferences</button>
        </div>
      </div>
    </ProSportDashLayout>
  )
}
