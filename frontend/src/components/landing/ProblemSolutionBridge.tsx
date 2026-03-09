'use client';

import { usePostHog } from 'posthog-js/react';
import { captureLandingEvent } from '@/lib/landingTracking';
import type { ProblemBlock, SolutionBlock } from './problemContent';

interface ProblemSolutionBridgeProps {
  variant: 'A' | 'B';
  problems: ProblemBlock[];
  solutions: SolutionBlock[];
}

export default function ProblemSolutionBridge({ variant, problems, solutions }: ProblemSolutionBridgeProps) {
  const posthog = usePostHog();

  return (
    <section id="solutions" className={`bridge variant-${variant.toLowerCase()}`}>
      <div className="container">
        <div className="head">
          <p className="label">Problem to Solution</p>
          <h2>Every critical risk maps to a focused workflow.</h2>
        </div>
        <div className="bridge-grid">
          {problems.map((problem) => {
            const solution = solutions.find((item) => item.id === problem.solutionRef);
            if (!solution) return null;
            return (
              <div key={problem.id} className="bridge-item">
                <div className="problem-ref">{problem.title}</div>
                <div className="solution-card">
                  <h3>{solution.featureName}</h3>
                  <p>{solution.description}</p>
                  <span className="proof">{solution.proofPoint}</span>
                  <a
                    href={solution.ctaHref}
                    onClick={() =>
                      captureLandingEvent(posthog, {
                        event_name: 'landing_solution_click',
                        variant,
                        problem_id: problem.id,
                        section: 'solution-bridge',
                        cta_type: 'solution',
                      })
                    }
                  >
                    {solution.ctaText}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .bridge {
          padding: 48px 0;
          background: #ffffff;
        }

        .bridge.variant-b {
          background: #faf7f2;
        }

        .container {
          max-width: var(--landing-container);
          margin: 0 auto;
          padding: 0 clamp(16px, 4vw, 48px);
        }

        .head {
          margin-bottom: 20px;
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
          font-size: clamp(1.3rem, 3vw, 2rem);
          line-height: 1.2;
          color: #111827;
        }

        .bridge-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .bridge-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .problem-ref {
          font-size: 0.74rem;
          color: #7c2d12;
          font-weight: 700;
          line-height: 1.4;
        }

        .solution-card {
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 14px;
          background: #ffffff;
        }

        .solution-card h3 {
          font-size: 0.95rem;
          margin-bottom: 6px;
          color: #111827;
        }

        .solution-card p {
          font-size: 0.83rem;
          line-height: 1.55;
          color: #4b5563;
          margin-bottom: 7px;
        }

        .proof {
          display: block;
          color: #9a3412;
          background: #ffedd5;
          border-radius: 7px;
          font-size: 0.72rem;
          padding: 6px 8px;
          margin-bottom: 9px;
          font-weight: 600;
        }

        .solution-card a {
          display: inline-flex;
          text-decoration: none;
          color: #111827;
          background: #f3f4f6;
          border-radius: 7px;
          font-size: 0.75rem;
          padding: 7px 9px;
          font-weight: 700;
        }

        @media (max-width: 1024px) {
          .bridge-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 768px) {
          .bridge-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
