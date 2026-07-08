import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useToast } from '../components/Toast'
import authApi from '../api/authApi'
import { useAuth } from '../context/AuthContext'

export default function CompleteProfilePage() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const toast = useToast()

  // BUG #14 FIX: Check token on mount — redirect if not authenticated
  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    if (!token) {
      navigate('/login')
    }
  }, [navigate])
  
  // Real-time Field Errors
  const [fieldErrors, setFieldErrors] = useState({})

  function validateField(value) {
    let errMsg = ""
    if (!value.trim()) errMsg = "Trường bắt buộc."
    else if (!/(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(value.trim())) errMsg = "Số điện thoại VN không hợp lệ."
    
    setFieldErrors({ phoneNumber: errMsg })
    return errMsg === ""
  }

  function handleBlur(e) {
    validateField(e.target.value)
  }

  async function handleComplete(e) {
    e.preventDefault()
    const isPhoneValid = validateField(phoneNumber)

    if (!isPhoneValid) {
      return
    }

    setError(null)
    setLoading(true)
    try {
      await authApi.completeProfile({
        phoneNumber
      })
      toast('Cập nhật hồ sơ thành công!', 'success')
      navigate('/')
    } catch (err) {
      // BUG #14 FIX: Handle 401 specifically
      if (err === 'Unauthorized' || err?.includes?.('401')) {
        logout()
        toast('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.', 'error')
        navigate('/login')
        return
      }
      setError(typeof err === 'string' ? err : 'Cập nhật hồ sơ thất bại. Số điện thoại có thể đã được sử dụng.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-base">
      <Navbar theme="light" />

      <div className="flex-1 px-6 pt-[100px] pb-[60px] flex items-center justify-center">
        <div className="card-base w-full max-w-[440px] flex flex-col items-center relative mt-6">
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-[60px] h-[60px] rounded-full bg-accent flex items-center justify-center border-4 border-background-base">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
          </div>

          <h1 className="font-heading text-[1.8rem] uppercase text-foreground mb-1.5 text-center mt-4">Hoàn tất hồ sơ</h1>
          <p className="text-sm text-foreground-muted text-center mb-7">
            Chỉ còn một bước nữa để hoàn tất thiết lập tài khoản của bạn.
          </p>

          {error && (
            <div className="w-full bg-danger-bg text-danger text-sm p-3 rounded-[2px] border-2 border-danger mb-4 text-center">
              {error}
            </div>
          )}

          <form className="w-full max-w-[340px] mx-auto flex flex-col gap-4" onSubmit={handleComplete} noValidate>

            <div className="flex flex-col gap-2 w-full relative mb-4">
              <label htmlFor="reg-phone" className="text-sm font-bold uppercase tracking-[0.05em] text-foreground">Số điện thoại</label>
              <div className="relative flex items-center group">
                <svg className={`absolute left-4 pointer-events-none transition-colors ${fieldErrors.phoneNumber ? 'text-danger' : 'text-foreground-subtle group-focus-within:text-accent'}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.61 5 2 2 0 0 1 3.59 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.9a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 18z"/></svg>
                <input id="reg-phone" name="phoneNumber" type="tel" value={phoneNumber} onBlur={handleBlur} onChange={e => { setPhoneNumber(e.target.value); if (fieldErrors.phoneNumber) validateField(e.target.value) }} placeholder="+84 0000 0000" className={`auth-input pl-11 ${fieldErrors.phoneNumber ? 'border-danger focus:ring-danger/20' : ''}`} />
              </div>
              {fieldErrors.phoneNumber && <span className="text-xs text-danger absolute -bottom-5 left-0">{fieldErrors.phoneNumber}</span>}
            </div>

            <button disabled={loading} type="submit" className="auth-btn">
              {loading ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Hoàn tất thiết lập →'}
            </button>
          </form>

        </div>
      </div>

      <Footer variant="light" />
    </div>
  )
}
