import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useToast } from '../components/Toast'
import authApi from '../api/authApi'
import { useAuth } from '../context/AuthContext'
import ProSportLogo from '../components/ui/ProSportLogo'
import GoogleSignInButton from '../components/auth/GoogleSignInButton'
import { extractAuthPayload, mapGoogleAuthError } from '../utils/googleAuth'

function getPostLoginPath(role) {
  if (role === 'Admin') return '/admin/dashboard'
  if (role === 'Staff') return '/elite/dashboard'
  if (role === 'CourtOwner') return '/owner/dashboard'
  return '/'
}

function resolveRedirect(role, redirectParam) {
  if (!redirectParam || !redirectParam.startsWith('/') || redirectParam.startsWith('//')) {
    return getPostLoginPath(role)
  }
  const staffPaths = ['/elite', '/dashboard', '/mobile/scanner', '/gear/maintenance']
  const adminPaths = ['/admin']
  const ownerPaths = ['/owner']
  const isStaffTarget = staffPaths.some(p => redirectParam === p || redirectParam.startsWith(`${p}/`))
  const isAdminTarget = adminPaths.some(p => redirectParam === p || redirectParam.startsWith(`${p}/`))
  const isOwnerTarget = ownerPaths.some(p => redirectParam === p || redirectParam.startsWith(`${p}/`))
  if (isAdminTarget && role !== 'Admin') return getPostLoginPath(role)
  if (isStaffTarget && role !== 'Staff' && role !== 'Admin') return getPostLoginPath(role)
  if (isOwnerTarget && role !== 'CourtOwner' && role !== 'Admin') return getPostLoginPath(role)
  return redirectParam
}

