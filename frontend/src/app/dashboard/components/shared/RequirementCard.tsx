'use client';

import { Package, ArrowRight } from 'lucide-react';
import { timeAgo } from '../DashboardContext';

export interface RequirementCardProps {
  requirement: {
    id: string;
    productDescription?: string;
    quantity: number | string;
    unit: string;
    targetPrice: string;
    status: string;
    submittedAt: string;
  };
  variant: 'card' | 'table-row';
  onViewDetails?: () => void;
}

const statusColors: Record<string, string> = {
  'Pending': '#f59e0b',
  'In Review': '#3b82f6',
  'Sourcing': '#8b5cf6',
  'Completed': '#10b981'
};

export function RequirementCard({ requirement: req, variant, onViewDetails }: RequirementCardProps) {
  const color = statusColors[req.status] || '#64748b';

  if (variant === 'card') {
    // Mobile card variant
    return (
      <div className="mobile-req-card">
        <div className="req-header">
          <span
            className="status-badge"
            style={{ color, backgroundColor: `${color}15` }}
          >
            {req.status}
          </span>
          <span className="req-time">{timeAgo(req.submittedAt)}</span>
        </div>
        <h4 className="req-product">
          {req.productDescription?.substring(0, 50) || 'No description'}
          {(req.productDescription?.length || 0) > 50 ? '...' : ''}
        </h4>
        <div className="req-details">
          <span className="req-qty">{req.quantity} {req.unit}</span>
          <span className="req-price">{req.targetPrice}</span>
        </div>

        <style jsx>{`
          .mobile-req-card {
            display: flex;
            flex-direction: column;
            padding: 16px;
            background: var(--bg-secondary);
            border-radius: 14px;
            border: 1px solid var(--border-color);
            gap: 8px;
          }

          .req-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .status-badge {
            font-size: 0.7rem;
            font-weight: 600;
            padding: 4px 10px;
            border-radius: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .req-time {
            font-size: 0.7rem;
            color: var(--text-tertiary);
          }

          .req-product {
            font-size: 0.9rem;
            font-weight: 500;
            color: var(--text-primary);
            margin: 0;
            line-height: 1.4;
          }

          .req-details {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .req-qty {
            font-size: 0.8rem;
            color: var(--text-secondary);
          }

          .req-price {
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--text-primary);
          }
        `}</style>
      </div>
    );
  }

  // Web table row variant
  return (
    <div className="table-row">
      <div className="td-cell">
        <div className="product-info">
          <Package size={24} className="product-icon" />
          <span>{req.productDescription ? req.productDescription.substring(0, 50) + '...' : 'N/A'}</span>
        </div>
      </div>
      <div className="td-cell">{req.quantity} {req.unit}</div>
      <div className="td-cell">{req.targetPrice}</div>
      <div className="td-cell">
        <span className={`status-badge status-${req.status.toLowerCase().replace(' ', '-')}`}>
          {req.status}
        </span>
      </div>
      <div className="td-cell">{timeAgo(req.submittedAt)}</div>
      <div className="td-cell">
        <button className="action-link" onClick={onViewDetails}>
          View Details <ArrowRight size={12} />
        </button>
      </div>

      <style jsx>{`
        .table-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #f1f5f9;
          transition: all 0.2s ease;
        }

        .table-row:hover {
          background: #f8fafc;
        }

        .table-row:last-child {
          border-bottom: none;
        }

        .td-cell {
          display: flex;
          align-items: center;
          font-size: 0.875rem;
          color: #334155;
        }

        .product-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        :global(.product-icon) {
          width: 2.5rem;
          height: 2.5rem;
          padding: 0.5rem;
          background: rgba(249, 115, 22, 0.1);
          border-radius: 0.5rem;
          color: var(--accent-primary, #f97316);
          flex-shrink: 0;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .status-pending {
          background: rgba(251, 191, 36, 0.1);
          color: #f59e0b;
        }

        .status-in-review {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
        }

        .status-sourcing {
          background: rgba(139, 92, 246, 0.1);
          color: #8b5cf6;
        }

        .status-completed {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }

        .action-link {
          color: var(--accent-primary, #f97316);
          background: none;
          border: none;
          font-size: 0.875rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0;
        }

        .action-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
