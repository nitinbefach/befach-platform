'use client';

import { CountryBreakdown, HSCodeBreakdown } from '@/types/exim';

interface SummaryTabProps {
  countries: CountryBreakdown[];
  hsCodes: HSCodeBreakdown[];
  totalValue: number;
}

export default function SummaryTab({ countries, hsCodes, totalValue }: SummaryTabProps) {
  const formatValue = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  const maxCountryValue = countries.length > 0 ? countries[0].valueUSD : 1;
  const maxHSValue = hsCodes.length > 0 ? hsCodes[0].valueUSD : 1;

  return (
    <div className="summary-tab">
      {/* Top Countries */}
      <div className="summary-section">
        <h3 className="section-title">Top Countries by Value</h3>
        <div className="bar-chart">
          {countries.slice(0, 8).map(c => (
            <div key={c.country} className="bar-row">
              <div className="bar-label">
                <span className="bar-name">{c.country}</span>
                <span className="bar-meta">{c.shipments} shipments</span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ width: `${(c.valueUSD / maxCountryValue) * 100}%` }}
                />
              </div>
              <div className="bar-value">
                <span className="value-amount">{formatValue(c.valueUSD)}</span>
                <span className="value-pct">{c.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top HS Codes */}
      <div className="summary-section">
        <h3 className="section-title">Top HS Codes by Value</h3>
        <div className="bar-chart">
          {hsCodes.slice(0, 8).map(h => (
            <div key={h.hsnCode} className="bar-row">
              <div className="bar-label">
                <span className="bar-name hs-code">{h.hsnCode}</span>
                <span className="bar-meta">{h.description.substring(0, 40)}...</span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill hs-fill"
                  style={{ width: `${(h.valueUSD / maxHSValue) * 100}%` }}
                />
              </div>
              <div className="bar-value">
                <span className="value-amount">{formatValue(h.valueUSD)}</span>
                <span className="value-pct">{h.shipments} shipments</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .summary-tab {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .summary-section {
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          padding: 20px;
        }
        .section-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 16px 0;
        }
        .bar-chart {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .bar-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .bar-label {
          width: 140px;
          min-width: 140px;
          display: flex;
          flex-direction: column;
        }
        .bar-name {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .bar-name.hs-code {
          color: #f97316;
          font-family: monospace;
        }
        .bar-meta {
          font-size: 0.7rem;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .bar-track {
          flex: 1;
          height: 22px;
          background: var(--bg-secondary, #f1f5f9);
          border-radius: 4px;
          overflow: hidden;
        }
        .bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #f97316, #fb923c);
          border-radius: 4px;
          min-width: 4px;
          transition: width 0.4s ease;
        }
        .bar-fill.hs-fill {
          background: linear-gradient(90deg, #059669, #10b981);
        }
        .bar-value {
          width: 80px;
          min-width: 80px;
          text-align: right;
          display: flex;
          flex-direction: column;
        }
        .value-amount {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .value-pct {
          font-size: 0.7rem;
          color: var(--text-secondary);
        }
        @media (max-width: 1024px) {
          .summary-tab {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 768px) {
          .bar-label {
            width: 100px;
            min-width: 100px;
          }
          .bar-value {
            width: 65px;
            min-width: 65px;
          }
          .summary-section {
            padding: 14px;
          }
        }
      `}</style>
    </div>
  );
}
