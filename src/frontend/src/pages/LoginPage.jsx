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
  return '/apex'
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

/* ─────────────────────────────────────────────────────────────────
   Shared icon helpers
───────────────────────────────────────────────────────────────── */
const IconEmail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)

const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)

const IconEyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)

const IconEye = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

/* ─────────────────────────────────────────────────────────────────
   Main Component
───────────────────────────────────────────────────────────────── */
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
    function handleKey(e) {
      if (e.getModifierState) setCapsLockOn(e.getModifierState('CapsLock'))
    }
    window.addEventListener('keyup', handleKey)
    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('keyup', handleKey)
      window.removeEventListener('keydown', handleKey)
    }
  }, [])

  const toast = useToast()
  const { login } = useAuth()

  async function handleLogin(e) {
    e.preventDefault()
    setError(null)
    if (!email.trim()) { setError('Vui lòng nhập địa chỉ email.'); return }
    if (!password)     { setError('Vui lòng nhập mật khẩu.');      return }
    setLoading(true)
    try {
      const response = await authApi.login({ email, password })
      const token = response.data?.accessToken || response.accessToken || response.data?.token || response.token
      if (token) {
        const userData = {
          userId:    response.data?.userId    || response.userId,
          fullName:  response.data?.fullName  || response.fullName,
          email:     response.data?.email     || response.email,
          role:      response.data?.role      || response.role || 'Customer',
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
      if (!credentialResponse?.credential) { setError('Không nhận được token từ Google.'); return }
      const response = await authApi.googleLogin({ googleIdToken: credentialResponse.credential })
      const auth = extractAuthPayload(response)
      if (auth.token) {
        login(auth.token, { userId: auth.userId, fullName: auth.fullName, email: auth.email, role: auth.role, avatarUrl: auth.avatarUrl }, remember)
        if (auth.isProfileComplete === false) navigate('/complete-profile')
        else navigate(resolveRedirect(auth.role, redirectParam))
      } else {
        setError('Đăng nhập Google thất bại. Không nhận được token.')
      }
    } catch (err) {
      setError(mapGoogleAuthError(err))
    } finally {
      setLoading(false)
    }
  }

  /* ── Shared dark-input style ── */
  const inputStyle = {
    backgroundColor: '#1c2028',
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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', sans-serif" }}>

      {/* ══════════════════════════════════════════
          LEFT — Visual Panel (Athlete + Grid)
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
        {/* Background court image */}
        <img
          src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1920&q=80"
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: '60% center',
            filter: 'brightness(0.32)',
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
          background: 'linear-gradient(to right, rgba(5,8,16,0.60) 0%, rgba(5,8,16,0.15) 100%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(5,8,16,0.70) 0%, transparent 55%)',
        }} />

        {/* ── Content ── */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <ProSportLogo size="lg" variant="light" />
        </div>

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '460px' }}>
          {/* Eyebrow */}
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '12px', fontWeight: 800,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: '#14b8a6', marginBottom: '20px',
          }}>
            Chào mừng trở lại
          </p>

          {/* Headline */}
          <h2 style={{
            fontFamily: "'Montserrat', 'Be Vietnam Pro', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(2rem, 3.2vw, 3rem)',
            lineHeight: 1.1,
            textTransform: 'uppercase',
            letterSpacing: '-0.01em',
            color: '#F5F5F5',
            marginBottom: '20px',
          }}>
            Hiệu suất<br />mượt mà.<br />
            <span style={{ color: '#14b8a6' }}>Kiểm soát<br />tuyệt đối.</span>
          </h2>

          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: '360px', marginBottom: '40px' }}>
            Nền tảng quản lý hàng đầu cho vận động viên và cơ sở thể thao — đặt sân, ghép trận và kết nối cộng đồng.
          </p>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {[
              { val: '42+',  label: 'Sân thi đấu' },
              { val: '2.4K', label: 'Người chơi' },
              { val: '98%',  label: 'Hài lòng' },
            ].map(({ val, label }) => (
              <div key={val} style={{
                flex: 1,
                border: '1px solid rgba(255,255,255,0.14)',
                borderRadius: '4px',
                padding: '16px',
                backdropFilter: 'blur(4px)',
                backgroundColor: 'rgba(255,255,255,0.03)',
              }}>
                <p style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: '1.5rem', color: '#F5F5F5', lineHeight: 1 }}>{val}</p>
                <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#14b8a6', marginTop: '6px' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom attribution */}
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

        <div style={{ width: '100%', maxWidth: '480px', marginTop: '0' }}>

          {/* ── Header ── */}
          <header style={{ marginBottom: '36px' }}>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '12px', fontWeight: 800,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: '#14b8a6', marginBottom: '14px',
            }}>
              Chào mừng trở lại
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
              Đăng nhập<br />tài khoản
            </h1>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.65 }}>
              Nhập thông tin để truy cập bảng điều khiển Pro-Sport.
            </p>
          </header>

          {/* ── Error Banner ── */}
          {error && (
            <div style={{
              backgroundColor: 'rgba(178,59,59,0.15)',
              border: '1.5px solid rgba(178,59,59,0.5)',
              borderRadius: '4px',
              padding: '14px 16px',
              marginBottom: '20px',
              color: '#fca5a5',
              fontSize: '14px',
            }}>
              <span style={{ fontWeight: 600 }}>{error}</span>
              {failedAttempts >= 3 && (
                <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(178,59,59,0.3)' }}>
                  <span>Quên mật khẩu? </span>
                  <Link to="/reset-password" style={{ color: '#fca5a5', fontWeight: 700, textDecoration: 'underline' }}>Đặt lại ngay</Link>
                </div>
              )}
            </div>
          )}

          {/* ── Form ── */}
          <form onSubmit={handleLogin} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

            {/* Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="login-email" style={{
                fontSize: '12px', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.07em',
                color: 'rgba(255,255,255,0.75)',
              }}>
                Thư điện tử
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)', pointerEvents: 'none' }}>
                  <IconEmail />
                </span>
                <input
                  id="login-email"
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

            {/* Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="login-password" style={{
                fontSize: '12px', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.07em',
                color: 'rgba(255,255,255,0.75)',
              }}>
                Mật khẩu
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)', pointerEvents: 'none' }}>
                  <IconLock />
                </span>
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{ ...inputStyle, paddingRight: capsLockOn ? '72px' : '44px' }}
                  onFocus={e => e.target.style.borderColor = '#14b8a6'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.18)'}
                />
                {capsLockOn && (
                  <div style={{ position: 'absolute', right: '44px', top: '50%', transform: 'translateY(-50%)', color: '#f59e0b', pointerEvents: 'none' }} title="Caps Lock đang bật">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="17 11 12 6 7 11"/><line x1="12" y1="6" x2="12" y2="18"/>
                    </svg>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  aria-label="Hiện/ẩn mật khẩu"
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.40)', padding: 0 }}
                >
                  {showPass ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label htmlFor="remember-me" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none' }}>
                <input
                  type="checkbox"
                  id="remember-me"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  width: '18px', height: '18px', borderRadius: '3px', flexShrink: 0,
                  border: `2px solid ${remember ? '#14b8a6' : 'rgba(255,255,255,0.35)'}`,
                  backgroundColor: remember ? '#14b8a6' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}>
                  {remember && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <polyline points="1,4 4,7 9,1" stroke="#050810" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
                <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>Ghi nhớ đăng nhập</span>
              </label>
              <Link
                to="/reset-password"
                style={{ fontSize: '13px', fontWeight: 700, color: '#14b8a6', textDecoration: 'none' }}
                onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                onMouseLeave={e => e.target.style.textDecoration = 'none'}
              >
                Quên mật khẩu?
              </Link>
            </div>

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
                marginTop: '4px',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#17cdbe' }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = '#14b8a6' }}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              ) : 'Đăng nhập'}
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', margin: '4px 0' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.12)' }} />
              <span style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: '11px', fontWeight: 700,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.35)',
              }}>
                Hoặc
              </span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.12)' }} />
            </div>

            {/* Google Sign-In */}
            <GoogleSignInButton
              onSuccess={handleGoogleSuccess}
              onError={setError}
              text="continue_with"
              disabled={loading}
            />
          </form>

          {/* Register link */}
          <p style={{ marginTop: '32px', textAlign: 'center', fontSize: '14px', color: 'rgba(255,255,255,0.50)' }}>
            Chưa có tài khoản?{' '}
            <Link
              to="/register"
              style={{ color: '#14b8a6', fontWeight: 700, textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.textDecoration = 'underline'}
              onMouseLeave={e => e.target.style.textDecoration = 'none'}
            >
              Tạo tài khoản
            </Link>
          </p>
        </div>
      </section>
    </div>
  )
}
