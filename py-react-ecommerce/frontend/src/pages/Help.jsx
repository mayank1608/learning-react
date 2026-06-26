import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFaqs, createSupportTicket } from '../services/api';
import './Help.css';

export default function Help() {
  const [faqs, setFaqs] = useState([]);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFaqs();
  }, []);

  const loadFaqs = async () => {
    try {
      const data = await getFaqs();
      setFaqs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSupportTicket(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="help-page">
      <nav className="help-navbar">
        <Link to="/" className="help-logo">ShopEY</Link>
        <div className="help-nav-links">
          <Link to="/">Home</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/profile">Profile</Link>
        </div>
      </nav>

      <div className="help-hero">
        <h1>How can we help you?</h1>
        <p>Find answers to common questions or reach out to our support team</p>
      </div>

      <div className="help-container">
        {/* FAQs */}
        <section className="faq-section">
          <h2>Frequently Asked Questions</h2>
          {loading ? (
            <div className="loading-container"><div className="spinner"></div></div>
          ) : (
            <div className="faq-list">
              {faqs.map(faq => (
                <div key={faq.id} className={`faq-item ${expandedFaq === faq.id ? 'expanded' : ''}`}>
                  <button className="faq-question" onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}>
                    <span>{faq.question}</span>
                    <span className="faq-toggle">{expandedFaq === faq.id ? '−' : '+'}</span>
                  </button>
                  {expandedFaq === faq.id && (
                    <div className="faq-answer">{faq.answer}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Contact Form */}
        <section className="contact-section">
          <h2>Contact Support</h2>
          {submitted ? (
            <div className="contact-success">
              <div className="success-icon">✓</div>
              <h3>Message Sent!</h3>
              <p>We'll get back to you within 24 hours.</p>
              <button onClick={() => setSubmitted(false)}>Send Another Message</button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea rows="5" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} required />
              </div>
              <button type="submit" className="btn-submit">Send Message</button>
            </form>
          )}
        </section>

        {/* Contact Info */}
        <section className="contact-info">
          <h2>Other Ways to Reach Us</h2>
          <div className="info-cards">
            <div className="info-card">
              <span className="info-icon">📧</span>
              <h3>Email</h3>
              <p>support@shopey.com</p>
            </div>
            <div className="info-card">
              <span className="info-icon">📞</span>
              <h3>Phone</h3>
              <p>1800-123-4567 (Toll Free)</p>
            </div>
            <div className="info-card">
              <span className="info-icon">🕐</span>
              <h3>Hours</h3>
              <p>Mon-Sat: 9AM - 8PM</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
