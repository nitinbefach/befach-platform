'use client';

import { EstimatedTime as EstimatedTimeType } from '@/lib/requirements';

interface EstimatedTimeProps {
  estimatedTime: EstimatedTimeType;
  showBasis?: boolean;
  size?: 'sm' | 'md';
}

export default function EstimatedTime({
  estimatedTime,
  showBasis = false,
  size = 'md',
}: EstimatedTimeProps) {
  const isComplete = estimatedTime.minDays === 0 && estimatedTime.maxDays === 0;

  if (isComplete) {
    return (
      <span className="estimated-complete">
        <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Complete
        <style jsx>{`
          .estimated-complete {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            color: #10B981;
            font-size: ${size === 'sm' ? '0.8rem' : '0.9rem'};
            font-weight: 500;
          }
          .check-icon {
            width: ${size === 'sm' ? '14px' : '16px'};
            height: ${size === 'sm' ? '14px' : '16px'};
          }
        `}</style>
      </span>
    );
  }

  return (
    <div className="estimated-time">
      <div className="time-display">
        <svg className="clock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12,6 12,12 16,14"/>
        </svg>
        <span className="time-text">{estimatedTime.displayText}</span>
      </div>
      {showBasis && (
        <span className="time-basis">Based on: {estimatedTime.basedOn}</span>
      )}

      <style jsx>{`
        .estimated-time {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .time-display {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: var(--text-secondary);
          font-size: ${size === 'sm' ? '0.8rem' : '0.9rem'};
        }

        .clock-icon {
          width: ${size === 'sm' ? '14px' : '16px'};
          height: ${size === 'sm' ? '14px' : '16px'};
          color: var(--accent-primary);
        }

        .time-text {
          font-weight: 500;
        }

        .time-basis {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
