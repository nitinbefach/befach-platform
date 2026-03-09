'use client';

/**
 * Variant C — Alternating Zigzag
 *
 * Cards alternate left-right layout with large step numbers.
 * Scale-in animation on scroll. Strong visual rhythm.
 *
 * CUSTOMIZE:
 * - Step number size: search for "step-number" styles
 * - Alternating background: search for "nth-child"
 * - Animation: edit whileInView / initial on motion.div
 * - Card padding: search for "card-padding"
 */

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ShowcaseCard } from './showcaseContent';
import MockDashboard from './MockDashboard';

interface Props {
  cards: ShowcaseCard[];
}

export default function ZigzagCards({ cards }: Props) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="zigzag-section">
      <div className="zigzag-container">
        {/* Section header */}
        <div className="zigzag-header">
          <p className="zigzag-label">Platform Walkthrough</p>
          <h2 className="zigzag-title">Four problems. Four solutions. One platform.</h2>
        </div>

        {/* Cards */}
        <div className="zigzag-cards">
          {cards.map((card, i) => {
            const isEven = i % 2 === 1;
            return (
              <motion.div
                key={card.id}
                className={`zigzag-card ${isEven ? 'zigzag-card-reversed' : ''}`}
                initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.96 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
              >
                {/* Step number watermark */}
                <div className="zigzag-step-number" style={{ color: `${card.accentColor}08` }}>
                  {String(card.step).padStart(2, '0')}
                </div>

                {/* Text side */}
                <div className="zigzag-text">
                  <div className="zigzag-eyebrow-row">
                    <span className="zigzag-step-badge" style={{ background: card.accentColor }}>
                      {String(card.step).padStart(2, '0')}
                    </span>
                    <span className="zigzag-eyebrow" style={{ color: card.accentColor }}>
                      {card.eyebrow}
                    </span>
                  </div>

                  <h3 className="zigzag-headline">{card.problemHeadline}</h3>
                  <p className="zigzag-problem">{card.problemDescription}</p>

                  <div className="zigzag-solution-block">
                    <div className="zigzag-solution-dot" style={{ background: card.accentColor }} />
                    <div>
                      <h4 className="zigzag-solution-name">{card.solutionName}</h4>
                      <p className="zigzag-solution-desc">{card.solutionDescription}</p>
                    </div>
                  </div>

                  <a href={card.ctaHref} className="zigzag-cta" style={{ borderColor: card.accentColor, color: card.accentColor }}>
                    {card.ctaText}
                    <ArrowRight size={14} />
                  </a>
                </div>

                {/* Visual side */}
                <div className="zigzag-visual">
                  <MockDashboard mockType={card.mockType} accentColor={card.accentColor} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .zigzag-section {
          padding: 80px 0 100px;
          background: #faf9f7;
        }
        .zigzag-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 clamp(16px, 4vw, 48px);
        }

        /* Header */
        .zigzag-header {
          text-align: center;
          margin-bottom: 56px;
        }
        .zigzag-label {
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--landing-primary-end, #d97706);
          margin-bottom: 12px;
        }
        .zigzag-title {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 800;
          line-height: 1.15;
          color: #111827;
        }

        /* Cards */
        .zigzag-cards {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .zigzag-section :global(.zigzag-card) {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: clamp(24px, 5vw, 56px);
          align-items: center;
          padding: clamp(32px, 5vw, 56px) clamp(24px, 4vw, 48px);
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid #e5e7eb;
        }
        .zigzag-section :global(.zigzag-card:last-child) {
          border-bottom: none;
        }
        .zigzag-section :global(.zigzag-card:nth-child(even)) {
          background: #ffffff;
        }

        /* Reversed layout for even cards */
        .zigzag-section :global(.zigzag-card-reversed) {
          direction: rtl;
        }
        .zigzag-section :global(.zigzag-card-reversed) .zigzag-text,
        .zigzag-section :global(.zigzag-card-reversed) .zigzag-visual {
          direction: ltr;
        }

        /* Step number watermark */
        .zigzag-step-number {
          position: absolute;
          top: -10px;
          right: 24px;
          font-size: clamp(6rem, 12vw, 10rem);
          font-weight: 900;
          line-height: 1;
          pointer-events: none;
          user-select: none;
        }

        /* Text side */
        .zigzag-eyebrow-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }
        .zigzag-step-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          color: #ffffff;
          font-size: 0.7rem;
          font-weight: 800;
        }
        .zigzag-eyebrow {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .zigzag-headline {
          font-size: clamp(1.2rem, 2.5vw, 1.55rem);
          font-weight: 800;
          line-height: 1.25;
          color: #111827;
          margin-bottom: 10px;
        }
        .zigzag-problem {
          font-size: 0.9rem;
          color: #6b7280;
          line-height: 1.65;
          margin-bottom: 22px;
        }

        /* Solution block */
        .zigzag-solution-block {
          display: flex;
          gap: 14px;
          margin-bottom: 24px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 14px;
        }
        .zigzag-solution-dot {
          width: 4px;
          min-height: 100%;
          border-radius: 4px;
          flex-shrink: 0;
        }
        .zigzag-solution-name {
          font-size: 0.92rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 4px;
        }
        .zigzag-solution-desc {
          font-size: 0.85rem;
          color: #6b7280;
          line-height: 1.6;
        }

        /* CTA */
        .zigzag-cta {
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
        .zigzag-cta:hover {
          background: currentColor;
          color: #ffffff !important;
        }
        .zigzag-cta:hover :global(svg) {
          color: #ffffff;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .zigzag-section {
            padding: 48px 0 64px;
          }
          .zigzag-section :global(.zigzag-card),
          .zigzag-section :global(.zigzag-card-reversed) {
            grid-template-columns: 1fr;
            direction: ltr;
            padding: 28px 20px;
          }
          .zigzag-step-number {
            font-size: 5rem;
            top: -5px;
            right: 12px;
          }
          .zigzag-header {
            margin-bottom: 36px;
          }
        }
        @media (max-width: 480px) {
          .zigzag-section {
            padding: 32px 0 48px;
          }
          .zigzag-section :global(.zigzag-card) {
            padding: 24px 16px;
          }
          .zigzag-step-number {
            font-size: 4rem;
          }
        }
      `}</style>
    </section>
  );
}
