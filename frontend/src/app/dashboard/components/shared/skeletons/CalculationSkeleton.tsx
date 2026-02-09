'use client';

interface CalculationSkeletonProps {
  variant: 'mobile' | 'web';
  count?: number;
}

export function CalculationSkeleton({ variant, count = 3 }: CalculationSkeletonProps) {
  if (variant === 'mobile') {
    return (
      <div className="skeleton-stack">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="mobile-calc-skeleton">
            <div className="skeleton-row">
              <div className="skeleton-circle" />
              <div className="skeleton-text sm" />
            </div>
            <div className="skeleton-text lg" />
            <div className="skeleton-row">
              <div className="skeleton-text md" />
              <div className="skeleton-text md" />
            </div>
          </div>
        ))}

        <style jsx>{`
          .skeleton-stack {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .mobile-calc-skeleton {
            padding: 16px;
            background: var(--bg-secondary);
            border-radius: 14px;
            border: 1px solid var(--border-color);
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .skeleton-row {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .skeleton-circle {
            width: 24px;
            height: 24px;
            border-radius: 6px;
            background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
          }

          .skeleton-text {
            height: 14px;
            border-radius: 4px;
            background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
          }

          .skeleton-text.sm {
            width: 60px;
          }

          .skeleton-text.md {
            width: 100px;
          }

          .skeleton-text.lg {
            width: 80%;
            height: 18px;
          }

          @keyframes shimmer {
            0% {
              background-position: 200% 0;
            }
            100% {
              background-position: -200% 0;
            }
          }
        `}</style>
      </div>
    );
  }

  // Web skeleton variant
  return (
    <div className="calculations-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="calculation-card skeleton-card">
          <div className="calc-header">
            <div className="skeleton-circle" />
            <div className="skeleton-text skeleton-sm" />
          </div>
          <div className="skeleton-text skeleton-lg" style={{ marginBottom: '0.75rem' }} />
          <div className="skeleton-text skeleton-md" />
          <div className="skeleton-text skeleton-md" />
          <div className="skeleton-text skeleton-md" />
          <div className="calc-footer" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
            <div className="skeleton-text skeleton-lg" />
          </div>
        </div>
      ))}

      <style jsx>{`
        .calculations-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }

        @media (max-width: 1200px) {
          .calculations-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .calculations-grid {
            grid-template-columns: 1fr;
          }
        }

        .calculation-card {
          background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
          padding: 1.25rem;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }

        .skeleton-card {
          position: relative;
          overflow: hidden;
        }

        .skeleton-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.4) 50%,
            transparent 100%
          );
          animation: shimmer-overlay 1.5s infinite;
        }

        @keyframes shimmer-overlay {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .calc-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .calc-footer {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #f1f5f9;
        }

        .skeleton-circle {
          width: 1.25rem;
          height: 1.25rem;
          border-radius: 50%;
          background: linear-gradient(135deg, #e2e8f0 0%, #f1f5f9 100%);
        }

        .skeleton-text {
          border-radius: 4px;
          background: linear-gradient(135deg, #e2e8f0 0%, #f1f5f9 100%);
          margin-bottom: 0.5rem;
        }

        .skeleton-sm {
          height: 0.75rem;
          width: 50%;
        }

        .skeleton-md {
          height: 1rem;
          width: 70%;
        }

        .skeleton-lg {
          height: 1.25rem;
          width: 80%;
        }
      `}</style>
    </div>
  );
}