export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectParam = searchParams.get('redirect')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const [capsLockOn, setCapsLockOn] = useState(false)
  const [failedAttempts, setFailedAttempts] = useState(0)

  useEffect(() => {
    function handleKeyUp(e) {
      if (e.getModifierState) {
        setCapsLockOn(e.getModifierState('CapsLock'))
      }
    }
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('keydown', handleKeyUp)
    return () => {
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('keydown', handleKeyUp)
    }
  }, [])

  const toast = useToast()
  const { login } = useAuth()

  async function handleLogin(e) {
    e.preventDefault()
    setError(null)

    if (!email.trim()) {
      setError('Vui lòng nhập địa chỉ email.')
      return
    }
    if (!password) {
      setError('Vui lòng nhập mật khẩu.')
      return
    }

    setLoading(true)

    try {
      const response = await authApi.login({ email, password })
      const token = response.data?.accessToken || response.accessToken || response.data?.token || response.token
      if (token) {

        const userData = {
          userId:   response.data?.userId   || response.userId,
          fullName: response.data?.fullName || response.fullName,
          email:    response.data?.email    || response.email,
          role:     response.data?.role     || response.role || 'Customer',
          avatarUrl: response.data?.avatarUrl || response.avatarUrl || null,
        }
        login(token, userData, remember)
        setFailedAttempts(0)
        if (response.data?.isProfileComplete === false) {
          navigate('/complete-profile')
        } else {
          navigate(resolveRedirect(userData.role, redirectParam))
        }
      } else {
        setError('Đăng nhập thất bại. Không nhận được token.')
      }
    } catch (err) {
      setFailedAttempts(prev => prev + 1)
      setError(typeof err === 'string' ? err : 'Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu.')
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
        }, remember)
        if (auth.isProfileComplete === false) {
          navigate('/complete-profile')
        } else {
          navigate(resolveRedirect(auth.role, redirectParam))
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

  return (
    <div className="auth-layout">
      {/* ── Visual Panel (Left) ── */}
      <div className="auth-visual">
        {/* Decorative grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '64px 64px'
        }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-start max-w-[480px] px-14 auth-animate-in">
          {/* Logo */}
          <ProSportLogo size="lg" variant="light" className="mb-16" />

          {/* Tagline */}
          <h2 className="font-heading text-[clamp(2.2rem,3.5vw,3.4rem)] leading-[0.98] uppercase tracking-[-0.01em] text-paper mb-6">
            Hiệu suất<br />mượt mà.<br />
            <span className="text-accent">Kiểm soát tuyệt đối.</span>
          </h2>

          <p className="text-paper/60 text-[0.95rem] leading-relaxed max-w-[380px] mb-12">
            Nền tảng quản lý hàng đầu cho vận động viên và cơ sở thể thao — đặt sân, ghép trận và kết nối cộng đồng.
          </p>

          <div className="flex gap-4 w-full">
            <div className="flex-1 border border-white/15 rounded-[2px] p-5">
              <p className="font-heading text-2xl text-paper tracking-tight">42+</p>
              <p className="label-mono text-paper/50 mt-1">Sân thi đấu</p>
            </div>
            <div className="flex-1 border border-white/15 rounded-[2px] p-5">
              <p className="font-heading text-2xl text-paper tracking-tight">2.4K</p>
              <p className="label-mono text-paper/50 mt-1">Người chơi</p>
            </div>
            <div className="flex-1 border border-white/15 rounded-[2px] p-5">
              <p className="font-heading text-2xl text-paper tracking-tight">98%</p>
              <p className="label-mono text-paper/50 mt-1">Hài lòng</p>
            </div>
          </div>
        </div>

        {/* Bottom attribution */}
        <p className="absolute bottom-8 left-14 font-mono text-xs text-paper/40 tracking-wider">
          © {new Date().getFullYear()} PRO-SPORT COMPLEX
        </p>
      </div>

      {/* ── Form Panel (Right) ── */}
      <section className="auth-form">
        {/* Mobile logo — visible only on small screens */}
        <div className="lg:hidden absolute top-6 left-6">
          <ProSportLogo size="sm" />
        </div>

        <div className="auth-form-inner auth-animate-in-delayed mt-16 lg:mt-0">
          {/* Header */}
          <header className="mb-10">
            <p className="label-mono text-accent mb-3">// Chào mừng trở lại</p>
            <h1 className="font-heading text-[2rem] uppercase text-ink tracking-tight leading-tight">
              Đăng nhập<br />tài khoản
            </h1>
            <p className="text-sm text-ink/60 mt-3 leading-relaxed">
              Nhập thông tin để truy cập bảng điều khiển Pro-Sport.
            </p>
          </header>

          {/* Error */}
          {error && (
            <div className="bg-danger-bg text-danger text-sm p-4 rounded-[2px] border-2 border-danger mb-6 flex flex-col items-center text-center auth-animate-fade">
              <span className="font-semibold">{error}</span>
              {failedAttempts >= 3 && (
                <div className="mt-3 pt-3 border-t border-danger/30 w-full">
                  <span className="text-danger">Quên mật khẩu?</span>
                  <Link to="/reset-password" className="ml-1 text-danger font-bold hover:underline">
                    Đặt lại ngay
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Form */}
          <form className="flex flex-col gap-5" onSubmit={handleLogin} noValidate>
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label htmlFor="login-email" className="text-sm font-bold uppercase tracking-[0.05em] text-ink">Thư điện tử</label>
              <div className="relative group">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40 pointer-events-none group-focus-within:text-accent transition-colors duration-300" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="email@example.com"
                  className="auth-input pl-11"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label htmlFor="login-password" className="text-sm font-bold uppercase tracking-[0.05em] text-ink">Mật khẩu</label>
              <div className="relative group">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40 pointer-events-none group-focus-within:text-accent transition-colors duration-300" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="auth-input pl-11 pr-20"
                />
                {capsLockOn && (
                  <div className="absolute right-12 top-1/2 -translate-y-1/2 pointer-events-none text-warning" title="Caps Lock đang bật">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      <path d="m9 22-3-3 3-3" />
                      <path d="m15 2 3 3-3 3" />
                    </svg>
                  </div>
                )}
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/40 hover:text-accent transition-colors duration-300" onClick={() => setShowPass(!showPass)} aria-label="Hiện/ẩn mật khẩu">
                  {showPass
                    ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer text-sm text-ink/70 select-none group" htmlFor="remember-me">
                <input type="checkbox" id="remember-me" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="sr-only" />
                <span className={`w-[18px] h-[18px] border-2 rounded-[2px] flex items-center justify-center transition-all duration-200 shrink-0 ${remember ? 'bg-accent border-accent' : 'border-border-strong group-hover:border-accent'}`}>
                  {remember && <span className="w-2 h-1.5 border-l-2 border-b-2 border-ink -rotate-45 -translate-y-px" />}
                </span>
                <span className="font-medium">Ghi nhớ đăng nhập</span>
              </label>
              <Link to="/reset-password" className="text-sm font-bold text-ink underline hover:text-accent transition-colors duration-200">Quên mật khẩu?</Link>
            </div>

            {/* Submit */}
            <button disabled={loading} type="submit" className="auth-btn mt-1">
              {loading ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Đăng nhập'}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-1">
              <div className="flex-1 h-px bg-ink/15" />
              <span className="label-mono text-ink/40">hoặc tiếp tục với</span>
              <div className="flex-1 h-px bg-ink/15" />
            </div>

            {/* Google */}
            <GoogleSignInButton
              onSuccess={handleGoogleSuccess}
              onError={setError}
              text="continue_with"
              disabled={loading}
            />
          </form>

          {/* Register link */}
          <p className="mt-10 text-sm text-ink/60 text-center">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-accent font-bold hover:underline transition-colors duration-200">
              Tạo tài khoản
            </Link>
          </p>
        </div>
      </section>
    </div>
  )
}
