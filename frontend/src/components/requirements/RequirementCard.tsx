'use client';

import { Requirement, formatRelativeTime, STATUS_CONFIG } from '@/lib/requirements';
import StatusBadge from './StatusBadge';
import EstimatedTime from './EstimatedTime';

interface RequirementCardProps {
  requirement: Requirement;
  onViewDetails: () => void;
  onCancel?: () => void;
  isNew?: boolean;
}

export default function RequirementCard({
  requirement,
  onViewDetails,
  onCancel,
  isNew = false,
}: RequirementCardProps) {
  // Safety checks for potentially missing data (handles legacy localStorage data)
  const products = requirement.products || [];
  const primaryProduct = products[0];
  const productCount = products.length;
  const supplierMatches = requirement.supplierMatches || [];
  const statusConfig = STATUS_CONFIG[requirement.status];
  const canCancel = statusConfig?.canCancel ?? false;

  // Calculate best quote if available
  const bestQuote = supplierMatches
    .filter(m => m.quotedPrice)
    .sort((a, b) => (a.quotedPrice || 0) - (b.quotedPrice || 0))[0];

  const targetPrice = parseFloat(primaryProduct?.targetPrice || '0');
  const savingsPercent = bestQuote && targetPrice > 0
    ? Math.round(((targetPrice - (bestQuote.quotedPrice || 0)) / targetPrice) * 100)
    : null;

  return (
    <div className={`requirement-card ${isNew ? 'is-new' : ''}`} onClick={onViewDetails}>
      <div className="card-header">
        <div className="title-section">
          {isNew && <span className="new-badge">NEW</span>}
          <h3 className="title">{requirement.title}</h3>
          <span className="req-id">{requirement.id}</span>
        </div>
        <StatusBadge status={requirement.status} />
      </div>

      <div className="card-body">
        {/* Status Progress Bar */}
        <div className="progress-section">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: getProgressWidth(requirement.status),
                background: statusConfig?.color || '#8B5CF6',
              }}
            />
          </div>
          {requirement.estimatedTime && (
            <EstimatedTime estimatedTime={requirement.estimatedTime} size="sm" />
          )}
        </div>

        {/* Product Info */}
        <div className="product-info">
          <div className="info-item">
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
            </svg>
            <span>
              {primaryProduct?.name}
              {productCount > 1 && <span className="more">+{productCount - 1} more</span>}
            </span>
          </div>
          <div className="info-item">
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="3" width="15" height="13"/>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
              <circle cx="5.5" cy="18.5" r="2.5"/>
              <circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
            <span>{primaryProduct?.quantity} {primaryProduct?.unit}</span>
          </div>
          {targetPrice > 0 && (
            <div className="info-item">
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
              </svg>
              <span>${targetPrice.toFixed(2)}/{primaryProduct?.unit}</span>
            </div>
          )}
        </div>

        {/* Supplier Matches */}
        <div className="matches-section">
          <div className="matches-info">
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87"/>
              <path d="M16 3.13a4 4 0 010 7.75"/>
            </svg>
            <span>{requirement.matchCount ?? 0} suppliers matched</span>
            {(requirement.quotesReceived ?? 0) > 0 && (
              <span className="quotes-count">({requirement.quotesReceived} quoted)</span>
            )}
          </div>
          {bestQuote && savingsPercent !== null && savingsPercent > 0 && (
            <div className="best-quote">
              <span className="savings">-{savingsPercent}%</span>
              <span>Best: ${bestQuote.quotedPrice?.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="card-footer">
        <span className="timestamp">{formatRelativeTime(requirement.submittedAt)}</span>
        <div className="actions">
          <button className="btn-view" onClick={(e) => { e.stopPropagation(); onViewDetails(); }}>
            View Details
          </button>
          {canCancel && onCancel && (
            <button className="btn-cancel" onClick={(e) => { e.stopPropagation(); onCancel(); }}>
              Cancel
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .requirement-card {
          background: var(--card-bg);
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid var(--border-color);
        }

        .requirement-card:hover {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .requirement-card.is-new {
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .title-section {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .new-badge {
          background: var(--accent-primary);
          color: white;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .title {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .req-id {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-family: monospace;
        }

        .card-body {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .progress-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .progress-bar {
          flex: 1;
          height: 6px;
          background: var(--bg-tertiary);
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.5s ease;
        }

        .product-info {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .info-item .icon {
          width: 16px;
          height: 16px;
          color: var(--text-muted);
        }

        .info-item .more {
          color: var(--text-muted);
          margin-left: 4px;
        }

        .matches-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 12px;
          border-top: 1px solid var(--border-color);
        }

        .matches-info {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-secondary);
          font-size: 0.85rem;
        }

        .matches-info .icon {
          width: 16px;
          height: 16px;
          color: #8B5CF6;
        }

        .quotes-count {
          color: #10B981;
          font-weight: 500;
        }

        .best-quote {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
        }

        .savings {
          background: rgba(16, 185, 129, 0.1);
          color: #10B981;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 600;
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 16px;
          padding-top: 12px;
          border-top: 1px solid var(--border-color);
        }

        .timestamp {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .actions {
          display: flex;
          gap: 8px;
        }

        .btn-view {
          padding: 6px 14px;
          background: var(--accent-gradient);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-view:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(249, 115, 22, 0.3);
        }

        .btn-cancel {
          padding: 6px 14px;
          background: transparent;
          color: var(--text-secondary);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-cancel:hover {
          border-color: #ef4444;
          color: #ef4444;
        }

        @media (max-width: 768px) {
          .product-info {
            flex-direction: column;
            gap: 8px;
          }

          .matches-section {
            flex-direction: column;
            gap: 8px;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}

function getProgressWidth(status: string): string {
  switch (status) {
    case 'matching': return '25%';
    case 'quoted': return '50%';
    case 'negotiating': return '75%';
    case 'completed': return '100%';
    case 'cancelled': return '0%';
    default: return '0%';
  }
}
