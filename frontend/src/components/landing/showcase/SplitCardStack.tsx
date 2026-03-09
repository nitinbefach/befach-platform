'use client';

/**
 * Variant A — Split Card Stack
 *
 * Large white rounded cards stacked vertically.
 * 2-column layout: text left (60%), mock visual right (40%).
 * Fade-up scroll animation. Clean, conventional, safe.
 *
 * CUSTOMIZE:
 * - Card border-radius: search for "border-radius: 32px"
 * - Card shadow: search for "box-shadow"
 * - Animation: edit whileInView / initial props on motion.div
 * - Background: edit .split-section background color
 */

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ShowcaseCard } from './showcaseContent';
import MockDashboard from './MockDashboard';

interface Props {
  cards: ShowcaseCard[];
}

export default function SplitCardStack({ cards }: Props) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="split-section">
      <div className="split-container">
        {/* Section header */}
        <div className="split-header">
          <p className="split-label">How It Works</p>
          <h2 className="split-title">From friction to flow — in four steps</h2>
          <p className="split-subtitle">
            Every card below represents a real problem teams face in global trade — and how Befach solves it.
          </p>
        </div>

        {/* Cards */}
        <div className="split-cards">
          {cards.map((card, i) => {
            const stickyTop = 96 + i * 24;
            const isLast = i === cards.length - 1;
            return (
            <div key={card.id} className="split-card-wrapper" style={{ position: 'sticky', top: stickyTop, zIndex: i + 1, minHeight: isLast ? undefined : '70vh' }}>
            <motion.div
              className="split-card"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, delay: i * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {/* Text column */}
              <div className="split-text">
                <span className="split-eyebrow" style={{ color: card.accentColor }}>
                  {card.eyebrow}
                </span>
                <h3 className="split-headline">{card.problemHeadline}</h3>
                <p className="split-problem">{card.problemDescription}</p>

                <div className="split-divider" style={{ background: `${card.accentColor}30` }} />

                <div className="split-solution-label" style={{ color: card.accentColor }}>
                  {card.solutionName}
                </div>
                <p className="split-solution-desc">{card.solutionDescription}</p>

                <a href={card.ctaHref} className="split-cta" style={{ background: card.accentColor }}>
                  {card.ctaText}
                  <ArrowRight size={15} />
                </a>
              </div>

              {/* Visual column */}
              <div className="split-visual">
                <MockDashboard mockType={card.mockType} accentColor={card.accentColor} />
              </div>
            </motion.div>
            </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .split-section {
          padding: 80px 0 100px;
          background: #ffffff;
          position: relative;
        }
        .split-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 clamp(16px, 4vw, 48px);
        }

        /* Header */
        .split-header {
          text-align: center;
          margin-bottom: 56px;
        }
        .split-label {
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--landing-primary-end, #d97706);
          margin-bottom: 12px;
        }
        .split-title {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 800;
          line-height: 1.15;
          color: #111827;
          margin-bottom: 14px;
        }
        .split-subtitle {
          font-size: clamp(0.95rem, 2vw, 1.1rem);
          color: #6b7280;
          max-width: 560px;
          margin: 0 auto;
          line-height: 1.7;
        }

        /* Cards stack */
        .split-cards {
          display: flex;
          flex-direction: column;
        }

        /* Sticky wrapper — min-height set inline for scroll room */

        /* Individual card — uses global class for motion.div child */
        .split-section :global(.split-card) {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: clamp(24px, 4vw, 48px);
          align-items: center;
          background: #ffffff;
          border-radius: 32px;
          padding: clamp(28px, 4vw, 48px);
          border: 1px solid #e5e7eb;
        }

        /* Text side */
        .split-eyebrow {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .split-headline {
          font-size: clamp(1.2rem, 2.5vw, 1.55rem);
          font-weight: 800;
          line-height: 1.25;
          color: #111827;
          margin: 10px 0 12px;
        }
        .split-problem {
          font-size: 0.92rem;
          color: #6b7280;
          line-height: 1.7;
          margin-bottom: 20px;
        }
        .split-divider {
          height: 2px;
          width: 48px;
          border-radius: 2px;
          margin-bottom: 18px;
        }
        .split-solution-label {
          font-size: 0.82rem;
          font-weight: 700;
          margin-bottom: 6px;
        }
        .split-solution-desc {
          font-size: 0.88rem;
          color: #4b5563;
          line-height: 1.65;
          margin-bottom: 24px;
        }
        .split-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 22px;
          border-radius: 10px;
          color: #ffffff;
          font-size: 0.85rem;
          font-weight: 600;
          text-decoration: none;
          transition: opacity 0.2s, transform 0.2s;
        }
        .split-cta:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .split-section :global(.split-card) {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 768px) {
          .split-section {
            padding: 48px 0 64px;
          }
          .split-section :global(.split-card) {
            grid-template-columns: 1fr;
            padding: 24px;
            border-radius: 24px;
          }
          .split-header {
            margin-bottom: 36px;
          }
        }
        @media (max-width: 480px) {
          .split-section {
            padding: 32px 0 48px;
          }
          .split-section :global(.split-card) {
            padding: 20px;
            border-radius: 20px;
          }
          .split-headline {
            font-size: 1.15rem;
          }
        }
      `}</style>
    </section>
  );
}
