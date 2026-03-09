'use client';

import type { OutcomeStory } from './problemContent';

interface OutcomeTestimonialsProps {
  stories: OutcomeStory[];
  variant: 'A' | 'B';
}

export default function OutcomeTestimonials({ stories, variant }: OutcomeTestimonialsProps) {
  return (
    <section id="testimonials" className={`outcome-section variant-${variant.toLowerCase()}`}>
      <div className="container">
        <div className="head">
          <p className="label">Outcome Stories</p>
          <h2>Before and after operational outcomes from the same core problems</h2>
        </div>
        <div className="stories">
          {stories.map((story) => (
            <article key={story.id} className="story-card">
              <div className="chip">Before</div>
              <p className="problem">{story.problem}</p>
              <div className="chip chip-after">After</div>
              <p className="outcome">{story.outcome}</p>
              <p className="persona">{story.persona}</p>
            </article>
          ))}
        </div>
      </div>

      <style jsx>{`
        .outcome-section {
          padding: 50px 0;
          background: #ffffff;
        }

        .outcome-section.variant-b {
          background:
            radial-gradient(circle at 10% 10%, rgba(245, 158, 11, 0.09), transparent 38%),
            #ffffff;
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
          max-width: 28ch;
        }

        .stories {
          display: grid;
          gap: 14px;
          grid-template-columns: repeat(3, 1fr);
        }

        .story-card {
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          padding: 14px;
          background: #ffffff;
        }

        .chip {
          display: inline-flex;
          border-radius: 999px;
          padding: 3px 8px;
          font-size: 0.68rem;
          font-weight: 700;
          color: #7f1d1d;
          background: #fee2e2;
          margin-bottom: 7px;
        }

        .chip-after {
          color: #14532d;
          background: #dcfce7;
          margin-top: 8px;
        }

        .problem,
        .outcome {
          color: #374151;
          font-size: 0.83rem;
          line-height: 1.55;
        }

        .persona {
          margin-top: 10px;
          color: #6b7280;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        @media (max-width: 1024px) {
          .stories {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 768px) {
          .stories {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
