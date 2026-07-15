import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PasswordStrengthMeter from '../components/PasswordStrengthMeter'
import { useToast } from '../components/Toast'
import authApi from '../api/authApi'
import { useAuth } from '../context/AuthContext'
import ProSportLogo from '../components/ui/ProSportLogo'
import GoogleSignInButton from '../components/auth/GoogleSignInButton'
import { extractAuthPayload, mapGoogleAuthError } from '../utils/googleAuth'

const steps = ['Chi tiết', 'Sở thích', 'Xác thực']

function isDuplicateEmailError(message) {
  if (!message || typeof message !== 'string') return false
  const m = message.toLowerCase()
  return m.includes('email already exists') || (m.includes('email') && m.includes('already'))
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [agreed, setAgreed] = useState(false)
  
  // Form Data
  const [fullName, setFullName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  
  const [registeredUserId, setRegisteredUserId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sportPreferences, setSportPreferences] = useState([])
  const toast = useToast()
  const { login } = useAuth()
  
  // Real-time Field Errors
  const [fieldErrors, setFieldErrors] = useState({})

  function validateField(name, value) {
    let errMsg = ""
    switch (name) {
      case 'fullName':
        if (!value.trim()) errMsg = "Trường bắt buộc."
        else if (!/^[a-zA-Z\sÀ-ỹ]+$/.test(value.trim())) errMsg = "Không chứa số hoặc ký tự đặc biệt."
        break;
      case 'phoneNumber':
        if (value.trim() && !/(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(value.trim())) errMsg = "Số điện thoại VN không hợp lệ."
        break;
      case 'email':
        if (!value.trim()) errMsg = "Trường bắt buộc."
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) errMsg = "Vui lòng nhập đúng định dạng email."
        break;
      case 'password':
        if (!value) errMsg = "Trường bắt buộc."
        else if (!/^(?=.*[0-9]).{8,}$/.test(value)) errMsg = "Tối thiểu 8 ký tự, ít nhất 1 số."
        if (confirmPassword && confirmPassword !== value) {
          setFieldErrors(prev => ({ ...prev, confirmPassword: "Mật khẩu không khớp." }))
        } else if (confirmPassword) {
          setFieldErrors(prev => ({ ...prev, confirmPassword: "" }))
        }
        break;
      case 'confirmPassword':
        if (value !== password) errMsg = "Mật khẩu không khớp."
        break;
      default:
        break;
    }
    setFieldErrors(prev => ({ ...prev, [name]: errMsg }))
    return errMsg === ""
  }

  function handleBlur(e) {
    validateField(e.target.name, e.target.value)
  }

  async function handleRegister() {
    const isNameValid = validateField('fullName', fullName)
    const isPhoneValid = validateField('phoneNumber', phoneNumber)
    const isEmailValid = validateField('email', email)
    const isPassValid = validateField('password', password)
    const isConfirmValid = validateField('confirmPassword', confirmPassword)

    if (!isNameValid || !isPhoneValid || !isEmailValid || !isPassValid || !isConfirmValid) {
      return false
    }

    if (!agreed) {
      setError("Bạn phải đồng ý với Điều khoản & Điều kiện.")
      return false
    }

    setError(null)
    setLoading(true)
    try {
      const response = await authApi.register({
        fullName,
        email,
        password,
        phoneNumber
      })
      setRegisteredUserId(response.data || 0)
      return true
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Đăng ký thất bại. Email có thể đã tồn tại.')
      return false
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyOtpWithCode(otpCodeToVerify) {
    setError(null)
    setLoading(true)
    try {
      await authApi.verifyOtp({
        userId: registeredUserId,
        otpCode: otpCodeToVerify,
        type: 'Register'
      })
      return true
    } catch (err) {
      setError(typeof err === 'string' ? err : 'OTP không hợp lệ hoặc đã hết hạn.')
      return false
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyOtp() {
    const otpCode = otp.join('')
    if (otpCode.length < 6) {
      setError("Vui lòng nhập 6 số OTP.")
      return false
    }
    return await handleVerifyOtpWithCode(otpCode)
  }

  async function handleResendOtp() {
    setError(null)
    setLoading(true)
    try {
      await authApi.resendOtp({ email, type: 'Register' })
      toast("Một mã OTP mới đã được gửi đến email của bạn.", 'info')
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Gửi lại mã OTP thất bại.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleSuccess(credentialResponse) {
    setError(null)
    setLoading(true)
    try {
      if (!credentialResponse?.credential) {
        setError('Không nhận được token từ Google.')
        return
      }
      const response = await authApi.googleLogin({ googleIdToken: credentialResponse.credential })
      const auth = extractAuthPayload(response)
      if (auth.token) {
        login(auth.token, {
          userId: auth.userId,
          fullName: auth.fullName,
          email: auth.email,
          role: auth.role,
          avatarUrl: auth.avatarUrl,
        }, true)
        if (auth.isProfileComplete === false) {
          navigate('/complete-profile')
        } else {
          navigate('/')
        }
      } else {
        setError('Đăng nhập Google thất bại. Không nhận được token.')
      }
    } catch (err) {
      setError(mapGoogleAuthError(err))
    } finally {
      setLoading(false)
    }
  }

  async function next(e) {
    e.preventDefault()
    
    if (step === 0) {
      const success = await handleRegister()
      if (success) setStep(1)
    } else if (step === 1) {
      setStep(2)
    } else if (step === 2) {
      const success = await handleVerifyOtp()
      if (success) {
        toast('Tạo tài khoản thành công! Vui lòng đăng nhập.', 'success')
        navigate('/login')
      }
    }
  }

  async function handleOtpChange(index, value) {
    if (value && isNaN(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      if (nextInput) nextInput.focus()
    }

    const currentOtpCode = newOtp.join('')
    if (currentOtpCode.length === 6 && currentOtpCode.trim().length === 6) {
      const success = await handleVerifyOtpWithCode(currentOtpCode)
      if (success) {
        toast('Tạo tài khoản thành công! Vui lòng đăng nhập.', 'success')
        navigate('/login')
      }
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
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
      const lastInput = document.getElementById('otp-5')
      if (lastInput) lastInput.focus()
      
      const success = await handleVerifyOtpWithCode(match[0])
      if (success) {
        toast('Tạo tài khoản thành công! Vui lòng đăng nhập.', 'success')
        navigate('/login')
      }
    }
  }

  /* ── Visual panel content per step ── */
  const visualContent = [
    { title: 'THAM GIA\nMẠNG LƯỚI\nĐỈNH CAO.', subtitle: 'Tạo tài khoản và bắt đầu đặt sân, kết nối với người chơi và hơn thế nữa.' },
    { title: 'BẠN CHƠI\nMÔN THỂ THAO\nNÀO.', subtitle: 'Giúp chúng tôi cá nhân hóa trải nghiệm theo sở thích thể thao của bạn.' },
    { title: 'SẮP\nHOÀN THÀNH.', subtitle: 'Xác thực email để kích hoạt tài khoản Pro-Sport của bạn.' },
  ]

  return (
    <div className="auth-layout">
      {/* ── Visual Panel (Left) ── */}
      <div className="auth-visual" style={{ position: 'relative' }}>
        {/* Sports hero background image */}
        <div className="absolute inset-0 z-0" style={{
          backgroundImage: 'url(/sports-hero-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }} />

        {/* Dark gradient overlay for readability */}
        <div className="absolute inset-0 z-[1]" style={{
          background: 'linear-gradient(135deg, rgba(10,18,30,0.82) 0%, rgba(10,18,30,0.55) 60%, rgba(10,18,30,0.75) 100%)',
        }} />

        {/* Decorative grid pattern */}
        <div className="absolute inset-0 z-[2] opacity-[0.04]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)',
          backgroundSize: '64px 64px'
        }} />

        <div className="relative z-10 flex flex-col items-start max-w-[480px] px-14">
          {/* Logo */}
          <ProSportLogo size="lg" variant="light" className="mb-16" />

          {/* Tagline — fixed, not step-dependent */}
          <div className="auth-animate-in">
            <h2 className="font-heading text-[clamp(2.2rem,3.5vw,3.4rem)] leading-[0.98] uppercase tracking-[-0.01em] text-paper mb-6 whitespace-pre-line">
              {'THAM GIA\nMẠNG LƯỚI\nĐỈNH CAO.'.split('\n').map((line, i, arr) => (
                <span key={i}>
                  {i === arr.length - 1 ? <span className="text-accent">{line}</span> : line}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
            </h2>
            <p className="text-paper/60 text-[0.95rem] leading-relaxed max-w-[380px]">
              Tạo tài khoản và bắt đầu đặt sân, kết nối với người chơi và hơn thế nữa.
            </p>
          </div>
        </div>

        <p className="absolute bottom-8 left-14 font-mono text-xs text-paper/40 tracking-wider z-10">
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

          {/* ── Linear 3-step Progress Bar ── */}
          <div className="mb-8">
            {/* Step bars */}
            <div className="flex gap-1.5 mb-3">
              {steps.map((_, i) => (
                <div key={i} className="flex-1 h-1 rounded-full overflow-hidden" style={{backgroundColor:'rgba(255,255,255,0.1)'}}>
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: i < step ? '100%' : i === step ? '100%' : '0%',
                      backgroundColor: i <= step ? '#14b8a6' : 'transparent',
                    }}
                  />
                </div>
              ))}
            </div>
            {/* Step label */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wide" style={{color:'#14b8a6'}}>
                {step === 0 && 'Bước 1/3: Thông tin cá nhân'}
                {step === 1 && 'Bước 2/3: Sở thích thể thao'}
                {step === 2 && 'Bước 3/3: Xác thực email'}
              </span>
              <span className="text-xs" style={{color:'rgba(255,255,255,0.3)'}}>✓ {step}/3 hoàn thành</span>
            </div>
          </div>

          {/* Header */}
          <header className="mb-7">
            <h1 className="font-heading text-[2rem] uppercase tracking-tight leading-tight" style={{color:'#f3f2ee'}}>
              {step === 0 && <>Bắt đầu với<br />Pro-Sport</>}
              {step === 1 && <>Chọn môn thể thao<br />của bạn</>}
              {step === 2 && <>Xác thực email<br />của bạn</>}
            </h1>
            <p className="text-sm mt-2 leading-relaxed" style={{color:'rgba(255,255,255,0.5)'}}>
              {step === 0 && 'Điền thông tin để tạo tài khoản vận động viên của bạn.'}
              {step === 1 && 'Chọn các môn thể thao bạn chơi để cá nhân hóa bảng tin.'}
              {step === 2 && `Chúng tôi đã gửi mã 6 số đến ${email}`}
            </p>
          </header>

          {/* Error */}
          {error && isDuplicateEmailError(error) ? (
            <div className="bg-warning-bg p-4 rounded-[2px] border-2 border-warning mb-6 flex flex-col items-center text-center auth-animate-fade">
              <span className="text-warning text-sm font-semibold mb-3">
                Email này đã được đăng ký.
              </span>
              <div className="flex gap-3 w-full">
                <Link to="/login" className="flex-1 py-2.5 text-sm font-bold bg-surface text-ink border-2 border-border-strong rounded-[2px] text-center hover:bg-surface-hover transition-colors duration-200">
                  Đăng nhập ngay
                </Link>
                <Link to="/reset-password" className="flex-1 py-2.5 text-sm font-bold bg-warning-bg text-warning border-2 border-warning rounded-[2px] text-center hover:opacity-80 transition-colors duration-200">
                  Quên mật khẩu?
                </Link>
              </div>
            </div>
          ) : error && (
            <div className="bg-danger-bg text-danger text-sm font-medium p-4 rounded-[2px] border-2 border-danger mb-6 text-center auth-animate-fade">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="flex flex-col gap-5" onSubmit={next} noValidate>
            {/* ── Step 0: Details ── */}
            {step === 0 && (
              <div className="flex flex-col gap-5 auth-animate-slide" key="step-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div className="flex flex-col gap-2 relative">
                    <label htmlFor="reg-name" className="text-sm font-semibold" style={{color:'rgba(255,255,255,0.85)'}}>Họ và Tên</label>
                    <div className="relative group">
                      <svg className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-300 ${fieldErrors.fullName ? 'text-red-400' : 'text-accent'}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      <input id="reg-name" name="fullName" type="text" value={fullName} onBlur={handleBlur} onChange={e => { setFullName(e.target.value); if (fieldErrors.fullName) validateField('fullName', e.target.value) }} required placeholder="Nguyễn Văn A" className={`auth-input pl-11 ${fieldErrors.fullName ? 'border-red-400 focus:border-red-500 focus:ring-red-400/20' : ''}`} />
                    </div>
                    {fieldErrors.fullName && <span className="text-xs text-red-400 font-medium">{fieldErrors.fullName}</span>}
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-2 relative">
                    <label htmlFor="reg-phone" className="text-sm font-semibold" style={{color:'rgba(255,255,255,0.85)'}}>Số điện thoại</label>
                    <div className="relative group">
                      <svg className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-300 ${fieldErrors.phoneNumber ? 'text-red-400' : 'text-accent'}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.61 5 2 2 0 0 1 3.59 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.9a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 18z"/></svg>
                      <input id="reg-phone" name="phoneNumber" type="tel" value={phoneNumber} onBlur={handleBlur} onChange={e => { setPhoneNumber(e.target.value); if (fieldErrors.phoneNumber) validateField('phoneNumber', e.target.value) }} placeholder="+84 0000 0000" className={`auth-input pl-11 ${fieldErrors.phoneNumber ? 'border-red-400 focus:border-red-500 focus:ring-red-400/20' : ''}`} />
                    </div>
                    {fieldErrors.phoneNumber && <span className="text-xs text-red-400 font-medium">{fieldErrors.phoneNumber}</span>}
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2 relative">
                  <label htmlFor="reg-email" className="text-sm font-semibold" style={{color:'rgba(255,255,255,0.85)'}}>Thư điện tử</label>
                  <div className="relative group">
                    <svg className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-300 ${fieldErrors.email ? 'text-red-400' : 'text-accent'}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    <input id="reg-email" name="email" type="email" value={email} onBlur={handleBlur} onChange={e => { setEmail(e.target.value); if (fieldErrors.email) validateField('email', e.target.value) }} required placeholder="nguyenvana@example.com" className={`auth-input pl-11 ${fieldErrors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-400/20' : ''}`} />
                  </div>
                  {fieldErrors.email && <span className="text-xs text-red-400 font-medium">{fieldErrors.email}</span>}
                </div>

                {/* Password + Confirm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2 relative">
                    <label htmlFor="reg-password" className="text-sm font-semibold" style={{color:'rgba(255,255,255,0.85)'}}>Mật khẩu</label>
                    <div className="relative group">
                      <svg className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-300 ${fieldErrors.password ? 'text-red-400' : 'text-accent'}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      <input id="reg-password" name="password" type={showPass ? 'text' : 'password'} value={password} onBlur={handleBlur} onChange={e => { setPassword(e.target.value); if (fieldErrors.password) validateField('password', e.target.value); if (confirmPassword) validateField('confirmPassword', confirmPassword) }} required placeholder="••••••••" className={`auth-input pl-11 pr-11 ${fieldErrors.password ? 'border-red-400 focus:border-red-500 focus:ring-red-400/20' : ''}`} />
                      <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-accent/60 hover:text-accent transition-colors duration-300" onClick={() => setShowPass(!showPass)} aria-label="Hiện/ẩn mật khẩu">
                        {showPass
                          ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="1" y1="1" x2="23" y2="23"/><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/></svg>
                          : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        }
                      </button>
                    </div>
                    {password && <PasswordStrengthMeter password={password} />}
                    {fieldErrors.password && !password && <span className="text-xs text-red-400 font-medium">{fieldErrors.password}</span>}
                  </div>

                  <div className="flex flex-col gap-2 relative">
                    <label htmlFor="reg-confirm" className="text-sm font-semibold" style={{color:'rgba(255,255,255,0.85)'}}>Xác nhận mật khẩu</label>
                    <div className="relative group">
                      <svg className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-300 ${fieldErrors.confirmPassword ? 'text-red-400' : 'text-accent'}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      <input id="reg-confirm" name="confirmPassword" type={showConfirm ? 'text' : 'password'} value={confirmPassword} onBlur={handleBlur} onChange={e => { setConfirmPassword(e.target.value); if (fieldErrors.confirmPassword) validateField('confirmPassword', e.target.value) }} required placeholder="••••••••" className={`auth-input pl-11 pr-11 ${fieldErrors.confirmPassword ? 'border-red-400 focus:border-red-500 focus:ring-red-400/20' : ''}`} />
                      <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-accent/60 hover:text-accent transition-colors duration-300" onClick={() => setShowConfirm(!showConfirm)} aria-label="Hiện/ẩn mật khẩu">
                        {showConfirm
                          ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="1" y1="1" x2="23" y2="23"/><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/></svg>
                          : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        }
                      </button>
                    </div>
                    {fieldErrors.confirmPassword && <span className="text-xs text-red-400 font-medium">{fieldErrors.confirmPassword}</span>}
                  </div>
                </div>

                {/* Terms */}
                <label
                  className="flex items-center gap-3 cursor-pointer select-none group mt-1 px-3 py-2.5 rounded-lg transition-all duration-200"
                  style={{color:'rgba(255,255,255,0.72)'}}
                  htmlFor="agree-terms"
                  onMouseEnter={e => e.currentTarget.style.backgroundColor='rgba(20,184,166,0.06)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor='transparent'}
                >
                  <input type="checkbox" id="agree-terms" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="sr-only" />
                  <span className={`w-[18px] h-[18px] border-[1.5px] rounded flex items-center justify-center transition-all duration-200 shrink-0 ${agreed ? 'bg-accent border-accent' : 'border-white/30 group-hover:border-accent'}`} style={{flexShrink:0}}>
                    {agreed && <span className="w-2 h-1.5 border-l-2 border-b-2 border-ink -rotate-45 -translate-y-px" />}
                  </span>
                  <span className="leading-relaxed" style={{fontSize:'15px'}}>Tôi đồng ý với <Link to="/terms" className="text-accent font-semibold hover:underline" onClick={e => e.stopPropagation()}>Điều khoản dịch vụ</Link> và <Link to="/privacy" className="text-accent font-semibold hover:underline" onClick={e => e.stopPropagation()}>Chính sách bảo mật</Link></span>
                </label>
              </div>
            )}

            {/* ── Step 1: Preferences ── */}
            {step === 1 && (
              <div className="flex flex-col gap-4 auth-animate-slide" key="step-1">
                <p className="text-sm font-semibold mb-1" style={{color:'rgba(255,255,255,0.85)'}}>Chọn sở thích thể thao của bạn</p>
                {['Cầu lông', 'Pickleball'].map(sport => (
                  <label key={sport} className={`group flex items-center gap-4 cursor-pointer p-5 border rounded-xl transition-all duration-300 ${sportPreferences.includes(sport) ? 'bg-accent/10 border-accent text-accent' : 'border-white/15 hover:border-white/30 hover:-translate-y-px'}`} style={!sportPreferences.includes(sport) ? {backgroundColor:'rgba(255,255,255,0.04)', color:'rgba(255,255,255,0.8)'} : {}}>
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={sportPreferences.includes(sport)}
                      onChange={() => {
                        setSportPreferences(prev => 
                          prev.includes(sport) 
                            ? prev.filter(s => s !== sport) 
                            : [...prev, sport]
                        )
                      }}
                    />
                    {/* Sport icon */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${sportPreferences.includes(sport) ? 'bg-accent/20 text-accent' : 'text-white/50'}`} style={!sportPreferences.includes(sport) ? {backgroundColor:'rgba(255,255,255,0.08)'} : {}}>
                      {sport === 'Cầu lông' ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m8 12 4-8 4 8"/><path d="M12 4v16"/></svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v20M2 12h20"/></svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold text-sm">{sport}</span>
                      <p className={`text-xs mt-0.5 ${sportPreferences.includes(sport) ? 'text-accent/70' : 'text-white/40'}`}>
                        {sport === 'Cầu lông' ? 'Sân cầu lông & các trận đấu' : 'Sân Pickleball & cộng đồng'}
                      </p>
                    </div>
                    <span className={`w-5 h-5 border-[1.5px] rounded flex items-center justify-center transition-all duration-200 shrink-0 ${sportPreferences.includes(sport) ? 'bg-accent border-accent' : 'border-white/25'}`}>
                       {sportPreferences.includes(sport) && <span className="w-2 h-1.5 border-l-2 border-b-2 border-ink -rotate-45 -translate-y-px" />}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {/* ── Step 2: OTP Verify ── */}
            {step === 2 && (
              <div className="flex flex-col items-center gap-6 auth-animate-slide" key="step-2">
                {/* Email icon */}
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-accent" style={{border:'1px solid rgba(20,184,166,0.2)'}}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <p className="text-sm font-medium text-center" style={{color:'rgba(255,255,255,0.6)'}}>Nhập mã xác thực đã được gửi đến<br /><span className="font-semibold" style={{color:'#f3f2ee'}}>{email}</span></p>
                <div className="flex gap-2.5">
                  {[0,1,2,3,4,5].map(i => (
                    <input 
                      key={i} 
                      id={`otp-${i}`}
                      type="text" 
                      inputMode="numeric"
                      pattern="[0-9]*"
                      autoComplete={i === 0 ? "one-time-code" : "off"}
                      maxLength={1} 
                      value={otp[i]}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      onPaste={i === 0 ? handlePaste : undefined}
                      className="w-12 h-14 text-center text-xl font-bold rounded-xl font-sans outline-none transition-all duration-300 focus:ring-2 focus:ring-accent/25"
                      style={{backgroundColor:'#1c2028', border:'2px solid rgba(255,255,255,0.15)', color:'#f3f2ee'}}
                      onFocus={e => e.target.style.borderColor='#14b8a6'}
                      onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.15)'}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Submit */}
            <button disabled={loading} type="submit" className="auth-btn mt-2">
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-[var(--theme-primary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : step < steps.length - 1 ? 'Tiếp tục' : 'Tạo tài khoản'}
            </button>

            {step === 1 && (
              <button 
                type="button" 
                onClick={() => setStep(2)} 
                className="w-full py-3 text-sm font-semibold transition-colors duration-200"
                style={{color:'rgba(255,255,255,0.4)'}}
                onMouseEnter={e => e.target.style.color='rgba(255,255,255,0.85)'}
                onMouseLeave={e => e.target.style.color='rgba(255,255,255,0.4)'}
              >
                Bỏ qua bước này
              </button>
            )}
          </form>

          {step === 2 && (
            <button onClick={handleResendOtp} disabled={loading} className="mt-6 text-sm font-semibold hover:text-accent transition-colors duration-200 self-center" style={{color:'rgba(255,255,255,0.45)'}}>
              Không nhận được mã? <span className="text-accent">Gửi lại mã OTP</span>
            </button>
          )}

          {step === 0 && (
            <div className="flex flex-col items-center mt-2">
              {/* Divider */}
              <div className="flex items-center gap-4 w-full my-6">
                <div className="flex-1 h-px" style={{backgroundColor:'rgba(255,255,255,0.12)'}} />
                <span className="text-xs font-medium tracking-wider uppercase" style={{color:'rgba(255,255,255,0.35)'}}>hoặc</span>
                <div className="flex-1 h-px" style={{backgroundColor:'rgba(255,255,255,0.12)'}} />
              </div>

              <div className="w-full mb-8">
                <GoogleSignInButton
                  onSuccess={handleGoogleSuccess}
                  onError={setError}
                  text="signup_with"
                  disabled={loading}
                />
              </div>

              <p className="text-sm text-center" style={{color:'rgba(255,255,255,0.45)'}}>
                Đã có tài khoản?{' '}
                <Link to="/login" className="text-accent font-semibold hover:underline transition-colors duration-200">Đăng nhập</Link>
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
