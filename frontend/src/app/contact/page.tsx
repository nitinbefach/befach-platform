'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/layout/PublicLayout';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setDarkMode(savedTheme === 'dark');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PublicLayout>
      <div className={`contact-page ${darkMode ? 'dark' : ''}`}>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-bg"></div>
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1>Contact Us</h1>
            <p>We'd love to hear from you. Get in touch with our team.</p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="section contact-section">
          <div className="container">
            <div className="contact-grid">
              {/* Contact Info */}
              <div className="contact-info">
                <h2>Get in Touch</h2>
                <p className="info-desc">Have questions about our services? Need help with your import needs? Reach out to us.</p>

                <div className="info-cards">
                  <div className="info-card">
                    <div className="info-icon">
                      <Mail size={24} />
                    </div>
                    <div className="info-content">
                      <h4>Email</h4>
                      <p>support@befach.com</p>
                    </div>
                  </div>

                  <div className="info-card">
                    <div className="info-icon">
                      <Phone size={24} />
                    </div>
                    <div className="info-content">
                      <h4>Phone</h4>
                      <p>+91 98765 43210</p>
                    </div>
                  </div>

                  <div className="info-card">
                    <div className="info-icon">
                      <MapPin size={24} />
                    </div>
                    <div className="info-content">
                      <h4>Address</h4>
                      <p>123 Trade Center, Mumbai, India</p>
                    </div>
                  </div>

                  <div className="info-card">
                    <div className="info-icon">
                      <Clock size={24} />
                    </div>
                    <div className="info-content">
                      <h4>Business Hours</h4>
                      <p>Mon - Sat: 9:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="contact-form-container">
                {submitted ? (
                  <div className="success-message">
                    <div className="success-icon">
                      <CheckCircle size={48} />
                    </div>
                    <h3>Message Sent!</h3>
                    <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
                    <button onClick={() => setSubmitted(false)} className="btn-reset">
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="contact-form">
                    <h3>Send us a Message</h3>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Your Name *</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          required
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="form-group">
                        <label>Email *</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                          required
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Company</label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={e => setFormData({...formData, company: e.target.value})}
                          placeholder="Your company name"
                        />
                      </div>
                      <div className="form-group">
                        <label>Subject *</label>
                        <select
                          value={formData.subject}
                          onChange={e => setFormData({...formData, subject: e.target.value})}
                          required
                        >
                          <option value="">Select a topic</option>
                          <option value="general">General Inquiry</option>
                          <option value="sourcing">Supplier Sourcing</option>
                          <option value="pricing">Pricing & Plans</option>
                          <option value="support">Technical Support</option>
                          <option value="partnership">Partnership</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group full-width">
                      <label>Message *</label>
                      <textarea
                        value={formData.message}
                        onChange={e => setFormData({...formData, message: e.target.value})}
                        rows={5}
                        required
                        placeholder="How can we help you?"
                      />
                    </div>

                    <button type="submit" className="submit-btn">
                      <Send size={18} />
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="section map-section">
          <div className="container">
            <div className="map-wrapper">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.1160998085!2d72.74109995!3d19.0821978!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1635000000000!5m2!1sen!2sin"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>

        <style jsx>{`
          .contact-page {
            background: #ffffff;
          }

          .contact-page.dark {
            background: #0f0f0f;
          }

          /* Hero Section */
          .hero-section {
            position: relative;
            padding: 120px 24px 100px;
            text-align: center;
            overflow: hidden;
          }

          .hero-bg {
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #92400e 100%);
          }

          .hero-overlay {
            position: absolute;
            inset: 0;
            background: url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80');
            background-size: cover;
            background-position: center;
            opacity: 0.15;
          }

          .hero-content {
            position: relative;
            z-index: 1;
            max-width: 800px;
            margin: 0 auto;
          }

          .hero-section h1 {
            font-size: 3rem;
            font-weight: 800;
            color: white;
            margin-bottom: 16px;
          }

          .hero-section p {
            font-size: 1.25rem;
            color: rgba(255,255,255,0.9);
          }

          /* Container */
          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 24px;
          }

          /* Section */
          .section {
            padding: 80px 0;
          }

          /* Contact Section */
          .contact-section {
            background: #faf9f7;
          }

          .contact-page.dark .contact-section {
            background: #141414;
          }

          .contact-grid {
            display: grid;
            grid-template-columns: 1fr 1.5fr;
            gap: 48px;
            align-items: start;
          }

          .contact-info h2 {
            font-size: 2rem;
            font-weight: 700;
            color: #1c1917;
            margin-bottom: 12px;
          }

          .contact-page.dark .contact-info h2 {
            color: #ffffff;
          }

          .info-desc {
            font-size: 1rem;
            color: #78716c;
            line-height: 1.6;
            margin-bottom: 32px;
          }

          .contact-page.dark .info-desc {
            color: #a8a29e;
          }

          .info-cards {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }

          .info-card {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 20px;
            background: white;
            border-radius: 12px;
            border: 1px solid #f0eeeb;
            transition: all 0.3s ease;
          }

          .contact-page.dark .info-card {
            background: #1a1a1a;
            border-color: #2a2a2a;
          }

          .info-card:hover {
            transform: translateX(4px);
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          }

          .info-icon {
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, #fff7ed 0%, #fef3c7 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #f59e0b;
            flex-shrink: 0;
          }

          .contact-page.dark .info-icon {
            background: linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(217,119,6,0.15) 100%);
          }

          .info-content h4 {
            font-size: 0.9rem;
            font-weight: 600;
            color: #1c1917;
            margin-bottom: 4px;
          }

          .contact-page.dark .info-content h4 {
            color: #ffffff;
          }

          .info-content p {
            font-size: 0.9rem;
            color: #78716c;
          }

          .contact-page.dark .info-content p {
            color: #a8a29e;
          }

          /* Contact Form */
          .contact-form-container {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.06);
            border: 1px solid #f0eeeb;
          }

          .contact-page.dark .contact-form-container {
            background: #1a1a1a;
            border-color: #2a2a2a;
          }

          .contact-form h3 {
            font-size: 1.5rem;
            font-weight: 700;
            color: #1c1917;
            margin-bottom: 28px;
          }

          .contact-page.dark .contact-form h3 {
            color: #ffffff;
          }

          .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
          }

          .form-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .form-group.full-width {
            grid-column: span 2;
            margin-bottom: 20px;
          }

          .form-group label {
            font-size: 0.875rem;
            font-weight: 500;
            color: #1c1917;
          }

          .contact-page.dark .form-group label {
            color: #e5e5e5;
          }

          .form-group input,
          .form-group select,
          .form-group textarea {
            padding: 14px 16px;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            background: #faf9f7;
            color: #1c1917;
            font-size: 0.9375rem;
            transition: all 0.2s;
          }

          .contact-page.dark .form-group input,
          .contact-page.dark .form-group select,
          .contact-page.dark .form-group textarea {
            background: #0f0f0f;
            border-color: #2a2a2a;
            color: #e5e5e5;
          }

          .form-group input:focus,
          .form-group select:focus,
          .form-group textarea:focus {
            outline: none;
            border-color: #f59e0b;
            background: white;
          }

          .contact-page.dark .form-group input:focus,
          .contact-page.dark .form-group select:focus,
          .contact-page.dark .form-group textarea:focus {
            background: #1a1a1a;
          }

          .form-group textarea {
            resize: vertical;
            min-height: 120px;
          }

          .submit-btn {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            background: #f59e0b;
            color: white;
            border: none;
            padding: 16px 32px;
            border-radius: 50px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 4px 14px rgba(245,158,11,0.4);
          }

          .submit-btn:hover {
            background: #d97706;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(245,158,11,0.5);
          }

          /* Success Message */
          .success-message {
            text-align: center;
            padding: 60px 40px;
          }

          .success-icon {
            color: #16a34a;
            margin-bottom: 20px;
          }

          .success-message h3 {
            font-size: 1.5rem;
            font-weight: 700;
            color: #1c1917;
            margin-bottom: 12px;
          }

          .contact-page.dark .success-message h3 {
            color: #ffffff;
          }

          .success-message p {
            color: #78716c;
            margin-bottom: 28px;
          }

          .contact-page.dark .success-message p {
            color: #a8a29e;
          }

          .btn-reset {
            background: none;
            border: 2px solid #f59e0b;
            color: #f59e0b;
            padding: 12px 28px;
            border-radius: 50px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
          }

          .btn-reset:hover {
            background: #f59e0b;
            color: white;
          }

          /* Map Section */
          .map-section {
            background: #ffffff;
            padding: 0 0 80px;
          }

          .contact-page.dark .map-section {
            background: #0f0f0f;
          }

          .map-wrapper {
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          }

          /* Responsive */
          @media (max-width: 1024px) {
            .contact-grid {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 768px) {
            .hero-section h1 {
              font-size: 2.25rem;
            }

            .section {
              padding: 60px 0;
            }

            .form-row {
              grid-template-columns: 1fr;
            }

            .form-group.full-width {
              grid-column: span 1;
            }

            .contact-form-container {
              padding: 24px;
            }
          }
        `}</style>
      </div>
    </PublicLayout>
  );
}
