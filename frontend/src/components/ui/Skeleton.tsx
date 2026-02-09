'use client';

/**
 * Skeleton Component Library
 *
 * Provides loading skeleton placeholders with shimmer animation
 * for better perceived performance during data loading.
 */

import { ReactNode, CSSProperties } from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  /** Width of the skeleton */
  width?: string | number;
  /** Height of the skeleton */
  height?: string | number;
  /** Border radius */
  borderRadius?: string | number;
  /** Additional class name */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
  /** Animation variant */
  variant?: 'shimmer' | 'pulse';
}

/**
 * Base Skeleton component with shimmer effect
 */
export function Skeleton({
  width = '100%',
  height = '1em',
  borderRadius = '4px',
  className = '',
  style,
  variant = 'shimmer'
}: SkeletonProps) {
  return (
    <div
      className={`skeleton ${variant} ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
        ...style
      }}
    />
  );
}

/**
 * Text skeleton - for loading text content
 */
export function SkeletonText({
  lines = 3,
  className = '',
  lineHeight = '1em',
  gap = '0.75em'
}: {
  lines?: number;
  className?: string;
  lineHeight?: string;
  gap?: string;
}) {
  return (
    <div className={`skeleton-text-group ${className}`} style={{ display: 'flex', flexDirection: 'column', gap }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={lineHeight}
          width={i === lines - 1 ? '70%' : '100%'}
        />
      ))}
    </div>
  );
}

/**
 * Avatar skeleton - circular placeholder
 */
export function SkeletonAvatar({
  size = 40,
  className = ''
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Skeleton
      width={size}
      height={size}
      borderRadius="50%"
      className={className}
    />
  );
}

/**
 * Card skeleton - full card placeholder
 */
export function SkeletonCard({
  className = '',
  showImage = true,
  showAvatar = false,
  lines = 2
}: {
  className?: string;
  showImage?: boolean;
  showAvatar?: boolean;
  lines?: number;
}) {
  return (
    <div className={`skeleton-card ${className}`}>
      {showImage && (
        <Skeleton height={160} borderRadius="8px 8px 0 0" className="skeleton-card-image" />
      )}
      <div className="skeleton-card-body">
        {showAvatar && (
          <div className="skeleton-card-header">
            <SkeletonAvatar size={36} />
            <div style={{ flex: 1 }}>
              <Skeleton width="60%" height="0.9em" style={{ marginBottom: '8px' }} />
              <Skeleton width="40%" height="0.75em" />
            </div>
          </div>
        )}
        <Skeleton width="80%" height="1.1em" style={{ marginBottom: '12px' }} />
        <SkeletonText lines={lines} lineHeight="0.85em" gap="8px" />
      </div>

      <style jsx>{`
        .skeleton-card {
          background: var(--bg-secondary);
          border-radius: 12px;
          border: 1px solid var(--border-color);
          overflow: hidden;
        }
        .skeleton-card-body {
          padding: 16px;
        }
        .skeleton-card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }
      `}</style>
    </div>
  );
}

/**
 * Table skeleton - for loading data tables
 */
export function SkeletonTable({
  rows = 5,
  columns = 4,
  className = ''
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div className={`skeleton-table ${className}`}>
      {/* Header */}
      <div className="skeleton-table-header">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} height="1em" width={`${60 + Math.random() * 30}%`} />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="skeleton-table-row">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              height="0.9em"
              width={`${50 + Math.random() * 40}%`}
            />
          ))}
        </div>
      ))}

      <style jsx>{`
        .skeleton-table {
          background: var(--bg-secondary);
          border-radius: 12px;
          border: 1px solid var(--border-color);
          overflow: hidden;
        }
        .skeleton-table-header {
          display: grid;
          grid-template-columns: repeat(${columns}, 1fr);
          gap: 16px;
          padding: 16px;
          background: var(--bg-tertiary);
          border-bottom: 1px solid var(--border-color);
        }
        .skeleton-table-row {
          display: grid;
          grid-template-columns: repeat(${columns}, 1fr);
          gap: 16px;
          padding: 14px 16px;
          border-bottom: 1px solid var(--border-color);
        }
        .skeleton-table-row:last-child {
          border-bottom: none;
        }
      `}</style>
    </div>
  );
}

/**
 * Stats skeleton - for dashboard stat cards
 */
export function SkeletonStats({
  count = 4,
  className = ''
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={`skeleton-stats ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-stat-card">
          <div className="skeleton-stat-header">
            <Skeleton width="60%" height="0.85em" />
            <Skeleton width={44} height={44} borderRadius="10px" />
          </div>
          <Skeleton width="50%" height="2rem" style={{ marginTop: '8px' }} />
          <Skeleton width="40%" height="0.8em" style={{ marginTop: '8px' }} />
        </div>
      ))}

      <style jsx>{`
        .skeleton-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
        }
        .skeleton-stat-card {
          background: var(--bg-secondary);
          border-radius: 14px;
          border: 1px solid var(--border-color);
          padding: 22px;
        }
        .skeleton-stat-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        @media (max-width: 768px) {
          .skeleton-stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * List skeleton - for loading lists
 */
export function SkeletonList({
  items = 5,
  showAvatar = true,
  className = ''
}: {
  items?: number;
  showAvatar?: boolean;
  className?: string;
}) {
  return (
    <div className={`skeleton-list ${className}`}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="skeleton-list-item">
          {showAvatar && <SkeletonAvatar size={40} />}
          <div className="skeleton-list-content">
            <Skeleton width={`${60 + Math.random() * 30}%`} height="0.95em" />
            <Skeleton width={`${40 + Math.random() * 30}%`} height="0.8em" style={{ marginTop: '8px' }} />
          </div>
        </div>
      ))}

      <style jsx>{`
        .skeleton-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .skeleton-list-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: var(--bg-secondary);
          border-radius: 8px;
        }
        .skeleton-list-content {
          flex: 1;
        }
      `}</style>
    </div>
  );
}

/**
 * Form skeleton - for loading forms
 */
export function SkeletonForm({
  fields = 4,
  className = ''
}: {
  fields?: number;
  className?: string;
}) {
  return (
    <div className={`skeleton-form ${className}`}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="skeleton-form-field">
          <Skeleton width="30%" height="0.85em" style={{ marginBottom: '8px' }} />
          <Skeleton height={44} borderRadius="8px" />
        </div>
      ))}
      <div className="skeleton-form-actions">
        <Skeleton width={120} height={44} borderRadius="8px" />
        <Skeleton width={120} height={44} borderRadius="8px" />
      </div>

      <style jsx>{`
        .skeleton-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .skeleton-form-field {
          display: flex;
          flex-direction: column;
        }
        .skeleton-form-actions {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }
      `}</style>
    </div>
  );
}

/**
 * Page skeleton - full page loading state
 */
export function SkeletonPage({
  className = ''
}: {
  className?: string;
}) {
  return (
    <div className={`skeleton-page ${className}`}>
      {/* Header */}
      <div className="skeleton-page-header">
        <Skeleton width="40%" height="1.75rem" />
        <Skeleton width="60%" height="1rem" style={{ marginTop: '8px' }} />
      </div>

      {/* Stats */}
      <SkeletonStats count={4} />

      {/* Content */}
      <div className="skeleton-page-content">
        <SkeletonCard showImage={false} lines={3} />
        <SkeletonCard showImage={false} lines={3} />
      </div>

      <style jsx>{`
        .skeleton-page {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }
        .skeleton-page-header {
          margin-bottom: 8px;
        }
        .skeleton-page-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }
      `}</style>
    </div>
  );
}

/**
 * Animated skeleton wrapper with pulse effect
 */
export function SkeletonPulse({
  children,
  className = ''
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}

export default Skeleton;
