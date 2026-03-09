'use client';

/**
 * Variant D — Layered / Overlapping Cards
 *
 * Dark-themed cards with position:sticky that overlap as user scrolls.
 * Colored accent sidebar per card. Fintech aesthetic.
 * Subtle 3D perspective entrance animation.
 *
 * CUSTOMIZE:
 * - Dark background: search for "card-bg" colors
 * - Sticky top offset: search for "stickyTop"
 * - 3D animation: edit rotateX in initial/whileInView
 * - Accent sidebar width: search for "accent-bar"
 */

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ShowcaseCard } from './showcaseContent';
import MockDashboard from './MockDashboard';

interface Props {
  cards: ShowcaseCard[];
}

export default function LayeredCards({ cards }: Props) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="layered-section">
      <div className="layered-container">
        {/* Section header */}
        <div className="layered-header">
          <p className="layered-label">The Befach Platform</p>
          <h2 className="layered-title">Every problem has a purpose-built solution</h2>
          <p className="layered-subtitle">
            Scroll through to see how each trade challenge maps to a specific platform capability.
          </p>
        </div>

        {/* Sticky cards */}
        <div className="layered-stack" style={{ perspective: '1200px' }}>
          {cards.map((card, i) => {
            const stickyTop = 100 + i * 24;
            return (
              <div key={card.id} className="layered-card-wrapper" style={{ position: 'sticky', top: stickyTop, zIndex: i + 1 }}>
                <motion.article
                  className="layered-card"
                  initial={prefersReducedMotion ? {} : { opacity: 0, y: 50, rotateX: 4 }}
                  whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  {/* Accent sidebar */}
                  <div className="layered-accent-bar" style={{ background: card.accentColor }} />

                  <div className="layered-card-inner">
                    {/* Text column */}
                    <div className="layered-text">
                      <div className="layered-eyebrow-row">
                        <span className="layered-severity" style={{ background: `${card.accentColor}20`, color: card.accentColor }}>
                          {card.eyebrow}
                        </span>
                        <span className="layered-step">Step {card.step} of {cards.length}</span>
                      </div>

                      <h3 className="layered-headline">{card.problemHeadline}</h3>
                      <p className="layered-problem">{card.problemDescription}</p>

                      <div className="layered-solution-divider" style={{ background: `${card.accentColor}40` }} />

                      <div className="layered-solution-tag">
                        <div className="layered-solution-dot" style={{ background: card.accentColor }} />
                        {card.solutionName}
                      </div>
                      <p className="layered-solution-desc">{card.solutionDescription}</p>

                      <a href={card.ctaHref} className="layered-cta" style={{ borderColor: `${card.accentColor}60`, color: card.accentColor }}>
                        {card.ctaText}
                        <ArrowRight size={14} />
                      </a>
                    </div>

                    {/* Visual column */}
                    <div className="layered-visual">
                      <MockDashboard mockType={card.mockType} accentColor={card.accentColor} dark />
                    </div>
                  </div>
                </motion.article>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .layered-section {
          padding: 80px 0 100px;
          background: #0f172a;
          color: #e2e8f0;
        }
        .layered-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 clamp(16px, 4vw, 48px);
        }

        /* Header */
        .layered-header {
          text-align: center;
          margin-bottom: 56px;
        }
        .layered-label {
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #f59e0b;
          margin-bottom: 12px;
        }
        .layered-title {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 800;
          line-height: 1.15;
          color: #f1f5f9;
          margin-bottom: 14px;
        }
        .layered-subtitle {
          font-size: clamp(0.95rem, 2vw, 1.1rem);
          color: #94a3b8;
          max-width: 560px;
          margin: 0 auto;
          line-height: 1.7;
        }

        /* Stack */
        .layered-stack {
          display: flex;
          flex-direction: column;
        }

        .layered-card-wrapper {
          margin-bottom: 24px;
        }

        .layered-section :global(.layered-card) {
          background: #1e293b;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05);
          display: flex;
        }

        /* Accent bar */
        .layered-accent-bar {
          width: 5px;
          flex-shrink: 0;
        }

        .layered-card-inner {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: clamp(24px, 4vw, 40px);
          padding: clamp(28px, 4vw, 44px);
          flex: 1;
          align-items: center;
        }

        /* Text */
        .layered-eyebrow-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        .layered-severity {
          font-size: 0.68rem;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .layered-step {
          font-size: 0.68rem;
          color: #64748b;
          font-weight: 500;
        }
        .layered-headline {
          font-size: clamp(1.2rem, 2.5vw, 1.5rem);
          font-weight: 800;
          line-height: 1.25;
          color: #f1f5f9;
          margin-bottom: 10px;
        }
        .layered-problem {
          font-size: 0.88rem;
          color: #94a3b8;
          line-height: 1.65;
          margin-bottom: 20px;
        }
        .layered-solution-divider {
          width: 40px;
          height: 2px;
          border-radius: 2px;
          margin-bottom: 16px;
        }
        .layered-solution-tag {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          font-weight: 700;
          color: #e2e8f0;
          margin-bottom: 6px;
        }
        .layered-solution-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .layered-solution-desc {
          font-size: 0.85rem;
          color: #94a3b8;
          line-height: 1.6;
          margin-bottom: 24px;
        }
        .layered-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 22px;
          border: 1.5px solid;
          border-radius: 10px;
          font-size: 0.82rem;
          font-weight: 700;
          text-decoration: none;
          transition: background 0.2s, color 0.2s;
        }
        .layered-cta:hover {
          background: currentColor;
          color: #0f172a !important;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .layered-card-inner {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 768px) {
          .layered-section {
            padding: 48px 0 64px;
          }
          .layered-card-wrapper {
            position: static !important;
          }
          .layered-card-inner {
            grid-template-columns: 1fr;
            padding: 24px;
          }
          .layered-section :global(.layered-card) {
            border-radius: 20px;
          }
          .layered-accent-bar {
            display: none;
          }
          .layered-header {
            margin-bottom: 36px;
          }
        }
        @media (max-width: 480px) {
          .layered-section {
            padding: 32px 0 48px;
          }
          .layered-card-inner {
            padding: 20px;
          }
        }
      `}</style>
    </section>
  );
}
