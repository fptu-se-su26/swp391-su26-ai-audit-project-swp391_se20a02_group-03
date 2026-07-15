import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PasswordStrengthMeter from '../components/PasswordStrengthMeter'
import { useToast } from '../components/Toast'
import authApi from '../api/authApi'
import ProSportLogo from '../components/ui/ProSportLogo'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [newPassword, setNewPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const toast = useToast()

  async function handleSendOtp(e) {
    e.preventDefault()
    if (!email) {
      setError('Vui lòng nhập email của bạn.')
      return
    }
    setError(null)
    setLoading(true)
    try {
      await authApi.forgotPassword({ email })
      setStep(1)
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Gửi OTP thất bại. Email có thể không tồn tại.')
    } finally {
      setLoading(false)
    }
  }

  async function handleOtpChange(index, value) {
    if (value && isNaN(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    
    if (value && index < 5) {
      const nextInput = document.getElementById(`reset-otp-${index + 1}`)
      if (nextInput) nextInput.focus()
    }

    const currentOtpCode = newOtp.join('')
    if (currentOtpCode.length === 6 && currentOtpCode.trim().length === 6) {
      await autoVerifyOtp(currentOtpCode)
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`reset-otp-${index - 1}`)
      if (prevInput) {
        prevInput.focus()
      }
    }
  }

  async function handlePaste(e) {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text/plain').trim()
    const match = pastedData.match(/^\d{6}$/)
    if (match) {
      const digits = match[0].split('')
      setOtp(digits)
      const lastInput = document.getElementById('reset-otp-5')
      if (lastInput) lastInput.focus()
      
      await autoVerifyOtp(match[0])
    }
  }

  async function autoVerifyOtp(otpCode) {
    setError(null)
    setLoading(true)
    try {
      await authApi.verifyOtp({ email, otpCode, type: 'ResetPassword' })
      setStep(2)
    } catch (err) {
      setError(typeof err === 'string' ? err : 'OTP không hợp lệ hoặc đã hết hạn.')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault()
    await autoVerifyOtp(otp.join(''))
  }

  async function handleResetPassword(e) {
    e.preventDefault()
    const otpCode = otp.join('')
    if (!newPassword || newPassword.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự.')
      return
    }

    setError(null)
    setLoading(true)
    try {
      await authApi.resetPassword({ email, otpCode, newPassword })
      toast('Đổi mật khẩu thành công! Vui lòng đăng nhập.', 'success')
      navigate('/login')
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Đổi mật khẩu thất bại.')
    } finally {
      setLoading(false)
    }
  }

  /* ── Visual panel content per step ── */
  const visualContent = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
      ),
      title: 'KHÔI PHỤC\nQUYỀN\nTRUY CẬP.',
      subtitle: 'Nhập email liên kết với tài khoản của bạn và chúng tôi sẽ gửi mã xác thực.',
      stepLabel: 'BƯỚC 1: XÁC THỰC EMAIL'
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      ),
      title: 'KIỂM TRA\nHỘP THƯ.',
      subtitle: `Chúng tôi đã gửi mã 6 số đến email của bạn. Nhập mã xuống bên dưới để xác thực.`,
      stepLabel: 'BƯỚC 2: NHẬP MÃ OTP'
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      ),
      title: 'ĐẶT\nMẬT KHẨU\nMỚI.',
      subtitle: 'Chọn một mật khẩu mạnh để bảo vệ tài khoản Pro-Sport của bạn.',
      stepLabel: 'BƯỚC 3: MẬT KHẨU MỚI'
    },
  ]

  /* ── Shared dark-input style ── */
  const inputStyle = {
    backgroundColor: 'transparent',
    border: '1.5px solid rgba(255,255,255,0.18)',
    color: '#f3f2ee',
    borderRadius: '4px',
    height: '52px',
    width: '100%',
    paddingLeft: '44px',
    paddingRight: '16px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
  }

  const otpInputStyle = {
    backgroundColor: 'transparent',
    border: '1.5px solid rgba(255,255,255,0.18)',
    color: '#f3f2ee',
    borderRadius: '4px',
    width: '48px',
    height: '56px',
    textAlign: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
    outline: 'none',
    transition: 'border-color 0.2s',
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', sans-serif" }}>
      {/* ══════════════════════════════════════════
          LEFT — Visual Panel
          ══════════════════════════════════════════ */}
      <div
        className="hidden lg:flex"
        style={{
          width: '50%',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#050810',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px 56px',
        }}
      >
        {/* Background sports image - Pickleball focus */}
        <img
          src="https://images.unsplash.com/photo-1688647565345-d41ee04bb15c?w=1920&q=80"
          alt="Focus"
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
            filter: 'brightness(0.35)',
          }}
        />

        {/* Animated network grid overlay */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0,
            backgroundImage:
              'linear-gradient(rgba(20,184,166,0.08) 1px, transparent 1px),' +
              'linear-gradient(90deg, rgba(20,184,166,0.08) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />

        {/* Left-to-right gradient so text stays readable */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(5,8,16,0.70) 0%, rgba(5,8,16,0.15) 100%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(5,8,16,0.80) 0%, transparent 60%)',
        }} />

        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100%' }} key={step}>
          {/* Logo */}
          <ProSportLogo size="lg" variant="light" className="mb-16" />

          <div className="auth-animate-in" style={{ marginTop: 'auto', marginBottom: '80px', maxWidth: '480px' }}>
            {/* Icon */}
            <div style={{
              width: '64px', height: '64px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#14b8a6', marginBottom: '32px'
            }}>
              {visualContent[step].icon}
            </div>

            {/* Tagline */}
            <h2 style={{
              fontFamily: "'Montserrat', 'Be Vietnam Pro', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(2.2rem, 3.5vw, 3.4rem)',
              lineHeight: 0.98,
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              color: '#F5F5F5',
              marginBottom: '24px',
              whiteSpace: 'pre-line'
            }}>
              {visualContent[step].title.split('\n').map((line, i) => (
                <span key={i}>
                  {i === visualContent[step].title.split('\n').length - 1
                    ? <span style={{ color: '#14b8a6' }}>{line}</span>
                    : line}
                  {i < visualContent[step].title.split('\n').length - 1 && <br />}
                </span>
              ))}
            </h2>

            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: '380px' }}>
              {visualContent[step].subtitle}
            </p>
          </div>
        </div>

        <p style={{
          position: 'relative', zIndex: 10,
          fontFamily: "'JetBrains Mono',monospace",
          fontSize: '11px', color: 'rgba(255,255,255,0.30)',
          letterSpacing: '0.08em',
        }}>
          © {new Date().getFullYear()} PRO-SPORT COMPLEX
        </p>
      </div>

      {/* ══════════════════════════════════════════
          RIGHT — Form Panel (Dark, High-Contrast)
          ══════════════════════════════════════════ */}
      <section style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 48px',
        backgroundColor: '#111317',
        overflowY: 'auto',
        position: 'relative',
      }}>
        {/* Mobile logo */}
        <div className="lg:hidden" style={{ position: 'absolute', top: '24px', left: '24px' }}>
          <ProSportLogo size="sm" variant="light" />
        </div>

        <div style={{ width: '100%', maxWidth: '480px', marginTop: '0' }} className="auth-animate-in-delayed">
          {/* ── Header ── */}
          <header style={{ marginBottom: '36px' }}>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '12px', fontWeight: 800,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: '#14b8a6', marginBottom: '14px',
            }}>
              {visualContent[step].stepLabel}
            </p>
            <h1 style={{
              fontFamily: "'Montserrat', 'Be Vietnam Pro', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(1.7rem, 3vw, 2.2rem)',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              lineHeight: 1.1,
              color: '#F5F5F5',
              marginBottom: '10px',
            }}>
              {step === 0 && <>Đặt lại<br />mật khẩu</>}
              {step === 1 && <>Nhập mã<br />xác thực</>}
              {step === 2 && <>Tạo mật khẩu<br />mới</>}
            </h1>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.65 }}>
              {step === 0
                ? "Nhập địa chỉ email liên kết với tài khoản của bạn."
                : step === 1
                  ? `Chúng tôi đã gửi mã OTP 6 số đến ${email}`
                  : "Chọn một mật khẩu mạnh cho tài khoản của bạn."}
            </p>
          </header>

          {/* ── Error Banner ── */}
          {error && (
            <div className="auth-animate-fade" style={{
              backgroundColor: 'rgba(178,59,59,0.15)',
              border: '1.5px solid rgba(178,59,59,0.5)',
              borderRadius: '4px',
              padding: '14px 16px',
              marginBottom: '20px',
              color: '#fca5a5',
              fontSize: '14px',
              fontWeight: 600,
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          {/* ── Form ── */}
          <form onSubmit={step === 0 ? handleSendOtp : step === 1 ? handleVerifyOtp : handleResetPassword} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Step 0: Email */}
            {step === 0 && (
              <div className="auth-animate-slide" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label htmlFor="reset-email" style={{
                  fontSize: '12px', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.07em',
                  color: 'rgba(255,255,255,0.75)',
                }}>
                  Thư điện tử
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)', pointerEvents: 'none' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </span>
                  <input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="email@example.com"
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#14b8a6'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.18)'}
                  />
                </div>
              </div>
            )}

            {/* Step 1: OTP */}
            {step === 1 && (
              <div className="auth-animate-slide" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '4px', backgroundColor: 'rgba(20,184,166,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#14b8a6'
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <label style={{
                  fontSize: '12px', fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.07em', color: 'rgba(255,255,255,0.75)', textAlign: 'center'
                }}>Nhập mã OTP</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {[0,1,2,3,4,5].map(i => (
                    <input
                      key={i}
                      id={`reset-otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      autoComplete={i === 0 ? "one-time-code" : "off"}
                      maxLength={1}
                      value={otp[i]}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      onPaste={i === 0 ? handlePaste : undefined}
                      style={otpInputStyle}
                      onFocus={e => {
                        e.target.style.borderColor = '#14b8a6'
                        e.target.style.boxShadow = '0 0 0 2px rgba(20,184,166,0.2)'
                        e.target.style.backgroundColor = 'rgba(20,184,166,0.05)'
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = 'rgba(255,255,255,0.18)'
                        e.target.style.boxShadow = 'none'
                        e.target.style.backgroundColor = 'transparent'
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: New Password */}
            {step === 2 && (
              <div className="auth-animate-slide" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label htmlFor="reset-new-password" style={{
                  fontSize: '12px', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.07em',
                  color: 'rgba(255,255,255,0.75)',
                }}>Mật khẩu mới</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)', pointerEvents: 'none' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <input
                    id="reset-new-password"
                    type={showPass ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    style={{ ...inputStyle, paddingRight: '44px' }}
                    onFocus={e => e.target.style.borderColor = '#14b8a6'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.18)'}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} aria-label="Hiện/ẩn mật khẩu" style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.40)', padding: 0 }}>
                    {showPass
                      ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="1" y1="1" x2="23" y2="23"/><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/></svg>
                      : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
                {newPassword && <PasswordStrengthMeter password={newPassword} />}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', height: '52px',
                backgroundColor: loading ? 'rgba(20,184,166,0.6)' : '#14b8a6',
                color: '#050810',
                border: 'none', borderRadius: '4px',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 800, fontSize: '14px',
                textTransform: 'uppercase', letterSpacing: '0.06em',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'background-color 0.2s',
                marginTop: '12px',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#17cdbe' }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = '#14b8a6' }}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : step === 0 ? 'Gửi mã OTP' : step === 1 ? 'Xác thực OTP' : 'Đặt lại mật khẩu'}
            </button>
          </form>

          {/* Back to login */}
          <Link
            to="/login"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              marginTop: '40px', fontSize: '14px', fontWeight: 700,
              color: 'rgba(255,255,255,0.7)', textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#14b8a6'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Quay lại Đăng nhập
          </Link>
        </div>
      </section>
    </div>
  )
}
