'use client';

import Link from 'next/link';
import { Calculator, Package } from 'lucide-react';
import { CalculationRecord } from '@/types/calculator';

export interface CalculationCardProps {
  calculation: CalculationRecord;
  variant: 'mobile' | 'web';
}

export function CalculationCard({ calculation, variant }: CalculationCardProps) {
  const calc = calculation;

  if (variant === 'mobile') {
    return (
      <Link href={`/cost-calculator/results/${calc.id}`} className="mobile-calc-card">
        <div className="calc-top">
          <Calculator size={18} className="calc-icon" />
          <span className="calc-date">{new Date(calc.metadata?.calculatedAt || '').toLocaleDateString()}</span>
        </div>
        <h4 className="calc-product">{calc.input?.productName || 'N/A'}</h4>
        <div className="calc-stats">
          <span className="calc-stat">
            <strong>{calc.input?.quantity || '—'}</strong> units
          </span>
          <span className="calc-stat total">
            <strong>{calc.result?.totalLandedCost ? `₹${calc.result.totalLandedCost.toLocaleString()}` : '—'}</strong>
          </span>
        </div>

        <style jsx>{`
          .mobile-calc-card {
            display: flex;
            flex-direction: column;
            padding: 16px;
            background: var(--bg-secondary);
            border-radius: 14px;
            border: 1px solid var(--border-color);
            text-decoration: none;
            gap: 8px;
            transition: all 0.2s ease;
          }

          .mobile-calc-card:hover {
            border-color: var(--border-hover);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          }

          .calc-top {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          :global(.calc-icon) {
            color: #8b5cf6;
          }

          .calc-date {
            font-size: 0.75rem;
            color: var(--text-secondary);
          }

          .calc-product {
            font-size: 0.95rem;
            font-weight: 600;
            color: var(--text-primary);
            margin: 0;
          }

          .calc-stats {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .calc-stat {
            font-size: 0.8rem;
            color: var(--text-secondary);
          }

          .calc-stat strong {
            color: var(--text-primary);
          }

          .calc-stat.total strong {
            color: #10b981;
            font-size: 1rem;
          }
        `}</style>
      </Link>
    );
  }

  // Web variant
  return (
    <Link
      href={`/cost-calculator/results/${calc.id}`}
      className="calculation-card"
    >
      <div className="calc-header">
        <Package size={20} className="calc-icon" />
        <span className="calc-date">{new Date(calc.metadata?.calculatedAt || '').toLocaleDateString()}</span>
      </div>
      <h4 className="calc-product">{calc.input?.productName || 'N/A'}</h4>
      <div className="calc-detail">
        <span className="detail-label">HSN:</span>
        <span className="detail-value">{calc.input?.hsnCode || 'N/A'}</span>
      </div>
      <div className="calc-detail">
        <span className="detail-label">Route:</span>
        <span className="detail-value">
          {calc.input?.originPort || 'N/A'} → {calc.input?.destinationPort || 'India'}
        </span>
      </div>
      <div className="calc-detail">
        <span className="detail-label">FOB:</span>
        <span className="detail-value">
          {calc.input?.currency || 'USD'} {calc.input?.fobValue || '0'}
        </span>
      </div>
      <div className="calc-footer">
        <div className="calc-total">
          <span className="total-label">Total Cost:</span>
          <span className="total-value">₹{calc.result?.totalLandedCost?.toLocaleString() || '0'}</span>
        </div>
        {calc.result?.customsDuty && (
          <div className="calc-savings">
            Duty: ₹{calc.result.customsDuty.toLocaleString()}
          </div>
        )}
      </div>

      <style jsx>{`
        .calculation-card {
          background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
          padding: 1.25rem;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          text-decoration: none;
          color: #1e293b;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
          display: block;
        }

        .calculation-card:hover {
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          transform: translateY(-4px);
          border-color: #cbd5e1;
        }

        .calc-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        :global(.calc-icon) {
          color: var(--accent-primary, #f97316);
        }

        .calc-date {
          font-size: 0.75rem;
          color: var(--text-secondary, #64748b);
        }

        .calc-product {
          font-weight: 500;
          margin-bottom: 0.75rem;
          color: var(--text-primary, #1e293b);
          margin-top: 0;
        }

        .calc-detail {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }

        .detail-label {
          color: var(--text-secondary, #64748b);
        }

        .detail-value {
          color: var(--text-primary, #1e293b);
          font-weight: 500;
        }

        .calc-footer {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color, #e2e8f0);
        }

        .calc-total {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .total-label {
          font-size: 0.875rem;
          color: var(--text-secondary, #64748b);
        }

        .total-value {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--accent-primary, #f97316);
        }

        .calc-savings {
          font-size: 0.75rem;
          color: #10b981;
        }
      `}</style>
    </Link>
  );
}
