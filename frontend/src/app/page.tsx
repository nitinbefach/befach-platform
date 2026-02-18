'use client';

import { ArrowRight, PlayCircle } from 'lucide-react';
import LandingHeader from '@/components/landing/LandingHeader';
import LandingFooter from '@/components/landing/LandingFooter';
import BrowserMockup from '@/components/landing/BrowserMockup';
import InteractiveDemo from '@/components/landing/InteractiveDemo';
import ServicesBento from '@/components/landing/ServicesBento';

const testimonials = [
  {
    metric: '25%',
    metricLabel: 'cost reduction',
    quote: '"Befach transformed our sourcing process. We reduced landed costs by 25% in the first quarter alone. The cost calculator pays for itself."',
    name: 'Rajesh Kumar',
    role: 'CEO, TechImports India',
    initials: 'RK',
    avatarColor: '#d97706',
  },
  {
    metric: '40%',
    metricLabel: 'revenue growth',
    quote: '"The EXIM data analytics helped us identify three new export markets we hadn\'t considered. Revenue grew 40% year-over-year."',
    name: 'Sarah Chen',
    role: 'Director, Global Trade Co.',
    initials: 'SC',
    avatarColor: '#2563eb',
  },
  {
    metric: '3x',
    metricLabel: 'faster clearance',
    quote: '"Their customs clearance and compliance tools are exceptional. We went from 3-day clearance times to same-day. Absolutely game-changing."',
    name: 'Michael Roberts',
    role: 'Founder, Import Solutions',
    initials: 'MR',
    avatarColor: '#7c3aed',
  },
];

