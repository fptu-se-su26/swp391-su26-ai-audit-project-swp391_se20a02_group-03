import { useState, useRef, useEffect } from 'react'
import axiosClient from '../api/axiosClient'
import DOMPurify from 'dompurify'

const QUICK_PROMPTS = [
  '🎾 Còn sân cầu lông trống hôm nay không?',
  '🏸 Tìm kèo pickleball buổi tối',
  '💰 Phí đặt sân bao nhiêu?',
  '📋 Hướng dẫn cách đặt sân',
]

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Xin chào! 👋 Tôi là trợ lý AI của **Pro-Sport Complex**.\n\nTôi có thể giúp bạn:\n• 🏸 Tìm sân trống theo giờ\n• 🤝 Gợi ý kèo giao lưu phù hợp\n• 💳 Hướng dẫn đặt sân & thanh toán\n\nBạn cần hỗ trợ gì?',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [unread, setUnread] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setUnread(false)
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    }
  }, [isOpen, messages])

  const sendMessage = async (text) => {
    const userText = (text || input).trim()
    if (!userText || loading) return

    const newMessages = [...messages, { role: 'user', content: userText }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await axiosClient.post('/chatbot/chat', {
        messages: newMessages.map(m => ({ role: m.role, content: m.content })),
      })
      const reply = res?.data?.reply || res?.reply || 'Xin lỗi, tôi không hiểu yêu cầu đó.'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
      if (!isOpen) setUnread(true)
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ Hệ thống đang gặp sự cố kết nối. Vui lòng thử lại sau.',
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const parseContent = (text) => {
    const html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>')
      .replace(/• /g, '&bull; ')
    return DOMPurify.sanitize(html, { ALLOWED_TAGS: ['strong', 'br', 'em'], ALLOWED_ATTR: [] })
  }

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed', bottom: 88, right: 24, zIndex: 9999,
          width: 360, height: 520,
          background: '#fff',
          borderRadius: 20,
          boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid #e0ecf0',
          animation: 'chatSlideUp 0.25s ease-out',
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #0d8a8a 0%, #0d2d3a 100%)',
            padding: '14px 18px',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, border: '1.5px solid rgba(255,255,255,0.25)',
            }}>🤖</div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 700, color: '#fff', fontSize: 14, fontFamily: 'Inter, sans-serif' }}>
                Pro-Sport AI Assistant
              </p>
              <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>
                {loading ? '✦ Đang soạn câu trả lời...' : '● Trực tuyến 24/7'}
              </p>
            </div>
            <button onClick={() => setIsOpen(false)} style={{
              background: 'rgba(255,255,255,0.12)', border: 'none',
              color: '#fff', cursor: 'pointer', borderRadius: '50%',
              width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, lineHeight: 1, transition: 'background 0.2s',
            }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: 10,
            background: '#f8fbfd',
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-end', gap: 8,
              }}>
                {msg.role === 'assistant' && (
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0d8a8a, #0d2d3a)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, flexShrink: 0, boxShadow: '0 2px 6px rgba(13,138,138,0.3)',
                  }}>🤖</div>
                )}
                <div style={{
                  maxWidth: '78%',
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, #0d8a8a, #00b4a0)'
                    : '#fff',
                  color: msg.role === 'user' ? '#fff' : '#0d2d3a',
                  padding: '9px 13px',
                  borderRadius: msg.role === 'user'
                    ? '14px 14px 4px 14px'
                    : '14px 14px 14px 4px',
                  fontSize: 13, lineHeight: 1.6,
                  boxShadow: msg.role === 'user'
                    ? '0 2px 8px rgba(13,138,138,0.3)'
                    : '0 1px 4px rgba(0,0,0,0.07)',
                  border: msg.role === 'assistant' ? '1px solid #e8f4f7' : 'none',
                }} dangerouslySetInnerHTML={{ __html: parseContent(msg.content) }} />
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0d8a8a, #0d2d3a)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
                }}>🤖</div>
                <div style={{
                  background: '#fff', padding: '10px 16px',
                  borderRadius: '14px 14px 14px 4px',
                  display: 'flex', gap: 5, alignItems: 'center',
                  border: '1px solid #e8f4f7',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                }}>
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <div key={i} style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: '#0d8a8a',
                      animation: `aiBounce 1s ${delay}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Quick prompts — only show at start */}
          {messages.length <= 1 && !loading && (
            <div style={{
              padding: '6px 14px 8px',
              display: 'flex', flexWrap: 'wrap', gap: 6,
              background: '#f8fbfd',
              borderTop: '1px solid #e8f4f7',
            }}>
              {QUICK_PROMPTS.map(q => (
                <button key={q} onClick={() => sendMessage(q)} style={{
                  fontSize: 11, padding: '5px 10px', borderRadius: 20,
                  border: '1.5px solid #0d8a8a20', background: 'rgba(13,138,138,0.07)',
                  color: '#0d8a8a', cursor: 'pointer', fontWeight: 600,
                  fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.2s',
                }}>{q}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: '10px 14px',
            borderTop: '1px solid #e0ecf0',
            display: 'flex', gap: 8, alignItems: 'flex-end', background: '#fff',
          }}>
            <textarea
              id="chatbot-input"
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Nhập câu hỏi... (Enter để gửi)"
              style={{
                flex: 1, resize: 'none',
                border: '1.5px solid #e0ecf0',
                borderRadius: 12, padding: '8px 12px',
                fontFamily: 'Inter, sans-serif', fontSize: 13,
                outline: 'none', transition: 'border-color 0.2s',
                lineHeight: 1.5, maxHeight: 100, overflowY: 'auto',
                background: '#f8fbfd', color: '#0d2d3a',
              }}
              onFocus={e => e.target.style.borderColor = '#0d8a8a'}
              onBlur={e => e.target.style.borderColor = '#e0ecf0'}
            />
            <button
              id="chatbot-send-btn"
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              style={{
                width: 38, height: 38, borderRadius: '50%', border: 'none',
                background: loading || !input.trim()
                  ? '#d1d5db'
                  : 'linear-gradient(135deg, #0d8a8a, #00b4a0)',
                color: '#fff',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'all 0.2s',
                boxShadow: loading || !input.trim() ? 'none' : '0 2px 8px rgba(13,138,138,0.4)',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* FAB Button */}
      <button
        id="chatbot-fab-btn"
        onClick={() => setIsOpen(o => !o)}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          width: 56, height: 56, borderRadius: '50%', border: 'none',
          background: isOpen
            ? '#0d2d3a'
            : 'linear-gradient(135deg, #0d8a8a 0%, #0d2d3a 100%)',
          color: '#fff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(13,138,138,0.5)',
          transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {isOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
        {/* Unread badge */}
        {unread && !isOpen && (
          <span style={{
            position: 'absolute', top: 4, right: 4,
            width: 12, height: 12, borderRadius: '50%',
            background: '#ef4444', border: '2px solid #fff',
          }} />
        )}
        {/* Pulse ring when closed */}
        {!isOpen && (
          <span style={{
            position: 'absolute', inset: -4,
            borderRadius: '50%', border: '2px solid rgba(13,138,138,0.4)',
            animation: 'aiPulse 2s infinite',
          }} />
        )}
      </button>

      <style>{`
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes aiBounce {
          0%, 100% { transform: translateY(0); opacity: 0.6; }
          50%       { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes aiPulse {
          0%   { transform: scale(1); opacity: 0.7; }
          70%  { transform: scale(1.4); opacity: 0; }
          100% { transform: scale(1.4); opacity: 0; }
        }
      `}</style>
    </>
  )
}
