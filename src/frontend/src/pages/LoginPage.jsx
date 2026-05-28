import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false)
  const [remember, setRemember] = useState(false)

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar theme="light" />

      <div className="flex-1 px-6 pt-[68px] pb-[60px] flex items-center justify-center bg-gradient-to-br from-[#e8f2f8] via-[#daedf6] to-[#cee8f5] relative overflow-hidden">
        {/* Decorative blurred court image */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=1200&q=60')] bg-cover bg-center opacity-10" />

        <div className="bg-white rounded-[32px] px-6 sm:px-10 py-8 sm:py-11 w-full max-w-[440px] shadow-[0_8px_32px_rgba(0,0,0,0.14)] relative z-10 flex flex-col items-center animate-[fadeInUp_0.6s_ease_both]">
          <div className="w-[54px] h-[54px] rounded-full bg-[#00c8aa] flex items-center justify-center mb-4 shadow-[0_4px_16px_rgba(0,200,170,0.35)]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>

          <h1 className="font-['Oswald'] text-[1.75rem] font-bold text-slate-900 mb-1.5 text-center">Welcome Back</h1>
          <p className="text-[0.875rem] text-slate-500 text-center mb-7">Elevate your game. Sign in to continue.</p>

          <form className="w-full flex flex-col gap-4" onSubmit={e => e.preventDefault()}>
            <div className="flex flex-col gap-1.5 w-full">
              <label htmlFor="login-email" className="text-[0.825rem] font-semibold text-slate-900">Email Address</label>
              <div className="relative flex items-center group">
                <svg className="absolute left-3.5 text-slate-400 pointer-events-none group-focus-within:text-[#00c8aa] transition-colors" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <input id="login-email" type="email" placeholder="coach@pro-sport.com" className="w-full py-2.5 pr-3.5 pl-10 border-[1.5px] border-slate-200 rounded-md font-['Inter'] text-[0.9rem] text-slate-900 bg-white transition-all outline-none focus:border-[#00c8aa] focus:shadow-[0_0_0_3px_rgba(0,200,170,0.12)] placeholder:text-slate-400" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <label htmlFor="login-password" className="text-[0.825rem] font-semibold text-slate-900">Password</label>
              <div className="relative flex items-center group">
                <svg className="absolute left-3.5 text-slate-400 pointer-events-none group-focus-within:text-[#00c8aa] transition-colors" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full py-2.5 pr-10 pl-10 border-[1.5px] border-slate-200 rounded-md font-['Inter'] text-[0.9rem] text-slate-900 bg-white transition-all outline-none focus:border-[#00c8aa] focus:shadow-[0_0_0_3px_rgba(0,200,170,0.12)] placeholder:text-slate-400"
                />
                <button type="button" className="absolute right-3 bg-transparent text-slate-400 transition-colors hover:text-[#00c8aa] flex" onClick={() => setShowPass(!showPass)} aria-label="Toggle password">
                  {showPass
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-[0.84rem] text-slate-500 select-none group" htmlFor="remember-me">
                <input type="checkbox" id="remember-me" checked={remember} onChange={() => setRemember(!remember)} className="hidden peer" />
                <span className="w-4 h-4 border-[1.5px] border-slate-200 rounded flex items-center justify-center transition-all shrink-0 peer-checked:bg-[#00c8aa] peer-checked:border-[#00c8aa]">
                  {remember && <span className="w-2 h-1.5 border-l-[1.5px] border-b-[1.5px] border-white -rotate-45 -translate-y-px" />}
                </span>
                <span>Remember Me</span>
              </label>
              <Link to="/reset-password" className="text-[0.84rem] text-[#00c8aa] font-medium hover:underline">Forgot Password?</Link>
            </div>

            <Link to="/role-selection" className="w-full flex justify-center py-3 text-[0.95rem] font-semibold rounded-xl mt-1 bg-[#00c8aa] hover:bg-[#009e87] hover:shadow-[0_0_24px_rgba(0,200,170,0.25)] hover:-translate-y-[1px] text-white tracking-[0.03em] transition-all">
              Login →
            </Link>

            <div className="flex items-center gap-3 text-slate-400 text-[0.82rem] before:content-[''] before:flex-1 before:h-px before:bg-slate-200 after:content-[''] after:flex-1 after:h-px after:bg-slate-200">
              <span>OR</span>
            </div>

            <button type="button" className="w-full flex items-center justify-center gap-2.5 py-[11px] border-[1.5px] border-slate-200 rounded-xl bg-white text-[0.875rem] font-medium text-slate-900 font-['Inter'] transition-all hover:border-[#00c8aa] hover:bg-[#00c8aa]/5 hover:shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </button>

            <button type="button" className="w-full flex items-center justify-center gap-2.5 py-[11px] border-[1.5px] border-slate-200 rounded-xl bg-white text-[0.875rem] font-medium text-slate-900 font-['Inter'] transition-all hover:border-[#00c8aa] hover:bg-[#00c8aa]/5 hover:shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.22 1.3-2.2 3.88.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.64M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              Continue with Apple
            </button>
          </form>

          <p className="mt-[18px] text-[0.85rem] text-slate-500">
            Don't have an account? <Link to="/register" className="text-[#00c8aa] font-semibold hover:underline">Register</Link>
          </p>
        </div>
      </div>

      <Footer variant="light" />
    </div>
  )
}
