'use client';

import { RelationshipStage, RELATIONSHIP_STAGE_CONFIG } from '@/lib/savedSuppliers';

interface RelationshipStageBadgeProps {
  stage: RelationshipStage;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  onClick?: () => void;
  clickable?: boolean;
}

export function RelationshipStageBadge({
  stage,
  size = 'md',
  showIcon = true,
  onClick,
  clickable = false
}: RelationshipStageBadgeProps) {
  const config = RELATIONSHIP_STAGE_CONFIG[stage];
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };

  return (
    <>
      <span
        className={`stage-badge ${size} ${clickable ? 'clickable' : ''}`}
        onClick={clickable ? onClick : undefined}
        title={config.description}
      >
        {showIcon && <span className="badge-icon"><IconComponent size={iconSizes[size]} /></span>}
        <span className="badge-label">{config.label}</span>
      </span>

      <style jsx>{`
        .stage-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border-radius: 20px;
          font-weight: 500;
          white-space: nowrap;
          background: ${config.bgColor};
          color: ${config.color};
          border: 1px solid ${config.color}20;
          transition: all 0.2s ease;
        }

        .stage-badge.sm {
          font-size: 0.75rem;
          padding: 2px 8px;
          gap: 4px;
        }

        .stage-badge.md {
          font-size: 0.85rem;
          padding: 4px 12px;
        }

        .stage-badge.lg {
          font-size: 0.95rem;
          padding: 6px 16px;
        }

        .stage-badge.clickable {
          cursor: pointer;
        }

        .stage-badge.clickable:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px ${config.color}30;
          border-color: ${config.color}40;
        }

        .badge-icon {
          font-size: 0.9em;
        }

        .badge-label {
          text-transform: capitalize;
        }
      `}</style>
    </>
  );
}

// Stage indicator for kanban cards - smaller, icon-only variant
export function StageIndicator({ stage }: { stage: RelationshipStage }) {
  const config = RELATIONSHIP_STAGE_CONFIG[stage];

  return (
    <>
      <span className="stage-indicator" title={config.label}>
        {config.icon}
      </span>

      <style jsx>{`
        .stage-indicator {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: ${config.bgColor};
          font-size: 14px;
        }
      `}</style>
    </>
  );
}

export default RelationshipStageBadge;
