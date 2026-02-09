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

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };

  const sizeStyles = {
    sm: {
      fontSize: '0.75rem',
      padding: '2px 8px',
      gap: '4px'
    },
    md: {
      fontSize: '0.85rem',
      padding: '4px 12px',
      gap: '6px'
    },
    lg: {
      fontSize: '0.95rem',
      padding: '6px 16px',
      gap: '6px'
    }
  };

  const currentSizeStyle = sizeStyles[size];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: currentSizeStyle.gap,
        borderRadius: '20px',
        fontWeight: 500,
        whiteSpace: 'nowrap',
        background: config.bgColor,
        color: config.color,
        border: `1px solid ${config.color}20`,
        transition: 'all 0.2s ease',
        fontSize: currentSizeStyle.fontSize,
        padding: currentSizeStyle.padding,
        cursor: clickable ? 'pointer' : 'default',
        ...((clickable && {
          ':hover': {
            transform: 'translateY(-1px)',
            boxShadow: `0 2px 8px ${config.color}30`,
            borderColor: `${config.color}40`
          }
        }) || {})
      }}
      onClick={clickable ? onClick : undefined}
      title={config.description}
      onMouseEnter={clickable ? (e) => {
        const target = e.currentTarget;
        target.style.transform = 'translateY(-1px)';
        target.style.boxShadow = `0 2px 8px ${config.color}30`;
        target.style.borderColor = `${config.color}40`;
      } : undefined}
      onMouseLeave={clickable ? (e) => {
        const target = e.currentTarget;
        target.style.transform = 'translateY(0)';
        target.style.boxShadow = 'none';
        target.style.borderColor = `${config.color}20`;
      } : undefined}
    >
      {showIcon && (
        <span style={{ fontSize: '0.9em', display: 'inline-flex', alignItems: 'center' }}>
          <IconComponent size={iconSizes[size]} />
        </span>
      )}
      <span style={{ textTransform: 'capitalize' }}>{config.label}</span>
    </span>
  );
}

// Stage indicator for kanban cards - smaller, icon-only variant
export function StageIndicator({ stage }: { stage: RelationshipStage }) {
  const config = RELATIONSHIP_STAGE_CONFIG[stage];
  const IconComponent = config.icon;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        background: config.bgColor,
        fontSize: '14px'
      }}
      title={config.label}
    >
      <IconComponent size={14} />
    </span>
  );
}

export default RelationshipStageBadge;