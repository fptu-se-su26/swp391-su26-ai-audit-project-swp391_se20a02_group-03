import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './RegisterPage.css'

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
    <div className="register-page">
      <Navbar theme="light" />

      <div className="register-page__bg">
        <div className="register-card animate-fade-up">
          {/* Step indicator */}
          <div className="register-steps">
            {steps.map((s, i) => (
              <div key={s} className={`step-item ${i <= step ? 'step-item--active' : ''} ${i < step ? 'step-item--done' : ''}`}>
                <div className="step-circle">
                  {i < step
                    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    : <span>{i + 1}</span>
                  }
                </div>
                <span className="step-label">{s}</span>
                {i < steps.length - 1 && <div className="step-line" />}
              </div>
            ))}
          </div>

          <h1 className="register-card__title">Create Account</h1>
          <p className="register-card__subtitle">
            Join the elite community of PRO-SPORT athletes and managers.
          </p>

          <form className="register-form" onSubmit={next}>
            {step === 0 && (
              <>
                <div className="register-form__row">
                  <div className="form-group">
                    <label htmlFor="reg-name" className="form-label">Full Name</label>
                    <div className="input-wrap">
                      <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      <input id="reg-name" type="text" placeholder="John Doe" className="form-input" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="reg-phone" className="form-label">Phone Number</label>
                    <div className="input-wrap">
                      <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.61 5 2 2 0 0 1 3.59 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.9a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 18z"/></svg>
                      <input id="reg-phone" type="tel" placeholder="+1 (000) 000-0000" className="form-input" />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="reg-email" className="form-label">Email Address</label>
                  <div className="input-wrap">
                    <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    <input id="reg-email" type="email" placeholder="john.doe@pro-sport.com" className="form-input" />
                  </div>
                </div>

                <div className="register-form__row">
                  <div className="form-group">
                    <label htmlFor="reg-password" className="form-label">Password</label>
                    <div className="input-wrap">
                      <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      <input id="reg-password" type={showPass ? 'text' : 'password'} placeholder="••••••••" className="form-input" />
                      <button type="button" className="input-toggle" onClick={() => setShowPass(!showPass)} aria-label="Toggle">
                        {showPass
                          ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="1" y1="1" x2="23" y2="23"/><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/></svg>
                          : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        }
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="reg-confirm" className="form-label">Confirm Password</label>
                    <div className="input-wrap">
                      <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      <input id="reg-confirm" type={showConfirm ? 'text' : 'password'} placeholder="••••••••" className="form-input" />
                      <button type="button" className="input-toggle" onClick={() => setShowConfirm(!showConfirm)} aria-label="Toggle">
                        {showConfirm
                          ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="1" y1="1" x2="23" y2="23"/><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/></svg>
                          : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        }
                      </button>
                    </div>
                  </div>
                </div>

                <label className="checkbox-wrap" htmlFor="agree-terms">
                  <input type="checkbox" id="agree-terms" checked={agreed} onChange={() => setAgreed(!agreed)} />
                  <span className="checkbox-custom" />
                  <span>I agree to the <Link to="#">Terms &amp; Conditions</Link> and our <Link to="#">Privacy Policy</Link></span>
                </label>
              </>
            )}

            {step === 1 && (
              <div className="register-prefs">
                <p className="register-prefs__label">Select your sport preferences</p>
                {['Tennis', 'Badminton', 'Padel', 'Squash', 'Table Tennis'].map(sport => (
                  <label key={sport} className="pref-item" htmlFor={`pref-${sport}`}>
                    <input type="checkbox" id={`pref-${sport}`} />
                    <span className="checkbox-custom" />
                    <span>{sport}</span>
                  </label>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="register-verify">
                <p className="register-verify__label">Check your email for a verification code.</p>
                <div className="otp-row">
                  {[0,1,2,3,4,5].map(i => (
                    <input key={i} type="text" maxLength={1} className="otp-input" id={`otp-${i}`} />
                  ))}
                </div>
              </div>
            )}

            <button type="submit" className="btn-primary register-form__submit">
              {step < steps.length - 1 ? 'Continue →' : 'Create Account →'}
            </button>
          </form>

          {step === 0 && (
            <p className="register-card__login">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          )}

          <div className="register-card__features">
            <div className="reg-feature">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              <span>High Performance</span>
            </div>
            <div className="reg-feature">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <span>Global Community</span>
            </div>
            <div className="reg-feature">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span>Easy Booking</span>
            </div>
          </div>
        </div>
      </div>

      <Footer variant="light" />
    </div>
  )
}
