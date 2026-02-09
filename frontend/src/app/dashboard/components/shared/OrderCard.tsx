'use client';

import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';

export interface OrderCardProps {
  order: {
    id: string;
    product: string;
    supplier: string;
    value: string;
    status: string;
    statusColor: string;
    eta: string;
  };
  variant: 'card' | 'row';
  href?: string;
}

export function OrderCard({ order, variant, href = '/track-shipment' }: OrderCardProps) {
  if (variant === 'card') {
    return (
      <Link href={href} className="mobile-order-card">
        <div className="order-top">
          <span className="order-id">{order.id}</span>
          <span className="order-value">{order.value}</span>
        </div>
        <h4 className="order-product">{order.product}</h4>
        <p className="order-supplier">{order.supplier}</p>
        <div className="order-bottom">
          <span
            className="order-status"
            style={{ color: order.statusColor, backgroundColor: `${order.statusColor}15` }}
          >
            {order.status}
          </span>
          <span className="order-eta">
            <Clock size={14} />
            ETA: {order.eta}
          </span>
        </div>

        <style jsx>{`
          .mobile-order-card {
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

          .mobile-order-card:hover {
            border-color: var(--border-hover);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          }

          .order-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .order-id {
            font-size: 0.75rem;
            font-weight: 500;
            color: var(--text-secondary);
          }

          .order-value {
            font-size: 0.875rem;
            font-weight: 700;
            color: var(--text-primary);
          }

          .order-product {
            font-size: 1rem;
            font-weight: 600;
            color: var(--text-primary);
            margin: 0;
          }

          .order-supplier {
            font-size: 0.8rem;
            color: var(--text-secondary);
            margin: 0;
          }

          .order-bottom {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 4px;
          }

          .order-status {
            font-size: 0.75rem;
            font-weight: 600;
            padding: 4px 10px;
            border-radius: 8px;
          }

          .order-eta {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 0.75rem;
            color: var(--text-secondary);
          }
        `}</style>
      </Link>
    );
  }

  // Web row variant
  return (
    <div className="order-item">
      <div className="order-header">
        <span className="order-id">{order.id}</span>
        <span className="order-value">{order.value}</span>
      </div>
      <div className="order-product">{order.product}</div>
      <div className="order-supplier">Supplier: {order.supplier}</div>
      <div className="order-footer">
        <span className="order-status" style={{ color: order.statusColor }}>
          {order.status}
        </span>
        <span className="order-eta">ETA: {order.eta}</span>
      </div>
      <Link href={href} className="order-track">
        Track <ArrowRight size={12} />
      </Link>

      <style jsx>{`
        .order-item {
          padding: 1.25rem;
          background: #f8fafc;
          border-radius: 12px;
          position: relative;
          border: 1px solid #f1f5f9;
          transition: all 0.2s ease;
        }

        .order-item:hover {
          background: #f1f5f9;
          border-color: #e2e8f0;
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .order-id {
          font-size: 0.75rem;
          color: #64748b;
          font-family: monospace;
          background: #e2e8f0;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }

        .order-value {
          font-weight: 700;
          color: #0f172a;
          font-size: 1rem;
        }

        .order-product {
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: #1e293b;
        }

        .order-supplier {
          font-size: 0.875rem;
          color: #64748b;
          margin-bottom: 0.75rem;
        }

        .order-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .order-status {
          font-size: 0.8rem;
          font-weight: 600;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          background: rgba(245, 158, 11, 0.1);
        }

        .order-eta {
          font-size: 0.75rem;
          color: #64748b;
        }

        .order-track {
          position: absolute;
          right: 1rem;
          bottom: 1rem;
          color: #f97316;
          text-decoration: none;
          font-size: 0.8rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.375rem 0.75rem;
          background: rgba(249, 115, 22, 0.08);
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .order-track:hover {
          background: rgba(249, 115, 22, 0.15);
        }
      `}</style>
    </div>
  );
}
