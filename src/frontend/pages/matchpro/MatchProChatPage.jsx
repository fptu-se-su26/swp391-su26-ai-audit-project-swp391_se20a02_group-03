import { useState } from 'react'
import MatchProLayout from '../../layouts/MatchProLayout'
import './MatchProChatPage.css'

const conversations = [
  {
    id: 1,
    name: 'Downtown 3v3 Pickup',
    icon: '🏸',
    iconBg: '#0d8a8a',
    lastMsg: 'Alex: See you guys at 5!',
    time: 'Now',
    online: true,
    unread: true,
  },
  {
    id: 2,
    name: 'Weekend Doubles',
    icon: '🏸',
    iconBg: '#f59e0b',
    lastMsg: 'System: Match confirmed for Sun...',
    time: '10:30 AM',
    online: false,
    unread: false,
  },
]

const messages = [
  { id: 1, type: 'system', text: 'Match location confirmed: Rucker Park Court 2' },
  {
    id: 2,
    type: 'other',
    sender: 'Marcus T.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80',
    text: "I'm bringing the game ball. Anyone need a ride from downtown?",
    time: '10:42 AM',
    reaction: '🏸 2',
  },
  {
    id: 3,
    type: 'self',
    text: '@Marcus I could use a lift! Meet at the usual spot?',
    time: '10:45 AM',
  },
  { id: 4, type: 'system', text: 'Sarah J. joined the match', icon: '👤' },
]

export default function MatchProChatPage() {
  const [active, setActive] = useState(1)
  const [input, setInput] = useState('')

  const activeCon = conversations.find(c => c.id === active)

  return (
    <MatchProLayout>
      <div className="mp-chat-page">
        {/* Left: conversation list */}
        <div className="mp-chat-list">
          <h2 className="mp-chat-list__title">Messages</h2>
          <div className="mp-chat-search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Search chats..." id="chat-search" />
          </div>
          {conversations.map(c => (
            <button
              key={c.id}
              className={`mp-chat-item ${active === c.id ? 'mp-chat-item--active' : ''}`}
              onClick={() => setActive(c.id)}
            >
              <div className="mp-chat-item__icon" style={{background: c.iconBg}}>
                {c.icon}
                {c.online && <span className="mp-chat-item__dot" />}
              </div>
              <div className="mp-chat-item__info">
                <p className="mp-chat-item__name">{c.name}</p>
                <p className="mp-chat-item__last">{c.lastMsg}</p>
              </div>
              <span className="mp-chat-item__time">{c.time}</span>
            </button>
          ))}
        </div>

        {/* Right: chat window */}
        <div className="mp-chat-window">
          {/* Header */}
          <div className="mp-chat-window__header">
            <div className="mp-chat-window__icon" style={{background: activeCon.iconBg}}>
              {activeCon.icon}
            </div>
            <div>
              <h3 className="mp-chat-window__name">{activeCon.name}</h3>
              <p className="mp-chat-window__meta">📍 Rucker Park · 6/6 Players Joined</p>
            </div>
            <div className="mp-chat-window__timer">
              <p className="mp-chat-window__timer-label">STARTS IN</p>
              <p className="mp-chat-window__timer-value">02:15:45</p>
            </div>
          </div>

          {/* Messages */}
          <div className="mp-chat-messages">
            {messages.map(m => {
              if (m.type === 'system') return (
                <div key={m.id} className="mp-msg-system">
                  {m.icon && <span>{m.icon}</span>}
                  <span>{m.text}</span>
                </div>
              )
              if (m.type === 'other') return (
                <div key={m.id} className="mp-msg-other">
                  <div className="mp-msg-other__meta">
                    <span className="mp-msg-other__name">{m.sender}</span>
                    <span className="mp-msg-other__time">{m.time}</span>
                  </div>
                  <div className="mp-msg-other__bubble">{m.text}</div>
                  {m.reaction && (
                    <div className="mp-msg-reaction">
                      <img src={messages[1].avatar} alt="" className="mp-msg-reaction__avatar" />
                      <span>{m.reaction}</span>
                    </div>
                  )}
                </div>
              )
              if (m.type === 'self') return (
                <div key={m.id} className="mp-msg-self">
                  <div className="mp-msg-self__meta">
                    <span className="mp-msg-self__time">{m.time}</span>
                    <span className="mp-msg-self__you">You</span>
                  </div>
                  <div className="mp-msg-self__bubble">{m.text}</div>
                </div>
              )
              return null
            })}
          </div>

          {/* Input */}
          <div className="mp-chat-input">
            <button className="mp-chat-input__add" aria-label="Attach">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            </button>
            <input
              type="text"
              placeholder="Type a message..."
              id="chat-message-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              className="mp-chat-input__field"
            />
            <button className="mp-chat-input__emoji" aria-label="Emoji">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
            </button>
            <button className="mp-chat-input__send" aria-label="Send">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>
      </div>
    </MatchProLayout>
  )
}
