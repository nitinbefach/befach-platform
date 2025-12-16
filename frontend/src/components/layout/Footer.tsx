'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link href="/" className="footer-logo">
            <img src="/logo.png" alt="Befach International" className="footer-logo-image" />
          </Link>
          <p>Your trusted partner for global trade solutions. We connect businesses worldwide with quality products and seamless logistics.</p>
          <div className="social-links">
            <a href="#" aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a href="#" aria-label="Twitter">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
            <a href="#" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-links-section">
          <h4>Quick Links</h4>
          <div className="footer-links">
            <Link href="/">Home</Link>
            <Link href="/about">About Us</Link>
            <Link href="/products">Products</Link>
            <Link href="/services">Services</Link>
            <Link href="/contact">Contact Us</Link>
          </div>
        </div>

        <div className="footer-links-section">
          <h4>Solutions</h4>
          <div className="footer-links">
            <Link href="/cost-calculator">Cost Calculator</Link>
            <Link href="/shipping-calculator">Shipping Calculator</Link>
            <Link href="/market-insights">Market Insights</Link>
            <Link href="/smart-sourcing">Smart Sourcing</Link>
          </div>
        </div>

        <div className="footer-newsletter">
          <h4>Subscribe to our Newsletter</h4>
          <p>Get the latest updates on trade insights and offers.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button type="submit">Subscribe</button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Copyrights © 2024 Befach International. All rights reserved.</p>
      </div>

      <style jsx>{`
        .main-footer {
          background: #1c1917;
        }

        .footer-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 64px 24px 48px;
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1.5fr;
          gap: 48px;
        }

        .footer-brand {
          max-width: 300px;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          text-decoration: none;
          margin-bottom: 20px;
        }

        .footer-logo-image {
          height: 42px;
          width: auto;
          object-fit: contain;
        }

        .footer-brand p {
          font-size: 0.9rem;
          color: #a8a29e;
          line-height: 1.7;
          margin-bottom: 24px;
        }

        .social-links {
          display: flex;
          gap: 14px;
        }

        .social-links a {
          width: 40px;
          height: 40px;
          background: rgba(255,255,255,0.08);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #a8a29e;
          transition: all 0.2s;
        }

        .social-links a:hover {
          background: #f59e0b;
          color: white;
        }

        .footer-links-section h4 {
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 24px;
          font-size: 1rem;
        }

        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .footer-links :global(a) {
          color: #a8a29e;
          text-decoration: none;
          font-size: 0.9375rem;
          transition: all 0.2s;
        }

        .footer-links :global(a:hover) {
          color: #f59e0b;
          padding-left: 4px;
        }

        .footer-newsletter h4 {
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 12px;
          font-size: 1rem;
        }

        .footer-newsletter p {
          font-size: 0.875rem;
          color: #a8a29e;
          margin-bottom: 20px;
          line-height: 1.5;
        }

        .newsletter-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .newsletter-form input {
          width: 100%;
          padding: 14px 18px;
          border: 1px solid #3a3835;
          border-radius: 12px;
          font-size: 0.9rem;
          outline: none;
          background: rgba(255,255,255,0.05);
          color: white;
        }

        .newsletter-form input::placeholder {
          color: #78716c;
        }

        .newsletter-form input:focus {
          border-color: #f59e0b;
          background: rgba(255,255,255,0.08);
        }

        .newsletter-form button {
          background: #f59e0b;
          color: white;
          border: none;
          padding: 14px 24px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .newsletter-form button:hover {
          background: #d97706;
        }

        .footer-bottom {
          border-top: 1px solid #2a2825;
          padding: 24px;
          text-align: center;
        }

        .footer-bottom p {
          font-size: 0.875rem;
          color: #78716c;
        }

        @media (max-width: 1024px) {
          .footer-container {
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }
        }

        @media (max-width: 768px) {
          .footer-container {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 32px;
          }

          .footer-brand {
            max-width: 100%;
          }

          .footer-logo {
            justify-content: center;
          }

          .social-links {
            justify-content: center;
          }
        }
      `}</style>
    </footer>
  );
}
