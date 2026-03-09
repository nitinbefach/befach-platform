'use client';

import { useEffect } from 'react';
import { ArrowRight, Radar } from 'lucide-react';
import { usePostHog } from 'posthog-js/react';
import LandingHeader from '@/components/landing/LandingHeader';
import LandingFooter from '@/components/landing/LandingFooter';
import ProblemHero from '@/components/landing/ProblemHero';
import ProblemStack from '@/components/landing/ProblemStack';
import ProblemSolutionBridge from '@/components/landing/ProblemSolutionBridge';
import CompactFeatureDepth from '@/components/landing/CompactFeatureDepth';
import OutcomeTestimonials from '@/components/landing/OutcomeTestimonials';
import {
  outcomeStories,
  platformDepthItems,
  problemBlocks,
  solutionBlocks,
} from '@/components/landing/problemContent';
import { captureLandingEvent } from '@/lib/landingTracking';

export default function ProblemFirstPage() {
  const posthog = usePostHog();

  useEffect(() => {
    captureLandingEvent(posthog, {
      event_name: 'landing_variant_viewed',
      variant: 'B',
      section: 'page',
    });

    const sections = ['problems', 'solutions'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            captureLandingEvent(posthog, {
              event_name: 'landing_section_view',
              variant: 'B',
              section: entry.target.id,
            });
          }
        });
      },
      { threshold: 0.35 }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [posthog]);

  return (
    <div className="page-b">
      <LandingHeader />
      <ProblemHero variant="B" />
      <section className="dramatic-intro">
        <div className="container intro-grid">
          <div>
            <p className="label">Variant B</p>
            <h2>A sharper, scenario-led homepage for narrative-heavy testing.</h2>
          </div>
          <div className="signal-card">
            <Radar size={18} />
            <p>Problem-forward visual treatment is intentionally stronger than solution cards in this variant.</p>
          </div>
        </div>
      </section>
      <ProblemStack variant="B" problems={problemBlocks} solutions={solutionBlocks} />
      <ProblemSolutionBridge variant="B" problems={problemBlocks} solutions={solutionBlocks} />
      <CompactFeatureDepth items={platformDepthItems} />
      <OutcomeTestimonials stories={outcomeStories} variant="B" />

      <section id="cta" className="cta">
        <div className="container">
          <h2>Validate this narrative variant against baseline conversion.</h2>
          <p>Use this route for A/B comparison of engagement and CTA performance.</p>
          <div className="cta-actions">
            <a
              href="/onboarding"
              className="btn btn-primary"
              onClick={() =>
                captureLandingEvent(posthog, {
                  event_name: 'landing_cta_click',
                  variant: 'B',
                  section: 'cta',
                  cta_type: 'primary',
                })
              }
            >
              <ArrowRight size={16} />
              Start Free Trial
            </a>
            <a
              href="/"
              className="btn btn-outline"
              onClick={() =>
                captureLandingEvent(posthog, {
                  event_name: 'landing_cta_click',
                  variant: 'B',
                  section: 'cta',
                  cta_type: 'secondary',
                })
              }
            >
              View Variant A
            </a>
          </div>
        </div>
      </section>
      <LandingFooter />

      <style jsx>{`
        .page-b {
          min-height: 100vh;
          background: #ffffff;
          overflow-x: hidden;
        }

        .container {
          max-width: var(--landing-container);
          margin: 0 auto;
          padding: 0 clamp(16px, 4vw, 48px);
        }

        .dramatic-intro {
          padding: 22px 0 30px;
          background:
            linear-gradient(180deg, rgba(17, 24, 39, 0.95) 0%, rgba(17, 24, 39, 0.88) 100%);
        }

        .intro-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 14px;
          align-items: center;
        }

        .label {
          color: #f59e0b;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        h2 {
          color: #f9fafb;
          font-size: clamp(1.2rem, 2.7vw, 1.8rem);
          line-height: 1.25;
        }

        .signal-card {
          border: 1px solid rgba(245, 158, 11, 0.45);
          border-radius: 12px;
          padding: 12px;
          display: flex;
          gap: 8px;
          align-items: flex-start;
          color: #fef3c7;
          background: rgba(255, 255, 255, 0.03);
        }

        .signal-card p {
          line-height: 1.55;
          font-size: 0.8rem;
        }

        .cta {
          border-top: 1px solid #f3f4f6;
          padding: 52px 0;
          background: #ffffff;
          text-align: center;
        }

        .cta h2 {
          color: #111827;
          font-size: clamp(1.4rem, 3vw, 2.2rem);
          line-height: 1.2;
          margin-bottom: 10px;
        }

        .cta p {
          color: #4b5563;
          max-width: 62ch;
          margin: 0 auto 18px;
          line-height: 1.65;
        }

        .cta-actions {
          display: flex;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-radius: 8px;
          padding: 12px 20px;
          text-decoration: none;
          font-weight: 700;
          font-size: 0.9rem;
        }

        .btn-primary {
          color: #ffffff;
          background: var(--landing-primary-end);
        }

        .btn-outline {
          color: #111827;
          border: 1px solid #d1d5db;
          background: #ffffff;
        }

        @media (max-width: 900px) {
          .intro-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 560px) {
          .cta {
            padding: 34px 0;
          }

          .cta-actions {
            flex-direction: column;
          }

          .btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
