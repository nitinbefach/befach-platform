'use client';

/**
 * Variant B — Sticky Scroll Storytelling
 *
 * Left column stays sticky with section context.
 * Right column scrolls through problem→solution cards with accent borders.
 * Editorial / storytelling feel.
 *
 * CUSTOMIZE:
 * - Sticky top offset: search for "top: 120px"
 * - Card accent border: search for "borderLeft"
 * - Animation: edit whileInView / initial on motion.div
 * - Background: edit .sticky-section background
 */

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ShowcaseCard } from './showcaseContent';
import MockDashboard from './MockDashboard';

interface Props {
  cards: ShowcaseCard[];
}

export default function StickyScroll({ cards }: Props) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="sticky-section">
      <div className="sticky-container">
        {/* Left — Sticky context */}
        <div className="sticky-left">
          <div className="sticky-left-inner">
            <p className="sticky-label">Problems & Solutions</p>
            <h2 className="sticky-title">From Problems<br />to Solutions</h2>
            <div className="sticky-accent-line" />
            <p className="sticky-desc">
              Global trade is full of friction — hidden costs, shipment chaos, compliance traps, and scaling pain. Scroll through each challenge and see how Befach turns it into a solved workflow.
            </p>
            <div className="sticky-step-count">
              <span className="sticky-step-number">{cards.length}</span>
              <span className="sticky-step-text">solutions that<br />drive results</span>
            </div>
          </div>
        </div>

        {/* Right — Scrolling cards */}
        <div className="sticky-right">
          {cards.map((card, i) => (
            <motion.article
              key={card.id}
              className="sticky-card"
              style={{ borderLeftColor: card.accentColor }}
              initial={prefersReducedMotion ? {} : { opacity: 0, x: 30 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.05, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="sticky-card-problem">
                <span className="sticky-card-tag" style={{ color: card.accentColor, background: `${card.accentColor}10` }}>
                  The Problem
                </span>
                <h3 className="sticky-card-headline">{card.problemHeadline}</h3>
                <p className="sticky-card-text">{card.problemDescription}</p>
              </div>

              <div className="sticky-card-divider" />

              <div className="sticky-card-solution">
                <span className="sticky-card-tag" style={{ color: '#22c55e', background: '#22c55e10' }}>
                  The Solution
                </span>
                <h4 className="sticky-card-solution-name" style={{ color: card.accentColor }}>
                  {card.solutionName}
                </h4>
                <p className="sticky-card-text">{card.solutionDescription}</p>
              </div>

              <div className="sticky-card-visual">
                <MockDashboard mockType={card.mockType} accentColor={card.accentColor} />
              </div>

              <a href={card.ctaHref} className="sticky-card-cta" style={{ color: card.accentColor }}>
                {card.ctaText}
                <ArrowRight size={14} />
              </a>
            </motion.article>
          ))}
        </div>
      </div>

      <style jsx>{`
        .sticky-section {
          padding: 80px 0 100px;
          background: #ffffff;
        }
        .sticky-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 clamp(16px, 4vw, 48px);
          display: flex;
          gap: clamp(32px, 5vw, 64px);
          align-items: flex-start;
        }

        /* Left sticky */
        .sticky-left {
          width: 38%;
          flex-shrink: 0;
          position: sticky;
          top: 120px;
          align-self: flex-start;
        }
        .sticky-left-inner {
          max-width: 360px;
        }
        .sticky-label {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--landing-primary-end, #d97706);
          margin-bottom: 14px;
        }
        .sticky-title {
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          font-weight: 800;
          line-height: 1.15;
          color: #111827;
          margin-bottom: 20px;
        }
        .sticky-accent-line {
          width: 48px;
          height: 3px;
          border-radius: 3px;
          background: var(--landing-gradient-primary, linear-gradient(135deg, #f59e0b, #d97706));
          margin-bottom: 20px;
        }
        .sticky-desc {
          font-size: 0.92rem;
          color: #6b7280;
          line-height: 1.7;
          margin-bottom: 32px;
        }
        .sticky-step-count {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .sticky-step-number {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--landing-primary-end, #d97706);
          line-height: 1;
        }
        .sticky-step-text {
          font-size: 0.8rem;
          color: #9ca3af;
          line-height: 1.4;
        }

        /* Right scrolling cards */
        .sticky-right {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .sticky-section :global(.sticky-card) {
          background: #ffffff;
          border-radius: 24px;
          padding: clamp(24px, 3vw, 36px);
          border: 1px solid #f3f4f6;
          border-left: 4px solid;
          box-shadow: 0 2px 16px rgba(0, 0, 0, 0.03);
        }

        .sticky-card-tag {
          display: inline-block;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 3px 10px;
          border-radius: 20px;
          margin-bottom: 10px;
        }
        .sticky-card-headline {
          font-size: clamp(1.1rem, 2vw, 1.35rem);
          font-weight: 800;
          line-height: 1.25;
          color: #111827;
          margin-bottom: 8px;
        }
        .sticky-card-text {
          font-size: 0.88rem;
          color: #6b7280;
          line-height: 1.65;
        }
        .sticky-card-divider {
          height: 1px;
          background: #f3f4f6;
          margin: 20px 0;
        }
        .sticky-card-solution-name {
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 6px;
        }
        .sticky-card-visual {
          margin-top: 20px;
        }
        .sticky-card-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 18px;
          font-size: 0.82rem;
          font-weight: 700;
          text-decoration: none;
          transition: gap 0.2s;
        }
        .sticky-card-cta:hover {
          gap: 10px;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .sticky-container {
            flex-direction: column;
          }
          .sticky-left {
            width: 100%;
            position: static;
            margin-bottom: 16px;
          }
          .sticky-left-inner {
            max-width: 100%;
          }
          .sticky-title {
            font-size: 2rem;
          }
          .sticky-step-count {
            margin-bottom: 8px;
          }
        }
        @media (max-width: 768px) {
          .sticky-section {
            padding: 48px 0 64px;
          }
          .sticky-right {
            gap: 24px;
          }
        }
        @media (max-width: 480px) {
          .sticky-section {
            padding: 32px 0 48px;
          }
          .sticky-section :global(.sticky-card) {
            padding: 20px;
            border-radius: 18px;
          }
        }
      `}</style>
    </section>
  );
}
