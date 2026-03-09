'use client';

import { AlertTriangle, ArrowRight, Clock3, ShieldAlert } from 'lucide-react';
import { usePostHog } from 'posthog-js/react';
import { captureLandingEvent } from '@/lib/landingTracking';

interface ProblemHeroProps {
  variant: 'A' | 'B';
}

export default function ProblemHero({ variant }: ProblemHeroProps) {
  const posthog = usePostHog();

  return (
    <section className={`problem-hero variant-${variant.toLowerCase()}`}>
      <div className="container hero-inner">
        <div className="hero-copy">
          <p className="eyebrow">Problem First</p>
          <h1>Global trade breaks when cost, delay, and compliance risks are discovered too late.</h1>
          <p className="subtitle">
            Importers and exporters lose margin, miss commitments, and absorb avoidable penalties when critical signals stay fragmented.
          </p>
          <div className="hero-ctas">
            <a
              href="/onboarding"
              className="btn btn-primary"
              onClick={() =>
                captureLandingEvent(posthog, {
                  event_name: 'landing_cta_click',
                  variant,
                  section: 'hero',
                  cta_type: 'primary',
                })
              }
            >
              <ArrowRight size={16} />
              Start Free Trial
            </a>
            <a
              href="#solutions"
              className="btn btn-outline"
              onClick={() =>
                captureLandingEvent(posthog, {
                  event_name: 'landing_cta_click',
                  variant,
                  section: 'hero',
                  cta_type: 'secondary',
                })
              }
            >
              See Solution Mapping
            </a>
          </div>
        </div>
        <div className="risk-panel" aria-label="Trade risk summary panel">
          <h2>Today&apos;s Friction Snapshot</h2>
          <div className="risk-item">
            <AlertTriangle size={16} />
            <div>
              <strong>Cost Leak</strong>
              <p>Late duty + freight discovery after supplier commit.</p>
            </div>
          </div>
          <div className="risk-item">
            <Clock3 size={16} />
            <div>
              <strong>Delay Chain</strong>
              <p>Disconnected updates hide bottlenecks until late.</p>
            </div>
          </div>
          <div className="risk-item">
            <ShieldAlert size={16} />
            <div>
              <strong>Compliance Exposure</strong>
              <p>Small filing errors trigger clearance friction.</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .problem-hero {
          padding-top: calc(var(--landing-header-height) + 42px);
          padding-bottom: 56px;
          background: #ffffff;
        }

        .problem-hero.variant-b {
          background:
            radial-gradient(circle at 20% 8%, rgba(245, 158, 11, 0.16), transparent 36%),
            radial-gradient(circle at 88% 16%, rgba(17, 24, 39, 0.08), transparent 38%),
            #ffffff;
        }

        .container {
          max-width: var(--landing-container);
          margin: 0 auto;
          padding: 0 clamp(16px, 4vw, 48px);
        }

        .hero-inner {
          display: grid;
          grid-template-columns: 1.25fr 1fr;
          gap: 28px;
          align-items: stretch;
        }

        .eyebrow {
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: 0.75rem;
          color: #b45309;
          font-weight: 800;
          margin-bottom: 10px;
        }

        h1 {
          font-size: clamp(1.9rem, 4.2vw, 3.15rem);
          line-height: 1.1;
          color: #111827;
          font-weight: 900;
          letter-spacing: -0.02em;
          margin-bottom: 14px;
          max-width: 20ch;
        }

        .subtitle {
          color: #4b5563;
          line-height: 1.7;
          margin-bottom: 22px;
          max-width: 62ch;
        }

        .hero-ctas {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .btn {
          display: inline-flex;
          gap: 8px;
          align-items: center;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 700;
          font-size: 0.9rem;
          padding: 12px 20px;
        }

        .btn-primary {
          background: var(--landing-primary-end);
          color: #ffffff;
        }

        .btn-outline {
          color: #1f2937;
          border: 1px solid #d1d5db;
          background: #ffffff;
        }

        .risk-panel {
          background: #17120a;
          color: #fef3c7;
          border-radius: 14px;
          padding: 18px;
          border: 1px solid rgba(245, 158, 11, 0.35);
        }

        .risk-panel h2 {
          font-size: 0.95rem;
          margin-bottom: 12px;
          color: #fcd34d;
          font-weight: 800;
          letter-spacing: 0.02em;
        }

        .risk-item {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
          padding: 10px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.05);
        }

        .risk-item strong {
          display: block;
          font-size: 0.86rem;
        }

        .risk-item p {
          color: #fef9c3;
          opacity: 0.85;
          font-size: 0.78rem;
          line-height: 1.5;
        }

        @media (max-width: 980px) {
          .hero-inner {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .problem-hero {
            padding-top: calc(var(--landing-header-height) + 30px);
            padding-bottom: 32px;
          }

          .hero-ctas {
            flex-direction: column;
          }

          .btn {
            justify-content: center;
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
