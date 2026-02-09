'use client';

interface CardSkeletonProps {
  variant?: 'metric' | 'order' | 'insight';
  count?: number;
}

export function CardSkeleton({ variant = 'metric', count = 1 }: CardSkeletonProps) {
  const renderSkeleton = () => {
    switch (variant) {
      case 'metric':
        return (
          <div className="metric-card skeleton-card">
            <div className="metric-header">
              <div className="skeleton-icon-wrapper" />
              <div className="skeleton-badge" />
            </div>
            <div className="skeleton-text skeleton-xl" />
            <div className="skeleton-text skeleton-md" />
            <div className="skeleton-text skeleton-sm" />
          </div>
        );

      case 'order':
        return (
          <div className="order-skeleton skeleton-card">
            <div className="skeleton-row">
              <div className="skeleton-text skeleton-sm" />
              <div className="skeleton-text skeleton-sm" />
            </div>
            <div className="skeleton-text skeleton-lg" />
            <div className="skeleton-text skeleton-md" />
            <div className="skeleton-row">
              <div className="skeleton-badge" />
              <div className="skeleton-text skeleton-sm" />
            </div>
          </div>
        );

      case 'insight':
        return (
          <div className="insight-skeleton skeleton-card">
            <div className="skeleton-text skeleton-lg" />
            <div className="skeleton-text skeleton-md" />
            <div className="skeleton-text skeleton-md" />
            <div className="skeleton-text skeleton-md" />
            <div className="skeleton-text skeleton-xl" style={{ marginTop: '1rem' }} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>{renderSkeleton()}</div>
      ))}

      <style jsx>{`
        .skeleton-card {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          padding: 1.25rem;
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
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .metric-card {
          padding: 1.5rem;
          border-radius: 16px;
        }

        .metric-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .order-skeleton {
          padding: 1.25rem;
        }

        .insight-skeleton {
          padding: 1.25rem;
        }

        .skeleton-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .skeleton-icon-wrapper {
          width: 3.25rem;
          height: 3.25rem;
          border-radius: 12px;
          background: linear-gradient(135deg, #e2e8f0 0%, #f1f5f9 100%);
        }

        .skeleton-badge {
          width: 3rem;
          height: 1.5rem;
          border-radius: 20px;
          background: linear-gradient(135deg, #e2e8f0 0%, #f1f5f9 100%);
        }

        .skeleton-text {
          border-radius: 4px;
          background: linear-gradient(135deg, #e2e8f0 0%, #f1f5f9 100%);
          margin-bottom: 0.5rem;
        }

        .skeleton-xl {
          height: 2rem;
          width: 60%;
        }

        .skeleton-lg {
          height: 1.25rem;
          width: 80%;
        }

        .skeleton-md {
          height: 1rem;
          width: 70%;
        }

        .skeleton-sm {
          height: 0.75rem;
          width: 50%;
        }
      `}</style>
    </>
  );
}
