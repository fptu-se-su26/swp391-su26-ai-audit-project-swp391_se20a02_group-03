import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar theme="light" />

      <div className="flex-1 pt-[68px] px-6 pb-[60px] flex items-center justify-center bg-gradient-to-br from-[#eaf4fb] to-[#daedf8]">
        <div className="bg-white rounded-2xl py-11 px-10 w-full max-w-[440px] shadow-lg flex flex-col items-center animate-fade-up">
          <div className="w-[54px] h-[54px] rounded-full bg-gradient-to-br from-[#00c8aa] to-[#009e87] flex items-center justify-center mb-[18px] shadow-[0_4px_16px_rgba(0,200,170,0.35)]">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>

          <h1 className="font-['Oswald'] text-[1.75rem] font-bold text-[#0a0e1a] mb-[10px] text-center">Reset Password</h1>
          <p className="text-sm text-slate-500 text-center leading-[1.6] mb-7 max-w-[340px]">
            Enter the email address associated with your PRO-SPORT account to receive reset instructions.
          </p>

          <form className="w-full flex flex-col gap-4" onSubmit={e => e.preventDefault()}>
            <div className="form-group">
              <label htmlFor="reset-email" className="form-label">Email Address</label>
              <div className="input-wrap">
                <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <input id="reset-email" type="email" placeholder="athlete@pro-sport.com" className="form-input" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reset-new-password" className="form-label">New Password</label>
              <div className="input-wrap">
                <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input id="reset-new-password" type="password" placeholder="••••••••" className="form-input" />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full justify-center py-[13px] text-[0.95rem] font-semibold rounded-md mt-[6px]">
              Reset Password →
            </button>
          </form>

          <Link to="/login" className="mt-[18px] text-[0.85rem] text-slate-500 transition-all hover:text-[#00c8aa]">← Back to Login</Link>
        </div>
      </div>

      <Footer variant="light" />
    </div>
  )
}
