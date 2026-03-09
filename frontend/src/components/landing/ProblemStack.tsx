'use client';

import { useState } from 'react';
import { ChevronDown, TriangleAlert } from 'lucide-react';
import { usePostHog } from 'posthog-js/react';
import { captureLandingEvent } from '@/lib/landingTracking';
import type { ProblemBlock, SolutionBlock } from './problemContent';

interface ProblemStackProps {
  variant: 'A' | 'B';
  problems: ProblemBlock[];
  solutions: SolutionBlock[];
}

export default function ProblemStack({ variant, problems, solutions }: ProblemStackProps) {
  const [openId, setOpenId] = useState<string>(problems[0]?.id || '');
  const posthog = usePostHog();

  return (
    <section id="problems" className={`problem-stack variant-${variant.toLowerCase()}`}>
      <div className="container">
        <div className="section-head">
          <p className="label">The Pain Surface</p>
          <h2>The biggest trade problems appear before your team can react.</h2>
        </div>

        <div className="cards">
          {problems.map((problem, idx) => {
            const mapped = solutions.find((s) => s.id === problem.solutionRef);
            const isOpen = openId === problem.id;
            return (
              <div key={problem.id}>
                <article
                  className={`problem-card severity-${problem.severity} ${idx === 0 ? 'featured' : ''}`}
                  onClick={() => {
                    setOpenId((prev) => (prev === problem.id ? '' : problem.id));
                    captureLandingEvent(posthog, {
                      event_name: 'landing_problem_engaged',
                      variant,
                      problem_id: problem.id,
                      section: 'problem-stack',
                      cta_type: 'problem',
                    });
                  }}
                >
                  <header>
                    <span className="severity">
                      <TriangleAlert size={14} />
                      {problem.severity === 'high' ? 'High Risk' : 'Medium Risk'}
                    </span>
                    <h3>{problem.title}</h3>
                  </header>
                  <p className="story">{problem.story}</p>
                  <div className="signal">{problem.painSignal}</div>
                  <div className="visual">
                    <span>{problem.visual.label}</span>
                    <ul>
                      {problem.visual.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>

                  {mapped && (
                    <div className={`solution-inline ${isOpen ? 'open' : ''}`}>
                      <button
                        className="solution-toggle"
                        aria-expanded={isOpen}
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenId((prev) => (prev === problem.id ? '' : problem.id));
                        }}
                      >
                        <span>Mapped Solution: {mapped.featureName}</span>
                        <ChevronDown size={14} />
                      </button>
                      <div className="solution-content">
                        <p>{mapped.description}</p>
                        <a
                          href={mapped.ctaHref}
                          onClick={() =>
                            captureLandingEvent(posthog, {
                              event_name: 'landing_solution_click',
                              variant,
                              problem_id: problem.id,
                              section: 'problem-stack',
                              cta_type: 'solution',
                            })
                          }
                        >
                          {mapped.ctaText}
                        </a>
                      </div>
                    </div>
                  )}
                </article>
                {idx === 1 && (
                  <a
                    href="/onboarding"
                    className="mobile-repeat-cta"
                    onClick={() =>
                      captureLandingEvent(posthog, {
                        event_name: 'landing_cta_click',
                        variant,
                        section: 'problem-stack',
                        cta_type: 'primary',
                      })
                    }
                  >
                    Start Free Trial Before More Scroll
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .problem-stack {
          padding: 48px 0;
          background: #fff8ef;
        }

        .problem-stack.variant-b {
          background:
            linear-gradient(180deg, #fff6e8 0%, #ffffff 100%);
        }

        .container {
          max-width: var(--landing-container);
          margin: 0 auto;
          padding: 0 clamp(16px, 4vw, 48px);
        }

        .section-head {
          margin-bottom: 24px;
        }

        .label {
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: 0.72rem;
          color: #b45309;
          font-weight: 700;
          margin-bottom: 8px;
        }

        h2 {
          font-size: clamp(1.4rem, 3vw, 2.2rem);
          line-height: 1.2;
          color: #111827;
          max-width: 24ch;
        }

        .cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .problem-card {
          background: #1f1408;
          color: #fffbeb;
          border-radius: 14px;
          padding: 16px;
          border: 1px solid rgba(245, 158, 11, 0.26);
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .problem-card:hover {
          transform: translateY(-2px);
        }

        .problem-card.featured {
          min-height: 380px;
        }

        .severity {
          display: inline-flex;
          gap: 6px;
          align-items: center;
          font-size: 0.68rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #fcd34d;
          margin-bottom: 10px;
          font-weight: 700;
        }

        h3 {
          font-size: 1.06rem;
          line-height: 1.3;
          margin-bottom: 10px;
        }

        .story {
          color: #fffbeb;
          opacity: 0.9;
          line-height: 1.6;
          font-size: 0.9rem;
          margin-bottom: 10px;
        }

        .signal {
          background: rgba(239, 68, 68, 0.16);
          border: 1px solid rgba(248, 113, 113, 0.5);
          color: #fecaca;
          border-radius: 8px;
          padding: 8px;
          font-size: 0.78rem;
          margin-bottom: 12px;
        }

        .visual {
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.06);
          padding: 10px;
          margin-bottom: 12px;
        }

        .visual span {
          font-size: 0.75rem;
          color: #fcd34d;
          display: block;
          margin-bottom: 8px;
          font-weight: 700;
        }

        .visual ul {
          list-style: none;
          display: grid;
          gap: 5px;
        }

        .visual li {
          font-size: 0.78rem;
          color: #fef9c3;
          padding-left: 14px;
          position: relative;
        }

        .visual li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 8px;
          width: 8px;
          height: 1px;
          background: #fcd34d;
        }

        .solution-inline {
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.24);
          background: rgba(255, 255, 255, 0.05);
          overflow: hidden;
        }

        .solution-toggle {
          width: 100%;
          background: transparent;
          border: none;
          color: #fffbeb;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
        }

        .solution-toggle :global(svg) {
          transition: transform 0.2s ease;
        }

        .solution-inline.open .solution-toggle :global(svg) {
          transform: rotate(180deg);
        }

        .solution-content {
          max-height: 0;
          overflow: hidden;
          padding: 0 10px;
          transition: max-height 0.25s ease, padding 0.25s ease;
        }

        .solution-inline.open .solution-content {
          max-height: 180px;
          padding: 0 10px 10px;
        }

        .solution-content p {
          color: #fef9c3;
          font-size: 0.76rem;
          line-height: 1.5;
          margin-bottom: 8px;
        }

        .solution-content a {
          display: inline-flex;
          padding: 7px 10px;
          border-radius: 7px;
          background: #f59e0b;
          color: #111827;
          font-size: 0.74rem;
          font-weight: 700;
          text-decoration: none;
        }

        @media (max-width: 1024px) {
          .cards {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 768px) {
          .cards {
            grid-template-columns: 1fr;
          }

          .mobile-repeat-cta {
            display: inline-flex;
            margin-top: 10px;
            width: 100%;
            justify-content: center;
            padding: 11px 12px;
            background: #f59e0b;
            color: #111827;
            border-radius: 8px;
            text-decoration: none;
            font-size: 0.82rem;
            font-weight: 800;
          }
        }

        @media (min-width: 769px) {
          .mobile-repeat-cta {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
