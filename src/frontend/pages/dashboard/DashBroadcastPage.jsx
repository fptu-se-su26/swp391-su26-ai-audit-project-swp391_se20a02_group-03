import { useState } from 'react'
import ProSportDashLayout from '../../layouts/ProSportDashLayout'
import './DashBroadcastPage.css'

const stats = [
  { label: 'TOTAL SENT',          value: '248.5k', trend: '↑ +12.4% this month', trendUp: true  },
  { label: 'DELIVERY RATE',       value: '99.2%',  bar: true                                    },
  { label: 'AVG. OPEN RATE',      value: '42.8%',  bars: [30,50,40,55,70,65,80]                 },
  { label: 'CLICK-THROUGH (CTR)', value: '8.4%',   trend: '→ Stable vs last week', trendUp: null },
]

const audiences = ['All Active Members', 'Pickleball Players', 'Pickleball Enthusiasts', 'Lapsed Users', '+ Custom Segment']

const recentBroadcasts = [
  { status: 'SCHEDULED', statusColor: '#f59e0b', date: 'Tomorrow, 09:00', title: 'Weekend Tournament Reminder', meta: 'Target: Tournament Participants' },
  { status: 'SENT', statusColor: '#22c55e', date: 'Yesterday', title: 'New Pickleball Courts Available!', open: '68%', click: '12%' },
  { status: 'SENT', statusColor: '#22c55e', date: 'Mon, 14:30', title: 'App Update: Version 2.4 is live', open: '45%', click: '3%' },
]

export default function DashBroadcastPage() {
  const [msgBody, setMsgBody] = useState('')
  const [selectedAud, setSelectedAud] = useState(['All Active Members'])
  const [msgType, setMsgType] = useState('push')

  const toggleAud = (a) =>
    setSelectedAud(selectedAud.includes(a) ? selectedAud.filter(x => x !== a) : [...selectedAud, a])

  return (
    <ProSportDashLayout>
      <div className="dash-broadcast">
        <div className="dash-broadcast__header">
          <div>
            <h1 className="dash-page-title">Broadcast Management</h1>
            <p className="dash-page-sub">Design, schedule, and analyze targeted communications.</p>
          </div>
          <button className="btn-primary dash-broadcast__new-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
            New Broadcast
          </button>
        </div>

        {/* Stats */}
        <div className="db-stats-grid">
          {stats.map(s => (
            <div key={s.label} className="db-stat-card">
              <p className="db-stat-label">{s.label}</p>
              <p className="db-stat-value">{s.value}</p>
              {s.trend && <p className={`db-stat-trend ${s.trendUp ? 'db-stat-trend--up' : ''}`}>{s.trend}</p>}
              {s.bar && <div className="db-stat-bar"><div className="db-stat-bar__fill" /></div>}
              {s.bars && (
                <div className="db-mini-bars">
                  {s.bars.map((h, i) => (
                    <div key={i} className={`db-mini-bar ${i === s.bars.length - 1 ? 'db-mini-bar--last' : ''}`} style={{ height: `${h}%` }} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="db-main-grid">
          {/* Create Campaign */}
          <div className="db-campaign-card">
            <h2 className="db-campaign-title">Create Campaign</h2>

            <div className="db-field">
              <label className="db-label" htmlFor="camp-name">Campaign Internal Name</label>
              <input id="camp-name" type="text" placeholder="e.g., Summer Pickleball League Promo" className="db-input" />
            </div>

            <div className="db-field">
              <label className="db-label">Target Audience</label>
              <div className="db-audience-chips">
                {audiences.map(a => (
                  <button key={a} className={`db-audience-chip ${selectedAud.includes(a) ? 'active' : ''}`} onClick={() => toggleAud(a)}>{a}</button>
                ))}
              </div>
            </div>

            <div className="db-field">
              <div className="db-msg-types">
                <button className={`db-msg-type ${msgType === 'push' ? 'active' : ''}`} onClick={() => setMsgType('push')}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                  </svg>
                  <div>
                    <p className="db-msg-type__name">Push Notification</p>
                    <p className="db-msg-type__desc">High urgency, instant delivery</p>
                  </div>
                </button>
                <button className={`db-msg-type ${msgType === 'email' ? 'active' : ''}`} onClick={() => setMsgType('email')}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <div>
                    <p className="db-msg-type__name">Email Newsletter</p>
                    <p className="db-msg-type__desc">Rich content, detailed updates</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="db-field">
              <label className="db-label" htmlFor="msg-body">Message Body</label>
              <div className="db-msg-toolbar">
                <button className="db-toolbar-btn"><strong>B</strong></button>
                <button className="db-toolbar-btn"><em>I</em></button>
                <button className="db-toolbar-btn db-toolbar-btn--variable">⟵⟶ Insert Variable</button>
              </div>
              <textarea
                id="msg-body"
                value={msgBody}
                onChange={e => setMsgBody(e.target.value.slice(0, 250))}
                placeholder="Enter your message here... Use {first_name} to personalize."
                className="db-textarea"
                rows={5}
              />
              <p className="db-char-count">{msgBody.length} / 250 chars</p>
            </div>

            <div className="db-campaign-footer">
              <button className="db-schedule-btn">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                Schedule for later
              </button>
              <div className="db-campaign-actions">
                <button className="btn-outline">Save Draft</button>
                <button className="btn-primary">Send Now</button>
              </div>
            </div>
          </div>

          {/* Recent Broadcasts */}
          <div className="db-recent">
            <div className="db-recent__header">
              <h2 className="db-recent__title">Recent Broadcasts</h2>
              <button className="db-more-btn">···</button>
            </div>
            {recentBroadcasts.map((b, i) => (
              <div key={i} className="db-broadcast-item">
                <div className="db-broadcast-item__top">
                  <span className="db-broadcast-status" style={{ background: b.statusColor + '20', color: b.statusColor }}>{b.status}</span>
                  <span className="db-broadcast-date">{b.date}</span>
                </div>
                <p className="db-broadcast-title">{b.title}</p>
                {b.meta  && <p className="db-broadcast-meta">{b.meta}</p>}
                {b.open  && <div className="db-broadcast-metrics"><span>👁 {b.open}</span><span>🔗 {b.click}</span></div>}
              </div>
            ))}
            <a href="#" className="db-view-history">View All History</a>
          </div>
        </div>
      </div>
    </ProSportDashLayout>
  )
}
