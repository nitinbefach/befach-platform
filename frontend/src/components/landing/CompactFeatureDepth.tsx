'use client';

import type { PlatformDepthItem } from './problemContent';

interface CompactFeatureDepthProps {
  items: PlatformDepthItem[];
}

export default function CompactFeatureDepth({ items }: CompactFeatureDepthProps) {
  return (
    <section id="services" className="feature-depth">
      <div className="container">
        <div className="head">
          <p className="label">Platform Depth</p>
          <h2>Beyond risk control: the rest of your trade operating stack</h2>
        </div>
        <div className="grid">
          {items.map((item) => (
            <a key={item.id} href={item.href} className="feature-item">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </a>
          ))}
        </div>
      </div>

      <style jsx>{`
        .feature-depth {
          padding: 46px 0;
          background: #ffffff;
          border-top: 1px solid #f3f4f6;
        }

        .container {
          max-width: var(--landing-container);
          margin: 0 auto;
          padding: 0 clamp(16px, 4vw, 48px);
        }

        .head {
          margin-bottom: 18px;
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
          font-size: clamp(1.2rem, 2.8vw, 1.8rem);
          line-height: 1.25;
          color: #111827;
          max-width: 32ch;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 10px;
        }

        .feature-item {
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 12px;
          text-decoration: none;
          background: #ffffff;
        }

        .feature-item h3 {
          color: #111827;
          font-size: 0.86rem;
          margin-bottom: 5px;
        }

        .feature-item p {
          color: #6b7280;
          font-size: 0.75rem;
          line-height: 1.4;
        }

        @media (max-width: 1100px) {
          .grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 520px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