export default function HomePage() {
  return (
    <div className="landing-page">
      <LandingHeader />

      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <h1 className="hero-title">
              Your <span className="gradient-text">Command Center</span>
              <br />for Global Trade
            </h1>
            <p className="hero-subtitle">
              Calculate landed costs, compare 50+ carrier rates, track shipments, and manage compliance &mdash; all from one intelligent dashboard.
            </p>
            <div className="hero-ctas">
              <a href="/onboarding" className="btn btn-primary">
                <ArrowRight size={18} />
                Start Free Trial
              </a>
              <a href="#demo" className="btn btn-outline">
                <PlayCircle size={18} />
                Watch Demo
              </a>
            </div>
            <p className="hero-trust">
              No credit card required <span>&middot;</span> 14-day free trial <span>&middot;</span> 5-minute setup
            </p>
          </div>

          <BrowserMockup />
        </div>
      </section>

      {/* ===== INTERACTIVE DEMO ===== */}
      <InteractiveDemo />

      {/* ===== SERVICES BENTO GRID ===== */}
      <ServicesBento />

      {/* ===== TESTIMONIALS ===== */}
      <section className="testimonials-section" id="testimonials">
        <div className="container">
          <div className="testimonials-header">
            <p className="section-label">Testimonials</p>
            <h2 className="section-title">Real results from real traders</h2>
            <p className="section-subtitle">See how businesses like yours are saving time and money with Befach.</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-metric">
                  <span className="testimonial-metric-value">{t.metric}</span>
                  <span className="testimonial-metric-label">{t.metricLabel}</span>
                </div>
                <p className="testimonial-quote">{t.quote}</p>
                <div className="testimonial-divider"></div>
                <div className="testimonial-author">
                  <div className="testimonial-avatar" style={{ background: t.avatarColor }}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="cta-section" id="cta">
        <div className="container">
          <div className="cta-inner">
            <h2 className="cta-title">One platform for your entire trade operation</h2>
            <p className="cta-subtitle">
              From cost calculation to customs clearance &mdash; Befach brings every step of international trade under one roof. Start free, upgrade when you&apos;re ready.
            </p>
            <div className="cta-buttons">
              <a href="/onboarding" className="btn btn-cta-primary">Get Started Free</a>
              <a href="/contact" className="btn btn-cta-outline">Schedule a Walkthrough</a>
            </div>
            <p className="cta-note">
              14-day free trial <span>&middot;</span> No credit card required <span>&middot;</span> Cancel anytime
            </p>
          </div>
        </div>
      </section>

      <LandingFooter />

      <style jsx>{`
        .landing-page {
          min-height: 100vh;
          background: #ffffff;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: var(--landing-text-heading);
          line-height: 1.6;
          overflow-x: hidden;
        }

        .container {
          max-width: var(--landing-container);
          margin: 0 auto;
          padding: 0 clamp(16px, 4vw, 48px);
        }

        .gradient-text {
          background: var(--landing-gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;
          text-decoration: none;
          border: none;
          cursor: pointer;
        }

        .btn-primary {
          background: var(--landing-primary-end);
          color: #ffffff;
        }

        .btn-primary:hover {
          background: #b45309;
        }

        .btn-outline {
          border: 2px solid var(--landing-border);
          color: var(--landing-text-heading);
          background: #ffffff;
        }

        .btn-outline:hover {
          border-color: var(--landing-primary-start);
          color: var(--landing-primary-end);
          background: #fffbeb;
        }

        .section-label {
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--landing-primary-end);
          margin-bottom: 12px;
        }

        .section-title {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 16px;
          color: var(--landing-text-heading);
        }

        .section-subtitle {
          font-size: clamp(1rem, 2vw, 1.15rem);
          color: var(--landing-text-body);
          max-width: 600px;
          line-height: 1.7;
        }

        /* ===== HERO ===== */
        .hero {
          padding-top: calc(var(--landing-header-height) + 48px);
          padding-bottom: 64px;
          background: #ffffff;
          min-height: 100vh;
          display: flex;
          align-items: center;
        }

        .hero-inner {
          display: grid;
          grid-template-columns: 40% 60%;
          gap: 48px;
          align-items: center;
        }

        .hero-title {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 20px;
          letter-spacing: -0.02em;
        }

        .hero-subtitle {
          font-size: clamp(0.95rem, 2vw, 1.15rem);
          color: var(--landing-text-body);
          line-height: 1.7;
          margin-bottom: 32px;
          max-width: 520px;
        }

        .hero-ctas {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .hero-trust {
          font-size: 0.82rem;
          color: var(--landing-text-muted);
        }

        .hero-trust span {
          margin: 0 6px;
          opacity: 0.4;
        }

        @media (max-width: 1024px) {
          .hero-inner {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 40px;
          }

          .hero-subtitle {
            margin-left: auto;
            margin-right: auto;
          }

          .hero-ctas {
            justify-content: center;
          }

          .hero-trust {
            text-align: center;
          }
        }

        @media (max-width: 768px) {
          .hero {
            min-height: auto;
            padding-top: calc(var(--landing-header-height) + 40px);
            padding-bottom: 48px;
          }

          .hero-title {
            font-size: 2rem;
          }

          .hero-subtitle {
            margin-bottom: 28px;
            font-size: 0.95rem;
          }

          .hero-ctas {
            gap: 12px;
          }

          .hero-ctas .btn {
            padding: 14px 28px;
            font-size: 0.9rem;
          }
        }

        @media (max-width: 480px) {
          .hero {
            padding-top: calc(var(--landing-header-height) + 32px);
            padding-bottom: 36px;
          }

          .hero-title {
            font-size: 1.75rem;
            margin-bottom: 14px;
          }

          .hero-subtitle {
            font-size: 0.88rem;
            margin-bottom: 24px;
            line-height: 1.6;
          }

          .hero-ctas {
            flex-direction: column;
            gap: 10px;
          }

          .hero-ctas .btn {
            width: 100%;
            justify-content: center;
            padding: 13px 24px;
            font-size: 0.88rem;
          }

          .hero-trust {
            font-size: 0.75rem;
            margin-top: 4px;
          }

          .container {
            padding: 0 14px;
          }

          .section-label {
            font-size: 0.72rem;
            margin-bottom: 8px;
          }

          .section-title {
            font-size: 1.4rem;
            margin-bottom: 10px;
          }

          .section-subtitle {
            font-size: 0.88rem;
          }
        }

        /* ===== TESTIMONIALS ===== */
        .testimonials-section {
          padding: 80px 0;
          background: #ffffff;
        }

        .testimonials-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .testimonials-header .section-subtitle {
          margin: 0 auto;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .testimonial-card {
          background: var(--landing-light-bg);
          border-radius: 24px;
          padding: 32px;
          display: flex;
          flex-direction: column;
        }

        .testimonial-metric {
          display: inline-flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 20px;
        }

        .testimonial-metric-value {
          font-size: 2rem;
          font-weight: 800;
          color: var(--landing-primary-start);
          line-height: 1;
        }

        .testimonial-metric-label {
          font-size: 0.8rem;
          color: var(--landing-text-muted);
          font-weight: 500;
        }

        .testimonial-quote {
          font-size: 0.95rem;
          line-height: 1.65;
          color: var(--landing-text-body);
          margin-bottom: 24px;
          flex: 1;
        }

        .testimonial-divider {
          height: 1px;
          background: var(--landing-border);
          margin-bottom: 20px;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .testimonial-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.8rem;
          color: #ffffff;
          flex-shrink: 0;
        }

        .testimonial-name {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--landing-text-heading);
        }

        .testimonial-role {
          font-size: 0.75rem;
          color: var(--landing-text-muted);
        }

        @media (max-width: 1024px) {
          .testimonials-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 768px) {
          .testimonials-grid {
            grid-template-columns: 1fr;
          }

          .testimonials-section {
            padding: 48px 0;
          }
        }

        @media (max-width: 480px) {
          .testimonials-section {
            padding: 32px 0;
          }

          .testimonial-card {
            padding: 24px;
          }

          .testimonial-metric-value {
            font-size: 1.5rem;
          }

          .testimonial-quote {
            font-size: 0.88rem;
          }

          .testimonials-header {
            margin-bottom: 32px;
          }
        }

        /* ===== CTA SECTION ===== */
        .cta-section {
          padding: 56px 0;
          background: #ffffff;
          text-align: center;
          border-top: 1px solid var(--landing-border);
        }

        .cta-inner {
          max-width: 600px;
          margin: 0 auto;
        }

        .cta-title {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 800;
          color: var(--landing-text-heading);
          margin-bottom: 16px;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        .cta-subtitle {
          font-size: clamp(0.95rem, 2vw, 1.05rem);
          color: var(--landing-text-body);
          margin-bottom: 28px;
          line-height: 1.7;
        }

        .cta-buttons {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-cta-primary {
          background: var(--landing-gradient-primary);
          color: #ffffff;
          padding: 14px 32px;
          font-size: 0.95rem;
          font-weight: 600;
          border-radius: 8px;
          transition: opacity 0.2s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
        }

        .btn-cta-primary:hover {
          opacity: 0.9;
        }

        .btn-cta-outline {
          border: 1.5px solid var(--landing-border);
          color: var(--landing-text-heading);
          padding: 14px 32px;
          font-size: 0.95rem;
          font-weight: 500;
          border-radius: 8px;
          transition: border-color 0.2s, background 0.2s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
        }

        .btn-cta-outline:hover {
          border-color: var(--landing-text-muted);
          background: var(--landing-light-bg);
        }

        .cta-note {
          margin-top: 20px;
          font-size: 0.78rem;
          color: var(--landing-text-muted);
        }

        .cta-note span {
          margin: 0 6px;
          opacity: 0.4;
        }

        @media (max-width: 768px) {
          .cta-section {
            padding: 40px 0;
          }
        }

        @media (max-width: 480px) {
          .cta-section {
            padding: 28px 0;
          }

          .cta-buttons {
            flex-direction: column;
          }

          .btn-cta-primary,
          .btn-cta-outline {
            width: 100%;
            justify-content: center;
            text-align: center;
          }

          .cta-title {
            font-size: 1.5rem;
          }

          .cta-subtitle {
            font-size: 0.9rem;
            margin-bottom: 20px;
          }
        }
      `}</style>
    </div>
  );
}
