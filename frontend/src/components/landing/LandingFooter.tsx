'use client';

import { Twitter, Linkedin, Github, Youtube } from 'lucide-react';

export default function LandingFooter() {
  return (
    <footer className="landing-footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-col">
            <h4>Platform</h4>
            <a href="#">Cost Calculator</a>
            <a href="#">Shipping &amp; Logistics</a>
            <a href="#">EXIM Intelligence</a>
            <a href="#">AI Assistant</a>
            <a href="#">Compliance Tools</a>
          </div>
          <div className="footer-col">
            <h4>Solutions</h4>
            <a href="#">For Importers</a>
            <a href="#">For Exporters</a>
            <a href="#">For Freight Forwarders</a>
            <a href="#">For Enterprises</a>
            <a href="#">For SMBs</a>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Blog</a>
            <a href="#">Contact</a>
            <a href="#">Privacy Policy</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; 2026 Befach International. All rights reserved.</span>
          <div className="footer-socials">
            <a href="#" aria-label="Twitter"><Twitter size={16} /></a>
            <a href="#" aria-label="LinkedIn"><Linkedin size={16} /></a>
            <a href="#" aria-label="GitHub"><Github size={16} /></a>
            <a href="#" aria-label="YouTube"><Youtube size={16} /></a>
          </div>
        </div>
        <div className="footer-brand">
          <a href="#" className="logo">
            <img src="/logo.png" alt="Befach International" className="logo-img footer-logo-img" />
          </a>
          <p>Simplifying global trade with intelligent tools for cost calculation, logistics, compliance, and market intelligence.</p>
        </div>
      </div>

      <style jsx>{`
        .landing-footer {
          background: #1c1917;
          padding: 56px 0 0;
          color: rgba(255, 255, 255, 0.6);
        }

        .footer-container {
          max-width: var(--landing-container);
          margin: 0 auto;
          padding: 0 clamp(16px, 4vw, 48px);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 40px;
          padding-bottom: 48px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .footer-col h4 {
          color: #ffffff;
          font-size: 0.85rem;
          font-weight: 700;
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .footer-col a {
          display: block;
          font-size: 0.85rem;
          padding: 4px 0;
          transition: color 0.2s;
          text-decoration: none;
          color: rgba(255, 255, 255, 0.6);
        }

        .footer-col a:hover {
          color: var(--landing-primary-start);
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 0;
          font-size: 0.8rem;
        }

        .footer-socials {
          display: flex;
          gap: 16px;
        }

        .footer-socials a {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
        }

        .footer-socials a:hover {
          background: rgba(255, 255, 255, 0.12);
          color: #ffffff;
        }

        .footer-brand {
          text-align: center;
          padding: 28px 0 8px;
        }

        .footer-brand .logo {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
        }

        .footer-brand .logo-img {
          height: 40px;
          width: auto;
          display: block;
        }

        .footer-logo-img {
          height: 38px;
        }

        .footer-brand p {
          font-size: 0.82rem;
          line-height: 1.6;
          margin-top: 12px;
          max-width: 420px;
          margin-left: auto;
          margin-right: auto;
        }

        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 28px;
          }

          .footer-bottom {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }

          .landing-footer {
            padding: 40px 0 0;
          }

          .footer-brand p {
            font-size: 0.78rem;
          }
        }

        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 24px;
            padding-bottom: 28px;
          }

          .landing-footer {
            padding: 28px 0 0;
          }

          .footer-col a {
            padding: 6px 0;
            font-size: 0.82rem;
          }

          .footer-bottom {
            padding: 18px 0;
            font-size: 0.72rem;
          }

          .footer-socials a {
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </footer>
  );
}
