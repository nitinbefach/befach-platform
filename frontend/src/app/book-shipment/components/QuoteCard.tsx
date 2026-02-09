'use client';

import { useState } from 'react';
import { BookingQuote } from '@/types/booking';
import { formatCurrency } from '@/lib/bookingConstants';
import { ChevronDown, ChevronUp, Check, Star, Clock } from 'lucide-react';

interface QuoteCardProps {
  quote: BookingQuote;
  selected: boolean;
  onSelect: () => void;
  currency?: string;
  bestValue?: boolean;
}

export default function QuoteCard({ quote, selected, onSelect, bestValue }: QuoteCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`quote-card ${selected ? 'selected' : ''} ${bestValue ? 'best-value' : ''}`}
      onClick={onSelect}
    >
      {bestValue && <div className="best-badge">Best Value</div>}

      <div className="quote-header">
        <div className="carrier-info">
          <span className="carrier-logo">{quote.logo}</span>
          <div>
            <h4 className="carrier-name">{quote.carrier}</h4>
            <span className="service-type">{quote.serviceType}</span>
          </div>
        </div>
        <div className="quote-price">
          <span className="price">{formatCurrency(quote.price, quote.currency)}</span>
          <span className="price-label">Total</span>
        </div>
      </div>

      <div className="quote-details">
        <div className="detail-item">
          <Clock size={14} />
          <span>{quote.transitDays} {quote.transitDays === 1 ? 'day' : 'days'}</span>
        </div>
        <div className="detail-item">
          <Star size={14} />
          <span>{quote.rating}</span>
        </div>
        <div className="detail-item valid-until">
          Valid until {quote.validUntil}
        </div>
      </div>

      <div className="quote-actions">
        <button
          className="expand-btn"
          onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
        >
          Price Breakdown {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        <button className={`select-btn ${selected ? 'selected' : ''}`} onClick={onSelect}>
          {selected ? <><Check size={14} /> Selected</> : 'Select'}
        </button>
      </div>

      {expanded && (
        <div className="breakdown">
          <div className="breakdown-row">
            <span>Base Rate</span>
            <span>{formatCurrency(quote.breakdown.base, quote.currency)}</span>
          </div>
          <div className="breakdown-row">
            <span>Fuel Surcharge</span>
            <span>{formatCurrency(quote.breakdown.fuel, quote.currency)}</span>
          </div>
          {quote.breakdown.port > 0 && (
            <div className="breakdown-row">
              <span>Port Charges</span>
              <span>{formatCurrency(quote.breakdown.port, quote.currency)}</span>
            </div>
          )}
          <div className="breakdown-row">
            <span>Handling</span>
            <span>{formatCurrency(quote.breakdown.handling, quote.currency)}</span>
          </div>
          <div className="breakdown-row total">
            <span>Total</span>
            <span>{formatCurrency(quote.price, quote.currency)}</span>
          </div>
        </div>
      )}

      <style jsx>{`
        .quote-card {
          background: var(--bg-secondary, #fff);
          border: 2px solid var(--border-color, #e5e7eb);
          border-radius: 12px;
          padding: 18px;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }
        .quote-card:hover {
          border-color: var(--accent-primary, #f97316);
          box-shadow: 0 4px 16px rgba(249, 115, 22, 0.1);
          transform: translateY(-2px);
        }
        .quote-card.selected {
          border-color: var(--accent-primary, #f97316);
          background: rgba(249, 115, 22, 0.04);
        }
        .best-badge {
          position: absolute;
          top: -1px;
          right: 16px;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          font-size: 0.7rem;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 0 0 8px 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .quote-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 14px;
        }
        .carrier-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .carrier-logo {
          font-size: 1.6rem;
        }
        .carrier-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary, #1f2937);
          margin: 0;
        }
        .service-type {
          font-size: 0.75rem;
          color: var(--text-secondary, #6b7280);
          background: var(--bg-tertiary, #f3f4f6);
          padding: 2px 8px;
          border-radius: 4px;
        }
        .quote-price {
          text-align: right;
        }
        .price {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary, #1f2937);
          display: block;
        }
        .price-label {
          font-size: 0.7rem;
          color: var(--text-muted, #9ca3af);
          text-transform: uppercase;
        }
        .quote-details {
          display: flex;
          gap: 16px;
          margin-bottom: 14px;
          flex-wrap: wrap;
        }
        .detail-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.82rem;
          color: var(--text-secondary, #6b7280);
        }
        .valid-until {
          margin-left: auto;
          font-size: 0.75rem;
          color: var(--text-muted, #9ca3af);
        }
        .quote-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .expand-btn {
          background: none;
          border: none;
          color: var(--text-secondary, #6b7280);
          font-size: 0.8rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 0;
        }
        .expand-btn:hover {
          color: var(--text-primary, #1f2937);
        }
        .select-btn {
          padding: 8px 20px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
          border: 2px solid var(--accent-primary, #f97316);
          background: transparent;
          color: var(--accent-primary, #f97316);
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .select-btn:hover {
          background: var(--accent-primary, #f97316);
          color: white;
        }
        .select-btn.selected {
          background: var(--accent-primary, #f97316);
          color: white;
        }
        .breakdown {
          margin-top: 14px;
          padding-top: 14px;
          border-top: 1px solid var(--border-color, #e5e7eb);
        }
        .breakdown-row {
          display: flex;
          justify-content: space-between;
          padding: 5px 0;
          font-size: 0.83rem;
          color: var(--text-secondary, #6b7280);
        }
        .breakdown-row.total {
          border-top: 1px solid var(--border-color, #e5e7eb);
          margin-top: 6px;
          padding-top: 8px;
          font-weight: 600;
          color: var(--text-primary, #1f2937);
        }

        @media (max-width: 768px) {
          .quote-card { padding: 14px; }
          .carrier-logo { font-size: 1.3rem; }
          .price { font-size: 1.1rem; }
          .quote-details { gap: 10px; }
          .valid-until { margin-left: 0; }
          .select-btn { padding: 12px 24px; min-height: 44px; font-size: 0.88rem; }
          .expand-btn { padding: 10px 8px; min-height: 40px; }
          .breakdown-row { font-size: 0.85rem; padding: 6px 0; }
        }
        @media (max-width: 480px) {
          .quote-header { flex-direction: column; gap: 10px; }
          .quote-price { text-align: left; }
          .quote-actions { flex-direction: column; gap: 8px; align-items: stretch; }
          .select-btn { justify-content: center; width: 100%; }
          .expand-btn { justify-content: center; }
          .carrier-name { font-size: 0.88rem; }
        }
      `}</style>
    </div>
  );
}
