'use client';

import { RequirementStatus, STATUS_CONFIG } from '@/lib/requirements';

interface StatusBadgeProps {
  status: RequirementStatus;
  showDescription?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

// Fallback config for unknown statuses
const DEFAULT_CONFIG = {
  label: 'Unknown',
  description: 'Status unknown',
  color: '#6B7280',
  bgColor: 'rgba(107, 114, 128, 0.1)',
};

export default function StatusBadge({
  status,
  showDescription = false,
  size = 'md',
  animated = true,
}: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || DEFAULT_CONFIG;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  const isAnimated = animated && (status === 'matching' || status === 'negotiating');

  return (
    <div className="status-badge-wrapper">
      <span
        className={`status-badge ${sizeClasses[size]}`}
        style={{
          backgroundColor: config.bgColor,
          color: config.color,
        }}
      >
        {isAnimated && <span className="pulse-dot" style={{ backgroundColor: config.color }} />}
        {config.label}
      </span>
      {showDescription && (
        <p className="status-description">{config.description}</p>
      )}

      <style jsx>{`
        .status-badge-wrapper {
          display: inline-flex;
          flex-direction: column;
          gap: 4px;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-weight: 500;
          border-radius: 20px;
          white-space: nowrap;
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.2);
          }
        }

        .status-description {
          color: var(--text-secondary);
          font-size: 0.8rem;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
