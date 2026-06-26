import { useState, useRef, useEffect } from 'react'
import axiosClient from '../api/axiosClient'
import DOMPurify from 'dompurify'

const QUICK_PROMPTS = [
  '🎾 Còn sân cầu lông trống hôm nay không?',
  '🏸 Tìm kèo pickleball buổi tối',
  '💰 Phí đặt sân bao nhiêu?',
  '📋 Hướng dẫn cách đặt sân',
]

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Xin chào! 👋 Tôi là trợ lý AI của **Pro-Sport Complex**. Tôi có thể giúp bạn tìm sân trống, gợi ý kèo giao lưu, và giải đáp mọi thắc mắc về hệ thống. Bạn cần hỗ trợ gì?',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [unread, setUnread] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    if (open) {
      setUnread(false)
      endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [open, messages])

  async function sendMessage(text) {
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
      // axiosClient interceptor already unwraps response.data, so res IS data
      const reply = res?.data?.reply || res?.reply || 'Xin lỗi, tôi không hiểu yêu cầu đó.'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
      if (!open) setUnread(true)
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ Hệ thống đang gặp sự cố, vui lòng thử lại sau.',
      }])
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Markdown parser + XSS sanitization via DOMPurify
  function parseContent(text) {
    const html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>')
    return DOMPurify.sanitize(html, { ALLOWED_TAGS: ['strong', 'br', 'em'], ALLOWED_ATTR: [] })
  }

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999 }}>
      {/* Chat Window */}
      {open && (
        <div style={{
          position: 'absolute', bottom: 72, right: 0,
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
            background: 'linear-gradient(135deg, #14B8A6 0%, #0F172A 100%)',
            padding: '14px 18px',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
            }}>🤖</div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 700, color: '#fff', fontSize: 14 }}>Pro-Sport AI Assistant</p>
              <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>
                {loading ? 'Đang trả lời...' : '● Trực tuyến'}
              </p>
            </div>
            <button onClick={() => setOpen(false)} style={{
              background: 'rgba(255,255,255,0.12)', border: 'none',
              color: '#fff', cursor: 'pointer', borderRadius: '50%',
              width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, lineHeight: 1,
            }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-end', gap: 8,
              }}>
                {msg.role === 'assistant' && (
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #14B8A6, #0F172A)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, flexShrink: 0,
                  }}>🤖</div>
                )}
                <div style={{
                  maxWidth: '75%',
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, #14B8A6, #00b4a0)'
                    : '#f0f7fa',
                  color: msg.role === 'user' ? '#fff' : '#0F172A',
                  padding: '9px 13px',
                  borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  fontSize: 13, lineHeight: 1.55,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                }} dangerouslySetInnerHTML={{ __html: parseContent(msg.content) }} />
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #14B8A6, #0F172A)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
                }}>🤖</div>
                <div style={{
                  background: '#f0f7fa', padding: '10px 14px', borderRadius: '14px 14px 14px 4px',
                  display: 'flex', gap: 4, alignItems: 'center',
                }}>
                  {[0, 0.2, 0.4].map((d, i) => (
                    <div key={i} style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: '#14B8A6', opacity: 0.6,
                      animation: `bounce 1s ${d}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Quick prompts */}
          {messages.length <= 1 && (
            <div style={{ padding: '0 14px 8px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {QUICK_PROMPTS.map(q => (
                <button key={q} onClick={() => sendMessage(q)} style={{
                  fontSize: 11, padding: '5px 10px', borderRadius: 20,
                  border: '1.5px solid #14B8A6', background: 'rgba(13,138,138,0.06)',
                  color: '#14B8A6', cursor: 'pointer', fontWeight: 600,
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
              placeholder="Nhập câu hỏi của bạn..."
              style={{
                flex: 1, resize: 'none', border: '1.5px solid #e0ecf0',
                borderRadius: 12, padding: '8px 12px',
                fontFamily: 'Inter, sans-serif', fontSize: 13, outline: 'none',
                transition: 'border-color 0.2s', lineHeight: 1.5,
                maxHeight: 100, overflowY: 'auto',
              }}
              onFocus={e => e.target.style.borderColor = '#14B8A6'}
              onBlur={e => e.target.style.borderColor = '#e0ecf0'}
            />
            <button
              id="chatbot-send-btn"
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              style={{
                width: 38, height: 38, borderRadius: '50%', border: 'none',
                background: loading || !input.trim() ? '#ccc' : 'linear-gradient(135deg, #14B8A6, #00b4a0)',
                color: '#fff', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(13,138,138,0.3)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* FAB Toggle Button */}
      <button
        id="chatbot-fab-btn"
        onClick={() => setOpen(o => !o)}
        style={{
          width: 56, height: 56, borderRadius: '50%', border: 'none',
          background: open
            ? '#0F172A'
            : 'linear-gradient(135deg, #14B8A6 0%, #0F172A 100%)',
          color: '#fff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(13,138,138,0.45)',
          transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          transform: open ? 'rotate(0deg) scale(1)' : 'rotate(0deg) scale(1)',
          position: 'relative',
        }}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
        {/* Unread dot */}
        {unread && !open && (
          <span style={{
            position: 'absolute', top: 4, right: 4,
            width: 12, height: 12, borderRadius: '50%',
            background: '#ef4444', border: '2px solid #fff',
          }} />
        )}
      </button>

      <style>{`
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  )
}
