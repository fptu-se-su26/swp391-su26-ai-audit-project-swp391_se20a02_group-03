import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './ResetPasswordPage.css'

export default function ResetPasswordPage() {
  return (
    <div className="reset-page">
      <Navbar theme="light" />

      <div className="reset-page__bg">
        <div className="reset-card animate-fade-up">
          <div className="reset-card__icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>

          <h1 className="reset-card__title">Reset Password</h1>
          <p className="reset-card__subtitle">
            Enter the email address associated with your PRO-SPORT account to receive reset instructions.
          </p>

          <form className="reset-form" onSubmit={e => e.preventDefault()}>
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

            <button type="submit" className="btn-primary reset-form__submit">
              Reset Password →
            </button>
          </form>

          <Link to="/login" className="reset-card__back">← Back to Login</Link>
        </div>
      </div>

      <Footer variant="light" />
    </div>
  )
}
