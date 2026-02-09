'use client';

export interface InsightCardProps {
  insight: {
    commodity: string;
    hsn: string;
    value: string;
    origin: string;
    growth: string;
    color: string;
  };
  variant: 'chip' | 'card';
}

export function InsightCard({ insight, variant }: InsightCardProps) {
  if (variant === 'chip') {
    // Mobile horizontal scroll variant
    return (
      <div className="insight-chip">
        <h4 className="insight-name">{insight.commodity}</h4>
        <div className="insight-row">
          <span className="insight-label">HSN: {insight.hsn}</span>
        </div>
        <div className="insight-row">
          <span className="insight-value">{insight.value}</span>
          <span className="insight-growth" style={{ color: insight.color }}>
            {insight.growth}
          </span>
        </div>
        <span className="insight-origin">{insight.origin}</span>

        <style jsx>{`
          .insight-chip {
            min-width: 160px;
            scroll-snap-align: start;
            flex-shrink: 0;
            padding: 14px 16px;
            background: var(--bg-secondary);
            border-radius: 14px;
            border: 1px solid var(--border-color);
            display: flex;
            flex-direction: column;
            gap: 6px;
          }

          .insight-name {
            font-size: 0.95rem;
            font-weight: 600;
            color: var(--text-primary);
            margin: 0;
          }

          .insight-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .insight-label {
            font-size: 0.7rem;
            color: var(--text-tertiary);
          }

          .insight-value {
            font-size: 0.9rem;
            font-weight: 600;
            color: var(--text-primary);
          }

          .insight-growth {
            font-size: 0.8rem;
            font-weight: 600;
          }

          .insight-origin {
            font-size: 0.7rem;
            color: var(--text-secondary);
            margin-top: 2px;
          }
        `}</style>
      </div>
    );
  }

  // Web grid card variant
  return (
    <div className="insight-card">
      <h4 className="insight-commodity">{insight.commodity}</h4>
      <div className="insight-detail">
        <span className="insight-label">HSN:</span>
        <span className="insight-value">{insight.hsn}</span>
      </div>
      <div className="insight-detail">
        <span className="insight-label">Origin:</span>
        <span className="insight-value">{insight.origin}</span>
      </div>
      <div className="insight-detail">
        <span className="insight-label">Market Value:</span>
        <span className="insight-value">{insight.value}</span>
      </div>
      <div className="insight-growth" style={{ color: insight.color }}>
        {insight.growth}
      </div>

      <style jsx>{`
        .insight-card {
          background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
          padding: 1.25rem;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }

        .insight-card:hover {
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          transform: translateY(-3px);
        }

        .insight-commodity {
          font-weight: 600;
          margin: 0 0 1rem 0;
          color: #0f172a;
          font-size: 1rem;
        }

        .insight-detail {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }

        .insight-label {
          color: #64748b;
        }

        .insight-value {
          color: #334155;
          font-weight: 500;
        }

        .insight-growth {
          margin-top: 1rem;
          font-size: 1.25rem;
          font-weight: 700;
          text-align: right;
        }
      `}</style>
    </div>
  );
}
