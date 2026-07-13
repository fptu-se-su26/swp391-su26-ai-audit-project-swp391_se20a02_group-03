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
      subtitle: 'Nhập email liên kết với tài khoản của bạn và chúng tôi sẽ gửi mã xác thực.'
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      ),
      title: 'KIỂM TRA\nHỘP THƯ.',
      subtitle: `Chúng tôi đã gửi mã 6 số đến email của bạn. Nhập mã xuống bên dưới để xác thực.`
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      ),
      title: 'ĐẶT\nMẬT KHẨU\nMỚI.',
      subtitle: 'Chọn một mật khẩu mạnh để bảo vệ tài khoản Pro-Sport của bạn.'
    },
  ]

  return (
    <div className="auth-layout">
      {/* ── Visual Panel (Left) ── */}
      <div className="auth-visual">
        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '64px 64px'
        }} />

        <div className="relative z-10 flex flex-col items-start max-w-[480px] px-14" key={step}>
          {/* Logo */}
          <ProSportLogo size="lg" variant="light" className="mb-16" />

          <div className="auth-animate-in">
            {/* Icon */}
            <div className="w-16 h-16 rounded-[2px] border border-white/15 flex items-center justify-center text-accent mb-8">
              {visualContent[step].icon}
            </div>

            {/* Tagline */}
            <h2 className="font-heading text-[clamp(2.2rem,3.5vw,3.4rem)] leading-[0.98] uppercase tracking-[-0.01em] text-paper mb-6 whitespace-pre-line">
              {visualContent[step].title.split('\n').map((line, i) => (
                <span key={i}>
                  {i === visualContent[step].title.split('\n').length - 1
                    ? <span className="text-accent">{line}</span>
                    : line}
                  {i < visualContent[step].title.split('\n').length - 1 && <br />}
                </span>
              ))}
            </h2>

            <p className="text-paper/60 text-[0.95rem] leading-relaxed max-w-[380px] mb-12">
              {visualContent[step].subtitle}
            </p>
          </div>

          {/* Progress dots */}
          <div className="flex items-center gap-2">
            {[0, 1, 2].map(i => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full transition-all duration-500 ${i <= step ? 'bg-accent scale-100' : 'bg-white/20 scale-75'}`} />
                {i < 2 && (
                  <div className={`w-8 h-px transition-all duration-500 ${i < step ? 'bg-accent' : 'bg-white/20'}`} />
                )}
              </div>
            ))}
            <span className="ml-3 label-mono text-paper/50">
              Bước {step + 1} / 3
            </span>
          </div>
        </div>

        <p className="absolute bottom-8 left-14 font-mono text-xs text-paper/40 tracking-wider">
          © {new Date().getFullYear()} PRO-SPORT COMPLEX
        </p>
      </div>

      {/* ── Form Panel (Right) ── */}
      <section className="auth-form">
        {/* Mobile logo */}
        <div className="lg:hidden absolute top-6 left-6">
          <ProSportLogo size="sm" />
        </div>

        <div className="auth-form-inner auth-animate-in-delayed mt-16 lg:mt-0">
          {/* Header */}
          <header className="mb-8">
            <p className="label-mono text-accent mb-3">{'// Khôi phục tài khoản'}</p>
            <h1 className="font-heading text-[2rem] uppercase text-ink tracking-tight leading-tight">
              {step === 0 && <>Đặt lại<br />mật khẩu</>}
              {step === 1 && <>Nhập mã<br />xác thực</>}
              {step === 2 && <>Tạo mật khẩu<br />mới</>}
            </h1>
            <p className="text-sm text-ink/60 mt-3 leading-relaxed">
              {step === 0
                ? "Nhập địa chỉ email liên kết với tài khoản của bạn."
                : step === 1
                  ? `Chúng tôi đã gửi mã OTP 6 số đến ${email}`
                  : "Chọn một mật khẩu mạnh cho tài khoản của bạn."}
            </p>
          </header>

          {/* Error */}
          {error && (
            <div className="bg-danger-bg text-danger text-sm font-medium p-4 rounded-[2px] border-2 border-danger mb-6 text-center auth-animate-fade">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="flex flex-col gap-5" onSubmit={step === 0 ? handleSendOtp : step === 1 ? handleVerifyOtp : handleResetPassword} noValidate>
            {/* Step 0: Email */}
            {step === 0 && (
              <div className="flex flex-col gap-2 auth-animate-slide">
                <label htmlFor="reset-email" className="text-sm font-bold uppercase tracking-[0.05em] text-ink">Thư điện tử</label>
                <div className="relative group">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-ink/40 group-focus-within:text-accent transition-colors duration-300" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <input id="reset-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="email@example.com" className="auth-input pl-11" />
                </div>
              </div>
            )}

            {/* Step 1: OTP */}
            {step === 1 && (
              <div className="flex flex-col items-center gap-6 auth-animate-slide">
                <div className="w-16 h-16 rounded-[2px] bg-accent/10 flex items-center justify-center text-accent">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <label className="text-sm font-bold uppercase tracking-[0.05em] text-ink text-center">Nhập mã OTP</label>
                <div className="flex gap-2.5">
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
                      className="w-12 h-14 text-center text-xl font-bold border-2 border-border-strong rounded-[2px] font-sans text-ink outline-none transition-all duration-300 focus:border-accent focus:ring-2 focus:ring-accent/20 bg-surface focus:bg-surface-hover"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: New Password */}
            {step === 2 && (
              <div className="flex flex-col gap-2 auth-animate-slide">
                <label htmlFor="reset-new-password" className="text-sm font-bold uppercase tracking-[0.05em] text-ink">Mật khẩu mới</label>
                <div className="relative group">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-ink/40 group-focus-within:text-accent transition-colors duration-300" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <input id="reset-new-password" type={showPass ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)} required placeholder="••••••••" className="auth-input pl-11 pr-11" />
                  <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/40 hover:text-accent transition-colors duration-300" onClick={() => setShowPass(!showPass)} aria-label="Hiện/ẩn mật khẩu">
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
            <button disabled={loading} type="submit" className="auth-btn mt-4">
              {loading ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : step === 0 ? 'Gửi mã OTP' : step === 1 ? 'Xác thực OTP' : 'Đặt lại mật khẩu'}
            </button>
          </form>

          {/* Back to login */}
          <Link to="/login" className="mt-10 text-sm font-bold text-ink/60 transition-colors duration-200 hover:text-accent self-center flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Quay lại Đăng nhập
          </Link>
        </div>
      </section>
    </div>
  )
}
