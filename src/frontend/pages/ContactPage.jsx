import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './ContactPage.css'

const faqs = [
  { q: 'How do I book a court?', a: 'Use our digital platform or mobile app to view real-time availability and secure your court instantly.' },
  { q: 'What is the cancellation policy?', a: 'Cancellations can be made 24 hours prior to the booking for a full refund of your amount.' },
  { q: 'Are training sessions available?', a: 'Yes, we have a roster of elite coaches available for private sessions. Enquire via the form above.' },
]

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className="contact-page">
      <Navbar theme="light" />

      <div className="contact-hero">
        <div className="container">
          <h1 className="contact-hero__title">Connect With Excellence</h1>
          <p className="contact-hero__subtitle">
            Whether you're booking a court or joining a league, our team is here to ensure your performance meets your goals.
          </p>
        </div>
      </div>

      <section className="contact-main">
        <div className="container contact-main__grid">
          {/* Left: Form */}
          <div className="contact-form-card">
            <h2 className="contact-form-card__title">Get in Touch</h2>
            <form className="contact-form" onSubmit={e => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="c-name" className="form-label">Name</label>
                <div className="input-wrap">
                  <input id="c-name" type="text" placeholder="John Doe" className="form-input" style={{paddingLeft:'14px'}} />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="c-email" className="form-label">Email</label>
                <div className="input-wrap">
                  <input id="c-email" type="email" placeholder="john@pro-sport.com" className="form-input" style={{paddingLeft:'14px'}} />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="c-subject" className="form-label">Subject</label>
                <select id="c-subject" className="form-input form-select" style={{paddingLeft:'14px'}}>
                  <option>General Inquiry</option>
                  <option>Court Booking</option>
                  <option>Technical Support</option>
                  <option>Partnership</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="c-message" className="form-label">Message</label>
                <textarea id="c-message" rows={4} placeholder="How can we help you today?" className="form-input form-textarea" style={{paddingLeft:'14px'}} />
              </div>
              <button type="submit" className="btn-primary contact-form__submit">
                Send Message →
              </button>
            </form>
          </div>

          {/* Right: Details */}
          <div className="contact-details">
            <h2 className="contact-details__title">Contact Details</h2>
            <div className="contact-detail-item">
              <div className="contact-detail-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.61 5 2 2 0 0 1 3.59 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.9a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 18z"/></svg>
              </div>
              <div>
                <p className="contact-detail-label">Hotline</p>
                <p className="contact-detail-value">+1 (800) PRO-SPORT</p>
              </div>
            </div>
            <div className="contact-detail-item">
              <div className="contact-detail-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <div>
                <p className="contact-detail-label">Email</p>
                <p className="contact-detail-value">performance@pro-sport.com</p>
              </div>
            </div>
            <div className="contact-detail-item">
              <div className="contact-detail-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div>
                <p className="contact-detail-label">Address</p>
                <p className="contact-detail-value">66 Athletic Plaza, Tech Connect<br />San Francisco, CA 94110</p>
              </div>
            </div>

            <div className="contact-socials">
              <p className="contact-socials__label">Follow Our Performance</p>
              <div className="contact-socials__icons">
                {['twitter','instagram','linkedin','youtube'].map(s => (
                  <a key={s} href="#" aria-label={s} className="contact-social-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
                  </a>
                ))}
              </div>
            </div>

            <div className="contact-live-support">
              <div>
                <p className="contact-live-support__title">Live Support</p>
                <p className="contact-live-support__desc">Our agents available 24/7 for premium coaches.</p>
              </div>
              <button className="btn-primary contact-live-support__btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Facility Image */}
      <section className="contact-facility">
        <div className="contact-facility__img-wrap">
          <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1400&q=80" alt="Elite Facility" className="contact-facility__img" />
          <div className="contact-facility__overlay">
            <div className="contact-facility__badge">Elite Facility</div>
            <p className="contact-facility__name">Centrally located in the heart of the Sport bay for easy access.</p>
            <a href="#" className="contact-facility__link">Get Directions →</a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="contact-faq">
        <div className="container">
          <div className="contact-faq__header">
            <h2 className="section-title">Quick FAQ</h2>
            <a href="#" className="contact-faq__all">View Full FAQ page →</a>
          </div>
          <div className="contact-faq__list">
            {faqs.map((f, i) => (
              <div key={i} className={`faq-item ${openFaq === i ? 'faq-item--open' : ''}`}>
                <button className="faq-item__q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{f.q}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{transform: openFaq === i ? 'rotate(90deg)' : 'none', transition: '0.2s'}}><polyline points="9 18 15 12 9 6"/></svg>
                </button>
                {openFaq === i && <p className="faq-item__a">{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer variant="dark" />
    </div>
  )
}
