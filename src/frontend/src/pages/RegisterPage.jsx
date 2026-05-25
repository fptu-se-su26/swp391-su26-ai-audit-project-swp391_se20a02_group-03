import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const steps = ['Details', 'Preferences', 'Verify']

export default function RegisterPage() {
  const [step, setStep] = useState(0)
  const [showPass, setShowPass]       = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [agreed, setAgreed]           = useState(false)

  const next = (e) => {
    e.preventDefault()
    if (step < steps.length - 1) setStep(s => s + 1)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar theme="light" />

      <div className="flex-1 px-6 pt-[68px] pb-[60px] flex items-center justify-center bg-gradient-to-br from-[#eaf4fb] to-[#daedf8]">
        <div className="bg-white rounded-[32px] px-5 sm:px-10 py-7 sm:py-11 w-full max-w-[580px] shadow-[0_8px_32px_rgba(0,0,0,0.14)] flex flex-col items-center animate-[fadeInUp_0.6s_ease_both]">
          {/* Step indicator */}
          <div className="flex items-center w-full max-w-[360px] mb-7">
            {steps.map((s, i) => (
              <div key={s} className={`flex items-center gap-2 flex-1 relative ${i <= step ? 'group-active' : ''} ${i < step ? 'group-done' : ''}`}>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[0.8rem] shrink-0 transition-colors ${i <= step ? 'bg-[#00c8aa] border-[#00c8aa] text-white font-semibold' : 'bg-white border-slate-200 text-slate-400 font-semibold'}`}>
                  {i < step
                    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    : <span>{i + 1}</span>
                  }
                </div>
                <span className={`text-[0.78rem] whitespace-nowrap ${i <= step ? 'text-[#00c8aa] font-semibold' : 'text-slate-400 font-medium'}`}>{s}</span>
                {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 transition-colors ${i < step ? 'bg-[#00c8aa]' : 'bg-slate-200'}`} />}
              </div>
            ))}
          </div>

          <h1 className="font-['Oswald'] text-[1.8rem] font-bold text-slate-900 mb-1.5 text-center">Create Account</h1>
          <p className="text-[0.875rem] text-slate-500 text-center mb-7">
            Join the elite community of PRO-SPORT athletes and managers.
          </p>

          <form className="w-full flex flex-col gap-4" onSubmit={next}>
            {step === 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 w-full">
                    <label htmlFor="reg-name" className="text-[0.825rem] font-semibold text-slate-900">Full Name</label>
                    <div className="relative flex items-center group">
                      <svg className="absolute left-3.5 text-slate-400 pointer-events-none group-focus-within:text-[#00c8aa] transition-colors" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      <input id="reg-name" type="text" placeholder="John Doe" className="w-full py-2.5 pr-3.5 pl-10 border-[1.5px] border-slate-200 rounded-md font-['Inter'] text-[0.9rem] text-slate-900 bg-white transition-all outline-none focus:border-[#00c8aa] focus:shadow-[0_0_0_3px_rgba(0,200,170,0.12)] placeholder:text-slate-400" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 w-full">
                    <label htmlFor="reg-phone" className="text-[0.825rem] font-semibold text-slate-900">Phone Number</label>
                    <div className="relative flex items-center group">
                      <svg className="absolute left-3.5 text-slate-400 pointer-events-none group-focus-within:text-[#00c8aa] transition-colors" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.61 5 2 2 0 0 1 3.59 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.9a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 18z"/></svg>
                      <input id="reg-phone" type="tel" placeholder="+1 (000) 000-0000" className="w-full py-2.5 pr-3.5 pl-10 border-[1.5px] border-slate-200 rounded-md font-['Inter'] text-[0.9rem] text-slate-900 bg-white transition-all outline-none focus:border-[#00c8aa] focus:shadow-[0_0_0_3px_rgba(0,200,170,0.12)] placeholder:text-slate-400" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 w-full">
                  <label htmlFor="reg-email" className="text-[0.825rem] font-semibold text-slate-900">Email Address</label>
                  <div className="relative flex items-center group">
                    <svg className="absolute left-3.5 text-slate-400 pointer-events-none group-focus-within:text-[#00c8aa] transition-colors" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    <input id="reg-email" type="email" placeholder="john.doe@pro-sport.com" className="w-full py-2.5 pr-3.5 pl-10 border-[1.5px] border-slate-200 rounded-md font-['Inter'] text-[0.9rem] text-slate-900 bg-white transition-all outline-none focus:border-[#00c8aa] focus:shadow-[0_0_0_3px_rgba(0,200,170,0.12)] placeholder:text-slate-400" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 w-full">
                    <label htmlFor="reg-password" className="text-[0.825rem] font-semibold text-slate-900">Password</label>
                    <div className="relative flex items-center group">
                      <svg className="absolute left-3.5 text-slate-400 pointer-events-none group-focus-within:text-[#00c8aa] transition-colors" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      <input id="reg-password" type={showPass ? 'text' : 'password'} placeholder="••••••••" className="w-full py-2.5 pr-10 pl-10 border-[1.5px] border-slate-200 rounded-md font-['Inter'] text-[0.9rem] text-slate-900 bg-white transition-all outline-none focus:border-[#00c8aa] focus:shadow-[0_0_0_3px_rgba(0,200,170,0.12)] placeholder:text-slate-400" />
                      <button type="button" className="absolute right-3 bg-transparent text-slate-400 transition-colors hover:text-[#00c8aa] flex" onClick={() => setShowPass(!showPass)} aria-label="Toggle">
                        {showPass
                          ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="1" y1="1" x2="23" y2="23"/><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/></svg>
                          : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        }
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 w-full">
                    <label htmlFor="reg-confirm" className="text-[0.825rem] font-semibold text-slate-900">Confirm Password</label>
                    <div className="relative flex items-center group">
                      <svg className="absolute left-3.5 text-slate-400 pointer-events-none group-focus-within:text-[#00c8aa] transition-colors" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      <input id="reg-confirm" type={showConfirm ? 'text' : 'password'} placeholder="••••••••" className="w-full py-2.5 pr-10 pl-10 border-[1.5px] border-slate-200 rounded-md font-['Inter'] text-[0.9rem] text-slate-900 bg-white transition-all outline-none focus:border-[#00c8aa] focus:shadow-[0_0_0_3px_rgba(0,200,170,0.12)] placeholder:text-slate-400" />
                      <button type="button" className="absolute right-3 bg-transparent text-slate-400 transition-colors hover:text-[#00c8aa] flex" onClick={() => setShowConfirm(!showConfirm)} aria-label="Toggle">
                        {showConfirm
                          ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="1" y1="1" x2="23" y2="23"/><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/></svg>
                          : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        }
                      </button>
                    </div>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-[0.84rem] text-slate-500 select-none group mt-1" htmlFor="agree-terms">
                  <input type="checkbox" id="agree-terms" checked={agreed} onChange={() => setAgreed(!agreed)} className="hidden peer" />
                  <span className="w-4 h-4 border-[1.5px] border-slate-200 rounded flex items-center justify-center transition-all shrink-0 peer-checked:bg-[#00c8aa] peer-checked:border-[#00c8aa]">
                    {agreed && <span className="w-2 h-1.5 border-l-[1.5px] border-b-[1.5px] border-white -rotate-45 -translate-y-px" />}
                  </span>
                  <span>I agree to the <Link to="#" className="text-[#00c8aa] font-semibold hover:underline">Terms &amp; Conditions</Link> and our <Link to="#" className="text-[#00c8aa] font-semibold hover:underline">Privacy Policy</Link></span>
                </label>
              </>
            )}

            {step === 1 && (
              <div className="w-full flex flex-col gap-3">
                <p className="text-[0.9rem] font-semibold text-slate-900 mb-1">Select your sport preferences</p>
                {['Cầu lông', 'Pickleball'].map(sport => (
                  <label key={sport} className="flex items-center gap-[10px] text-sm text-[#0d2d3a] font-medium cursor-pointer p-3 border-[1.5px] border-[#e0ecf0] rounded-xl hover:border-[#0d8a8a] transition-colors">
                    <input type="checkbox" className="w-[18px] h-[18px] cursor-pointer accent-[#0d8a8a]" />
                    <span className="w-4 h-4 border-[1.5px] border-slate-200 rounded flex items-center justify-center transition-all shrink-0 peer-checked:bg-[#00c8aa] peer-checked:border-[#00c8aa]"></span>
                    <span>{sport}</span>
                  </label>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="w-full flex flex-col items-center gap-4">
                <p className="text-[0.9rem] text-slate-500 text-center">Check your email for a verification code.</p>
                <div className="flex gap-2.5">
                  {[0,1,2,3,4,5].map(i => (
                    <input key={i} type="text" maxLength={1} className="w-12 h-14 text-center text-[1.4rem] font-bold border-2 border-slate-200 rounded-md font-['Inter'] text-slate-900 outline-none transition-all focus:border-[#00c8aa] focus:shadow-[0_0_0_3px_rgba(0,200,170,0.12)]" id={`otp-${i}`} />
                  ))}
                </div>
              </div>
            )}

            <button type="submit" className="w-full flex justify-center py-3 text-[0.95rem] font-semibold rounded-xl mt-1.5 bg-[#00c8aa] hover:bg-[#009e87] hover:shadow-[0_0_24px_rgba(0,200,170,0.25)] hover:-translate-y-[1px] text-white tracking-[0.03em] transition-all">
              {step < steps.length - 1 ? 'Continue →' : 'Create Account →'}
            </button>
          </form>

          {step === 0 && (
            <p className="mt-4 text-[0.85rem] text-slate-500">
              Already have an account? <Link to="/login" className="text-[#00c8aa] font-semibold hover:underline">Login</Link>
            </p>
          )}

          <div className="flex gap-4 sm:gap-8 mt-7 pt-6 border-t border-slate-200 w-full justify-center">
            <div className="flex flex-col items-center gap-2 text-[0.78rem] text-slate-400 font-medium text-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#00c8aa]"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              <span>High Performance</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-[0.78rem] text-slate-400 font-medium text-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#00c8aa]"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <span>Global Community</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-[0.78rem] text-slate-400 font-medium text-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#00c8aa]"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span>Easy Booking</span>
            </div>
          </div>
        </div>
      </div>

      <Footer variant="light" />
    </div>
  )
}
